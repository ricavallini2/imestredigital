import { NextRequest, NextResponse } from 'next/server';
import { TITULOS_COBRANCA_MOCK, ACORDOS_MOCK, nextIdAcordo, getConfiguracao, AcordoMock, ParcelaMock } from '../../_mock-data';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const titulo = TITULOS_COBRANCA_MOCK.find(t => t.id === id);
  if (!titulo) return NextResponse.json({ message: 'Título não encontrado' }, { status: 404 });

  const config = getConfiguracao();
  const body   = await req.json();
  const desconto      = Math.min(body.descontoAplicado ?? 0, config.descontoMaximo);
  const numParcelas   = Math.min(body.numeroParcelas ?? 1, config.parcelasMaximas);
  const valorFinal    = titulo.valor * (1 - desconto / 100);
  const valorParcela  = valorFinal / numParcelas;
  const primeiroVenc  = body.primeiroVencimento ?? new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10);

  const parcelas: ParcelaMock[] = Array.from({ length: numParcelas }, (_, i) => {
    const d = new Date(primeiroVenc);
    d.setMonth(d.getMonth() + i);
    return {
      numero: i + 1,
      valor: parseFloat(valorParcela.toFixed(2)),
      vencimento: d.toISOString().slice(0, 10),
      pago: false,
      pagoEm: null,
    };
  });

  const acordo: AcordoMock = {
    id: nextIdAcordo(),
    tituloId: id,
    clienteId: titulo.clienteId,
    clienteNome: titulo.clienteNome,
    valorOriginal: titulo.valor,
    descontoAplicado: desconto,
    valorFinal: parseFloat(valorFinal.toFixed(2)),
    numeroParcelas: numParcelas,
    parcelas,
    status: 'ATIVO',
    criadoEm: new Date().toISOString(),
    observacao: body.observacao ?? null,
  };
  ACORDOS_MOCK.push(acordo);
  titulo.status = 'ACORDO';

  return NextResponse.json(acordo, { status: 201 });
}
