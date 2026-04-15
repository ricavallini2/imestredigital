import { NextRequest, NextResponse } from 'next/server';
import { findProduto, analisarProdutoIA } from '../../_mock-data';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const produto = findProduto(id);
  if (!produto) return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
  return NextResponse.json(analisarProdutoIA(produto));
}
