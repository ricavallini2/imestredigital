import { NextRequest, NextResponse } from 'next/server';
import { SALDOS_MOCK, MOVIMENTACOES_MOCK, DEPOSITOS_MOCK, calcularStatus } from '../_mock-data';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { produtoId, depositoId, variacaoId, quantidade, motivo, responsavel = 'Usuário' } = body;

  if (!produtoId || !depositoId || !quantidade || quantidade <= 0) {
    return NextResponse.json({ message: 'produtoId, depositoId e quantidade (> 0) são obrigatórios' }, { status: 400 });
  }

  const deposito = DEPOSITOS_MOCK.find((d) => d.id === depositoId);
  let saldo = SALDOS_MOCK.find((s) =>
    s.produtoId === produtoId &&
    s.depositoId === depositoId &&
    (!variacaoId || s.variacaoId === variacaoId)
  );

  if (!saldo) {
    // Busca saldo base para copiar metadados (com mesma variação se fornecida)
    const base = SALDOS_MOCK.find((s) =>
      s.produtoId === produtoId &&
      (!variacaoId || s.variacaoId === variacaoId)
    );
    if (!base) return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
    saldo = {
      id: `s${Date.now()}`, produtoId, produto: base.produto, sku: base.sku,
      variacaoId: base.variacaoId, variacao: base.variacao,
      depositoId, deposito: deposito?.nome ?? depositoId,
      fisico: 0, reservado: 0, disponivel: 0, minimo: base.minimo, maximo: base.maximo,
      custo: base.custo, preco: base.preco, giro30d: 0, status: 'SEM_ESTOQUE',
    };
    SALDOS_MOCK.push(saldo);
  }

  saldo.fisico += quantidade;
  saldo.disponivel = saldo.fisico - saldo.reservado;
  saldo.status = calcularStatus(saldo.fisico, saldo.minimo);

  const mov = {
    id: `mov-${Date.now()}`, tipo: 'ENTRADA' as const,
    produtoId, produto: saldo.produto, sku: saldo.sku,
    variacaoId: saldo.variacaoId, variacao: saldo.variacao,
    quantidade, depositoDestinoId: depositoId, depositoDestino: deposito?.nome ?? depositoId,
    motivo, responsavel, criadoEm: new Date().toISOString(),
  };
  MOVIMENTACOES_MOCK.unshift(mov);

  return NextResponse.json({ saldo, movimentacao: mov }, { status: 201 });
}
