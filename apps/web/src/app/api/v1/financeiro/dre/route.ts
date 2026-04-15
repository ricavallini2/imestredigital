import { NextRequest, NextResponse } from 'next/server';
import { LANCAMENTOS_MOCK, LancamentoMock } from '../../lancamentos/_mock-data';

// ── Helpers ───────────────────────────────────────────────────────────────────

const MES_NOME = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function somaCat(
  list: LancamentoMock[],
  tipo: 'RECEITA' | 'DESPESA',
  categoria: string,
  statuses: string[],
): number {
  return list
    .filter(
      (l) =>
        l.tipo === tipo &&
        statuses.includes(l.status) &&
        l.categoria.toLowerCase() === categoria.toLowerCase(),
    )
    .reduce((s, l) => s + l.valor, 0);
}

function somaExceto(
  list: LancamentoMock[],
  tipo: 'RECEITA' | 'DESPESA',
  excluidas: string[],
  statuses: string[],
): number {
  return list
    .filter(
      (l) =>
        l.tipo === tipo &&
        statuses.includes(l.status) &&
        !excluidas.map((c) => c.toLowerCase()).includes(l.categoria.toLowerCase()),
    )
    .reduce((s, l) => s + l.valor, 0);
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mes = Math.max(1, Math.min(12, parseInt(searchParams.get('mes') ?? '4', 10)));
  const ano = parseInt(searchParams.get('ano') ?? '2026', 10);

  const prefix     = `${ano}-${String(mes).padStart(2, '0')}`;
  const prevMes    = mes === 1 ? 12 : mes - 1;
  const prevAno    = mes === 1 ? ano - 1 : ano;
  const prevPrefix = `${prevAno}-${String(prevMes).padStart(2, '0')}`;

  // Filter lancamentos for the requested period (PAGO)
  const periodoLan = LANCAMENTOS_MOCK.filter(
    (l) => l.status === 'PAGO' && l.dataVencimento.startsWith(prefix),
  );
  const prevLan = LANCAMENTOS_MOCK.filter(
    (l) => l.status === 'PAGO' && l.dataVencimento.startsWith(prevPrefix),
  );

  const PAGO = ['PAGO'];

  // ── RECEITAS ──────────────────────────────────────────────────────────────
  const vendas       = somaCat(periodoLan, 'RECEITA', 'Vendas', PAGO);
  const marketplaces = somaCat(periodoLan, 'RECEITA', 'Marketplaces', PAGO);
  const servicos     = somaCat(periodoLan, 'RECEITA', 'Serviços', PAGO);
  const financeiro   = somaCat(periodoLan, 'RECEITA', 'Financeiro', PAGO);
  const outrasRec    = somaExceto(periodoLan, 'RECEITA', ['Vendas', 'Marketplaces', 'Serviços', 'Financeiro'], PAGO);
  const receitaBruta = vendas + marketplaces + servicos + financeiro + outrasRec;

  // ── DEDUÇÕES ──────────────────────────────────────────────────────────────
  const impostosSobreVenda = +((vendas + marketplaces) * 0.08).toFixed(2);
  const devolucoes         = 0;
  const totalDeducoes      = impostosSobreVenda + devolucoes;

  const receitaLiquida = receitaBruta - totalDeducoes;

  // ── CMV (42% of vendas+marketplaces) ─────────────────────────────────────
  const cmv        = +((vendas + marketplaces) * 0.42).toFixed(2);
  const lucroBruto = receitaLiquida - cmv;
  const margemBruta = receitaLiquida > 0 ? +(lucroBruto / receitaLiquida * 100).toFixed(1) : 0;

  // ── DESPESAS OPERACIONAIS ─────────────────────────────────────────────────
  const pessoal    = somaCat(periodoLan, 'DESPESA', 'Pessoal', PAGO);
  const ocupacao   = somaCat(periodoLan, 'DESPESA', 'Ocupação', PAGO);
  const marketing  = somaCat(periodoLan, 'DESPESA', 'Marketing', PAGO);
  const operacional = somaCat(periodoLan, 'DESPESA', 'Operacional', PAGO);
  const impostos   = somaCat(periodoLan, 'DESPESA', 'Impostos', PAGO);
  const compras    = somaCat(periodoLan, 'DESPESA', 'Compras', PAGO);
  const outrasDes  = somaExceto(periodoLan, 'DESPESA', ['Pessoal', 'Ocupação', 'Marketing', 'Operacional', 'Impostos', 'Compras'], PAGO);
  const totalDespOp = pessoal + ocupacao + marketing + operacional + impostos + compras + outrasDes;

  // ── EBITDA ────────────────────────────────────────────────────────────────
  const ebitda      = lucroBruto - totalDespOp;
  const margemEbitda = receitaLiquida > 0 ? +(ebitda / receitaLiquida * 100).toFixed(1) : 0;

  // ── RESULTADO FINANCEIRO ──────────────────────────────────────────────────
  const recFinanceiro  = financeiro; // rendimentos já capturados
  const despFinanceiro = 0;          // juros/taxas — não modelados no mock
  const liquidoFin     = recFinanceiro - despFinanceiro;

  // ── RESULTADO ANTES IR ────────────────────────────────────────────────────
  const resultadoAntesIR = ebitda + liquidoFin;
  const ir               = resultadoAntesIR > 0 ? +(resultadoAntesIR * 0.15).toFixed(2) : 0;
  const resultadoLiquido = resultadoAntesIR - ir;
  const margemLiquida    = receitaBruta > 0 ? +(resultadoLiquido / receitaBruta * 100).toFixed(1) : 0;

  // ── COMPARAÇÃO COM MÊS ANTERIOR ───────────────────────────────────────────
  const prevReceitaBruta = prevLan
    .filter((l) => l.tipo === 'RECEITA')
    .reduce((s, l) => s + l.valor, 0);
  const prevDespesas     = prevLan
    .filter((l) => l.tipo === 'DESPESA')
    .reduce((s, l) => s + l.valor, 0);
  const prevLiquido      = prevReceitaBruta - prevDespesas;
  const prevMargem       = prevReceitaBruta > 0 ? +(prevLiquido / prevReceitaBruta * 100).toFixed(1) : 0;

  return NextResponse.json({
    periodo: `${MES_NOME[mes - 1]} ${ano}`,
    mes,
    ano,

    receitaBruta: +receitaBruta.toFixed(2),

    receitas: {
      vendas:       +vendas.toFixed(2),
      marketplaces: +marketplaces.toFixed(2),
      servicos:     +servicos.toFixed(2),
      financeiro:   +financeiro.toFixed(2),
      outras:       +outrasRec.toFixed(2),
      total:        +receitaBruta.toFixed(2),
    },

    deducoes: {
      impostosSobreVenda,
      devolucoes,
      total: +totalDeducoes.toFixed(2),
    },

    receitaLiquida: +receitaLiquida.toFixed(2),

    cmv:         +cmv.toFixed(2),
    lucroBruto:  +lucroBruto.toFixed(2),
    margemBruta,

    despesasOperacionais: {
      pessoal:    +pessoal.toFixed(2),
      ocupacao:   +ocupacao.toFixed(2),
      marketing:  +marketing.toFixed(2),
      operacional: +operacional.toFixed(2),
      impostos:   +impostos.toFixed(2),
      compras:    +compras.toFixed(2),
      outras:     +outrasDes.toFixed(2),
      total:      +totalDespOp.toFixed(2),
    },

    ebitda:      +ebitda.toFixed(2),
    margemEbitda,

    resultadoFinanceiro: {
      receitas:  +recFinanceiro.toFixed(2),
      despesas:  +despFinanceiro.toFixed(2),
      liquido:   +liquidoFin.toFixed(2),
    },

    resultadoAntesIR: +resultadoAntesIR.toFixed(2),
    ir,
    resultadoLiquido: +resultadoLiquido.toFixed(2),
    margemLiquida,

    comparacao: {
      receitaBruta:     +prevReceitaBruta.toFixed(2),
      resultadoLiquido: +prevLiquido.toFixed(2),
      margemLiquida:    prevMargem,
    },
  });
}
