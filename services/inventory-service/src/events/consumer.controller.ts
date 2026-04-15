/**
 * Consumer de eventos Kafka para o Inventory Service.
 *
 * Escuta eventos de outros serviços e reage:
 * - Produto criado → Inicializa saldo zero
 * - Pedido criado → Reserva estoque
 * - Pedido pago → Confirma reserva (baixa definitiva)
 * - Pedido cancelado → Libera reserva
 */

import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { EstoqueService } from '../modules/estoque/estoque.service';
import { TOPICOS_CONSUMIDOS } from '../config/kafka.config';

@Controller()
export class ConsumerController {
  constructor(private readonly estoqueService: EstoqueService) {}

  /**
   * Quando um novo produto é criado no catálogo,
   * inicializa o saldo de estoque zerado no depósito padrão.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PRODUTO_CRIADO)
  async handleProdutoCriado(@Payload() evento: any) {
    console.log(`📥 Evento recebido: produto.criado [${evento.dados.sku}]`);

    await this.estoqueService.inicializarEstoque(
      evento.tenantId,
      evento.dados.produtoId,
      evento.dados.sku,
    );
  }

  /**
   * Quando um pedido é criado, reserva o estoque dos itens.
   * A reserva impede que o mesmo estoque seja vendido duas vezes.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_CRIADO)
  async handlePedidoCriado(@Payload() evento: any) {
    console.log(`📥 Evento recebido: pedido.criado [${evento.dados.pedidoId}]`);

    for (const item of evento.dados.itens) {
      await this.estoqueService.reservar(
        evento.tenantId,
        item.produtoId,
        item.quantidade,
        evento.dados.pedidoId,
      );
    }
  }

  /**
   * Quando um pedido é pago, confirma as reservas (baixa definitiva).
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_PAGO)
  async handlePedidoPago(@Payload() evento: any) {
    console.log(`📥 Evento recebido: pedido.pago [${evento.dados.pedidoId}]`);

    await this.estoqueService.confirmarReservas(
      evento.tenantId,
      evento.dados.pedidoId,
    );
  }

  /**
   * Quando um pedido é cancelado, libera as reservas.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PEDIDO_CANCELADO)
  async handlePedidoCancelado(@Payload() evento: any) {
    console.log(`📥 Evento recebido: pedido.cancelado [${evento.dados.pedidoId}]`);

    await this.estoqueService.cancelarReservas(
      evento.tenantId,
      evento.dados.pedidoId,
    );
  }
}
