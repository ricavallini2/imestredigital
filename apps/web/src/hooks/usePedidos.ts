import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pedidosService } from '@/services/pedidos.service';
import type {
  CriarPedidoDTO,
  AtualizarStatusDTO,
  PeriodoEstatisticas,
} from '@/services/pedidos.service';
import type { FiltrosPedido } from '@/types';

export function usePedidos(filtros?: FiltrosPedido) {
  return useQuery({
    queryKey: ['pedidos', filtros],
    queryFn: () => pedidosService.listar(filtros),
    staleTime: 1 * 60 * 1000,
  });
}

export function usePedido(id: string) {
  return useQuery({
    queryKey: ['pedido', id],
    queryFn: () => pedidosService.buscarPorId(id),
    enabled: !!id,
  });
}

/**
 * KPIs de pedidos. `periodo` entra na `queryKey`: janelas diferentes são dados
 * diferentes e não podem compartilhar a mesma entrada de cache.
 *
 * Quem consome PRECISA ler o `isError` da query (o React Query já o devolve) e
 * não cair em `stats?.receita ?? 0`: com o order-service fora, esse `?? 0`
 * exibia "R$ 0,00" — o Dashboard, no MESMO dado e na mesma sessão, mostrava "—
 * Fonte indisponível". Zero é o fato "não houve venda"; fonte caída é outra
 * coisa. Use `indisponivel` no `KPICard`.
 */
export function useEstatisticasPedidos(periodo: PeriodoEstatisticas = 'mes') {
  return useQuery({
    queryKey: ['pedidos', 'estatisticas', periodo],
    queryFn: () => pedidosService.obterEstatisticas(periodo),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCatalogoPedidos() {
  return useQuery({
    queryKey: ['pedidos', 'catalogo'],
    queryFn: () => pedidosService.obterCatalogo(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCriarPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CriarPedidoDTO) => pedidosService.criar(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}

export function useConfirmarPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pedidosService.confirmar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}

export function useCancelarPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo?: string }) =>
      pedidosService.cancelar(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}

export function useAtualizarStatusPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & AtualizarStatusDTO) =>
      pedidosService.atualizarStatus(id, dto),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['pedido', vars.id] });
    },
  });
}
