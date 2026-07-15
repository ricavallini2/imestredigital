/**
 * Calculadora de ICMS.
 *
 * Regras do MVP (expansível para ST/DIFAL/FCP depois):
 *
 * - Simples Nacional / MEI → CSOSN, SEM destaque de ICMS (vICMS = 0). Os
 *   CSOSN suportados no MVP são 101 (com permissão de crédito), 102 (sem
 *   permissão de crédito / sem cobrança) e 500 (ICMS cobrado por ST). O
 *   código vem da RegraFiscal (campo cstIcms guarda o CSOSN para Simples);
 *   na ausência de regra, assume 102 (o mais comum e conservador).
 *
 * - Regime normal (Lucro Presumido/Real) → ICMS próprio CST 00 (tributação
 *   integral). A alíquota vem da RegraFiscal (definida por UF origem/destino);
 *   vICMS = base × alíquota. Sem regra, alíquota 0 (não presume tributo).
 */

import {
  CalculadoraTributo,
  ContextoTributo,
  ResultadoTributo,
} from '../tributos.types'
import { paraDecimal, aplicarAliquota } from '../dinheiro.util'
import { regimeUsaCsosn } from '../../../utils/crt.util'

/** CSOSN válidos no MVP (Simples Nacional / MEI). */
const CSOSN_SUPORTADOS = new Set(['101', '102', '103', '300', '400', '500', '900'])
/** CSOSN padrão quando não há regra: sem permissão de crédito / sem cobrança. */
const CSOSN_PADRAO = '102'
/** CST padrão do regime normal quando não há regra: tributação integral. */
const CST_PADRAO_NORMAL = '00'

export class IcmsCalculadora implements CalculadoraTributo {
  readonly imposto = 'ICMS' as const

  calcular(ctx: ContextoTributo): ResultadoTributo {
    if (regimeUsaCsosn(ctx.regime)) {
      return this.calcularSimples(ctx)
    }
    return this.calcularNormal(ctx)
  }

  /**
   * Simples Nacional / MEI: CSOSN sem destaque de ICMS. Base e valor ficam
   * zerados (o Simples recolhe via DAS, não destaca ICMS na nota — exceto ST,
   * fora do MVP). A alíquota reportada é 0.
   */
  private calcularSimples(ctx: ContextoTributo): ResultadoTributo {
    const csosnRegra = ctx.regra?.cstIcms
    const csosn = csosnRegra && CSOSN_SUPORTADOS.has(csosnRegra) ? csosnRegra : CSOSN_PADRAO

    return {
      imposto: 'ICMS',
      cst: csosn,
      base: paraDecimal(0),
      aliquota: paraDecimal(0),
      valor: paraDecimal(0),
    }
  }

  /**
   * Regime normal: ICMS CST 00, base = base do item, valor = base × alíquota.
   */
  private calcularNormal(ctx: ContextoTributo): ResultadoTributo {
    const cst = ctx.regra?.cstIcms || CST_PADRAO_NORMAL
    const aliquota = paraDecimal(ctx.regra?.aliquotaIcms ?? 0)
    const valor = aplicarAliquota(ctx.base, aliquota)

    return {
      imposto: 'ICMS',
      cst,
      base: ctx.base,
      aliquota,
      valor,
    }
  }
}

/**
 * Fábrica simples (sem DI) — o service instancia as calculadoras diretamente,
 * mantendo-as puras e trivialmente testáveis.
 */
export function criarIcmsCalculadora(): IcmsCalculadora {
  return new IcmsCalculadora()
}
