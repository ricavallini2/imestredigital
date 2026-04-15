import { NextRequest, NextResponse } from 'next/server';
import { findCliente } from '../_mock-data';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cliente = findCliente(id);
  if (!cliente) return NextResponse.json({ message: 'Cliente não encontrado' }, { status: 404 });
  return NextResponse.json(cliente);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const base = findCliente(id) ?? {};
  return NextResponse.json({ ...base, ...body, id });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ id, status: 'INATIVO' });
}
