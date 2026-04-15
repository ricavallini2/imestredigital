/**
 * Serviço para o módulo Fiscal — NF-e, NFCe, NFSe.
 * Conecta ao backend fiscal-service (ou mock local em dev).
 */

import api from '@/lib/api';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type StatusNF = 'RASCUNHO' | 'VALIDADA' | 'PROCESSANDO' | 'EMITIDA' | 'REJEITADA' | 'CANCELADA' | 'DENEGADA';
export type TipoNF   = 'NFE' | 'NFCE' | 'NFSE';
export type RegimeTributario = 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';

export interface ItemNF {
  id: string;
  produtoId?: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  valorTotal: number;
  baseICMS: number;
  aliquotaICMS: number;
  valorICMS: number;
  aliquotaPIS: number;
  valorPIS: number;
  aliquotaCOFINS: number;
  valorCOFINS: number;
  cst?: string;
  csosn?: string;
}

export interface NotaFiscal {
  id: string;
  numero: string;
  serie: string;
  tipo: TipoNF;
  naturezaOperacao: string;
  finalidade: 'NORMAL' | 'COMPLEMENTAR' | 'AJUSTE' | 'DEVOLUCAO';
  status: StatusNF;
  regimeTributario: RegimeTributario;
  clienteId?: string;
  destinatario: string;
  destinatarioCnpjCpf: string;
  destinatarioUF: string;
  destinatarioEmail?: string;
  enderecoEntrega?: string;
  itens: ItemNF[];
  qtdItens: number;
  valorProdutos: number;
  valorDesconto: number;
  valorFrete: number;
  valorOutras: number;
  baseICMS: number;
  valorICMS: number;
  valorPIS: number;
  valorCOFINS: number;
  valorIPI: number;
  valorISS: number;
  valorTotal: number;
  chaveAcesso?: string;
  protocolo?: string;
  dataAutorizacao?: string;
  motivoRejeicao?: string;
  codigoRejeicao?: string;
  motivoCancelamento?: string;
  protocoloCancelamento?: string;
  pedidoId?: string;
  pedidoNumero?: string;
  dataEmissao: string;
  dataCompetencia?: string;
  criadoEm: string;
  atualizadoEm: string;
  observacoes?: string;
  informacoesAdicionais?: string;
}

export interface ListarNotasFiscaisDTO {
  busca?: string;
  status?: StatusNF | '';
  tipo?: TipoNF | '';
  page?: number;
  limit?: number;
}

export interface CriarNotaFiscalDTO {
  tipo?: TipoNF;
  naturezaOperacao?: string;
  finalidade?: 'NORMAL' | 'COMPLEMENTAR' | 'AJUSTE' | 'DEVOLUCAO';
  destinatario?: string;
  destinatarioCnpjCpf?: string;
  destinatarioUF?: string;
  destinatarioEmail?: string;
  enderecoEntrega?: string;
  itens?: ItemNF[];
  valorProdutos?: number;
  valorDesconto?: number;
  valorFrete?: number;
  baseICMS?: number;
  valorICMS?: number;
  valorPIS?: number;
  valorCOFINS?: number;
  valorTotal?: number;
  pedidoId?: string;
  pedidoNumero?: string;
  observacoes?: string;
  informacoesAdicionais?: string;
}

export interface ConfiguracaoFiscal {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  ie: string;
  im?: string;
  cnae: string;
  regimeTributario: RegimeTributario;
  uf: string;
  municipio: string;
  cMunicipio: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  certificadoValidade?: string;
  certificadoStatus: 'VALIDO' | 'EXPIRADO' | 'NAO_CONFIGURADO';
  certificadoTitular?: string;
  ambiente: 'PRODUCAO' | 'HOMOLOGACAO';
  sefazStatus: 'ONLINE' | 'OFFLINE' | 'INSTAVEL';
  ultimaConsulta?: string;
  serieNFe: string;
  proximoNumeroNFe: number;
  serieNFCe: string;
  proximoNumeroNFCe: number;
  aliquotaICMSPadrao: number;
  aliquotaPISPadrao: number;
  aliquotaCOFINSPadrao: number;
  cfopPadraoEstadual: string;
  cfopPadraoInterestadual: string;
}

export interface RegraFiscal {
  id: string;
  ncm: string;
  descricaoNCM: string;
  cfopEstadual: string;
  cfopInterestadual: string;
  cst?: string;
  csosn?: string;
  aliquotaICMS: number;
  aliquotaPIS: number;
  aliquotaCOFINS: number;
  aliquotaIPI?: number;
  observacao?: string;
  ativo: boolean;
}

export interface AnaliseIAFiscal {
  scoreCompliance: number;
  saude: 'EXCELENTE' | 'BOA' | 'REGULAR' | 'CRITICA';
  alertas: { tipo: 'CRITICO' | 'ATENCAO' | 'INFO'; titulo: string; descricao: string }[];
  oportunidades: { titulo: string; descricao: string; economia?: string }[];
  metricas: {
    totalFaturado: number;
    totalImpostos: number;
    cargaTributaria: number;
    detalheImpostos: { icms: number; pis: number; cofins: number };
    percentualICMS: number;
    percentualPIS: number;
    percentualCOFINS: number;
    taxaRejeicao: number;
    taxaEmissao: number;
    nfsPorStatus: Record<string, number>;
  };
}

export interface EstatisticasFiscais {
  faturado30d: number;
  faturado7d: number;
  impostos30d: number;
  totalNFs: number;
  emitidas30d: number;
  emitidas7d: number;
  taxaRejeicao: number;
  taxaEmissao: number;
  porStatus: Record<string, number>;
  porTipo: Record<string, number>;
  processando: number;
}

// ─── Serviço ──────────────────────────────────────────────────────────────────

export const fiscalService = {
  // Listagem
  async listar(params?: ListarNotasFiscaisDTO) {
    const q = new URLSearchParams();
    if (params?.busca)  q.set('busca', params.busca);
    if (params?.status) q.set('status', params.status);
    if (params?.tipo)   q.set('tipo', params.tipo);
    if (params?.page)   q.set('page', String(params.page));
    if (params?.limit)  q.set('limit', String(params.limit));
    const { data } = await api.get<{ notas: NotaFiscal[]; total: number; page: number; limit: number; totalPages: number }>(`/v1/notas-fiscais?${q}`);
    return data;
  },

  async obterPorId(id: string) {
    const { data } = await api.get<NotaFiscal>(`/v1/notas-fiscais/${id}`);
    return data;
  },

  async criar(dto: CriarNotaFiscalDTO) {
    const { data } = await api.post<NotaFiscal>('/v1/notas-fiscais', dto);
    return data;
  },

  async atualizar(id: string, dto: Partial<CriarNotaFiscalDTO>) {
    const { data } = await api.put<NotaFiscal>(`/v1/notas-fiscais/${id}`, dto);
    return data;
  },

  async validar(id: string) {
    const { data } = await api.post<{ valido: boolean; nf?: NotaFiscal; erros?: string[] }>(`/v1/notas-fiscais/${id}/validar`, {});
    return data;
  },

  async emitir(id: string) {
    const { data } = await api.post<{ sucesso: boolean; nf?: NotaFiscal; protocolo?: string; chaveAcesso?: string; motivoRejeicao?: string; codigoRejeicao?: string }>(`/v1/notas-fiscais/${id}/emitir`, {});
    return data;
  },

  async cancelar(id: string, motivo: string) {
    const { data } = await api.post<{ sucesso: boolean; nf?: NotaFiscal }>(`/v1/notas-fiscais/${id}/cancelar`, { motivo });
    return data;
  },

  async analisarIA() {
    const { data } = await api.get<AnaliseIAFiscal>('/v1/notas-fiscais/analisar-ia');
    return data;
  },

  async estatisticas() {
    const { data } = await api.get<EstatisticasFiscais>('/v1/notas-fiscais/estatisticas');
    return data;
  },

  async obterConfiguracao() {
    const { data } = await api.get<ConfiguracaoFiscal>('/v1/configuracao-fiscal');
    return data;
  },

  async salvarConfiguracao(dto: Partial<ConfiguracaoFiscal>) {
    const { data } = await api.put<ConfiguracaoFiscal>('/v1/configuracao-fiscal', dto);
    return data;
  },

  async listarRegras(busca?: string) {
    const q = busca ? `?busca=${encodeURIComponent(busca)}` : '';
    const { data } = await api.get<{ regras: RegraFiscal[]; total: number }>(`/v1/regras-fiscais${q}`);
    return data;
  },

  async criarRegra(dto: Omit<RegraFiscal, 'id'>) {
    const { data } = await api.post<RegraFiscal>('/v1/regras-fiscais', dto);
    return data;
  },

  async atualizarRegra(id: string, dto: Partial<RegraFiscal>) {
    const { data } = await api.put<RegraFiscal>(`/v1/regras-fiscais/${id}`, dto);
    return data;
  },

  async obterCatalogo() {
    const { data } = await api.get<{
      produtos: ProdutoCatalogo[];
      clientes: ClienteCatalogo[];
      empresaUF: string;
    }>('/v1/notas-fiscais/catalogo');
    return data;
  },
};

// ─── Tipos do Catálogo ────────────────────────────────────────────────────────

export interface ProdutoCatalogo {
  id: string;
  nome: string;
  sku: string;
  preco: number;
  estoque: number;
  unidade: string;
  ncm: string;
  cfopEstadual: string;
  cfopInterestadual: string;
  aliquotaICMS: number;
  aliquotaPIS: number;
  aliquotaCOFINS: number;
  csosn: string;
  descricaoNCM: string;
}

export interface ClienteCatalogo {
  id: string;
  nome: string;
  tipo: 'PJ' | 'PF';
  cnpjCpf: string;
  uf: string;
  email: string;
  telefone: string;
}
