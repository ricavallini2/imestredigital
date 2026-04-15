import { NextRequest, NextResponse } from 'next/server';
import { PERGUNTAS_MOCK, MARKETPLACES_MOCK } from '../../../../_mock-data';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const idx = PERGUNTAS_MOCK.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ erro: 'Pergunta não encontrada' }, { status: 404 });
  }

  const pergunta = PERGUNTAS_MOCK[idx];

  if (pergunta.status === 'RESPONDIDA') {
    return NextResponse.json({ erro: 'Pergunta já foi respondida' }, { status: 422 });
  }

  const body = await req.json();
  if (!body.resposta || String(body.resposta).trim().length < 5) {
    return NextResponse.json({ erro: 'Resposta inválida ou muito curta' }, { status: 400 });
  }

  const agora = new Date().toISOString();

  const atualizada = {
    ...pergunta,
    resposta: String(body.resposta).trim(),
    status: 'RESPONDIDA' as const,
    dataResposta: agora,
  };

  PERGUNTAS_MOCK[idx] = atualizada;

  // Atualiza taxaResposta do marketplace correspondente
  const canalNorm = pergunta.canal as string;
  const mkpIdx = MARKETPLACES_MOCK.findIndex((m) => m.canal === canalNorm);
  if (mkpIdx !== -1) {
    const mkp = MARKETPLACES_MOCK[mkpIdx];
    const pendentesRestantes = PERGUNTAS_MOCK.filter(
      (p) => p.canal === pergunta.canal && p.status === 'PENDENTE',
    ).length;

    const totalCanal = PERGUNTAS_MOCK.filter((p) => p.canal === pergunta.canal).length;
    const respondidas = PERGUNTAS_MOCK.filter(
      (p) => p.canal === pergunta.canal && p.status === 'RESPONDIDA',
    ).length;

    MARKETPLACES_MOCK[mkpIdx] = {
      ...mkp,
      perguntasPendentes: pendentesRestantes,
      taxaResposta:
        totalCanal > 0 ? Math.round((respondidas / totalCanal) * 100) : mkp.taxaResposta,
    };
  }

  return NextResponse.json(atualizada);
}
