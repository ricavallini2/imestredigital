import { NextRequest, NextResponse } from 'next/server'
import {
  getGrades,
  novaGradeId,
  normalizarTamanhos,
  agora,
  TENANT_ID,
  type GradeMock,
} from './_mock-data'

/** GET /api/v1/grades — lista paginada (envelope canônico). */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const busca = searchParams.get('busca')?.toLowerCase() ?? ''
  const ativaParam = searchParams.get('ativa')
  const pagina = Number(searchParams.get('pagina') ?? '1')
  const limite = Number(searchParams.get('itensPorPagina') ?? searchParams.get('limite') ?? '20')

  let grades = getGrades()

  if (busca) {
    grades = grades.filter(
      (g) =>
        g.nome.toLowerCase().includes(busca) ||
        g.tamanhos.some((t) => t.valor.toLowerCase().includes(busca)),
    )
  }
  if (ativaParam === 'true') grades = grades.filter((g) => g.ativa)
  if (ativaParam === 'false') grades = grades.filter((g) => !g.ativa)

  const total = grades.length
  const inicio = (pagina - 1) * limite
  const dados = grades.slice(inicio, inicio + limite)

  return NextResponse.json({
    dados,
    total,
    pagina,
    limite,
    totalPaginas: limite > 0 ? Math.ceil(total / limite) : 1,
  })
}

/** POST /api/v1/grades — cria uma grade. */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const nome = String(body.nome ?? '').trim()
  if (!nome) {
    return NextResponse.json({ message: 'O nome é obrigatório' }, { status: 400 })
  }

  const store = getGrades()
  if (store.some((g) => g.nome.toLowerCase() === nome.toLowerCase())) {
    return NextResponse.json(
      { message: 'Já existe uma grade com este nome' },
      { status: 409 },
    )
  }

  const nova: GradeMock = {
    id: novaGradeId(),
    tenantId: TENANT_ID,
    nome,
    descricao: body.descricao ? String(body.descricao).trim() : undefined,
    ativa: body.ativa !== false,
    tamanhos: normalizarTamanhos(body.tamanhos),
    criadoEm: agora(),
    atualizadoEm: agora(),
  }
  store.push(nova)
  return NextResponse.json(nova, { status: 201 })
}
