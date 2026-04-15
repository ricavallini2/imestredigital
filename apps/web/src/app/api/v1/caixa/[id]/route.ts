import { NextRequest, NextResponse } from 'next/server';
import { SESSOES_MOCK, MOVS_MOCK, refreshTotais } from '../_mock-data';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessao = SESSOES_MOCK.find((s) => s.id === id);
  if (!sessao) return NextResponse.json({ message: 'Sessão não encontrada' }, { status: 404 });

  refreshTotais(sessao);

  const movs = MOVS_MOCK
    .filter((m) => m.sessaoId === id)
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

  return NextResponse.json({ sessao, movimentacoes: movs });
}
