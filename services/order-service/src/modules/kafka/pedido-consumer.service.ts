/**
 * ═══════════════════════════════════════════════════════════════
 * Serviço Consumidor de Eventos - Order Service
 * ═══════════════════════════════════════════════════════════════
 *
 * Consome eventos de outros serviços e atualiza estado do order-service:
 * - NOTA_AUTORIZADA (fiscal-service): marca pedido como FATURADO
 * - ESTOQUE_RESERVADO (inventory-service): inicia separação
 * - ESTOQUE_INSUFICIENTE (inventory-service): notifica problema
 * - MARKETPLACE_PEDIDO_RECEBIDO (marketplace-service): cria pedido novo
 * - PAGAMENTO_AUTORIZADO (payment-service): atualiza pagamento
 *
 * Este arquivo está vazio propositalmente para manter compatibilidade.
 * Os decoradores @EventPattern são definidos no ConsumidorEventosController.
 */

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PedidoConsumerService {
  private readonly logger = new Logger('PedidoConsumerService');

  constructor() {
    this.logger.log('Serviço consumidor de eventos inicializado');
  }
}
