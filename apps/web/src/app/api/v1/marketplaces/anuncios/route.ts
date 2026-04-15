import { NextRequest, NextResponse } from 'next/server';
import { ANUNCIOS_MOCK, AnuncioMock } from '../_mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const canal  = searchParams.get('canal')  ?? '';
  const status = searchParams.get('status') ?? '';
  const busca  = searchParams.get('busca')?.toLowerCase() ?? '';
  const pagina = Math.max(1, Number(searchParams.get('pagina') ?? '1'));
  const limite = Math.min(100, Math.max(1, Number(searchParams.get('limite') ?? '20')));

  let lista: AnuncioMock[] = [...ANUNCIOS_MOCK];

  if (canal)  lista = lista.filter((a) => a.canal === canal);
  if (status) lista = lista.filter((a) => a.status === status);
  if (busca) {
    lista = lista.filter(
      (a) =>
        a.titulo.toLowerCase().includes(busca) ||
        a.sku.toLowerCase().includes(busca) ||
        a.categoria.toLowerCase().includes(busca),
    );
  }

  const total       = lista.length;
  const totalPaginas = Math.ceil(total / limite);
  const offset      = (pagina - 1) * limite;
  const dados       = lista.slice(offset, offset + limite);

  return NextResponse.json({ dados, total, pagina, totalPaginas });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const novo: AnuncioMock = {
    id: `anu-${Date.now()}`,
    produtoId: body.produtoId ?? '',
    canal: body.canal ?? 'MERCADO_LIVRE',
    titulo: body.titulo ?? 'Novo Anúncio',
    sku: body.sku ?? '',
    preco: body.preco ?? 0,
    precoPromocional: body.precoPromocional,
    custoMedio: body.custoMedio ?? 0,
    estoque: body.estoque ?? 0,
    status: 'ATIVO',
    impressoes: 0,
    cliques: 0,
    conversao: 0,
    vendas30d: 0,
    receita30d: 0,
    categoria: body.categoria ?? 'Geral',
    anuncioId: `NOVO-${Date.now()}`,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };

  ANUNCIOS_MOCK.unshift(novo);
  return NextResponse.json(novo, { status: 201 });
}
