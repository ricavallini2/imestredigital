import { NextRequest, NextResponse } from 'next/server';
import { ACORDOS_MOCK } from '../_mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status    = searchParams.get('status') ?? '';
  const clienteId = searchParams.get('clienteId') ?? '';

  let lista = [...ACORDOS_MOCK];
  if (status)    lista = lista.filter(a => a.status === status);
  if (clienteId) lista = lista.filter(a => a.clienteId === clienteId);
  lista.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());

  return NextResponse.json({ dados: lista, total: lista.length });
}
