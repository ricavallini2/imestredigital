/**
 * Interface base para adapters de integração com marketplaces
 * Define contrato que todos os marketplaces devem implementar
 */

// ============================================================================
// TIPOS BÁSICOS
// ============================================================================

/**
 * Tokens de autenticação retornados pela integração
 */
export interface TokensAuth {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  expiresAt?: Date;
  scope?: string;
}

/**
 * Dados de um pedido no marketplace
 */
export interface PedidoExterno {
  id: string;
  numeroMarketplace: string;
  status: string;
  statusMarketplace: string;
  comprador: {
    nome: string;
    cpf?: string;
    email: string;
    telefone?: string;
  };
  itens: Array<{
    id: string;
    sku: string;
    titulo: string;
    quantidade: number;
    preco: number;
    precoTotal: number;
  }>;
  valorTotal: number;
  valorFrete: number;
  valorDesconto?: number;
  enderecoEntrega: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    referencia?: string;
  };
  etiquetaEnvio?: string;
  codigoRastreio?: string;
  dataVenda: Date;
  dataAprovacao?: Date;
  dataEnvio?: Date;
  prazoEnvio?: Date;
  observacoes?: string;
}

/**
 * Dados de um anúncio/produto no marketplace
 */
export interface AnuncioExterno {
  id: string;
  sku: string;
  titulo: string;
  descricao: string;
  preco: number;
  precoPromocional?: number;
  estoque: number;
  status: string;
  url: string;
  categoria: string;
  fotos: string[];
  atributos: Record<string, any>;
  metricas?: {
    visitas: number;
    vendas: number;
    perguntas: number;
  };
}

/**
 * Dados de uma pergunta no marketplace
 */
export interface PerguntaExterna {
  id: string;
  anuncioId: string;
  pergunta: string;
  resposta?: string;
  status: string;
  compradorNome: string;
  dataEnvio: Date;
  dataResposta?: Date;
}

/**
 * Métricas de um anúncio
 */
export interface MetricasAnuncio {
  anuncioId: string;
  visitas: number;
  vendas: number;
  perguntas: number;
  conversao: number;
  dataAtualizacao: Date;
}

/**
 * Dados para criar anúncio
 */
export interface DadosCriarAnuncio {
  sku: string;
  titulo: string;
  descricao: string;
  preco: number;
  precoPromocional?: number;
  estoque: number;
  categoria: string;
  fotos: string[];
  atributos?: Record<string, any>;
  condicao?: 'novo' | 'usado';
}

/**
 * Dados para atualizar anúncio
 */
export interface DadosAtualizarAnuncio {
  titulo?: string;
  descricao?: string;
  preco?: number;
  precoPromocional?: number;
  estoque?: number;
  fotos?: string[];
  atributos?: Record<string, any>;
}

// ============================================================================
// INTERFACE PRINCIPAL
// ============================================================================

/**
 * Interface que todos os adapters de marketplace devem implementar
 */
export interface IIntegracaoMarketplace {
  /**
   * Autentica no marketplace usando credenciais
   * Retorna tokens de autenticação
   */
  autenticar(credenciais: Record<string, any>): Promise<TokensAuth>;

  /**
   * Renova token de autenticação expirado
   */
  renovarToken(refreshToken: string): Promise<TokensAuth>;

  /**
   * Lista pedidos do marketplace
   */
  listarPedidos(filtros?: {
    status?: string;
    dataInicio?: Date;
    dataFim?: Date;
    pagina?: number;
    limite?: number;
  }): Promise<PedidoExterno[]>;

  /**
   * Obtém um pedido específico do marketplace
   */
  obterPedido(pedidoId: string): Promise<PedidoExterno>;

  /**
   * Cria novo anúncio no marketplace
   */
  criarAnuncio(dados: DadosCriarAnuncio): Promise<AnuncioExterno>;

  /**
   * Atualiza anúncio existente no marketplace
   */
  atualizarAnuncio(
    anuncioId: string,
    dados: DadosAtualizarAnuncio,
  ): Promise<void>;

  /**
   * Pausa um anúncio (não deleta)
   */
  pausarAnuncio(anuncioId: string): Promise<void>;

  /**
   * Reativa um anúncio pausado
   */
  reativarAnuncio(anuncioId: string): Promise<void>;

  /**
   * Encerra um anúncio permanentemente
   */
  encerrarAnuncio(anuncioId: string): Promise<void>;

  /**
   * Atualiza estoque/quantidade de um anúncio
   */
  atualizarEstoque(anuncioId: string, quantidade: number): Promise<void>;

  /**
   * Atualiza preço de um anúncio
   */
  atualizarPreco(
    anuncioId: string,
    preco: number,
    precoPromocional?: number,
  ): Promise<void>;

  /**
   * Envia rastreio/código de rastreamento para um pedido
   */
  enviarRastreio(pedidoId: string, codigoRastreio: string): Promise<void>;

  /**
   * Lista perguntas pendentes de resposta
   */
  listarPerguntas(filtros?: {
    anuncioId?: string;
    status?: string;
    pagina?: number;
    limite?: number;
  }): Promise<PerguntaExterna[]>;

  /**
   * Responde pergunta de um comprador
   */
  responderPergunta(perguntaId: string, resposta: string): Promise<void>;

  /**
   * Obtém métricas de um anúncio
   */
  obterMetricas(anuncioId: string): Promise<MetricasAnuncio>;

  /**
   * Obtém categorias disponíveis no marketplace
   */
  obterCategorias(): Promise<Array<{ id: string; nome: string }>>;

  /**
   * Obtém atributos obrigatórios de uma categoria
   */
  obterAtributosCategoria(
    categoriaId: string,
  ): Promise<Array<{ id: string; nome: string; obrigatorio: boolean }>>;

  /**
   * Valida se as credenciais são válidas
   */
  validarCredenciais(credenciais: Record<string, any>): Promise<boolean>;
}
