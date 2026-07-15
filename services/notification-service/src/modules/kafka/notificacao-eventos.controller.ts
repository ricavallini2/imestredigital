/**
 * Controller Consumidor de Eventos Kafka.
 *
 * Escuta eventos publicados por outros serviços (via ClientKafka.emit /
 * kafkajs producer) e dispara notificações automaticamente.
 *
 * MOTIVO DE SER UM CONTROLLER (e não um provider):
 * os produtores usam `emit()` (evento fire-and-forget). No NestJS
 * microservices, `emit()` é consumido por `@EventPattern` — que SÓ funciona
 * em CONTROLLERS. `@MessagePattern` (usado antes, num provider) casa apenas
 * com `send()` (request/response) e portanto NUNCA recebia estes eventos.
 *
 * CONVENÇÕES DE PAYLOAD (verificadas nos produtores reais):
 * - order-service / fiscal-service (ClientKafka.emit): payload PLANO
 *     { tenantId, pedidoId|notaId, timestamp, ...dados }
 * - inventory-service / marketplace-service (kafkajs com wrapper): payload
 *   com ENVELOPE { tenantId, tipo, dados: {...}, timestamp, origem? }
 *   → os campos de negócio ficam sob `payload.dados`.
 *
 * Muitos eventos não carregam e-mail do destinatário; nesses casos criamos
 * uma notificação INTERNA (in-app) — sem inventar dados de contato.
 */

import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'

import { NotificacaoService } from '../notificacao/notificacao.service'
import {
  TipoNotificacao,
  PrioridadeNotificacao,
} from '../../dtos/criar-notificacao.dto'
import { TOPICOS_CONSUMIDOS } from '../../config/kafka.config'

/** Envelope usado por inventory-service e marketplace-service. */
interface EnvelopeEvento<T = Record<string, unknown>> {
  tenantId: string
  tipo?: string
  dados?: T
  timestamp?: string | number
  origem?: string
}

/** Payload plano usado por order-service e fiscal-service. */
interface EventoPedido {
  tenantId: string
  pedidoId: string
  timestamp?: string
  clienteId?: string
  clienteEmail?: string
  clienteNome?: string
  total?: number
  motivo?: string
  adminEmail?: string
}

interface EventoNotaFiscal {
  tenantId: string
  notaId: string
  protocolo?: string
  motivo?: string
  timestamp?: string
  clienteId?: string
  clienteEmail?: string
  nfeNumero?: string
  pedidoId?: string
  pdfUrl?: string
}

@Controller()
export class NotificacaoEventosController {
  private readonly logger = new Logger(NotificacaoEventosController.name)

  constructor(private readonly notificacaoService: NotificacaoService) {}

  // ══════════════════════════════════════════════════════════
  // order-service (payload plano)
  // ══════════════════════════════════════════════════════════

  /** Pedido criado → confirma recebimento ao cliente (e-mail se houver). */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_CRIADO)
  async aoCriarPedido(@Payload() dados: EventoPedido): Promise<void> {
    if (!this.tenantValido(dados?.tenantId, TOPICOS_CONSUMIDOS.PEDIDO_CRIADO)) {
      return
    }
    try {
      this.logger.log(`Pedido criado: ${dados.pedidoId}`)

      await this.notificacaoService.criarNotificacao(dados.tenantId, {
        tipo: dados.clienteEmail ? TipoNotificacao.EMAIL : TipoNotificacao.INTERNA,
        titulo: 'Seu pedido foi recebido',
        mensagem: this.mensagemPedido(
          dados,
          `Pedido #${dados.pedidoId} foi recebido com sucesso.`,
        ),
        destinatarioId: dados.clienteId,
        destinatarioEmail: dados.clienteEmail,
        metadata: { pedidoId: dados.pedidoId, evento: TOPICOS_CONSUMIDOS.PEDIDO_CRIADO },
      })

      if (dados.adminEmail) {
        await this.notificacaoService.criarNotificacao(dados.tenantId, {
          tipo: TipoNotificacao.EMAIL,
          titulo: `Novo pedido${dados.clienteNome ? `: ${dados.clienteNome}` : ''}`,
          mensagem: `Pedido #${dados.pedidoId} foi criado.`,
          destinatarioEmail: dados.adminEmail,
          metadata: { pedidoId: dados.pedidoId, evento: `${TOPICOS_CONSUMIDOS.PEDIDO_CRIADO}.admin` },
        })
      }
    } catch (erro) {
      this.logErro(TOPICOS_CONSUMIDOS.PEDIDO_CRIADO, erro)
    }
  }

  /** Pedido confirmado → avisa cliente. */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_CONFIRMADO)
  async aoConfirmarPedido(@Payload() dados: EventoPedido): Promise<void> {
    await this.notificarAtualizacaoPedido(
      dados,
      TOPICOS_CONSUMIDOS.PEDIDO_CONFIRMADO,
      `Seu pedido #${dados?.pedidoId} foi confirmado.`,
    )
  }

  /** Pedido enviado → avisa cliente. */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_ENVIADO)
  async aoEnviarPedido(@Payload() dados: EventoPedido): Promise<void> {
    await this.notificarAtualizacaoPedido(
      dados,
      TOPICOS_CONSUMIDOS.PEDIDO_ENVIADO,
      `Seu pedido #${dados?.pedidoId} foi enviado.`,
    )
  }

  /** Pedido entregue → avisa cliente. */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_ENTREGUE)
  async aoEntregarPedido(@Payload() dados: EventoPedido): Promise<void> {
    await this.notificarAtualizacaoPedido(
      dados,
      TOPICOS_CONSUMIDOS.PEDIDO_ENTREGUE,
      `Seu pedido #${dados?.pedidoId} foi entregue.`,
    )
  }

  /** Pedido pago → avisa cliente. */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_PAGO)
  async aoPagarPedido(@Payload() dados: EventoPedido): Promise<void> {
    await this.notificarAtualizacaoPedido(
      dados,
      TOPICOS_CONSUMIDOS.PEDIDO_PAGO,
      `O pagamento do pedido #${dados?.pedidoId} foi confirmado.`,
    )
  }

  /** Pedido cancelado → avisa cliente com o motivo (se houver). */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_CANCELADO)
  async aoCancelarPedido(@Payload() dados: EventoPedido): Promise<void> {
    const motivo = dados?.motivo ? ` Motivo: ${dados.motivo}.` : ''
    await this.notificarAtualizacaoPedido(
      dados,
      TOPICOS_CONSUMIDOS.PEDIDO_CANCELADO,
      `Seu pedido #${dados?.pedidoId} foi cancelado.${motivo}`,
      PrioridadeNotificacao.ALTA,
    )
  }

  // ══════════════════════════════════════════════════════════
  // fiscal-service (payload plano)
  // ══════════════════════════════════════════════════════════

  /** NF-e autorizada → notifica cliente (INTERNA quando não há e-mail). */
  @EventPattern(TOPICOS_CONSUMIDOS.NOTA_AUTORIZADA)
  async aoNotaAutorizada(@Payload() dados: EventoNotaFiscal): Promise<void> {
    if (!this.tenantValido(dados?.tenantId, TOPICOS_CONSUMIDOS.NOTA_AUTORIZADA)) {
      return
    }
    try {
      this.logger.log(`NF-e autorizada: ${dados.notaId}`)

      const linkPdf = dados.pdfUrl ? `\n\nBaixar NF-e: ${dados.pdfUrl}` : ''

      await this.notificacaoService.criarNotificacao(dados.tenantId, {
        tipo: dados.clienteEmail ? TipoNotificacao.EMAIL : TipoNotificacao.INTERNA,
        titulo: 'NF-e autorizada',
        mensagem:
          `Sua NF-e${dados.nfeNumero ? ` #${dados.nfeNumero}` : ''} foi autorizada pela SEFAZ.` +
          linkPdf,
        destinatarioId: dados.clienteId,
        destinatarioEmail: dados.clienteEmail,
        metadata: {
          notaId: dados.notaId,
          protocolo: dados.protocolo,
          pedidoId: dados.pedidoId,
          evento: TOPICOS_CONSUMIDOS.NOTA_AUTORIZADA,
        },
      })
    } catch (erro) {
      this.logErro(TOPICOS_CONSUMIDOS.NOTA_AUTORIZADA, erro)
    }
  }

  /** NF-e rejeitada → alerta interno (ação do operador). */
  @EventPattern(TOPICOS_CONSUMIDOS.NOTA_REJEITADA)
  async aoNotaRejeitada(@Payload() dados: EventoNotaFiscal): Promise<void> {
    if (!this.tenantValido(dados?.tenantId, TOPICOS_CONSUMIDOS.NOTA_REJEITADA)) {
      return
    }
    try {
      this.logger.log(`NF-e rejeitada: ${dados.notaId}`)

      await this.notificacaoService.criarNotificacao(dados.tenantId, {
        tipo: TipoNotificacao.INTERNA,
        titulo: 'NF-e rejeitada pela SEFAZ',
        mensagem:
          `A NF-e ${dados.notaId} foi rejeitada.` +
          (dados.motivo ? ` Motivo: ${dados.motivo}.` : ''),
        prioridade: PrioridadeNotificacao.ALTA,
        metadata: { notaId: dados.notaId, evento: TOPICOS_CONSUMIDOS.NOTA_REJEITADA },
      })
    } catch (erro) {
      this.logErro(TOPICOS_CONSUMIDOS.NOTA_REJEITADA, erro)
    }
  }

  // ══════════════════════════════════════════════════════════
  // inventory-service (payload com envelope { dados })
  // ══════════════════════════════════════════════════════════

  /** Estoque baixo → alerta interno para o tenant. */
  @EventPattern(TOPICOS_CONSUMIDOS.ESTOQUE_BAIXO)
  async aoEstoqueBaixo(
    @Payload()
    evento: EnvelopeEvento<{
      produtoId?: string
      saldoAtual?: number
      estoqueMinimo?: number
    }>,
  ): Promise<void> {
    if (!this.tenantValido(evento?.tenantId, TOPICOS_CONSUMIDOS.ESTOQUE_BAIXO)) {
      return
    }
    try {
      const d = evento.dados ?? {}
      this.logger.log(`Estoque baixo: produto ${d.produtoId}`)

      await this.notificacaoService.criarNotificacao(evento.tenantId, {
        tipo: TipoNotificacao.INTERNA,
        titulo: 'Alerta: estoque baixo',
        mensagem:
          `O produto ${d.produtoId ?? ''} está com estoque baixo ` +
          `(${d.saldoAtual ?? '?'} un., mínimo ${d.estoqueMinimo ?? '?'}).`,
        prioridade: PrioridadeNotificacao.ALTA,
        metadata: { ...d, evento: TOPICOS_CONSUMIDOS.ESTOQUE_BAIXO },
      })
    } catch (erro) {
      this.logErro(TOPICOS_CONSUMIDOS.ESTOQUE_BAIXO, erro)
    }
  }

  /** Estoque zerado → alerta interno urgente. */
  @EventPattern(TOPICOS_CONSUMIDOS.ESTOQUE_ZERADO)
  async aoEstoqueZerado(
    @Payload()
    evento: EnvelopeEvento<{ produtoId?: string; deposito?: string }>,
  ): Promise<void> {
    if (!this.tenantValido(evento?.tenantId, TOPICOS_CONSUMIDOS.ESTOQUE_ZERADO)) {
      return
    }
    try {
      const d = evento.dados ?? {}
      this.logger.log(`Estoque zerado: produto ${d.produtoId}`)

      await this.notificacaoService.criarNotificacao(evento.tenantId, {
        tipo: TipoNotificacao.INTERNA,
        titulo: 'Alerta: produto sem estoque',
        mensagem: `O produto ${d.produtoId ?? ''} está sem estoque disponível.`,
        prioridade: PrioridadeNotificacao.URGENTE,
        metadata: { ...d, evento: TOPICOS_CONSUMIDOS.ESTOQUE_ZERADO },
      })
    } catch (erro) {
      this.logErro(TOPICOS_CONSUMIDOS.ESTOQUE_ZERADO, erro)
    }
  }

  // ══════════════════════════════════════════════════════════
  // marketplace-service (payload com envelope { dados })
  // ══════════════════════════════════════════════════════════

  /** Pergunta recebida no marketplace → alerta interno para responder. */
  @EventPattern(TOPICOS_CONSUMIDOS.MARKETPLACE_PERGUNTA_RECEBIDA)
  async aoMarketplacePerguntaRecebida(
    @Payload()
    evento: EnvelopeEvento<{
      perguntaId?: string
      marketplace?: string
      pergunta?: string
      compradorNome?: string
    }>,
  ): Promise<void> {
    if (
      !this.tenantValido(
        evento?.tenantId,
        TOPICOS_CONSUMIDOS.MARKETPLACE_PERGUNTA_RECEBIDA,
      )
    ) {
      return
    }
    try {
      const d = evento.dados ?? {}
      this.logger.log(`Pergunta recebida: ${d.perguntaId}`)

      await this.notificacaoService.criarNotificacao(evento.tenantId, {
        tipo: TipoNotificacao.INTERNA,
        titulo: `Nova pergunta${d.marketplace ? ` (${d.marketplace})` : ''}`,
        mensagem:
          `${d.compradorNome ?? 'Um comprador'} perguntou: ` +
          `"${d.pergunta ?? ''}"`,
        prioridade: PrioridadeNotificacao.ALTA,
        metadata: { ...d, evento: TOPICOS_CONSUMIDOS.MARKETPLACE_PERGUNTA_RECEBIDA },
      })
    } catch (erro) {
      this.logErro(TOPICOS_CONSUMIDOS.MARKETPLACE_PERGUNTA_RECEBIDA, erro)
    }
  }

  /** Pedido importado do marketplace → alerta interno. */
  @EventPattern(TOPICOS_CONSUMIDOS.MARKETPLACE_PEDIDO_RECEBIDO)
  async aoMarketplacePedidoRecebido(
    @Payload()
    evento: EnvelopeEvento<{
      marketplacePedidoId?: string
      marketplace?: string
      comprador?: string
      valorTotal?: number
    }>,
  ): Promise<void> {
    if (
      !this.tenantValido(
        evento?.tenantId,
        TOPICOS_CONSUMIDOS.MARKETPLACE_PEDIDO_RECEBIDO,
      )
    ) {
      return
    }
    try {
      const d = evento.dados ?? {}
      this.logger.log(`Pedido de marketplace recebido: ${d.marketplacePedidoId}`)

      await this.notificacaoService.criarNotificacao(evento.tenantId, {
        tipo: TipoNotificacao.INTERNA,
        titulo: `Novo pedido${d.marketplace ? ` (${d.marketplace})` : ''}`,
        mensagem:
          `Pedido ${d.marketplacePedidoId ?? ''}` +
          `${d.comprador ? ` de ${d.comprador}` : ''} foi importado.`,
        metadata: { ...d, evento: TOPICOS_CONSUMIDOS.MARKETPLACE_PEDIDO_RECEBIDO },
      })
    } catch (erro) {
      this.logErro(TOPICOS_CONSUMIDOS.MARKETPLACE_PEDIDO_RECEBIDO, erro)
    }
  }

  // ══════════════════════════════════════════════════════════
  // Helpers
  // ══════════════════════════════════════════════════════════

  /**
   * Notifica o cliente de uma mudança de status de pedido (payload plano).
   * Usa EMAIL quando há e-mail do cliente; caso contrário, INTERNA.
   */
  private async notificarAtualizacaoPedido(
    dados: EventoPedido,
    evento: string,
    mensagem: string,
    prioridade: PrioridadeNotificacao = PrioridadeNotificacao.NORMAL,
  ): Promise<void> {
    if (!this.tenantValido(dados?.tenantId, evento)) {
      return
    }
    try {
      this.logger.log(`${evento}: ${dados.pedidoId}`)

      await this.notificacaoService.criarNotificacao(dados.tenantId, {
        tipo: dados.clienteEmail ? TipoNotificacao.EMAIL : TipoNotificacao.INTERNA,
        titulo: `Atualização do pedido #${dados.pedidoId}`,
        mensagem,
        prioridade,
        destinatarioId: dados.clienteId,
        destinatarioEmail: dados.clienteEmail,
        metadata: { pedidoId: dados.pedidoId, evento },
      })
    } catch (erro) {
      this.logErro(evento, erro)
    }
  }

  private mensagemPedido(dados: EventoPedido, base: string): string {
    if (typeof dados.total === 'number') {
      return `${base.replace(/\.$/, '')} no valor de R$ ${dados.total.toFixed(2)}.`
    }
    return base
  }

  /** Garante que o evento traz tenantId — sem ele não há como isolar dados. */
  private tenantValido(tenantId: string | undefined, evento: string): boolean {
    if (!tenantId) {
      this.logger.warn(`Evento ${evento} ignorado: tenantId ausente no payload`)
      return false
    }
    return true
  }

  private logErro(evento: string, erro: unknown): void {
    this.logger.error(
      `Erro ao processar ${evento}: ${(erro as Error)?.message ?? erro}`,
    )
  }
}
