/**
 * Consumer de eventos Kafka para o Inventory Service.
 *
 * Escuta eventos de outros serviços e reage:
 * - Produto criado → Inicializa saldo zero
 * - Pedido criado → Reserva estoque
 * - Pedido pago → Confirma reserva (baixa definitiva)
 * - Pedido cancelado → Libera reserva
 *
 * ATENÇÃO aos dois formatos de payload distintos:
 * - catalog-service usa um produtor customizado com envelope
 *   { tenantId, tipo, dados, timestamp } → ler de `evento.dados.*`.
 * - order-service usa ClientKafka.emit com payload PLANO
 *   { tenantId, pedidoId, itens, ... } → ler direto de `evento.*`.
 */

import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { EstoqueService } from '../modules/estoque/estoque.service';
import { TOPICOS_CONSUMIDOS } from '../config/kafka.config';

/** Envelope publicado pelo catalog-service (produtor customizado). */
interface EventoCatalogo<T> {
  tenantId: string;
  tipo?: string;
  timestamp?: string;
  dados: T;
}

/** Payload plano de pedido.criado publicado pelo order-service. */
interface EventoPedidoCriado {
  tenantId: string;
  pedidoId: string;
  numero?: string;
  cliente?: string;
  itens: Array<{ produtoId: string; sku?: string; quantidade: number }>;
  valorTotal?: number;
  timestamp?: string;
}

/** Payload plano de pedido.pago / pedido.cancelado publicado pelo order-service. */
interface EventoPedido {
  tenantId: string;
  pedidoId: string;
  motivo?: string;
  timestamp?: string;
}

@Controller()
export class ConsumerController {
  private readonly logger = new Logger(ConsumerController.name);

  constructor(private readonly estoqueService: EstoqueService) {}

  /**
   * Quando um novo produto é criado no catálogo,
   * inicializa o saldo de estoque zerado no depósito padrão.
   * (catalog-service → envelope com `.dados`)
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PRODUTO_CRIADO)
  async handleProdutoCriado(
    @Payload() evento: EventoCatalogo<{ produtoId: string; sku: string }>,
  ) {
    const dados = evento?.dados;
    if (!evento?.tenantId || !dados?.produtoId) {
      this.logger.warn('produto.criado ignorado: payload incompleto');
      return;
    }

    this.logger.log(`Evento recebido: produto.criado [${dados.sku}]`);
    await this.estoqueService.inicializarEstoque(
      evento.tenantId,
      dados.produtoId,
      dados.sku,
    );
  }

  /**
   * Quando um pedido é criado, reserva o estoque de todos os itens.
   * A reserva impede que o mesmo estoque seja vendido duas vezes.
   * (order-service → payload PLANO, sem `.dados`)
   *
   * Idempotente: dedup por (pedido.criado, pedidoId). Reentregas do broker
   * não geram nova reserva. A reação (reservar / publicar insuficiente) fica
   * no EstoqueService.reservarPedido.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_CRIADO)
  async handlePedidoCriado(@Payload() evento: EventoPedidoCriado) {
    if (!evento?.tenantId || !evento?.pedidoId || !Array.isArray(evento?.itens)) {
      this.logger.warn('pedido.criado ignorado: payload incompleto');
      return;
    }

    const novo = await this.estoqueService.registrarEvento(
      evento.tenantId,
      TOPICOS_CONSUMIDOS.PEDIDO_CRIADO,
      evento.pedidoId,
    );
    if (!novo) {
      this.logger.log(`pedido.criado [${evento.pedidoId}] já processado — ignorado`);
      return;
    }

    this.logger.log(`Evento recebido: pedido.criado [${evento.pedidoId}]`);
    await this.estoqueService.reservarPedido(
      evento.tenantId,
      evento.pedidoId,
      evento.itens,
    );
  }

  /**
   * Quando um pedido é pago, confirma as reservas (baixa definitiva).
   * (order-service → payload PLANO, sem `.dados`)
   *
   * Idempotente: dedup por (pedido.pago, pedidoId).
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_PAGO)
  async handlePedidoPago(@Payload() evento: EventoPedido) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('pedido.pago ignorado: payload incompleto');
      return;
    }

    const novo = await this.estoqueService.registrarEvento(
      evento.tenantId,
      TOPICOS_CONSUMIDOS.PEDIDO_PAGO,
      evento.pedidoId,
    );
    if (!novo) {
      this.logger.log(`pedido.pago [${evento.pedidoId}] já processado — ignorado`);
      return;
    }

    this.logger.log(`Evento recebido: pedido.pago [${evento.pedidoId}]`);
    await this.estoqueService.confirmarReservas(evento.tenantId, evento.pedidoId);
  }

  /**
   * Quando um pedido é cancelado, libera as reservas.
   * (order-service → payload PLANO, sem `.dados`)
   *
   * Idempotente: dedup por (pedido.cancelado, pedidoId).
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_CANCELADO)
  async handlePedidoCancelado(@Payload() evento: EventoPedido) {
    if (!evento?.tenantId || !evento?.pedidoId) {
      this.logger.warn('pedido.cancelado ignorado: payload incompleto');
      return;
    }

    const novo = await this.estoqueService.registrarEvento(
      evento.tenantId,
      TOPICOS_CONSUMIDOS.PEDIDO_CANCELADO,
      evento.pedidoId,
    );
    if (!novo) {
      this.logger.log(`pedido.cancelado [${evento.pedidoId}] já processado — ignorado`);
      return;
    }

    this.logger.log(`Evento recebido: pedido.cancelado [${evento.pedidoId}]`);
    await this.estoqueService.cancelarReservas(evento.tenantId, evento.pedidoId);
  }
}
