import { NextRequest, NextResponse } from 'next/server';
import { findNF, getConfig, updateNotaFiscal } from '../../_mock-data';

function gerarChaveAcesso(numero: string, uf = '35'): string {
  const mes  = new Date().toISOString().slice(2, 4) + new Date().toISOString().slice(5, 7);
  const num  = numero.slice(-6).padStart(6, '0');
  return `${uf}${mes}12345678000190550010000${num}1876543210`;
}

// POST /api/v1/notas-fiscais/:id/emitir
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nf  = findNF(id);
  if (!nf) return NextResponse.json({ erro: 'NF-e não encontrada' }, { status: 404 });
  if (!['VALIDADA', 'RASCUNHO'].includes(nf.status)) {
    return NextResponse.json({ erro: `NF-e com status ${nf.status} não pode ser emitida` }, { status: 422 });
  }
  const cfg = getConfig();

  // Simula envio SEFAZ — 90% sucesso / 10% rejeição
  const sucesso = Math.random() > 0.1;

  if (sucesso) {
    const agora = new Date().toISOString();
    const protocolo = `1352600${Date.now().toString().slice(-8)}`;
    const chaveAcesso = gerarChaveAcesso(nf.numero, '35');
    const updated = updateNotaFiscal(id, {
      status: 'EMITIDA',
      chaveAcesso,
      protocolo,
      dataAutorizacao: agora,
      motivoRejeicao: undefined,
      codigoRejeicao: undefined,
    });
    return NextResponse.json({ sucesso: true, nf: updated, protocolo, chaveAcesso });
  } else {
    // Simula rejeição
    const updated = updateNotaFiscal(id, {
      status: 'REJEITADA',
      codigoRejeicao: '205',
      motivoRejeicao: 'Rejeição: Chave de Acesso inválida (simulação homologação)',
    });
    // Retorna 200 com sucesso=false para que o cliente possa inspecionar o resultado
    // sem que o axios lance um erro (facilitando o tratamento no frontend)
    return NextResponse.json({ sucesso: false, nf: updated,
      codigoRejeicao: '205',
      motivoRejeicao: 'Rejeição: Chave de Acesso inválida (simulação homologação)',
    });
  }
}
