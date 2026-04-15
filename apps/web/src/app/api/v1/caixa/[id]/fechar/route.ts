import { NextRequest, NextResponse } from 'next/server';
import { SESSOES_MOCK, refreshTotais } from '../../_mock-data';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = SESSOES_MOCK.findIndex((s) => s.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Sessão não encontrada' }, { status: 404 });

  const sessao = SESSOES_MOCK[idx];
  if (sessao.status === 'FECHADO') {
    return NextResponse.json({ message: 'Caixa já está fechado' }, { status: 422 });
  }

  refreshTotais(sessao);

  const body = await req.json();
  const valorContado   = Number(body.valorContado) || 0;
  const valorEsperado  = sessao.saldoEsperado;
  const diferenca      = valorContado - valorEsperado;

  SESSOES_MOCK[idx] = {
    ...sessao,
    status: 'FECHADO',
    fechamentoEm: new Date().toISOString(),
    valorContado,
    valorEsperado,
    diferenca,
    observacoesFechamento: body.observacoes ?? undefined,
  };

  refreshTotais(SESSOES_MOCK[idx]);
  return NextResponse.json(SESSOES_MOCK[idx]);
}
