import { NextRequest, NextResponse } from 'next/server';
import { findNF, updateNotaFiscal } from '../../_mock-data';

// POST /api/v1/notas-fiscais/:id/cancelar
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nf = findNF(id);
  if (!nf) return NextResponse.json({ erro: 'NF-e não encontrada' }, { status: 404 });
  if (!['EMITIDA', 'VALIDADA'].includes(nf.status)) {
    return NextResponse.json({ erro: `NF-e com status ${nf.status} não pode ser cancelada` }, { status: 422 });
  }

  // Verifica prazo de 24h para emitidas
  if (nf.status === 'EMITIDA' && nf.dataAutorizacao) {
    const horasDecorridas = (Date.now() - new Date(nf.dataAutorizacao).getTime()) / 3600000;
    if (horasDecorridas > 24) {
      return NextResponse.json({ erro: 'Prazo de 24 horas para cancelamento expirado. Emita uma Carta de Correção.' }, { status: 422 });
    }
  }

  const body = await req.json().catch(() => ({}));
  const motivo = body.motivo ?? 'Cancelamento solicitado pelo emissor';
  const protocoloCancelamento = `1352600${Date.now().toString().slice(-8)}`;

  const updated = updateNotaFiscal(id, {
    status: 'CANCELADA',
    motivoCancelamento: motivo,
    protocoloCancelamento,
  });
  return NextResponse.json({ sucesso: true, nf: updated });
}
