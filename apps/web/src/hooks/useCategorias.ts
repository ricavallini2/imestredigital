import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriasService } from '@/services/categorias.service';
import type { CategoriaDto, FiltrosCategoria } from '@/types';

export const CATEGORIA_KEYS = {
  todas: ['categorias'] as const,
  lista: (filtros?: FiltrosCategoria) => ['categorias', filtros] as const,
  arvore: () => ['categorias', 'arvore'] as const,
  item: (id: string) => ['categoria', id] as const,
};

/** Lista categorias (paginado). Por padrão traz um lote amplo para selects. */
export function useCategorias(filtros?: FiltrosCategoria) {
  return useQuery({
    queryKey: CATEGORIA_KEYS.lista(filtros),
    queryFn: () => categoriasService.listar(filtros),
    staleTime: 5 * 60 * 1000,
  });
}

export function useArvoreCategorias() {
  return useQuery({
    queryKey: CATEGORIA_KEYS.arvore(),
    queryFn: () => categoriasService.listarArvore(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoria(id: string) {
  return useQuery({
    queryKey: CATEGORIA_KEYS.item(id),
    queryFn: () => categoriasService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useCriarCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CategoriaDto) => categoriasService.criar(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.todas });
    },
  });
}

export function useAtualizarCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CategoriaDto> }) =>
      categoriasService.atualizar(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.todas });
      queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.item(id) });
    },
  });
}

export function useRemoverCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriasService.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.todas });
    },
  });
}
