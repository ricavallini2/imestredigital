/**
 * Configuração de Kafka
 * Define tópicos e grupos de consumo do Fiscal Service.
 */

export const TOPICOS_KAFKA = {
  // ─── Eventos Publicados ─────────────────────
  NOTA_EMITIDA: 'fiscal.nota-emitida',
  NOTA_AUTORIZADA: 'fiscal.nota-autorizada',
  NOTA_REJEITADA: 'fiscal.nota-rejeitada',
  NOTA_CANCELADA: 'fiscal.nota-cancelada',
  SPED_GERADO: 'fiscal.sped-gerado',

  // ─── Eventos Consumidos ─────────────────────
  PEDIDO_FATURAR: 'order.pedido-criado', // Do order-service
  PRODUTO_ATUALIZADO: 'catalog.produto-atualizado', // Do catalog-service
};

export const GRUPOS_KAFKA = {
  FISCAL_SERVICE: 'fiscal-service-group',
};
