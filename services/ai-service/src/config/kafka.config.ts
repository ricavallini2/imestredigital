/**
 * Configuração centralizada de Kafka/Redpanda
 *
 * Define:
 * - Tópicos que este serviço publica
 * - Tópicos que este serviço consome
 * - Configuração do cliente Kafka
 */

export const TOPICOS_PUBLICADOS = {
  // Insights gerados e analisados
  INSIGHT_GERADO: 'ia.insight_gerado',

  // Previsões de demanda calculadas
  PREVISAO_CALCULADA: 'ia.previsao_calculada',

  // Sugestões criadas (preço, classificação, etc)
  SUGESTAO_CRIADA: 'ia.sugestao_criada',

  // Classificação fiscal completada
  CLASSIFICACAO_COMPLETADA: 'ia.classificacao_completada',
} as const;

export const TOPICOS_CONSUMIDOS = {
  // De pedidos/vendas
  PEDIDO_CRIADO: 'pedidos.pedido_criado',
  PEDIDO_PAGO: 'pedidos.pedido_pago',

  // De produtos/catálogo
  PRODUTO_CRIADO: 'catalogo.produto_criado',
  PRODUTO_ATUALIZADO: 'catalogo.produto_atualizado',

  // De estoque
  ESTOQUE_ATUALIZADO: 'estoque.estoque_atualizado',
  ESTOQUE_CRITICO: 'estoque.estoque_critico',

  // De financeiro
  LANCAMENTO_CRIADO: 'financeiro.lancamento_criado',

  // De fiscal
  NOTA_AUTORIZADA: 'fiscal.nota_autorizada',
} as const;

export const kafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || 'ai-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  ssl: process.env.KAFKA_SSL === 'true',
  sasl: process.env.KAFKA_ENABLE_SASL === 'true'
    ? {
        mechanism: 'scram-sha-256',
        username: process.env.KAFKA_USERNAME || '',
        password: process.env.KAFKA_PASSWORD || '',
      }
    : undefined,
  connectionTimeout: 10000,
  requestTimeout: 30000,
};

export const consumerGroupId = process.env.KAFKA_GROUP_ID || 'ai-service-group';
