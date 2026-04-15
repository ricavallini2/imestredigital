import api from '@/lib/api';
import type { ResumoEstoque, AlertaEstoque, Deposito, Movimentacao, RespostaPaginada } from '@/types';

export interface MovimentacaoEntradaDTO {
  produtoId: string; depositoId: string; variacaoId?: string; quantidade: number; motivo?: string; responsavel?: string;
}
export interface TransferenciaDTO {
  produtoId: string; depositoOrigemId: string; depositoDestinoId: string; variacaoId?: string; quantidade: number; motivo?: string; responsavel?: string;
}
export interface AjusteDTO {
  produtoId: string; depositoId: string; variacaoId?: string; quantidade: number; motivo?: string; responsavel?: string;
}
export interface DepositoDTO {
  nome: string; descricao?: string; endereco?: string; area?: number; responsavel?: string;
}

export const estoqueService = {
  // ─── Resumo & Alertas ──────────────────────────────────────────────────────
  obterResumo: async (): Promise<ResumoEstoque & { valorEmEstoque?: number }> => {
    const { data } = await api.get('/v1/estoque/resumo');
    return data;
  },

  obterAlertas: async (): Promise<AlertaEstoque[]> => {
    const { data } = await api.get('/v1/estoque/alertas');
    return data;
  },

  // ─── Análise IA ────────────────────────────────────────────────────────────
  analisarComIA: async () => {
    const { data } = await api.get('/v1/estoque/analisar-ia');
    return data;
  },

  // ─── Movimentações ─────────────────────────────────────────────────────────
  listarMovimentacoes: async (params?: {
    busca?: string; tipo?: string; produtoId?: string; periodo?: string; pagina?: number; limite?: number;
  }): Promise<RespostaPaginada<Movimentacao>> => {
    const { data } = await api.get('/v1/movimentacoes', { params });
    return data;
  },

  registrarEntrada: async (dto: MovimentacaoEntradaDTO) => {
    const { data } = await api.post('/v1/estoque/entrada', dto);
    return data;
  },

  registrarSaida: async (dto: MovimentacaoEntradaDTO) => {
    const { data } = await api.post('/v1/estoque/saida', dto);
    return data;
  },

  registrarTransferencia: async (dto: TransferenciaDTO) => {
    const { data } = await api.post('/v1/estoque/transferencia', dto);
    return data;
  },

  registrarAjuste: async (dto: AjusteDTO) => {
    const { data } = await api.post('/v1/estoque/ajuste', dto);
    return data;
  },

  // ─── Depósitos ─────────────────────────────────────────────────────────────
  listarDepositos: async (): Promise<Deposito[]> => {
    const { data } = await api.get('/v1/depositos');
    return data;
  },

  criarDeposito: async (dto: DepositoDTO): Promise<Deposito> => {
    const { data } = await api.post('/v1/depositos', dto);
    return data;
  },

  atualizarDeposito: async (id: string, dto: Partial<DepositoDTO>): Promise<Deposito> => {
    const { data } = await api.put(`/v1/depositos/${id}`, dto);
    return data;
  },

  removerDeposito: async (id: string): Promise<void> => {
    await api.delete(`/v1/depositos/${id}`);
  },
};
