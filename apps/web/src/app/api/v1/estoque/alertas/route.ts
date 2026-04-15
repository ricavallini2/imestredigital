import { NextResponse } from 'next/server';
import { SALDOS_MOCK } from '../_mock-data';

export async function GET() {
  const alertas = SALDOS_MOCK
    .filter((s) => s.status !== 'NORMAL')
    .map((s) => ({
      produtoId: s.produtoId,
      produto: s.produto,
      sku: s.sku,
      disponivel: s.disponivel,
      minimo: s.minimo,
      deposito: s.deposito,
      status: s.status,
    }))
    .sort((a, b) => {
      const ordem = { SEM_ESTOQUE: 0, CRITICO: 1, BAIXO: 2, NORMAL: 3 };
      return (ordem[a.status as keyof typeof ordem] ?? 3) - (ordem[b.status as keyof typeof ordem] ?? 3);
    });

  return NextResponse.json(alertas);
}
