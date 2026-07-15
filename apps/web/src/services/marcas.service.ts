import api from '@/lib/api'
import type { Marca, MarcaDto, FiltrosMarca, RespostaPaginada } from '@/types'

/**
 * Normaliza o envelope de paginação recebido do catalog-service para o formato
 * canônico PLANO da Fase 0: `{ dados, total, pagina, limite, totalPaginas }`.
 *
 * Tolerante a formatos legados (`{ dados, paginacao }`, `{ dados, meta }`) e ao
 * caso de o backend retornar um array puro.
 */
function normalizarPaginacao(
  data: unknown,
  filtros?: FiltrosMarca,
): RespostaPaginada<Marca> {
  if (Array.isArray(data)) {
    return {
      dados: data as Marca[],
      total: data.length,
      pagina: filtros?.pagina ?? 1,
      limite: filtros?.itensPorPagina ?? data.length,
      totalPaginas: 1,
    }
  }

  const d = (data ?? {}) as Record<string, unknown>
  const dados = (d.dados as Marca[]) ?? []
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

export const marcasService = {
  /** Lista marcas do tenant (envelope paginado canônico). */
  listar: async (filtros?: FiltrosMarca): Promise<RespostaPaginada<Marca>> => {
    const { data } = await api.get('/v1/marcas', { params: filtros })
    return normalizarPaginacao(data, filtros)
  },

  buscarPorId: async (id: string): Promise<Marca> => {
    const { data } = await api.get(`/v1/marcas/${id}`)
    return data
  },

  criar: async (dto: MarcaDto): Promise<Marca> => {
    const { data } = await api.post('/v1/marcas', dto)
    return data
  },

  atualizar: async (id: string, dto: Partial<MarcaDto>): Promise<Marca> => {
    const { data } = await api.put(`/v1/marcas/${id}`, dto)
    return data
  },

  /** Soft delete via flag `ativa` no backend. */
  remover: async (id: string): Promise<void> => {
    await api.delete(`/v1/marcas/${id}`)
  },
}
