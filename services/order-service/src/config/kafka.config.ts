/**
 * ═══════════════════════════════════════════════════════════════
 * Configuração de Tópicos Kafka (Redpanda) - Order Service
 * ═══════════════════════════════════════════════════════════════
 *
 * Define todos os eventos que o Order Service publica e consome.
 * Padrão: ENTIDADE_EVENTO (ex: PEDIDO_CRIADO, PEDIDO_FATURADO)
 */

// ─── Tópicos Publicados pelo Order Service ──────────────────

export const TOPICOS_PEDIDO = {
  // Ciclo de vida do pedido
  PEDIDO_CRIADO: 'pedido.criado',
  PEDIDO_CONFIRMADO: 'pedido.confirmado',
  PEDIDO_SEPARANDO: 'pedido.separando',
  PEDIDO_SEPARADO: 'pedido.separado',
  PEDIDO_FATURAR: 'pedido.faturar', // enviado ao fiscal-service
  PEDIDO_FATURADO: 'pedido.faturado', // recebido do fiscal-service
  PEDIDO_ENVIADO: 'pedido.enviado',
  PEDIDO_ENTREGUE: 'pedido.entregue',
  PEDIDO_CANCELADO: 'pedido.cancelado',

  // Pagamento
  PEDIDO_PAGO: 'pedido.pago',
  PEDIDO_PAGAMENTO_RECUSADO: 'pedido.pagamento.recusado',

  // Devolução
  DEVOLUCAO_SOLICITADA: 'devolucao.solicitada',
  DEVOLUCAO_APROVADA: 'devolucao.aprovada',
  DEVOLUCAO_RECEBIDA: 'devolucao.recebida',
  DEVOLUCAO_REEMBOLSADA: 'devolucao.reembolsada',
} as const;

// ─── Tópicos Consumidos (de outros serviços) ────────────────

export const TOPICOS_CONSUMIDOS = {
  // De fiscal-service
  NOTA_AUTORIZADA: 'nota.autorizada',
  NOTA_CANCELADA: 'nota.cancelada',

  // De inventory-service
  ESTOQUE_RESERVADO: 'estoque.reservado',
  ESTOQUE_INSUFICIENTE: 'estoque.insuficiente',
  ESTOQUE_LIBERADO: 'estoque.liberado',

  // De marketplace-service (integrador com marketplaces)
  MARKETPLACE_PEDIDO_RECEBIDO: 'marketplace.pedido.recebido',
  MARKETPLACE_PEDIDO_CANCELADO: 'marketplace.pedido.cancelado',

  // De payment-service
  PAGAMENTO_AUTORIZADO: 'pagamento.autorizado',
  PAGAMENTO_CAPTURADO: 'pagamento.capturado',
  PAGAMENTO_RECUSADO: 'pagamento.recusado',
} as const;

/**
 * Configuração de schema para eventos.
 * Cada evento tem versão para suportar evolução de schema.
 */
export const SCHEMA_EVENTOS = {
  versao: '1.0',
  encoding: 'utf-8',
} as const;
