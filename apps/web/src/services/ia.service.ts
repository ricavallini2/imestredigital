import api from '@/lib/api';
import type { Insight } from '@/types';

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
  listarInsights: async (params?: {
    visualizado?: boolean; tipo?: string; prioridade?: string; limite?: number;
  }): Promise<Insight[]> => {
    const { data } = await api.get('/v1/insights', { params });
    return data;
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
  buscarGlobal: async (q: string, limit = 5): Promise<BuscaGlobalResult> => {
    const { data } = await api.get<BuscaGlobalResult>('/v1/busca', { params: { q, limit } });
    return data;
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
