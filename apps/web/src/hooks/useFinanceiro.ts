import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeiroService } from '@/services/financeiro.service';
import type {
  Lancamento,
  FiltrosLancamento,
  ContaBancaria,
} from '@/services/financeiro.service';

export type { FiltrosLancamento, Lancamento, ContaBancaria };

// ─── Query Keys ───────────────────────────────────────────────────────────────

const KEYS = {
  lancamentos: (f?: FiltrosLancamento) => ['lancamentos', f] as const,
  lancamento: (id: string) => ['lancamentos', id] as const,
  resumo: () => ['financeiro', 'resumo'] as const,
  fluxo: (meses: number) => ['financeiro', 'fluxo-caixa', meses] as const,
  dre: (mes?: number, ano?: number) => ['financeiro', 'dre', mes, ano] as const,
  contas: () => ['contas-bancarias'] as const,
};

// ─── Resumo & Relatórios ──────────────────────────────────────────────────────

export function useResumoFinanceiro() {
  return useQuery({
    queryKey: KEYS.resumo(),
    queryFn: () => financeiroService.obterResumo(),
    staleTime: 60 * 1000,         // 60s
    refetchInterval: 2 * 60 * 1000, // 2min
  });
}

export function useFluxoCaixa(meses = 6) {
  return useQuery({
    queryKey: KEYS.fluxo(meses),
    queryFn: () => financeiroService.obterFluxoCaixa(meses),
    staleTime: 5 * 60 * 1000, // 5min
  });
}

export function useDRE(mes?: number, ano?: number) {
  return useQuery({
    queryKey: KEYS.dre(mes, ano),
    queryFn: () => financeiroService.obterDRE(mes, ano),
    staleTime: 5 * 60 * 1000, // 5min
  });
}

// ─── Lançamentos ─────────────────────────────────────────────────────────────

export function useLancamentos(filtros?: FiltrosLancamento) {
  return useQuery({
    queryKey: KEYS.lancamentos(filtros),
    queryFn: () => financeiroService.listarLancamentos(filtros),
    staleTime: 30 * 1000, // 30s
  });
}

export function useLancamento(id: string) {
  return useQuery({
    queryKey: KEYS.lancamento(id),
    queryFn: () => financeiroService.obterLancamento(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
}

export function useCriarLancamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<Lancamento>) =>
      financeiroService.criarLancamento(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
    },
  });
}

export function useAtualizarLancamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Lancamento> & { id: string }) =>
      financeiroService.atualizarLancamento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
    },
  });
}

export function usePagarLancamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dataPagamento,
    }: {
      id: string;
      dataPagamento?: string;
    }) => financeiroService.pagarLancamento(id, dataPagamento),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeletarLancamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeiroService.deletarLancamento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
    },
  });
}

export function useEnviarCobranca() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeiroService.enviarParaCobranca(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
      queryClient.invalidateQueries({ queryKey: ['cobranca'] });
    },
  });
}

// ─── Contas Bancárias ─────────────────────────────────────────────────────────

export function useContasBancarias() {
  return useQuery({
    queryKey: KEYS.contas(),
    queryFn: () => financeiroService.listarContasBancarias(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCriarContaBancaria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<ContaBancaria>) =>
      financeiroService.criarContaBancaria(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-bancarias'] });
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
    },
  });
}

export function useAtualizarContaBancaria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<ContaBancaria> & { id: string }) =>
      financeiroService.atualizarContaBancaria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-bancarias'] });
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
    },
  });
}

// ─── Views especializadas ─────────────────────────────────────────────────────

export function useContasAPagar(filtros?: Omit<FiltrosLancamento, 'tipo'>) {
  const params: FiltrosLancamento = {
    ...filtros,
    tipo: 'DESPESA',
    status: 'PENDENTE,ATRASADO',
  };
  return useQuery({
    queryKey: KEYS.lancamentos(params),
    queryFn: () => financeiroService.listarLancamentos(params),
    staleTime: 30 * 1000,
    select: (data) => ({
      ...data,
      dados: data.dados.sort((a, b) => {
        // ATRASADO first, then by vencimento
        if (a.status === 'ATRASADO' && b.status !== 'ATRASADO') return -1;
        if (a.status !== 'ATRASADO' && b.status === 'ATRASADO') return 1;
        return (
          new Date(a.dataVencimento).getTime() -
          new Date(b.dataVencimento).getTime()
        );
      }),
    }),
  });
}

export function useContasAReceber(filtros?: Omit<FiltrosLancamento, 'tipo'>) {
  const params: FiltrosLancamento = {
    ...filtros,
    tipo: 'RECEITA',
    status: 'PENDENTE,ATRASADO',
  };
  return useQuery({
    queryKey: KEYS.lancamentos(params),
    queryFn: () => financeiroService.listarLancamentos(params),
    staleTime: 30 * 1000,
    select: (data) => ({
      ...data,
      dados: data.dados.sort((a, b) => {
        if (a.status === 'ATRASADO' && b.status !== 'ATRASADO') return -1;
        if (a.status !== 'ATRASADO' && b.status === 'ATRASADO') return 1;
        return (
          new Date(a.dataVencimento).getTime() -
          new Date(b.dataVencimento).getTime()
        );
      }),
    }),
  });
}
