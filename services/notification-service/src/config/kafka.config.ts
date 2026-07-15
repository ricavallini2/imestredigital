/**
 * ═══════════════════════════════════════════════════════════════
 * Configuração de Tópicos Kafka (Redpanda) - Notification Service
 * ═══════════════════════════════════════════════════════════════
 *
 * O notification-service é um CONSUMIDOR: escuta eventos publicados por
 * outros serviços e dispara notificações automaticamente.
 *
 * IMPORTANTE — os nomes DEVEM casar EXATAMENTE com o que cada produtor
 * publica (via ClientKafka.emit → consumir com @EventPattern). Fonte de
 * cada string (verificado nos config/kafka.config.ts dos produtores):
 *
 *   order-service      → 'pedido.*'                     (payload plano)
 *   inventory-service  → 'estoque.alerta.*'             (payload plano)
 *   fiscal-service     → 'fiscal.nota-*'                (payload plano)
 *   financial-service  → 'lancamento.*'                 (payload plano)
 *   marketplace-service→ 'marketplace-*'   (hífens!)    (payload plano)
 */
export const TOPICOS_CONSUMIDOS = {
  // ─── order-service ────────────────────────────────────────
  PEDIDO_CRIADO: 'pedido.criado',
  PEDIDO_CONFIRMADO: 'pedido.confirmado',
  PEDIDO_ENVIADO: 'pedido.enviado',
  PEDIDO_ENTREGUE: 'pedido.entregue',
  PEDIDO_CANCELADO: 'pedido.cancelado',
  PEDIDO_PAGO: 'pedido.pago',

  // ─── inventory-service ────────────────────────────────────
  ESTOQUE_BAIXO: 'estoque.alerta.estoque-baixo',
  ESTOQUE_ZERADO: 'estoque.alerta.estoque-zerado',

  // ─── fiscal-service ───────────────────────────────────────
  NOTA_AUTORIZADA: 'nota.autorizada',
  NOTA_REJEITADA: 'nota.rejeitada',

  // ─── marketplace-service (tópicos com hífen) ──────────────
  MARKETPLACE_PERGUNTA_RECEBIDA: 'marketplace-pergunta-recebida',
  MARKETPLACE_PEDIDO_RECEBIDO: 'marketplace-pedido-recebido',
} as const
