import { NextRequest, NextResponse } from 'next/server';
import { COMPRAS_MOCK } from '../_mock-data';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const compra = COMPRAS_MOCK.find((c) => c.id === params.id);
  if (!compra) {
    return NextResponse.json({ message: 'Pedido de compra não encontrado' }, { status: 404 });
  }
  return NextResponse.json(compra);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const idx = COMPRAS_MOCK.findIndex((c) => c.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Pedido de compra não encontrado' }, { status: 404 });
  }

  const body = await req.json();
  COMPRAS_MOCK[idx] = {
    ...COMPRAS_MOCK[idx],
    ...body,
    atualizadoEm: new Date().toISOString(),
  };

  return NextResponse.json(COMPRAS_MOCK[idx]);
}
