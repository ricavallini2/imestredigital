import { NextRequest, NextResponse } from 'next/server';
import {
  getNotasFiscais, getConfig, addNotaFiscal, nextNumeroNF,
  type NotaFiscalMock, type TipoNF,
} from './_mock-data';

// GET /api/v1/notas-fiscais
export async function GET(req: NextRequest) {
  const sp     = req.nextUrl.searchParams;
  const busca  = sp.get('busca')?.toLowerCase() ?? '';
  const status = sp.get('status') ?? '';
  const tipo   = sp.get('tipo') ?? '';
  const page   = Math.max(1, Number(sp.get('page') ?? 1));
  const limit  = Math.min(50, Math.max(1, Number(sp.get('limit') ?? 20)));

  let nfs: NotaFiscalMock[] = getNotasFiscais().slice().sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
  );

  if (status) nfs = nfs.filter(n => n.status === status);
  if (tipo)   nfs = nfs.filter(n => n.tipo === tipo);
  if (busca)  nfs = nfs.filter(n =>
    n.numero.includes(busca) ||
    n.destinatario.toLowerCase().includes(busca) ||
    (n.pedidoNumero ?? '').toLowerCase().includes(busca) ||
    (n.chaveAcesso ?? '').includes(busca)
  );

  const total = nfs.length;
  const items = nfs.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ notas: items, total, page, limit, totalPages: Math.ceil(total / limit) });
}

// POST /api/v1/notas-fiscais
export async function POST(req: NextRequest) {
  const body = await req.json();
  const cfg  = getConfig();

  const tipo: TipoNF = body.tipo ?? 'NFE';
  const serie  = tipo === 'NFCE' ? cfg.serieNFCe : cfg.serieNFe;
  const numero = nextNumeroNF();

  const now = new Date().toISOString();
  const nova: NotaFiscalMock = {
    id: `nf-${Date.now()}`,
    numero,
    serie,
    tipo,
    naturezaOperacao: body.naturezaOperacao ?? 'Venda de Mercadoria',
    finalidade: body.finalidade ?? 'NORMAL',
    status: 'RASCUNHO',
    regimeTributario: cfg.regimeTributario,
    destinatario: body.destinatario ?? '',
    destinatarioCnpjCpf: body.destinatarioCnpjCpf ?? '',
    destinatarioUF: body.destinatarioUF ?? cfg.uf,
    destinatarioEmail: body.destinatarioEmail,
    enderecoEntrega: body.enderecoEntrega,
    itens: body.itens ?? [],
    qtdItens: (body.itens ?? []).length,
    valorProdutos: body.valorProdutos ?? 0,
    valorDesconto: body.valorDesconto ?? 0,
    valorFrete: body.valorFrete ?? 0,
    valorOutras: body.valorOutras ?? 0,
    baseICMS: body.baseICMS ?? 0,
    valorICMS: body.valorICMS ?? 0,
    valorPIS: body.valorPIS ?? 0,
    valorCOFINS: body.valorCOFINS ?? 0,
    valorIPI: 0,
    valorISS: 0,
    valorTotal: body.valorTotal ?? 0,
    pedidoId: body.pedidoId,
    pedidoNumero: body.pedidoNumero,
    dataEmissao: now,
    criadoEm: now,
    atualizadoEm: now,
    observacoes: body.observacoes,
    informacoesAdicionais: body.informacoesAdicionais,
  };

  addNotaFiscal(nova);
  return NextResponse.json(nova, { status: 201 });
}
