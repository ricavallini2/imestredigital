import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { estoqueService, type MovimentacaoEntradaDTO, type TransferenciaDTO, type AjusteDTO, type DepositoDTO } from '@/services/estoque.service';

// ─── Query Keys ──────────────────────────────────────────────────────────────
const estoqueKeys = {
  resumo: () => ['estoque', 'resumo'] as const,
  alertas: () => ['estoque', 'alertas'] as const,
  analiseIA: () => ['estoque', 'analise-ia'] as const,
  movimentacoes: (params?: object) => ['movimentacoes', params] as const,
  depositos: () => ['depositos'] as const,
};

// ─── Estoque ─────────────────────────────────────────────────────────────────

export function useResumoEstoque() {
  return useQuery({
    queryKey: estoqueKeys.resumo(),
    queryFn: () => estoqueService.obterResumo(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAlertasEstoque() {
  return useQuery({
    queryKey: estoqueKeys.alertas(),
    queryFn: () => estoqueService.obterAlertas(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAnaliseIAEstoque() {
  return useQuery({
    queryKey: estoqueKeys.analiseIA(),
    queryFn: () => estoqueService.analisarComIA(),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Movimentações ────────────────────────────────────────────────────────────

export function useMovimentacoes(params?: {
  busca?: string; tipo?: string; produtoId?: string; periodo?: string; pagina?: number; limite?: number;
}) {
  return useQuery({
    queryKey: estoqueKeys.movimentacoes(params),
    queryFn: () => estoqueService.listarMovimentacoes(params),
  });
}

function useMovimentacaoMutation<T>(fn: (dto: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoque'] });
      queryClient.invalidateQueries({ queryKey: ['movimentacoes'] });
    },
  });
}

export function useRegistrarEntrada() {
  return useMovimentacaoMutation<MovimentacaoEntradaDTO>(estoqueService.registrarEntrada);
}

export function useRegistrarSaida() {
  return useMovimentacaoMutation<MovimentacaoEntradaDTO>(estoqueService.registrarSaida);
}

export function useRegistrarTransferencia() {
  return useMovimentacaoMutation<TransferenciaDTO>(estoqueService.registrarTransferencia);
}

export function useRegistrarAjuste() {
  return useMovimentacaoMutation<AjusteDTO>(estoqueService.registrarAjuste);
}

// ─── Depósitos ────────────────────────────────────────────────────────────────

export function useDepositos() {
  return useQuery({
    queryKey: estoqueKeys.depositos(),
    queryFn: () => estoqueService.listarDepositos(),
  });
}

export function useCriarDeposito() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: DepositoDTO) => estoqueService.criarDeposito(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['depositos'] }),
  });
}

export function useAtualizarDeposito() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & Partial<DepositoDTO>) =>
      estoqueService.atualizarDeposito(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['depositos'] }),
  });
}

export function useRemoverDeposito() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => estoqueService.removerDeposito(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['depositos'] }),
  });
}
