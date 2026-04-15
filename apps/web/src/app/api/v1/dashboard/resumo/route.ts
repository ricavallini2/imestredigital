import { NextResponse } from 'next/server';
import { PEDIDOS_MOCK } from '../../pedidos/_mock-data';
import { SALDOS_MOCK } from '../../estoque/_mock-data';
import { getNotasFiscais } from '../../notas-fiscais/_mock-data';
import { getSessaoAtual, refreshTotais } from '../../caixa/_mock-data';

/**
 * GET /api/v1/dashboard/resumo
 * Endpoint agregado para o Dashboard principal.
 * Consolida pedidos, estoque, fiscal e caixa em uma única chamada.
 */
export async function GET() {
  const now = Date.now();
  const ms30d = 30 * 86400000;
  const ms7d  =  7 * 86400000;

  // ─── Pedidos ─────────────────────────────────────────────────────────────────
  const pedidos30d = PEDIDOS_MOCK.filter(p => now - new Date(p.criadoEm).getTime() < ms30d);
  const pedidos7d  = PEDIDOS_MOCK.filter(p => now - new Date(p.criadoEm).getTime() < ms7d);
  const pedidos30dAnt = PEDIDOS_MOCK.filter(p => {
    const t = now - new Date(p.criadoEm).getTime();
    return t >= ms30d && t < 2 * ms30d;
  });

  const receita30d = pedidos30d.filter(p => p.statusPagamento === 'PAGO').reduce((s, p) => s + p.valor, 0);
  const receita7d  = pedidos7d.filter(p => p.statusPagamento === 'PAGO').reduce((s, p) => s + p.valor, 0);
  const receitaAnt = pedidos30dAnt.filter(p => p.statusPagamento === 'PAGO').reduce((s, p) => s + p.valor, 0);
  const crescimentoReceita = receitaAnt > 0 ? ((receita30d - receitaAnt) / receitaAnt) * 100 : 0;

  const pagos30d = pedidos30d.filter(p => p.statusPagamento === 'PAGO');
  const ticketMedio = pagos30d.length ? receita30d / pagos30d.length : 0;

  // Últimos 7 dias — breakdown diário
  const vendas7d = Array.from({ length: 7 }, (_, i) => {
    const diaInicio = new Date(now - (6 - i) * 86400000);
    diaInicio.setHours(0, 0, 0, 0);
    const diaFim   = new Date(diaInicio.getTime() + 86400000);
    const diaPeds  = PEDIDOS_MOCK.filter(p => {
      const t = new Date(p.criadoEm).getTime();
      return t >= diaInicio.getTime() && t < diaFim.getTime();
    });
    const label = diaInicio.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' });
    return {
      data: diaInicio.toISOString().slice(0, 10),
      label,
      receita: +diaPeds.filter(p => p.statusPagamento === 'PAGO').reduce((s, p) => s + p.valor, 0).toFixed(2),
      pedidos: diaPeds.length,
    };
  });

  // Por status (ativos)
  const ativos = PEDIDOS_MOCK.filter(p => !['CANCELADO', 'DEVOLVIDO'].includes(p.status));
  const STATUS_LISTA = ['PENDENTE','CONFIRMADO','SEPARANDO','SEPARADO','FATURADO','ENVIADO','ENTREGUE','CANCELADO'];
  const porStatus = Object.fromEntries(
    STATUS_LISTA.map(s => [s, PEDIDOS_MOCK.filter(p => p.status === s).length])
  );

  // Por canal (30d)
  const CANAIS = ['BALCAO','INTERNA','SHOPIFY','MERCADO_LIVRE','SHOPEE','AMAZON','OUTROS'];
  const porCanal = CANAIS
    .map(canal => ({
      canal,
      label: canal.replace('_', ' '),
      qtd:   pedidos30d.filter(p => p.canal === canal).length,
      valor: +pedidos30d.filter(p => p.canal === canal).reduce((s, p) => s + p.valor, 0).toFixed(2),
    }))
    .filter(c => c.qtd > 0)
    .sort((a, b) => b.valor - a.valor);

  // Top 5 produtos (por receita nos pedidos 30d)
  const receitaPorProduto: Record<string, { id: string; nome: string; sku: string; qtd: number; receita: number }> = {};
  for (const ped of pedidos30d) {
    for (const item of ped.itensList ?? []) {
      if (!receitaPorProduto[item.produtoId]) {
        receitaPorProduto[item.produtoId] = { id: item.produtoId, nome: item.produto, sku: item.sku, qtd: 0, receita: 0 };
      }
      receitaPorProduto[item.produtoId].qtd     += item.quantidade;
      receitaPorProduto[item.produtoId].receita += item.subtotal;
    }
  }
  const topProdutos5 = Object.values(receitaPorProduto)
    .sort((a, b) => b.receita - a.receita)
    .slice(0, 5)
    .map(p => ({ ...p, receita: +p.receita.toFixed(2) }));

  // Pedidos recentes (últimos 6)
  const pedidosRecentes = [...PEDIDOS_MOCK]
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
    .slice(0, 6)
    .map(p => ({ id: p.id, numero: p.numero, cliente: p.cliente, valor: p.valor, status: p.status, canal: p.canal, criadoEm: p.criadoEm }));

  // Pedidos urgentes (PENDENTE/CONFIRMADO há mais de 4h)
  const pedidosUrgentes = ativos
    .filter(p => ['PENDENTE','CONFIRMADO'].includes(p.status))
    .map(p => ({
      id: p.id, numero: p.numero, cliente: p.cliente, valor: p.valor, canal: p.canal, criadoEm: p.criadoEm,
      horasAtraso: Math.floor((now - new Date(p.criadoEm).getTime()) / 3600000),
    }))
    .sort((a, b) => b.horasAtraso - a.horasAtraso)
    .slice(0, 5);

  // ─── Estoque ─────────────────────────────────────────────────────────────────
  const valorEmEstoque = SALDOS_MOCK.reduce((s, e) => s + e.fisico * e.custo, 0);
  const estoqueBaixo   = SALDOS_MOCK.filter(e => e.status === 'BAIXO' || e.status === 'CRITICO').length;
  const semEstoque     = SALDOS_MOCK.filter(e => e.status === 'SEM_ESTOQUE').length;
  const alertasEstoque = SALDOS_MOCK
    .filter(e => e.status !== 'NORMAL')
    .sort((a, b) => {
      const o = { SEM_ESTOQUE: 0, CRITICO: 1, BAIXO: 2, NORMAL: 3 };
      return (o[a.status] ?? 3) - (o[b.status] ?? 3);
    })
    .slice(0, 6)
    .map(e => ({ produtoId: e.produtoId, produto: e.produto, sku: e.sku, disponivel: e.disponivel, minimo: e.minimo, status: e.status, deposito: e.deposito }));

  // ─── Fiscal ──────────────────────────────────────────────────────────────────
  const nfs = getNotasFiscais();
  const nfs30d     = nfs.filter(n => n.status === 'EMITIDA' && now - new Date(n.dataEmissao).getTime() < ms30d);
  const faturado30d = +nfs30d.reduce((s, n) => s + n.valorTotal, 0).toFixed(2);
  const impostos30d = +nfs30d.reduce((s, n) => s + n.valorICMS + n.valorPIS + n.valorCOFINS, 0).toFixed(2);
  const totalNFsNaoRascunho = nfs.filter(n => n.status !== 'RASCUNHO').length;
  const totalEmitidas = nfs.filter(n => n.status === 'EMITIDA').length;
  const taxaEmissao  = totalNFsNaoRascunho > 0 ? +((totalEmitidas / totalNFsNaoRascunho) * 100).toFixed(1) : 0;
  const nfsPendentes = nfs.filter(n => ['RASCUNHO','VALIDADA'].includes(n.status)).length;

  // ─── Caixa ───────────────────────────────────────────────────────────────────
  const sessao = getSessaoAtual();
  let caixa: Record<string, unknown> = { aberto: false };
  if (sessao) {
    refreshTotais(sessao);
    caixa = {
      aberto: true,
      operador: sessao.operador,
      caixa: sessao.caixa,
      abertoDesde: sessao.aberturaEm,
      totalEntradas: sessao.totalEntradas,
      totalSaidas: sessao.totalSaidas,
      saldoAtual: sessao.saldoEsperado,
    };
  }

  // ─── Resposta ─────────────────────────────────────────────────────────────────
  return NextResponse.json({
    // Visão geral
    receita30d,
    receita7d,
    receitaAnt,
    crescimentoReceita: +crescimentoReceita.toFixed(1),
    pedidos30d: pedidos30d.length,
    pedidos7d:  pedidos7d.length,
    ticketMedio: +ticketMedio.toFixed(2),
    pedidosPendentes: porStatus['PENDENTE'] ?? 0,

    // Gráficos
    vendas7d,
    porCanal,
    porStatus,
    topProdutos5,

    // Feeds
    pedidosRecentes,
    pedidosUrgentes,

    // Estoque
    estoque: {
      valorEmEstoque: +valorEmEstoque.toFixed(2),
      estoqueBaixo,
      semEstoque,
      totalProdutos: new Set(SALDOS_MOCK.map(e => e.sku)).size,
    },
    alertasEstoque,

    // Fiscal
    fiscal: { faturado30d, impostos30d, emitidas30d: nfs30d.length, taxaEmissao, nfsPendentes },

    // Caixa
    caixa,

    // Clientes (static — mock sem endpoint de contagem dinâmica)
    clientes: { total: 48, ativos: 41, novosEsteMes: 6, ticketMedioCliente: 5932 },
  });
}
