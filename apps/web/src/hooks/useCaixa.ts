import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { caixaService } from '@/services/caixa.service';
import type { AbrirCaixaDTO, FecharCaixaDTO, MovimentacaoDTO } from '@/services/caixa.service';

export function useCaixaAtual() {
  return useQuery({
    queryKey: ['caixa', 'atual'],
    queryFn: () => caixaService.obterAtual(),
    refetchInterval: 30_000, // atualiza a cada 30s
  });
}

export function useSessoesCaixa() {
  return useQuery({
    queryKey: ['caixa', 'sessoes'],
    queryFn: () => caixaService.listar(),
    staleTime: 60_000,
  });
}

export function useSessaoCaixa(id: string) {
  return useQuery({
    queryKey: ['caixa', 'sessao', id],
    queryFn: () => caixaService.obterPorId(id),
    enabled: !!id,
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
    mutationFn: ({ id, ...dto }: { id: string } & FecharCaixaDTO) =>
      caixaService.fechar(id, dto),
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
