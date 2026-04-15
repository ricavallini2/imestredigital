import { NextRequest, NextResponse } from 'next/server';
import { MOVIMENTACOES_MOCK } from '../estoque/_mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const busca = searchParams.get('busca')?.toLowerCase() ?? '';
  const tipo = searchParams.get('tipo') ?? '';
  const periodo = searchParams.get('periodo') ?? '';
  const produtoId = searchParams.get('produtoId') ?? '';
  const pagina = parseInt(searchParams.get('pagina') ?? '1');
  const limite = parseInt(searchParams.get('limite') ?? searchParams.get('itensPorPagina') ?? '20');

  let lista = [...MOVIMENTACOES_MOCK];

  if (busca) lista = lista.filter((m) => m.produto.toLowerCase().includes(busca) || m.sku.toLowerCase().includes(busca));
  if (tipo) lista = lista.filter((m) => m.tipo === tipo);
  if (produtoId) lista = lista.filter((m) => m.produtoId === produtoId);
  if (periodo) {
    const dias = parseInt(periodo.replace('d', ''));
    const corte = new Date(Date.now() - dias * 86400000).toISOString();
    lista = lista.filter((m) => m.criadoEm >= corte);
  }

  // Sort mais recente primeiro
  lista.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

  const total = lista.length;
  const inicio = (pagina - 1) * limite;
  const dados = lista.slice(inicio, inicio + limite);

  return NextResponse.json({
    dados,
    paginacao: { pagina, itensPorPagina: limite, total, totalPaginas: Math.ceil(total / limite) },
  });
}
