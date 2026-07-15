// Store mock em memória das variações persistidas por produto (contrato novo).
// Separado do array legado `variacoes` inline do produto: aqui usamos o shape
// canônico VariacaoProduto { sku, gtin, nome, precoVenda, atributos[] }.

export interface AtributoVariacaoMock {
  nome: string
  valor: string
}

export interface VariacaoProdutoMock {
  id: string
  produtoId: string
  sku: string
  gtin?: string
  nome: string
  precoVenda?: number
  peso?: number
  atributos: AtributoVariacaoMock[]
  criadoEm: string
  atualizadoEm: string
}

declare global {
  // eslint-disable-next-line no-var
  var __variacoesMock: Record<string, VariacaoProdutoMock[]> | undefined
}

const agora = () => new Date().toISOString()

function store(): Record<string, VariacaoProdutoMock[]> {
  if (!globalThis.__variacoesMock) globalThis.__variacoesMock = {}
  return globalThis.__variacoesMock
}

export function getVariacoes(produtoId: string): VariacaoProdutoMock[] {
  return store()[produtoId] ?? []
}

export function setVariacoes(produtoId: string, lista: VariacaoProdutoMock[]): void {
  store()[produtoId] = lista
}

/**
 * Slug em UPPERCASE sem espaços/acentos, seguindo a spec do SKU:
 *   sku = ${produto.sku}-${VALOR_SLUG}-${TAMANHO}
 */
export function slugUpper(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos (diacríticos combinantes)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '') // remove tudo que não é alfanumérico
}

let seq = 0
export function novaVariacaoId(): string {
  seq += 1
  return `var-${Date.now()}-${seq}`
}

export { agora }
