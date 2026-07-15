import api from '@/lib/api';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export type CanalMarketplace = 'MERCADO_LIVRE' | 'SHOPEE' | 'AMAZON' | 'SHOPIFY' | 'MAGALU';
// Alinhados aos enums Prisma do marketplace-service (StatusConexao, StatusAnuncio,
// StatusPerguntaMarketplace).
export type StatusMarketplace = 'ATIVA' | 'INATIVA' | 'PENDENTE' | 'ERRO' | 'RECONECTANDO' | 'EXPIRANDO';
export type StatusAnuncio = 'ATIVO' | 'PAUSADO' | 'REMOVIDO' | 'PENDENTE' | 'ENCERRADO' | 'ERRO';
export type StatusPergunta = 'PENDENTE' | 'RESPONDIDA' | 'DELETADA';

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
  ultimaSincronizacao: string | null;
  criadoEm: string | null;
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
  criadoEm: string | null;
  atualizadoEm: string | null;
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
  dataPergunta: string | null;
  dataResposta?: string | null;
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

/** Retorno da geração de URL de autorização OAuth do Mercado Livre. */
export interface UrlAutorizacaoML {
  url: string;
  state: string;
}

/** Retorno do callback OAuth do Mercado Livre (conta conectada). */
export interface ContaConectadaML {
  id: string;
  idExterno: string;
  status: string;
}

// ─── Normalização defensiva na borda ──────────────────────────────────────────
// O backend real (marketplace-service) serializa Decimal como string e pode
// omitir campos agregados (que a vitrine calcula) ou entregar entidades cruas
// com nomes divergentes (plataforma/idExterno/url em vez de canal/sellerId/
// urlAnuncio). Aqui coeragimos TUDO para o shape plano que a UI consome, sem
// nunca quebrar por valor ausente. Também funciona 1:1 com os mocks locais.

type Bruto = Record<string, unknown>;

/** Number(x ?? 0) resiliente a string ("1234.50"), null, undefined e NaN. */
function num(v: unknown): number {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'string' ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : 0;
}

/** Primeiro valor definido entre as chaves candidatas. */
function pick(obj: Bruto, ...chaves: string[]): unknown {
  for (const c of chaves) {
    const v = obj[c];
    if (v !== undefined && v !== null) return v;
  }
  return undefined;
}

/**
 * Lê um número tentando a chave direta no objeto e, em fallback, a mesma
 * métrica dentro de um JSON `metricas`/`metrics` (backend cru). Ex.: a UI usa
 * `impressoes`; a entidade guarda `metricas.visitas`.
 */
function numMetrica(obj: Bruto, chaveDireta: string, ...chavesMetrica: string[]): number {
  const direto = obj[chaveDireta];
  if (direto !== undefined && direto !== null && direto !== '') return num(direto);
  const metricas = pick(obj, 'metricas', 'metrics');
  if (metricas && typeof metricas === 'object') {
    return num(pick(metricas as Bruto, ...chavesMetrica));
  }
  return 0;
}

/** Data ISO opcional: string válida ou null (nunca lança). */
function dataOpc(v: unknown): string | null {
  if (typeof v === 'string' && v.length > 0) return v;
  if (v instanceof Date) return v.toISOString();
  return null;
}

function str(v: unknown, padrao = ''): string {
  return typeof v === 'string' ? v : padrao;
}

/** Desembrulha { dados: [...] } | { data: [...] } | [...] com segurança. */
function comoLista(payload: unknown): Bruto[] {
  if (Array.isArray(payload)) return payload as Bruto[];
  if (payload && typeof payload === 'object') {
    const p = payload as Bruto;
    if (Array.isArray(p.dados)) return p.dados as Bruto[];
    if (Array.isArray(p.data)) return p.data as Bruto[];
    if (Array.isArray(p.itens)) return p.itens as Bruto[];
  }
  return [];
}

function normalizarMarketplace(b: Bruto): Marketplace {
  return {
    id: str(pick(b, 'id')),
    canal: str(pick(b, 'canal', 'plataforma'), 'MERCADO_LIVRE') as CanalMarketplace,
    nome: str(pick(b, 'nome', 'name'), 'Marketplace'),
    status: str(pick(b, 'status'), 'INATIVA') as StatusMarketplace,
    taxaPlataforma: num(pick(b, 'taxaPlataforma')),
    sellerId: str(pick(b, 'sellerId', 'idExterno')),
    pedidosHoje: numMetrica(b, 'pedidosHoje', 'pedidosHoje'),
    pedidosMes: num(pick(b, 'pedidosMes')),
    anunciosAtivos: num(pick(b, 'anunciosAtivos')),
    anunciosPausados: num(pick(b, 'anunciosPausados')),
    perguntasPendentes: num(pick(b, 'perguntasPendentes')),
    receitaMes: num(pick(b, 'receitaMes')),
    receitaLiquidaMes: num(pick(b, 'receitaLiquidaMes')),
    ticketMedio: num(pick(b, 'ticketMedio')),
    avaliacaoVendedor: num(pick(b, 'avaliacaoVendedor')),
    taxaResposta: num(pick(b, 'taxaResposta')),
    taxaReclamacao: num(pick(b, 'taxaReclamacao')),
    ultimaSincronizacao: dataOpc(pick(b, 'ultimaSincronizacao')),
    criadoEm: dataOpc(pick(b, 'criadoEm')),
  };
}

function normalizarAnuncio(b: Bruto): Anuncio {
  return {
    id: str(pick(b, 'id')),
    produtoId: str(pick(b, 'produtoId')),
    canal: str(pick(b, 'canal', 'plataforma'), 'MERCADO_LIVRE') as CanalMarketplace,
    titulo: str(pick(b, 'titulo', 'title'), 'Anúncio'),
    sku: str(pick(b, 'sku')),
    preco: num(pick(b, 'preco', 'price')),
    precoPromocional:
      pick(b, 'precoPromocional', 'precoPromo') !== undefined
        ? num(pick(b, 'precoPromocional', 'precoPromo'))
        : undefined,
    custoMedio: num(pick(b, 'custoMedio')),
    estoque: num(pick(b, 'estoque', 'stock')),
    status: str(pick(b, 'status'), 'PAUSADO') as StatusAnuncio,
    impressoes: numMetrica(b, 'impressoes', 'visitas', 'impressoes'),
    cliques: numMetrica(b, 'cliques', 'cliques'),
    conversao: numMetrica(b, 'conversao', 'conversao'),
    vendas30d: numMetrica(b, 'vendas30d', 'vendas'),
    receita30d: numMetrica(b, 'receita30d', 'receita'),
    categoria: str(pick(b, 'categoria', 'categoryName'), '—'),
    urlAnuncio: (() => {
      const u = pick(b, 'urlAnuncio', 'url');
      return typeof u === 'string' && u.length > 0 ? u : undefined;
    })(),
    anuncioId: str(pick(b, 'anuncioId', 'idExterno')),
    criadoEm: dataOpc(pick(b, 'criadoEm')),
    atualizadoEm: dataOpc(pick(b, 'atualizadoEm')),
  };
}

function normalizarTopAnuncio(b: Bruto): TopAnuncio {
  return {
    id: str(pick(b, 'id')),
    titulo: str(pick(b, 'titulo'), 'Anúncio'),
    canal: str(pick(b, 'canal', 'plataforma'), 'MERCADO_LIVRE') as CanalMarketplace,
    sku: str(pick(b, 'sku')),
    preco: num(pick(b, 'preco')),
    vendas30d: num(pick(b, 'vendas30d')),
    receita30d: num(pick(b, 'receita30d')),
    conversao: num(pick(b, 'conversao')),
    estoque: num(pick(b, 'estoque')),
  };
}

function normalizarVendaCanal(b: Bruto): VendaCanal {
  return {
    canal: str(pick(b, 'canal', 'plataforma')),
    mes: str(pick(b, 'mes')),
    pedidos: num(pick(b, 'pedidos')),
    receita: num(pick(b, 'receita')),
    taxaPlataforma: num(pick(b, 'taxaPlataforma')),
    receitaLiquida: num(pick(b, 'receitaLiquida')),
  };
}

function normalizarHealthScore(b: Bruto): HealthScore {
  const issuesBrutas = Array.isArray(b.issues) ? (b.issues as Bruto[]) : [];
  return {
    canal: str(pick(b, 'canal', 'plataforma')),
    nome: str(pick(b, 'nome'), 'Canal'),
    score: num(pick(b, 'score')),
    issues: issuesBrutas.map((i) => ({
      tipo: str(pick(i, 'tipo')),
      descricao: str(pick(i, 'descricao')),
    })),
  };
}

function normalizarStats(payload: unknown): StatsMarketplace {
  const b = (payload && typeof payload === 'object' ? payload : {}) as Bruto;
  const top = Array.isArray(b.topAnuncios) ? (b.topAnuncios as Bruto[]) : [];
  const vendas = Array.isArray(b.vendasPorCanal) ? (b.vendasPorCanal as Bruto[]) : [];
  const health = Array.isArray(b.healthScore) ? (b.healthScore as Bruto[]) : [];
  return {
    totalReceita: num(pick(b, 'totalReceita')),
    totalReceitaLiquida: num(pick(b, 'totalReceitaLiquida')),
    totalPedidosMes: num(pick(b, 'totalPedidosMes')),
    totalAnuncios: num(pick(b, 'totalAnuncios')),
    perguntasPendentes: num(pick(b, 'perguntasPendentes')),
    taxaRespostaMedia: num(pick(b, 'taxaRespostaMedia')),
    avaliacaoMedia: num(pick(b, 'avaliacaoMedia')),
    topAnuncios: top.map(normalizarTopAnuncio),
    vendasPorCanal: vendas.map(normalizarVendaCanal),
    crescimentoMes: num(pick(b, 'crescimentoMes')),
    healthScore: health.map(normalizarHealthScore),
  };
}

function normalizarPergunta(b: Bruto): Pergunta {
  const prioridade = str(pick(b, 'prioridade'), 'NORMAL');
  return {
    id: str(pick(b, 'id')),
    canal: str(pick(b, 'canal', 'plataforma'), 'MERCADO_LIVRE') as Pergunta['canal'],
    anuncioId: str(pick(b, 'anuncioId')),
    tituloAnuncio: str(pick(b, 'tituloAnuncio'), '—'),
    comprador: str(pick(b, 'comprador'), '—'),
    pergunta: str(pick(b, 'pergunta', 'texto')),
    resposta: (() => {
      const r = pick(b, 'resposta');
      return typeof r === 'string' && r.length > 0 ? r : undefined;
    })(),
    status: str(pick(b, 'status'), 'PENDENTE') as StatusPergunta,
    dataPergunta: dataOpc(pick(b, 'dataPergunta')),
    dataResposta: dataOpc(pick(b, 'dataResposta')),
    prioridade: prioridade === 'URGENTE' ? 'URGENTE' : 'NORMAL',
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const marketplacesService = {
  listarMarketplaces: async (): Promise<Marketplace[]> => {
    const { data } = await api.get('/v1/marketplaces');
    return comoLista(data).map(normalizarMarketplace);
  },

  sincronizar: async (id: string): Promise<Marketplace> => {
    const { data } = await api.post(`/v1/marketplaces/${id}/sincronizar`);
    return normalizarMarketplace((data ?? {}) as Bruto);
  },

  listarAnuncios: async (
    filtros?: FiltrosAnuncios,
  ): Promise<RespostaPaginadaAnuncios> => {
    const { data } = await api.get('/v1/marketplaces/anuncios', { params: filtros });
    const dados = comoLista(data).map(normalizarAnuncio);
    const env = (data && typeof data === 'object' ? data : {}) as Bruto;
    const pagina = num(pick(env, 'pagina')) || filtros?.pagina || 1;
    const total = num(pick(env, 'total')) || dados.length;
    const limite = filtros?.limite ?? 20;
    const totalPaginas =
      num(pick(env, 'totalPaginas')) || Math.max(1, Math.ceil(total / limite));
    return { dados, total, pagina, totalPaginas };
  },

  obterAnuncio: async (id: string): Promise<Anuncio> => {
    const { data } = await api.get(`/v1/marketplaces/anuncios/${id}`);
    return normalizarAnuncio((data ?? {}) as Bruto);
  },

  atualizarAnuncio: async (
    id: string,
    dto: AtualizarAnuncioDto,
  ): Promise<Anuncio> => {
    const { data } = await api.patch(`/v1/marketplaces/anuncios/${id}`, dto);
    return normalizarAnuncio((data ?? {}) as Bruto);
  },

  listarPerguntas: async (
    filtros?: FiltrosPerguntas,
  ): Promise<RespostaPerguntas> => {
    const { data } = await api.get('/v1/marketplaces/perguntas', { params: filtros });
    const dados = comoLista(data).map(normalizarPergunta);
    const env = (data && typeof data === 'object' ? data : {}) as Bruto;
    const total = num(pick(env, 'total')) || dados.length;
    const pendentes = env.pendentes !== undefined
      ? num(pick(env, 'pendentes'))
      : dados.filter((p) => p.status === 'PENDENTE').length;
    return { dados, total, pendentes };
  },

  responderPergunta: async (
    id: string,
    resposta: string,
  ): Promise<Pergunta> => {
    const { data } = await api.post(`/v1/marketplaces/perguntas/${id}/responder`, { resposta });
    return normalizarPergunta((data ?? {}) as Bruto);
  },

  obterStats: async (): Promise<StatsMarketplace> => {
    const { data } = await api.get('/v1/marketplaces/stats');
    return normalizarStats(data);
  },

  // ─── Mercado Livre — OAuth por tenant ──────────────────────────────────────

  /**
   * Obtém a URL de autorização OAuth do Mercado Livre para o tenant.
   * O backend responde 400 se ML_CLIENT_ID/ML_CLIENT_SECRET não estiverem
   * configurados no marketplace-service.
   */
  obterUrlAutorizacaoML: async (): Promise<UrlAutorizacaoML> => {
    const { data } = await api.get('/v1/contas/mercadolivre/url-autorizacao');
    const b = (data ?? {}) as Bruto;
    return { url: str(pick(b, 'url')), state: str(pick(b, 'state')) };
  },

  /**
   * Finaliza o OAuth do Mercado Livre trocando o code por tokens no backend.
   */
  processarCallbackML: async (
    code: string,
    state: string,
  ): Promise<ContaConectadaML> => {
    const { data } = await api.post('/v1/contas/mercadolivre/callback', { code, state });
    const b = (data ?? {}) as Bruto;
    return {
      id: str(pick(b, 'id')),
      idExterno: str(pick(b, 'idExterno')),
      status: str(pick(b, 'status'), 'ATIVA'),
    };
  },
};
