import { NextRequest, NextResponse } from 'next/server';
import { LANCAMENTOS_MOCK } from '../_mock-data';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const lancamento = LANCAMENTOS_MOCK.find((l) => l.id === id);
  if (!lancamento) {
    return NextResponse.json({ message: 'Lançamento não encontrado' }, { status: 404 });
  }
  return NextResponse.json(lancamento);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idx = LANCAMENTOS_MOCK.findIndex((l) => l.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Lançamento não encontrado' }, { status: 404 });
  }

  const body = await req.json();
  const agora = new Date().toISOString();

  // Preserve immutable fields
  const atual = LANCAMENTOS_MOCK[idx];
  LANCAMENTOS_MOCK[idx] = {
    ...atual,
    ...body,
    id: atual.id,
    criadoEm: atual.criadoEm,
    atualizadoEm: agora,
  };

  return NextResponse.json(LANCAMENTOS_MOCK[idx]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idx = LANCAMENTOS_MOCK.findIndex((l) => l.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Lançamento não encontrado' }, { status: 404 });
  }

  LANCAMENTOS_MOCK[idx] = {
    ...LANCAMENTOS_MOCK[idx],
    status: 'CANCELADO',
    atualizadoEm: new Date().toISOString(),
  };

  return NextResponse.json(LANCAMENTOS_MOCK[idx]);
}
