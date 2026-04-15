import { NextRequest, NextResponse } from 'next/server';
import { findCliente } from '../../../_mock-data';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; enderecoId: string }> }) {
  const { id, enderecoId } = await params;
  const c = findCliente(id);
  if (c) {
    const idx = c.enderecos.findIndex((e) => e.id === enderecoId);
    if (idx !== -1) c.enderecos.splice(idx, 1);
  }
  return NextResponse.json({ id: enderecoId, removido: true });
}
