import { NextRequest, NextResponse } from 'next/server'
import { MARCAS_MOCK, slugUnicoMarca } from '../_mock-data'

function naoEncontrada(id: string) {
  return NextResponse.json(
    { message: `Marca com ID ${id} não encontrada`, error: 'Not Found', statusCode: 404 },
    { status: 404 },
  )
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const marca = MARCAS_MOCK.find((m) => m.id === id)
  if (!marca) return naoEncontrada(id)
  return NextResponse.json(marca)
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const idx = MARCAS_MOCK.findIndex((m) => m.id === id)
  if (idx === -1) return naoEncontrada(id)

  const body = await req.json()
  const atual = MARCAS_MOCK[idx]

  if (typeof body.nome === 'string' && body.nome.trim() && body.nome !== atual.nome) {
    atual.nome = body.nome.trim()
    atual.slug = slugUnicoMarca(atual.nome, id)
  }
  if (typeof body.ativa === 'boolean') atual.ativa = body.ativa
  if (body.logoUrl !== undefined) atual.logoUrl = body.logoUrl ?? null
  atual.atualizadoEm = new Date().toISOString()

  return NextResponse.json(atual)
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const marca = MARCAS_MOCK.find((m) => m.id === id)
  if (!marca) return naoEncontrada(id)

  if (marca._count.produtos > 0) {
    return NextResponse.json(
      {
        message: `Não é possível remover: existem ${marca._count.produtos} produto(s) vinculado(s) a esta marca`,
        error: 'Conflict',
        statusCode: 409,
      },
      { status: 409 },
    )
  }

  // Soft delete: marca como inativa (espelha o backend).
  marca.ativa = false
  marca.atualizadoEm = new Date().toISOString()
  return new NextResponse(null, { status: 204 })
}
