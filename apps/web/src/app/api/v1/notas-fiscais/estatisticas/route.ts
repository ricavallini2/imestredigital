import { NextResponse } from 'next/server';
import { getNotasFiscais } from '../_mock-data';

// GET /api/v1/notas-fiscais/estatisticas
export async function GET() {
  const nfs = getNotasFiscais();
  const now = Date.now();
  const d30 = now - 30 * 86400000;
  const d7  = now - 7  * 86400000;

  const emitidas30d = nfs.filter(n => n.status === 'EMITIDA' && new Date(n.dataEmissao).getTime() >= d30);
  const emitidas7d  = nfs.filter(n => n.status === 'EMITIDA' && new Date(n.dataEmissao).getTime() >= d7);

  const faturado30d = emitidas30d.reduce((s, n) => s + n.valorTotal, 0);
  const faturado7d  = emitidas7d.reduce((s, n) => s + n.valorTotal, 0);
  const impostos30d = emitidas30d.reduce((s, n) => s + n.valorICMS + n.valorPIS + n.valorCOFINS, 0);

  const porStatus = nfs.reduce<Record<string, number>>((acc, n) => {
    acc[n.status] = (acc[n.status] ?? 0) + 1;
    return acc;
  }, {});

  const porTipo = nfs.reduce<Record<string, number>>((acc, n) => {
    acc[n.tipo] = (acc[n.tipo] ?? 0) + 1;
    return acc;
  }, {});

  const rejeitadas = nfs.filter(n => n.status === 'REJEITADA').length;
  const emitidas   = nfs.filter(n => n.status === 'EMITIDA').length;
  const total      = nfs.filter(n => n.status !== 'RASCUNHO').length;

  return NextResponse.json({
    faturado30d: +faturado30d.toFixed(2),
    faturado7d:  +faturado7d.toFixed(2),
    impostos30d: +impostos30d.toFixed(2),
    totalNFs:    nfs.length,
    emitidas30d: emitidas30d.length,
    emitidas7d:  emitidas7d.length,
    taxaRejeicao: total > 0 ? +((rejeitadas / total) * 100).toFixed(1) : 0,
    taxaEmissao:  total > 0 ? +((emitidas / total) * 100).toFixed(1) : 0,
    porStatus,
    porTipo,
    processando: nfs.filter(n => n.status === 'PROCESSANDO').length,
  });
}
