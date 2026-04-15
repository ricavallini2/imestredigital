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

@Injectable()
export class ProdutoRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Cria produto vinculado ao tenant */
  async criar(tenantId: string, dto: CriarProdutoDto) {
    return this.prisma.produto.create({
      data: {
        ...dto,
        tenantId,
      },
      include: {
        categoria: true,
        marca: true,
        imagens: true,
      },
    });
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

    return {
      dados,
      meta: {
        total,
        pagina,
        itensPorPagina,
        totalPaginas: Math.ceil(total / itensPorPagina),
      },
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
    return this.prisma.produto.updateMany({
      where: { id, tenantId },
      data: dto,
    }).then(() => this.buscarPorId(tenantId, id));
  }

  /** Soft delete: marca como descontinuado */
  async remover(tenantId: string, id: string) {
    return this.prisma.produto.updateMany({
      where: { id, tenantId },
      data: { status: 'descontinuado' },
    });
  }
}
