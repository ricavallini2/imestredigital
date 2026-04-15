import { NextRequest, NextResponse } from 'next/server';
export { ContaBancariaMock, CONTAS_BANCARIAS_MOCK } from './_mock-data';
import { ContaBancariaMock, CONTAS_BANCARIAS_MOCK } from './_mock-data';

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? '';

  let lista = [...CONTAS_BANCARIAS_MOCK];

  if (status) {
    lista = lista.filter((c) => c.status === status);
  }

  const saldoTotal = lista
    .filter((c) => c.status === 'ATIVA')
    .reduce((s, c) => s + c.saldoAtual, 0);

  return NextResponse.json({ dados: lista, total: lista.length, saldoTotal: +saldoTotal.toFixed(2) });
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.nome || !body.tipo) {
    return NextResponse.json({ message: 'Campos obrigatórios: nome, tipo' }, { status: 400 });
  }

  const seq = globalThis.__contasBancariasSeq!;
  globalThis.__contasBancariasSeq = seq + 1;

  const agora = new Date().toISOString();
  const nova: ContaBancariaMock = {
    id: `cb-${String(seq).padStart(3, '0')}`,
    nome: body.nome,
    tipo: body.tipo,
    banco: body.banco,
    agencia: body.agencia,
    numeroConta: body.numeroConta,
    saldoInicial: Number(body.saldoInicial ?? 0),
    saldoAtual: Number(body.saldoAtual ?? body.saldoInicial ?? 0),
    status: body.status ?? 'ATIVA',
    cor: body.cor ?? 'gray',
    criadoEm: agora,
  };

  CONTAS_BANCARIAS_MOCK.push(nova);
  return NextResponse.json(nova, { status: 201 });
}
