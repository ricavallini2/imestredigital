/**
 * Envelope paginado canônico do ERP.
 * TODAS as listagens do backend devem responder neste formato:
 *   { dados, total, pagina, limite, totalPaginas }
 */
export interface RespostaPaginada<T> {
  dados: T[]
  total: number
  pagina: number
  limite: number
  totalPaginas: number
}

/**
 * Monta o envelope paginado a partir dos itens e do total.
 */
export function montarRespostaPaginada<T>(
  dados: T[],
  total: number,
  pagina: number,
  limite: number,
): RespostaPaginada<T> {
  return {
    dados,
    total,
    pagina,
    limite,
    totalPaginas: limite > 0 ? Math.ceil(total / limite) : 0,
  }
}
