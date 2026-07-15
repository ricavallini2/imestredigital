/**
 * Calculadora de IPI.
 *
 * MVP: a maioria das PMEs (comércio/varejo) não é contribuinte de IPI — o
 * imposto incide na indústria/importação. Portanto o comportamento padrão é
 * SEM destaque (base/valor = 0), a menos que a RegraFiscal defina um CST de
 * IPI tributado com alíquota.
 *
 * CST de IPI que geram valor (saída tributada): 50 (saída tributada) e 49
 * (outras saídas) quando houver alíquota. Demais CST (51 isenta, 52 alíquota
 * zero, 53 não tributada, 54/55 imunes, 99 outras) → sem destaque.
 *
 * Quando a regra não informa CST de IPI, assume 53 (não tributada), coerente
 * com comércio não industrial.
 */

import {
  CalculadoraTributo,
  ContextoTributo,
  ResultadoTributo,
} from '../tributos.types'
import { paraDecimal, aplicarAliquota } from '../dinheiro.util'

/** CST de IPI que destacam valor quando há alíquota > 0. */
const CST_IPI_TRIBUTADO = new Set(['50', '49'])
/** CST padrão (comércio não industrial): não tributada. */
const CST_IPI_PADRAO = '53'

export class IpiCalculadora implements CalculadoraTributo {
  readonly imposto = 'IPI' as const

  calcular(ctx: ContextoTributo): ResultadoTributo {
    const cst = ctx.regra?.cstIpi || CST_IPI_PADRAO
    const aliquota = paraDecimal(ctx.regra?.aliquotaIpi ?? 0)

    // Só destaca IPI se o CST for tributado E houver alíquota positiva.
    if (!CST_IPI_TRIBUTADO.has(cst) || !aliquota.greaterThan(0)) {
      return {
        imposto: 'IPI',
        cst,
        base: paraDecimal(0),
        aliquota: paraDecimal(0),
        valor: paraDecimal(0),
      }
    }

    return {
      imposto: 'IPI',
      cst,
      base: ctx.base,
      aliquota,
      valor: aplicarAliquota(ctx.base, aliquota),
    }
  }
}

export function criarIpiCalculadora(): IpiCalculadora {
  return new IpiCalculadora()
}
