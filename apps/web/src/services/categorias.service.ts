import api from '@/lib/api'
import type {
  Categoria,
  CategoriaDto,
  FiltrosCategoria,
  RespostaPaginada,
} from '@/types'

/**
 * Normaliza o envelope de paginação recebido do catalog-service para o formato
 * canônico PLANO da Fase 0: `{ dados, total, pagina, limite, totalPaginas }`.
 *
 * Tolerante a formatos legados (`{ dados, paginacao }`, `{ dados, meta }`) e ao
 * caso de o backend retornar um array puro.
 */
function normalizarPaginacao(
  data: unknown,
  filtros?: FiltrosCategoria,
): RespostaPaginada<Categoria> {
  if (Array.isArray(data)) {
    return {
      dados: data as Categoria[],
      total: data.length,
      pagina: filtros?.pagina ?? 1,
      limite: filtros?.itensPorPagina ?? data.length,
      totalPaginas: 1,
    }
  }

  const d = (data ?? {}) as Record<string, unknown>
  const dados = (d.dados as Categoria[]) ?? []
  const fonte = (d.paginacao ?? d.meta ?? d) as Record<string, unknown>

  const limite =
    (fonte.limite as number) ??
    (fonte.itensPorPagina as number) ??
    filtros?.itensPorPagina ??
    20
  const total = (fonte.total as number) ?? dados.length
  const pagina = (fonte.pagina as number) ?? filtros?.pagina ?? 1
  const totalPaginas =
    (fonte.totalPaginas as number) ?? (limite > 0 ? Math.ceil(total / limite) : 1)

  return { dados, total, pagina, limite, totalPaginas }
}

export const categoriasService = {
  /** Lista categorias do tenant (envelope paginado canônico). */
  listar: async (
    filtros?: FiltrosCategoria,
  ): Promise<RespostaPaginada<Categoria>> => {
    const { data } = await api.get('/v1/categorias', { params: filtros })
    return normalizarPaginacao(data, filtros)
  },

  /** Árvore hierárquica completa (raízes com filhas aninhadas). */
  listarArvore: async (): Promise<Categoria[]> => {
    const { data } = await api.get('/v1/categorias/arvore')
    return Array.isArray(data) ? data : (data?.dados ?? [])
  },

  buscarPorId: async (id: string): Promise<Categoria> => {
    const { data } = await api.get(`/v1/categorias/${id}`)
    return data
  },

  criar: async (dto: CategoriaDto): Promise<Categoria> => {
    const { data } = await api.post('/v1/categorias', dto)
    return data
  },

  atualizar: async (id: string, dto: Partial<CategoriaDto>): Promise<Categoria> => {
    const { data } = await api.put(`/v1/categorias/${id}`, dto)
    return data
  },

  /** Soft delete via flag `ativa` no backend. */
  remover: async (id: string): Promise<void> => {
    await api.delete(`/v1/categorias/${id}`)
  },
}
