/**
 * Configuração de Kafka
 * Define tópicos e grupos de consumo do Fiscal Service.
 */

export const TOPICOS_KAFKA = {
  // ─── Eventos Publicados (nomenclatura canônica da saga: entidade.evento) ──
  NOTA_EMITIDA: 'nota.emitida',
  NOTA_AUTORIZADA: 'nota.autorizada', // consumido pelo order-service (marca FATURADO)
  NOTA_REJEITADA: 'nota.rejeitada',
  NOTA_CANCELADA: 'nota.cancelada',
  SPED_GERADO: 'fiscal.sped-gerado',

  // ─── Eventos Consumidos ─────────────────────
  // O order-service publica em 'pedido.faturar' ao solicitar o faturamento
  // (services/order-service/src/config/kafka.config.ts).
  PEDIDO_FATURAR: 'pedido.faturar',
  // O catalog-service publica em 'catalogo.produto.atualizado'.
  PRODUTO_ATUALIZADO: 'catalogo.produto.atualizado',
};

export const GRUPOS_KAFKA = {
  FISCAL_SERVICE: 'fiscal-service-group',
};
