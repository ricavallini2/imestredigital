/**
 * Serviço de DRE (Demonstração de Resultado do Exercício).
 * Geração de relatórios financeiros.
 */

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class DreService {
  private readonly logger = new Logger('DreService');

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /**
   * Gera DRE para um período.
   */
  async gerarDre(tenantId: string, mes: number, ano: number) {
    if (mes < 1 || mes > 12) {
      throw new BadRequestException('Mês deve estar entre 1 e 12');
    }

    const cacheKey = `dre:${tenantId}:${ano}:${mes}`;
    const cacheado = await this.cache.obter<any>(cacheKey);
    if (cacheado) return cacheado;

    // Período para buscar lançamentos
    const dataInicio = new Date(ano, mes - 1, 1);
    const dataFim = new Date(ano, mes, 0, 23, 59, 59);

    // Buscar lançamentos pagos no período
    const lancamentos = await this.prisma.lancamento.findMany({
      where: {
        tenantId,
        dataPagamento: {
          gte: dataInicio,
          lte: dataFim,
        },
        status: 'PAGO',
      },
    });

    // Agrupar por tipo
    const receitas = lancamentos
      .filter((l) => l.tipo === 'RECEITA')
      .map((l) => new Decimal(l.valor))
      .reduce((acc, val) => acc.plus(val), new Decimal(0));

    const despesas = lancamentos
      .filter((l) => l.tipo === 'DESPESA')
      .map((l) => new Decimal(l.valor))
      .reduce((acc, val) => acc.plus(val), new Decimal(0));

    // Calcular métricas
    const receitaBruta = receitas;
    const deducoes = new Decimal(0); // Pode ser configurado
    const receitaLiquida = receitaBruta.minus(deducoes);

    const custosMercadorias = new Decimal(0); // Buscar de lançamentos com tag "CMV"
    const lucroBruto = receitaLiquida.minus(custosMercadorias);

    const despesasOperacionais = new Decimal(0);
    const despesasAdministrativas = new Decimal(0);
    const despesasComerciais = new Decimal(0);

    const resultadoOperacional = lucroBruto
      .minus(despesasOperacionais)
      .minus(despesasAdministrativas)
      .minus(despesasComerciais);

    const despesasFinanceiras = new Decimal(0);
    const receitasFinanceiras = new Decimal(0);

    const lucroLiquido = resultadoOperacional
      .plus(receitasFinanceiras)
      .minus(despesasFinanceiras);

    // Salvar DRE
    const dre = await this.prisma.dRE.create({
      data: {
        tenantId,
        periodo: 'MENSAL',
        ano,
        mes,
        receitaBruta,
        deducoes,
        receitaLiquida,
        custosMercadorias,
        lucroBruto,
        despesasOperacionais,
        despesasAdministrativas,
        despesasComerciais,
        resultadoOperacional,
        despesasFinanceiras,
        receitasFinanceiras,
        lucroLiquido,
      },
    });

    // Cachear por 30 dias
    await this.cache.definir(cacheKey, dre, 2592000);

    this.logger.log(`DRE gerada: ${tenantId}/${ano}/${mes}`);

    return dre;
  }

  /**
   * Lista DREs de um tenant.
   */
  async listarDres(tenantId: string, ano?: number) {
    const where: any = { tenantId };
    if (ano) where.ano = ano;

    return this.prisma.dRE.findMany({
      where,
      orderBy: [{ ano: 'desc' }, { mes: 'desc' }],
    });
  }

  /**
   * Compara DRE de dois períodos.
   */
  async compararPeriodos(
    tenantId: string,
    ano1: number,
    mes1: number,
    ano2: number,
    mes2: number,
  ) {
    const dre1 = await this.gerarDre(tenantId, mes1, ano1);
    const dre2 = await this.gerarDre(tenantId, mes2, ano2);

    return {
      periodo1: { ano: ano1, mes: mes1, dre: dre1 },
      periodo2: { ano: ano2, mes: mes2, dre: dre2 },
      comparacao: {
        receitaLiquida: {
          periodo1: dre1.receitaLiquida,
          periodo2: dre2.receitaLiquida,
          variacao: dre2.receitaLiquida.minus(dre1.receitaLiquida),
          variacaoPercentual: dre1.receitaLiquida.gt(0)
            ? dre2.receitaLiquida
                .minus(dre1.receitaLiquida)
                .div(dre1.receitaLiquida)
                .times(100)
            : new Decimal(0),
        },
        lucroLiquido: {
          periodo1: dre1.lucroLiquido,
          periodo2: dre2.lucroLiquido,
          variacao: dre2.lucroLiquido.minus(dre1.lucroLiquido),
          variacaoPercentual: dre1.lucroLiquido.gt(0)
            ? dre2.lucroLiquido
                .minus(dre1.lucroLiquido)
                .div(dre1.lucroLiquido)
                .times(100)
            : new Decimal(0),
        },
      },
    };
  }
}
