/**
 * Serviço de DRE (Demonstração de Resultado do Exercício).
 * Geração de relatórios financeiros.
 */

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

/** Formato mínimo de lançamento necessário para as agregações da DRE. */
interface LancamentoAgregavel {
  tipo: string;
  categoria: string | null;
  valor: Decimal | string | number;
}

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

    // Buscar lançamentos pagos no período (competência = dataPagamento).
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

    // Soma os valores (Decimal) das RECEITAS cujas categorias constam em
    // `categorias` (case-insensitive).
    const somaReceitaCat = (categorias: string[]): Decimal =>
      this.somarPorCategoria(lancamentos, 'RECEITA', categorias);
    // Soma os valores (Decimal) das DESPESAS cujas categorias constam em `categorias`.
    const somaDespesaCat = (categorias: string[]): Decimal =>
      this.somarPorCategoria(lancamentos, 'DESPESA', categorias);

    // ── RECEITAS ──────────────────────────────────────────────────────────
    const receitasFinanceiras = somaReceitaCat(['Financeiro']);
    const receitaBruta = lancamentos
      .filter((l) => l.tipo === 'RECEITA')
      .reduce((acc, l) => acc.plus(new Decimal(l.valor)), new Decimal(0));

    // ── DEDUÇÕES ──────────────────────────────────────────────────────────
    // Impostos incidentes sobre a receita (categoria DESPESA "Impostos").
    const deducoes = somaDespesaCat(['Impostos']);
    const receitaLiquida = receitaBruta.minus(deducoes);

    // ── CMV (custo da mercadoria vendida = compras de estoque) ─────────────
    const custosMercadorias = somaDespesaCat(['Compras', 'CMV']);
    const lucroBruto = receitaLiquida.minus(custosMercadorias);

    // ── DESPESAS OPERACIONAIS (por classe) ────────────────────────────────
    // Operacionais: pessoal, ocupação e operacional (infra/utilidades).
    const despesasOperacionais = somaDespesaCat([
      'Pessoal',
      'Ocupação',
      'Ocupacao',
      'Operacional',
    ]);
    // Comerciais: marketing e vendas.
    const despesasComerciais = somaDespesaCat(['Marketing', 'Comercial', 'Vendas']);
    // Administrativas: demais despesas não classificadas acima e não financeiras.
    const classificadas = [
      'Impostos',
      'Compras',
      'CMV',
      'Pessoal',
      'Ocupação',
      'Ocupacao',
      'Operacional',
      'Marketing',
      'Comercial',
      'Vendas',
      'Financeiro',
    ].map((c) => c.toLowerCase());
    const despesasAdministrativas = lancamentos
      .filter(
        (l) =>
          l.tipo === 'DESPESA' &&
          !classificadas.includes((l.categoria ?? '').toLowerCase()),
      )
      .reduce((acc, l) => acc.plus(new Decimal(l.valor)), new Decimal(0));

    const resultadoOperacional = lucroBruto
      .minus(despesasOperacionais)
      .minus(despesasAdministrativas)
      .minus(despesasComerciais);

    // ── RESULTADO FINANCEIRO ──────────────────────────────────────────────
    const despesasFinanceiras = somaDespesaCat(['Financeiro']);

    const lucroLiquido = resultadoOperacional
      .plus(receitasFinanceiras)
      .minus(despesasFinanceiras);

    // Persistir DRE (upsert: idempotente na regeneração do mesmo período,
    // respeitando o unique composto (tenantId, ano, mes)).
    const dadosDre = {
      periodo: 'MENSAL',
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
    };

    const dre = await this.prisma.dRE.upsert({
      where: { tenantId_ano_mes: { tenantId, ano, mes } },
      update: dadosDre,
      create: { tenantId, ano, mes, ...dadosDre },
    });

    // Cachear por 30 dias
    await this.cache.definir(cacheKey, dre, 2592000);

    this.logger.log(`DRE gerada: ${tenantId}/${ano}/${mes}`);

    return dre;
  }

  /**
   * Soma (Decimal) os valores dos lançamentos de um `tipo` cujas categorias
   * constam em `categorias` (comparação case-insensitive, tolerante a acentos
   * já normalizados na lista). Base única para todas as linhas da DRE.
   */
  private somarPorCategoria(
    lancamentos: LancamentoAgregavel[],
    tipo: 'RECEITA' | 'DESPESA',
    categorias: string[],
  ): Decimal {
    const alvo = categorias.map((c) => c.toLowerCase());
    return lancamentos
      .filter(
        (l) =>
          l.tipo === tipo && alvo.includes((l.categoria ?? '').toLowerCase()),
      )
      .reduce((acc, l) => acc.plus(new Decimal(l.valor as Decimal)), new Decimal(0));
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
