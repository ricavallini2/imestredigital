import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { marcasService } from '@/services/marcas.service'
import type { MarcaDto, FiltrosMarca } from '@/types'

export const MARCA_KEYS = {
  todas: ['marcas'] as const,
  lista: (filtros?: FiltrosMarca) => ['marcas', filtros] as const,
  item: (id: string) => ['marca', id] as const,
}

/** Lista marcas (paginado). Por padrão traz um lote amplo para selects. */
export function useMarcas(filtros?: FiltrosMarca) {
  return useQuery({
    queryKey: MARCA_KEYS.lista(filtros),
    queryFn: () => marcasService.listar(filtros),
    staleTime: 5 * 60 * 1000,
  })
}

export function useMarca(id: string) {
  return useQuery({
    queryKey: MARCA_KEYS.item(id),
    queryFn: () => marcasService.buscarPorId(id),
    enabled: !!id,
  })
}

export function useCriarMarca() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: MarcaDto) => marcasService.criar(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARCA_KEYS.todas })
    },
  })
}

export function useAtualizarMarca() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<MarcaDto> }) =>
      marcasService.atualizar(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: MARCA_KEYS.todas })
      queryClient.invalidateQueries({ queryKey: MARCA_KEYS.item(id) })
    },
  })
}

export function useRemoverMarca() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => marcasService.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARCA_KEYS.todas })
    },
  })
}
