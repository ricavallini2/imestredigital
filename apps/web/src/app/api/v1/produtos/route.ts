import { NextRequest, NextResponse } from 'next/server';
import { PRODUTOS_MOCK } from './_mock-data';

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

  return NextResponse.json({
    dados,
    paginacao: { pagina, itensPorPagina: limite, total, totalPaginas: Math.ceil(total / limite) },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
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
  };
  PRODUTOS_MOCK.unshift(novo);
  return NextResponse.json(novo, { status: 201 });
}
