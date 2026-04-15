import { NextRequest, NextResponse } from 'next/server';
import { findCliente } from '../../_mock-data';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = findCliente(id);
  if (!c) return NextResponse.json({ message: 'Cliente não encontrado' }, { status: 404 });

  const ticketMedio = c.quantidadePedidos > 0 ? c.totalCompras / c.quantidadePedidos : 0;
  const diasDesdeUltimaCompra = c.ultimaCompra
    ? Math.floor((Date.now() - new Date(c.ultimaCompra).getTime()) / 86400000)
    : 999;

  return NextResponse.json({
    clienteId: id,
    totalCompras: c.totalCompras,
    totalPedidos: c.quantidadePedidos,
    ticketMedio,
    ultimaCompra: c.ultimaCompra,
    primeiraCompra: c.criadoEm,
    diasDesdeUltimaCompra,
    score: c.score,
    categoriaCliente: c.score >= 80 ? 'OURO' : c.score >= 60 ? 'PRATA' : c.score >= 40 ? 'BRONZE' : 'BASICO',
    produtosMaisComprados: ['Produto A', 'Produto B'],
  });
}
