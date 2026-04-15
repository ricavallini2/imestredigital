import { NextRequest, NextResponse } from 'next/server';
import { findCliente } from '../../_mock-data';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = findCliente(id);
  if (!c) return NextResponse.json({ message: 'Cliente não encontrado' }, { status: 404 });
  return NextResponse.json({ dados: c.interacoes, total: c.interacoes.length });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = findCliente(id);
  const body = await req.json();
  const nova = {
    id: `i${Date.now()}`,
    criadoEm: new Date().toISOString(),
    usuarioNome: 'Admin Teste',
    ...body,
  };
  // Persiste no array in-memory para que o próximo GET retorne atualizado
  if (c) c.interacoes.unshift(nova);
  return NextResponse.json(nova, { status: 201 });
}
