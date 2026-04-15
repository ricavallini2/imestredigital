import { NextRequest, NextResponse } from 'next/server';
import { SESSOES_MOCK, MOVS_MOCK, refreshTotais } from '../../_mock-data';
import type { TipoMov, CategoriaMov, FormaPgtoMov } from '../../_mock-data';

const TIPO_CATEGORIA: Record<CategoriaMov, TipoMov> = {
  VENDA:      'ENTRADA',
  SUPRIMENTO: 'ENTRADA',
  REEMBOLSO:  'ENTRADA',
  SANGRIA:    'SAIDA',
  DESPESA:    'SAIDA',
  OUTROS:     'ENTRADA',
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movs = MOVS_MOCK.filter((m) => m.sessaoId === id)
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  return NextResponse.json({ movimentacoes: movs, total: movs.length });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = SESSOES_MOCK.findIndex((s) => s.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Sessão não encontrada' }, { status: 404 });
  if (SESSOES_MOCK[idx].status === 'FECHADO') {
    return NextResponse.json({ message: 'Não é possível movimentar um caixa fechado' }, { status: 422 });
  }

  const body = await req.json();
  const categoria: CategoriaMov = body.categoria ?? 'OUTROS';
  const tipo: TipoMov = body.tipo ?? TIPO_CATEGORIA[categoria];

  const nova = {
    id: `mov-${Date.now()}`,
    sessaoId: id,
    tipo,
    categoria,
    descricao: body.descricao ?? categoria,
    valor: Number(body.valor),
    formaPagamento: (body.formaPagamento as FormaPgtoMov) ?? 'DINHEIRO',
    pedidoNumero: body.pedidoNumero ?? undefined,
    operador: body.operador ?? 'Operador',
    criadoEm: new Date().toISOString(),
  };

  MOVS_MOCK.push(nova);
  refreshTotais(SESSOES_MOCK[idx]);

  return NextResponse.json(nova, { status: 201 });
}
