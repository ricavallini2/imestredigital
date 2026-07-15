/**
 * Testes unitários das calculadoras de tributo (puras, sem DI).
 *
 * Cobrem os casos exigidos no MVP:
 *  - Simples Nacional → CSOSN sem destaque de ICMS.
 *  - Regime normal → ICMS CST 00 (base × alíquota).
 *  - PIS/COFINS cumulativo e não-cumulativo.
 *  - IPI sem destaque no comércio.
 *
 * Unidade monetária: REAIS (Prisma.Decimal). Alíquotas em fração (0.18 = 18%).
 */

import { Prisma, RegimeTributario } from '../../../../generated/client'
import { IcmsCalculadora } from './icms.calculadora'
import { PisCalculadora, CofinsCalculadora } from './pis-cofins.calculadora'
import { IpiCalculadora } from './ipi.calculadora'
import {
  ContextoTributo,
  RegraFiscalAplicavel,
} from '../tributos.types'

/** Monta um contexto de tributo com base e regra para os testes. */
function contexto(
  base: number,
  regime: RegimeTributario,
  regra: RegraFiscalAplicavel | null,
): ContextoTributo {
  return {
    item: { ncm: '61091000', quantidade: 1, valorUnitario: base, valorTotal: base },
    base: new Prisma.Decimal(base),
    regra,
    regime,
    uf: {},
  }
}

describe('IcmsCalculadora', () => {
  const calc = new IcmsCalculadora()

  it('Simples Nacional: CSOSN 102 sem destaque de ICMS (valor 0)', () => {
    const regra: RegraFiscalAplicavel = {
      cstIcms: '102',
      aliquotaIcms: 0,
      cstPis: '49',
      aliquotaPis: 0,
      cstCofins: '49',
      aliquotaCofins: 0,
    }
    const res = calc.calcular(contexto(1000, RegimeTributario.SIMPLES_NACIONAL, regra))

    expect(res.cst).toBe('102')
    expect(res.valor.toNumber()).toBe(0)
    expect(res.base.toNumber()).toBe(0)
    expect(res.aliquota.toNumber()).toBe(0)
  })

  it('Simples sem regra: assume CSOSN 102 padrão, sem destaque', () => {
    const res = calc.calcular(contexto(500, RegimeTributario.SIMPLES_NACIONAL, null))
    expect(res.cst).toBe('102')
    expect(res.valor.toNumber()).toBe(0)
  })

  it('MEI: também usa CSOSN (não destaca ICMS)', () => {
    const regra: RegraFiscalAplicavel = {
      cstIcms: '500',
      aliquotaIcms: 0,
      cstPis: '49',
      aliquotaPis: 0,
      cstCofins: '49',
      aliquotaCofins: 0,
    }
    const res = calc.calcular(contexto(1000, RegimeTributario.MEI, regra))
    expect(res.cst).toBe('500')
    expect(res.valor.toNumber()).toBe(0)
  })

  it('Regime normal: ICMS CST 00 a 18% → valor = base × 0.18', () => {
    const regra: RegraFiscalAplicavel = {
      cstIcms: '00',
      aliquotaIcms: 0.18,
      cstPis: '01',
      aliquotaPis: 0.0165,
      cstCofins: '01',
      aliquotaCofins: 0.076,
    }
    const res = calc.calcular(contexto(1000, RegimeTributario.LUCRO_REAL, regra))

    expect(res.cst).toBe('00')
    expect(res.base.toNumber()).toBe(1000)
    expect(res.aliquota.toNumber()).toBe(0.18)
    expect(res.valor.toNumber()).toBe(180) // 1000 × 0,18
  })

  it('Regime normal: ICMS 12% sobre R$ 1.234,56 = R$ 148,15 (arredondado)', () => {
    const regra: RegraFiscalAplicavel = {
      cstIcms: '00',
      aliquotaIcms: 0.12,
      cstPis: '01',
      aliquotaPis: 0.0165,
      cstCofins: '01',
      aliquotaCofins: 0.076,
    }
    const res = calc.calcular(contexto(1234.56, RegimeTributario.LUCRO_PRESUMIDO, regra))
    // 1234,56 × 0,12 = 148,1472 → 148,15 (ROUND_HALF_UP a 2 casas)
    expect(res.valor.toFixed(2)).toBe('148.15')
  })
})

describe('PisCalculadora / CofinsCalculadora', () => {
  const pis = new PisCalculadora()
  const cofins = new CofinsCalculadora()

  it('não-cumulativo (Lucro Real): PIS 1,65% e COFINS 7,6% com CST 01', () => {
    const regra: RegraFiscalAplicavel = {
      cstIcms: '00',
      aliquotaIcms: 0.18,
      cstPis: '01',
      aliquotaPis: 0.0165,
      cstCofins: '01',
      aliquotaCofins: 0.076,
    }
    const ctx = contexto(1000, RegimeTributario.LUCRO_REAL, regra)

    const rp = pis.calcular(ctx)
    const rc = cofins.calcular(ctx)

    expect(rp.cst).toBe('01')
    expect(rp.valor.toNumber()).toBe(16.5) // 1000 × 0,0165
    expect(rc.cst).toBe('01')
    expect(rc.valor.toNumber()).toBe(76) // 1000 × 0,076
  })

  it('cumulativo (Lucro Presumido) sem alíquota na regra: usa padrão 0,65% / 3%', () => {
    // Regra com CST tributado, mas alíquota 0 → cai no padrão do regime.
    const regra: RegraFiscalAplicavel = {
      cstIcms: '00',
      aliquotaIcms: 0.18,
      cstPis: '01',
      aliquotaPis: 0,
      cstCofins: '01',
      aliquotaCofins: 0,
    }
    const ctx = contexto(1000, RegimeTributario.LUCRO_PRESUMIDO, regra)

    expect(pis.calcular(ctx).valor.toNumber()).toBe(6.5) // 1000 × 0,0065
    expect(cofins.calcular(ctx).valor.toNumber()).toBe(30) // 1000 × 0,03
  })

  it('CST não tributado (06 alíquota zero): PIS/COFINS sem destaque', () => {
    const regra: RegraFiscalAplicavel = {
      cstIcms: '00',
      aliquotaIcms: 0.18,
      cstPis: '06',
      aliquotaPis: 0,
      cstCofins: '06',
      aliquotaCofins: 0,
    }
    const ctx = contexto(1000, RegimeTributario.LUCRO_REAL, regra)

    const rp = pis.calcular(ctx)
    expect(rp.cst).toBe('06')
    expect(rp.valor.toNumber()).toBe(0)
    expect(cofins.calcular(ctx).valor.toNumber()).toBe(0)
  })
})

describe('IpiCalculadora', () => {
  const calc = new IpiCalculadora()

  it('sem regra de IPI: CST 53 (não tributada), sem destaque', () => {
    const res = calc.calcular(contexto(1000, RegimeTributario.LUCRO_REAL, null))
    expect(res.cst).toBe('53')
    expect(res.valor.toNumber()).toBe(0)
  })

  it('CST 50 com alíquota 5%: destaca IPI = base × 0,05', () => {
    const regra: RegraFiscalAplicavel = {
      cstIcms: '00',
      aliquotaIcms: 0.18,
      cstPis: '01',
      aliquotaPis: 0.0165,
      cstCofins: '01',
      aliquotaCofins: 0.076,
      cstIpi: '50',
      aliquotaIpi: 0.05,
    }
    const res = calc.calcular(contexto(1000, RegimeTributario.LUCRO_REAL, regra))
    expect(res.cst).toBe('50')
    expect(res.valor.toNumber()).toBe(50)
  })
})
