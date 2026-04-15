import { NextRequest, NextResponse } from 'next/server';
import { PEDIDOS_MOCK, findPedido } from '../_mock-data';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pedido = findPedido(id);
  if (!pedido) return NextResponse.json({ message: 'Pedido não encontrado' }, { status: 404 });
  return NextResponse.json(pedido);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = PEDIDOS_MOCK.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Pedido não encontrado' }, { status: 404 });

  const body = await req.json();
  const atualizado = { ...PEDIDOS_MOCK[idx], ...body, id, atualizadoEm: new Date().toISOString() };
  PEDIDOS_MOCK[idx] = atualizado;
  return NextResponse.json(atualizado);
}
