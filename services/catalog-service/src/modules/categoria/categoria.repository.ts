/**
 * Repositório de Categorias (multi-tenancy).
 *
 * Todas as queries incluem filtro por tenantId para garantir isolamento
 * total entre empresas. Suporta hierarquia simples via `categoriaPaiId`.
 */

import { Injectable } from '@nestjs/common'
import { Prisma } from '../../../generated/client'

import { PrismaService } from '../prisma/prisma.service'
import { ListarCategoriasDto } from '../../dtos/categoria/listar-categorias.dto'

/** Campos de relação incluídos ao retornar uma categoria. */
const INCLUDE_CATEGORIA = {
  categoriaPai: { select: { id: true, nome: true, slug: true } },
  subcategorias: { select: { id: true, nome: true, slug: true, ativa: true } },
  _count: { select: { produtos: true, subcategorias: true } },
} satisfies Prisma.CategoriaInclude

@Injectable()
export class CategoriaRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Cria categoria vinculada ao tenant. */
  async criar(
    tenantId: string,
    dados: { nome: string; slug: string; nivel: number; ativa: boolean; categoriaPaiId?: string },
  ) {
    return this.prisma.categoria.create({
      data: {
        tenantId,
        nome: dados.nome,
        slug: dados.slug,
        nivel: dados.nivel,
        ativa: dados.ativa,
        categoriaPaiId: dados.categoriaPaiId ?? null,
      },
      include: INCLUDE_CATEGORIA,
    })
  }

  /** Lista categorias do tenant com paginação e filtros. */
  async listar(tenantId: string, filtros: ListarCategoriasDto) {
    const { pagina = 1, itensPorPagina = 20, busca, ativa, categoriaPaiId, apenasRaiz } = filtros
    const skip = (pagina - 1) * itensPorPagina

    const where: Prisma.CategoriaWhereInput = { tenantId }

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { slug: { contains: busca, mode: 'insensitive' } },
      ]
    }

    if (typeof ativa === 'boolean') where.ativa = ativa
    if (categoriaPaiId) where.categoriaPaiId = categoriaPaiId
    else if (apenasRaiz) where.categoriaPaiId = null

    const [dados, total] = await Promise.all([
      this.prisma.categoria.findMany({
        where,
        skip,
        take: itensPorPagina,
        include: INCLUDE_CATEGORIA,
        orderBy: [{ nivel: 'asc' }, { nome: 'asc' }],
      }),
      this.prisma.categoria.count({ where }),
    ])

    // Envelope paginado canônico: { dados, total, pagina, limite, totalPaginas }
    return {
      dados,
      total,
      pagina,
      limite: itensPorPagina,
      totalPaginas: Math.ceil(total / itensPorPagina),
    }
  }

  /** Retorna a árvore completa de categorias do tenant (raízes com filhas aninhadas). */
  async listarArvore(tenantId: string) {
    const todas = await this.prisma.categoria.findMany({
      where: { tenantId },
      include: { _count: { select: { produtos: true } } },
      orderBy: [{ nivel: 'asc' }, { nome: 'asc' }],
    })

    type NoArvore = (typeof todas)[number] & { filhas: NoArvore[] }

    const porId = new Map<string, NoArvore>()
    for (const cat of todas) porId.set(cat.id, { ...cat, filhas: [] })

    const raizes: NoArvore[] = []
    for (const cat of porId.values()) {
      if (cat.categoriaPaiId && porId.has(cat.categoriaPaiId)) {
        porId.get(cat.categoriaPaiId)!.filhas.push(cat)
      } else {
        raizes.push(cat)
      }
    }

    return raizes
  }

  /** Busca categoria por ID dentro do tenant. */
  async buscarPorId(tenantId: string, id: string) {
    return this.prisma.categoria.findFirst({
      where: { id, tenantId },
      include: INCLUDE_CATEGORIA,
    })
  }

  /** Busca categoria por slug dentro do tenant (verificação de unicidade). */
  async buscarPorSlug(tenantId: string, slug: string) {
    return this.prisma.categoria.findFirst({
      where: { tenantId, slug },
    })
  }

  /** Conta quantos produtos referenciam a categoria (dentro do tenant). */
  async contarProdutos(tenantId: string, id: string) {
    return this.prisma.produto.count({ where: { tenantId, categoriaId: id } })
  }

  /** Conta subcategorias diretas (dentro do tenant). */
  async contarSubcategorias(tenantId: string, id: string) {
    return this.prisma.categoria.count({ where: { tenantId, categoriaPaiId: id } })
  }

  /** Atualiza categoria do tenant e retorna o registro completo. */
  async atualizar(
    tenantId: string,
    id: string,
    dados: Partial<{ nome: string; slug: string; nivel: number; ativa: boolean; categoriaPaiId: string | null }>,
  ) {
    await this.prisma.categoria.updateMany({
      where: { id, tenantId },
      data: dados,
    })
    return this.buscarPorId(tenantId, id)
  }

  /** Soft delete: marca a categoria como inativa. */
  async desativar(tenantId: string, id: string) {
    return this.prisma.categoria.updateMany({
      where: { id, tenantId },
      data: { ativa: false },
    })
  }
}
