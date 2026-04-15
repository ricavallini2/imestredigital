/**
 * Configuração do cliente Kafka para o Catalog Service.
 *
 * Define os tópicos de eventos produzidos pelo serviço de catálogo
 * e a configuração de conexão com o broker (Redpanda em dev).
 */

/** Tópicos de eventos do catálogo */
export const TOPICOS_CATALOGO = {
  /** Produto foi criado */
  PRODUTO_CRIADO: 'catalogo.produto.criado',
  /** Produto foi atualizado */
  PRODUTO_ATUALIZADO: 'catalogo.produto.atualizado',
  /** Preço de produto foi alterado */
  PRECO_ALTERADO: 'catalogo.produto.preco-alterado',
  /** Produto foi removido (soft delete) */
  PRODUTO_REMOVIDO: 'catalogo.produto.removido',
  /** Categoria foi criada ou atualizada */
  CATEGORIA_ATUALIZADA: 'catalogo.categoria.atualizada',
} as const;

/** Configuração padrão do Kafka */
export const kafkaConfig = {
  clientId: 'catalog-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  groupId: 'catalog-service-group',
};
