import api from '@/lib/api';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export type CanalMarketplace = 'MERCADO_LIVRE' | 'SHOPEE' | 'AMAZON' | 'SHOPIFY' | 'MAGALU';
export type StatusMarketplace = 'CONECTADO' | 'DESCONECTADO' | 'ERRO' | 'PAUSADO';
export type StatusAnuncio = 'ATIVO' | 'PAUSADO' | 'SEM_ESTOQUE' | 'REMOVIDO' | 'BLOQUEADO';
export type StatusPergunta = 'PENDENTE' | 'RESPONDIDA' | 'ARQUIVADA';

export interface Marketplace {
  id: string;
  canal: CanalMarketplace;
  nome: string;
  status: StatusMarketplace;
  taxaPlataforma: number;
  sellerId: string;
  pedidosHoje: number;
  pedidosMes: number;
  anunciosAtivos: number;
  anunciosPausados: number;
  perguntasPendentes: number;
  receitaMes: number;
  receitaLiquidaMes: number;
  ticketMedio: number;
  avaliacaoVendedor: number;
  taxaResposta: number;
  taxaReclamacao: number;
  ultimaSincronizacao: string;
  criadoEm: string;
}

export interface Anuncio {
  id: string;
  produtoId: string;
  canal: CanalMarketplace;
  titulo: string;
  sku: string;
  preco: number;
  precoPromocional?: number;
  custoMedio: number;
  estoque: number;
  status: StatusAnuncio;
  impressoes: number;
  cliques: number;
  conversao: number;
  vendas30d: number;
  receita30d: number;
  categoria: string;
  urlAnuncio?: string;
  anuncioId: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Pergunta {
  id: string;
  canal: 'MERCADO_LIVRE' | 'SHOPEE' | 'AMAZON' | 'SHOPIFY';
  anuncioId: string;
  tituloAnuncio: string;
  comprador: string;
  pergunta: string;
  resposta?: string;
  status: StatusPergunta;
  dataPergunta: string;
  dataResposta?: string;
  prioridade: 'NORMAL' | 'URGENTE';
}

export interface VendaCanal {
  canal: string;
  mes: string;
  pedidos: number;
  receita: number;
  taxaPlataforma: number;
  receitaLiquida: number;
}

export interface TopAnuncio {
  id: string;
  titulo: string;
  canal: CanalMarketplace;
  sku: string;
  preco: number;
  vendas30d: number;
  receita30d: number;
  conversao: number;
  estoque: number;
}

export interface HealthScore {
  canal: string;
  nome: string;
  score: number;
  issues: { tipo: string; descricao: string }[];
}

export interface StatsMarketplace {
  totalReceita: number;
  totalReceitaLiquida: number;
  totalPedidosMes: number;
  totalAnuncios: number;
  perguntasPendentes: number;
  taxaRespostaMedia: number;
  avaliacaoMedia: number;
  topAnuncios: TopAnuncio[];
  vendasPorCanal: VendaCanal[];
  crescimentoMes: number;
  healthScore: HealthScore[];
}

export interface FiltrosAnuncios {
  canal?: CanalMarketplace | '';
  status?: StatusAnuncio | '';
  busca?: string;
  pagina?: number;
  limite?: number;
}

export interface FiltrosPerguntas {
  canal?: string;
  status?: StatusPergunta | '';
  busca?: string;
}

export interface RespostaPaginadaAnuncios {
  dados: Anuncio[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface RespostaPerguntas {
  dados: Pergunta[];
  total: number;
  pendentes: number;
}

export interface AtualizarAnuncioDto {
  preco?: number;
  precoPromocional?: number | null;
  status?: StatusAnuncio;
  estoque?: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const marketplacesService = {
  listarMarketplaces: async (): Promise<Marketplace[]> => {
    const { data } = await api.get('/v1/marketplaces');
    return data.dados ?? data;
  },

  sincronizar: async (id: string): Promise<Marketplace> => {
    const { data } = await api.post(`/v1/marketplaces/${id}/sincronizar`);
    return data;
  },

  listarAnuncios: async (
    filtros?: FiltrosAnuncios,
  ): Promise<RespostaPaginadaAnuncios> => {
    const { data } = await api.get('/v1/marketplaces/anuncios', { params: filtros });
    return data;
  },

  obterAnuncio: async (id: string): Promise<Anuncio> => {
    const { data } = await api.get(`/v1/marketplaces/anuncios/${id}`);
    return data;
  },

  atualizarAnuncio: async (
    id: string,
    dto: AtualizarAnuncioDto,
  ): Promise<Anuncio> => {
    const { data } = await api.patch(`/v1/marketplaces/anuncios/${id}`, dto);
    return data;
  },

  listarPerguntas: async (
    filtros?: FiltrosPerguntas,
  ): Promise<RespostaPerguntas> => {
    const { data } = await api.get('/v1/marketplaces/perguntas', { params: filtros });
    return data;
  },

  responderPergunta: async (
    id: string,
    resposta: string,
  ): Promise<Pergunta> => {
    const { data } = await api.post(`/v1/marketplaces/perguntas/${id}/responder`, { resposta });
    return data;
  },

  obterStats: async (): Promise<StatsMarketplace> => {
    const { data } = await api.get('/v1/marketplaces/stats');
    return data;
  },
};
