import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total: 48,
    ativos: 41,
    inativos: 7,
    novosEsteMes: 6,
    valorTotalCompras: 284750.90,
    ticketMedioCliente: 5932.31,
  });
}
