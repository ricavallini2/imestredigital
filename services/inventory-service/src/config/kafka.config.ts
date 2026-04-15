/**
 * Tópicos Kafka do Inventory Service.
 * Comentários em português PT-BR.
 */

export const TOPICOS_ESTOQUE = {
  /** Estoque foi atualizado (entrada ou saída) */
  ESTOQUE_ATUALIZADO: 'estoque.saldo.atualizado',
  /** Estoque foi reservado para um pedido */
  ESTOQUE_RESERVADO: 'estoque.reserva.criada',
  /** Reserva foi confirmada (pedido pago) */
  RESERVA_CONFIRMADA: 'estoque.reserva.confirmada',
  /** Reserva foi cancelada (pedido cancelado) */
  RESERVA_CANCELADA: 'estoque.reserva.cancelada',
  /** Estoque abaixo do mínimo */
  ESTOQUE_BAIXO: 'estoque.alerta.estoque-baixo',
  /** Estoque zerado */
  ESTOQUE_ZERADO: 'estoque.alerta.estoque-zerado',
  /** Transferência entre depósitos */
  TRANSFERENCIA_REALIZADA: 'estoque.transferencia.realizada',
} as const;

/** Tópicos que este serviço consome (de outros serviços) */
export const TOPICOS_CONSUMIDOS = {
  PRODUTO_CRIADO: 'catalogo.produto.criado',
  PRODUTO_REMOVIDO: 'catalogo.produto.removido',
  PEDIDO_CRIADO: 'pedidos.pedido.criado',
  PEDIDO_CANCELADO: 'pedidos.pedido.cancelado',
  PEDIDO_PAGO: 'pedidos.pedido.pago',
} as const;
