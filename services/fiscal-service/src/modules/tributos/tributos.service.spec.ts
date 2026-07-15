/**
 * Testes do TributosService (engine) com RegraFiscalRepository mockado.
 *
 * Cobrem o fluxo ponta a ponta por item + totalizadores, nos regimes exigidos:
 *  - Simples Nacional (CSOSN 102, sem ICMS destacado; PIS/COFINS via regra).
 *  - Regime normal (ICMS CST 00 18%; PIS/COFINS 1,65%/7,6%).
 *  - Derivação de valorTotal = quantidade × valorUnitário quando ausente.
 */

import { Prisma, RegimeTributario } from '../../../generated/client'
import { TributosService } from './tributos.service'
import { RegraFiscalAplicavel, ItemTributavel } from './tributos.types'

/** Cria um mock de RegraFiscalRepository que devolve sempre a regra dada. */
function mockRegraRepo(regra: RegraFiscalAplicavel | null) {
  return {
    buscarRegraAplicavel: jest.fn().mockResolvedValue(regra),
  } as any
}

const TENANT = '10000000-0000-0000-0000-000000000001'

describe('TributosService', () => {
  it('Simples Nacional: CSOSN 102 sem ICMS; totalizadores consistentes', async () => {
    const regra: RegraFiscalAplicavel = {
      cfop: '5102',
      cstIcms: '102',
      aliquotaIcms: 0,
      cstPis: '49',
      aliquotaPis: 0,
      cstCofins: '49',
      aliquotaCofins: 0,
    }
    const service = new TributosService(mockRegraRepo(regra))

    const itens: ItemTributavel[] = [
      { ncm: '61091000', quantidade: 2, valorUnitario: 500, valorTotal: 1000 },
    ]

    const res = await service.calcular(TENANT, itens, RegimeTributario.SIMPLES_NACIONAL)

    const item = res.itens[0]
    expect(item.cstIcms).toBe('102')
    expect(new Prisma.Decimal(item.valorIcms).toNumber()).toBe(0)
    // Simples via regra sem alíquota → PIS/COFINS também sem destaque.
    expect(new Prisma.Decimal(item.valorPis).toNumber()).toBe(0)
    expect(new Prisma.Decimal(item.valorCofins).toNumber()).toBe(0)

    expect(res.totalizadores.valorProdutos.toNumber()).toBe(1000)
    expect(res.totalizadores.valorIcms.toNumber()).toBe(0)
  })

  it('Regime normal: ICMS 00 18% + PIS 1,65% + COFINS 7,6% por item e no total', async () => {
    const regra: RegraFiscalAplicavel = {
      cfop: '5102',
      cstIcms: '00',
      aliquotaIcms: 0.18,
      cstPis: '01',
      aliquotaPis: 0.0165,
      cstCofins: '01',
      aliquotaCofins: 0.076,
    }
    const service = new TributosService(mockRegraRepo(regra))

    const itens: ItemTributavel[] = [
      { ncm: '85166000', quantidade: 1, valorUnitario: 1000, valorTotal: 1000 },
    ]

    const res = await service.calcular(TENANT, itens, RegimeTributario.LUCRO_REAL)

    const item = res.itens[0]
    expect(item.cstIcms).toBe('00')
    expect(new Prisma.Decimal(item.baseIcms).toNumber()).toBe(1000)
    expect(new Prisma.Decimal(item.valorIcms).toNumber()).toBe(180)
    expect(new Prisma.Decimal(item.valorPis).toNumber()).toBe(16.5)
    expect(new Prisma.Decimal(item.valorCofins).toNumber()).toBe(76)

    expect(res.totalizadores.valorIcms.toNumber()).toBe(180)
    expect(res.totalizadores.valorPis.toNumber()).toBe(16.5)
    expect(res.totalizadores.valorCofins.toNumber()).toBe(76)
  })

  it('deriva valorTotal = quantidade × valorUnitário quando não informado', async () => {
    const regra: RegraFiscalAplicavel = {
      cfop: '5102',
      cstIcms: '00',
      aliquotaIcms: 0.18,
      cstPis: '01',
      aliquotaPis: 0.0165,
      cstCofins: '01',
      aliquotaCofins: 0.076,
    }
    const service = new TributosService(mockRegraRepo(regra))

    // valorTotal ausente: 3 × 250 = 750.
    const itens: ItemTributavel[] = [{ ncm: '85166000', quantidade: 3, valorUnitario: 250 }]

    const res = await service.calcular(TENANT, itens, RegimeTributario.LUCRO_REAL)

    expect(new Prisma.Decimal(res.itens[0].valorTotal).toNumber()).toBe(750)
    expect(new Prisma.Decimal(res.itens[0].valorIcms).toNumber()).toBe(135) // 750 × 0,18
  })

  it('desconto reduz a base de cálculo do item', async () => {
    const regra: RegraFiscalAplicavel = {
      cfop: '5102',
      cstIcms: '00',
      aliquotaIcms: 0.18,
      cstPis: '01',
      aliquotaPis: 0.0165,
      cstCofins: '01',
      aliquotaCofins: 0.076,
    }
    const service = new TributosService(mockRegraRepo(regra))

    // Base = 1000 - 100 = 900 → ICMS = 162.
    const itens: ItemTributavel[] = [
      { ncm: '85166000', quantidade: 1, valorUnitario: 1000, valorTotal: 1000, valorDesconto: 100 },
    ]

    const res = await service.calcular(TENANT, itens, RegimeTributario.LUCRO_REAL)
    expect(new Prisma.Decimal(res.itens[0].baseIcms).toNumber()).toBe(900)
    expect(new Prisma.Decimal(res.itens[0].valorIcms).toNumber()).toBe(162)
  })

  it('sem regra aplicável: não presume tributo (ICMS 0), mas mantém CST padrão', async () => {
    const service = new TributosService(mockRegraRepo(null))

    const itens: ItemTributavel[] = [
      { ncm: '99999999', quantidade: 1, valorUnitario: 100, valorTotal: 100 },
    ]

    const res = await service.calcular(TENANT, itens, RegimeTributario.LUCRO_REAL)
    const item = res.itens[0]
    expect(item.cstIcms).toBe('00') // CST padrão do regime normal
    expect(new Prisma.Decimal(item.valorIcms).toNumber()).toBe(0) // sem alíquota → 0
  })
})
