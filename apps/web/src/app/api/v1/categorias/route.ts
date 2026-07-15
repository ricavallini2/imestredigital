import { NextRequest, NextResponse } from 'next/server'
import { CATEGORIAS_MOCK, slugUnicoCategoria, type CategoriaMock } from './_mock-data'

const TENANT = '10000000-0000-0000-0000-000000000001'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const busca = searchParams.get('busca')?.toLowerCase() ?? ''
  const ativaParam = searchParams.get('ativa')
  const apenasRaiz = searchParams.get('apenasRaiz') === 'true'
  const categoriaPaiId = searchParams.get('categoriaPaiId') ?? ''
  const pagina = parseInt(searchParams.get('pagina') ?? '1')
  const limite = parseInt(
    searchParams.get('itensPorPagina') ?? searchParams.get('limite') ?? '20',
  )

  let lista = [...CATEGORIAS_MOCK]
  if (busca)
    lista = lista.filter(
      (c) => c.nome.toLowerCase().includes(busca) || c.slug.includes(busca),
    )
  if (ativaParam !== null) lista = lista.filter((c) => c.ativa === (ativaParam === 'true'))
  if (categoriaPaiId) lista = lista.filter((c) => c.categoriaPaiId === categoriaPaiId)
  else if (apenasRaiz) lista = lista.filter((c) => c.categoriaPaiId === null)

  const total = lista.length
  const inicio = (pagina - 1) * limite
  const dados = lista.slice(inicio, inicio + limite)

  // Envelope paginado canônico (Fase 0): { dados, total, pagina, limite, totalPaginas }
  return NextResponse.json({
    dados,
    total,
    pagina,
    limite,
    totalPaginas: Math.ceil(total / limite),
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const nome: string = (body.nome ?? '').trim()
  if (!nome) {
    return NextResponse.json(
      { message: 'O nome é obrigatório', error: 'Bad Request', statusCode: 400 },
      { status: 400 },
    )
  }

  const nova: CategoriaMock = {
    id: `cat-${Date.now()}`,
    tenantId: TENANT,
    nome,
    slug: slugUnicoCategoria(nome),
    nivel: 0,
    ativa: body.ativa ?? true,
    categoriaPaiId: body.categoriaPaiId ?? null,
    _count: { produtos: 0, subcategorias: 0 },
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  }
  CATEGORIAS_MOCK.unshift(nova)
  return NextResponse.json(nova, { status: 201 })
}
