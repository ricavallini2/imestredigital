/**
 * Tipos TypeScript centralizados para o frontend iMestreDigital.
 * Alinhados com os DTOs e modelos dos microserviços backend.
 */

// ═══════════════════════════════════════════════════════════
// PAGINAÇÃO (padrão de todos os endpoints de listagem)
// ═══════════════════════════════════════════════════════════

export interface Paginacao {
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export interface RespostaPaginada<T> {
  dados: T[];
  paginacao: Paginacao;
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
  categoria?: string;
  categoriaId?: string;
  marca?: string;
  status: 'ATIVO' | 'INATIVO' | 'RASCUNHO';
  imagens?: string[];
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

export interface Movimentacao {
  id: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA' | 'AJUSTE';
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

export type StatusPedido =
  | 'PENDENTE'
  | 'CONFIRMADO'
  | 'SEPARANDO'
  | 'SEPARADO'
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
// CLIENTES (customer-service / CRM)
// ═══════════════════════════════════════════════════════════

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  celular?: string;
  cpf?: string;
  cnpj?: string;
  tipo: 'PF' | 'PJ';
  status: 'ATIVO' | 'INATIVO';
  totalCompras: number;
  quantidadePedidos: number;
  ultimaCompra?: string;
  origem?: string;
  tags?: string[];
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

export type TipoInteracao =
  | 'COMPRA'
  | 'ATENDIMENTO'
  | 'RECLAMACAO'
  | 'ELOGIO'
  | 'ORCAMENTO'
  | 'VISITA'
  | 'EMAIL'
  | 'LIGACAO'
  | 'WHATSAPP'
  | 'OUTRO';

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
  tipo: 'PF' | 'PJ';
  nome: string;
  email?: string;
  telefone?: string;
  celular?: string;
  cpf?: string;
  cnpj?: string;
  origem?: string;
  tags?: string[];
  observacoes?: string;
  endereco?: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
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

export type TipoLancamento = 'RECEITA' | 'DESPESA';
export type StatusLancamento = 'PENDENTE' | 'PAGO' | 'CANCELADO' | 'ATRASADO';

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

export type StatusNota = 'RASCUNHO' | 'VALIDADA' | 'EMITIDA' | 'CANCELADA' | 'DENEGADA';

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

export type TipoInsight = 'ALERTA' | 'OPORTUNIDADE' | 'PREVISAO' | 'ANOMALIA';
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

export interface ContaMarketplace {
  id: string;
  marketplace: 'MERCADO_LIVRE' | 'SHOPEE' | 'AMAZON' | 'MAGALU' | 'SHOPIFY';
  nome: string;
  status: 'ATIVO' | 'INATIVO' | 'ERRO' | 'PENDENTE';
  pedidosHoje: number;
  anunciosAtivos: number;
  perguntasPendentes: number;
  ultimaSincronizacao?: string;
}
