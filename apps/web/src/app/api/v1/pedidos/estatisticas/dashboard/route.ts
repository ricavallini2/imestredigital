import { NextResponse } from 'next/server';
import { PEDIDOS_MOCK } from '../../_mock-data';

export async function GET() {
  const agora = Date.now();
  const ms30d = 30 * 86400000;
  const ms7d  = 7  * 86400000;

  const pedidos30d = PEDIDOS_MOCK.filter((p) => agora - new Date(p.criadoEm).getTime() < ms30d);
  const pedidos7d  = PEDIDOS_MOCK.filter((p) => agora - new Date(p.criadoEm).getTime() < ms7d);

  const ativos = PEDIDOS_MOCK.filter((p) => !['CANCELADO', 'DEVOLVIDO'].includes(p.status));
  const receita30d = pedidos30d.filter((p) => p.statusPagamento === 'PAGO').reduce((s, p) => s + p.valor, 0);
  const receita7d  = pedidos7d.filter((p)  => p.statusPagamento === 'PAGO').reduce((s, p) => s + p.valor, 0);

  const ticketMedio = pedidos30d.length ? receita30d / pedidos30d.filter((p) => p.statusPagamento === 'PAGO').length : 0;

  const porStatus = {
    PENDENTE:     ativos.filter((p) => p.status === 'PENDENTE').length,
    CONFIRMADO:   ativos.filter((p) => p.status === 'CONFIRMADO').length,
    EM_SEPARACAO: ativos.filter((p) => p.status === 'EM_SEPARACAO').length,
    FATURADO:     ativos.filter((p) => p.status === 'FATURADO').length,
    ENVIADO:      ativos.filter((p) => p.status === 'ENVIADO').length,
    ENTREGUE:     PEDIDOS_MOCK.filter((p) => p.status === 'ENTREGUE').length,
    CANCELADO:    PEDIDOS_MOCK.filter((p) => p.status === 'CANCELADO').length,
  };

  const porCanal = ['BALCAO', 'INTERNA', 'SHOPIFY', 'MERCADO_LIVRE', 'SHOPEE', 'AMAZON', 'OUTROS'].map((canal) => ({
    canal,
    quantidade: pedidos30d.filter((p) => p.canal === canal).length,
    valor: pedidos30d.filter((p) => p.canal === canal).reduce((s, p) => s + p.valor, 0),
  })).filter((c) => c.quantidade > 0);

  // Top produtos no MESMO shape do order-service real (agrupado por sku, com
  // `titulo`/`quantidade`/`valorTotal`) — sem isso o widget do dashboard fica
  // vazio no mock e a paridade mock/real se perde.
  const acumuladoProdutos: Record<
    string,
    { produtoId: string; sku: string; titulo: string; quantidade: number; valorTotal: number }
  > = {};
  for (const pedido of pedidos30d) {
    for (const item of pedido.itensList ?? []) {
      const chave = item.sku || item.produtoId;
      acumuladoProdutos[chave] ??= {
        produtoId: item.produtoId,
        sku: item.sku,
        titulo: item.produto,
        quantidade: 0,
        valorTotal: 0,
      };
      acumuladoProdutos[chave].quantidade += item.quantidade;
      acumuladoProdutos[chave].valorTotal += item.subtotal;
    }
  }
  const topProdutos = Object.values(acumuladoProdutos)
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10)
    .map((p) => ({ ...p, valorTotal: +p.valorTotal.toFixed(2) }));

  const pendentesUrgentes = PEDIDOS_MOCK
    .filter((p) => ['PENDENTE', 'CONFIRMADO'].includes(p.status))
    .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
    .slice(0, 5)
    .map((p) => ({ id: p.id, numero: p.numero, cliente: p.cliente, valor: p.valor, canal: p.canal, criadoEm: p.criadoEm }));

  return NextResponse.json({
    receita30d,
    receita7d,
    pedidos30d: pedidos30d.length,
    pedidos7d: pedidos7d.length,
    ticketMedio,
    porStatus,
    porCanal,
    topProdutos,
    pendentesUrgentes,
  });
}
