import { NextRequest, NextResponse } from 'next/server';
import { PRODUTOS_MOCK } from './_mock-data';
import { CATEGORIAS_MOCK } from '../categorias/_mock-data';
import { MARCAS_MOCK } from '../marcas/_mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const busca = searchParams.get('busca')?.toLowerCase() ?? '';
  const status = searchParams.get('status') ?? '';
  const categoriaId = searchParams.get('categoriaId') ?? '';
  const pagina = parseInt(searchParams.get('pagina') ?? '1');
  const limite = parseInt(searchParams.get('itensPorPagina') ?? searchParams.get('limite') ?? '20');

  let lista = [...PRODUTOS_MOCK];
  if (busca) lista = lista.filter(p => p.nome.toLowerCase().includes(busca) || p.sku.toLowerCase().includes(busca));
  if (status) lista = lista.filter(p => p.status.toLowerCase() === status.toLowerCase());
  if (categoriaId) lista = lista.filter(p => p.categoriaId === categoriaId);

  const total = lista.length;
  const inicio = (pagina - 1) * limite;
  const dados = lista.slice(inicio, inicio + limite);

  // Envelope paginado canônico (Fase 0): { dados, total, pagina, limite, totalPaginas }
  return NextResponse.json({
    dados,
    total,
    pagina,
    limite,
    totalPaginas: Math.ceil(total / limite),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Resolve os nomes de exibição a partir dos IDs reais (o form envia apenas
  // categoriaId/marcaId, como o backend catalog-service exige). Mantém `categoria`
  // e `marca` como texto no mock para que a listagem renderize sem consultas extras.
  const categoriaNome = body.categoriaId
    ? CATEGORIAS_MOCK.find((c) => c.id === body.categoriaId)?.nome ?? body.categoria
    : body.categoria;
  const marcaNome = body.marcaId
    ? MARCAS_MOCK.find((m) => m.id === body.marcaId)?.nome ?? body.marca
    : body.marca;

  const novo = {
    id: `p${Date.now()}-0000-0000-0000-000000000001`,
    tenantId: '10000000-0000-0000-0000-000000000001',
    status: 'RASCUNHO' as const,
    margemLucro: body.precoCusto > 0 ? parseFloat(((body.preco - body.precoCusto) / body.precoCusto * 100).toFixed(1)) : 0,
    estoque: 0, estoqueMinimo: 5,
    imagens: [], variacoes: [], tags: body.tags ?? [],
    vendasUltimos30Dias: 0, vendasTotal: 0, receitaTotal: 0,
    criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString(),
    ...body,
    categoria: categoriaNome,
    marca: marcaNome,
  };
  PRODUTOS_MOCK.unshift(novo);
  return NextResponse.json(novo, { status: 201 });
}
