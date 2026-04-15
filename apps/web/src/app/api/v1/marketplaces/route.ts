import { NextRequest, NextResponse } from 'next/server';
import { MARKETPLACES_MOCK, MarketplaceMock } from './_mock-data';

export type { MarketplaceMock } from './_mock-data';
export { MARKETPLACES_MOCK } from './_mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? '';

  let lista: MarketplaceMock[] = [...MARKETPLACES_MOCK];

  if (status) {
    lista = lista.filter((m) => m.status === status);
  }

  return NextResponse.json({ dados: lista, total: lista.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const novo: MarketplaceMock = {
    id: `mkp-${Date.now()}`,
    canal: body.canal ?? 'MERCADO_LIVRE',
    nome: body.nome ?? 'Novo Marketplace',
    status: 'DESCONECTADO',
    taxaPlataforma: body.taxaPlataforma ?? 13,
    sellerId: body.sellerId ?? '',
    pedidosHoje: 0,
    pedidosMes: 0,
    anunciosAtivos: 0,
    anunciosPausados: 0,
    perguntasPendentes: 0,
    receitaMes: 0,
    receitaLiquidaMes: 0,
    ticketMedio: 0,
    avaliacaoVendedor: 0,
    taxaResposta: 0,
    taxaReclamacao: 0,
    ultimaSincronizacao: new Date().toISOString(),
    criadoEm: new Date().toISOString(),
  };

  MARKETPLACES_MOCK.push(novo);
  return NextResponse.json(novo, { status: 201 });
}
