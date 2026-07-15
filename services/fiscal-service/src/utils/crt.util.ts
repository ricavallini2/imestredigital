/**
 * Derivação do CRT (Código de Regime Tributário) do XML NF-e a partir do
 * regime tributário do tenant.
 *
 * Tabela CRT (campo `emit/CRT` do layout 4.00):
 *   1 = Simples Nacional
 *   2 = Simples Nacional — excesso de sublimite de receita bruta
 *   3 = Regime Normal (Lucro Presumido / Lucro Real)
 *   4 = MEI (Simples Nacional — Microempreendedor Individual)
 *
 * MEI recebe CRT 4; Simples Nacional CRT 1; Lucro Presumido/Real CRT 3.
 */

import { RegimeTributario } from '../../generated/client'

export type CodigoCrt = '1' | '2' | '3' | '4'

/**
 * Retorna o CRT correspondente ao regime tributário.
 */
export function derivarCrt(regime: RegimeTributario): CodigoCrt {
  switch (regime) {
    case RegimeTributario.MEI:
      return '4'
    case RegimeTributario.SIMPLES_NACIONAL:
      return '1'
    case RegimeTributario.LUCRO_PRESUMIDO:
    case RegimeTributario.LUCRO_REAL:
      return '3'
    default:
      // Fallback conservador: regime normal.
      return '3'
  }
}

/**
 * Indica se o regime usa CSOSN (Simples Nacional / MEI) em vez de CST de ICMS.
 * Regime normal (Lucro Presumido/Real) usa CST de ICMS.
 */
export function regimeUsaCsosn(regime: RegimeTributario): boolean {
  return regime === RegimeTributario.SIMPLES_NACIONAL || regime === RegimeTributario.MEI
}
