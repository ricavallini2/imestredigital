import api from '@/lib/api';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ContaBancaria {
  id: string;
  nome: string;
  tipo: 'CORRENTE' | 'POUPANCA' | 'CAIXA' | 'INVESTIMENTO' | 'DIGITAL';
  banco: string;
  agencia?: string;
  numeroConta?: string;
  saldoAtual: number;
  saldoInicial: number;
  cor: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'slate';
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lancamento {
  id: string;
  tipo: 'RECEITA' | 'DESPESA';
  descricao: string;
  valor: number;
  categoria: string;
  contaId?: string;
  conta?: string;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
  recorrente: boolean;
  origem?: 'MANUAL' | 'PEDIDO' | 'CAIXA' | 'COMPRA';
  observacoes?: string;
  // Integração com cliente
  clienteId?: string;
  clienteNome?: string;
  clienteTelefone?: string;
  clienteEmail?: string;
  emCobranca?: boolean;
  cobrancaTituloId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FiltrosLancamento {
  pagina?: number;
  limite?: number;
  tipo?: 'RECEITA' | 'DESPESA';
  status?: string;
  categoria?: string;
  contaId?: string;
  dataInicio?: string;
  dataFim?: string;
  busca?: string;
  mes?: number;
  ano?: number;
}

export interface RespostaPaginadaLancamentos {
  dados: Lancamento[];
  total: number;
  pagina: number;
  totalPaginas: number;
  limite: number;
}

export interface ResumoFinanceiro {
  saldoContas: number;
  receitasMes: number;
  despesasMes: number;
  resultadoMes: number;
  aReceber: number;
  aPagar: number;
  contasAtrasadas: number;
  valorAtrasado: number;
  receitasAno: number;
  crescimentoReceitas: number; // percentual vs mês anterior
  crescimentoDespesas: number;
  topDespesas: { categoria: string; valor: number; percentual: number }[];
  // legacy compat
  saldoTotal?: number;
  receitas?: number;
  despesas?: number;
  resultado?: number;
}

export interface FluxoCaixaMes {
  periodo: string; // 'YYYY-MM'
  mes: string;     // 'Jan', 'Fev', ...
  receitas: number;
  despesas: number;
  saldo: number;
  saldoAcumulado: number;
}

export interface DreDados {
  periodo: string; // 'YYYY-MM'
  // Receitas
  receitaBruta: number;
  vendasProdutos: number;
  vendasMarketplaces: number;
  vendasServicos: number;
  receitasFinanceiras: number;
  outrasReceitas: number;
  // Deduções
  impostosVenda: number;
  devolucoes: number;
  receitaLiquida: number;
  // Custos
  cmv: number;
  lucroBruto: number;
  margemBruta: number;
  // Despesas operacionais
  salarios: number;
  ocupacao: number;
  marketing: number;
  operacional: number;
  impostosTributos: number;
  outrasDespesas: number;
  totalDespesasOperacionais: number;
  ebitda: number;
  margemEbitda: number;
  // Resultado financeiro
  receitasFinanceirasResult: number;
  despesasFinanceiras: number;
  resultadoFinanceiro: number;
  resultadoAntesIR: number;
  irCsll: number;
  resultadoLiquido: number;
  margemLiquida: number;
  // Mês anterior para comparação
  mesAnterior?: {
    receitaBruta: number;
    lucroBruto: number;
    margemBruta: number;
    ebitda: number;
    margemEbitda: number;
    resultadoLiquido: number;
    margemLiquida: number;
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const financeiroService = {
  // Lançamentos
  listarLancamentos: async (
    filtros?: FiltrosLancamento
  ): Promise<RespostaPaginadaLancamentos> => {
    const { data } = await api.get('/v1/lancamentos', { params: filtros });
    return data;
  },

  obterLancamento: async (id: string): Promise<Lancamento> => {
    const { data } = await api.get(`/v1/lancamentos/${id}`);
    return data;
  },

  criarLancamento: async (dto: Partial<Lancamento>): Promise<Lancamento> => {
    const { data } = await api.post('/v1/lancamentos', dto);
    return data;
  },

  atualizarLancamento: async (
    id: string,
    dto: Partial<Lancamento>
  ): Promise<Lancamento> => {
    const { data } = await api.put(`/v1/lancamentos/${id}`, dto);
    return data;
  },

  deletarLancamento: async (id: string): Promise<void> => {
    await api.delete(`/v1/lancamentos/${id}`);
  },

  pagarLancamento: async (
    id: string,
    dataPagamento?: string
  ): Promise<Lancamento> => {
    const { data } = await api.post(`/v1/lancamentos/${id}/pagar`, {
      dataPagamento,
    });
    return data;
  },

  // Resumo e relatórios
  obterResumo: async (): Promise<ResumoFinanceiro> => {
    const { data } = await api.get('/v1/financeiro/resumo');
    return data;
  },

  obterFluxoCaixa: async (meses = 6): Promise<FluxoCaixaMes[]> => {
    const { data } = await api.get('/v1/financeiro/fluxo-caixa', {
      params: { meses },
    });
    // API returns { dados: [...] }
    return Array.isArray(data) ? data : (data.dados ?? []);
  },

  obterDRE: async (mes?: number, ano?: number): Promise<DreDados> => {
    const { data } = await api.get('/v1/financeiro/dre', {
      params: { mes, ano },
    });
    return data;
  },

  // Contas Bancárias
  listarContasBancarias: async (): Promise<ContaBancaria[]> => {
    const { data } = await api.get('/v1/contas-bancarias');
    // API returns { dados: [...], saldoTotal }
    return Array.isArray(data) ? data : (data.dados ?? []);
  },

  criarContaBancaria: async (
    dto: Partial<ContaBancaria>
  ): Promise<ContaBancaria> => {
    const { data } = await api.post('/v1/contas-bancarias', dto);
    return data;
  },

  atualizarContaBancaria: async (
    id: string,
    dto: Partial<ContaBancaria>
  ): Promise<ContaBancaria> => {
    const { data } = await api.put(`/v1/contas-bancarias/${id}`, dto);
    return data;
  },

  desativarContaBancaria: async (id: string): Promise<void> => {
    await api.delete(`/v1/contas-bancarias/${id}`);
  },

  enviarParaCobranca: async (id: string): Promise<{ id: string; clienteNome: string; valor: number }> => {
    const { data } = await api.post(`/v1/lancamentos/${id}/enviar-cobranca`);
    return data;
  },
};
