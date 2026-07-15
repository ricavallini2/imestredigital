import { NextRequest, NextResponse } from 'next/server'
import { MARCAS_MOCK, slugUnicoMarca, type MarcaMock } from './_mock-data'

const TENANT = '10000000-0000-0000-0000-000000000001'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const busca = searchParams.get('busca')?.toLowerCase() ?? ''
  const ativaParam = searchParams.get('ativa')
  const pagina = parseInt(searchParams.get('pagina') ?? '1')
  const limite = parseInt(
    searchParams.get('itensPorPagina') ?? searchParams.get('limite') ?? '20',
  )

  let lista = [...MARCAS_MOCK]
  if (busca)
    lista = lista.filter(
      (m) => m.nome.toLowerCase().includes(busca) || m.slug.includes(busca),
    )
  if (ativaParam !== null) lista = lista.filter((m) => m.ativa === (ativaParam === 'true'))

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

  const nova: MarcaMock = {
    id: `mar-${Date.now()}`,
    tenantId: TENANT,
    nome,
    slug: slugUnicoMarca(nome),
    logoUrl: body.logoUrl ?? null,
    ativa: body.ativa ?? true,
    _count: { produtos: 0 },
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  }
  MARCAS_MOCK.unshift(nova)
  return NextResponse.json(nova, { status: 201 })
}
