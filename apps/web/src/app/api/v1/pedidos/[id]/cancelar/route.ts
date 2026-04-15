import { NextRequest, NextResponse } from 'next/server';
import { PEDIDOS_MOCK } from '../../_mock-data';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = PEDIDOS_MOCK.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Pedido não encontrado' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const obs = body.motivo ? `\nCancelamento: ${body.motivo}` : '';

  PEDIDOS_MOCK[idx] = {
    ...PEDIDOS_MOCK[idx],
    status: 'CANCELADO',
    statusPagamento: PEDIDOS_MOCK[idx].statusPagamento === 'PAGO' ? 'ESTORNADO' : 'PENDENTE',
    observacoes: (PEDIDOS_MOCK[idx].observacoes ?? '') + obs,
    atualizadoEm: new Date().toISOString(),
  };
  return NextResponse.json(PEDIDOS_MOCK[idx]);
}
