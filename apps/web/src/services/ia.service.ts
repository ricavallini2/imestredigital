import api from '@/lib/api';
import type { Insight } from '@/types';

/** Envelope paginado canônico retornado por todas as listagens. */
export interface RespostaPaginada<T> {
  dados: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export interface ChatMessage { role: 'user' | 'assistant'; content: string; }
export interface ChatResponse {
  resposta: string;
  tipo: 'texto' | 'tabela' | 'alerta' | 'sucesso' | 'relatorio' | 'previsao';
  dados?: unknown;
  sugestoes: Array<{ label: string; value: string }>;
  acoes?: Array<{ label: string; href: string; cor?: string }>;
  processadoEm: number;
}
export interface BuscaGlobalResult {
  produtos: Array<{ id: string; nome: string; sku: string; preco: number; estoque: number; status: string; categoria: string; href: string }>;
  pedidos:  Array<{ id: string; numero: string; cliente: string; valor: number; status: string; canal: string; criadoEm: string; href: string }>;
  clientes: Array<{ id: string; nome: string; email: string; tipo: string; totalCompras: number; status: string; href: string }>;
}

export const iaService = {
  // ─── Insights ──────────────────────────────────────────────────────────────
  // O backend responde no envelope canônico { dados, total, ... }.
  // Desembrulhamos aqui e devolvemos Insight[] para os hooks/UI.
  //
  // Os nomes dos filtros espelham `ListarInsightsDTO` do ai-service: ele roda
  // com `whitelist` + `forbidNonWhitelisted`, então qualquer chave fora do DTO
  // (ex.: o antigo `visualizado`) faz a requisição responder 400.
  listarInsights: async (params?: {
    apenasNaoLidos?: boolean; tipo?: string; prioridade?: string; pagina?: number; limite?: number;
  }): Promise<Insight[]> => {
    const { data } = await api.get<RespostaPaginada<Insight>>('/v1/insights', { params });
    return data.dados;
  },

  marcarVisualizado: async (id: string): Promise<void> => {
    await api.put(`/v1/insights/${id}/visualizar`);
  },

  gerarInsights: async (): Promise<void> => {
    await api.post('/v1/insights/gerar');
  },

  // ─── Chat IA ───────────────────────────────────────────────────────────────
  chat: async (mensagem: string, historico: ChatMessage[] = []): Promise<ChatResponse> => {
    const { data } = await api.post<ChatResponse>('/v1/ia/chat', { mensagem, historico });
    return data;
  },

  // ─── Busca global ─────────────────────────────────────────────────────────
  /**
   * Busca global (Ctrl+K) composta das fontes REAIS — produtos (catalog),
   * pedidos (order) e clientes (customer) — em paralelo. O antigo GET /v1/busca
   * era um mock do Next e não existe nos microserviços. Cada fonte falha de
   * forma isolada (allSettled): um serviço fora do ar não derruba a busca toda.
   */
  buscarGlobal: async (q: string, limit = 5): Promise<BuscaGlobalResult> => {
    const termo = q.trim();
    if (termo.length < 2) return { produtos: [], pedidos: [], clientes: [] };

    const [prodRes, pedRes, cliRes] = await Promise.allSettled([
      api.get('/v1/produtos', { params: { busca: termo, itensPorPagina: limit } }),
      api.get('/v1/pedidos', { params: { busca: termo, limite: limit } }),
      api.get('/v1/clientes', { params: { busca: termo, limite: limit } }),
    ]);

    const lista = (r: PromiseSettledResult<any>): any[] => {
      if (r.status !== 'fulfilled') return [];
      const d = r.value?.data;
      return Array.isArray(d?.dados) ? d.dados : Array.isArray(d) ? d : [];
    };

    const produtos = lista(prodRes)
      .slice(0, limit)
      .map((p: any) => ({
        id: p.id,
        nome: p.nome ?? '',
        sku: p.sku ?? '',
        preco: Number(p.precoVenda ?? p.preco) || 0,
        estoque: Number(p.estoque) || 0,
        status: p.status ?? 'ATIVO',
        categoria: typeof p.categoria === 'object' ? (p.categoria?.nome ?? '') : (p.categoria ?? ''),
        href: `/dashboard/produtos/${p.id}`,
      }));

    const pedidos = lista(pedRes)
      .slice(0, limit)
      .map((p: any) => ({
        id: p.id,
        numero: String(p.numero ?? p.id?.slice?.(0, 8) ?? ''),
        cliente: p.clienteNome ?? p.cliente ?? 'Consumidor',
        valor: Number(p.valorTotal ?? p.valor) || 0,
        status: p.status ?? '',
        canal: p.canalOrigem ?? p.canal ?? 'OUTROS',
        criadoEm: p.criadoEm ?? p.data ?? '',
        href: `/dashboard/pedidos/${p.id}`,
      }));

    const clientes = lista(cliRes)
      .slice(0, limit)
      .map((c: any) => ({
        id: c.id,
        nome: c.nome ?? c.razaoSocial ?? '',
        email: c.email ?? '',
        tipo: c.tipo ?? '',
        totalCompras: Number(c.totalCompras ?? c.valorTotalCompras ?? 0) || 0,
        status: c.status ?? (c.ativo === false ? 'INATIVO' : 'ATIVO'),
        href: `/dashboard/clientes/${c.id}`,
      }));

    return { produtos, pedidos, clientes };
  },

  // ─── Legacy ───────────────────────────────────────────────────────────────
  sugerirResposta: async (pergunta: string): Promise<string> => {
    const { data } = await api.post('/v1/sugestoes/resposta-marketplace', { pergunta });
    return data.resposta;
  },

  gerarDescricaoProduto: async (produtoId: string): Promise<string> => {
    const { data } = await api.post('/v1/sugestoes/descricao-produto', { produtoId });
    return data.descricao;
  },
};
