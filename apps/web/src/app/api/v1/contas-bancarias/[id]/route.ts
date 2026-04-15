import { NextRequest, NextResponse } from 'next/server';
import { CONTAS_BANCARIAS_MOCK } from '../_mock-data';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const conta = CONTAS_BANCARIAS_MOCK.find((c) => c.id === id);
  if (!conta) {
    return NextResponse.json({ message: 'Conta bancária não encontrada' }, { status: 404 });
  }
  return NextResponse.json(conta);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idx = CONTAS_BANCARIAS_MOCK.findIndex((c) => c.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Conta bancária não encontrada' }, { status: 404 });
  }

  const body = await req.json();

  // Prevent overwriting immutable fields
  const { id: _id, criadoEm: _criadoEm, ...updates } = body;

  CONTAS_BANCARIAS_MOCK[idx] = {
    ...CONTAS_BANCARIAS_MOCK[idx],
    ...updates,
  };

  return NextResponse.json(CONTAS_BANCARIAS_MOCK[idx]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idx = CONTAS_BANCARIAS_MOCK.findIndex((c) => c.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Conta bancária não encontrada' }, { status: 404 });
  }

  // Soft delete — set status to INATIVA
  CONTAS_BANCARIAS_MOCK[idx] = {
    ...CONTAS_BANCARIAS_MOCK[idx],
    status: 'INATIVA',
  };

  return NextResponse.json(CONTAS_BANCARIAS_MOCK[idx]);
}
