import { NextRequest, NextResponse } from 'next/server';
import { PEDIDOS_MOCK } from '../../pedidos/_mock-data';
import { CLIENTES_MOCK } from '../../clientes/_mock-data';
import { SALDOS_MOCK } from '../../estoque/_mock-data';
import { getNotasFiscais } from '../../notas-fiscais/_mock-data';
// Importa para garantir que __produtosMock seja inicializado no globalThis
import { PRODUTOS_MOCK } from '../../produtos/_mock-data';
import { LANCAMENTOS_MOCK } from '../../lancamentos/_mock-data';
import { COMPRAS_MOCK } from '../../compras/_mock-data';
import { FORNECEDORES_MOCK } from '../../fornecedores/_mock-data';
import { MARKETPLACES_MOCK, ANUNCIOS_MOCK, PERGUNTAS_MOCK } from '../../marketplaces/_mock-data';
import { TITULOS_COBRANCA_MOCK, ACORDOS_MOCK as ACORDOS_COB_MOCK, calcularScoreIA } from '../../cobranca/_mock-data';

const fmt    = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtN   = (v: number) => v.toLocaleString('pt-BR');
const fmtPct = (v: number) => `${v.toFixed(1)}%`;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

interface ChatResponse {
  resposta: string;
  tipo: 'texto' | 'tabela' | 'alerta' | 'sucesso' | 'relatorio' | 'previsao';
  dados?: unknown;
  sugestoes: Array<{ label: string; value: string }>;
  acoes?: Array<{ label: string; href: string; cor?: string }>;
  processadoEm: number;
}

// ─── Dados consolidados (calculados fresh em cada request) ───────────────────
function getDados() {
  const now   = Date.now();
  const ms30d = 30 * 86400000;
  const ms7d  =  7 * 86400000;

  const produtos  = PRODUTOS_MOCK;              // Garantido inicializado
  const pedidos   = PEDIDOS_MOCK;
  const clientes  = CLIENTES_MOCK as any[];
  const saldos    = SALDOS_MOCK;
  const nfs       = getNotasFiscais();

  // Filtra pedidos por janela de tempo
  const pedidos30d = pedidos.filter(p => now - new Date(p.criadoEm).getTime() < ms30d);
  const pedidos7d  = pedidos.filter(p => now - new Date(p.criadoEm).getTime() < ms7d);
  const pedidosHoje = pedidos.filter(p => now - new Date(p.criadoEm).getTime() < 86400000);

  const pagos30d   = pedidos30d.filter(p => p.statusPagamento === 'PAGO');
  const receita30d = pagos30d.reduce((s, p) => s + p.valor, 0);
  const receita7d  = pedidos7d.filter(p => p.statusPagamento === 'PAGO').reduce((s, p) => s + p.valor, 0);
  const receitaHoje = pedidosHoje.filter(p => p.statusPagamento === 'PAGO').reduce((s, p) => s + p.valor, 0);
  const ticketMedio = pagos30d.length ? receita30d / pagos30d.length : 0;

  // ── Top produtos: agrega por (produtoId ou nome+sku) ──────────────────────
  // Usa nome+sku como chave fallback para IDs diferentes (pedidos vs catálogo)
  const receitaProd: Record<string, {
    id: string; nome: string; sku: string; qtd: number; receita: number;
  }> = {};

  for (const ped of pedidos30d) {
    for (const item of (ped.itensList ?? [])) {
      const chave = item.sku || item.produtoId; // normaliza por SKU sempre que possível
      if (!receitaProd[chave]) {
        receitaProd[chave] = {
          id: item.produtoId, nome: item.produto, sku: item.sku, qtd: 0, receita: 0,
        };
      }
      receitaProd[chave].qtd     += item.quantidade;
      receitaProd[chave].receita += item.subtotal;
    }
  }
  const topProdutos = Object.values(receitaProd).sort((a, b) => b.receita - a.receita);

  // ── Enriquece topProdutos com dados do catálogo ───────────────────────────
  const topProdutosRich = topProdutos.map(tp => {
    const cat = produtos.find(p => p.sku === tp.sku || p.nome === tp.nome);
    return {
      ...tp,
      preco:       cat?.preco,
      margem:      cat?.margemLucro,
      estoque:     cat?.estoque,
      estoqueMin:  cat?.estoqueMinimo,
    };
  });

  // ── Top clientes ──────────────────────────────────────────────────────────
  const topClientes = [...clientes]
    .filter((c: any) => c.totalCompras > 0)
    .sort((a: any, b: any) => b.totalCompras - a.totalCompras);

  // ── Estoque ───────────────────────────────────────────────────────────────
  const semEstoque   = saldos.filter(s => s.status === 'SEM_ESTOQUE');
  const estoqueBaixo = saldos.filter(s => s.status === 'BAIXO' || s.status === 'CRITICO');
  const valorEstoque = saldos.reduce((s, e) => s + e.fisico * e.custo, 0);

  // ── Fiscal ────────────────────────────────────────────────────────────────
  const nfs30d      = nfs.filter(n => n.status === 'EMITIDA' && now - new Date(n.dataEmissao).getTime() < ms30d);
  const impostos30d = nfs30d.reduce((s, n) => s + n.valorICMS + n.valorPIS + n.valorCOFINS, 0);

  // ── Financeiro ────────────────────────────────────────────────────────────
  const today       = new Date().toISOString().slice(0, 10);
  const lancamentos = LANCAMENTOS_MOCK;
  // Mark PENDENTE with overdue vencimento as ATRASADO for analysis
  const lancamentosVivos = lancamentos.map(l =>
    l.status === 'PENDENTE' && l.dataVencimento < today ? { ...l, status: 'ATRASADO' as const } : l
  );
  const mesAtual        = new Date().getMonth() + 1;
  const anoAtual        = new Date().getFullYear();
  const mesStr          = `${anoAtual}-${String(mesAtual).padStart(2, '0')}`;
  const lancMes         = lancamentosVivos.filter(l => l.dataVencimento.startsWith(mesStr));
  const receitasMes     = lancMes.filter(l => l.tipo === 'RECEITA' && l.status === 'PAGO').reduce((s, l) => s + l.valor, 0);
  const despesasMes     = lancMes.filter(l => l.tipo === 'DESPESA' && l.status === 'PAGO').reduce((s, l) => s + l.valor, 0);
  const contasAtrasadas = lancamentosVivos.filter(l => l.status === 'ATRASADO');
  const aPagar          = lancamentosVivos.filter(l => l.tipo === 'DESPESA' && ['PENDENTE','ATRASADO'].includes(l.status));
  const aReceber        = lancamentosVivos.filter(l => l.tipo === 'RECEITA' && ['PENDENTE','ATRASADO'].includes(l.status));
  const valorAtrasado   = contasAtrasadas.reduce((s, l) => s + l.valor, 0);
  const totalAPagar     = aPagar.reduce((s, l) => s + l.valor, 0);
  const totalAReceber   = aReceber.reduce((s, l) => s + l.valor, 0);
  const saldoContas     = (globalThis as any).__contasBancariasMock
    ? (globalThis as any).__contasBancariasMock.reduce((s: number, c: any) => s + c.saldoAtual, 0)
    : 80700; // fallback
  const topDespesas     = Object.values(
    lancamentosVivos.filter(l => l.tipo === 'DESPESA' && l.status === 'PAGO')
      .reduce((acc, l) => {
        const k = l.categoria;
        if (!acc[k]) acc[k] = { categoria: k, total: 0 };
        acc[k].total += l.valor;
        return acc;
      }, {} as Record<string, { categoria: string; total: number }>)
  ).sort((a: any, b: any) => b.total - a.total).slice(0, 5) as Array<{ categoria: string; total: number }>;

  // ── Compras ───────────────────────────────────────────────────────────────
  const compras         = COMPRAS_MOCK;
  const fornecedores    = FORNECEDORES_MOCK;
  const compras30d      = compras.filter(c => now - new Date(c.criadoEm).getTime() < ms30d);
  const comprasPendentes = compras.filter(c => ['PENDENTE','APROVADO','ENVIADO'].includes(c.status));
  const gastoCompras30d  = compras30d.reduce((s, c) => s + c.valorTotal, 0);

  // ── Cobrança ──────────────────────────────────────────────────────────────
  const titulosAtivos   = TITULOS_COBRANCA_MOCK.filter(t => !['PAGO','PERDIDO'].includes(t.status));
  const cobTotalVencido = titulosAtivos.reduce((s, t) => s + t.valor, 0);
  const cobCriticos     = titulosAtivos.filter(t => t.prioridade === 'CRITICA');
  const cobAcordosAtiv  = ACORDOS_COB_MOCK.filter(a => a.status === 'ATIVO').length;
  const cobPagos        = TITULOS_COBRANCA_MOCK.filter(t => t.status === 'PAGO').length;
  const cobPerdidos     = TITULOS_COBRANCA_MOCK.filter(t => t.status === 'PERDIDO').length;
  const cobTaxaRec      = (cobPagos + cobPerdidos) > 0 ? Math.round(cobPagos / (cobPagos + cobPerdidos) * 100) : 0;
  const cobTopCrit      = [...titulosAtivos].map(t => ({...t, scoreIA: calcularScoreIA(t)})).sort((a,b) => b.scoreIA - a.scoreIA).slice(0, 5);

  // ── Marketplaces ──────────────────────────────────────────────────────────
  const marketplaces       = MARKETPLACES_MOCK;
  const anuncios           = ANUNCIOS_MOCK;
  const perguntas          = PERGUNTAS_MOCK;
  const mkpConectados      = marketplaces.filter(m => m.status === 'CONECTADO');
  const mkpReceitaMes      = marketplaces.reduce((s, m) => s + m.receitaMes, 0);
  const mkpReceitaLiquida  = marketplaces.reduce((s, m) => s + m.receitaLiquidaMes, 0);
  const mkpPedidosMes      = marketplaces.reduce((s, m) => s + m.pedidosMes, 0);
  const mkpPedidosHoje     = marketplaces.reduce((s, m) => s + m.pedidosHoje, 0);
  const perguntasPendentes = perguntas.filter(p => p.status === 'PENDENTE');
  const perguntasUrgentes  = perguntasPendentes.filter(p => p.prioridade === 'URGENTE');
  const anunciosAtivos     = anuncios.filter(a => a.status === 'ATIVO');
  const anunciosSemEstoque = anuncios.filter(a => a.status === 'SEM_ESTOQUE');
  const topAnuncios        = [...anuncios].sort((a, b) => b.receita30d - a.receita30d).slice(0, 5);
  const mkpDominante       = [...marketplaces].sort((a, b) => b.receitaMes - a.receitaMes)[0];

  // ── Por canal (30d) ───────────────────────────────────────────────────────
  const CANAIS = ['BALCAO','INTERNA','SHOPIFY','MERCADO_LIVRE','SHOPEE','AMAZON','OUTROS'];
  const porCanal = CANAIS
    .map(c => ({
      canal: c,
      qtd:   pedidos30d.filter(p => p.canal === c).length,
      valor: pedidos30d.filter(p => p.canal === c).reduce((s, p) => s + p.valor, 0),
    }))
    .filter(c => c.qtd > 0)
    .sort((a, b) => b.valor - a.valor);

  // ── Por status ────────────────────────────────────────────────────────────
  const pedPendentes = pedidos.filter(p => p.status === 'PENDENTE');
  const pedEmAberto  = pedidos.filter(p => !['CANCELADO','DEVOLVIDO','ENTREGUE'].includes(p.status));

  return {
    produtos, pedidos, pedidos30d, pedidos7d, pedidosHoje, clientes, saldos, nfs,
    receita30d, receita7d, receitaHoje, ticketMedio, pagos30d,
    semEstoque, estoqueBaixo, valorEstoque,
    nfs30d, impostos30d,
    topProdutos: topProdutosRich, topClientes, porCanal,
    pedPendentes, pedEmAberto, now,
    // Financeiro
    lancamentosVivos, receitasMes, despesasMes, contasAtrasadas, aPagar, aReceber,
    valorAtrasado, totalAPagar, totalAReceber, saldoContas, topDespesas,
    // Compras
    compras, compras30d, comprasPendentes, gastoCompras30d, fornecedores,
    // Cobrança
    titulosAtivos, cobTotalVencido, cobCriticos, cobAcordosAtiv, cobTaxaRec, cobTopCrit,
    // Marketplaces
    marketplaces, anuncios, perguntas, mkpConectados, mkpReceitaMes, mkpReceitaLiquida,
    mkpPedidosMes, mkpPedidosHoje, perguntasPendentes, perguntasUrgentes,
    anunciosAtivos, anunciosSemEstoque, topAnuncios, mkpDominante,
  };
}

// ─── Detecção de intenção ────────────────────────────────────────────────────
function detectar(msg: string, ...termos: string[]) {
  const l = msg.toLowerCase();
  return termos.some(t => l.includes(t));
}

// ─── Gerador de resposta ─────────────────────────────────────────────────────
function gerarResposta(msg: string, _hist: ChatMessage[]): ChatResponse {
  const d = getDados();

  // ── Saudações ─────────────────────────────────────────────────────────────
  if (detectar(msg, 'olá', 'oi ', 'oi!', 'bom dia', 'boa tarde', 'boa noite', 'tudo bem', 'e aí', 'hello', 'hey')) {
    const h = new Date().getHours();
    const s = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
    return {
      resposta: `${s}! Sou o **iMestreAI**, seu assistente inteligente de negócios. 🤖\n\nTenho acesso em tempo real a todos os dados do seu ERP. Como posso te ajudar hoje?\n\n- 📊 Vendas e receitas\n- 💰 Financeiro (saldo, DRE, fluxo de caixa, contas)\n- 🛒 Compras e fornecedores\n- 📦 Estoque e alertas\n- 👥 Clientes e oportunidades\n- 🧾 Fiscal e compliance\n- 📋 Relatórios sob demanda`,
      tipo: 'texto',
      sugestoes: [
        { label: '📊 Vendas hoje', value: 'Como estão as vendas hoje?' },
        { label: '💰 Saldo em conta', value: 'Qual o saldo atual das contas bancárias?' },
        { label: '🚨 Alertas críticos', value: 'Quais são os alertas críticos?' },
        { label: '📋 Relatório completo', value: 'Gere um relatório executivo completo' },
      ],
      processadoEm: Date.now(),
    };
  }

  // ── Vendas / Receita / Faturamento ────────────────────────────────────────
  if (detectar(msg, 'venda', 'receita', 'faturamento', 'faturou', 'vendeu', 'hoje', 'semana', 'este mês', 'este mes', 'mês passado')) {
    const porCanalLines = d.porCanal.map(c =>
      `| ${c.canal.replace('_', ' ')} | ${fmtN(c.qtd)} | ${fmt(c.valor)} |`
    ).join('\n');

    return {
      resposta: `## 📊 Painel de Vendas\n\n| Período | Pedidos | Receita |\n|---|---|---|\n| Hoje | ${d.pedidosHoje.length} | ${fmt(d.receitaHoje)} |\n| 7 dias | ${d.pedidos7d.length} | ${fmt(d.receita7d)} |\n| 30 dias | ${d.pedidos30d.length} | ${fmt(d.receita30d)} |\n\n**Ticket médio (30d):** ${fmt(d.ticketMedio)}\n\n### Receita por Canal (30 dias)\n| Canal | Pedidos | Total |\n|---|---|---|\n${porCanalLines || '| — | — | — |'}`,
      tipo: 'relatorio',
      dados: { receita30d: d.receita30d, receita7d: d.receita7d, receitaHoje: d.receitaHoje, porCanal: d.porCanal },
      sugestoes: [
        { label: '🏆 Top produtos', value: 'Quais os produtos mais vendidos este mês?' },
        { label: '👥 Melhores clientes', value: 'Quais clientes compraram mais?' },
        { label: '📋 Relatório completo', value: 'Gere um relatório executivo completo' },
      ],
      acoes: [{ label: 'Ver pedidos', href: '/dashboard/pedidos', cor: 'blue' }],
      processadoEm: Date.now(),
    };
  }

  // ── Top produtos / mais vendidos ──────────────────────────────────────────
  if (detectar(msg, 'top produto', 'mais vendido', 'melhor produto', 'ranking', 'produto popular', 'maior giro', 'maior faturamento')) {
    const top = d.topProdutos.slice(0, 8);

    if (top.length === 0) {
      return {
        resposta: 'Não há dados de vendas nos últimos 30 dias para calcular o ranking. Confira se há pedidos registrados.',
        tipo: 'alerta',
        sugestoes: [{ label: '📦 Ver estoque', value: 'Qual o status do estoque?' }],
        processadoEm: Date.now(),
      };
    }

    const linhas = top.map((p, i) => {
      const pct = top[0].receita > 0 ? ((p.receita / top[0].receita) * 100).toFixed(0) : '0';
      return `| ${i + 1}° | ${p.nome} | ${fmtN(p.qtd)} un. | ${fmt(p.receita)} | ${pct}% |`;
    }).join('\n');

    const lider = top[0];
    const pctTotal = d.receita30d > 0 ? ((lider.receita / d.receita30d) * 100).toFixed(1) : '0';

    return {
      resposta: `## 🏆 Top Produtos — Últimos 30 Dias\n\n| # | Produto | Qtd Vendida | Receita | vs Líder |\n|---|---|---|---|---|\n${linhas}\n\n> 💡 **"${lider.nome}"** lidera com ${fmt(lider.receita)}, representando **${pctTotal}%** da receita total do período.\n${lider.estoque !== undefined && lider.estoque <= (lider.estoqueMin ?? 5) ? `\n> ⚠️ Estoque baixo (${lider.estoque} un.) — considere repor para não perder vendas.` : ''}`,
      tipo: 'relatorio',
      dados: { topProdutos: top.slice(0, 5), receita30d: d.receita30d },
      sugestoes: [
        { label: '📦 Estoque dos top 3', value: 'Qual o estoque dos produtos mais vendidos?' },
        { label: '👥 Clientes que compraram', value: 'Quais clientes compraram mais?' },
        { label: '💹 Ver margens', value: 'Quais produtos têm maior margem de lucro?' },
      ],
      acoes: [{ label: 'Ver catálogo', href: '/dashboard/produtos', cor: 'blue' }],
      processadoEm: Date.now(),
    };
  }

  // ── Produto específico por nome ───────────────────────────────────────────
  if (detectar(msg, 'iphone', 'samsung', 'galaxy', 'headphone', 'sony', 'notebook', 'dell', 'nike', 'polo', 'ralph', 'mochila', 'samsonite', 'gopro', 'produto')) {
    const palavras = msg.toLowerCase().split(/[\s,]+/).filter(w => w.length > 3);
    const produto = PRODUTOS_MOCK.find(p =>
      palavras.some(w =>
        p.nome.toLowerCase().includes(w) ||
        p.sku.toLowerCase().includes(w) ||
        p.marca?.toLowerCase().includes(w)
      )
    );

    if (!produto) {
      return {
        resposta: `Não encontrei esse produto no catálogo. Tente o nome completo ou o SKU.\n\n**Produtos disponíveis:** ${PRODUTOS_MOCK.slice(0, 5).map(p => p.nome).join(', ')}...`,
        tipo: 'texto',
        sugestoes: [
          { label: '🏆 Top produtos', value: 'Quais os produtos mais vendidos este mês?' },
          { label: '🔍 Ver catálogo', value: 'Liste todos os produtos disponíveis' },
        ],
        processadoEm: Date.now(),
      };
    }

    const saldo = SALDOS_MOCK.find(s => s.sku === produto.sku);
    const vendas30d = d.topProdutos.find(p => p.sku === produto.sku);
    const st = saldo?.status ?? 'DESCONHECIDO';
    const icon = st === 'SEM_ESTOQUE' ? '❌' : st === 'CRITICO' ? '🔴' : st === 'BAIXO' ? '🟡' : '✅';

    return {
      resposta: `## 🛍️ ${produto.nome}\n\n**SKU:** ${produto.sku}\n**Categoria:** ${produto.categoria} · **Marca:** ${produto.marca}\n**Preço venda:** ${fmt(produto.preco)} | **Custo:** ${fmt(produto.precoCusto)}\n**Margem:** ${fmtPct(produto.margemLucro)} | **Status:** ${produto.status}\n\n### 📦 Estoque\n${icon} **${st}** — ${saldo?.disponivel ?? 0} disponíveis (${saldo?.fisico ?? 0} físico · ${saldo?.reservado ?? 0} reservado)\nMínimo: ${saldo?.minimo ?? produto.estoqueMinimo} | Máximo: ${saldo?.maximo ?? '—'}\n\n### 📊 Vendas (30 dias)\n- Unidades vendidas: **${vendas30d?.qtd ?? 0}**\n- Receita: **${fmt(vendas30d?.receita ?? 0)}**\n- Giro mensal: ${saldo?.giro30d ?? 0} un./mês\n- Histórico total: ${produto.vendasTotal} pedidos · ${fmt(produto.receitaTotal)}`,
      tipo: 'texto',
      dados: { produto: { id: produto.id, nome: produto.nome, preco: produto.preco, margem: produto.margemLucro }, saldo },
      sugestoes: [
        { label: '📦 Ver estoque completo', value: 'Qual o status geral do estoque?' },
        { label: '🏆 Comparar com outros', value: 'Quais os produtos mais vendidos este mês?' },
      ],
      acoes: [
        { label: 'Ver produto', href: `/dashboard/produtos/${produto.id}`, cor: 'blue' },
        ...(st === 'SEM_ESTOQUE' || st === 'CRITICO' ? [{ label: 'Entrada de estoque', href: '/dashboard/estoque/entrada', cor: 'green' }] : []),
      ],
      processadoEm: Date.now(),
    };
  }

  // ── Listar todos os produtos ──────────────────────────────────────────────
  if (detectar(msg, 'liste', 'listar', 'todos os produto', 'catálogo', 'catalogo', 'quais produto')) {
    const ativos = PRODUTOS_MOCK.filter(p => p.status === 'ATIVO');
    const linhas = ativos.slice(0, 8).map((p, i) =>
      `| ${i+1} | ${p.nome} | ${p.sku} | ${fmt(p.preco)} | ${p.estoque} un. |`
    ).join('\n');
    return {
      resposta: `## 📦 Catálogo de Produtos (${PRODUTOS_MOCK.length} total · ${ativos.length} ativos)\n\n| # | Produto | SKU | Preço | Estoque |\n|---|---|---|---|---|\n${linhas}\n${ativos.length > 8 ? `\n*... e mais ${ativos.length - 8} produtos.*` : ''}`,
      tipo: 'relatorio',
      sugestoes: [
        { label: '🏆 Mais vendidos', value: 'Quais os produtos mais vendidos este mês?' },
        { label: '📦 Status estoque', value: 'Qual o status do estoque?' },
      ],
      acoes: [{ label: 'Ver catálogo completo', href: '/dashboard/produtos', cor: 'blue' }],
      processadoEm: Date.now(),
    };
  }

  // ── Estoque ───────────────────────────────────────────────────────────────
  if (detectar(msg, 'estoque', 'produto zerado', 'sem estoque', 'faltando', 'reposição', 'repor', 'inventário')) {
    const zerados = d.semEstoque.map(s => `- ❌ **${s.produto}** (${s.sku}) — zerado em ${s.deposito}`).join('\n');
    const baixos  = d.estoqueBaixo.slice(0, 5).map(s =>
      `- ⚠️ **${s.produto}** — ${s.disponivel} un. (mín: ${s.minimo}) · ${s.deposito}`
    ).join('\n');

    return {
      resposta: `## 📦 Status do Estoque\n\n**Valor total em estoque:** ${fmt(d.valorEstoque)}\n**SKUs ativos:** ${new Set(d.saldos.map(s => s.sku)).size}\n**Produtos zerados:** ${d.semEstoque.length}\n**Estoque baixo/crítico:** ${d.estoqueBaixo.length}\n\n${d.semEstoque.length > 0 ? `### 🚨 Sem Estoque\n${zerados}\n\n` : '✅ Nenhum produto zerado!\n\n'}${d.estoqueBaixo.length > 0 ? `### ⚠️ Estoque Baixo / Crítico\n${baixos}\n\n> 💡 Programe compras para os produtos críticos antes de ruptura.` : ''}`,
      tipo: d.semEstoque.length > 0 ? 'alerta' : 'texto',
      dados: { semEstoque: d.semEstoque, estoqueBaixo: d.estoqueBaixo, valorEstoque: d.valorEstoque },
      sugestoes: [
        { label: '📋 Relatório de estoque', value: 'Gere um relatório completo de estoque' },
        { label: '📈 Maior giro', value: 'Quais produtos têm maior giro de estoque?' },
      ],
      acoes: [
        { label: 'Ver estoque', href: '/dashboard/estoque', cor: 'blue' },
        { label: 'Registrar entrada', href: '/dashboard/estoque/entrada', cor: 'green' },
      ],
      processadoEm: Date.now(),
    };
  }

  // ── Giro de estoque ───────────────────────────────────────────────────────
  if (detectar(msg, 'giro', 'rotatividade', 'movimentação', 'movimentacao')) {
    const comGiro = SALDOS_MOCK
      .filter(s => s.giro30d > 0)
      .sort((a, b) => b.giro30d - a.giro30d)
      .slice(0, 8);
    const linhas = comGiro.map((s, i) =>
      `| ${i+1}° | ${s.produto} | ${fmtN(s.giro30d)} un./mês | ${s.disponivel} disponível |`
    ).join('\n');
    return {
      resposta: `## 🔄 Giro de Estoque — Últimos 30 Dias\n\n| # | Produto | Giro | Disponível |\n|---|---|---|---|\n${linhas}\n\n> 💡 Produtos com alto giro precisam de reposição frequente. Automatize pedidos de compra para evitar rupturas.`,
      tipo: 'relatorio',
      sugestoes: [{ label: '🏆 Top produtos por receita', value: 'Quais os produtos mais vendidos este mês?' }],
      processadoEm: Date.now(),
    };
  }

  // ── Clientes ──────────────────────────────────────────────────────────────
  if (detectar(msg, 'cliente', 'comprador', 'consumidor', 'quem comprou', 'melhor cliente', 'top cliente')) {
    const top5 = d.topClientes.slice(0, 5) as any[];
    const linhas = top5.map((c: any, i: number) =>
      `| ${i+1}° | ${c.nome} | ${c.tipo} | ${fmtN(c.quantidadePedidos)} | ${fmt(c.totalCompras)} |`
    ).join('\n');
    const ativos = d.clientes.filter((c: any) => c.status === 'ATIVO').length;
    const receitaTop3 = top5.slice(0, 3).reduce((s: number, c: any) => s + c.totalCompras, 0);
    const pctTop3 = d.receita30d > 0 ? (receitaTop3 / d.receita30d * 100).toFixed(1) : '—';

    return {
      resposta: `## 👥 Análise de Clientes\n\n**Total:** ${d.clientes.length} clientes · **Ativos:** ${ativos}\n\n### 🏆 Top 5 por Volume de Compras\n| # | Cliente | Tipo | Pedidos | Total Gasto |\n|---|---|---|---|---|\n${linhas}\n\n> 💡 Os 3 maiores clientes representam ~${pctTop3}% da receita. Considere um programa de fidelidade VIP.`,
      tipo: 'relatorio',
      dados: { topClientes: top5, totalAtivos: ativos },
      sugestoes: [
        { label: '⚠️ Clientes inativos', value: 'Quais clientes estão inativos?' },
        { label: '📊 Ver vendas', value: 'Como estão as vendas hoje?' },
      ],
      acoes: [{ label: 'Ver clientes', href: '/dashboard/clientes', cor: 'blue' }],
      processadoEm: Date.now(),
    };
  }

  // ── Clientes inativos ─────────────────────────────────────────────────────
  if (detectar(msg, 'inativo', 'sem comprar', 'não compra', 'sumiu', 'perdido', 'reativar')) {
    const ms60d = 60 * 86400000;
    const inativos = (d.clientes as any[]).filter((c: any) =>
      c.status === 'INATIVO' ||
      !c.ultimaCompra ||
      (d.now - new Date(c.ultimaCompra).getTime()) > ms60d
    );
    const linhas = inativos.slice(0, 5).map((c: any) =>
      `- **${c.nome}** — última compra: ${c.ultimaCompra ? new Date(c.ultimaCompra).toLocaleDateString('pt-BR') : 'nunca registrada'}`
    ).join('\n');
    return {
      resposta: `## ⚠️ Clientes Inativos (> 60 dias)\n\n**${inativos.length} clientes** sem compra recente:\n\n${linhas}\n\n> 💡 **Ação sugerida:** Crie uma campanha de reativação com 10-15% de desconto exclusivo e envie por e-mail.`,
      tipo: 'alerta',
      sugestoes: [{ label: '👥 Ver todos os clientes', value: 'Quais clientes compraram mais?' }],
      acoes: [{ label: 'Ver clientes', href: '/dashboard/clientes', cor: 'blue' }],
      processadoEm: Date.now(),
    };
  }

  // ── Pedidos urgentes / pendentes ──────────────────────────────────────────
  if (detectar(msg, 'pendente', 'urgente', 'atrasado', 'em aberto', 'sem processar', 'esperando')) {
    const urgentes = d.pedPendentes
      .map(p => ({
        ...p,
        horas: Math.floor((d.now - new Date(p.criadoEm).getTime()) / 3600000),
      }))
      .sort((a, b) => b.horas - a.horas);

    const linhas = urgentes.slice(0, 5).map(p =>
      `- **${p.numero}** — ${p.cliente} — ${fmt(p.valor)} — ${p.horas}h aguardando (${p.canal})`
    ).join('\n');

    return {
      resposta: `## 🚨 Pedidos Pendentes\n\n**Em aberto:** ${d.pedEmAberto.length} pedidos\n**PENDENTE:** ${urgentes.length} pedidos\n\n${urgentes.length > 0 ? `### Mais Urgentes\n${linhas}\n\n> ⚡ Pedidos acima de 24h podem ser cancelados automaticamente pelo marketplace.` : '✅ Nenhum pedido pendente!'}`,
      tipo: urgentes.length > 0 ? 'alerta' : 'sucesso',
      dados: { urgentes: urgentes.slice(0, 5), totalAberto: d.pedEmAberto.length },
      sugestoes: [
        { label: '📊 Todas as vendas', value: 'Como estão as vendas hoje?' },
        { label: '📋 Relatório completo', value: 'Gere um relatório executivo completo' },
      ],
      acoes: [{ label: 'Ver pedidos pendentes', href: '/dashboard/pedidos?status=PENDENTE', cor: 'amber' }],
      processadoEm: Date.now(),
    };
  }

  // ── Fiscal ────────────────────────────────────────────────────────────────
  if (detectar(msg, 'nota fiscal', 'nf-e', 'nfc-e', 'fiscal', 'imposto', 'icms', 'pis', 'cofins', 'sefaz', 'tributar', 'tributo')) {
    const nfsPend  = d.nfs.filter(n => ['RASCUNHO','VALIDADA'].includes(n.status));
    const nfsRej   = d.nfs.filter(n => n.status === 'REJEITADA');
    const totalNR  = d.nfs.filter(n => n.status !== 'RASCUNHO').length;
    const taxaE    = totalNR > 0 ? (d.nfs30d.length / totalNR * 100) : 100;
    const cargaTrib = d.receita30d > 0 ? (d.impostos30d / d.receita30d * 100) : 0;

    return {
      resposta: `## 🧾 Painel Fiscal\n\n| Métrica | Valor |\n|---|---|\n| Faturado NF 30d | ${fmt(d.nfs30d.reduce((s, n) => s + n.valorTotal, 0))} |\n| Impostos 30d | ${fmt(d.impostos30d)} |\n| Carga tributária | ${fmtPct(cargaTrib)} |\n| NFs emitidas 30d | ${d.nfs30d.length} |\n| Taxa de emissão | ${fmtPct(taxaE)} |\n\n${nfsPend.length > 0 ? `### ⚠️ NFs Pendentes de Emissão: ${nfsPend.length}\n${nfsPend.slice(0,3).map(n => `- ${n.numero} — ${n.destinatario} — ${fmt(n.valorTotal)}`).join('\n')}\n\n` : ''}${nfsRej.length > 0 ? `### 🚨 NFs Rejeitadas: ${nfsRej.length}\n${nfsRej.map(n => `- ${n.numero} — ${n.motivoRejeicao ?? 'Verificar'}`).join('\n')}` : '✅ Nenhuma NF rejeitada'}`,
      tipo: nfsPend.length > 0 || nfsRej.length > 0 ? 'alerta' : 'texto',
      sugestoes: [
        { label: '📊 Ver vendas', value: 'Como estão as vendas hoje?' },
        { label: '➕ Emitir nota', value: 'Como emitir uma nota fiscal?' },
      ],
      acoes: [
        { label: 'Módulo fiscal', href: '/dashboard/fiscal', cor: 'blue' },
        ...(nfsPend.length > 0 ? [{ label: 'Emitir pendentes', href: '/dashboard/fiscal?status=VALIDADA', cor: 'green' }] : []),
      ],
      processadoEm: Date.now(),
    };
  }

  // ── Como emitir NF ────────────────────────────────────────────────────────
  if (detectar(msg, 'como emitir', 'emitir nota', 'criar nota', 'nova nota', 'gerar nf', 'emissão')) {
    return {
      resposta: `## 🧾 Como Emitir uma Nota Fiscal\n\n**Passo a passo:**\n\n1. Acesse **Fiscal → Nova NF-e**\n2. Selecione o **tipo**: NF-e (B2B) ou NFC-e (consumidor)\n3. Busque o **destinatário** pelo nome, CNPJ ou CPF\n4. Adicione os **itens** — NCM, CFOP e alíquotas são preenchidos automaticamente\n5. Revise os totais e clique em **Validar** → **Emitir**\n\n> 💡 Se o pedido já está registrado, clique em **"Emitir NF-e"** diretamente na página do pedido!`,
      tipo: 'texto',
      sugestoes: [{ label: '📋 Ver notas emitidas', value: 'Como está o módulo fiscal?' }],
      acoes: [{ label: 'Nova NF-e', href: '/dashboard/fiscal/nova', cor: 'green' }],
      processadoEm: Date.now(),
    };
  }

  // ── Alertas críticos ──────────────────────────────────────────────────────
  if (detectar(msg, 'alerta', 'crítico', 'critico', 'problema', 'atenção', 'atencao', 'o que está', 'o que esta', 'situação', 'situacao')) {
    const alertas: string[] = [];
    if (d.semEstoque.length > 0)
      alertas.push(`🔴 **${d.semEstoque.length} produto(s) zerado(s)** — perda de vendas iminente`);
    if (d.estoqueBaixo.length > 2)
      alertas.push(`🟡 **${d.estoqueBaixo.length} produto(s) com estoque baixo/crítico** — risco de ruptura`);
    if (d.pedPendentes.length > 0)
      alertas.push(`⏰ **${d.pedPendentes.length} pedido(s) PENDENTE** sem confirmação`);
    const nfsRej = d.nfs.filter(n => n.status === 'REJEITADA');
    if (nfsRej.length > 0)
      alertas.push(`🧾 **${nfsRej.length} NF(s) rejeitada(s)** pela SEFAZ`);
    const nfsPend = d.nfs.filter(n => ['RASCUNHO','VALIDADA'].includes(n.status));
    if (nfsPend.length > 0)
      alertas.push(`📄 **${nfsPend.length} NF(s)** aguardando emissão`);
    if (d.contasAtrasadas.length > 0)
      alertas.push(`💸 **${d.contasAtrasadas.length} lançamento(s) ATRASADO(s)** — ${fmt(d.valorAtrasado)} em atraso`);
    if (d.comprasPendentes.length > 0)
      alertas.push(`🛒 **${d.comprasPendentes.length} pedido(s) de compra** em aberto`);
    if (d.perguntasUrgentes.length > 0)
      alertas.push(`💬 **${d.perguntasUrgentes.length} pergunta(s) URGENTE** nos marketplaces sem resposta`);
    if (d.anunciosSemEstoque.length > 0)
      alertas.push(`🏪 **${d.anunciosSemEstoque.length} anúncio(s) sem estoque** — perdendo vendas online`);
    if (d.cobCriticos.length > 0)
      alertas.push(`💳 **${d.cobCriticos.length} título(s) CRÍTICO(s)** — ${fmt(d.cobTotalVencido)} em atraso`);

    return {
      resposta: alertas.length > 0
        ? `## 🚨 Alertas Críticos — ${new Date().toLocaleDateString('pt-BR')}\n\nEncontrei **${alertas.length} alerta(s)** que precisam de atenção:\n\n${alertas.join('\n')}\n\n> Resolva na ordem: produtos zerados → pedidos urgentes → NFs rejeitadas.`
        : `## ✅ Tudo em Ordem!\n\nNenhum alerta crítico no momento:\n- Estoque: saudável\n- Pedidos: todos processados\n- Fiscal: compliance ok\n\nSeu negócio está funcionando bem!`,
      tipo: alertas.length > 0 ? 'alerta' : 'sucesso',
      sugestoes: [
        { label: '📦 Ver estoque', value: 'Qual o status do estoque?' },
        { label: '📊 Ver vendas', value: 'Como estão as vendas hoje?' },
      ],
      acoes: alertas.length > 0 ? [
        { label: 'Ver estoque', href: '/dashboard/estoque', cor: 'red' },
        { label: 'Ver pedidos', href: '/dashboard/pedidos', cor: 'amber' },
      ] : [],
      processadoEm: Date.now(),
    };
  }

  // ── Margem de lucro / rentabilidade ──────────────────────────────────────
  if (detectar(msg, 'margem', 'lucro', 'lucrativo', 'rentabilidade', 'rentavel', 'rentável')) {
    const comMargem = PRODUTOS_MOCK
      .filter(p => p.status === 'ATIVO' && p.margemLucro > 0)
      .sort((a, b) => b.margemLucro - a.margemLucro);
    const top5 = comMargem.slice(0, 5);
    const linhas = top5.map((p, i) =>
      `| ${i+1}° | ${p.nome} | ${fmtPct(p.margemLucro)} | ${fmt(p.preco)} | ${fmt(p.precoCusto)} |`
    ).join('\n');
    const media = comMargem.reduce((s, p) => s + p.margemLucro, 0) / Math.max(comMargem.length, 1);

    return {
      resposta: `## 💹 Análise de Margem de Lucro\n\n**Margem média do catálogo:** ${fmtPct(media)}\n**Produtos ativos analisados:** ${comMargem.length}\n\n### Top 5 Mais Lucrativos\n| # | Produto | Margem | Preço Venda | Custo |\n|---|---|---|---|---|\n${linhas}\n\n> 💡 Produtos com margem > 50% são altamente rentáveis. Priorize-os em campanhas de marketing.`,
      tipo: 'relatorio',
      sugestoes: [
        { label: '🏆 Mais vendidos', value: 'Quais os produtos mais vendidos este mês?' },
        { label: '📊 Ver receita', value: 'Como estão as vendas hoje?' },
      ],
      processadoEm: Date.now(),
    };
  }

  // ── Projeção ──────────────────────────────────────────────────────────────
  if (detectar(msg, 'projeção', 'projecao', 'previsão', 'previsao', 'estimar', 'vai faturar', 'próximo mês', 'proximo mes')) {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).getTime();
    const receitaMes = d.pedidos
      .filter(p => new Date(p.criadoEm).getTime() >= inicioMes && p.statusPagamento === 'PAGO')
      .reduce((s, p) => s + p.valor, 0);
    const mediaDiaria = diaAtual > 0 ? receitaMes / diaAtual : 0;
    const projecao = mediaDiaria * diasNoMes;
    const crescVsMes = d.receita30d > 0 ? ((projecao - d.receita30d) / d.receita30d) * 100 : 0;

    return {
      resposta: `## 🔮 Projeção de Receita — ${hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}\n\n**Dia atual:** ${diaAtual}/${diasNoMes}\n**Realizado no mês:** ${fmt(receitaMes)}\n**Média diária:** ${fmt(mediaDiaria)}\n\n### 📈 Projeção: **${fmt(projecao)}**\n\n${crescVsMes > 0 ? `📈 Tendência **+${fmtPct(crescVsMes)}** em relação ao mês anterior` : `📉 Tendência **${fmtPct(crescVsMes)}** em relação ao mês anterior`}\n\n> Para crescimento de 20%: seria necessário chegar a ${fmt(d.receita30d * 1.2)}`,
      tipo: 'previsao',
      sugestoes: [
        { label: '📊 Ver vendas atuais', value: 'Como estão as vendas hoje?' },
        { label: '🏆 Top produtos', value: 'Quais os produtos mais vendidos este mês?' },
      ],
      processadoEm: Date.now(),
    };
  }

  // ── Relatório executivo completo ──────────────────────────────────────────
  if (detectar(msg, 'relatório', 'relatorio', 'resumo completo', 'visão geral', 'visao geral', 'overview', 'completo', 'executivo')) {
    const top3Prod = d.topProdutos.slice(0, 3);
    const top3Cli  = (d.topClientes as any[]).slice(0, 3);
    const nfsPend  = d.nfs.filter(n => ['RASCUNHO','VALIDADA'].includes(n.status)).length;
    const cargaTrib = d.receita30d > 0 ? (d.impostos30d / d.receita30d * 100) : 0;
    const alertasCrit = d.semEstoque.length + d.pedPendentes.length;

    const prodLines = top3Prod.length > 0
      ? top3Prod.map((p, i) => `${i+1}. ${p.nome} — ${fmt(p.receita)} (${p.qtd} un.)`).join('\n')
      : 'Sem dados suficientes';
    const cliLines = top3Cli.length > 0
      ? top3Cli.map((c: any, i: number) => `${i+1}. ${c.nome} — ${fmt(c.totalCompras)}`).join('\n')
      : 'Sem dados suficientes';

    return {
      resposta: `# 📋 Relatório Executivo\n**${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}**\n\n---\n\n## 💰 Vendas\n| Período | Pedidos | Receita |\n|---|---|---|\n| Hoje | ${d.pedidosHoje.length} | ${fmt(d.receitaHoje)} |\n| 7 dias | ${d.pedidos7d.length} | ${fmt(d.receita7d)} |\n| 30 dias | ${d.pedidos30d.length} | ${fmt(d.receita30d)} |\n\n**Ticket médio:** ${fmt(d.ticketMedio)} · **Em aberto:** ${d.pedEmAberto.length} pedidos\n\n## 🏦 Financeiro\n- Saldo em contas: **${fmt(d.saldoContas)}**\n- Receitas do mês: ${fmt(d.receitasMes)} · Despesas: ${fmt(d.despesasMes)} · **Resultado: ${fmt(d.receitasMes - d.despesasMes)}**\n- A receber: ${fmt(d.totalAReceber)} · A pagar: ${fmt(d.totalAPagar)}\n${d.contasAtrasadas.length > 0 ? `- 🔴 ${d.contasAtrasadas.length} lançamento(s) em atraso (${fmt(d.valorAtrasado)})` : ''}\n\n## 📦 Estoque\n- Valor total: ${fmt(d.valorEstoque)}\n- SKUs ativos: ${new Set(d.saldos.map(s => s.sku)).size}\n- Zerados: ${d.semEstoque.length} · Crítico/Baixo: ${d.estoqueBaixo.length}\n\n## 🏆 Top 3 Produtos\n${prodLines}\n\n## 👥 Top 3 Clientes\n${cliLines}\n\n## 🧾 Fiscal\n- Impostos 30d: ${fmt(d.impostos30d)} · Carga: ${fmtPct(cargaTrib)}\n- NFs emitidas 30d: ${d.nfs30d.length} · Pendentes: ${nfsPend}\n\n## ⚠️ Pontos de Atenção\n${alertasCrit + d.contasAtrasadas.length > 0 ? [
        d.semEstoque.length > 0 ? `- 🔴 ${d.semEstoque.length} produto(s) sem estoque` : '',
        d.pedPendentes.length > 0 ? `- ⏰ ${d.pedPendentes.length} pedido(s) aguardando confirmação` : '',
        nfsPend > 0 ? `- 📄 ${nfsPend} NF(s) pendentes de emissão` : '',
        d.contasAtrasadas.length > 0 ? `- 💸 ${d.contasAtrasadas.length} lançamento(s) em atraso (${fmt(d.valorAtrasado)})` : '',
      ].filter(Boolean).join('\n') : '- ✅ Nenhum ponto crítico identificado'}`,
      tipo: 'relatorio',
      dados: { receita30d: d.receita30d, receita7d: d.receita7d, topProdutos: top3Prod, topClientes: top3Cli },
      sugestoes: [
        { label: '📊 Detalhar vendas', value: 'Detalhe as vendas por canal' },
        { label: '🚨 Ver alertas', value: 'Quais são os alertas críticos?' },
      ],
      processadoEm: Date.now(),
    };
  }

  // ── Financeiro: saldo / contas bancárias ─────────────────────────────────
  if (detectar(msg, 'saldo', 'conta bancária', 'conta bancaria', 'banco', 'saldo atual', 'dinheiro disponível', 'quanto tenho')) {
    const contas = (globalThis as any).__contasBancariasMock ?? [];
    const linhas = contas.map((c: any) =>
      `| ${c.nome} | ${c.tipo} | ${fmt(c.saldoAtual)} |`
    ).join('\n');
    return {
      resposta: `## 🏦 Contas Bancárias\n\n**Saldo total:** ${fmt(d.saldoContas)}\n\n| Conta | Tipo | Saldo |\n|---|---|---|\n${linhas || '| — | — | — |'}\n\n### 📊 Situação Financeira do Mês\n- **Receitas recebidas:** ${fmt(d.receitasMes)}\n- **Despesas pagas:** ${fmt(d.despesasMes)}\n- **Resultado:** ${fmt(d.receitasMes - d.despesasMes)}\n\n> 💡 Mantenha pelo menos 3 meses de despesas operacionais em reserva (${fmt(d.despesasMes * 3)}).`,
      tipo: 'relatorio',
      dados: { saldoContas: d.saldoContas, contas },
      sugestoes: [
        { label: '💸 Contas a pagar', value: 'Quais contas vencendo esta semana?' },
        { label: '📈 Fluxo de caixa', value: 'Como está o fluxo de caixa?' },
        { label: '📋 DRE do mês', value: 'Gere o DRE do mês atual' },
      ],
      acoes: [{ label: 'Módulo financeiro', href: '/dashboard/financeiro', cor: 'blue' }],
      processadoEm: Date.now(),
    };
  }

  // ── Financeiro: contas a pagar ────────────────────────────────────────────
  if (detectar(msg, 'conta a pagar', 'contas a pagar', 'vencendo', 'vence hoje', 'pagar esta semana', 'despesa pendente', 'boleto')) {
    const hoje = new Date().toISOString().slice(0, 10);
    const semana = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    const vencem7d  = d.aPagar.filter(l => l.dataVencimento <= semana).sort((a, b) => a.dataVencimento.localeCompare(b.dataVencimento));
    const atrasadas = d.contasAtrasadas.filter(l => l.tipo === 'DESPESA');
    const linhasAt = atrasadas.slice(0, 4).map(l =>
      `| 🔴 ${l.descricao} | ${fmt(l.valor)} | ${new Date(l.dataVencimento).toLocaleDateString('pt-BR')} |`
    ).join('\n');
    const linhasSem = vencem7d.filter(l => l.status !== 'ATRASADO').slice(0, 5).map(l =>
      `| ⏰ ${l.descricao} | ${fmt(l.valor)} | ${new Date(l.dataVencimento).toLocaleDateString('pt-BR')} |`
    ).join('\n');
    return {
      resposta: `## 💸 Contas a Pagar\n\n**Total pendente:** ${fmt(d.totalAPagar)}\n**Atrasadas:** ${atrasadas.length} (${fmt(atrasadas.reduce((s, l) => s + l.valor, 0))})\n\n${atrasadas.length > 0 ? `### 🚨 Em Atraso\n| Descrição | Valor | Vencimento |\n|---|---|---|\n${linhasAt}\n\n` : ''}${vencem7d.filter(l => l.status !== 'ATRASADO').length > 0 ? `### 📅 Vencem nos Próximos 7 Dias\n| Descrição | Valor | Vencimento |\n|---|---|---|\n${linhasSem}\n\n` : ''}> 💡 Priorize pagar as atrasadas para evitar multas e juros.`,
      tipo: atrasadas.length > 0 ? 'alerta' : 'texto',
      dados: { aPagar: d.aPagar.length, atrasadas: atrasadas.length, total: d.totalAPagar },
      sugestoes: [
        { label: '💰 Saldo em conta', value: 'Qual o saldo atual das contas bancárias?' },
        { label: '📈 Fluxo de caixa', value: 'Como está o fluxo de caixa?' },
      ],
      acoes: [{ label: 'Ver contas a pagar', href: '/dashboard/financeiro/contas-a-pagar', cor: 'red' }],
      processadoEm: Date.now(),
    };
  }

  // ── Financeiro: contas a receber ──────────────────────────────────────────
  if (detectar(msg, 'conta a receber', 'contas a receber', 'a receber', 'receita pendente', 'cobrança', 'cobrar')) {
    const atrasadasR = d.contasAtrasadas.filter(l => l.tipo === 'RECEITA');
    const linhas = d.aReceber.slice(0, 6).map(l =>
      `| ${l.status === 'ATRASADO' ? '🔴' : '💚'} ${l.descricao} | ${fmt(l.valor)} | ${new Date(l.dataVencimento).toLocaleDateString('pt-BR')} | ${l.status} |`
    ).join('\n');
    return {
      resposta: `## 💚 Contas a Receber\n\n**Total a receber:** ${fmt(d.totalAReceber)}\n**Recebimentos atrasados:** ${atrasadasR.length} (${fmt(atrasadasR.reduce((s, l) => s + l.valor, 0))})\n\n### Próximos Recebimentos\n| Status | Descrição | Valor | Vencimento | Situação |\n|---|---|---|---|---|\n${linhas || '| — | — | — | — | — |'}\n\n> 💡 ${atrasadasR.length > 0 ? `${atrasadasR.length} recebimento(s) em atraso — entre em contato com os clientes para regularizar.` : 'Todas as cobranças estão em dia!'}`,
      tipo: atrasadasR.length > 0 ? 'alerta' : 'texto',
      dados: { aReceber: d.aReceber.length, total: d.totalAReceber },
      sugestoes: [
        { label: '💸 Contas a pagar', value: 'Quais contas vencendo esta semana?' },
        { label: '📋 DRE do mês', value: 'Gere o DRE do mês atual' },
      ],
      acoes: [{ label: 'Ver contas a receber', href: '/dashboard/financeiro/contas-a-receber', cor: 'green' }],
      processadoEm: Date.now(),
    };
  }

  // ── Financeiro: DRE / resultado ───────────────────────────────────────────
  if (detectar(msg, 'dre', 'demonstrativo', 'resultado', 'lucro líquido', 'lucro liquido', 'receita bruta', 'ebitda', 'resultado do mês')) {
    const mesNome = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const _mesAtual = new Date().getMonth() + 1;
    const _anoAtual = new Date().getFullYear();
    const _mesStr   = `${_anoAtual}-${String(_mesAtual).padStart(2, '0')}`;
    const recBruta      = d.lancamentosVivos.filter(l => l.tipo === 'RECEITA' && l.status === 'PAGO' && l.dataVencimento.startsWith(_mesStr)).reduce((s, l) => s + l.valor, 0);
    const deducoes      = recBruta * 0.08;
    const recLiquida    = recBruta - deducoes;
    const cmv           = recBruta * 0.42;
    const lucroBruto    = recLiquida - cmv;
    const despOp        = d.lancamentosVivos.filter(l => l.tipo === 'DESPESA' && l.status === 'PAGO' && l.dataVencimento.startsWith(_mesStr)).reduce((s, l) => s + l.valor, 0);
    const ebitda        = lucroBruto - despOp;
    const margemEbitda  = recBruta > 0 ? (ebitda / recBruta * 100) : 0;
    const ir            = ebitda > 0 ? ebitda * 0.15 : 0;
    const resultLiq     = ebitda - ir;
    const margemLiq     = recBruta > 0 ? (resultLiq / recBruta * 100) : 0;
    return {
      resposta: `## 📊 DRE — ${mesNome}\n\n| Item | Valor | % Receita |\n|---|---|---|\n| **Receita Bruta** | **${fmt(recBruta)}** | 100% |\n| Deduções (impostos 8%) | (${fmt(deducoes)}) | -8% |\n| **Receita Líquida** | **${fmt(recLiquida)}** | ${fmtPct(recBruta > 0 ? recLiquida/recBruta*100 : 0)} |\n| CMV (42%) | (${fmt(cmv)}) | -42% |\n| **Lucro Bruto** | **${fmt(lucroBruto)}** | ${fmtPct(recBruta > 0 ? lucroBruto/recBruta*100 : 0)} |\n| Despesas Operacionais | (${fmt(despOp)}) | -${fmtPct(recBruta > 0 ? despOp/recBruta*100 : 0)} |\n| **EBITDA** | **${fmt(ebitda)}** | ${fmtPct(margemEbitda)} |\n| IR/CSLL (15%) | (${fmt(ir)}) | — |\n| **Resultado Líquido** | **${fmt(resultLiq)}** | **${fmtPct(margemLiq)}** |\n\n> 💡 ${margemLiq >= 15 ? '✅ Margem líquida saudável (>15%). Continue controlando os custos.' : margemLiq >= 5 ? '⚠️ Margem líquida moderada. Revise as principais despesas.' : '🔴 Margem líquida baixa. Analise urgentemente custos e precificação.'}`,
      tipo: 'relatorio',
      dados: { receitaBruta: recBruta, resultadoLiquido: resultLiq, margemLiquida: margemLiq },
      sugestoes: [
        { label: '💸 Maiores despesas', value: 'Quais são as maiores despesas do mês?' },
        { label: '📈 Fluxo de caixa', value: 'Como está o fluxo de caixa?' },
        { label: '💰 Saldo em conta', value: 'Qual o saldo atual das contas bancárias?' },
      ],
      acoes: [{ label: 'Ver DRE completo', href: '/dashboard/financeiro/dre', cor: 'blue' }],
      processadoEm: Date.now(),
    };
  }

  // ── Financeiro: maiores despesas / categorias ────────────────────────────
  if (detectar(msg, 'maior despesa', 'maiores despesas', 'gasto', 'gastos', 'custo fixo', 'custo variável', 'onde estou gastando')) {
    const linhas = d.topDespesas.map((t, i) =>
      `| ${i+1}° | ${t.categoria} | ${fmt(t.total)} |`
    ).join('\n');
    const totalDesp = d.topDespesas.reduce((s, t) => s + t.total, 0);
    return {
      resposta: `## 💸 Maiores Despesas — ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}\n\n**Total de despesas pagas:** ${fmt(totalDesp)}\n\n### Top Categorias\n| # | Categoria | Total |\n|---|---|---|\n${linhas || '| — | — | — |'}\n\n> 💡 ${d.topDespesas[0] ? `"${d.topDespesas[0].categoria}" é o maior centro de custo (${fmt(d.topDespesas[0].total)}). Avalie se há oportunidade de redução sem impactar a operação.` : 'Sem dados suficientes.'}`,
      tipo: 'relatorio',
      dados: { topDespesas: d.topDespesas },
      sugestoes: [
        { label: '📊 DRE do mês', value: 'Gere o DRE do mês atual' },
        { label: '💸 Contas a pagar', value: 'Quais contas vencendo esta semana?' },
      ],
      acoes: [{ label: 'Ver lançamentos', href: '/dashboard/financeiro/lancamentos', cor: 'blue' }],
      processadoEm: Date.now(),
    };
  }

  // ── Financeiro: fluxo de caixa ────────────────────────────────────────────
  if (detectar(msg, 'fluxo de caixa', 'fluxo caixa', 'cash flow', 'projeção financeira', 'entradas e saídas')) {
    const mesesNomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    // Build rolling 6-month summary from lancamentos
    const meses6: Array<{ mes: string; receitas: number; despesas: number; resultado: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const d2 = new Date();
      d2.setMonth(d2.getMonth() - i);
      const mStr = `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, '0')}`;
      const rec  = LANCAMENTOS_MOCK.filter(l => l.tipo === 'RECEITA' && l.status === 'PAGO' && l.dataVencimento.startsWith(mStr)).reduce((s, l) => s + l.valor, 0);
      const desp = LANCAMENTOS_MOCK.filter(l => l.tipo === 'DESPESA' && l.status === 'PAGO' && l.dataVencimento.startsWith(mStr)).reduce((s, l) => s + l.valor, 0);
      meses6.push({ mes: `${mesesNomes[d2.getMonth()]}/${d2.getFullYear().toString().slice(2)}`, receitas: rec, despesas: desp, resultado: rec - desp });
    }
    const linhas = meses6.map(m =>
      `| ${m.mes} | ${fmt(m.receitas)} | ${fmt(m.despesas)} | ${m.resultado >= 0 ? '✅' : '❌'} ${fmt(m.resultado)} |`
    ).join('\n');
    const mesAtualFluxo = meses6[meses6.length - 1];
    return {
      resposta: `## 📈 Fluxo de Caixa — Últimos 6 Meses\n\n| Mês | Receitas | Despesas | Resultado |\n|---|---|---|---|\n${linhas}\n\n### Situação Atual\n- **Saldo em caixa:** ${fmt(d.saldoContas)}\n- **Resultado ${mesAtualFluxo?.mes ?? 'mês atual'}:** ${fmt(mesAtualFluxo?.resultado ?? 0)}\n- **A receber:** ${fmt(d.totalAReceber)}\n- **A pagar:** ${fmt(d.totalAPagar)}\n\n> 💡 ${(mesAtualFluxo?.resultado ?? 0) >= 0 ? 'Fluxo positivo! Considere aplicar o excedente.' : 'Fluxo negativo. Acelere recebimentos e adie pagamentos não urgentes.'}`,
      tipo: 'relatorio',
      dados: { meses: meses6, saldoContas: d.saldoContas },
      sugestoes: [
        { label: '📊 DRE do mês', value: 'Gere o DRE do mês atual' },
        { label: '💸 Contas a pagar', value: 'Quais contas vencendo esta semana?' },
        { label: '💚 A receber', value: 'Quanto tenho a receber este mês?' },
      ],
      acoes: [{ label: 'Módulo financeiro', href: '/dashboard/financeiro', cor: 'blue' }],
      processadoEm: Date.now(),
    };
  }

  // ── Compras: visão geral ───────────────────────────────────────────────────
  if (detectar(msg, 'compra', 'pedido de compra', 'ordem de compra', 'quanto comprei', 'fornecedor')) {
    const porStatus = ['PENDENTE','APROVADO','ENVIADO','RECEBIDO','CANCELADO']
      .map(s => ({ status: s, qtd: d.compras.filter(c => c.status === s).length, valor: d.compras.filter(c => c.status === s).reduce((t, c) => t + c.valorTotal, 0) }))
      .filter(s => s.qtd > 0);
    const linhasStatus = porStatus.map(s => `| ${s.status} | ${s.qtd} | ${fmt(s.valor)} |`).join('\n');
    const top3Forn = [...d.fornecedores]
      .sort((a: any, b: any) => b.totalCompras - a.totalCompras)
      .slice(0, 3) as any[];
    const linhasForn = top3Forn.map((f: any) =>
      `| ${f.nomeFantasia || f.razaoSocial} | ${f.qtdCompras} | ${fmt(f.totalCompras)} |`
    ).join('\n');
    return {
      resposta: `## 🛒 Módulo de Compras\n\n**Pedidos últimos 30d:** ${d.compras30d.length} · **Gasto:** ${fmt(d.gastoCompras30d)}\n**Total de fornecedores:** ${d.fornecedores.length}\n\n### Status dos Pedidos\n| Status | Qtd | Valor |\n|---|---|---|\n${linhasStatus}\n\n### Top 3 Fornecedores\n| Fornecedor | Pedidos | Total |\n|---|---|---|\n${linhasForn || '| — | — | — |'}`,
      tipo: 'relatorio',
      dados: { compras30d: d.compras30d.length, gastoCompras30d: d.gastoCompras30d, fornecedores: d.fornecedores.length },
      sugestoes: [
        { label: '📦 Status do estoque', value: 'Qual o status do estoque?' },
        { label: '💸 Impacto financeiro', value: 'Quais contas vencendo esta semana?' },
        { label: '🧾 Importar NF-e', value: 'Como importar uma nota fiscal de entrada?' },
      ],
      acoes: [
        { label: 'Ver compras', href: '/dashboard/compras', cor: 'blue' },
        { label: 'Importar NF-e', href: '/dashboard/compras/importar-nfe', cor: 'green' },
      ],
      processadoEm: Date.now(),
    };
  }

  // ── Compras: importar NF-e ────────────────────────────────────────────────
  if (detectar(msg, 'importar nf', 'nf-e entrada', 'xml', 'nota de entrada', 'nfe entrada')) {
    return {
      resposta: `## 🧾 Importação de NF-e de Entrada\n\nO sistema suporta importação automática de XML de NF-e que integra:\n\n1. **Fornecedor** — localizado pelo CNPJ ou criado automaticamente\n2. **Produtos** — identificados por código ou criados no catálogo\n3. **Estoque** — atualizado automaticamente na quantidade recebida\n4. **Financeiro** — conta a pagar gerada pelo valor total + vencimento\n5. **Pedido de compra** — criado com todos os itens da NF-e\n\n### Como importar:\n1. Acesse **Compras → Importar NF-e**\n2. Arraste o arquivo XML ou clique para selecionar\n3. Revise os dados extraídos\n4. Confirme a importação`,
      tipo: 'texto',
      sugestoes: [
        { label: '🛒 Ver compras', value: 'Como estão os pedidos de compra?' },
        { label: '📦 Ver estoque', value: 'Qual o status do estoque?' },
      ],
      acoes: [
        { label: 'Importar NF-e', href: '/dashboard/compras/importar-nfe', cor: 'green' },
        { label: 'Ver compras', href: '/dashboard/compras', cor: 'blue' },
      ],
      processadoEm: Date.now(),
    };
  }

  // ── Marketplaces: visão geral ─────────────────────────────────────────────
  if (detectar(msg, 'marketplace', 'mercado livre', 'shopee', 'amazon', 'shopify', 'canal de venda', 'canais de venda', 'venda online', 'loja online')) {
    const taxaMedia  = d.mkpReceitaMes > 0 ? ((d.mkpReceitaMes - d.mkpReceitaLiquida) / d.mkpReceitaMes * 100) : 0;
    const linhasMkp  = d.marketplaces.map(m => {
      const pct = d.mkpReceitaMes > 0 ? (m.receitaMes / d.mkpReceitaMes * 100).toFixed(0) : '0';
      return `| ${m.nome} | ${m.status === 'CONECTADO' ? '🟢' : '🔴'} ${m.status} | ${fmt(m.receitaMes)} | ${pct}% | ${m.avaliacaoVendedor}⭐ |`;
    }).join('\n');
    return {
      resposta: `## 🛒 Visão Geral dos Marketplaces\n\n**Canais conectados:** ${d.mkpConectados.length}/${d.marketplaces.length}\n**Receita bruta mês:** ${fmt(d.mkpReceitaMes)}\n**Receita líquida mês:** ${fmt(d.mkpReceitaLiquida)} (taxa média ${fmtPct(taxaMedia)})\n**Pedidos hoje:** ${fmtN(d.mkpPedidosHoje)} · **Pedidos mês:** ${fmtN(d.mkpPedidosMes)}\n**Anúncios ativos:** ${d.anunciosAtivos.length} · **Sem estoque:** ${d.anunciosSemEstoque.length}\n**Perguntas pendentes:** ${d.perguntasPendentes.length} (${d.perguntasUrgentes.length} urgentes)\n\n### Canais de Venda\n| Canal | Status | Receita Mês | Participação | Avaliação |\n|---|---|---|---|---|\n${linhasMkp}\n\n> 💡 ${d.mkpDominante ? `${d.mkpDominante.nome} é seu canal dominante com ${fmt(d.mkpDominante.receitaMes)} (${(d.mkpDominante.receitaMes / d.mkpReceitaMes * 100).toFixed(0)}% da receita).` : 'Configure seus marketplaces para começar a vender.'}`,
      tipo: 'relatorio',
      dados: { canais: d.marketplaces.length, receitaMes: d.mkpReceitaMes, pedidosMes: d.mkpPedidosMes },
      sugestoes: [
        { label: '📢 Top anúncios', value: 'Quais são os anúncios mais vendidos?' },
        { label: '💬 Perguntas pendentes', value: 'Quais perguntas dos clientes estão pendentes?' },
        { label: '📊 Vendas por canal', value: 'Mostre as vendas por canal de marketplace' },
      ],
      acoes: [
        { label: 'Central de Marketplaces', href: '/dashboard/marketplaces', cor: 'blue' },
        { label: 'Ver anúncios', href: '/dashboard/marketplaces/anuncios', cor: 'green' },
      ],
      processadoEm: Date.now(),
    };
  }

  // ── Marketplaces: perguntas pendentes ─────────────────────────────────────
  if (detectar(msg, 'pergunta pendente', 'perguntas pendentes', 'responder pergunta', 'pergunta de cliente', 'pergunta marketplace', 'pergunta urgente')) {
    const linhasUrg = d.perguntasUrgentes.slice(0, 4).map(p =>
      `| 🔴 ${p.canal.replace('_', ' ')} | ${p.comprador} | ${p.pergunta.slice(0, 50)}... |`
    ).join('\n');
    const linhasNorm = d.perguntasPendentes.filter(p => p.prioridade !== 'URGENTE').slice(0, 4).map(p =>
      `| ⏳ ${p.canal.replace('_', ' ')} | ${p.comprador} | ${p.pergunta.slice(0, 50)}... |`
    ).join('\n');
    return {
      resposta: `## 💬 Perguntas Pendentes nos Marketplaces\n\n**Total pendente:** ${d.perguntasPendentes.length}\n**Urgentes:** ${d.perguntasUrgentes.length} 🔴\n\n${d.perguntasUrgentes.length > 0 ? `### 🚨 Urgentes (precisam de resposta imediata)\n| Canal | Comprador | Pergunta |\n|---|---|---|\n${linhasUrg}\n\n` : ''}${d.perguntasPendentes.filter(p => p.prioridade !== 'URGENTE').length > 0 ? `### ⏳ Normais\n| Canal | Comprador | Pergunta |\n|---|---|---|\n${linhasNorm}\n\n` : ''}\n> 💡 Responda as urgentes primeiro — impactam diretamente sua avaliação nos canais.`,
      tipo: d.perguntasUrgentes.length > 0 ? 'alerta' : 'texto',
      dados: { pendentes: d.perguntasPendentes.length, urgentes: d.perguntasUrgentes.length },
      sugestoes: [
        { label: '🛒 Visão dos canais', value: 'Como estão os marketplaces?' },
        { label: '📢 Top anúncios', value: 'Quais são os anúncios mais vendidos?' },
      ],
      acoes: [{ label: 'Responder perguntas', href: '/dashboard/marketplaces/perguntas', cor: 'orange' }],
      processadoEm: Date.now(),
    };
  }

  // ── Marketplaces: top anúncios ────────────────────────────────────────────
  if (detectar(msg, 'anúncio', 'anuncio', 'top anuncio', 'melhor anuncio', 'listing', 'produto marketplace', 'mais vendido marketplace')) {
    const linhas = d.topAnuncios.map((a, i) => {
      const margem = a.preco > 0 ? ((a.preco - a.custoMedio) / a.preco * 100) : 0;
      return `| ${i + 1}º | ${a.titulo.slice(0, 35)} | ${a.canal.replace('_', ' ')} | ${fmt(a.receita30d)} | ${fmtN(a.vendas30d)} | ${fmtPct(margem)} |`;
    }).join('\n');
    const semEst = d.anunciosSemEstoque.length;
    return {
      resposta: `## 📢 Top Anúncios — Últimos 30 Dias\n\n**Anúncios ativos:** ${d.anunciosAtivos.length} · **Sem estoque:** ${semEst}${semEst > 0 ? ' ⚠️' : ''}\n\n| Rank | Produto | Canal | Receita 30d | Vendas | Margem |\n|---|---|---|---|---|---|\n${linhas || '| — | — | — | — | — | — |'}\n\n> 💡 ${semEst > 0 ? `${semEst} anúncio(s) sem estoque — repõe para não perder vendas!` : 'Todos os anúncios com estoque disponível.'}`,
      tipo: semEst > 0 ? 'alerta' : 'relatorio',
      dados: { ativos: d.anunciosAtivos.length, semEstoque: semEst },
      sugestoes: [
        { label: '💬 Perguntas pendentes', value: 'Quais perguntas dos clientes estão pendentes?' },
        { label: '🛒 Visão geral', value: 'Como estão os marketplaces?' },
        { label: '📦 Status estoque', value: 'Qual o status do estoque?' },
      ],
      acoes: [{ label: 'Gerenciar anúncios', href: '/dashboard/marketplaces/anuncios', cor: 'blue' }],
      processadoEm: Date.now(),
    };
  }

  // ── Cobrança ──────────────────────────────────────────────────────────────
  if (detectar(msg, 'cobrança', 'cobranca', 'cobrar', 'títulos vencidos', 'titulos vencidos', 'inadimplência', 'inadimplencia', 'recuperar crédito', 'recuperar credito', 'clientes inadimplentes')) {
    const linhas = d.cobTopCrit.slice(0,5).map((t: any) =>
      `| ${t.clienteNome} | ${fmt(t.valor)} | ${t.diasAtraso}d | ${t.prioridade} | Score: ${t.scoreIA} |`
    ).join('\n');
    return {
      resposta: `## 💳 Módulo de Cobrança\n\n**Total vencido:** ${fmt(d.cobTotalVencido)}\n**Títulos críticos:** ${d.cobCriticos.length}\n**Acordos ativos:** ${d.cobAcordosAtiv}\n**Taxa de recuperação:** ${d.cobTaxaRec}%\n\n### 🚨 Top 5 Prioridades IA\n| Cliente | Valor | Atraso | Prioridade | Score IA |\n|---|---|---|---|---|\n${linhas || '| — | — | — | — | — |'}\n\n> 💡 Use o botão **"Disparar Cobrança IA"** para notificar automaticamente via WhatsApp/n8n todos os títulos elegíveis.`,
      tipo: d.cobCriticos.length > 0 ? 'alerta' : 'texto',
      dados: { totalVencido: d.cobTotalVencido, criticos: d.cobCriticos.length, acordosAtivos: d.cobAcordosAtiv },
      sugestoes: [
        { label: '🚨 Alertas gerais', value: 'Quais são os alertas críticos?' },
        { label: '💰 Saldo em conta', value: 'Qual o saldo atual das contas bancárias?' },
      ],
      acoes: [{ label: 'Módulo de Cobrança', href: '/dashboard/cobranca', cor: 'orange' }],
      processadoEm: Date.now(),
    };
  }

  // ── Caixa ─────────────────────────────────────────────────────────────────
  if (detectar(msg, 'caixa', 'sangria', 'suprimento', 'dinheiro em caixa', 'fechamento de caixa')) {
    return {
      resposta: `## 💰 Módulo de Caixa\n\nO caixa gerencia sessões com:\n- **Abertura** com valor inicial\n- **Entradas**: vendas balcão, suprimentos\n- **Saídas**: sangrias, despesas\n- **Fechamento** com conferência de valores\n\n> Acesse o módulo para ver a sessão atual e movimentações do dia.`,
      tipo: 'texto',
      sugestoes: [{ label: '📊 Ver vendas do dia', value: 'Como estão as vendas hoje?' }],
      acoes: [{ label: 'Abrir caixa', href: '/dashboard/caixa', cor: 'blue' }],
      processadoEm: Date.now(),
    };
  }

  // ── Resposta padrão ───────────────────────────────────────────────────────
  return {
    resposta: `Não tenho certeza sobre *"${msg}"*.\n\nPosso te ajudar com dados específicos do ERP. Tente:\n\n- **"Como estão as vendas hoje?"**\n- **"Quais os produtos mais vendidos este mês?"**\n- **"Qual o status do estoque?"**\n- **"Qual o saldo das contas bancárias?"**\n- **"Quais contas vencendo esta semana?"**\n- **"Gere o DRE do mês atual"**\n- **"Como está o fluxo de caixa?"**\n- **"Como estão os pedidos de compra?"**\n- **"Como estão os marketplaces?"**\n- **"Quais perguntas estão pendentes nos marketplaces?"**\n- **"Quais são os anúncios mais vendidos?"**\n- **"Gere um relatório executivo completo"**\n- **"Quais são os alertas críticos?"**`,
    tipo: 'texto',
    sugestoes: [
      { label: '📊 Resumo do dia', value: 'Como estão as vendas hoje?' },
      { label: '🚨 Alertas', value: 'Quais são os alertas críticos?' },
      { label: '💰 Saldo em conta', value: 'Qual o saldo atual das contas bancárias?' },
      { label: '📋 DRE do mês', value: 'Gere o DRE do mês atual' },
    ],
    processadoEm: Date.now(),
  };
}

// ─── POST /api/v1/ia/chat ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mensagem: string = (body.mensagem ?? '').trim();
    const historico: ChatMessage[] = body.historico ?? [];

    if (!mensagem) return NextResponse.json({ erro: 'Mensagem vazia' }, { status: 400 });

    // Latência realista (80-200ms)
    await new Promise(r => setTimeout(r, 80 + Math.random() * 120));

    return NextResponse.json(gerarResposta(mensagem, historico));
  } catch (err) {
    console.error('[IA chat]', err);
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
