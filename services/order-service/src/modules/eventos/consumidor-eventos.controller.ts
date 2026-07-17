/**
 * ═══════════════════════════════════════════════════════════════
 * Controller Consumidor de Eventos - Kafka
 * ═══════════════════════════════════════════════════════════════
 *
 * Consome eventos de outros serviços e atualiza o estado do order-service:
 * - NOTA_AUTORIZADA (fiscal-service): marca pedido como FATURADO
 * - ESTOQUE_RESERVADO (inventory-service): avança o pedido para EM_SEPARACAO
 * - ESTOQUE_INSUFICIENTE (inventory-service): sinaliza pendência de estoque
 * - ESTOQUE_LIBERADO (inventory-service): confirma liberação de reservas
 * - MARKETPLACE_PEDIDO_RECEBIDO (marketplace-service): cria pedido novo
 * - PAGAMENTO_* (payment-service): atualiza pagamento
 *
 * Contrato da SAGA (payload PLANO, sem envelope `.dados`) — casa exatamente com
 * o produtor do inventory-service (ProducerService.publicarPlano):
 * - estoque.reservado    → { tenantId, pedidoId, itensReservados: [{ produtoId, sku, quantidade, depositoId }] }
 * - estoque.insuficiente → { tenantId, pedidoId, itensFaltantes: [{ produtoId, sku, quantidadeSolicitada, disponivel, quantidadeFaltante }] }
 * - estoque.liberado     → { tenantId, pedidoId, itens: [{ produtoId, quantidade, depositoId }] }
 *
 * Consumo IDEMPOTENTE: cada handler de estoque faz dedup por (evento, pedidoId)
 * via PedidoService.registrarEvento (tabela eventos_processados). Reentregas do
 * broker não reaplicam o efeito colateral.
 */

import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PedidoService } from '../pedido/pedido.service';
import { PagamentoService } from '../pagamento/pagamento.service';
import { TOPICOS_CONSUMIDOS } from '../../config/kafka.config';

// ─── Tipagem dos payloads consumidos (sem `any`) ───────────────

/** nota.autorizada (fiscal-service). */
interface EventoNotaAutorizada {
  tenantId: string;
  pedidoId: string;
  notaFiscalId: string;
  numero?: string | number;
  serieNota?: string | number;
}

/** estoque.reservado (inventory-service). */
interface EventoEstoqueReservado {
  tenantId: string;
  pedidoId: string;
  itensReservados?: Array<{
    produtoId: string;
    sku?: string;
    quantidade: number;
    depositoId?: string;
  }>;
}

/** estoque.insuficiente (inventory-service). */
interface EventoEstoqueInsuficiente {
  tenantId: string;
  pedidoId: string;
  itensFaltantes?: Array<{
    produtoId?: string;
    sku?: string;
    quantidadeSolicitada?: number;
    disponivel?: number;
    quantidadeFaltante?: number;
  }>;
}

/** estoque.liberado (inventory-service). */
interface EventoEstoqueLiberado {
  tenantId: string;
  pedidoId: string;
  itens?: Array<{ produtoId: string; quantidade: number; depositoId?: string }>;
}

/** marketplace.pedido.recebido (marketplace-service). */
interface EventoMarketplacePedido {
  tenantId: string;
  pedidoExternoId: string;
  canalOrigem?: string;
  clienteNome: string;
  clienteEmail?: string;
  itens: Array<{
    produtoId: string;
    variacaoId?: string;
    sku: string;
    titulo: string;
    quantidade: number;
    valorUnitario: number;
    peso?: number;
    largura?: number;
    altura?: number;
    comprimento?: number;
  }>;
  valorTotal?: number;
  enderecoEntrega?: Record<string, unknown>;
}

/** pagamento.autorizado (payment-service). */
interface EventoPagamentoAutorizado {
  tenantId: string;
  pedidoId: string;
  pagamentoId?: string;
  tipo?: string;
  valor: number;
  gateway?: string;
  transacaoExternaId?: string;
  dadosGateway?: Record<string, unknown>;
}

/** pagamento.capturado / pagamento.recusado (payment-service). */
interface EventoPagamento {
  tenantId: string;
  pedidoId: string;
  motivo?: string;
}

@Controller()
export class ConsumidorEventosController {
  private readonly logger = new Logger(ConsumidorEventosController.name);

  constructor(
    private pedidoService: PedidoService,
    private pagamentoService: PagamentoService,
  ) {}

  /**
   * Consome nota.autorizada do fiscal-service.
   * Marca o pedido como FATURADO quando a NF-e é autorizada.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.NOTA_AUTORIZADA)
  async aoNotaAutorizada(@Payload() evento: EventoNotaAutorizada) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('nota.autorizada ignorada: payload incompleto');
      return;
    }

    try {
      const novo = await this.pedidoService.registrarEvento(
        evento.tenantId,
        TOPICOS_CONSUMIDOS.NOTA_AUTORIZADA,
        evento.pedidoId,
      );
      if (!novo) {
        this.logger.log(`nota.autorizada [${evento.pedidoId}] já processada — ignorada`);
        return;
      }

      await this.pedidoService.atualizarStatusPedido(
        evento.tenantId,
        evento.pedidoId,
        'FATURADO',
        `Nota Fiscal ${evento.serieNota ?? ''}/${evento.numero ?? ''} autorizada. ID: ${evento.notaFiscalId}`,
      );

      this.logger.log(
        `Pedido ${evento.pedidoId} marcado como FATURADO (NF-e ${evento.numero ?? '?'})`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao processar nota.autorizada [${evento.pedidoId}]`,
        erro instanceof Error ? erro.stack : String(erro),
      );
    }
  }

  /**
   * Consome estoque.reservado do inventory-service.
   * Avança o pedido para EM_SEPARACAO (via CONFIRMADO), respeitando a máquina
   * de estados. Idempotente por (estoque.reservado, pedidoId).
   */
  @EventPattern(TOPICOS_CONSUMIDOS.ESTOQUE_RESERVADO)
  async aoEstoqueReservado(@Payload() evento: EventoEstoqueReservado) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('estoque.reservado ignorado: payload incompleto');
      return;
    }

    try {
      const novo = await this.pedidoService.registrarEvento(
        evento.tenantId,
        TOPICOS_CONSUMIDOS.ESTOQUE_RESERVADO,
        evento.pedidoId,
      );
      if (!novo) {
        this.logger.log(`estoque.reservado [${evento.pedidoId}] já processado — ignorado`);
        return;
      }

      const qtd = evento.itensReservados?.length ?? 0;
      await this.pedidoService.reagirEstoqueReservado(evento.tenantId, evento.pedidoId, qtd);
    } catch (erro) {
      this.logger.error(
        `Erro ao processar estoque.reservado [${evento.pedidoId}]`,
        erro instanceof Error ? erro.stack : String(erro),
      );
    }
  }

  /**
   * Consome estoque.insuficiente do inventory-service.
   * Sinaliza pendência de estoque no pedido e registra o detalhe no histórico.
   * Idempotente por (estoque.insuficiente, pedidoId).
   */
  @EventPattern(TOPICOS_CONSUMIDOS.ESTOQUE_INSUFICIENTE)
  async aoEstoqueInsuficiente(@Payload() evento: EventoEstoqueInsuficiente) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('estoque.insuficiente ignorado: payload incompleto');
      return;
    }

    try {
      const novo = await this.pedidoService.registrarEvento(
        evento.tenantId,
        TOPICOS_CONSUMIDOS.ESTOQUE_INSUFICIENTE,
        evento.pedidoId,
      );
      if (!novo) {
        this.logger.log(`estoque.insuficiente [${evento.pedidoId}] já processado — ignorado`);
        return;
      }

      await this.pedidoService.reagirEstoqueInsuficiente(
        evento.tenantId,
        evento.pedidoId,
        evento.itensFaltantes ?? [],
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao processar estoque.insuficiente [${evento.pedidoId}]`,
        erro instanceof Error ? erro.stack : String(erro),
      );
    }
  }

  /**
   * Consome estoque.liberado do inventory-service.
   * Confirma (para observabilidade da saga) que as reservas do pedido foram
   * liberadas após cancelamento. Idempotente por (estoque.liberado, pedidoId).
   */
  @EventPattern(TOPICOS_CONSUMIDOS.ESTOQUE_LIBERADO)
  async aoEstoqueLiberado(@Payload() evento: EventoEstoqueLiberado) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('estoque.liberado ignorado: payload incompleto');
      return;
    }

    try {
      const novo = await this.pedidoService.registrarEvento(
        evento.tenantId,
        TOPICOS_CONSUMIDOS.ESTOQUE_LIBERADO,
        evento.pedidoId,
      );
      if (!novo) {
        this.logger.log(`estoque.liberado [${evento.pedidoId}] já processado — ignorado`);
        return;
      }

      const qtd = evento.itens?.length ?? 0;
      await this.pedidoService.reagirEstoqueLiberado(evento.tenantId, evento.pedidoId, qtd);
    } catch (erro) {
      this.logger.error(
        `Erro ao processar estoque.liberado [${evento.pedidoId}]`,
        erro instanceof Error ? erro.stack : String(erro),
      );
    }
  }

  /**
   * Consome marketplace.pedido.recebido do marketplace-service.
   * Cria um novo pedido a partir do canal externo.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.MARKETPLACE_PEDIDO_RECEBIDO)
  async aoMarketplacePedidoRecebido(@Payload() evento: EventoMarketplacePedido) {
    if (!evento?.tenantId || !evento?.pedidoExternoId || !Array.isArray(evento?.itens)) {
      this.logger.warn('marketplace.pedido.recebido ignorado: payload incompleto');
      return;
    }

    try {
      const novoPedido = await this.pedidoService.criarPedido(evento.tenantId, {
        origem: 'MARKETPLACE',
        canalOrigem: evento.canalOrigem,
        pedidoExternoId: evento.pedidoExternoId,
        clienteNome: evento.clienteNome,
        clienteEmail: evento.clienteEmail,
        itens: evento.itens.map((i) => ({
          produtoId: i.produtoId,
          variacaoId: i.variacaoId,
          sku: i.sku,
          titulo: i.titulo,
          quantidade: i.quantidade,
          valorUnitario: i.valorUnitario,
          peso: i.peso,
          largura: i.largura,
          altura: i.altura,
          comprimento: i.comprimento,
        })),
        enderecoEntrega: evento.enderecoEntrega as never,
      });

      this.logger.log(
        `Pedido criado do marketplace: ${novoPedido.id} (${evento.canalOrigem ?? '?'}/${evento.pedidoExternoId})`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao processar marketplace.pedido.recebido [${evento.pedidoExternoId}]`,
        erro instanceof Error ? erro.stack : String(erro),
      );
    }
  }

  /**
   * Consome pagamento.autorizado do payment-service.
   * Registra o pagamento e confirma o pedido se ainda estiver PENDENTE.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PAGAMENTO_AUTORIZADO)
  async aoPagamentoAutorizado(@Payload() evento: EventoPagamentoAutorizado) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('pagamento.autorizado ignorado: payload incompleto');
      return;
    }

    try {
      // Idempotência: reentrega do MESMO pagamento não duplica o Pagamento (o que
      // inflaria a gaveta/financeiro). A chave inclui a transação do gateway — um
      // pedido pode legitimamente ter várias autorizações distintas, então
      // gatear só por pedidoId bloquearia pagamentos válidos. Sem transação
      // externa, segue sem dedup (comportamento anterior).
      if (evento.transacaoExternaId) {
        const chave = `${evento.pedidoId}:${evento.transacaoExternaId}`;
        const novo = await this.pedidoService.registrarEvento(
          evento.tenantId,
          TOPICOS_CONSUMIDOS.PAGAMENTO_AUTORIZADO,
          chave,
        );
        if (!novo) {
          this.logger.log(`pagamento.autorizado [${chave}] já processado — ignorado`);
          return;
        }
      }

      await this.pagamentoService.registrarPagamento(evento.tenantId, evento.pedidoId, {
        tipo: evento.tipo ?? 'MARKETPLACE',
        status: 'APROVADO',
        valor: evento.valor,
        gateway: evento.gateway,
        transacaoExternaId: evento.transacaoExternaId,
        dadosGateway: evento.dadosGateway,
      });

      // Confirma o pedido se ainda estiver PENDENTE.
      await this.pedidoService.confirmarPedidoAposAutorizacao(evento.tenantId, evento.pedidoId);

      this.logger.log(`Pagamento autorizado para pedido ${evento.pedidoId}`);
    } catch (erro) {
      this.logger.error(
        `Erro ao processar pagamento.autorizado [${evento.pedidoId}]`,
        erro instanceof Error ? erro.stack : String(erro),
      );
    }
  }

  /**
   * Consome pagamento.capturado do payment-service.
   * Marca o pagamento do pedido como PAGO.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PAGAMENTO_CAPTURADO)
  async aoPagamentoCapturado(@Payload() evento: EventoPagamento) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('pagamento.capturado ignorado: payload incompleto');
      return;
    }

    try {
      await this.pedidoService.atualizarStatusPagamento(evento.tenantId, evento.pedidoId, 'PAGO');
      this.logger.log(`Pedido ${evento.pedidoId} marcado como PAGO`);
    } catch (erro) {
      this.logger.error(
        `Erro ao processar pagamento.capturado [${evento.pedidoId}]`,
        erro instanceof Error ? erro.stack : String(erro),
      );
    }
  }

  /**
   * Consome pagamento.recusado do payment-service.
   * Marca o pagamento do pedido como CANCELADO.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PAGAMENTO_RECUSADO)
  async aoPagamentoRecusado(@Payload() evento: EventoPagamento) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('pagamento.recusado ignorado: payload incompleto');
      return;
    }

    try {
      await this.pedidoService.atualizarStatusPagamento(
        evento.tenantId,
        evento.pedidoId,
        'CANCELADO',
      );
      this.logger.warn(
        `Pagamento recusado para pedido ${evento.pedidoId}: ${evento.motivo ?? 'sem motivo'}`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao processar pagamento.recusado [${evento.pedidoId}]`,
        erro instanceof Error ? erro.stack : String(erro),
      );
    }
  }
}
