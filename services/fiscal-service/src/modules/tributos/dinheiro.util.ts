/**
 * Helpers de dinheiro para o engine de tributos.
 *
 * Toda a aritmética usa Prisma.Decimal (base decimal.js) para evitar erros de
 * ponto flutuante. Valores monetários são arredondados a 2 casas com
 * ROUND_HALF_UP (arredondamento comercial usado pela SEFAZ nos vXxx).
 */

import { Prisma } from '../../../generated/client'

/** Converte qualquer entrada numérica (number/string/Decimal) em Decimal. */
export function paraDecimal(valor: number | string | Prisma.Decimal | null | undefined): Prisma.Decimal {
  if (valor === null || valor === undefined) {
    return new Prisma.Decimal(0)
  }
  if (valor instanceof Prisma.Decimal) {
    return valor
  }
  return new Prisma.Decimal(valor)
}

/**
 * Arredonda um valor monetário para 2 casas (ROUND_HALF_UP), retornando
 * Decimal. Usado nos valores de imposto (vICMS, vPIS, ...).
 */
export function arredondarMoeda(valor: Prisma.Decimal): Prisma.Decimal {
  return valor.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
}

/**
 * Calcula base × alíquota e arredonda o resultado a 2 casas. A alíquota é uma
 * fração decimal (0.18 = 18%).
 */
export function aplicarAliquota(base: Prisma.Decimal, aliquota: Prisma.Decimal): Prisma.Decimal {
  return arredondarMoeda(base.times(aliquota))
}
