import { NextRequest, NextResponse } from 'next/server'
import { getGrades, normalizarTamanhos, agora } from '../_mock-data'

/** GET /api/v1/grades/:id */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const grade = getGrades().find((g) => g.id === id)
  if (!grade) return NextResponse.json({ message: 'Grade não encontrada' }, { status: 404 })
  return NextResponse.json(grade)
}

/** PUT /api/v1/grades/:id — atualiza campos e/ou tamanhos. */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const store = getGrades()
  const idx = store.findIndex((g) => g.id === id)
  if (idx === -1) return NextResponse.json({ message: 'Grade não encontrada' }, { status: 404 })

  const body = await req.json()
  const nomeNovo = body.nome != null ? String(body.nome).trim() : store[idx].nome
  if (!nomeNovo) {
    return NextResponse.json({ message: 'O nome é obrigatório' }, { status: 400 })
  }
  // Conflito de nome com outra grade.
  if (store.some((g) => g.id !== id && g.nome.toLowerCase() === nomeNovo.toLowerCase())) {
    return NextResponse.json({ message: 'Já existe uma grade com este nome' }, { status: 409 })
  }

  store[idx] = {
    ...store[idx],
    nome: nomeNovo,
    descricao:
      body.descricao !== undefined
        ? String(body.descricao).trim() || undefined
        : store[idx].descricao,
    ativa: body.ativa !== undefined ? body.ativa !== false : store[idx].ativa,
    tamanhos:
      body.tamanhos !== undefined ? normalizarTamanhos(body.tamanhos) : store[idx].tamanhos,
    atualizadoEm: agora(),
  }
  return NextResponse.json(store[idx])
}

/** DELETE /api/v1/grades/:id — soft delete (ativa=false). */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const store = getGrades()
  const idx = store.findIndex((g) => g.id === id)
  if (idx === -1) return NextResponse.json({ message: 'Grade não encontrada' }, { status: 404 })
  store[idx] = { ...store[idx], ativa: false, atualizadoEm: agora() }
  return NextResponse.json({ id, ativa: false })
}
