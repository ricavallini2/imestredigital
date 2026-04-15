import { NextRequest, NextResponse } from 'next/server';
import { COMPRAS_MOCK } from '../../_mock-data';
import { FORNECEDORES_MOCK } from '../../../fornecedores/_mock-data';
// Inicializa os mocks de estoque
import '../../../estoque/_mock-data';

const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const idx = COMPRAS_MOCK.findIndex((c) => c.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Pedido de compra não encontrado' }, { status: 404 });
  }

  const compra = COMPRAS_MOCK[idx];

  if (compra.status === 'RECEBIDO' || compra.status === 'CANCELADO') {
    return NextResponse.json(
      { message: `Pedido já está ${compra.status}` },
      { status: 400 },
    );
  }

  const body = await req.json();
  const itensRecebidos: Array<{ itemId: string; quantidadeRecebida: number }> =
    body.itensRecebidos ?? [];

  // Atualiza as quantidades recebidas dos itens
  for (const ir of itensRecebidos) {
    const item = compra.itens.find((i) => i.id === ir.itemId);
    if (item) {
      item.quantidadeRecebida = Math.min(ir.quantidadeRecebida, item.quantidade);
    }
  }

  // Verifica se está totalmente recebido ou parcial
  const totalRecebido = compra.itens.every(
    (i) => i.quantidadeRecebida >= i.quantidade,
  );
  const algumRecebido = compra.itens.some((i) => i.quantidadeRecebida > 0);

  const agora = new Date().toISOString();

  if (totalRecebido) {
    compra.status = 'RECEBIDO';
    compra.dataRecebimento = agora;
  } else if (algumRecebido) {
    compra.status = 'RECEBIDO_PARCIAL';
  }
  compra.atualizadoEm = agora;

  // Atualiza saldos de estoque
  const depositoPadrao = 'dep-001';
  const depositoNome = 'Principal';

  for (const ir of itensRecebidos) {
    if (ir.quantidadeRecebida <= 0) continue;
    const item = compra.itens.find((i) => i.id === ir.itemId);
    if (!item) continue;

    // Atualiza/cria saldo
    const saldo = globalThis.__saldosMock?.find(
      (s) => s.produtoId === item.produtoId && s.depositoId === depositoPadrao,
    );
    if (saldo) {
      saldo.fisico += ir.quantidadeRecebida;
      saldo.disponivel = saldo.fisico - saldo.reservado;
      if (saldo.fisico <= 0) saldo.status = 'SEM_ESTOQUE';
      else if (saldo.fisico <= saldo.minimo * 0.5) saldo.status = 'CRITICO';
      else if (saldo.fisico <= saldo.minimo) saldo.status = 'BAIXO';
      else saldo.status = 'NORMAL';
    } else if (globalThis.__saldosMock) {
      globalThis.__saldosMock.push({
        id: genId(),
        produtoId: item.produtoId,
        produto: item.produto,
        sku: item.sku,
        depositoId: depositoPadrao,
        deposito: depositoNome,
        fisico: ir.quantidadeRecebida,
        reservado: 0,
        disponivel: ir.quantidadeRecebida,
        minimo: 5,
        maximo: 100,
        custo: item.valorUnitario,
        preco: item.valorUnitario * 1.3,
        giro30d: 0,
        status: 'NORMAL',
      });
    }

    // Registra movimentação
    if (globalThis.__movimentacoesMock) {
      globalThis.__movimentacoesMock.unshift({
        id: genId(),
        tipo: 'ENTRADA',
        produtoId: item.produtoId,
        produto: item.produto,
        sku: item.sku,
        quantidade: ir.quantidadeRecebida,
        depositoDestinoId: depositoPadrao,
        depositoDestino: depositoNome,
        motivo: `Recebimento compra #${compra.numero} — NF ${compra.nfeNumero ?? 'sem NF'}`,
        responsavel: 'Sistema',
        criadoEm: agora,
      });
    }
  }

  // Cria conta a pagar
  const vencimento = new Date(Date.now() + 30 * 86400000).toISOString();
  const contaId = genId();
  const fornecedor = FORNECEDORES_MOCK.find((f) => f.id === compra.fornecedorId);

  if (!globalThis.__contasAPagarMock) globalThis.__contasAPagarMock = [];
  globalThis.__contasAPagarMock.push({
    id: contaId,
    compraId: compra.id,
    fornecedorId: compra.fornecedorId,
    fornecedor: compra.fornecedor,
    valor: compra.valorTotal,
    vencimento,
    status: 'PENDENTE',
    criadoEm: agora,
  });

  // Atualiza totais do fornecedor
  if (fornecedor && totalRecebido) {
    fornecedor.totalCompras += compra.valorTotal;
    fornecedor.qtdCompras += 1;
    fornecedor.ultimaCompra = agora;
  }

  return NextResponse.json(compra);
}
