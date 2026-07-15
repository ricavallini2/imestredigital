/**
 * Controlador Consumidor de Eventos Kafka.
 * Consome eventos de outros serviços (order-service, fiscal-service, etc).
 *
 * Contrato da SAGA (payload PLANO, sem envelope `.dados`) — casa exatamente
 * com os produtores dos outros serviços:
 * - pedido.pago      → { tenantId, pedidoId, valor?, timestamp }
 * - pedido.cancelado → { tenantId, pedidoId, motivo?, timestamp }
 * - pedido.faturado  → { tenantId, pedidoId, notaFiscalId?, valorTotal?, timestamp }
 * - nota.autorizada  → { tenantId, notaFiscalId?/notaId?, pedidoId?, valor?, timestamp }
 *
 * Consumo IDEMPOTENTE: o handler de pedido.faturado faz dedup por
 * (evento, pedidoId) via LancamentoService.criarReceberDePedidoFaturado
 * (tabela eventos_processados). Reentregas do broker não reaplicam o efeito.
 */

import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOPICOS_KAFKA } from '../../config/kafka.config';
import { LancamentoService } from '../lancamento/lancamento.service';

/** pedido.pago / pedido.cancelado (order-service). */
interface EventoPedido {
  tenantId: string;
  pedidoId: string;
  valor?: number;
  timestamp?: string;
  descricao?: string;
}

/** pedido.faturado (order-service). */
interface EventoPedidoFaturado {
  tenantId: string;
  pedidoId: string;
  notaFiscalId?: string;
  valorTotal?: number;
  cliente?: string;
  timestamp?: string;
}

/** nota.autorizada (fiscal-service). */
interface EventoNota {
  tenantId: string;
  notaFiscalId?: string;
  notaId?: string;
  valor?: number;
  timestamp?: string;
  pedidoId?: string;
}

@Controller()
export class ConsumidorEventosController {
  private readonly logger = new Logger('ConsumidorEventosController');

  constructor(private readonly lancamentoService: LancamentoService) {}

  /**
   * Consome evento de pedido pago (order-service).
   * Cria uma receita correspondente (já recebida).
   */
  @EventPattern(TOPICOS_KAFKA.PEDIDO_PAGO)
  async aoReceber_PedidoPago(@Payload() evento: EventoPedido) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('pedido.pago ignorado: payload incompleto');
      return;
    }

    try {
      this.logger.debug(
        `Evento recebido: ${TOPICOS_KAFKA.PEDIDO_PAGO} - ${evento.pedidoId}`,
      );

      const dataPagamento = evento.timestamp ? new Date(evento.timestamp) : new Date();

      await this.lancamentoService.criarAPartirEvento({
        tenantId: evento.tenantId,
        tipo: 'RECEITA',
        descricao: evento.descricao || `Receita - Pedido ${evento.pedidoId}`,
        valor: evento.valor ?? 0,
        dataVencimento: dataPagamento,
        dataPagamento,
        pedidoId: evento.pedidoId,
        status: 'PAGO',
        categoria: 'Vendas',
      });

      this.logger.log(`Receita criada a partir do pedido pago ${evento.pedidoId}`);
    } catch (erro) {
      this.logger.error(
        `Erro ao processar ${TOPICOS_KAFKA.PEDIDO_PAGO} [${evento.pedidoId}]: ${
          erro instanceof Error ? erro.message : String(erro)
        }`,
      );
    }
  }

  /**
   * Consome evento de pedido faturado (order-service).
   *
   * NF-e autorizada → cria a conta a RECEBER (categoria "Vendas", vínculo
   * pedidoId/notaFiscalId, valores Decimal). Idempotente: dedup por
   * (pedido.faturado, pedidoId) + defesa por estado (não duplica recebível
   * de um pedido já faturado). Reentregas do broker são ignoradas.
   */
  @EventPattern(TOPICOS_KAFKA.PEDIDO_FATURADO)
  async aoReceber_PedidoFaturado(@Payload() evento: EventoPedidoFaturado) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('pedido.faturado ignorado: payload incompleto');
      return;
    }

    try {
      this.logger.debug(
        `Evento recebido: ${TOPICOS_KAFKA.PEDIDO_FATURADO} - ${evento.pedidoId}`,
      );

      await this.lancamentoService.criarReceberDePedidoFaturado({
        tenantId: evento.tenantId,
        pedidoId: evento.pedidoId,
        notaFiscalId: evento.notaFiscalId,
        valor: evento.valorTotal ?? 0,
        dataFaturamento: evento.timestamp,
        cliente: evento.cliente,
      });
    } catch (erro) {
      this.logger.error(
        `Erro ao processar ${TOPICOS_KAFKA.PEDIDO_FATURADO} [${evento.pedidoId}]: ${
          erro instanceof Error ? erro.message : String(erro)
        }`,
      );
    }
  }

  /**
   * Consome evento de pedido cancelado (order-service).
   * Cancela a receita correspondente.
   */
  @EventPattern(TOPICOS_KAFKA.PEDIDO_CANCELADO)
  async aoReceber_PedidoCancelado(@Payload() evento: EventoPedido) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('pedido.cancelado ignorado: payload incompleto');
      return;
    }

    try {
      this.logger.debug(
        `Evento recebido: ${TOPICOS_KAFKA.PEDIDO_CANCELADO} - ${evento.pedidoId}`,
      );

      await this.lancamentoService.cancelarAPartirPedido(
        evento.tenantId,
        evento.pedidoId,
      );

      this.logger.log(`Receita cancelada para o pedido ${evento.pedidoId}`);
    } catch (erro) {
      this.logger.error(
        `Erro ao processar ${TOPICOS_KAFKA.PEDIDO_CANCELADO} [${evento.pedidoId}]: ${
          erro instanceof Error ? erro.message : String(erro)
        }`,
      );
    }
  }

  /**
   * Consome evento de nota fiscal autorizada (fiscal-service).
   * Vincula a nota fiscal aos lançamentos correspondentes.
   */
  @EventPattern(TOPICOS_KAFKA.NOTA_AUTORIZADA)
  async aoReceber_NotaAutorizada(@Payload() evento: EventoNota) {
    if (!evento?.tenantId) {
      this.logger.warn('nota.autorizada ignorada: payload incompleto');
      return;
    }

    try {
      const notaFiscalId = evento.notaFiscalId ?? evento.notaId;
      this.logger.debug(
        `Evento recebido: ${TOPICOS_KAFKA.NOTA_AUTORIZADA} - ${notaFiscalId ?? '?'}`,
      );

      if (evento.pedidoId && notaFiscalId) {
        await this.lancamentoService.vincularNotaFiscal(
          evento.tenantId,
          evento.pedidoId,
          notaFiscalId,
        );
        this.logger.log(
          `Nota fiscal ${notaFiscalId} vinculada aos lançamentos do pedido ${evento.pedidoId}`,
        );
      }
    } catch (erro) {
      this.logger.error(
        `Erro ao processar ${TOPICOS_KAFKA.NOTA_AUTORIZADA}: ${
          erro instanceof Error ? erro.message : String(erro)
        }`,
      );
    }
  }
}
