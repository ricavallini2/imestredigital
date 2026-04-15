/**
 * Controlador Consumidor de Eventos Kafka.
 * Consome eventos de outros serviços (order-service, fiscal-service, etc).
 */

import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOPICOS_KAFKA } from '../../config/kafka.config';
import { LancamentoService } from '../lancamento/lancamento.service';

interface EventoPedido {
  tenantId: string;
  pedidoId: string;
  valor: number;
  timestamp: Date;
  descricao?: string;
}

interface EventoNota {
  tenantId: string;
  notaFiscalId: string;
  valor: number;
  timestamp: Date;
  pedidoId?: string;
}

@Controller()
export class ConsumidorEventosController {
  private readonly logger = new Logger('ConsumidorEventosController');

  constructor(private readonly lancamentoService: LancamentoService) {}

  /**
   * Consome evento de pedido pago (order-service).
   * Cria uma receita correspondente.
   */
  @EventPattern(TOPICOS_KAFKA.PEDIDO_PAGO)
  async aoReceber_PedidoPago(@Payload() evento: EventoPedido) {
    try {
      this.logger.debug(
        `Evento recebido: ${TOPICOS_KAFKA.PEDIDO_PAGO} - ${evento.pedidoId}`,
      );

      await this.lancamentoService.criarAPartirEvento({
        tenantId: evento.tenantId,
        tipo: 'RECEITA',
        descricao: evento.descricao || `Receita - Pedido ${evento.pedidoId}`,
        valor: evento.valor,
        dataVencimento: evento.timestamp,
        dataPagamento: evento.timestamp,
        pedidoId: evento.pedidoId,
        status: 'PAGO',
        categoria: 'vendas',
      });

      this.logger.log(`Receita criada a partir do pedido ${evento.pedidoId}`);
    } catch (erro) {
      this.logger.error(
        `Erro ao processar ${TOPICOS_KAFKA.PEDIDO_PAGO}: ${erro.message}`,
      );
    }
  }

  /**
   * Consome evento de pedido cancelado (order-service).
   * Cancela a receita correspondente.
   */
  @EventPattern(TOPICOS_KAFKA.PEDIDO_CANCELADO)
  async aoReceber_PedidoCancelado(@Payload() evento: EventoPedido) {
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
        `Erro ao processar ${TOPICOS_KAFKA.PEDIDO_CANCELADO}: ${erro.message}`,
      );
    }
  }

  /**
   * Consome evento de nota fiscal autorizada (fiscal-service).
   * Vincula a nota fiscal aos lançamentos correspondentes.
   */
  @EventPattern(TOPICOS_KAFKA.NOTA_AUTORIZADA)
  async aoReceber_NotaAutorizada(@Payload() evento: EventoNota) {
    try {
      this.logger.debug(
        `Evento recebido: ${TOPICOS_KAFKA.NOTA_AUTORIZADA} - ${evento.notaFiscalId}`,
      );

      if (evento.pedidoId) {
        await this.lancamentoService.vincularNotaFiscal(
          evento.tenantId,
          evento.pedidoId,
          evento.notaFiscalId,
        );
      }

      this.logger.log(
        `Nota fiscal ${evento.notaFiscalId} vinculada aos lançamentos`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao processar ${TOPICOS_KAFKA.NOTA_AUTORIZADA}: ${erro.message}`,
      );
    }
  }
}
