import { NextRequest, NextResponse } from 'next/server';
import { PEDIDOS_MOCK, findPedido } from '../../_mock-data';

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = PEDIDOS_MOCK.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Pedido não encontrado' }, { status: 404 });

  const pedido = findPedido(id)!;
  if (pedido.status !== 'PENDENTE') {
    return NextResponse.json({ message: `Pedido não pode ser confirmado no status ${pedido.status}` }, { status: 422 });
  }

  PEDIDOS_MOCK[idx] = { ...PEDIDOS_MOCK[idx], status: 'CONFIRMADO', atualizadoEm: new Date().toISOString() };
  return NextResponse.json(PEDIDOS_MOCK[idx]);
}
