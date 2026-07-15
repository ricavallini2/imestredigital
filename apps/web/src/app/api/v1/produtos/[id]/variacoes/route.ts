import { NextRequest, NextResponse } from 'next/server'
import { findProduto } from '../../_mock-data'
import { getVariacoes } from './_mock-data'

/** GET /api/v1/produtos/:id/variacoes — lista as variações persistidas do produto. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const produto = findProduto(id)
  if (!produto) return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 })
  return NextResponse.json({ dados: getVariacoes(id) })
}
