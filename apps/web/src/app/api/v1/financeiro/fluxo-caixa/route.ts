import { NextRequest, NextResponse } from 'next/server';
import { LANCAMENTOS_MOCK, LancamentoMock } from '../../lancamentos/_mock-data';

// ── Helpers ───────────────────────────────────────────────────────────────────

const MES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/** Returns { receitas, despesas } from lancamentos for a given year/month (PAGO only) */
function totaisMes(
  lancamentos: LancamentoMock[],
  ano: number,
  mes: number,
): { receitas: number; despesas: number } {
  const prefix = `${ano}-${String(mes).padStart(2, '0')}`;
  const receitas = lancamentos
    .filter((l) => l.tipo === 'RECEITA' && l.status === 'PAGO' && l.dataVencimento.startsWith(prefix))
    .reduce((s, l) => s + l.valor, 0);
  const despesas = lancamentos
    .filter((l) => l.tipo === 'DESPESA' && l.status === 'PAGO' && l.dataVencimento.startsWith(prefix))
    .reduce((s, l) => s + l.valor, 0);
  return { receitas, despesas };
}

// Hardcoded values for months without lancamentos (Nov/Dec 2025)
const HARDCODED: Record<string, { receitas: number; despesas: number }> = {
  '2025-11': { receitas: 24800, despesas: 19200 },
  '2025-12': { receitas: 31500, despesas: 22100 },
};

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const meses = Math.max(1, Math.min(24, parseInt(searchParams.get('meses') ?? '6', 10)));

  // Today anchor: 2026-04-04
  const hoje = new Date('2026-04-04T12:00:00.000Z');

  // Build array of last `meses` months, oldest first
  const periodos: Array<{
    periodo: string;
    mes: string;
    receitas: number;
    despesas: number;
    saldo: number;
    saldoAcumulado: number;
  }> = [];

  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(hoje);
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() - i);

    const ano = d.getUTCFullYear();
    const mes = d.getUTCMonth() + 1; // 1-based
    const key = `${ano}-${String(mes).padStart(2, '0')}`;

    let receitas: number;
    let despesas: number;

    if (HARDCODED[key]) {
      ({ receitas, despesas } = HARDCODED[key]);
    } else {
      ({ receitas, despesas } = totaisMes(LANCAMENTOS_MOCK, ano, mes));
    }

    periodos.push({
      periodo: `${key}-01`,
      mes: MES_ABREV[mes - 1],
      receitas: +receitas.toFixed(2),
      despesas: +despesas.toFixed(2),
      saldo: +(receitas - despesas).toFixed(2),
      saldoAcumulado: 0, // filled below
    });
  }

  // Calculate running saldoAcumulado
  let acumulado = 0;
  for (const p of periodos) {
    acumulado += p.saldo;
    p.saldoAcumulado = +acumulado.toFixed(2);
  }

  return NextResponse.json({ dados: periodos, total: periodos.length });
}
