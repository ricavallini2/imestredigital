import { NextRequest, NextResponse } from 'next/server';

// ─── Persistência ─────────────────────────────────────────────────────────────
declare global {
  var __insightsMock: InsightMock[] | undefined;
  var __insightsSeq: number | undefined;
}

export interface InsightMock {
  id: string;
  tipo: 'ALERTA' | 'OPORTUNIDADE' | 'PREVISAO' | 'ANOMALIA';
  titulo: string;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  visualizado: boolean;
  acaoSugerida?: string;
  dados?: Record<string, unknown>;
  criadoEm: string;
}

const INITIAL_INSIGHTS: InsightMock[] = [
  {
    id: 'ins-001', tipo: 'ALERTA', prioridade: 'CRITICA',
    titulo: 'Produto sem estoque: Mochila Samsonite Pro-DLX 5',
    descricao: 'O produto SKU SAMS-BACKP-PRO está com estoque zerado há 3 dias. Isso representa perda de vendas estimada em R$ 2.697/mês com base no histórico.',
    acaoSugerida: 'Criar pedido de compra imediato para o fornecedor. Quantidade sugerida: 10 unidades.',
    visualizado: false, criadoEm: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ins-002', tipo: 'ALERTA', prioridade: 'ALTA',
    titulo: 'GoPro HERO12 com estoque crítico (3 unidades)',
    descricao: 'Com giro médio de 3 unidades/mês e apenas 3 em estoque, a ruptura está prevista para os próximos 30 dias.',
    acaoSugerida: 'Solicitar reposição de pelo menos 5 unidades ao fornecedor.',
    visualizado: false, criadoEm: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'ins-003', tipo: 'OPORTUNIDADE', prioridade: 'ALTA',
    titulo: 'iPhone 15 Pro com alta demanda — oportunidade de cross-sell',
    descricao: 'Produto mais vendido nos últimos 30 dias (7 unidades). Clientes que compraram iPhone também compram acessórios. Sugestão: kit proteção de tela + case.',
    acaoSugerida: 'Criar bundle "iPhone + Proteção" com 10% de desconto.',
    visualizado: false, criadoEm: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'ins-004', tipo: 'PREVISAO', prioridade: 'MEDIA',
    titulo: 'Projeção de receita: R$ 87.400 este mês',
    descricao: 'Com base no ritmo atual de vendas (primeiros 15 dias), a projeção é de encerrar o mês com receita 12% acima do mês anterior.',
    acaoSugerida: 'Manter cadência atual. Avaliar campanhas de impulsionamento na última semana.',
    visualizado: true, criadoEm: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ins-005', tipo: 'ANOMALIA', prioridade: 'ALTA',
    titulo: 'Pedido Amazon #PED-2026-0008 parado há 26h',
    descricao: 'Pedido no status PENDENTE há mais de 24 horas sem nenhuma atualização. Amazon exige confirmação em 24h para evitar cancelamento automático.',
    acaoSugerida: 'Confirmar pedido imediatamente no painel Amazon.',
    visualizado: false, criadoEm: new Date(Date.now() - 26 * 3600000).toISOString(),
  },
  {
    id: 'ins-006', tipo: 'OPORTUNIDADE', prioridade: 'MEDIA',
    titulo: 'Tech Solutions Ltda: potencial de up-sell',
    descricao: 'Cliente com score 87, comprou iPhone 15 Pro e Notebook Dell há 15 dias. Histórico indica ciclo de recompra de 45 dias. Momento ideal para contato.',
    acaoSugerida: 'Entrar em contato com oferta de upgrades e periféricos.',
    visualizado: true, criadoEm: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

if (!globalThis.__insightsMock) globalThis.__insightsMock = INITIAL_INSIGHTS;
if (!globalThis.__insightsSeq) globalThis.__insightsSeq = INITIAL_INSIGHTS.length;

function getInsights() { return globalThis.__insightsMock!; }

// GET /api/v1/insights
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const visualizado = params.get('visualizado');
  const tipo        = params.get('tipo');
  const prioridade  = params.get('prioridade');
  const limite      = Number(params.get('limite') ?? '50');

  let lista = [...getInsights()].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

  if (visualizado !== null) {
    lista = lista.filter(i => i.visualizado === (visualizado === 'true'));
  }
  if (tipo) lista = lista.filter(i => i.tipo === tipo.toUpperCase());
  if (prioridade) lista = lista.filter(i => i.prioridade === prioridade.toUpperCase());

  return NextResponse.json(lista.slice(0, limite));
}
