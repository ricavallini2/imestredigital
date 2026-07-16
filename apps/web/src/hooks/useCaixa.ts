/**
 * Hooks do módulo de Caixa.
 *
 * Os nomes são o contrato das telas (dashboard/caixa, caixa/historico,
 * caixa/[id] e o PDV) — não renomear. Os dados já chegam normalizados pelo
 * `caixa.service` (Decimal → number, null → undefined).
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { caixaService } from '@/services/caixa.service';
import type {
  AbrirCaixaDTO,
  FecharCaixaDTO,
  MovimentacaoDTO,
  FiltrosSessoesCaixa,
  CaixaAtual,
  SessoesCaixa,
  DetalheSessaoCaixa,
} from '@/services/caixa.service';

/** Sessão aberta do TENANT (não do usuário logado) + movimentações do turno. */
export function useCaixaAtual() {
  return useQuery<CaixaAtual>({
    queryKey: ['caixa', 'atual'],
    queryFn: () => caixaService.obterAtual(),
    refetchInterval: 30_000, // atualiza a cada 30s
  });
}

export function useSessoesCaixa(filtros?: FiltrosSessoesCaixa) {
  return useQuery<SessoesCaixa>({
    queryKey: ['caixa', 'sessoes', filtros ?? {}],
    queryFn: () => caixaService.listar(filtros),
    staleTime: 60_000,
  });
}

export function useSessaoCaixa(id: string) {
  return useQuery<DetalheSessaoCaixa>({
    queryKey: ['caixa', 'sessao', id],
    queryFn: () => caixaService.obterPorId(id),
    enabled: !!id,
    // 404 (sessão inexistente) não melhora com retry — a tela mostra o vazio.
    retry: false,
  });
}

export function useAbrirCaixa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: AbrirCaixaDTO) => caixaService.abrir(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['caixa'] });
    },
  });
}

export function useFecharCaixa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & FecharCaixaDTO) => caixaService.fechar(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['caixa'] });
    },
  });
}

export function useRegistrarMovimentacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessaoId, ...dto }: { sessaoId: string } & MovimentacaoDTO) =>
      caixaService.registrarMovimentacao(sessaoId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['caixa'] });
    },
  });
}
