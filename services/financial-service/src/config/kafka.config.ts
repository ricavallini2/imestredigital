/**
 * Configuração centralizada de Kafka para o Financial Service.
 * Define tópicos produzidos e consumidos.
 */

export const TOPICOS_KAFKA = {
  // ─── Produzidos pelo Financial Service ──────────────────
  LANCAMENTO_CRIADO: 'lancamento.criado',
  LANCAMENTO_PAGO: 'lancamento.pago',
  LANCAMENTO_ATRASADO: 'lancamento.atrasado',
  LANCAMENTO_CANCELADO: 'lancamento.cancelado',
  FLUXO_CAIXA_ATUALIZADO: 'fluxo-caixa.atualizado',
  DRE_GERADO: 'dre.gerado',
  TRANSFERENCIA_REALIZADA: 'transferencia.realizada',
  RECORRENCIA_PROCESSADA: 'recorrencia.processada',

  // ─── Consumidos de outros serviços ─────────────────────
  PEDIDO_PAGO: 'pedido.pago', // order-service
  PEDIDO_CANCELADO: 'pedido.cancelado', // order-service
  NOTA_AUTORIZADA: 'nota.autorizada', // fiscal-service
} as const;

/**
 * Configuração para conexão com Kafka.
 */
export const kafkaConfig = {
  client: {
    clientId: 'financial-service',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  },
  consumer: {
    groupId: process.env.KAFKA_GROUP_ID || 'financial-service-group',
  },
};
