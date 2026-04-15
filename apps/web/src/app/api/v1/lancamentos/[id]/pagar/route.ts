import { NextRequest, NextResponse } from 'next/server';
import { LANCAMENTOS_MOCK } from '../../_mock-data';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idx = LANCAMENTOS_MOCK.findIndex((l) => l.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Lançamento não encontrado' }, { status: 404 });
  }

  const lancamento = LANCAMENTOS_MOCK[idx];

  if (lancamento.status === 'PAGO') {
    return NextResponse.json({ message: 'Lançamento já está PAGO' }, { status: 400 });
  }
  if (lancamento.status === 'CANCELADO') {
    return NextResponse.json({ message: 'Lançamento cancelado não pode ser pago' }, { status: 400 });
  }

  let body: { dataPagamento?: string } = {};
  try {
    body = await req.json();
  } catch {
    // body is optional
  }

  const agora = new Date().toISOString();
  const dataPagamento = body.dataPagamento ?? agora;

  LANCAMENTOS_MOCK[idx] = {
    ...lancamento,
    status: 'PAGO',
    dataPagamento,
    atualizadoEm: agora,
  };

  // ── Sync __contasAPagarMock if this lancamento originated from a compra ──────
  if (lancamento.origemId && Array.isArray(globalThis.__contasAPagarMock)) {
    const contaIdx = globalThis.__contasAPagarMock.findIndex(
      (c) => c.id === lancamento.origemId || c.compraId === lancamento.origemId,
    );
    if (contaIdx !== -1) {
      globalThis.__contasAPagarMock[contaIdx] = {
        ...globalThis.__contasAPagarMock[contaIdx],
        status: 'PAGO',
      };
    }
  }

  return NextResponse.json(LANCAMENTOS_MOCK[idx]);
}
