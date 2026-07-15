import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gradesService } from '@/services/grades.service'
import type { GradeDto, FiltrosGrade } from '@/types'

export const GRADE_KEYS = {
  todas: ['grades'] as const,
  lista: (filtros?: FiltrosGrade) => ['grades', filtros] as const,
  item: (id: string) => ['grade', id] as const,
}

/** Lista grades (paginado). Por padrão traz um lote amplo para selects. */
export function useGrades(filtros?: FiltrosGrade) {
  return useQuery({
    queryKey: GRADE_KEYS.lista(filtros),
    queryFn: () => gradesService.listar(filtros),
    staleTime: 5 * 60 * 1000,
  })
}

export function useGrade(id: string) {
  return useQuery({
    queryKey: GRADE_KEYS.item(id),
    queryFn: () => gradesService.buscarPorId(id),
    enabled: !!id,
  })
}

export function useCriarGrade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: GradeDto) => gradesService.criar(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRADE_KEYS.todas })
    },
  })
}

export function useAtualizarGrade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<GradeDto> }) =>
      gradesService.atualizar(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: GRADE_KEYS.todas })
      queryClient.invalidateQueries({ queryKey: GRADE_KEYS.item(id) })
    },
  })
}

/** Inativa a grade (soft delete via flag `ativa` no backend). */
export function useInativarGrade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => gradesService.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GRADE_KEYS.todas })
    },
  })
}
