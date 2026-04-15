import { NextRequest, NextResponse } from 'next/server';
import { findNF, updateNotaFiscal } from '../../_mock-data';

// POST /api/v1/notas-fiscais/:id/validar
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nf = findNF(id);
  if (!nf) return NextResponse.json({ erro: 'NF-e não encontrada' }, { status: 404 });
  if (!['RASCUNHO', 'REJEITADA'].includes(nf.status)) {
    return NextResponse.json({ erro: `NF-e com status ${nf.status} não pode ser validada` }, { status: 422 });
  }
  if (!nf.destinatario || nf.itens.length === 0) {
    return NextResponse.json({
      valido: false,
      erros: [
        ...(!nf.destinatario ? ['Destinatário é obrigatório'] : []),
        ...(nf.itens.length === 0 ? ['Adicione pelo menos um item'] : []),
      ],
    }, { status: 422 });
  }
  const updated = updateNotaFiscal(id, { status: 'VALIDADA' });
  return NextResponse.json({ valido: true, nf: updated });
}
