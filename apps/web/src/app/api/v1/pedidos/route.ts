import { NextRequest, NextResponse } from 'next/server';
import { PEDIDOS_MOCK, CLIENTES_CATALOGO, nextNumero } from './_mock-data';
import type { PedidoMock, ItemPedidoMock } from './_mock-data';
import { PRODUTOS_MOCK } from '../produtos/_mock-data';
import { getSessaoAtual, MOVS_MOCK, refreshTotais } from '../caixa/_mock-data';
import type { FormaPgtoMov } from '../caixa/_mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const busca = searchParams.get('busca')?.toLowerCase() ?? '';
  const status = searchParams.get('status') ?? '';
  const canal = searchParams.get('canal') ?? '';
  const pagina = parseInt(searchParams.get('pagina') ?? '1');
  const limite = parseInt(searchParams.get('limite') ?? searchParams.get('itensPorPagina') ?? '20');

  let lista = [...PEDIDOS_MOCK].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

  if (busca) lista = lista.filter((p) => p.numero.toLowerCase().includes(busca) || p.cliente.toLowerCase().includes(busca));
  if (status) lista = lista.filter((p) => p.status === status);
  if (canal) lista = lista.filter((p) => p.canal === canal);

  const total = lista.length;
  const dados = lista.slice((pagina - 1) * limite, pagina * limite).map((p) => ({
    id: p.id, numero: p.numero, cliente: p.cliente, canal: p.canal,
    itens: p.itens, valor: p.valor, status: p.status,
    data: p.criadoEm.split('T')[0], criadoEm: p.criadoEm,
  }));

  return NextResponse.json({ dados, paginacao: { pagina, itensPorPagina: limite, total, totalPaginas: Math.ceil(total / limite) } });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    clienteId, cliente, canal = 'INTERNA', itensList = [],
    desconto = 0, frete = 0, parcelas, troco, enderecoEntrega, observacoes, vendedor,
    formasPagamento, // array: [{forma, valor, parcelas?}]
  } = body;
  // Resolve primary payment: use formasPagamento[0] if provided, else fallback to formaPagamento field
  const formaPagamento: string = formasPagamento?.[0]?.forma ?? body.formaPagamento ?? 'PIX';

  if (!itensList || itensList.length === 0) {
    return NextResponse.json({ message: 'Pelo menos um item é obrigatório' }, { status: 400 });
  }

  // ── Validação de caixa para venda balcão ──────────────────────────────────
  if (canal === 'BALCAO') {
    const sessaoAtual = getSessaoAtual();
    if (!sessaoAtual) {
      return NextResponse.json(
        {
          message: 'Caixa fechado. Abra o caixa antes de realizar uma venda balcão.',
          code: 'CAIXA_FECHADO',
        },
        { status: 422 },
      );
    }
  }

  // Calcular subtotal
  const itensCompletos: ItemPedidoMock[] = itensList.map((item: { produtoId: string; quantidade: number; precoUnitario?: number; desconto?: number; variacaoId?: string; variacao?: string }, idx: number) => {
    const prod = PRODUTOS_MOCK.find((p) => p.id === item.produtoId);
    const variacao = item.variacaoId ? prod?.variacoes.find((v) => v.id === item.variacaoId) : undefined;
    const preco = item.precoUnitario ?? variacao?.preco ?? prod?.preco ?? 0;
    const desc = item.desconto ?? 0;
    const sub = (preco * item.quantidade) - desc;
    return {
      id: `i-${Date.now()}-${idx}`, produtoId: item.produtoId,
      produto: prod?.nome ?? 'Produto',
      sku: variacao?.sku ?? prod?.sku ?? '',
      variacaoId: item.variacaoId,
      variacao: item.variacao,
      quantidade: item.quantidade, precoUnitario: preco, desconto: desc, subtotal: sub,
    };
  });

  const subtotal = itensCompletos.reduce((s, i) => s + i.subtotal, 0);
  const valor = subtotal - desconto + frete;

  // Nome do cliente
  let nomeCliente = cliente ?? 'Cliente Balcão';
  let emailCliente: string | undefined;
  let telefoneCliente: string | undefined;
  if (clienteId) {
    const cli = CLIENTES_CATALOGO.find((c) => c.id === clienteId);
    if (cli) { nomeCliente = cli.nome; emailCliente = cli.email; telefoneCliente = cli.telefone; }
  }

  const novo: PedidoMock = {
    id: `ped-${Date.now()}`, numero: nextNumero(),
    clienteId, cliente: nomeCliente, clienteEmail: emailCliente, clienteTelefone: telefoneCliente,
    canal, status: canal === 'BALCAO' ? 'ENTREGUE' : 'PENDENTE',
    itens: itensCompletos.length, itensList: itensCompletos,
    subtotal, desconto, frete, valor,
    formaPagamento, statusPagamento: canal === 'BALCAO' ? 'PAGO' : 'PENDENTE',
    parcelas, troco, enderecoEntrega, observacoes, vendedor,
    criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString(),
  };

  PEDIDOS_MOCK.unshift(novo);

  // ── Registrar movimentação automática no caixa ─────────────────────────────
  if (canal === 'BALCAO') {
    const sessao = getSessaoAtual()!;
    const pgtos: { forma: string; valor: number }[] = formasPagamento?.length
      ? formasPagamento
      : [{ forma: formaPagamento, valor: novo.valor }];

    pgtos.forEach((pg, idx) => {
      MOVS_MOCK.push({
        id: `mov-${Date.now()}-${idx}`,
        sessaoId: sessao.id,
        tipo: 'ENTRADA' as const,
        categoria: 'VENDA' as const,
        descricao: `Venda balcão #${novo.numero}${pgtos.length > 1 ? ` (${pg.forma})` : ''}`,
        valor: pg.valor,
        formaPagamento: pg.forma as FormaPgtoMov,
        pedidoNumero: novo.numero,
        operador: vendedor || sessao.operador,
        criadoEm: new Date().toISOString(),
      });
    });
    refreshTotais(sessao);
  }

  return NextResponse.json(novo, { status: 201 });
}
