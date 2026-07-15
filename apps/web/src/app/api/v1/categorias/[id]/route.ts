import { NextRequest, NextResponse } from 'next/server'
import { CATEGORIAS_MOCK, slugUnicoCategoria } from '../_mock-data'

function naoEncontrada(id: string) {
  return NextResponse.json(
    { message: `Categoria com ID ${id} não encontrada`, error: 'Not Found', statusCode: 404 },
    { status: 404 },
  )
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const cat = CATEGORIAS_MOCK.find((c) => c.id === id)
  if (!cat) return naoEncontrada(id)
  return NextResponse.json(cat)
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const idx = CATEGORIAS_MOCK.findIndex((c) => c.id === id)
  if (idx === -1) return naoEncontrada(id)

  const body = await req.json()
  const atual = CATEGORIAS_MOCK[idx]

  if (typeof body.nome === 'string' && body.nome.trim() && body.nome !== atual.nome) {
    atual.nome = body.nome.trim()
    atual.slug = slugUnicoCategoria(atual.nome, id)
  }
  if (typeof body.ativa === 'boolean') atual.ativa = body.ativa
  if (body.categoriaPaiId !== undefined) atual.categoriaPaiId = body.categoriaPaiId ?? null
  atual.atualizadoEm = new Date().toISOString()

  return NextResponse.json(atual)
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const cat = CATEGORIAS_MOCK.find((c) => c.id === id)
  if (!cat) return naoEncontrada(id)

  if (cat._count.produtos > 0) {
    return NextResponse.json(
      {
        message: `Não é possível remover: existem ${cat._count.produtos} produto(s) vinculado(s) a esta categoria`,
        error: 'Conflict',
        statusCode: 409,
      },
      { status: 409 },
    )
  }

  // Soft delete: marca como inativa (espelha o backend).
  cat.ativa = false
  cat.atualizadoEm = new Date().toISOString()
  return new NextResponse(null, { status: 204 })
}
