import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { variacoesService } from '@/services/variacoes.service'
import { QUERY_KEYS } from '@/hooks/useProdutos'
import type { PreverVariacoesDto, SalvarVariacoesLoteDto } from '@/types'

export const VARIACAO_KEYS = {
  lista: (produtoId: string) => ['produto', produtoId, 'variacoes'] as const,
}

/** Lista as variações persistidas de um produto. */
export function useVariacoes(produtoId: string) {
  return useQuery({
    queryKey: VARIACAO_KEYS.lista(produtoId),
    queryFn: () => variacoesService.listar(produtoId),
    enabled: !!produtoId,
  })
}

/**
 * Gera a matriz de variações a partir de uma grade (preview, não persiste).
 * Exposto como mutation porque é uma ação sob demanda disparada pelo wizard.
 */
export function usePreverVariacoes(produtoId: string) {
  return useMutation({
    mutationFn: (dto: PreverVariacoesDto) =>
      variacoesService.prever(produtoId, dto),
  })
}

/** Persiste as variações do produto em bloco e revalida produto + variações. */
export function useSalvarVariacoesLote(produtoId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: SalvarVariacoesLoteDto) =>
      variacoesService.salvarLote(produtoId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VARIACAO_KEYS.lista(produtoId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.produto(produtoId) })
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
    },
  })
}
