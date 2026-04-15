import { NextRequest, NextResponse } from 'next/server';
import { MARKETPLACES_MOCK } from '../../_mock-data';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const idx = MARKETPLACES_MOCK.findIndex((m) => m.id === id);
  if (idx === -1) {
    return NextResponse.json({ erro: 'Marketplace não encontrado' }, { status: 404 });
  }

  const marketplace = MARKETPLACES_MOCK[idx];

  // Marketplace em ERRO não pode sincronizar
  if (marketplace.status === 'ERRO') {
    return NextResponse.json(
      { erro: 'Marketplace com erro de conexão. Verifique as credenciais.' },
      { status: 422 },
    );
  }

  // Simula novos pedidos recebidos durante a sincronização (1-3)
  const novosPedidos = Math.floor(Math.random() * 3) + 1;

  const atualizado = {
    ...marketplace,
    pedidosHoje: marketplace.pedidosHoje + novosPedidos,
    pedidosMes: marketplace.pedidosMes + novosPedidos,
    ultimaSincronizacao: new Date().toISOString(),
  };

  MARKETPLACES_MOCK[idx] = atualizado;

  return NextResponse.json(atualizado);
}
