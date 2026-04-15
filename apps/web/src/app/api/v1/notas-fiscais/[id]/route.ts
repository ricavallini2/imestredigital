import { NextRequest, NextResponse } from 'next/server';
import { findNF, updateNotaFiscal } from '../_mock-data';

// GET /api/v1/notas-fiscais/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nf = findNF(id);
  if (!nf) return NextResponse.json({ erro: 'NF-e não encontrada' }, { status: 404 });
  return NextResponse.json(nf);
}

// PUT /api/v1/notas-fiscais/:id
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nf = findNF(id);
  if (!nf) return NextResponse.json({ erro: 'NF-e não encontrada' }, { status: 404 });
  if (!['RASCUNHO', 'REJEITADA'].includes(nf.status)) {
    return NextResponse.json({ erro: `NF-e com status ${nf.status} não pode ser editada` }, { status: 422 });
  }
  const body    = await req.json();
  const updated = updateNotaFiscal(id, body);
  return NextResponse.json(updated);
}
