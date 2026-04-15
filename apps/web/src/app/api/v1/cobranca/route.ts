import { NextRequest, NextResponse } from 'next/server';
import {
  TITULOS_COBRANCA_MOCK, TituloCobrancaMock, nextIdTitulo, calcularScoreIA,
} from './_mock-data';

export type { TituloCobrancaMock } from './_mock-data';
export { TITULOS_COBRANCA_MOCK, ACORDOS_MOCK, ACOES_COBRANCA_MOCK, getConfiguracao, calcularScoreIA, getMensagemTom } from './_mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status    = searchParams.get('status') ?? '';
  const prioridade = searchParams.get('prioridade') ?? '';
  const diasMin   = parseInt(searchParams.get('diasMin') ?? '0');
  const diasMax   = parseInt(searchParams.get('diasMax') ?? '9999');
  const busca     = searchParams.get('busca')?.toLowerCase() ?? '';

  let lista = TITULOS_COBRANCA_MOCK.map(t => ({ ...t, scoreIA: calcularScoreIA(t) }));

  if (status)     lista = lista.filter(t => t.status    === status);
  if (prioridade) lista = lista.filter(t => t.prioridade === prioridade);
  if (busca)      lista = lista.filter(t =>
    t.clienteNome.toLowerCase().includes(busca) ||
    t.descricao.toLowerCase().includes(busca)
  );
  lista = lista.filter(t => t.diasAtraso >= diasMin && t.diasAtraso <= diasMax);
  lista.sort((a, b) => b.scoreIA - a.scoreIA);

  return NextResponse.json({ dados: lista, total: lista.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const hoje = new Date().toISOString().slice(0, 10);
  const dias = body.dataVencimento
    ? Math.max(0, Math.floor((Date.now() - new Date(body.dataVencimento).getTime()) / 86400000))
    : 0;

  const novo: TituloCobrancaMock = {
    id: nextIdTitulo(),
    lancamentoId: body.lancamentoId ?? '',
    clienteId: body.clienteId ?? '',
    clienteNome: body.clienteNome ?? 'Cliente',
    clienteTelefone: body.clienteTelefone ?? '',
    clienteEmail: body.clienteEmail ?? '',
    descricao: body.descricao ?? 'Título manual',
    valor: body.valor ?? 0,
    dataVencimento: body.dataVencimento ?? hoje,
    diasAtraso: dias,
    status: 'EM_ABERTO',
    prioridade: dias > 60 ? 'CRITICA' : dias > 30 ? 'ALTA' : dias > 7 ? 'MEDIA' : 'BAIXA',
    tentativas: 0,
    ultimaAcaoEm: null,
    canalUltimaAcao: null,
    observacao: body.observacao ?? null,
  };
  TITULOS_COBRANCA_MOCK.push(novo);
  return NextResponse.json(novo, { status: 201 });
}
