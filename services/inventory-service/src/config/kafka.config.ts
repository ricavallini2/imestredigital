/**
 * Tópicos Kafka do Inventory Service.
 * Comentários em português PT-BR.
 */

export const TOPICOS_ESTOQUE = {
  /** Estoque foi atualizado (entrada ou saída) */
  ESTOQUE_ATUALIZADO: 'estoque.saldo.atualizado',
  /** Estoque abaixo do mínimo */
  ESTOQUE_BAIXO: 'estoque.alerta.estoque-baixo',
  /** Estoque zerado */
  ESTOQUE_ZERADO: 'estoque.alerta.estoque-zerado',
  /** Transferência entre depósitos */
  TRANSFERENCIA_REALIZADA: 'estoque.transferencia.realizada',
} as const;

/**
 * Tópicos da SAGA de pedidos publicados por este serviço (payload PLANO).
 *
 * CONTRATO CANÔNICO — os nomes e o formato DEVEM casar exatamente com o
 * consumidor do order-service (ConsumidorEventosController):
 * - estoque.reservado    → { tenantId, pedidoId, itensReservados: [...] }
 * - estoque.insuficiente → { tenantId, pedidoId, itensFaltantes: [{ produtoId, sku, quantidadeSolicitada, disponivel, quantidadeFaltante }] }
 * - estoque.liberado     → { tenantId, pedidoId, itens: [...] }
 *
 * Publicados via ProducerService.publicarPlano (sem envelope `.dados`).
 */
export const TOPICOS_SAGA = {
  ESTOQUE_RESERVADO: 'estoque.reservado',
  ESTOQUE_INSUFICIENTE: 'estoque.insuficiente',
  ESTOQUE_LIBERADO: 'estoque.liberado',
} as const;

/**
 * Tópicos que este serviço consome (de outros serviços).
 *
 * IMPORTANTE — os nomes DEVEM casar exatamente com o que o produtor publica:
 * - catalog-service publica em 'catalogo.produto.*' (produtor customizado,
 *   payload com envelope { tenantId, tipo, dados, ... }).
 * - order-service publica em 'pedido.*' (ClientKafka.emit, payload PLANO
 *   { tenantId, pedidoId, ... } — sem wrapper .dados).
 */
export const TOPICOS_CONSUMIDOS = {
  PRODUTO_CRIADO: 'catalogo.produto.criado',
  PRODUTO_REMOVIDO: 'catalogo.produto.removido',
  PEDIDO_CRIADO: 'pedido.criado',
  PEDIDO_CANCELADO: 'pedido.cancelado',
  PEDIDO_PAGO: 'pedido.pago',
} as const;
