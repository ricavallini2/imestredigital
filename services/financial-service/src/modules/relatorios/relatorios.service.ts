/**
 * Serviço de Relatórios Financeiros (para o frontend).
 *
 * Monta as respostas nos MESMOS shapes que os mocks do front esperam
 * (apps/web/src/app/api/v1/financeiro/{fluxo-caixa,dre,resumo}), a partir
 * dos dados reais do PostgreSQL. Todas as queries filtram por tenantId.
 *
 * Convenções alinhadas ao mock:
 * - Período ancorado em `dataVencimento` (não em dataPagamento).
 * - "Realizado" = status PAGO. "A receber/pagar" = PENDENTE/ATRASADO.
 * - Categorias de domínio: RECEITA {Vendas, Marketplaces, Serviços, Financeiro};
 *   DESPESA {Ocupação, Pessoal, Operacional, Marketing, Impostos, Compras}.
 * - `origem` de receita é derivada: pedidoId presente → PEDIDO; senão MANUAL.
 */

import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { PrismaService } from '../prisma/prisma.service';
import { ContaRepository } from '../conta/conta.repository';

/** Linha mínima de lançamento usada nas agregações. */
interface LinhaLancamento {
  tipo: string;
  status: string;
  categoria: string | null;
  valor: Decimal;
  dataVencimento: Date;
  pedidoId: string | null;
}

const MES_ABREV = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

const MES_NOME = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/** Arredonda um Decimal para 2 casas e devolve `number` (JSON do front). */
function num2(v: Decimal): number {
  return Number(v.toDecimalPlaces(2).toString());
}

@Injectable()
export class RelatoriosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contaRepository: ContaRepository,
  ) {}

  // ─── Helpers de agregação ────────────────────────────────────────────────

  private ehTipo(l: LinhaLancamento, tipo: 'RECEITA' | 'DESPESA'): boolean {
    return l.tipo === tipo;
  }

  private ehCategoria(l: LinhaLancamento, categoria: string): boolean {
    return (l.categoria ?? '').toLowerCase() === categoria.toLowerCase();
  }

  private prefixoPeriodo(data: Date): string {
    // YYYY-MM em UTC.
    return `${data.getUTCFullYear()}-${String(data.getUTCMonth() + 1).padStart(2, '0')}`;
  }

  private somaCat(
    lista: LinhaLancamento[],
    tipo: 'RECEITA' | 'DESPESA',
    categoria: string,
    statuses: string[],
  ): Decimal {
    return lista
      .filter(
        (l) =>
          this.ehTipo(l, tipo) &&
          statuses.includes(l.status) &&
          this.ehCategoria(l, categoria),
      )
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
  }

  private somaExceto(
    lista: LinhaLancamento[],
    tipo: 'RECEITA' | 'DESPESA',
    excluidas: string[],
    statuses: string[],
  ): Decimal {
    const excl = excluidas.map((c) => c.toLowerCase());
    return lista
      .filter(
        (l) =>
          this.ehTipo(l, tipo) &&
          statuses.includes(l.status) &&
          !excl.includes((l.categoria ?? '').toLowerCase()),
      )
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
  }

  /** Carrega todos os lançamentos do tenant como linhas Decimal tipadas. */
  private async carregarLancamentos(tenantId: string): Promise<LinhaLancamento[]> {
    const registros = await this.prisma.lancamento.findMany({
      where: { tenantId },
      select: {
        tipo: true,
        status: true,
        categoria: true,
        valor: true,
        dataVencimento: true,
        pedidoId: true,
      },
    });

    return registros.map((r) => ({
      tipo: r.tipo,
      status: r.status,
      categoria: r.categoria,
      valor: new Decimal(r.valor),
      dataVencimento: r.dataVencimento,
      pedidoId: r.pedidoId,
    }));
  }

  // ─── GET /financeiro/fluxo-caixa?meses=N ─────────────────────────────────

  /**
   * Série mensal de receitas/despesas/saldo/saldoAcumulado (PAGO), do mês mais
   * antigo ao atual. Shape idêntico ao mock: { dados: [...], total }.
   */
  async fluxoCaixa(tenantId: string, meses: number) {
    const janela = Math.max(1, Math.min(24, meses || 6));
    const lancamentos = await this.carregarLancamentos(tenantId);

    // Índice YYYY-MM → { receitas, despesas } considerando apenas PAGO.
    const porMes = new Map<string, { receitas: Decimal; despesas: Decimal }>();
    for (const l of lancamentos) {
      if (l.status !== 'PAGO') continue;
      const chave = this.prefixoPeriodo(l.dataVencimento);
      const atual = porMes.get(chave) ?? { receitas: new Decimal(0), despesas: new Decimal(0) };
      if (l.tipo === 'RECEITA') atual.receitas = atual.receitas.plus(l.valor);
      else if (l.tipo === 'DESPESA') atual.despesas = atual.despesas.plus(l.valor);
      porMes.set(chave, atual);
    }

    const hoje = new Date();
    const dados: Array<{
      periodo: string;
      mes: string;
      receitas: number;
      despesas: number;
      saldo: number;
      saldoAcumulado: number;
    }> = [];

    for (let i = janela - 1; i >= 0; i--) {
      const d = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() - i, 1));
      const ano = d.getUTCFullYear();
      const mes = d.getUTCMonth() + 1;
      const chave = `${ano}-${String(mes).padStart(2, '0')}`;
      const totais = porMes.get(chave) ?? { receitas: new Decimal(0), despesas: new Decimal(0) };
      const saldo = totais.receitas.minus(totais.despesas);

      dados.push({
        periodo: `${chave}-01`,
        mes: MES_ABREV[mes - 1],
        receitas: num2(totais.receitas),
        despesas: num2(totais.despesas),
        saldo: num2(saldo),
        saldoAcumulado: 0, // preenchido abaixo
      });
    }

    let acumulado = new Decimal(0);
    for (const p of dados) {
      acumulado = acumulado.plus(new Decimal(p.saldo));
      p.saldoAcumulado = num2(acumulado);
    }

    return { dados, total: dados.length };
  }

  // ─── GET /financeiro/dre?mes=&ano= ───────────────────────────────────────

  /**
   * DRE gerencial do período (PAGO) no shape detalhado do mock, com deduções,
   * CMV, despesas operacionais por classe, EBITDA, resultado financeiro, IR e
   * comparação com o mês anterior.
   */
  async dre(tenantId: string, mes: number, ano: number) {
    const mesRef = Math.max(1, Math.min(12, mes || 1));
    const anoRef = ano || new Date().getUTCFullYear();

    const prefix = `${anoRef}-${String(mesRef).padStart(2, '0')}`;
    const prevMes = mesRef === 1 ? 12 : mesRef - 1;
    const prevAno = mesRef === 1 ? anoRef - 1 : anoRef;
    const prevPrefix = `${prevAno}-${String(prevMes).padStart(2, '0')}`;

    const lancamentos = await this.carregarLancamentos(tenantId);
    const PAGO = ['PAGO'];

    const periodoLan = lancamentos.filter(
      (l) => l.status === 'PAGO' && this.prefixoPeriodo(l.dataVencimento) === prefix,
    );
    const prevLan = lancamentos.filter(
      (l) => l.status === 'PAGO' && this.prefixoPeriodo(l.dataVencimento) === prevPrefix,
    );

    // ── RECEITAS ────────────────────────────────────────────────────────────
    const vendas = this.somaCat(periodoLan, 'RECEITA', 'Vendas', PAGO);
    const marketplaces = this.somaCat(periodoLan, 'RECEITA', 'Marketplaces', PAGO);
    const servicos = this.somaCat(periodoLan, 'RECEITA', 'Serviços', PAGO);
    const financeiro = this.somaCat(periodoLan, 'RECEITA', 'Financeiro', PAGO);
    const outrasRec = this.somaExceto(
      periodoLan,
      'RECEITA',
      ['Vendas', 'Marketplaces', 'Serviços', 'Financeiro'],
      PAGO,
    );
    const receitaBruta = vendas
      .plus(marketplaces)
      .plus(servicos)
      .plus(financeiro)
      .plus(outrasRec);

    // ── DEDUÇÕES ──────────────────────────────────────────────────────────
    const impostosSobreVenda = vendas.plus(marketplaces).times(0.08).toDecimalPlaces(2);
    const devolucoes = new Decimal(0);
    const totalDeducoes = impostosSobreVenda.plus(devolucoes);
    const receitaLiquida = receitaBruta.minus(totalDeducoes);

    // ── CMV (42% de vendas + marketplaces) ────────────────────────────────
    const cmv = vendas.plus(marketplaces).times(0.42).toDecimalPlaces(2);
    const lucroBruto = receitaLiquida.minus(cmv);
    const margemBruta = receitaLiquida.gt(0)
      ? Number(lucroBruto.div(receitaLiquida).times(100).toDecimalPlaces(1).toString())
      : 0;

    // ── DESPESAS OPERACIONAIS ─────────────────────────────────────────────
    const pessoal = this.somaCat(periodoLan, 'DESPESA', 'Pessoal', PAGO);
    const ocupacao = this.somaCat(periodoLan, 'DESPESA', 'Ocupação', PAGO);
    const marketing = this.somaCat(periodoLan, 'DESPESA', 'Marketing', PAGO);
    const operacional = this.somaCat(periodoLan, 'DESPESA', 'Operacional', PAGO);
    const impostos = this.somaCat(periodoLan, 'DESPESA', 'Impostos', PAGO);
    const compras = this.somaCat(periodoLan, 'DESPESA', 'Compras', PAGO);
    const outrasDes = this.somaExceto(
      periodoLan,
      'DESPESA',
      ['Pessoal', 'Ocupação', 'Marketing', 'Operacional', 'Impostos', 'Compras'],
      PAGO,
    );
    const totalDespOp = pessoal
      .plus(ocupacao)
      .plus(marketing)
      .plus(operacional)
      .plus(impostos)
      .plus(compras)
      .plus(outrasDes);

    // ── EBITDA ────────────────────────────────────────────────────────────
    const ebitda = lucroBruto.minus(totalDespOp);
    const margemEbitda = receitaLiquida.gt(0)
      ? Number(ebitda.div(receitaLiquida).times(100).toDecimalPlaces(1).toString())
      : 0;

    // ── RESULTADO FINANCEIRO ──────────────────────────────────────────────
    const recFinanceiro = financeiro;
    const despFinanceiro = new Decimal(0);
    const liquidoFin = recFinanceiro.minus(despFinanceiro);

    // ── RESULTADO ANTES IR / IR / LÍQUIDO ─────────────────────────────────
    const resultadoAntesIR = ebitda.plus(liquidoFin);
    const ir = resultadoAntesIR.gt(0)
      ? resultadoAntesIR.times(0.15).toDecimalPlaces(2)
      : new Decimal(0);
    const resultadoLiquido = resultadoAntesIR.minus(ir);
    const margemLiquida = receitaBruta.gt(0)
      ? Number(resultadoLiquido.div(receitaBruta).times(100).toDecimalPlaces(1).toString())
      : 0;

    // ── COMPARAÇÃO COM MÊS ANTERIOR ───────────────────────────────────────
    const prevReceitaBruta = prevLan
      .filter((l) => l.tipo === 'RECEITA')
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
    const prevDespesas = prevLan
      .filter((l) => l.tipo === 'DESPESA')
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
    const prevLiquido = prevReceitaBruta.minus(prevDespesas);
    const prevMargem = prevReceitaBruta.gt(0)
      ? Number(prevLiquido.div(prevReceitaBruta).times(100).toDecimalPlaces(1).toString())
      : 0;

    return {
      periodo: `${MES_NOME[mesRef - 1]} ${anoRef}`,
      mes: mesRef,
      ano: anoRef,

      receitaBruta: num2(receitaBruta),

      receitas: {
        vendas: num2(vendas),
        marketplaces: num2(marketplaces),
        servicos: num2(servicos),
        financeiro: num2(financeiro),
        outras: num2(outrasRec),
        total: num2(receitaBruta),
      },

      deducoes: {
        impostosSobreVenda: num2(impostosSobreVenda),
        devolucoes: num2(devolucoes),
        total: num2(totalDeducoes),
      },

      receitaLiquida: num2(receitaLiquida),

      cmv: num2(cmv),
      lucroBruto: num2(lucroBruto),
      margemBruta,

      despesasOperacionais: {
        pessoal: num2(pessoal),
        ocupacao: num2(ocupacao),
        marketing: num2(marketing),
        operacional: num2(operacional),
        impostos: num2(impostos),
        compras: num2(compras),
        outras: num2(outrasDes),
        total: num2(totalDespOp),
      },

      ebitda: num2(ebitda),
      margemEbitda,

      resultadoFinanceiro: {
        receitas: num2(recFinanceiro),
        despesas: num2(despFinanceiro),
        liquido: num2(liquidoFin),
      },

      resultadoAntesIR: num2(resultadoAntesIR),
      ir: num2(ir),
      resultadoLiquido: num2(resultadoLiquido),
      margemLiquida,

      comparacao: {
        receitaBruta: num2(prevReceitaBruta),
        resultadoLiquido: num2(prevLiquido),
        margemLiquida: prevMargem,
      },
    };
  }

  // ─── GET /financeiro/resumo ──────────────────────────────────────────────

  /**
   * Resumo do dashboard financeiro no shape do mock: saldos, mês corrente vs.
   * anterior, a receber/pagar, atrasados, projeção, ano, top despesas e
   * receitas por origem. Período ancorado em dataVencimento.
   */
  async resumo(tenantId: string) {
    const lancamentos = await this.carregarLancamentos(tenantId);

    const hoje = new Date();
    const anoAtual = hoje.getUTCFullYear();
    const mesAtual = hoje.getUTCMonth() + 1;
    const prevMes = mesAtual === 1 ? 12 : mesAtual - 1;
    const prevAno = mesAtual === 1 ? anoAtual - 1 : anoAtual;
    const hojeStr = hoje.toISOString().slice(0, 10);

    const prefixMes = `${anoAtual}-${String(mesAtual).padStart(2, '0')}`;
    const prefixPrev = `${prevAno}-${String(prevMes).padStart(2, '0')}`;
    const prefixAno = String(anoAtual);

    const ehMes = (l: LinhaLancamento, prefix: string) =>
      this.prefixoPeriodo(l.dataVencimento) === prefix;
    const ehAno = (l: LinhaLancamento) =>
      String(l.dataVencimento.getUTCFullYear()) === prefixAno;

    // Saldo em contas ativas (fonte real).
    const saldoContas = new Decimal(
      await this.contaRepository.somarSaldosAtivos(tenantId),
    );

    // Mês corrente (PAGO).
    const receitasMes = lancamentos
      .filter((l) => l.tipo === 'RECEITA' && l.status === 'PAGO' && ehMes(l, prefixMes))
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
    const despesasMes = lancamentos
      .filter((l) => l.tipo === 'DESPESA' && l.status === 'PAGO' && ehMes(l, prefixMes))
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
    const resultadoMes = receitasMes.minus(despesasMes);

    // Mês anterior (PAGO).
    const receitasMesAnterior = lancamentos
      .filter((l) => l.tipo === 'RECEITA' && l.status === 'PAGO' && ehMes(l, prefixPrev))
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
    const despesasMesAnterior = lancamentos
      .filter((l) => l.tipo === 'DESPESA' && l.status === 'PAGO' && ehMes(l, prefixPrev))
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
    const crescimentoReceitas = receitasMesAnterior.gt(0)
      ? Number(
          receitasMes
            .minus(receitasMesAnterior)
            .div(receitasMesAnterior)
            .times(100)
            .toDecimalPlaces(1)
            .toString(),
        )
      : 0;

    // Pendentes.
    const aReceber = lancamentos
      .filter((l) => l.tipo === 'RECEITA' && l.status === 'PENDENTE')
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
    const aPagar = lancamentos
      .filter(
        (l) =>
          l.tipo === 'DESPESA' && (l.status === 'PENDENTE' || l.status === 'ATRASADO'),
      )
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));

    // Atrasados: status ATRASADO ou PENDENTE vencido.
    const atrasados = lancamentos.filter(
      (l) =>
        l.status === 'ATRASADO' ||
        (l.status === 'PENDENTE' &&
          l.dataVencimento.toISOString().slice(0, 10) < hojeStr),
    );
    const contasAtrasadas = atrasados.length;
    const valorAtrasado = atrasados.reduce((s, l) => s.plus(l.valor), new Decimal(0));

    // Projeção (PENDENTE no mês corrente).
    const receitasProjetadas = lancamentos
      .filter(
        (l) => l.tipo === 'RECEITA' && l.status === 'PENDENTE' && ehMes(l, prefixMes),
      )
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
    const despesasProjetadas = lancamentos
      .filter(
        (l) =>
          l.tipo === 'DESPESA' &&
          (l.status === 'PENDENTE' || l.status === 'ATRASADO') &&
          ehMes(l, prefixMes),
      )
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));

    // Ano corrente (PAGO).
    const receitasAno = lancamentos
      .filter((l) => l.tipo === 'RECEITA' && l.status === 'PAGO' && ehAno(l))
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
    const despesasAno = lancamentos
      .filter((l) => l.tipo === 'DESPESA' && l.status === 'PAGO' && ehAno(l))
      .reduce((s, l) => s.plus(l.valor), new Decimal(0));
    const resultadoAno = receitasAno.minus(despesasAno);

    // Top 5 despesas por categoria (PAGO).
    const despPorCat = new Map<string, Decimal>();
    for (const l of lancamentos) {
      if (l.tipo === 'DESPESA' && l.status === 'PAGO') {
        const cat = l.categoria ?? 'Outros';
        despPorCat.set(cat, (despPorCat.get(cat) ?? new Decimal(0)).plus(l.valor));
      }
    }
    const totalDesp = [...despPorCat.values()].reduce(
      (s, v) => s.plus(v),
      new Decimal(0),
    );
    const topDespesas = [...despPorCat.entries()]
      .sort((a, b) => b[1].comparedTo(a[1]))
      .slice(0, 5)
      .map(([categoria, valor]) => ({
        categoria,
        valor: num2(valor),
        percentual: totalDesp.gt(0)
          ? Number(valor.div(totalDesp).times(100).toDecimalPlaces(1).toString())
          : 0,
      }));

    // Receitas por origem (PAGO). Origem derivada: pedidoId → PEDIDO; senão MANUAL.
    const recPorOrigem = new Map<string, Decimal>();
    for (const l of lancamentos) {
      if (l.tipo === 'RECEITA' && l.status === 'PAGO') {
        const origem = l.pedidoId ? 'PEDIDO' : 'MANUAL';
        recPorOrigem.set(origem, (recPorOrigem.get(origem) ?? new Decimal(0)).plus(l.valor));
      }
    }
    const receitasPorOrigem = [...recPorOrigem.entries()]
      .sort((a, b) => b[1].comparedTo(a[1]))
      .map(([origem, valor]) => ({ origem, valor: num2(valor) }));

    return {
      saldoContas: num2(saldoContas),

      receitasMes: num2(receitasMes),
      despesasMes: num2(despesasMes),
      resultadoMes: num2(resultadoMes),

      receitasMesAnterior: num2(receitasMesAnterior),
      despesasMesAnterior: num2(despesasMesAnterior),
      crescimentoReceitas,

      aReceber: num2(aReceber),
      aPagar: num2(aPagar),

      contasAtrasadas,
      valorAtrasado: num2(valorAtrasado),

      receitasProjetadas: num2(receitasProjetadas),
      despesasProjetadas: num2(despesasProjetadas),

      receitasAno: num2(receitasAno),
      despesasAno: num2(despesasAno),
      resultadoAno: num2(resultadoAno),

      topDespesas,
      receitasPorOrigem,
    };
  }
}
