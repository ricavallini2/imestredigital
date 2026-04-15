import api from '@/lib/api';
import type { Produto, FiltrosProduto, RespostaPaginada } from '@/types';

function normalizarProduto(p: any): Produto {
  return {
    ...p,
    preco: p.precoVenda ?? p.preco ?? 0,
    status: (p.status?.toUpperCase() ?? 'ATIVO') as Produto['status'],
    categoria: typeof p.categoria === 'object' ? p.categoria?.nome : p.categoria,
    marca: typeof p.marca === 'object' ? p.marca?.nome : p.marca,
    imagens: p.imagens?.map((img: any) => img.url ?? img) ?? [],
  };
}

export const produtosService = {
  listar: async (filtros?: FiltrosProduto): Promise<RespostaPaginada<Produto>> => {
    const params = filtros
      ? { ...filtros, itensPorPagina: filtros.limite ?? filtros.itensPorPagina, limite: undefined }
      : undefined;
    const { data } = await api.get('/v1/produtos', { params });
    return {
      ...data,
      dados: (data.dados ?? []).map(normalizarProduto),
    };
  },

  buscarPorId: async (id: string): Promise<Produto> => {
    const { data } = await api.get(`/v1/produtos/${id}`);
    return normalizarProduto(data);
  },

  obterEstatisticas: async () => {
    const { data } = await api.get('/v1/produtos/estatisticas');
    return data;
  },

  criar: async (dto: Partial<Produto>): Promise<Produto> => {
    const { data } = await api.post('/v1/produtos', dto);
    return normalizarProduto(data);
  },

  atualizar: async (id: string, dto: Partial<Produto>): Promise<Produto> => {
    const { data } = await api.put(`/v1/produtos/${id}`, dto);
    return normalizarProduto(data);
  },

  remover: async (id: string): Promise<void> => {
    await api.delete(`/v1/produtos/${id}`);
  },

  analisarComIA: async (id: string) => {
    const { data } = await api.get(`/v1/produtos/${id}/analisar-ia`);
    return data as {
      scoreGeral: number;
      perfil: string;
      recomendacoes: string[];
      alerta: string | null;
      metricas: {
        giroEstoque: number;
        margemLiquida: number;
        estoqueStatus: string;
        diasSemVenda: string;
        ticketMedio: number;
        receitaMensal: number;
      };
      precoSugeridoIA: number;
      ncmSugerido: string;
      geradoEm: string;
    };
  },
};
