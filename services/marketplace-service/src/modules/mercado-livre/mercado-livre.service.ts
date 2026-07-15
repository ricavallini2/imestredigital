import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import {
  ContaMarketplace,
  PlataformaMarketplace,
  StatusAnuncio,
} from '../../../generated/client'
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository'
import { AnuncioRepository } from '../anuncio/anuncio.repository'
import { ProdutorEventosService } from '../eventos/produtor-eventos.service'
import { MercadoLivreHttpService } from './mercado-livre-http.service'
import { PedidoML, mapearPedidoMLParaEvento } from './mercado-livre-pedido.mapper'

/** Rótulo canônico do canal para eventos/persistência. */
const CANAL_ORIGEM = 'MERCADO_LIVRE'

/** Resposta de users/:id/items/search (parcial). */
interface RespostaBuscaItens {
  results: string[]
  paging?: { total?: number; offset?: number; limit?: number }
}

/** Item do Mercado Livre (parcial e defensivo). */
interface ItemML {
  id: string
  title?: string
  price?: number
  available_quantity?: number
  sold_quantity?: number
  status?: string
  permalink?: string
  category_id?: string
  seller_custom_field?: string | null
  pictures?: Array<{ url?: string; secure_url?: string }>
  variations?: Array<{ id?: number | string }>
}

/**
 * Serviço de aplicação da integração Mercado Livre.
 *
 * Orquestra os fluxos que dependem da API autenticada do ML:
 * - processamento de webhook de pedido (orders_v2) → evento de saga;
 * - sincronização de anúncios (items) do seller para o banco local.
 *
 * A resolução de conta por user_id (webhook sem JWT) e a publicação do evento
 * plano canônico vivem aqui.
 */
@Injectable()
export class MercadoLivreService {
  private readonly logger = new Logger(MercadoLivreService.name)

  constructor(
    private readonly contaRepo: ContaMarketplaceRepository,
    private readonly anuncioRepo: AnuncioRepository,
    private readonly http: MercadoLivreHttpService,
    private readonly produtorEventos: ProdutorEventosService,
  ) {}

  /**
   * Resolve a conta do Mercado Livre a partir do user_id do seller (vindo do
   * webhook). Retorna null se nenhuma conta corresponder — o webhook ignora
   * silenciosamente (pode ser notificação de app/seller não gerenciado aqui).
   */
  async resolverContaPorUserId(userId: string | number): Promise<ContaMarketplace | null> {
    return this.contaRepo.buscarPorPlataformaEUserId(
      PlataformaMarketplace.MERCADO_LIVRE,
      String(userId),
    )
  }

  /**
   * Processa uma notificação orders_v2: busca o pedido na API do ML e publica
   * o evento plano marketplace.pedido.recebido para o order-service criar o
   * pedido interno.
   *
   * NUNCA confia no payload do webhook como fonte de verdade — sempre busca o
   * recurso autenticado (conforme recomendação de segurança da pesquisa, já que
   * o ML não assina os webhooks de marketplace).
   *
   * @param conta conta já resolvida pelo user_id do seller.
   * @param resource path do recurso (ex.: '/orders/2000003508419013').
   */
  async processarWebhookPedido(conta: ContaMarketplace, resource: string): Promise<void> {
    const pedidoId = this.extrairId(resource)
    if (!pedidoId) {
      this.logger.warn(`Webhook orders_v2 com resource inválido: ${resource}`)
      return
    }

    this.logger.log(
      `Processando pedido ${pedidoId} do ML para tenant ${conta.tenantId}`,
    )

    const pedido = await this.http.get<PedidoML>(conta, `/orders/${pedidoId}`)

    const evento = mapearPedidoMLParaEvento(pedido, conta.tenantId, CANAL_ORIGEM)

    if (evento.itens.length === 0) {
      this.logger.warn(
        `Pedido ${pedidoId} sem itens após mapeamento — evento não publicado`,
      )
      return
    }

    await this.produtorEventos.pedidoRecebidoPlano(evento)
    this.logger.log(
      `Evento marketplace.pedido.recebido publicado (pedido ${pedidoId}, tenant ${conta.tenantId})`,
    )
  }

  /**
   * Sincroniza os anúncios (items) de um seller: pagina users/:id/items/search,
   * busca o detalhe de cada item e faz upsert em AnuncioMarketplace.
   *
   * @returns resumo com total de itens processados/criados/atualizados.
   */
  async sincronizarAnuncios(
    tenantId: string,
    contaId: string,
  ): Promise<{ processados: number; criados: number; atualizados: number }> {
    const conta = await this.contaRepo.buscarPorId(contaId, tenantId)
    if (!conta) throw new NotFoundException('Conta de marketplace não encontrada')
    if (conta.plataforma !== PlataformaMarketplace.MERCADO_LIVRE) {
      throw new NotFoundException('Conta não é do Mercado Livre')
    }
    if (!conta.idExterno) {
      throw new NotFoundException('Conta sem user_id do Mercado Livre (idExterno)')
    }

    const ids = await this.listarTodosItemIds(conta)
    this.logger.log(`Sincronizando ${ids.length} anúncios do ML (conta ${contaId})`)

    let criados = 0
    let atualizados = 0

    for (const itemId of ids) {
      try {
        const item = await this.http.get<ItemML>(conta, `/items/${itemId}`)
        const resultado = await this.upsertAnuncio(tenantId, contaId, item)
        if (resultado === 'criado') criados++
        else atualizados++
      } catch (erro) {
        this.logger.error(
          `Falha ao sincronizar item ${itemId}: ${(erro as Error).message}`,
        )
      }
    }

    await this.contaRepo.atualizarUltimaSincronizacao(contaId, tenantId)

    return { processados: ids.length, criados, atualizados }
  }

  /**
   * Pagina users/:id/items/search e acumula todos os IDs de item do seller.
   * O ML usa offset/limit; percorremos até esgotar o total.
   */
  private async listarTodosItemIds(conta: ContaMarketplace): Promise<string[]> {
    const limite = 50
    let offset = 0
    let total = Infinity
    const ids: string[] = []

    while (offset < total) {
      const resposta = await this.http.get<RespostaBuscaItens>(
        conta,
        `/users/${conta.idExterno}/items/search`,
        { params: { offset, limit: limite } },
      )

      const resultados = resposta.results ?? []
      ids.push(...resultados)

      total = resposta.paging?.total ?? resultados.length
      offset += limite

      // Guarda de segurança: sem resultados, encerra para não loopar.
      if (resultados.length === 0) break
    }

    return ids
  }

  /**
   * Faz upsert de um item do ML em AnuncioMarketplace (escopo por tenant/idExterno).
   */
  private async upsertAnuncio(
    tenantId: string,
    contaId: string,
    item: ItemML,
  ): Promise<'criado' | 'atualizado'> {
    const fotos = (item.pictures ?? [])
      .map((p) => p.secure_url || p.url)
      .filter((u): u is string => Boolean(u))

    const dadosComuns = {
      titulo: item.title ?? 'Sem título',
      preco: item.price ?? 0,
      estoque: item.available_quantity ?? 0,
      status: this.mapearStatusAnuncio(item.status),
      url: item.permalink ?? '',
      categoria: item.category_id ?? '',
      fotos,
      metricas: {
        visitas: 0,
        vendas: item.sold_quantity ?? 0,
        perguntas: 0,
      },
      ultimaSincronizacao: new Date(),
    }

    const existente = await this.anuncioRepo.buscarPorMarketplaceItemId(
      tenantId,
      item.id,
    )

    if (existente) {
      await this.anuncioRepo.atualizar(existente.id, tenantId, dadosComuns)
      return 'atualizado'
    }

    await this.anuncioRepo.criar({
      tenantId,
      contaMarketplaceId: contaId,
      // Sem vínculo direto com produto interno na sincronização inicial: usa o
      // seller_custom_field (SKU do vendedor) quando presente, senão o item id.
      produtoId: item.seller_custom_field || item.id,
      idExterno: item.id,
      descricao: '',
      ...dadosComuns,
    })
    return 'criado'
  }

  /**
   * Mapeia o status do item do ML para o enum interno StatusAnuncio.
   */
  private mapearStatusAnuncio(status?: string): StatusAnuncio {
    switch (status) {
      case 'active':
        return StatusAnuncio.ATIVO
      case 'paused':
        return StatusAnuncio.PAUSADO
      case 'closed':
        return StatusAnuncio.ENCERRADO
      case 'under_review':
      case 'inactive':
        return StatusAnuncio.PENDENTE
      default:
        return StatusAnuncio.PENDENTE
    }
  }

  /**
   * Extrai o ID numérico/textual final de um resource path do webhook.
   * Ex.: '/orders/2000003508419013' → '2000003508419013'.
   */
  private extrairId(resource: string): string | null {
    if (!resource) return null
    const partes = resource.split('/').filter(Boolean)
    return partes.length > 0 ? partes[partes.length - 1] : null
  }
}
