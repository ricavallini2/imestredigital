/**
 * Hooks React Query do cadastro de FORNECEDORES.
 *
 * Fornecedor é o parceiro com papel FORNECEDOR no customer-service — as
 * chamadas reais e a normalização do shape ficam em
 * `@/services/fornecedores.service`. Como o cadastro é unificado, as mutations
 * invalidam também as queries de `clientes`.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fornecedoresService } from '@/services/fornecedores.service';
import type { FiltrosFornecedor, FornecedorDto } from '@/services/fornecedores.service';

export const FORNECEDOR_KEYS = {
  todos: ['fornecedores'] as const,
  lista: (filtros?: FiltrosFornecedor) => ['fornecedores', filtros ?? {}] as const,
  item: (id: string) => ['fornecedor', id] as const,
};

/** Invalida tudo que enxerga o parceiro: fornecedores, clientes e compras. */
function invalidarParceiros(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: FORNECEDOR_KEYS.todos });
  queryClient.invalidateQueries({ queryKey: ['clientes'] });
  queryClient.invalidateQueries({ queryKey: ['compras', 'estatisticas'] });
}

export function useFornecedores(filtros?: FiltrosFornecedor) {
  return useQuery({
    queryKey: FORNECEDOR_KEYS.lista(filtros),
    queryFn: () => fornecedoresService.listar(filtros),
    staleTime: 60 * 1000,
  });
}

export function useFornecedor(id: string) {
  return useQuery({
    queryKey: FORNECEDOR_KEYS.item(id),
    queryFn: () => fornecedoresService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useCriarFornecedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: FornecedorDto) => fornecedoresService.criar(dto),
    onSuccess: () => invalidarParceiros(queryClient),
  });
}

export function useAtualizarFornecedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<FornecedorDto> }) =>
      fornecedoresService.atualizar(id, dto),
    onSuccess: (_, { id }) => {
      invalidarParceiros(queryClient);
      queryClient.invalidateQueries({ queryKey: FORNECEDOR_KEYS.item(id) });
    },
  });
}

/** Inativa o fornecedor (soft delete no backend). */
export function useRemoverFornecedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fornecedoresService.remover(id),
    onSuccess: (_, id) => {
      invalidarParceiros(queryClient);
      queryClient.invalidateQueries({ queryKey: FORNECEDOR_KEYS.item(id) });
    },
  });
}
