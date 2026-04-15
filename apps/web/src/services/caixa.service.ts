import api from '@/lib/api';

export interface AbrirCaixaDTO {
  caixa?: string;
  operador: string;
  valorAbertura: number;
  observacoes?: string;
}

export interface FecharCaixaDTO {
  valorContado: number;
  observacoes?: string;
}

export interface MovimentacaoDTO {
  categoria: 'VENDA' | 'SUPRIMENTO' | 'SANGRIA' | 'DESPESA' | 'REEMBOLSO' | 'OUTROS';
  tipo?: 'ENTRADA' | 'SAIDA';
  descricao: string;
  valor: number;
  formaPagamento?: string;
  pedidoNumero?: string;
  operador?: string;
}

export const caixaService = {
  listar: async () => {
    const { data } = await api.get('/v1/caixa');
    return data;
  },

  obterAtual: async () => {
    const { data } = await api.get('/v1/caixa/atual');
    return data;
  },

  obterPorId: async (id: string) => {
    const { data } = await api.get(`/v1/caixa/${id}`);
    return data;
  },

  abrir: async (dto: AbrirCaixaDTO) => {
    const { data } = await api.post('/v1/caixa', dto);
    return data;
  },

  fechar: async (id: string, dto: FecharCaixaDTO) => {
    const { data } = await api.post(`/v1/caixa/${id}/fechar`, dto);
    return data;
  },

  registrarMovimentacao: async (id: string, dto: MovimentacaoDTO) => {
    const { data } = await api.post(`/v1/caixa/${id}/movimentacoes`, dto);
    return data;
  },
};
