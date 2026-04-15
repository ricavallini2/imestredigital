import { NextRequest, NextResponse } from 'next/server';
import { findCliente } from '../../_mock-data';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = findCliente(id);
  if (!c) return NextResponse.json([], { status: 200 });
  // Return sorted descending by date
  const sorted = [...c.interacoes].sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  );
  return NextResponse.json(sorted);
}
