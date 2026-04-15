/**
 * Configuração de tópicos Kafka para o Marketplace Service
 * Define todos os tópicos que o serviço produz e consome
 */

// ============================================================================
// TÓPICOS PRODUZIDOS
// ============================================================================

/**
 * Eventos produzidos pelo Marketplace Service para outros serviços
 */
export const TOPICOS_PRODUZIDOS = {
  // Pedidos recebidos dos marketplaces
  MARKETPLACE_PEDIDO_RECEBIDO: 'marketplace-pedido-recebido',

  // Anúncios criados/atualizados
  MARKETPLACE_ANUNCIO_CRIADO: 'marketplace-anuncio-criado',
  MARKETPLACE_ANUNCIO_ATUALIZADO: 'marketplace-anuncio-atualizado',

  // Estoque sincronizado
  MARKETPLACE_ESTOQUE_SINCRONIZADO: 'marketplace-estoque-sincronizado',

  // Preços sincronizados
  MARKETPLACE_PRECO_SINCRONIZADO: 'marketplace-preco-sincronizado',

  // Perguntas recebidas
  MARKETPLACE_PERGUNTA_RECEBIDA: 'marketplace-pergunta-recebida',

  // Erros de sincronização
  MARKETPLACE_ERRO_SINCRONIZACAO: 'marketplace-erro-sincronizacao',

  // Conta conectada/desconectada
  MARKETPLACE_CONTA_CONECTADA: 'marketplace-conta-conectada',
  MARKETPLACE_CONTA_DESCONECTADA: 'marketplace-conta-desconectada',
} as const;

// ============================================================================
// TÓPICOS CONSUMIDOS
// ============================================================================

/**
 * Eventos consumidos de outros serviços
 */
export const TOPICOS_CONSUMIDOS = {
  // Do Catalog Service
  PRODUTO_CRIADO: 'produto-criado',
  PRODUTO_ATUALIZADO: 'produto-atualizado',
  PRODUTO_DELETADO: 'produto-deletado',

  // Do Inventory Service
  ESTOQUE_ATUALIZADO: 'estoque-atualizado',

  // Do Pricing Service
  PRECO_ALTERADO: 'preco-alterado',

  // Do Order Service
  PEDIDO_ENVIADO: 'pedido-enviado',
  PEDIDO_CANCELADO: 'pedido-cancelado',
  PEDIDO_DEVOLVIDO: 'pedido-devolvido',
} as const;

// ============================================================================
// INTERFACE DE PADRÕES DE MENSAGEM
// ============================================================================

/**
 * Estrutura padrão de mensagens Kafka
 */
export interface MensagemKafka {
  id: string; // ID único da mensagem (para idempotência)
  tenantId: string; // Identificador do tenant
  tipo: string; // Tipo de evento
  timestamp: number; // Timestamp da criação
  dados: Record<string, any>; // Dados do evento
  origem?: string; // Serviço de origem
}

/**
 * Estrutura de mensagem de erro
 */
export interface MensagemErroKafka extends MensagemKafka {
  erro: {
    codigo: string;
    mensagem: string;
    detalhes?: any;
  };
}

// ============================================================================
// SCHEMAS DE EVENTOS
// ============================================================================

/**
 * Evento: Produto criado no catálogo
 */
export interface EventoProdutoCriado extends MensagemKafka {
  dados: {
    produtoId: string;
    nome: string;
    sku: string;
    descricao: string;
    preco: number;
    estoque: number;
    categoriaId: string;
    imagens: string[];
    atributos: Record<string, any>;
  };
}

/**
 * Evento: Produto atualizado no catálogo
 */
export interface EventoProdutoAtualizado extends MensagemKafka {
  dados: {
    produtoId: string;
    nome?: string;
    descricao?: string;
    preco?: number;
    categoriaId?: string;
    imagens?: string[];
    atributos?: Record<string, any>;
  };
}

/**
 * Evento: Estoque atualizado
 */
export interface EventoEstoqueAtualizado extends MensagemKafka {
  dados: {
    produtoId: string;
    variacaoId?: string;
    quantidadeAnterior: number;
    quantidadeNova: number;
    motivo: string;
  };
}

/**
 * Evento: Preço alterado
 */
export interface EventoPrecoAlterado extends MensagemKafka {
  dados: {
    produtoId: string;
    variacaoId?: string;
    precoAnterior: number;
    precoNovo: number;
    precoPromocional?: number;
    dataPromocao?: {
      inicio: string;
      fim: string;
    };
  };
}

/**
 * Evento: Pedido enviado (pronto para sincronizar com marketplace)
 */
export interface EventoPedidoEnviado extends MensagemKafka {
  dados: {
    pedidoId: string;
    marketplacePedidoId: string;
    marketplace: string;
    codigoRastreio: string;
    dataEnvio: string;
  };
}

/**
 * Evento: Pedido cancelado
 */
export interface EventoPedidoCancelado extends MensagemKafka {
  dados: {
    pedidoId: string;
    marketplacePedidoId: string;
    marketplace: string;
    motivo: string;
  };
}

/**
 * Evento: Pedido recebido do marketplace
 */
export interface EventoMarketplacePedidoRecebido extends MensagemKafka {
  dados: {
    pedidoMarketplaceId: string;
    marketplace: string;
    marketplacePedidoId: string;
    comprador: {
      nome: string;
      cpf?: string;
      email: string;
      telefone?: string;
    };
    itens: Array<{
      marketplaceItemId: string;
      produto: string;
      quantidade: number;
      preco: number;
    }>;
    valorTotal: number;
    valorFrete: number;
    enderecoEntrega: Record<string, any>;
    dataVenda: string;
  };
}

/**
 * Evento: Anúncio criado no marketplace
 */
export interface EventoMarketplaceAnuncioCriado extends MensagemKafka {
  dados: {
    anuncioId: string;
    marketplace: string;
    marketplaceItemId: string;
    produtoId: string;
    titulo: string;
    status: string;
    url: string;
  };
}

/**
 * Evento: Pergunta recebida no marketplace
 */
export interface EventoMarketplacePerguntaRecebida extends MensagemKafka {
  dados: {
    perguntaId: string;
    marketplace: string;
    anuncioId: string;
    compradorNome: string;
    pergunta: string;
    dataEnvio: string;
  };
}
