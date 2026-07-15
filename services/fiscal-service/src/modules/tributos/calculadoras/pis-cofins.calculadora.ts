/**
 * Calculadoras de PIS e COFINS.
 *
 * PIS e COFINS compartilham a mesma mecânica (diferem apenas nas alíquotas
 * padrão e no nome do imposto), por isso usam uma base comum parametrizada.
 *
 * Regras do MVP (por CST — Tabela de Situação Tributária de PIS/COFINS):
 *
 *  - CST 01 (operação tributável, alíquota básica) e 02 (alíquota
 *    diferenciada) → tributado: base = base do item; valor = base × alíquota.
 *    A alíquota vem da RegraFiscal; na ausência, usa o padrão do regime de
 *    apuração (não-cumulativo x cumulativo).
 *  - CST 04 (monofásico), 05 (ST), 06 (alíquota zero), 07 (isenta),
 *    08 (sem incidência), 09 (suspensão) → SEM valor: base e valor = 0
 *    (a operação não gera débito de PIS/COFINS destacado nesta etapa).
 *  - Demais CST (Simples via DAS, etc.) → tratados como sem destaque (0).
 *
 * Regime de apuração (para o padrão de alíquota quando a regra não informa):
 *  - Lucro Real → não-cumulativo: PIS 1,65% / COFINS 7,6%.
 *  - Simples/MEI/Lucro Presumido → cumulativo: PIS 0,65% / COFINS 3%.
 */

import {
  CalculadoraTributo,
  ContextoTributo,
  ResultadoTributo,
} from '../tributos.types'
import { RegimeTributario } from '../../../../generated/client'
import { Prisma } from '../../../../generated/client'
import { paraDecimal, aplicarAliquota } from '../dinheiro.util'

/** CST de PIS/COFINS que geram valor destacado (tributação por alíquota). */
const CST_TRIBUTADO = new Set(['01', '02'])

/** Alíquotas padrão por regime de apuração (usadas quando a regra não define). */
const ALIQUOTA_NAO_CUMULATIVO = { pis: '0.0165', cofins: '0.076' } as const
const ALIQUOTA_CUMULATIVO = { pis: '0.0065', cofins: '0.03' } as const

/** CST padrão sem destaque (Simples recolhe via DAS / demais casos). */
const CST_SEM_DESTAQUE = '49'

type TipoPisCofins = 'PIS' | 'COFINS'

/**
 * Base comum de PIS/COFINS. Não é registrada no DI diretamente; as subclasses
 * concretas (PisCalculadora/CofinsCalculadora) são as usadas.
 */
abstract class PisCofinsCalculadoraBase implements CalculadoraTributo {
  abstract readonly imposto: TipoPisCofins

  calcular(ctx: ContextoTributo): ResultadoTributo {
    const cst = this.cstDaRegra(ctx)

    // CST sem destaque → base/valor zerados, mas preserva o CST informado.
    if (!CST_TRIBUTADO.has(cst)) {
      return {
        imposto: this.imposto,
        cst,
        base: paraDecimal(0),
        aliquota: paraDecimal(0),
        valor: paraDecimal(0),
      }
    }

    const aliquota = this.aliquota(ctx)
    const valor = aplicarAliquota(ctx.base, aliquota)

    return {
      imposto: this.imposto,
      cst,
      base: ctx.base,
      aliquota,
      valor,
    }
  }

  /** CST específico do imposto vindo da regra (fallback: sem destaque). */
  private cstDaRegra(ctx: ContextoTributo): string {
    const cst = this.imposto === 'PIS' ? ctx.regra?.cstPis : ctx.regra?.cstCofins
    return cst || CST_SEM_DESTAQUE
  }

  /**
   * Alíquota do imposto: usa a da regra quando > 0; senão o padrão do regime
   * de apuração (não-cumulativo para Lucro Real, cumulativo para os demais).
   */
  private aliquota(ctx: ContextoTributo): Prisma.Decimal {
    const daRegra = paraDecimal(
      this.imposto === 'PIS' ? ctx.regra?.aliquotaPis : ctx.regra?.aliquotaCofins,
    )
    if (daRegra.greaterThan(0)) {
      return daRegra
    }

    const tabela =
      ctx.regime === RegimeTributario.LUCRO_REAL
        ? ALIQUOTA_NAO_CUMULATIVO
        : ALIQUOTA_CUMULATIVO
    return paraDecimal(this.imposto === 'PIS' ? tabela.pis : tabela.cofins)
  }
}

export class PisCalculadora extends PisCofinsCalculadoraBase {
  readonly imposto = 'PIS' as const
}

export class CofinsCalculadora extends PisCofinsCalculadoraBase {
  readonly imposto = 'COFINS' as const
}

export function criarPisCalculadora(): PisCalculadora {
  return new PisCalculadora()
}

export function criarCofinsCalculadora(): CofinsCalculadora {
  return new CofinsCalculadora()
}
