/**
 * Repositório de Marcas (multi-tenancy).
 *
 * Todas as queries incluem filtro por tenantId para garantir isolamento
 * total entre empresas.
 */

import { Injectable } from '@nestjs/common'
import { Prisma } from '../../../generated/client'

import { PrismaService } from '../prisma/prisma.service'
import { ListarMarcasDto } from '../../dtos/marca/listar-marcas.dto'

/** Campos de relação incluídos ao retornar uma marca. */
const INCLUDE_MARCA = {
  _count: { select: { produtos: true } },
} satisfies Prisma.MarcaInclude

@Injectable()
export class MarcaRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Cria marca vinculada ao tenant. */
  async criar(
    tenantId: string,
    dados: { nome: string; slug: string; ativa: boolean; logoUrl?: string },
  ) {
    return this.prisma.marca.create({
      data: {
        tenantId,
        nome: dados.nome,
        slug: dados.slug,
        ativa: dados.ativa,
        logoUrl: dados.logoUrl ?? null,
      },
      include: INCLUDE_MARCA,
    })
  }

  /** Lista marcas do tenant com paginação e filtros. */
  async listar(tenantId: string, filtros: ListarMarcasDto) {
    const { pagina = 1, itensPorPagina = 20, busca, ativa } = filtros
    const skip = (pagina - 1) * itensPorPagina

    const where: Prisma.MarcaWhereInput = { tenantId }

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { slug: { contains: busca, mode: 'insensitive' } },
      ]
    }

    if (typeof ativa === 'boolean') where.ativa = ativa

    const [dados, total] = await Promise.all([
      this.prisma.marca.findMany({
        where,
        skip,
        take: itensPorPagina,
        include: INCLUDE_MARCA,
        orderBy: { nome: 'asc' },
      }),
      this.prisma.marca.count({ where }),
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

  /** Busca marca por ID dentro do tenant. */
  async buscarPorId(tenantId: string, id: string) {
    return this.prisma.marca.findFirst({
      where: { id, tenantId },
      include: INCLUDE_MARCA,
    })
  }

  /** Busca marca por slug dentro do tenant (verificação de unicidade). */
  async buscarPorSlug(tenantId: string, slug: string) {
    return this.prisma.marca.findFirst({
      where: { tenantId, slug },
    })
  }

  /** Conta quantos produtos referenciam a marca (dentro do tenant). */
  async contarProdutos(tenantId: string, id: string) {
    return this.prisma.produto.count({ where: { tenantId, marcaId: id } })
  }

  /** Atualiza marca do tenant e retorna o registro completo. */
  async atualizar(
    tenantId: string,
    id: string,
    dados: Partial<{ nome: string; slug: string; ativa: boolean; logoUrl: string | null }>,
  ) {
    await this.prisma.marca.updateMany({
      where: { id, tenantId },
      data: dados,
    })
    return this.buscarPorId(tenantId, id)
  }

  /** Soft delete: marca a marca como inativa. */
  async desativar(tenantId: string, id: string) {
    return this.prisma.marca.updateMany({
      where: { id, tenantId },
      data: { ativa: false },
    })
  }
}
