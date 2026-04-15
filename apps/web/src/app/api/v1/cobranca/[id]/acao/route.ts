import { NextRequest, NextResponse } from 'next/server';
import { TITULOS_COBRANCA_MOCK, ACOES_COBRANCA_MOCK, nextIdAcao, AcaoCobrancaMock } from '../../_mock-data';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const titulo = TITULOS_COBRANCA_MOCK.find(t => t.id === id);
  if (!titulo) return NextResponse.json({ message: 'Título não encontrado' }, { status: 404 });

  const body = await req.json();
  const acao: AcaoCobrancaMock = {
    id: nextIdAcao(),
    tituloId: id,
    clienteNome: titulo.clienteNome,
    tipo: body.tipo ?? 'WHATSAPP',
    mensagem: body.mensagem ?? '',
    status: 'ENVIADO',
    automatica: body.automatica ?? false,
    criadoEm: new Date().toISOString(),
  };
  ACOES_COBRANCA_MOCK.push(acao);

  // Transition title status
  if (titulo.status === 'EM_ABERTO') titulo.status = 'EM_COBRANCA';
  titulo.tentativas += 1;
  titulo.ultimaAcaoEm = acao.criadoEm;
  titulo.canalUltimaAcao = acao.tipo;

  return NextResponse.json(acao, { status: 201 });
}
