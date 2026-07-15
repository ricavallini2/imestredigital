import { NextRequest, NextResponse } from 'next/server';
import { PEDIDOS_MOCK } from '../../_mock-data';
import type { StatusPedido } from '../../_mock-data';

// Máquina de estados espelhando o Prisma/backend (order-service).
// A fase de separação é um único estado: EM_SEPARACAO.
const TRANSICOES: Record<string, StatusPedido[]> = {
  RASCUNHO:     ['PENDENTE', 'CANCELADO'],
  PENDENTE:     ['CONFIRMADO', 'CANCELADO'],
  CONFIRMADO:   ['EM_SEPARACAO', 'CANCELADO'],
  EM_SEPARACAO: ['FATURADO', 'CANCELADO'],
  FATURADO:     ['ENVIADO', 'CANCELADO'],
  ENVIADO:      ['ENTREGUE', 'CANCELADO'],
  ENTREGUE:     ['DEVOLVIDO'],
  CANCELADO:    [],
  DEVOLVIDO:    [],
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = PEDIDOS_MOCK.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Pedido não encontrado' }, { status: 404 });

  const body = await req.json();
  const novoStatus: StatusPedido = body.status;
  const atual = PEDIDOS_MOCK[idx].status;
  const permitidos = TRANSICOES[atual] ?? [];

  if (!permitidos.includes(novoStatus)) {
    return NextResponse.json({ message: `Transição inválida: ${atual} → ${novoStatus}` }, { status: 422 });
  }

  const patch: Partial<typeof PEDIDOS_MOCK[0]> = { status: novoStatus, atualizadoEm: new Date().toISOString() };
  if (body.rastreio)       patch.rastreio       = body.rastreio;
  if (body.transportadora) patch.transportadora = body.transportadora;

  // Ao cancelar, estorna o pagamento (se já estava pago) e registra o motivo.
  if (novoStatus === 'CANCELADO') {
    patch.statusPagamento = PEDIDOS_MOCK[idx].statusPagamento === 'PAGO' ? 'ESTORNADO' : 'PENDENTE';
    if (body.motivo) {
      patch.observacoes = (PEDIDOS_MOCK[idx].observacoes ?? '') + `\nCancelamento: ${body.motivo}`;
    }
  }

  PEDIDOS_MOCK[idx] = { ...PEDIDOS_MOCK[idx], ...patch };
  return NextResponse.json(PEDIDOS_MOCK[idx]);
}
