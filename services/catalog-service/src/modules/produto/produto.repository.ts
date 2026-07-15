/**
 * Repositório de Produtos (COMPLETO com multi-tenancy).
 *
 * Todas as queries incluem filtro por tenantId para
 * garantir isolamento total entre empresas.
 */

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CriarProdutoDto } from '../../dtos/produto/criar-produto.dto';
import { AtualizarProdutoDto } from '../../dtos/produto/atualizar-produto.dto';
import { ListarProdutosDto } from '../../dtos/produto/listar-produtos.dto';

/**
 * Mapeia uma imagem do DTO para os campos do modelo `ImagemProduto`.
 * Sem `id` definido → o índice `i` define ordem (0 = capa) e `principal` default.
 */
function mapearImagem(
  img: {
    url: string;
    urlMiniatura?: string;
    principal?: boolean;
    ordem?: number;
    textoAlternativo?: string;
  },
  i: number,
) {
  return {
    url: img.url,
    urlMiniatura: img.urlMiniatura ?? null,
    altText: img.textoAlternativo ?? null,
    ordem: img.ordem ?? i,
    principal: img.principal ?? i === 0,
  };
}

@Injectable()
export class ProdutoRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Cria produto vinculado ao tenant (com galeria de imagens opcional). */
  async criar(tenantId: string, dto: CriarProdutoDto) {
    // `imagens` é relação — não pode ir como escalar no `data`. Extrai e cria aninhado.
    const { imagens, ...escalares } = dto as any;
    return this.prisma.produto.create({
      data: {
        ...escalares,
        tenantId,
        ...(Array.isArray(imagens) && imagens.length
          ? { imagens: { create: imagens.map((img: any, i: number) => mapearImagem(img, i)) } }
          : {}),
      },
      include: {
        categoria: true,
        marca: true,
        imagens: { orderBy: { ordem: 'asc' } },
      },
    });
  }

  /**
   * Substitui a galeria de imagens do produto (remove todas e recria).
   * `imagens` vazio limpa a galeria. A 1ª imagem (ordem 0) é a capa/principal.
   */
  async substituirImagens(
    tenantId: string,
    produtoId: string,
    imagens: Array<{
      url: string;
      urlMiniatura?: string;
      principal?: boolean;
      ordem?: number;
      textoAlternativo?: string;
    }>,
  ) {
    // Garante que o produto pertence ao tenant antes de mexer nas imagens.
    const produto = await this.prisma.produto.findFirst({
      where: { id: produtoId, tenantId },
      select: { id: true },
    });
    if (!produto) return;

    await this.prisma.$transaction([
      this.prisma.imagemProduto.deleteMany({ where: { produtoId } }),
      ...(imagens.length
        ? [
            this.prisma.imagemProduto.createMany({
              data: imagens.map((img, i) => ({ produtoId, ...mapearImagem(img, i) })),
            }),
          ]
        : []),
    ]);
  }

  /** Lista produtos do tenant com paginação e filtros */
  async listar(tenantId: string, filtros: ListarProdutosDto) {
    const { pagina = 1, itensPorPagina = 20, busca, status, categoriaId } = filtros;
    const skip = (pagina - 1) * itensPorPagina;

    const where: any = { tenantId };

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { sku: { contains: busca, mode: 'insensitive' } },
        { gtin: { contains: busca } },
      ];
    }

    if (status) where.status = status;
    if (categoriaId) where.categoriaId = categoriaId;

    const [dados, total] = await Promise.all([
      this.prisma.produto.findMany({
        where,
        skip,
        take: itensPorPagina,
        include: {
          categoria: true,
          marca: true,
          imagens: { where: { principal: true }, take: 1 },
        },
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.produto.count({ where }),
    ]);

    // Envelope paginado canônico: { dados, total, pagina, limite, totalPaginas }
    return {
      dados,
      total,
      pagina,
      limite: itensPorPagina,
      totalPaginas: Math.ceil(total / itensPorPagina),
    };
  }

  /** Busca produto por ID dentro do tenant */
  async buscarPorId(tenantId: string, id: string) {
    return this.prisma.produto.findFirst({
      where: { id, tenantId },
      include: {
        categoria: true,
        marca: true,
        imagens: { orderBy: { ordem: 'asc' } },
        variacoes: {
          include: {
            atributos: true,
            imagens: true,
          },
        },
      },
    });
  }

  /** Busca produto por SKU dentro do tenant (verificação de unicidade) */
  async buscarPorSku(tenantId: string, sku: string) {
    return this.prisma.produto.findFirst({
      where: { tenantId, sku },
    });
  }

  /** Busca múltiplos produtos por IDs */
  async buscarPorIds(tenantId: string, ids: string[]) {
    return this.prisma.produto.findMany({
      where: { tenantId, id: { in: ids } },
      include: {
        categoria: true,
        imagens: { where: { principal: true }, take: 1 },
      },
    });
  }

  /** Atualiza produto do tenant */
  async atualizar(tenantId: string, id: string, dto: AtualizarProdutoDto) {
    // `variacoes`/`imagens` (relações) são persistidas à parte pelo service e já
    // saíram de `dto`; o cast evita o colapso de tipo do Prisma no `data`.
    return this.prisma.produto
      .updateMany({
        where: { id, tenantId },
        data: dto as any,
      })
      .then(() => this.buscarPorId(tenantId, id));
  }

  /** Soft delete: marca como descontinuado (contrato canônico do catálogo) */
  async remover(tenantId: string, id: string) {
    return this.prisma.produto.updateMany({
      where: { id, tenantId },
      data: { status: 'DESCONTINUADO' },
    });
  }

  /**
   * Agrega dados brutos de estatísticas do catálogo do tenant.
   *
   * Retorna apenas o que é fonte legítima do catálogo (contagem por status e
   * somatório de preços). Saldo de estoque e receita NÃO pertencem a este
   * serviço (vivem em inventory/order) — a montagem final do DTO fica no service.
   */
  async agregarEstatisticas(tenantId: string) {
    const [porStatus, precosAtivos, porCategoria] = await Promise.all([
      // Contagem de produtos por status.
      this.prisma.produto.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { _all: true },
      }),
      // Somatório de preços (apenas ATIVO) para valor de catálogo e margem média.
      this.prisma.produto.aggregate({
        where: { tenantId, status: 'ATIVO' },
        _sum: { precoVenda: true, precoCusto: true },
        _count: { _all: true },
      }),
      // Distribuição por categoria (todos os status), com o nome resolvido depois.
      this.prisma.produto.groupBy({
        by: ['categoriaId'],
        where: { tenantId },
        _count: { _all: true },
      }),
    ]);

    // Resolve os nomes das categorias presentes na distribuição.
    const categoriaIds = porCategoria.map((c) => c.categoriaId);
    const categorias = categoriaIds.length
      ? await this.prisma.categoria.findMany({
          where: { tenantId, id: { in: categoriaIds } },
          select: { id: true, nome: true },
        })
      : [];

    return { porStatus, precosAtivos, porCategoria, categorias };
  }
}
