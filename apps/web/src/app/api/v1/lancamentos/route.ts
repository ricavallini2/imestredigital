import { NextRequest, NextResponse } from 'next/server';
import type { LancamentoMock } from './_mock-data';
import { LANCAMENTOS_MOCK, nextIdLancamento } from './_mock-data';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Auto-escalate PENDENTE to ATRASADO if dataVencimento is past today */
function applyAtrasadoStatus(list: LancamentoMock[]): LancamentoMock[] {
  const today = new Date().toISOString().slice(0, 10);
  return list.map((l) => {
    if (l.status === 'PENDENTE' && l.dataVencimento < today) {
      return { ...l, status: 'ATRASADO' as const };
    }
    return l;
  });
}

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tipo       = searchParams.get('tipo') ?? '';
  const status     = searchParams.get('status') ?? '';
  const categoria  = searchParams.get('categoria') ?? '';
  const busca      = searchParams.get('busca')?.toLowerCase() ?? '';
  const dataInicio = searchParams.get('dataInicio') ?? '';
  const dataFim    = searchParams.get('dataFim') ?? '';
  const pagina     = Math.max(1, parseInt(searchParams.get('pagina') ?? '1', 10));
  const limite     = Math.max(1, parseInt(searchParams.get('limite') ?? '50', 10));

  // Apply automatic ATRASADO escalation
  let lista = applyAtrasadoStatus([...LANCAMENTOS_MOCK]);

  if (tipo)      lista = lista.filter((l) => l.tipo === tipo);
  if (status) {
    const statuses = status.split(',').map((s) => s.trim());
    lista = lista.filter((l) => statuses.includes(l.status));
  }
  if (categoria) lista = lista.filter((l) => l.categoria.toLowerCase() === categoria.toLowerCase());
  if (busca)     lista = lista.filter((l) =>
    l.descricao.toLowerCase().includes(busca) ||
    l.categoria.toLowerCase().includes(busca) ||
    l.conta.toLowerCase().includes(busca),
  );
  if (dataInicio) lista = lista.filter((l) => l.dataVencimento >= dataInicio);
  if (dataFim)    lista = lista.filter((l) => l.dataVencimento <= dataFim);

  // Sort: most recent vencimento first
  lista.sort((a, b) => b.dataVencimento.localeCompare(a.dataVencimento));

  const total        = lista.length;
  const totalPaginas = Math.ceil(total / limite);
  const offset       = (pagina - 1) * limite;
  const dados        = lista.slice(offset, offset + limite);

  return NextResponse.json({ dados, total, pagina, limite, totalPaginas });
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Validate required fields
  if (!body.tipo || !body.descricao || !body.valor || !body.dataVencimento) {
    return NextResponse.json(
      { message: 'Campos obrigatórios: tipo, descricao, valor, dataVencimento' },
      { status: 400 },
    );
  }
  if (!['RECEITA', 'DESPESA'].includes(body.tipo)) {
    return NextResponse.json({ message: 'tipo deve ser RECEITA ou DESPESA' }, { status: 400 });
  }

  const agora = new Date().toISOString();
  const novo: LancamentoMock = {
    id: nextIdLancamento(),
    tipo: body.tipo,
    descricao: body.descricao,
    valor: Number(body.valor),
    categoria: body.categoria ?? 'Outros',
    categoriaId: body.categoriaId ?? 'cat-outros',
    subcategoria: body.subcategoria,
    contaId: body.contaId ?? 'cb-001',
    conta: body.conta ?? 'Itaú Corrente',
    status: body.status ?? 'PENDENTE',
    dataVencimento: body.dataVencimento,
    dataPagamento: body.dataPagamento,
    origem: body.origem ?? 'MANUAL',
    origemId: body.origemId,
    recorrente: body.recorrente ?? false,
    observacoes: body.observacoes,
    criadoEm: agora,
    atualizadoEm: agora,
  };

  LANCAMENTOS_MOCK.unshift(novo);
  return NextResponse.json(novo, { status: 201 });
}
