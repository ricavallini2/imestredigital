import { NextRequest, NextResponse } from 'next/server';
import { findCliente } from '../../_mock-data';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = findCliente(id);
  if (!c) return NextResponse.json([], { status: 200 });
  return NextResponse.json(c.enderecos);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = findCliente(id);
  const body = await req.json();
  const novo = { id: `e${Date.now()}`, clienteId: id, ...body };
  if (c) c.enderecos.push(novo);
  return NextResponse.json(novo, { status: 201 });
}
