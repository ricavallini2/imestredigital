import { NextRequest, NextResponse } from 'next/server';
import { findCliente } from '../../../_mock-data';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; contatoId: string }> }) {
  const { id, contatoId } = await params;
  const c = findCliente(id);
  if (c) {
    const idx = c.contatos.findIndex((ct) => ct.id === contatoId);
    if (idx !== -1) c.contatos.splice(idx, 1);
  }
  return NextResponse.json({ id: contatoId, removido: true });
}
