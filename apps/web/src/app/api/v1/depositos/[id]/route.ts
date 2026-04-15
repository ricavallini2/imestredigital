import { NextRequest, NextResponse } from 'next/server';
import { DEPOSITOS_MOCK } from '../../estoque/_mock-data';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = DEPOSITOS_MOCK.findIndex((d) => d.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Depósito não encontrado' }, { status: 404 });

  const body = await req.json();
  DEPOSITOS_MOCK[idx] = { ...DEPOSITOS_MOCK[idx], ...body, id };
  return NextResponse.json(DEPOSITOS_MOCK[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = DEPOSITOS_MOCK.findIndex((d) => d.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Depósito não encontrado' }, { status: 404 });

  DEPOSITOS_MOCK.splice(idx, 1);
  return NextResponse.json({ message: 'Depósito removido' });
}
