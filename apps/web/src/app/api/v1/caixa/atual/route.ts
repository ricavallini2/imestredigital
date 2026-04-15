import { NextResponse } from 'next/server';
import { getSessaoAtual, refreshTotais, MOVS_MOCK } from '../_mock-data';

export async function GET() {
  const sessao = getSessaoAtual();
  if (!sessao) return NextResponse.json({ aberto: false, sessao: null });

  refreshTotais(sessao);

  const movs = MOVS_MOCK
    .filter((m) => m.sessaoId === sessao.id)
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

  return NextResponse.json({ aberto: true, sessao, movimentacoes: movs });
}
