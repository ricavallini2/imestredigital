import { NextRequest, NextResponse } from 'next/server';
import { SALDOS_MOCK, MOVIMENTACOES_MOCK, DEPOSITOS_MOCK, calcularStatus } from '../_mock-data';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { produtoId, depositoId, variacaoId, quantidade, motivo, responsavel = 'Usuário' } = body;
  // quantidade pode ser positivo (sobra) ou negativo (falta)

  if (!produtoId || !depositoId || quantidade === undefined || quantidade === null) {
    return NextResponse.json({ message: 'produtoId, depositoId e quantidade são obrigatórios' }, { status: 400 });
  }

  const saldo = SALDOS_MOCK.find((s) =>
    s.produtoId === produtoId &&
    s.depositoId === depositoId &&
    (!variacaoId || s.variacaoId === variacaoId)
  );
  if (!saldo) return NextResponse.json({ message: 'Saldo não encontrado' }, { status: 404 });
  if (saldo.fisico + quantidade < 0) {
    return NextResponse.json({ message: 'Ajuste resultaria em estoque negativo' }, { status: 422 });
  }

  const deposito = DEPOSITOS_MOCK.find((d) => d.id === depositoId);

  saldo.fisico += quantidade;
  saldo.disponivel = saldo.fisico - saldo.reservado;
  saldo.status = calcularStatus(saldo.fisico, saldo.minimo);

  const mov = {
    id: `mov-${Date.now()}`, tipo: 'AJUSTE' as const,
    produtoId, produto: saldo.produto, sku: saldo.sku,
    variacaoId: saldo.variacaoId, variacao: saldo.variacao,
    quantidade,
    ...(quantidade >= 0
      ? { depositoDestinoId: depositoId, depositoDestino: deposito?.nome }
      : { depositoOrigemId: depositoId, depositoOrigem: deposito?.nome }),
    motivo, responsavel, criadoEm: new Date().toISOString(),
  };
  MOVIMENTACOES_MOCK.unshift(mov);

  return NextResponse.json({ saldo, movimentacao: mov }, { status: 201 });
}
