import { NextRequest, NextResponse } from 'next/server';
import { ACOES_COBRANCA_MOCK, TITULOS_COBRANCA_MOCK } from '../_mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tituloId  = searchParams.get('tituloId') ?? '';
  const tipo      = searchParams.get('tipo') ?? '';
  const status    = searchParams.get('status') ?? '';
  const dataInicio = searchParams.get('dataInicio') ?? '';
  const dataFim   = searchParams.get('dataFim') ?? '';
  const busca     = searchParams.get('busca')?.toLowerCase() ?? '';

  // Join with title data
  const titulosMap = Object.fromEntries(TITULOS_COBRANCA_MOCK.map(t => [t.id, t]));

  let lista = ACOES_COBRANCA_MOCK.map(a => ({
    ...a,
    valor: titulosMap[a.tituloId]?.valor ?? 0,
    dataVencimento: titulosMap[a.tituloId]?.dataVencimento ?? '',
    diasAtraso: titulosMap[a.tituloId]?.diasAtraso ?? 0,
  }));

  if (tituloId)   lista = lista.filter(a => a.tituloId === tituloId);
  if (tipo)       lista = lista.filter(a => a.tipo === tipo);
  if (status)     lista = lista.filter(a => a.status === status);
  if (dataInicio) lista = lista.filter(a => a.criadoEm >= dataInicio);
  if (dataFim)    lista = lista.filter(a => a.criadoEm <= dataFim + 'T23:59:59Z');
  if (busca)      lista = lista.filter(a => a.clienteNome.toLowerCase().includes(busca) || a.mensagem.toLowerCase().includes(busca));

  lista.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());

  return NextResponse.json({ dados: lista, total: lista.length });
}
