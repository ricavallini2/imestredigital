import { NextRequest, NextResponse } from 'next/server';
import { SALDOS_MOCK, MOVIMENTACOES_MOCK, DEPOSITOS_MOCK, calcularStatus } from '../_mock-data';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { produtoId, depositoId, variacaoId, quantidade, motivo, responsavel = 'Usuário' } = body;

  if (!produtoId || !depositoId || !quantidade || quantidade <= 0) {
    return NextResponse.json({ message: 'produtoId, depositoId e quantidade (> 0) são obrigatórios' }, { status: 400 });
  }

  const saldo = SALDOS_MOCK.find((s) =>
    s.produtoId === produtoId &&
    s.depositoId === depositoId &&
    (!variacaoId || s.variacaoId === variacaoId)
  );
  if (!saldo) return NextResponse.json({ message: 'Saldo não encontrado para esse produto/depósito' }, { status: 404 });
  if (saldo.disponivel < quantidade) {
    return NextResponse.json({ message: `Estoque insuficiente. Disponível: ${saldo.disponivel} unidades` }, { status: 422 });
  }

  const deposito = DEPOSITOS_MOCK.find((d) => d.id === depositoId);

  saldo.fisico -= quantidade;
  saldo.disponivel = saldo.fisico - saldo.reservado;
  saldo.status = calcularStatus(saldo.fisico, saldo.minimo);

  const mov = {
    id: `mov-${Date.now()}`, tipo: 'SAIDA' as const,
    produtoId, produto: saldo.produto, sku: saldo.sku,
    variacaoId: saldo.variacaoId, variacao: saldo.variacao,
    quantidade, depositoOrigemId: depositoId, depositoOrigem: deposito?.nome ?? depositoId,
    motivo, responsavel, criadoEm: new Date().toISOString(),
  };
  MOVIMENTACOES_MOCK.unshift(mov);

  return NextResponse.json({ saldo, movimentacao: mov }, { status: 201 });
}
