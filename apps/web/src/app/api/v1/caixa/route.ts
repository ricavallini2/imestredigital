import { NextRequest, NextResponse } from 'next/server';
import { SESSOES_MOCK, MOVS_MOCK, nextNumeroCaixa, getSessaoAtual, calcularTotais, refreshTotais } from './_mock-data';

export async function GET() {
  // Recalcula totais de todas as sessões
  SESSOES_MOCK.forEach(refreshTotais);
  const ordenadas = [...SESSOES_MOCK].sort((a, b) => b.aberturaEm.localeCompare(a.aberturaEm));
  return NextResponse.json({ sessoes: ordenadas, total: ordenadas.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Só pode abrir se não houver caixa aberto
  const aberto = getSessaoAtual();
  if (aberto) {
    return NextResponse.json({ message: 'Já existe um caixa aberto. Feche-o antes de abrir novo.' }, { status: 409 });
  }

  const numero = nextNumeroCaixa();
  const id = `caixa-${Date.now()}`;
  const agora = new Date().toISOString();

  const novaSessao = {
    id, numero, status: 'ABERTO' as const,
    caixa: body.caixa ?? 'Caixa 01',
    operador: body.operador ?? 'Operador',
    aberturaEm: agora,
    valorAbertura: Number(body.valorAbertura) || 0,
    observacoesAbertura: body.observacoes ?? undefined,
    totalEntradas: 0, totalSaidas: 0, saldoEsperado: Number(body.valorAbertura) || 0, qtdMovimentacoes: 0,
  };

  SESSOES_MOCK.unshift(novaSessao);
  return NextResponse.json(novaSessao, { status: 201 });
}
