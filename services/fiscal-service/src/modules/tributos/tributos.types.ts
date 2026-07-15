/**
 * Tipos do engine de tributos.
 *
 * Unidade monetária: REAIS com Prisma.Decimal ponta a ponta. Alíquotas são
 * frações decimais (0.18 = 18%), consistentes com as colunas Decimal(5,4).
 */

import { Prisma, RegimeTributario } from '../../../generated/client'

/** UF de origem/destino da operação (siglas de 2 letras). */
export interface UfOperacao {
  origem?: string
  destino?: string
}

/**
 * Item de entrada do cálculo de tributos. Aceita produtoId opcional (para
 * emissão avulsa/simulação) e os dados fiscais mínimos.
 */
export interface ItemTributavel {
  produtoId?: string
  descricao?: string
  ncm: string
  cfop?: string
  unidade?: string
  origemMercadoria?: string
  /** Quantidade comercializada. */
  quantidade: number | Prisma.Decimal
  /** Valor unitário em reais. */
  valorUnitario: number | Prisma.Decimal
  /** Valor total do item em reais. Se ausente, é derivado de qtd × unit. */
  valorTotal?: number | Prisma.Decimal
  /** Desconto do item em reais. */
  valorDesconto?: number | Prisma.Decimal
}

/**
 * Contexto passado a cada calculadora de imposto: a base já resolvida, a
 * regra fiscal aplicável, o regime do tenant e as UFs da operação.
 */
export interface ContextoTributo {
  item: ItemTributavel
  /** Base de cálculo do item (valorTotal - desconto), em reais. */
  base: Prisma.Decimal
  regra: RegraFiscalAplicavel | null
  regime: RegimeTributario
  uf: UfOperacao
}

/**
 * Subconjunto da RegraFiscal consumido pelo engine (mantém o acoplamento
 * baixo com o modelo Prisma; aceita o registro completo do banco).
 */
export interface RegraFiscalAplicavel {
  /** CFOP da regra — usado como fallback do CFOP do item quando ausente. */
  cfop?: string
  cstIcms: string
  aliquotaIcms: Prisma.Decimal | number
  cstPis: string
  aliquotaPis: Prisma.Decimal | number
  cstCofins: string
  aliquotaCofins: Prisma.Decimal | number
  cstIpi?: string | null
  aliquotaIpi?: Prisma.Decimal | number | null
}

/** Resultado do cálculo de UM imposto para UM item. */
export interface ResultadoTributo {
  /** Sigla do imposto (ICMS, PIS, COFINS, IPI). */
  imposto: 'ICMS' | 'PIS' | 'COFINS' | 'IPI'
  /** CST (regime normal) ou CSOSN (Simples) aplicado. */
  cst: string
  /** Base de cálculo em reais. */
  base: Prisma.Decimal
  /** Alíquota aplicada (fração decimal). */
  aliquota: Prisma.Decimal
  /** Valor do imposto em reais. */
  valor: Prisma.Decimal
}

/**
 * Interface de uma calculadora de imposto. Cada imposto (ICMS/PIS/COFINS/IPI)
 * implementa a sua, permitindo expansão futura (ST/DIFAL/FCP) sem inchar um
 * único método gigante.
 */
export interface CalculadoraTributo {
  readonly imposto: ResultadoTributo['imposto']
  calcular(ctx: ContextoTributo): ResultadoTributo
}

/**
 * Item com o detalhamento tributário completo, pronto para persistir na
 * NotaFiscal ou retornar no endpoint de cálculo.
 */
export interface ItemNotaCalculado {
  produtoId?: string
  descricao?: string
  ncm: string
  cfop?: string
  unidade?: string
  quantidade: number | Prisma.Decimal
  valorUnitario: number | Prisma.Decimal
  valorTotal: number | Prisma.Decimal
  valorDesconto?: number | Prisma.Decimal
  origemMercadoria?: string

  cstIcms: string
  aliquotaIcms: number | Prisma.Decimal
  baseIcms: number | Prisma.Decimal
  valorIcms: number | Prisma.Decimal

  cstPis: string
  aliquotaPis: number | Prisma.Decimal
  basePis: number | Prisma.Decimal
  valorPis: number | Prisma.Decimal

  cstCofins: string
  aliquotaCofins: number | Prisma.Decimal
  baseCofins: number | Prisma.Decimal
  valorCofins: number | Prisma.Decimal

  cstIpi?: string | null
  aliquotaIpi: number | Prisma.Decimal
  baseIpi: number | Prisma.Decimal
  valorIpi: number | Prisma.Decimal

  /** Detalhamento por imposto (para inspeção/retorno de API). */
  tributos?: ResultadoTributo[]
}

/** Totalizadores da nota (soma dos itens), em reais. */
export interface TotaisNota {
  valorProdutos: Prisma.Decimal
  valorDesconto: Prisma.Decimal
  valorIcms: Prisma.Decimal
  valorPis: Prisma.Decimal
  valorCofins: Prisma.Decimal
  valorIpi: Prisma.Decimal
}

/** Resposta consolidada do cálculo de tributos de uma lista de itens. */
export interface ResultadoCalculoTributos {
  itens: ItemNotaCalculado[]
  totalizadores: TotaisNota
}
