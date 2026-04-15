import { NextRequest, NextResponse } from 'next/server';
import { ACORDOS_MOCK, TITULOS_COBRANCA_MOCK } from '../../../_mock-data';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const acordo = ACORDOS_MOCK.find(a => a.id === id);
  if (!acordo) return NextResponse.json({ message: 'Acordo não encontrado' }, { status: 404 });

  const body = await req.json();
  const parcela = acordo.parcelas.find(p => p.numero === body.numeroParcela);
  if (!parcela) return NextResponse.json({ message: 'Parcela não encontrada' }, { status: 404 });

  parcela.pago = true;
  parcela.pagoEm = new Date().toISOString();

  const todasPagas = acordo.parcelas.every(p => p.pago);
  if (todasPagas) {
    acordo.status = 'CUMPRIDO';
    const titulo = TITULOS_COBRANCA_MOCK.find(t => t.id === acordo.tituloId);
    if (titulo) titulo.status = 'PAGO';
  }

  return NextResponse.json(acordo);
}
