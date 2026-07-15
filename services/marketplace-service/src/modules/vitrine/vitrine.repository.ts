import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import {
  AnuncioMarketplace,
  ContaMarketplace,
  StatusAnuncio,
  StatusPerguntaMarketplace,
} from '../../../generated/client'

/** Contagem de anúncios por conta, quebrada por status relevante à UI. */
export interface ContagemAnunciosPorConta {
  contaMarketplaceId: string
  ativos: number
  pausados: number
}

/** Agregado de pedidos por conta (contagem + soma de valores) num período. */
export interface AgregadoPedidosPorConta {
  contaMarketplaceId: string
  pedidos: number
  receita: number
  receitaFrete: number
}

/** Contagem de perguntas pendentes por conta. */
export interface ContagemPerguntasPorConta {
  contaMarketplaceId: string
  pendentes: number
}

/**
 * Repository de leitura da vitrine.
 *
 * Concentra as agregações multi-conta do tenant em queries de grupo
 * (groupBy/aggregate) para evitar N+1 ao montar os cards e as stats. Toda
 * query é escopada por tenantId. Somente leitura — nenhuma escrita aqui.
 */
@Injectable()
export class VitrineRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista todas as contas do tenant (ordem estável por criação).
   */
  async listarContas(tenantId: string): Promise<ContaMarketplace[]> {
    return this.prisma.contaMarketplace.findMany({
      where: { tenantId },
      orderBy: { criadoEm: 'asc' },
    })
  }

  /**
   * Anúncios ATIVO/PAUSADO por conta, em uma única query agrupada.
   * Contas sem anúncios simplesmente não aparecem no mapa (tratado como 0).
   */
  async contarAnunciosPorConta(
    tenantId: string,
  ): Promise<Map<string, ContagemAnunciosPorConta>> {
    const grupos = await this.prisma.anuncioMarketplace.groupBy({
      by: ['contaMarketplaceId', 'status'],
      where: {
        tenantId,
        status: { in: [StatusAnuncio.ATIVO, StatusAnuncio.PAUSADO] },
      },
      _count: { _all: true },
    })

    const mapa = new Map<string, ContagemAnunciosPorConta>()
    for (const g of grupos) {
      const atual =
        mapa.get(g.contaMarketplaceId) ??
        { contaMarketplaceId: g.contaMarketplaceId, ativos: 0, pausados: 0 }
      if (g.status === StatusAnuncio.ATIVO) atual.ativos = g._count._all
      else if (g.status === StatusAnuncio.PAUSADO) atual.pausados = g._count._all
      mapa.set(g.contaMarketplaceId, atual)
    }
    return mapa
  }

  /**
   * Total de anúncios ATIVO do tenant (para stats globais).
   */
  async contarAnunciosAtivos(tenantId: string): Promise<number> {
    return this.prisma.anuncioMarketplace.count({
      where: { tenantId, status: StatusAnuncio.ATIVO },
    })
  }

  /**
   * Pedidos e receita por conta a partir de `inicio` (mês corrente), agrupados.
   * `_sum` de Decimal volta como Decimal|null — a conversão fica no service.
   */
  async agregarPedidosPorConta(
    tenantId: string,
    inicio: Date,
  ): Promise<Map<string, AgregadoPedidosPorConta>> {
    const grupos = await this.prisma.pedidoMarketplace.groupBy({
      by: ['contaMarketplaceId'],
      where: { tenantId, dataVenda: { gte: inicio } },
      _count: { _all: true },
      _sum: { valorTotal: true, valorFrete: true },
    })

    const mapa = new Map<string, AgregadoPedidosPorConta>()
    for (const g of grupos) {
      mapa.set(g.contaMarketplaceId, {
        contaMarketplaceId: g.contaMarketplaceId,
        pedidos: g._count._all,
        receita: g._sum.valorTotal ? Number(g._sum.valorTotal.toString()) : 0,
        receitaFrete: g._sum.valorFrete
          ? Number(g._sum.valorFrete.toString())
          : 0,
      })
    }
    return mapa
  }

  /**
   * Perguntas PENDENTE por conta, agrupadas.
   */
  async contarPerguntasPendentesPorConta(
    tenantId: string,
  ): Promise<Map<string, ContagemPerguntasPorConta>> {
    const grupos = await this.prisma.perguntaMarketplace.groupBy({
      by: ['contaMarketplaceId'],
      where: { tenantId, status: StatusPerguntaMarketplace.PENDENTE },
      _count: { _all: true },
    })

    const mapa = new Map<string, ContagemPerguntasPorConta>()
    for (const g of grupos) {
      mapa.set(g.contaMarketplaceId, {
        contaMarketplaceId: g.contaMarketplaceId,
        pendentes: g._count._all,
      })
    }
    return mapa
  }

  /**
   * Total de perguntas PENDENTE do tenant (stats globais).
   */
  async contarPerguntasPendentes(tenantId: string): Promise<number> {
    return this.prisma.perguntaMarketplace.count({
      where: { tenantId, status: StatusPerguntaMarketplace.PENDENTE },
    })
  }

  /**
   * Todos os anúncios do tenant (para a listagem da vitrine e o ranking de
   * stats). Traz a conta associada para derivar o canal sem query extra.
   */
  async listarAnunciosComConta(tenantId: string): Promise<
    (AnuncioMarketplace & { contaMarketplace: ContaMarketplace })[]
  > {
    return this.prisma.anuncioMarketplace.findMany({
      where: { tenantId },
      include: { contaMarketplace: true },
      orderBy: { criadoEm: 'desc' },
    })
  }
}
