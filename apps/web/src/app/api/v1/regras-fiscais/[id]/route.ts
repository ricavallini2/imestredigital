import { NextRequest, NextResponse } from 'next/server';
import { getRegras, updateRegra } from '../../notas-fiscais/_mock-data';

// GET /api/v1/regras-fiscais/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const regra = getRegras().find(r => r.id === id);
  if (!regra) return NextResponse.json({ erro: 'Regra não encontrada' }, { status: 404 });
  return NextResponse.json(regra);
}

// PUT /api/v1/regras-fiscais/:id
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params;
  const body    = await req.json();
  const updated = updateRegra(id, body);
  if (!updated) return NextResponse.json({ erro: 'Regra não encontrada' }, { status: 404 });
  return NextResponse.json(updated);
}
