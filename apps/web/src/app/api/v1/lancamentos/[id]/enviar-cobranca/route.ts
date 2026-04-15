import { NextRequest, NextResponse } from 'next/server';
import { LANCAMENTOS_MOCK } from '../../_mock-data';
import {
  TITULOS_COBRANCA_MOCK,
  nextIdTitulo,
  TituloCobrancaMock,
} from '../../../cobranca/_mock-data';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
  const { id } = await params;

  const lancamento = LANCAMENTOS_MOCK.find((l) => l.id === id);
  if (!lancamento) {
    return NextResponse.json({ erro: 'Lançamento não encontrado' }, { status: 404 });
  }
  if (lancamento.tipo !== 'RECEITA') {
    return NextResponse.json(
      { erro: 'Apenas recebíveis (RECEITA) podem ser enviados para cobrança' },
      { status: 400 },
    );
  }
  if (lancamento.status === 'PAGO' || lancamento.status === 'CANCELADO') {
    return NextResponse.json(
      { erro: 'Lançamento já pago ou cancelado' },
      { status: 400 },
    );
  }
  if (lancamento.emCobranca) {
    const tituloExistente = TITULOS_COBRANCA_MOCK.find(
      (t) => t.lancamentoId === id && t.status !== 'PAGO' && t.status !== 'PERDIDO',
    );
    if (tituloExistente) {
      return NextResponse.json(
        { erro: 'Este lançamento já está em cobrança', tituloId: tituloExistente.id },
        { status: 409 },
      );
    }
  }

  const hoje = new Date();
  const venc = new Date(lancamento.dataVencimento + 'T00:00:00');
  const diasAtraso = Math.max(
    0,
    Math.floor((hoje.getTime() - venc.getTime()) / 86400000),
  );

  const prioridade: TituloCobrancaMock['prioridade'] =
    diasAtraso > 60 ? 'CRITICA' :
    diasAtraso > 30 ? 'ALTA' :
    diasAtraso > 7  ? 'MEDIA' : 'BAIXA';

  const novoTitulo: TituloCobrancaMock = {
    id: nextIdTitulo(),
    lancamentoId: lancamento.id,
    clienteId:       lancamento.clienteId       ?? '',
    clienteNome:     lancamento.clienteNome      ?? lancamento.descricao,
    clienteTelefone: lancamento.clienteTelefone  ?? '',
    clienteEmail:    lancamento.clienteEmail     ?? '',
    descricao:       lancamento.descricao,
    valor:           lancamento.valor,
    dataVencimento:  lancamento.dataVencimento,
    diasAtraso,
    status:          'EM_ABERTO',
    prioridade,
    tentativas:      0,
    ultimaAcaoEm:    null,
    canalUltimaAcao: null,
    observacao:      `Enviado automaticamente do módulo Financeiro em ${new Date().toLocaleDateString('pt-BR')}`,
  };

  TITULOS_COBRANCA_MOCK.push(novoTitulo);

  // Marca o lançamento como em cobrança
  lancamento.emCobranca = true;
  lancamento.cobrancaTituloId = novoTitulo.id;
  lancamento.status = 'ATRASADO';
  lancamento.atualizadoEm = new Date().toISOString();

  return NextResponse.json(novoTitulo, { status: 201 });
  } catch (err) {
    console.error('[enviar-cobranca] erro:', err);
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
