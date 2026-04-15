import { NextRequest, NextResponse } from 'next/server';
import {
  TITULOS_COBRANCA_MOCK, ACOES_COBRANCA_MOCK, getConfiguracao,
  nextIdAcao, getMensagemTom, AcaoCobrancaMock,
} from '../_mock-data';

export async function POST(req: NextRequest) {
  const body   = await req.json();
  const config = getConfiguracao();
  const ids: string[] | undefined = body.ids;
  const filtro = body.filtro ?? {};

  // Select targets: EM_ABERTO or EM_COBRANCA titles
  let alvos = TITULOS_COBRANCA_MOCK.filter(t =>
    ['EM_ABERTO', 'EM_COBRANCA'].includes(t.status)
  );
  if (ids?.length) {
    alvos = alvos.filter(t => ids.includes(t.id));
  } else {
    if (filtro.prioridade) alvos = alvos.filter(t => t.prioridade === filtro.prioridade);
    if (filtro.diasMin)    alvos = alvos.filter(t => t.diasAtraso >= filtro.diasMin);
  }

  const acoesCriadas: AcaoCobrancaMock[] = [];
  const now = new Date().toISOString();

  for (const titulo of alvos) {
    const { mensagem, canal } = getMensagemTom(titulo.diasAtraso, titulo.clienteNome, titulo.valor, titulo.clienteTelefone);

    const acao: AcaoCobrancaMock = {
      id: nextIdAcao(),
      tituloId: titulo.id,
      clienteNome: titulo.clienteNome,
      tipo: canal,
      mensagem,
      status: 'ENVIADO',
      automatica: true,
      criadoEm: now,
    };
    ACOES_COBRANCA_MOCK.push(acao);
    acoesCriadas.push(acao);

    titulo.status = 'EM_COBRANCA';
    titulo.tentativas += 1;
    titulo.ultimaAcaoEm = now;
    titulo.canalUltimaAcao = canal;
  }

  // Fire n8n webhook (fire-and-forget, never throws)
  let erroWebhook = false;
  if (config.webhookN8n && acoesCriadas.length > 0) {
    const payloads = alvos.map((t, i) => ({
      clienteNome: t.clienteNome,
      telefone: t.clienteTelefone,
      email: t.clienteEmail,
      valor: t.valor,
      diasAtraso: t.diasAtraso,
      mensagem: acoesCriadas[i]?.mensagem ?? '',
      canal: acoesCriadas[i]?.tipo ?? 'WHATSAPP',
      acordo_url: `${config.callbackUrl}?clienteId=${t.clienteId}`,
    }));
    fetch(config.webhookN8n, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulos: payloads, total: payloads.length }),
    }).catch(() => { erroWebhook = true; });
  }

  return NextResponse.json({
    disparados: acoesCriadas.length,
    acoes: acoesCriadas,
    erroWebhook,
    webhookUrl: config.webhookN8n,
  });
}
