/**
 * Engine de tributos.
 *
 * Calcula, por item, os impostos (ICMS/PIS/COFINS/IPI no MVP) a partir da
 * RegraFiscal aplicável do tenant e do regime tributário, delegando cada
 * imposto a uma CalculadoraTributo dedicada. Consolida os totalizadores da
 * nota.
 *
 * Unidade monetária: REAIS com Prisma.Decimal ponta a ponta (sem centavos).
 */

import { Injectable, Logger } from '@nestjs/common'
import { Prisma, RegimeTributario } from '../../../generated/client'
import { RegraFiscalRepository } from '../regra-fiscal/regra-fiscal.repository'
import {
  CalculadoraTributo,
  ContextoTributo,
  ItemNotaCalculado,
  ItemTributavel,
  RegraFiscalAplicavel,
  ResultadoCalculoTributos,
  ResultadoTributo,
  TotaisNota,
  UfOperacao,
} from './tributos.types'
import { paraDecimal, arredondarMoeda } from './dinheiro.util'
import { criarIcmsCalculadora } from './calculadoras/icms.calculadora'
import {
  criarPisCalculadora,
  criarCofinsCalculadora,
} from './calculadoras/pis-cofins.calculadora'
import { IpiCalculadora } from './calculadoras/ipi.calculadora'

@Injectable()
export class TributosService {
  private readonly logger = new Logger('TributosService')

  /** Calculadoras registradas (ordem estável: ICMS, PIS, COFINS, IPI). */
  private readonly calculadoras: CalculadoraTributo[]

  constructor(private readonly regraRepository: RegraFiscalRepository) {
    this.calculadoras = [
      criarIcmsCalculadora(),
      criarPisCalculadora(),
      criarCofinsCalculadora(),
      new IpiCalculadora(),
    ]
  }

  /**
   * Calcula os tributos de uma lista de itens para um tenant/regime.
   *
   * @param tenantId - tenant dono das regras fiscais.
   * @param itens - itens tributáveis (NCM obrigatório; valorTotal opcional).
   * @param regime - regime tributário do emitente.
   * @param uf - UF de origem/destino da operação (para escolher a regra).
   */
  async calcular(
    tenantId: string,
    itens: ItemTributavel[],
    regime: RegimeTributario,
    uf: UfOperacao = {},
  ): Promise<ResultadoCalculoTributos> {
    const itensCalculados: ItemNotaCalculado[] = []

    const totais: TotaisNota = {
      valorProdutos: new Prisma.Decimal(0),
      valorDesconto: new Prisma.Decimal(0),
      valorIcms: new Prisma.Decimal(0),
      valorPis: new Prisma.Decimal(0),
      valorCofins: new Prisma.Decimal(0),
      valorIpi: new Prisma.Decimal(0),
    }

    for (const item of itens) {
      const calculado = await this.calcularItem(tenantId, item, regime, uf)
      itensCalculados.push(calculado)

      totais.valorProdutos = totais.valorProdutos.plus(paraDecimal(calculado.valorTotal))
      totais.valorDesconto = totais.valorDesconto.plus(paraDecimal(calculado.valorDesconto))
      totais.valorIcms = totais.valorIcms.plus(paraDecimal(calculado.valorIcms))
      totais.valorPis = totais.valorPis.plus(paraDecimal(calculado.valorPis))
      totais.valorCofins = totais.valorCofins.plus(paraDecimal(calculado.valorCofins))
      totais.valorIpi = totais.valorIpi.plus(paraDecimal(calculado.valorIpi))
    }

    // Normaliza os totalizadores a 2 casas.
    totais.valorProdutos = arredondarMoeda(totais.valorProdutos)
    totais.valorDesconto = arredondarMoeda(totais.valorDesconto)
    totais.valorIcms = arredondarMoeda(totais.valorIcms)
    totais.valorPis = arredondarMoeda(totais.valorPis)
    totais.valorCofins = arredondarMoeda(totais.valorCofins)
    totais.valorIpi = arredondarMoeda(totais.valorIpi)

    return { itens: itensCalculados, totalizadores: totais }
  }

  /**
   * Calcula os tributos de um único item.
   */
  private async calcularItem(
    tenantId: string,
    item: ItemTributavel,
    regime: RegimeTributario,
    uf: UfOperacao,
  ): Promise<ItemNotaCalculado> {
    const base = this.resolverBase(item)

    const regra = (await this.regraRepository.buscarRegraAplicavel(
      tenantId,
      item.ncm,
      uf.origem,
      uf.destino,
      regime,
    )) as RegraFiscalAplicavel | null

    const ctx: ContextoTributo = { item, base, regra, regime, uf }

    const resultados: ResultadoTributo[] = this.calculadoras.map((calc) => calc.calcular(ctx))
    const porImposto = this.indexar(resultados)

    const icms = porImposto.ICMS
    const pis = porImposto.PIS
    const cofins = porImposto.COFINS
    const ipi = porImposto.IPI

    return {
      produtoId: item.produtoId,
      descricao: item.descricao,
      ncm: item.ncm,
      cfop: item.cfop ?? regra?.['cfop'],
      unidade: item.unidade,
      quantidade: paraDecimal(item.quantidade),
      valorUnitario: paraDecimal(item.valorUnitario),
      valorTotal: this.resolverValorTotal(item),
      valorDesconto: paraDecimal(item.valorDesconto),
      origemMercadoria: item.origemMercadoria ?? '0',

      cstIcms: icms.cst,
      aliquotaIcms: icms.aliquota,
      baseIcms: icms.base,
      valorIcms: icms.valor,

      cstPis: pis.cst,
      aliquotaPis: pis.aliquota,
      basePis: pis.base,
      valorPis: pis.valor,

      cstCofins: cofins.cst,
      aliquotaCofins: cofins.aliquota,
      baseCofins: cofins.base,
      valorCofins: cofins.valor,

      cstIpi: ipi.cst || null,
      aliquotaIpi: ipi.aliquota,
      baseIpi: ipi.base,
      valorIpi: ipi.valor,

      tributos: resultados,
    }
  }

  /**
   * Base de cálculo do item em reais: valorTotal (ou qtd × unit) menos o
   * desconto. Nunca negativa.
   */
  private resolverBase(item: ItemTributavel): Prisma.Decimal {
    const total = this.resolverValorTotal(item)
    const desconto = paraDecimal(item.valorDesconto)
    const base = total.minus(desconto)
    return base.isNegative() ? new Prisma.Decimal(0) : base
  }

  /** valorTotal do item: usa o informado ou deriva de quantidade × unitário. */
  private resolverValorTotal(item: ItemTributavel): Prisma.Decimal {
    if (item.valorTotal !== undefined && item.valorTotal !== null) {
      return paraDecimal(item.valorTotal)
    }
    return arredondarMoeda(paraDecimal(item.quantidade).times(paraDecimal(item.valorUnitario)))
  }

  /** Indexa os resultados por sigla de imposto para acesso direto. */
  private indexar(resultados: ResultadoTributo[]): Record<ResultadoTributo['imposto'], ResultadoTributo> {
    const mapa = {} as Record<ResultadoTributo['imposto'], ResultadoTributo>
    for (const r of resultados) {
      mapa[r.imposto] = r
    }
    return mapa
  }
}
