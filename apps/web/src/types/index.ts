/**
 * Tipos TypeScript centralizados para o frontend iMestreDigital.
 * Alinhados com os DTOs e modelos dos microserviços backend.
 */

// ═══════════════════════════════════════════════════════════
// PAGINAÇÃO (envelope canônico de todos os endpoints de listagem)
// ═══════════════════════════════════════════════════════════
//
// Formato PLANO canônico da Fase 0 (fonte da verdade do backend, mocks e front):
//   { dados, total, pagina, limite, totalPaginas }
// Todos os serviços/handlers de listagem devem responder exatamente isto.

export interface RespostaPaginada<T> {
  dados: T[]
  total: number
  pagina: number
  limite: number
  totalPaginas: number
}

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════

export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  tenant: {
    id: string;
    nome: string;
    plano: string;
  };
}

export interface RespostaLogin {
  usuario: UsuarioLogado;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

// ═══════════════════════════════════════════════════════════
// PRODUTOS (catalog-service)
// ═══════════════════════════════════════════════════════════

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  sku: string;
  ean?: string;
  ncm?: string;
  preco: number;
  precoCusto?: number;
  precoPromocional?: number;
  /** Margem sobre o preço de venda (%), derivada no service. 1 casa decimal. */
  margem?: number;
  /** Alias de `margem` mantido para compatibilidade com a UI existente. */
  margemLucro?: number;
  categoria?: string;
  categoriaId?: string;
  marca?: string;
  descricaoCurta?: string;
  // Alinhado ao enum Prisma `StatusProduto` (catalog-service).
  status: 'ATIVO' | 'INATIVO' | 'RASCUNHO' | 'ESGOTADO' | 'DESCONTINUADO';
  imagens?: string[];
  tags?: string[];
  // Fiscais (catalog-service)
  cest?: string;
  origem?: number;
  unidadeMedida?: string;
  cfop?: string;
  estoqueMinimo?: number;
  peso?: number;
  altura?: number;
  largura?: number;
  comprimento?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface FiltrosProduto {
  busca?: string;
  status?: string;
  categoriaId?: string;
  pagina?: number;
  limite?: number;
  itensPorPagina?: number; // alias usado pelo catalog-service
  ordenarPor?: string;
  ordem?: 'ASC' | 'DESC';
}

// ═══════════════════════════════════════════════════════════
// GRADES DE TAMANHO (catalog-service)
// ═══════════════════════════════════════════════════════════
//
// Grade = conjunto reutilizável de tamanhos padrão do varejo BR (ex.:
// "Numérica Calçados" → 34..44, "Vestuário" → PP..GG). Cada grade é POR TENANT.
// Usada no wizard de variação para gerar a matriz de variações do produto.

/** Um tamanho dentro de uma grade (valor + posição de exibição). */
export interface GradeTamanho {
  id: string;
  valor: string; // ex.: '38', 'PP', 'G'
  ordem: number;
}

/** Grade de tamanhos reutilizável (contrato canônico do backend). */
export interface Grade {
  id: string;
  nome: string;
  descricao?: string;
  ativa: boolean;
  tamanhos: GradeTamanho[];
  criadoEm?: string;
  atualizadoEm?: string;
}

/** DTO de criação/edição de grade (campos aceitos pelo catalog-service). */
export interface GradeDto {
  nome: string;
  descricao?: string;
  ativa?: boolean;
  /** Tamanhos na ordem desejada; a `ordem` é derivada do índice no array. */
  tamanhos: Array<{ valor: string; ordem: number }>;
}

export interface FiltrosGrade {
  busca?: string;
  ativa?: boolean;
  pagina?: number;
  itensPorPagina?: number;
}

// ═══════════════════════════════════════════════════════════
// VARIAÇÕES DE PRODUTO (catalog-service)
// ═══════════════════════════════════════════════════════════
//
// Uma variação é um SKU vendável derivado do produto-pai, descrito por um
// conjunto de atributos (ex.: [{nome:'Cor',valor:'Preto'},{nome:'Tamanho',valor:'38'}]).

/** Atributo descritivo de uma variação (par nome/valor). */
export interface AtributoVariacao {
  nome: string; // ex.: 'Cor', 'Tamanho'
  valor: string; // ex.: 'Preto', '38'
}

/** Variação de produto persistida (espelha `VariacaoProduto` do catalog-service). */
export interface VariacaoProduto {
  id: string;
  produtoId?: string;
  sku: string;
  gtin?: string;
  nome: string;
  precoVenda?: number;
  peso?: number;
  atributos: AtributoVariacao[];
  criadoEm?: string;
  atualizadoEm?: string;
}

/** Payload do wizard: gera a matriz de variações a partir de uma grade. */
export interface PreverVariacoesDto {
  atributo: string; // default 'Cor'
  valorAtributo: string; // ex.: 'Preto'
  gradeId: string;
}

/**
 * Linha da matriz retornada por `.../variacoes/prever`.
 * O backend devolve o SKU/nome/preço já calculados e os atributos montados;
 * o usuário edita antes de salvar em lote.
 */
export interface VariacaoPrevista {
  sku: string;
  nome: string;
  precoVenda?: number;
  gtin?: string;
  atributos: AtributoVariacao[];
}

/** Uma variação a persistir no lote (subset editável de VariacaoProduto). */
export interface VariacaoLoteItem {
  id?: string;
  sku: string;
  nome: string;
  precoVenda?: number;
  gtin?: string;
  peso?: number;
  atributos: AtributoVariacao[];
}

/** Payload de `.../variacoes/lote` — grava/atualiza as variações em bloco. */
export interface SalvarVariacoesLoteDto {
  variacoes: VariacaoLoteItem[];
}

// ═══════════════════════════════════════════════════════════
// CATEGORIAS & MARCAS (catalog-service)
// ═══════════════════════════════════════════════════════════

/** Categoria de produto (com hierarquia). Espelha o retorno do catalog-service. */
export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  nivel: number;
  ativa: boolean;
  categoriaPaiId?: string | null;
  categoriaPai?: { id: string; nome: string; slug: string } | null;
  subcategorias?: Array<{ id: string; nome: string; slug: string; ativa: boolean }>;
  /** Contagens agregadas retornadas pelo backend (`_count`). */
  _count?: { produtos: number; subcategorias: number };
  criadoEm?: string;
  atualizadoEm?: string;
}

/** Marca de produto. Espelha o retorno do catalog-service. */
export interface Marca {
  id: string;
  nome: string;
  slug: string;
  logoUrl?: string | null;
  ativa: boolean;
  /** Contagens agregadas retornadas pelo backend (`_count`). */
  _count?: { produtos: number };
  criadoEm?: string;
  atualizadoEm?: string;
}

/** DTO de criação/edição de categoria (campos aceitos pelo catalog-service). */
export interface CategoriaDto {
  nome: string;
  categoriaPaiId?: string | null;
  ativa?: boolean;
}

/** DTO de criação/edição de marca (campos aceitos pelo catalog-service). */
export interface MarcaDto {
  nome: string;
  logoUrl?: string;
  ativa?: boolean;
}

export interface FiltrosCategoria {
  busca?: string;
  ativa?: boolean;
  categoriaPaiId?: string;
  apenasRaiz?: boolean;
  pagina?: number;
  itensPorPagina?: number;
}

export interface FiltrosMarca {
  busca?: string;
  ativa?: boolean;
  pagina?: number;
  itensPorPagina?: number;
}

// ═══════════════════════════════════════════════════════════
// ESTOQUE (inventory-service)
// ═══════════════════════════════════════════════════════════

export interface SaldoEstoque {
  id: string;
  produtoId: string;
  produto: string;
  sku: string;
  depositoId: string;
  deposito: string;
  fisico: number;
  reservado: number;
  disponivel: number;
  minimo?: number;
  status: 'NORMAL' | 'BAIXO' | 'CRITICO' | 'SEM_ESTOQUE';
}

export interface ResumoEstoque {
  totalProdutos: number;
  totalUnidades: number;
  estoqueBaixo: number;
  semEstoque: number;
  itens: SaldoEstoque[];
}

export interface AlertaEstoque {
  produtoId: string;
  produto: string;
  sku: string;
  disponivel: number;
  minimo: number;
  deposito: string;
}

export interface Deposito {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  endereco?: string;
}

/** Tipo de movimentação — enum Prisma `TipoMovimentacao` (inventory-service). */
export type TipoMovimentacao =
  | 'ENTRADA'
  | 'SAIDA'
  | 'AJUSTE'
  | 'TRANSFERENCIA'
  | 'DEVOLUCAO'
  | 'RESERVA';

export interface Movimentacao {
  id: string;
  tipo: TipoMovimentacao;
  produtoId: string;
  produto: string;
  sku: string;
  quantidade: number;
  depositoOrigemId?: string;
  depositoDestino?: string;
  depositoOrigem?: string;
  motivo?: string;
  criadoEm: string;
}

// ═══════════════════════════════════════════════════════════
// PEDIDOS (order-service)
// ═══════════════════════════════════════════════════════════

// Alinhado ao enum Prisma `StatusPedido` (order-service). UPPERCASE_SNAKE.
// A fase de separação é um único estado: EM_SEPARACAO (não há SEPARANDO/SEPARADO).
export type StatusPedido =
  | 'RASCUNHO'
  | 'PENDENTE'
  | 'CONFIRMADO'
  | 'EM_SEPARACAO'
  | 'FATURADO'
  | 'ENVIADO'
  | 'ENTREGUE'
  | 'CANCELADO'
  | 'DEVOLVIDO';

export interface ItemPedido {
  id: string;
  produtoId: string;
  produto: string;
  sku: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  numero: string;
  clienteId?: string;
  cliente: string;
  canal: string;
  itens: number;
  itensList?: ItemPedido[];
  valor: number;
  status: StatusPedido;
  data: string;
  rastreio?: string;
  enderecoEntrega?: string;
  criadoEm: string;
}

export interface EstatisticasPedidos {
  receita30d: number;
  receita7d: number;
  pedidos30d: number;
  pedidos7d: number;
  ticketMedio: number;
  porStatus: Record<string, number>;
  porCanal: { canal: string; quantidade: number; valor: number }[];
  pendentesUrgentes: { id: string; numero: string; cliente: string; valor: number; canal: string; criadoEm: string }[];
}

export interface FiltrosPedido {
  busca?: string;
  status?: StatusPedido | string;
  canal?: string;
  dataInicio?: string;
  dataFim?: string;
  pagina?: number;
  limite?: number;
}

// ═══════════════════════════════════════════════════════════
// CLIENTES / PARCEIROS (customer-service / CRM)
// ═══════════════════════════════════════════════════════════
//
// Contrato canônico: docs/design/parceiro-unificado.md
// Cadastro unificado de parceiros, diferenciado por `papeis`.
// O frontend usa tipo 'PF' | 'PJ'; o backend aceita ambos e normaliza.

/** Papel do parceiro no negócio (um parceiro pode ter vários). */
export type Papel = 'CLIENTE' | 'FORNECEDOR' | 'TRANSPORTADORA';

/** Regime tributário (aplica-se a PJ). */
export type RegimeTributario =
  | 'SIMPLES_NACIONAL'
  | 'MEI'
  | 'LUCRO_PRESUMIDO'
  | 'LUCRO_REAL'
  | 'ISENTO';

/** Origem do cadastro do parceiro (alinhado ao banco). */
export type OrigemCliente =
  | 'MANUAL'
  | 'MARKETPLACE'
  | 'SITE'
  | 'INDICACAO'
  | 'IMPORTACAO'
  | 'WEBSITE'
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'WHATSAPP'
  | 'VENDA_DIRETA'
  | 'FEIRA'
  | 'TELEFONE'
  | 'EMAIL'
  | 'OUTRO';

export interface Cliente {
  id: string;
  /** Papéis do parceiro (default ['CLIENTE']). */
  papeis?: Papel[];
  nome: string;
  nomeFantasia?: string;
  razaoSocial?: string;
  email?: string;
  emailSecundario?: string;
  telefone?: string;
  celular?: string;
  cpf?: string;
  cnpj?: string;
  rg?: string;
  inscricaoEstadual?: string;
  /** IE isenta (PJ) — quando true, o campo inscricaoEstadual fica vazio. */
  ieIsento?: boolean;
  inscricaoMunicipal?: string;
  regimeTributario?: RegimeTributario;
  dataNascimento?: string;
  genero?: 'M' | 'F' | 'O';
  tipo: 'PF' | 'PJ';
  status: 'ATIVO' | 'INATIVO';
  score?: number;
  totalCompras: number;
  quantidadePedidos: number;
  ultimaCompra?: string;
  origem?: OrigemCliente | string;
  tags?: string[];
  // Grupo CLIENTE
  limiteCredito?: number;
  vendedorId?: string;
  // Grupo FORNECEDOR
  prazoPagamento?: number;
  condicoesPagamento?: string;
  pixChave?: string;
  categoriasFornecidas?: string[];
  avaliacaoFornecedor?: number;
  criadoEm: string;
}

export interface EstatisticasClientes {
  total: number;
  ativos: number;
  novosEsteMes: number;
  valorTotalCompras: number;
  ticketMedioCliente: number;
}

export interface FiltrosCliente {
  busca?: string;
  status?: string;
  tipo?: string;
  origem?: string;
  papel?: string;
  pagina?: number;
  limite?: number;
}

export interface Endereco {
  id: string;
  tipo: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal: boolean;
}

export interface Contato {
  id: string;
  nome: string;
  cargo?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  principal: boolean;
}

// Alinhado ao enum Prisma `TipoInteracao` (customer-service). Conjunto COMPLETO.
export type TipoInteracao =
  | 'VENDA'
  | 'COMPRA'
  | 'ATENDIMENTO'
  | 'RECLAMACAO'
  | 'ELOGIO'
  | 'DEVOLUCAO'
  | 'ORCAMENTO'
  | 'EMAIL'
  | 'TELEFONE'
  | 'LIGACAO'
  | 'WHATSAPP'
  | 'CHAT'
  | 'REUNIAO'
  | 'VISITA'
  | 'MARKETPLACE'
  | 'NOTA';

export interface Interacao {
  id: string;
  tipo: TipoInteracao;
  titulo: string;
  descricao?: string;
  canal?: string;
  criadoEm: string;
  usuarioNome?: string;
  dados?: Record<string, unknown>;
}

export interface ResumoCliente {
  totalPedidos: number;
  totalCompras: number;
  ticketMedio: number;
  ultimaCompra?: string;
  diasDesdeUltimaCompra?: number;
  frequenciaMediaDias?: number;
  score?: number;
  segmentos?: string[];
}

export interface ClienteDetalhe extends Cliente {
  cpf?: string;
  cnpj?: string;
  score?: number;
  observacoes?: string;
  enderecos?: Endereco[];
  contatos?: Contato[];
  totalPedidos?: number;
  ticketMedio?: number;
  segmentos?: string[];
  // Histórico de compra (papel FORNECEDOR / contas a pagar)
  ultimaCompraFornecedor?: string;
  totalComprasFornecedor?: number;
  valorTotalComprasFornecedor?: number;
  atualizadoEm?: string;
}

export interface AnaliseIA {
  perfil: string;
  riscoChurn: number;
  potencialCrescimento: number;
  valorVidaCliente: string;
  acoesRecomendadas: string[];
  analise: string;
  geradoEm: string;
}

export interface CriarClienteDto {
  /** Papéis do parceiro (default ['CLIENTE'] — ao menos um). */
  papeis?: Papel[];
  tipo: 'PF' | 'PJ';
  nome: string;
  nomeFantasia?: string;
  razaoSocial?: string;
  email?: string;
  emailSecundario?: string;
  telefone?: string;
  celular?: string;
  cpf?: string;
  cnpj?: string;
  rg?: string;
  inscricaoEstadual?: string;
  ieIsento?: boolean;
  inscricaoMunicipal?: string;
  regimeTributario?: RegimeTributario;
  dataNascimento?: string;
  genero?: 'M' | 'F' | 'O';
  origem?: OrigemCliente | string;
  status?: 'ATIVO' | 'INATIVO';
  score?: number;
  tags?: string[];
  observacoes?: string;
  // Grupo CLIENTE
  limiteCredito?: number;
  vendedorId?: string;
  // Grupo FORNECEDOR
  prazoPagamento?: number;
  condicoesPagamento?: string;
  pixChave?: string;
  categoriasFornecidas?: string[];
  avaliacaoFornecedor?: number;
  endereco?: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    tipo?: string;
  };
}

export interface RegistrarInteracaoDto {
  tipo: TipoInteracao;
  titulo: string;
  descricao?: string;
  canal?: string;
  dados?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════
// FINANCEIRO (financial-service)
// ═══════════════════════════════════════════════════════════

// Alinhados aos enums Prisma `TipoLancamento` e `StatusLancamento` (financial-service).
export type TipoLancamento = 'RECEITA' | 'DESPESA' | 'TRANSFERENCIA';
export type StatusLancamento = 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO' | 'PARCIAL';

export interface Lancamento {
  id: string;
  descricao: string;
  tipo: TipoLancamento;
  valor: number;
  categoria?: string;
  categoriaId?: string;
  conta?: string;
  contaId?: string;
  dataVencimento: string;
  dataPagamento?: string;
  status: StatusLancamento;
  recorrente?: boolean;
  criadoEm: string;
}

export interface ResumoFinanceiro {
  saldoTotal: number;
  receitas: number;
  despesas: number;
  aReceber: number;
  aPagar: number;
  resultado: number;
}

export interface FluxoCaixa {
  periodo: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface Conta {
  id: string;
  nome: string;
  tipo: string;
  saldo: number;
  ativo: boolean;
}

export interface FiltrosLancamento {
  busca?: string;
  tipo?: TipoLancamento;
  status?: StatusLancamento;
  contaId?: string;
  categoriaId?: string;
  dataInicio?: string;
  dataFim?: string;
  pagina?: number;
  limite?: number;
}

// ═══════════════════════════════════════════════════════════
// FISCAL (fiscal-service)
// ═══════════════════════════════════════════════════════════

// Alinhado ao enum Prisma `StatusNotaFiscal` (fiscal-service). UPPERCASE.
// AUTORIZADA (antes EMITIDA no front) e TRANSMITIDA (antes PROCESSANDO).
export type StatusNota =
  | 'RASCUNHO'
  | 'VALIDADA'
  | 'TRANSMITIDA'
  | 'AUTORIZADA'
  | 'REJEITADA'
  | 'CANCELADA'
  | 'INUTILIZADA'
  | 'DENEGADA';

export interface NotaFiscal {
  id: string;
  numero?: string;
  serie?: string;
  tipo: 'NFE' | 'NFCE' | 'NFSE';
  valor: number;
  status: StatusNota;
  dataEmissao?: string;
  clienteId?: string;
  cliente?: string;
  chaveAcesso?: string;
  criadoEm: string;
}

export interface FiltrosNotaFiscal {
  status?: StatusNota;
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
  pagina?: number;
  limite?: number;
}

// ═══════════════════════════════════════════════════════════
// AI / INSIGHTS (ai-service)
// ═══════════════════════════════════════════════════════════

// Alinhado ao enum Prisma `TipoInsight` (ai-service). Inclui as categorias de
// domínio usadas pelo motor de insights, além dos tipos analíticos.
export type TipoInsight =
  | 'ALERTA'
  | 'OPORTUNIDADE'
  | 'TENDENCIA'
  | 'ANOMALIA'
  | 'PREVISAO'
  | 'VENDA'
  | 'ESTOQUE'
  | 'FINANCEIRO'
  | 'FISCAL'
  | 'MARKETPLACE';
// Alinhado ao enum Prisma `PrioridadeInsight` (ai-service).
export type PrioridadeInsight = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface Insight {
  id: string;
  tipo: TipoInsight;
  titulo: string;
  descricao: string;
  prioridade: PrioridadeInsight;
  visualizado: boolean;
  acaoSugerida?: string;
  dados?: Record<string, unknown>;
  criadoEm: string;
}

// ═══════════════════════════════════════════════════════════
// MARKETPLACES (marketplace-service)
// ═══════════════════════════════════════════════════════════

/** Plataforma de marketplace — enum Prisma `PlataformaMarketplace`. */
export type PlataformaMarketplace =
  | 'SHOPEE'
  | 'MERCADO_LIVRE'
  | 'AMAZON'
  | 'MAGALU'
  | 'AMERICANAS'
  | 'SHOPIFY'
  | 'SHEIN'
  | 'NUVEMSHOP'
  | 'WOOCOMMERCE';

/** Status da conexão da conta — enum Prisma `StatusConexao` (feminino). */
export type StatusConexaoMarketplace =
  | 'ATIVA'
  | 'INATIVA'
  | 'PENDENTE'
  | 'ERRO'
  | 'RECONECTANDO'
  | 'EXPIRANDO';

export interface ContaMarketplace {
  id: string;
  marketplace: PlataformaMarketplace;
  nome: string;
  status: StatusConexaoMarketplace;
  pedidosHoje: number;
  anunciosAtivos: number;
  perguntasPendentes: number;
  ultimaSincronizacao?: string;
}
