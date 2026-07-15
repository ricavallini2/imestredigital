import api from '@/lib/api'
import type {
  VariacaoProduto,
  VariacaoPrevista,
  PreverVariacoesDto,
  SalvarVariacoesLoteDto,
} from '@/types'

/** Garante que `atributos` seja sempre um array. */
function normalizarAtributos(v: unknown): VariacaoProduto['atributos'] {
  const d = (v ?? {}) as Record<string, unknown>
  return Array.isArray(d.atributos)
    ? (d.atributos as VariacaoProduto['atributos'])
    : []
}

function normalizarVariacao(v: unknown): VariacaoProduto {
  const d = (v ?? {}) as Record<string, unknown>
  return {
    id: String(d.id ?? ''),
    produtoId: d.produtoId as string | undefined,
    sku: String(d.sku ?? ''),
    gtin: (d.gtin as string | undefined) ?? undefined,
    nome: String(d.nome ?? ''),
    precoVenda:
      d.precoVenda != null ? Number(d.precoVenda) : undefined,
    peso: d.peso != null ? Number(d.peso) : undefined,
    atributos: normalizarAtributos(d),
    criadoEm: d.criadoEm as string | undefined,
    atualizadoEm: d.atualizadoEm as string | undefined,
  }
}

function normalizarPrevista(v: unknown): VariacaoPrevista {
  const d = (v ?? {}) as Record<string, unknown>
  return {
    sku: String(d.sku ?? ''),
    nome: String(d.nome ?? ''),
    precoVenda: d.precoVenda != null ? Number(d.precoVenda) : undefined,
    gtin: (d.gtin as string | undefined) ?? undefined,
    atributos: normalizarAtributos(d),
  }
}

/** Extrai o array de itens de respostas que podem vir como array puro ou `{ dados }`. */
function extrairLista(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  const d = (data ?? {}) as Record<string, unknown>
  if (Array.isArray(d.dados)) return d.dados
  if (Array.isArray(d.variacoes)) return d.variacoes
  return []
}

export const variacoesService = {
  /** Lista as variações persistidas de um produto. */
  listar: async (produtoId: string): Promise<VariacaoProduto[]> => {
    const { data } = await api.get(`/v1/produtos/${produtoId}/variacoes`)
    return extrairLista(data).map(normalizarVariacao)
  },

  /**
   * Gera a matriz de variações a partir de uma grade (não persiste).
   * Retorna uma linha por tamanho da grade, com SKU/nome/preço calculados.
   */
  prever: async (
    produtoId: string,
    dto: PreverVariacoesDto,
  ): Promise<VariacaoPrevista[]> => {
    const { data } = await api.post(
      `/v1/produtos/${produtoId}/variacoes/prever`,
      dto,
    )
    return extrairLista(data).map(normalizarPrevista)
  },

  /** Persiste (cria/atualiza) as variações do produto em bloco. */
  salvarLote: async (
    produtoId: string,
    dto: SalvarVariacoesLoteDto,
  ): Promise<VariacaoProduto[]> => {
    const { data } = await api.post(
      `/v1/produtos/${produtoId}/variacoes/lote`,
      dto,
    )
    return extrairLista(data).map(normalizarVariacao)
  },
}
