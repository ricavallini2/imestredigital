import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { produtosService } from '@/services/produtos.service';
import type { FiltrosProduto, Produto } from '@/types';

export const QUERY_KEYS = {
  produtos: (filtros?: FiltrosProduto) => ['produtos', filtros] as const,
  produto: (id: string) => ['produto', id] as const,
  estatisticas: () => ['produtos', 'estatisticas'] as const,
  analiseIA: (id: string) => ['produto', id, 'analise-ia'] as const,
};

export function useProdutos(filtros?: FiltrosProduto) {
  return useQuery({
    queryKey: QUERY_KEYS.produtos(filtros),
    queryFn: () => produtosService.listar(filtros),
  });
}

export function useProduto(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.produto(id),
    queryFn: () => produtosService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useEstatisticasProdutos() {
  return useQuery({
    queryKey: QUERY_KEYS.estatisticas(),
    queryFn: () => produtosService.obterEstatisticas(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCriarProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<Produto>) => produtosService.criar(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}

export function useAtualizarProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<Produto> }) =>
      produtosService.atualizar(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.produto(id) });
    },
  });
}

export function useRemoverProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => produtosService.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}

export function useAnaliseIAProduto(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.analiseIA(id),
    queryFn: () => produtosService.analisarComIA(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}
