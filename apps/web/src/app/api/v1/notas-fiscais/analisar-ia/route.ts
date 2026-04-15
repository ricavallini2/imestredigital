import { NextResponse } from 'next/server';
import { getNotasFiscais, getConfig, analisarFiscalIA } from '../_mock-data';

// GET /api/v1/notas-fiscais/analisar-ia
export async function GET() {
  const nfs    = getNotasFiscais();
  const config = getConfig();
  const analise = analisarFiscalIA(nfs, config);
  return NextResponse.json(analise);
}
