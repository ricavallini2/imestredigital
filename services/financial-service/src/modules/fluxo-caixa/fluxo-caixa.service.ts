/**
 * Serviço de Fluxo de Caixa.
 * Geração e projeção do fluxo de caixa.
 */

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import Decimal from 'decimal.js';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class FluxoCaixaService {
  private readonly logger = new Logger('FluxoCaixaService');

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /**
   * Gera relatório de fluxo de caixa para um período.
   */
  async gerarFluxoCaixa(tenantId: string, dataInicio: Date, dataFim: Date) {
    const cacheKey = `fluxo_caixa:${tenantId}:${dataInicio.toISOString()}:${dataFim.toISOString()}`;
    const cacheado = await this.cache.obter<any>(cacheKey);
    if (cacheado) return cacheado;

    // Buscar lançamentos do período
    const lancamentos = await this.prisma.lancamento.findMany({
      where: {
        tenantId,
        dataVencimento: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: { conta: true },
      orderBy: { dataVencimento: 'asc' },
    });

    // Agrupar por conta e data
    const fluxoPorConta: Record<string, any> = {};
    const fluxoPorData: Record<string, any> = {};

    let saldoAcumulado = new Decimal(0);
    const entradas = new Decimal(0);
    const saidas = new Decimal(0);

    for (const lance of lancamentos) {
      const dataKey = lance.dataVencimento.toISOString().split('T')[0];
      const contaId = lance.contaId || 'indefinida';
      const valor = new Decimal(lance.valor);

      // Por conta
      if (!fluxoPorConta[contaId]) {
        fluxoPorConta[contaId] = {
          contaId,
          contaNome: lance.conta?.nome || 'Indefinida',
          receitas: new Decimal(0),
          despesas: new Decimal(0),
          saldo: new Decimal(0),
        };
      }

      if (lance.tipo === 'RECEITA') {
        fluxoPorConta[contaId].receitas = fluxoPorConta[contaId].receitas.plus(valor);
        saldoAcumulado = saldoAcumulado.plus(valor);
      } else {
        fluxoPorConta[contaId].despesas = fluxoPorConta[contaId].despesas.plus(valor);
        saldoAcumulado = saldoAcumulado.minus(valor);
      }

      fluxoPorConta[contaId].saldo = saldoAcumulado;

      // Por data
      if (!fluxoPorData[dataKey]) {
        fluxoPorData[dataKey] = {
          data: dataKey,
          receitas: new Decimal(0),
          despesas: new Decimal(0),
          saldo: new Decimal(0),
        };
      }

      if (lance.tipo === 'RECEITA') {
        fluxoPorData[dataKey].receitas = fluxoPorData[dataKey].receitas.plus(valor);
      } else {
        fluxoPorData[dataKey].despesas = fluxoPorData[dataKey].despesas.plus(valor);
      }
    }

    // Recalcular saldos por data
    saldoAcumulado = new Decimal(0);
    for (const data in fluxoPorData) {
      fluxoPorData[data].saldo = fluxoPorData[data].receitas.minus(fluxoPorData[data].despesas);
      saldoAcumulado = saldoAcumulado.plus(fluxoPorData[data].saldo);
      fluxoPorData[data].saldoAcumulado = saldoAcumulado;
    }

    const resultado = {
      tenantId,
      periodo: { dataInicio, dataFim },
      fluxoPorConta: Object.values(fluxoPorConta),
      fluxoPorData: Object.values(fluxoPorData),
      resumo: {
        totalReceitas: Object.values(fluxoPorConta).reduce(
          (acc: any, c: any) => acc.plus(c.receitas),
          new Decimal(0),
        ),
        totalDespesas: Object.values(fluxoPorConta).reduce(
          (acc: any, c: any) => acc.plus(c.despesas),
          new Decimal(0),
        ),
        saldoLiquido: saldoAcumulado,
      },
    };

    // Cachear por 1 dia
    await this.cache.definir(cacheKey, resultado, 86400);

    return resultado;
  }

  /**
   * Projeta fluxo de caixa para meses futuros.
   */
  async projetar(tenantId: string, meses: number = 6) {
    if (meses < 1 || meses > 24) {
      throw new BadRequestException('Meses deve estar entre 1 e 24');
    }

    // Buscar recorrências ativas
    const recorrencias = await this.prisma.recorrencia.findMany({
      where: {
        tenantId,
        ativa: true,
      },
    });

    const agora = new Date();
    const projecao: Record<string, any> = {};

    // Simular cada recorrência
    for (const rec of recorrencias) {
      let dataProxima = new Date(rec.proximaGeracao);

      for (let i = 0; i < meses; i++) {
        const mesKey = `${dataProxima.getFullYear()}-${String(dataProxima.getMonth() + 1).padStart(2, '0')}`;

        if (!projecao[mesKey]) {
          projecao[mesKey] = {
            mes: mesKey,
            receitas: new Decimal(0),
            despesas: new Decimal(0),
          };
        }

        const valor = new Decimal(rec.valor);

        if (rec.tipo === 'RECEITA') {
          projecao[mesKey].receitas = projecao[mesKey].receitas.plus(valor);
        } else {
          projecao[mesKey].despesas = projecao[mesKey].despesas.plus(valor);
        }

        // Calcular próxima data
        const proximaData = new Date(dataProxima);
        switch (rec.frequencia) {
          case 'MENSAL':
            proximaData.setMonth(proximaData.getMonth() + 1);
            break;
          case 'BIMESTRAL':
            proximaData.setMonth(proximaData.getMonth() + 2);
            break;
          case 'TRIMESTRAL':
            proximaData.setMonth(proximaData.getMonth() + 3);
            break;
          case 'SEMESTRAL':
            proximaData.setMonth(proximaData.getMonth() + 6);
            break;
          case 'ANUAL':
            proximaData.setFullYear(proximaData.getFullYear() + 1);
            break;
          default:
            proximaData.setMonth(proximaData.getMonth() + 1);
        }
        dataProxima = proximaData;
      }
    }

    // Calcular saldo acumulado
    const projecaoOrdenada = Object.values(projecao).sort((a: any, b: any) =>
      a.mes.localeCompare(b.mes),
    );

    let saldoAcumulado = new Decimal(0);
    for (const mes of projecaoOrdenada as any[]) {
      mes.saldoMensal = mes.receitas.minus(mes.despesas);
      saldoAcumulado = saldoAcumulado.plus(mes.saldoMensal);
      mes.saldoAcumulado = saldoAcumulado;
    }

    return {
      tenantId,
      dataProjecao: agora,
      meses,
      projecao: projecaoOrdenada,
    };
  }

  /**
   * Obtém resumo mensal do fluxo.
   */
  async obterResumoMensal(tenantId: string, ano: number, mes: number) {
    const dataInicio = new Date(ano, mes - 1, 1);
    const dataFim = new Date(ano, mes, 0);

    return this.gerarFluxoCaixa(tenantId, dataInicio, dataFim);
  }

  /**
   * Obtém saldo por conta.
   */
  async obterSaldoPorConta(tenantId: string) {
    const contas = await this.prisma.contaFinanceira.findMany({
      where: { tenantId, ativa: true },
    });

    return {
      tenantId,
      contas: contas.map((c) => ({
        id: c.id,
        nome: c.nome,
        tipo: c.tipo,
        saldoAtual: c.saldoAtual,
      })),
      saldoTotal: contas.reduce(
        (sum, c) => sum.plus(new Decimal(c.saldoAtual)),
        new Decimal(0),
      ),
    };
  }
}
