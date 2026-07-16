/**
 * Hooks React Query do cadastro de formas de pagamento.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  formasPagamentoService,
  type FormaPagamentoDto,
  type TipoFormaPagamento,
} from '@/services/formas-pagamento.service';

const CHAVE = ['formas-pagamento'];

/** Lista formas (default: só ativas — o cadastro pede todas com {ativa: undefined}). */
export function useFormasPagamento(filtros?: { tipo?: TipoFormaPagamento; ativa?: boolean }) {
  return useQuery({
    queryKey: [...CHAVE, filtros ?? {}],
    queryFn: () => formasPagamentoService.listar(filtros),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCriarFormaPagamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: FormaPagamentoDto) => formasPagamentoService.criar(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useAtualizarFormaPagamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<FormaPagamentoDto> }) =>
      formasPagamentoService.atualizar(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useRemoverFormaPagamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => formasPagamentoService.remover(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE }),
  });
}
