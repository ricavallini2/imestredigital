import { NextRequest, NextResponse } from 'next/server';
import { PEDIDOS_MOCK } from '../../_mock-data';
import type { StatusPedido } from '../../_mock-data';

const TRANSICOES: Record<string, StatusPedido[]> = {
  PENDENTE:   ['CONFIRMADO', 'CANCELADO'],
  CONFIRMADO: ['SEPARANDO', 'CANCELADO'],
  SEPARANDO:  ['SEPARADO',  'CANCELADO'],
  SEPARADO:   ['FATURADO',  'CANCELADO'],
  FATURADO:   ['ENVIADO',   'CANCELADO'],
  ENVIADO:    ['ENTREGUE'],
  ENTREGUE:   ['DEVOLVIDO'],
  CANCELADO:  [],
  DEVOLVIDO:  [],
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = PEDIDOS_MOCK.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Pedido não encontrado' }, { status: 404 });

  const body = await req.json();
  const novoStatus: StatusPedido = body.status;
  const atual = PEDIDOS_MOCK[idx].status;
  const permitidos = TRANSICOES[atual] ?? [];

  if (!permitidos.includes(novoStatus)) {
    return NextResponse.json({ message: `Transição inválida: ${atual} → ${novoStatus}` }, { status: 422 });
  }

  const patch: Partial<typeof PEDIDOS_MOCK[0]> = { status: novoStatus, atualizadoEm: new Date().toISOString() };
  if (body.rastreio)       patch.rastreio       = body.rastreio;
  if (body.transportadora) patch.transportadora = body.transportadora;

  PEDIDOS_MOCK[idx] = { ...PEDIDOS_MOCK[idx], ...patch };
  return NextResponse.json(PEDIDOS_MOCK[idx]);
}
