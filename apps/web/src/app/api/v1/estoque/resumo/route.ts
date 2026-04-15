import { NextResponse } from 'next/server';
import { SALDOS_MOCK } from '../_mock-data';

export async function GET() {
  const totalUnidades = SALDOS_MOCK.reduce((s, e) => s + e.fisico, 0);
  const totalSku = new Set(SALDOS_MOCK.map((e) => e.sku)).size;
  const estoqueBaixo = SALDOS_MOCK.filter((e) => e.status === 'BAIXO' || e.status === 'CRITICO').length;
  const semEstoque = SALDOS_MOCK.filter((e) => e.status === 'SEM_ESTOQUE').length;
  const valorEmEstoque = SALDOS_MOCK.reduce((s, e) => s + e.fisico * e.custo, 0);

  return NextResponse.json({
    totalProdutos: totalSku,
    totalUnidades,
    estoqueBaixo,
    semEstoque,
    valorEmEstoque: parseFloat(valorEmEstoque.toFixed(2)),
    itens: SALDOS_MOCK,
  });
}
