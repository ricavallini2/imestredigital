import { NextResponse } from 'next/server';
import { LANCAMENTOS_MOCK, LancamentoMock } from '../../lancamentos/_mock-data';

// Ensure mocks are initialized via _mock-data (never import route files!)
import '../../compras/_mock-data';
import '../../contas-bancarias/_mock-data';

// ── Constants (dinâmicos) ─────────────────────────────────────────────────────

const _now         = new Date();
const TODAY        = _now.toISOString().slice(0, 10);
const CURRENT_YEAR = _now.getFullYear();
const CURRENT_MES  = _now.getMonth() + 1;
const PREV_MES     = CURRENT_MES === 1 ? 12 : CURRENT_MES - 1;
const PREV_ANO     = CURRENT_MES === 1 ? CURRENT_YEAR - 1 : CURRENT_YEAR;

// ── Helpers ───────────────────────────────────────────────────────────────────

function isMes(l: LancamentoMock, mes: number, ano: number): boolean {
  return l.dataVencimento.startsWith(`${ano}-${String(mes).padStart(2, '0')}`);
}

function isAno(l: LancamentoMock, ano: number): boolean {
  return l.dataVencimento.startsWith(String(ano));
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET() {
  const lancamentos = LANCAMENTOS_MOCK;

  // ── Saldo em contas bancárias ──────────────────────────────────────────────
  const saldoContas: number = Array.isArray(globalThis.__contasBancariasMock)
    ? globalThis.__contasBancariasMock
        .filter((c: { status: string }) => c.status === 'ATIVA')
        .reduce((s: number, c: { saldoAtual: number }) => s + c.saldoAtual, 0)
    : 80700; // fallback: sum of the 4 initial accounts

  // ── Mês corrente (Abril 2026) — PAGO items ────────────────────────────────
  const receitasMes = lancamentos
    .filter((l) => l.tipo === 'RECEITA' && l.status === 'PAGO' && isMes(l, CURRENT_MES, CURRENT_YEAR))
    .reduce((s, l) => s + l.valor, 0);

  const despesasMes = lancamentos
    .filter((l) => l.tipo === 'DESPESA' && l.status === 'PAGO' && isMes(l, CURRENT_MES, CURRENT_YEAR))
    .reduce((s, l) => s + l.valor, 0);

  const resultadoMes = receitasMes - despesasMes;

  // ── Mês anterior (Março 2026) ─────────────────────────────────────────────
  const receitasMesAnterior = lancamentos
    .filter((l) => l.tipo === 'RECEITA' && l.status === 'PAGO' && isMes(l, PREV_MES, PREV_ANO))
    .reduce((s, l) => s + l.valor, 0);

  const despesasMesAnterior = lancamentos
    .filter((l) => l.tipo === 'DESPESA' && l.status === 'PAGO' && isMes(l, PREV_MES, PREV_ANO))
    .reduce((s, l) => s + l.valor, 0);

  const crescimentoReceitas =
    receitasMesAnterior > 0
      ? +((receitasMes - receitasMesAnterior) / receitasMesAnterior * 100).toFixed(1)
      : 0;

  // ── Pendentes totais ───────────────────────────────────────────────────────
  const aReceber = lancamentos
    .filter((l) => l.tipo === 'RECEITA' && l.status === 'PENDENTE')
    .reduce((s, l) => s + l.valor, 0);

  const aPagar = lancamentos
    .filter((l) => l.tipo === 'DESPESA' && (l.status === 'PENDENTE' || l.status === 'ATRASADO'))
    .reduce((s, l) => s + l.valor, 0);

  // ── Atrasados (ATRASADO status OR PENDENTE with vencimento < today) ────────
  const atrasados = lancamentos.filter(
    (l) =>
      l.status === 'ATRASADO' ||
      (l.status === 'PENDENTE' && l.dataVencimento < TODAY),
  );
  const contasAtrasadas = atrasados.length;
  const valorAtrasado   = atrasados.reduce((s, l) => s + l.valor, 0);

  // ── Projeção (PENDENTE no mês corrente) ───────────────────────────────────
  const receitasProjetadas = lancamentos
    .filter((l) => l.tipo === 'RECEITA' && l.status === 'PENDENTE' && isMes(l, CURRENT_MES, CURRENT_YEAR))
    .reduce((s, l) => s + l.valor, 0);

  const despesasProjetadas = lancamentos
    .filter(
      (l) =>
        l.tipo === 'DESPESA' &&
        (l.status === 'PENDENTE' || l.status === 'ATRASADO') &&
        isMes(l, CURRENT_MES, CURRENT_YEAR),
    )
    .reduce((s, l) => s + l.valor, 0);

  // ── Ano corrente (2026) ────────────────────────────────────────────────────
  const receitasAno = lancamentos
    .filter((l) => l.tipo === 'RECEITA' && l.status === 'PAGO' && isAno(l, CURRENT_YEAR))
    .reduce((s, l) => s + l.valor, 0);

  const despesasAno = lancamentos
    .filter((l) => l.tipo === 'DESPESA' && l.status === 'PAGO' && isAno(l, CURRENT_YEAR))
    .reduce((s, l) => s + l.valor, 0);

  const resultadoAno = receitasAno - despesasAno;

  // ── Top 5 despesas por categoria (PAGO) ───────────────────────────────────
  const despesasPorCat: Record<string, number> = {};
  for (const l of lancamentos) {
    if (l.tipo === 'DESPESA' && l.status === 'PAGO') {
      despesasPorCat[l.categoria] = (despesasPorCat[l.categoria] ?? 0) + l.valor;
    }
  }
  const totalDesp = Object.values(despesasPorCat).reduce((s, v) => s + v, 0);
  const topDespesas = Object.entries(despesasPorCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([categoria, valor]) => ({
      categoria,
      valor: +valor.toFixed(2),
      percentual: totalDesp > 0 ? +((valor / totalDesp) * 100).toFixed(1) : 0,
    }));

  // ── Receitas por origem (PAGO) ────────────────────────────────────────────
  const receitasPorOrigemMap: Record<string, number> = {};
  for (const l of lancamentos) {
    if (l.tipo === 'RECEITA' && l.status === 'PAGO') {
      receitasPorOrigemMap[l.origem] = (receitasPorOrigemMap[l.origem] ?? 0) + l.valor;
    }
  }
  const receitasPorOrigem = Object.entries(receitasPorOrigemMap)
    .sort((a, b) => b[1] - a[1])
    .map(([origem, valor]) => ({ origem, valor: +valor.toFixed(2) }));

  return NextResponse.json({
    saldoContas: +saldoContas.toFixed(2),

    receitasMes:     +receitasMes.toFixed(2),
    despesasMes:     +despesasMes.toFixed(2),
    resultadoMes:    +resultadoMes.toFixed(2),

    receitasMesAnterior:  +receitasMesAnterior.toFixed(2),
    despesasMesAnterior:  +despesasMesAnterior.toFixed(2),
    crescimentoReceitas,

    aReceber:  +aReceber.toFixed(2),
    aPagar:    +aPagar.toFixed(2),

    contasAtrasadas,
    valorAtrasado: +valorAtrasado.toFixed(2),

    receitasProjetadas: +receitasProjetadas.toFixed(2),
    despesasProjetadas: +despesasProjetadas.toFixed(2),

    receitasAno:  +receitasAno.toFixed(2),
    despesasAno:  +despesasAno.toFixed(2),
    resultadoAno: +resultadoAno.toFixed(2),

    topDespesas,
    receitasPorOrigem,
  });
}
