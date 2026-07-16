'use client';

/**
 * Dashboard principal — iMestreDigital ERP
 * Visão 360° do negócio com IA, gráficos, feeds e customização por widget.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
  Bot,
  RefreshCw,
  Settings2,
  X,
  FileText,
  Users,
  Wallet,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  Activity,
  DollarSign,
  Star,
  Sparkles,
  CloudOff,
} from 'lucide-react';

// Gráficos carregados sem SSR — Recharts usa APIs do browser
const GraficoVendas = dynamic(() => import('@/components/dashboard/GraficoVendas'), { ssr: false });
const GraficoCanal = dynamic(() => import('@/components/dashboard/GraficoCanal'), { ssr: false });
import {
  useDashboardResumo,
  useRefreshDashboard,
  useDashboardInsights,
} from '@/hooks/useDashboard';
import { useMarcarInsightVisualizado } from '@/hooks/useIA';
import { rotularCanal } from '@/lib/canais';
import type {
  AlertaEstoque,
  DashboardResumo,
  FonteDashboard,
  PedidoRecente,
  PedidoUrgente,
  TopProduto,
} from '@/hooks/useDashboard';
import type { Insight } from '@/types';

// ─── Constantes ───────────────────────────────────────────────────────────────
const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtN = (v: number) => v.toLocaleString('pt-BR');

/**
 * Os 9 status do enum `StatusPedido` (order-service), na ordem do fluxo.
 *
 * O KPI "Pedidos do Mês" conta TODOS eles — o `porStatus` do backend soma
 * exatamente `totalPedidos`. Renderizar só 7 (faltavam RASCUNHO e DEVOLVIDO)
 * fazia a soma da linha não fechar com o número logo acima: um pedido DEVOLVIDO
 * sumia do pipeline e a tela se contradizia.
 */
const STATUS_PIPELINE = [
  'RASCUNHO',
  'PENDENTE',
  'CONFIRMADO',
  'EM_SEPARACAO',
  'FATURADO',
  'ENVIADO',
  'ENTREGUE',
  'CANCELADO',
  'DEVOLVIDO',
] as const;

const STATUS_LABEL: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  EM_SEPARACAO: 'Em Separação',
  FATURADO: 'Faturado',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
  DEVOLVIDO: 'Devolvido',
};

const STATUS_COR: Record<string, string> = {
  PENDENTE: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  CONFIRMADO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  EM_SEPARACAO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  FATURADO: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  ENVIADO: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
  ENTREGUE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CANCELADO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};
const ESTOQUE_COR: Record<string, string> = {
  SEM_ESTOQUE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  CRITICO: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  BAIXO: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

// ─── Widget system ─────────────────────────────────────────────────────────────
type WidgetId =
  | 'kpis'
  | 'charts'
  | 'pipeline'
  | 'topProdutos'
  | 'pedidosRecentes'
  | 'pedidosUrgentes'
  | 'alertasEstoque'
  | 'fiscal'
  | 'caixa'
  | 'ia';

interface Widget {
  id: WidgetId;
  label: string;
  visible: boolean;
}

const WIDGETS_DEFAULT: Widget[] = [
  { id: 'kpis', label: 'KPIs Principais', visible: true },
  { id: 'charts', label: 'Gráficos de Vendas', visible: true },
  { id: 'pipeline', label: 'Pipeline de Pedidos', visible: true },
  { id: 'topProdutos', label: 'Top Produtos', visible: true },
  { id: 'pedidosUrgentes', label: 'Pedidos Urgentes', visible: true },
  { id: 'pedidosRecentes', label: 'Pedidos Recentes', visible: true },
  { id: 'alertasEstoque', label: 'Alertas de Estoque', visible: true },
  { id: 'fiscal', label: 'Painel Fiscal', visible: true },
  { id: 'caixa', label: 'Status do Caixa', visible: true },
  { id: 'ia', label: 'iMestreAI', visible: true },
];

const LS_KEY = 'dashboard_widgets_v2';

function useWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>(WIDGETS_DEFAULT);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed: Widget[] = JSON.parse(saved);
        // Merge — add new widgets that didn't exist in saved config
        const merged = WIDGETS_DEFAULT.map((def) => {
          const found = parsed.find((p) => p.id === def.id);
          return found ?? def;
        });
        setWidgets(merged);
      }
    } catch {}
  }, []);

  const save = useCallback((next: Widget[]) => {
    setWidgets(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const toggle = useCallback(
    (id: WidgetId) => {
      save(widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)));
    },
    [widgets, save],
  );

  const move = useCallback(
    (id: WidgetId, dir: 'up' | 'down') => {
      const idx = widgets.findIndex((w) => w.id === id);
      if (idx < 0) return;
      const next = [...widgets];
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      save(next);
    },
    [widgets, save],
  );

  const reset = useCallback(() => save(WIDGETS_DEFAULT), [save]);

  const isVisible = useCallback(
    (id: WidgetId) => widgets.find((w) => w.id === id)?.visible ?? true,
    [widgets],
  );

  return { widgets, toggle, move, reset, isVisible };
}

// ─── Componentes menores ──────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700 ${className}`} />;
}

/**
 * Estado honesto de card cuja fonte NÃO respondeu.
 * Zero é um fato ("não houve venda"); erro é ausência de dado — e a tela nunca
 * pode passar um pelo outro.
 */
function FonteIndisponivel({ mensagem }: { mensagem: string }) {
  return (
    <div className="flex flex-col items-center py-8 text-slate-400">
      <CloudOff className="w-9 h-9 mb-2 text-slate-300" />
      <p className="text-sm font-medium text-slate-500">Informação indisponível</p>
      <p className="text-xs mt-1 text-center max-w-xs">{mensagem}</p>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  color = 'blue',
  href,
  indisponivel,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color?: string;
  href?: string;
  /** Fonte fora do ar: mostra "—" em vez de um zero que mentiria. */
  indisponivel?: boolean;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
    cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };
  const inner = (
    <div className="card h-full group hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p
            className={`text-2xl font-bold mt-1 truncate ${indisponivel ? 'text-slate-300 dark:text-slate-600' : 'text-slate-900 dark:text-white'}`}
          >
            {indisponivel ? '—' : value}
          </p>
          {indisponivel ? (
            <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <CloudOff className="w-3 h-3 shrink-0" /> Fonte indisponível
            </p>
          ) : (
            sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          )}
        </div>
        <div
          className={`p-3 rounded-xl ${indisponivel ? colors.slate : (colors[color] ?? colors.blue)} shrink-0 ml-3`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

// ─── Seção de customização ───────────────────────────────────────────────────
function CustomizeModal({
  widgets,
  onToggle,
  onMove,
  onReset,
  onClose,
}: {
  widgets: Widget[];
  onToggle: (id: WidgetId) => void;
  onMove: (id: WidgetId, dir: 'up' | 'down') => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-marca-500" /> Personalizar Dashboard
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {widgets.map((w, i) => (
            <div
              key={w.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${w.visible ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800' : 'border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 opacity-60'}`}
            >
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
              <span className="flex-1 text-sm font-medium">{w.label}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onMove(w.id, 'up')}
                  disabled={i === 0}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-20"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onMove(w.id, 'down')}
                  disabled={i === widgets.length - 1}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-20"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onToggle(w.id)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded ml-1"
                >
                  {w.visible ? (
                    <Eye className="w-4 h-4 text-marca-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between">
          <button onClick={onReset} className="text-sm text-slate-500 hover:text-slate-700">
            Restaurar padrão
          </button>
          <button onClick={onClose} className="btn-primary text-sm px-4 py-2">
            Pronto
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── iMestreAI automações ─────────────────────────────────────────────────────
interface Automacao {
  id: string;
  tipo: 'acao' | 'alerta' | 'oportunidade';
  titulo: string;
  descricao: string;
  href?: string;
  corIcone: string;
  icone: 'zap' | 'alert' | 'star';
}

/**
 * Ações recomendadas derivadas do resumo.
 *
 * Cada regra é fechada pela fonte que a alimenta: com a fonte fora do ar não há
 * o que afirmar. "Caixa não está aberto" com o order-service caído seria uma
 * afirmação falsa sobre a operação, não um alerta.
 */
function gerarAutomacoes(resumo: DashboardResumo | undefined): Automacao[] {
  if (!resumo) return [];
  const items: Automacao[] = [];
  const ok = (fonte: FonteDashboard) => resumo.fontes[fonte] === 'ok';

  if (ok('estoque') && resumo.estoque.semEstoque > 0) {
    items.push({
      id: 'sem-estoque',
      tipo: 'alerta',
      icone: 'alert',
      corIcone: 'text-red-500',
      titulo: `${resumo.estoque.semEstoque} produto(s) sem estoque`,
      descricao:
        'Produtos zerados estão gerando perda de vendas. Registre uma entrada de estoque agora.',
      href: '/dashboard/estoque?filtro=SEM_ESTOQUE',
    });
  }

  if (ok('urgentes') && resumo.pedidosUrgentes.length >= 3) {
    items.push({
      id: 'pedidos-urgentes',
      tipo: 'alerta',
      icone: 'alert',
      corIcone: 'text-amber-500',
      titulo: `${resumo.pedidosUrgentes.length} pedidos aguardando confirmação`,
      descricao:
        'Pedidos parados em PENDENTE há mais de 4h. Confirme ou entre em contato com os clientes.',
      href: '/dashboard/pedidos?status=PENDENTE',
    });
  }

  if (ok('fiscal') && resumo.fiscal.nfsPendentes > 0) {
    items.push({
      id: 'nf-pendentes',
      tipo: 'acao',
      icone: 'zap',
      corIcone: 'text-blue-500',
      titulo: `Emitir ${resumo.fiscal.nfsPendentes} nota(s) fiscal(is) pendente(s)`,
      descricao: 'Há NFs em rascunho ou validadas prontas para emissão na SEFAZ.',
      href: '/dashboard/fiscal?status=VALIDADA',
    });
  }

  if (ok('estoque') && resumo.estoque.estoqueBaixo > 2) {
    items.push({
      id: 'reposicao',
      tipo: 'oportunidade',
      icone: 'star',
      corIcone: 'text-purple-500',
      titulo: 'Automatizar reposição de estoque',
      descricao: `${resumo.estoque.estoqueBaixo} produtos com estoque baixo. Configure alertas de ponto de pedido.`,
      href: '/dashboard/estoque',
    });
  }

  const taxa = resumo.fiscal.taxaEmissao;
  if (ok('fiscal') && taxa < 90 && taxa > 0) {
    items.push({
      id: 'taxa-emissao',
      tipo: 'alerta',
      icone: 'alert',
      corIcone: 'text-orange-500',
      titulo: `Taxa de emissão fiscal baixa: ${taxa}%`,
      descricao: 'Verifique as NFs rejeitadas e corrija os dados para reenvio à SEFAZ.',
      href: '/dashboard/fiscal?status=REJEITADA',
    });
  }

  // A recomendação de "crescimento de X% na receita" saiu daqui: nenhum endpoint
  // real expõe a receita do período anterior, e sem comparativo não há
  // crescimento a afirmar. Volta quando o backend honrar dataInicio/dataFim em
  // /pedidos/estatisticas/dashboard.

  if (ok('clientes') && resumo.clientes.novosEsteMes > 3) {
    items.push({
      id: 'novos-clientes',
      tipo: 'oportunidade',
      icone: 'star',
      corIcone: 'text-cyan-500',
      titulo: `${resumo.clientes.novosEsteMes} novos clientes este mês`,
      descricao: 'Boa aquisição! Envie uma mensagem de boas-vindas ou oferta de fidelidade.',
      href: '/dashboard/clientes',
    });
  }

  if (ok('caixa') && !resumo.caixa.aberto) {
    items.push({
      id: 'caixa-fechado',
      tipo: 'acao',
      icone: 'zap',
      corIcone: 'text-indigo-500',
      titulo: 'Caixa não está aberto',
      descricao: 'Nenhuma sessão de caixa ativa. Abra o caixa para registrar vendas balcão.',
      href: '/dashboard/caixa',
    });
  }

  return items.slice(0, 5);
}

const INSIGHT_CORES: Record<string, string> = {
  ALERTA: 'border-l-red-500 bg-red-50 dark:bg-red-950/30',
  OPORTUNIDADE: 'border-l-green-500 bg-green-50 dark:bg-green-950/30',
  PREVISAO: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/30',
  ANOMALIA: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/30',
};

// ─── Página principal ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: resumo, isLoading, refetch } = useDashboardResumo();
  // `isError` da query de insights é DADO DE HONESTIDADE, não detalhe técnico: o
  // bloco da IA afirma coisas sobre ela e precisa saber quando ela não respondeu.
  const {
    data: insights,
    isLoading: loadingInsights,
    isError: erroInsights,
  } = useDashboardInsights();
  const marcarVisualizado = useMarcarInsightVisualizado();
  const refresh = useRefreshDashboard();

  const { widgets, toggle, move, reset, isVisible } = useWidgets();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = useCallback(() => {
    refresh();
    refetch();
    setLastUpdate(new Date());
  }, [refresh, refetch]);

  const automacoes = useMemo(() => gerarAutomacoes(resumo), [resumo]);

  /** `true` só quando a fonte daquele bloco respondeu de fato. */
  const fonteOk = useCallback((fonte: FonteDashboard) => resumo?.fontes[fonte] === 'ok', [resumo]);

  // Só conta o que veio de fonte viva: somar o zero de uma fonte caída faria o
  // banner dizer "estoque OK" durante um apagão do inventory.
  const semEstoque = fonteOk('estoque') ? resumo!.estoque.semEstoque : 0;
  const qtdUrgentes = fonteOk('urgentes') ? resumo!.pedidosUrgentes.length : 0;
  const alertasCriticos = semEstoque + qtdUrgentes;

  // O número soma DUAS fontes independentes (estoque zerado + pedidos urgentes),
  // então só pode ser afirmado se as DUAS responderam. Com 'urgentes' fora e
  // 'estoque' vivo, o `?? 0` do urgente virava zero e o card dizia "Estoque OK ·
  // 0" — uma afirmação sobre pedidos que ninguém conseguiu ler.
  const alertasCriticosOk = fonteOk('estoque') && fonteOk('urgentes');

  // A série sempre traz os 7 baldes; todos zerados é o FATO "não houve venda",
  // e nesse caso o gráfico vazio comunica menos que uma frase.
  const semVendas7d = (resumo?.vendas7d ?? []).every((d) => d.pedidos === 0);

  // Honestidade do bloco da IA — ele fala de DUAS origens independentes:
  //   1) as fontes do resumo (`dashboardService`, 8 chamadas);
  //   2) a query de insights (/v1/insights, outro serviço, OUTRA query).
  // A (2) não entrava nesta conta: com o ai-service fora, `insights` virava
  // `undefined`, `fontesComFalha` dava 0 e a tela afirmava "Tudo funcionando
  // bem! A IA monitora seu negócio 24h" — com a IA justamente fora do ar.
  const statusFontes = Object.values(resumo?.fontes ?? {});
  const totalFontes = statusFontes.length + 1; // +1 = a fonte de insights
  const fontesComFalha = statusFontes.filter((s) => s === 'erro').length + (erroInsights ? 1 : 0);

  // O resumo inteiro pode falhar ANTES de reportar fonte a fonte (rede, auth):
  // sem `fontes` não existe uma única leitura viva — o que é falha, e não
  // ausência de falha. Sem isto, `statusFontes` vazio também dava "tudo bem".
  const semResumo = !isLoading && !resumo;

  /** Não há base para afirmar que o negócio está bem. */
  const semLeituraDoNegocio = semResumo || fontesComFalha > 0;

  /**
   * Pipeline: todo status COM pedido, nunca um pedido fora da linha.
   * Parte dos 9 do enum e ainda inclui qualquer chave extra que o backend mande
   * — ela já entrou no KPI, então precisa aparecer aqui, ou a soma mente. Nada
   * é inventado: só é exibido o que veio em `porStatus`.
   */
  const pipeline = useMemo(() => {
    const porStatus = resumo?.porStatus ?? {};
    const conhecidos = new Set<string>(STATUS_PIPELINE);
    const extras = Object.keys(porStatus).filter((s) => !conhecidos.has(s));
    return [...STATUS_PIPELINE, ...extras]
      .map((status) => ({ status, qtd: Number(porStatus[status]) || 0 }))
      .filter((s) => s.qtd > 0);
  }, [resumo]);

  const maxPipeline = Math.max(...pipeline.map((s) => s.qtd), 0);

  // Renderização ordenada de widgets
  const widgetOrder = widgets.filter((w) => w.visible).map((w) => w.id);

  const renderWidget = (id: WidgetId): React.ReactNode => {
    switch (id) {
      // ── KPIs ────────────────────────────────────────────────────────────────
      case 'kpis':
        return (
          <div key="kpis" className="space-y-4">
            {/* Linha 1 — 4 KPIs principais */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
              ) : (
                <>
                  {/* "do Mês" e não "30 dias": `periodo=mes` no order-service é
                  mês-calendário — é isso que o número realmente mede. */}
                  {/* Sem "7 dias" aqui: seria uma janela DIFERENTE (7 dias corridos)
                  ao lado do mês-calendário — e no começo do mês o de 7 dias fica
                  maior, o que lê como erro. O total de 7 dias vive no gráfico de
                  7 dias, ao lado das barras que o compõem. */}
                  <KpiCard
                    label="Receita do Mês"
                    value={fmt(resumo?.receitaMes ?? 0)}
                    sub="mês corrente"
                    icon={<DollarSign className="w-5 h-5" />}
                    color="green"
                    href="/dashboard/pedidos"
                    indisponivel={!fonteOk('vendas')}
                  />
                  <KpiCard
                    label="Pedidos do Mês"
                    value={fmtN(resumo?.pedidosMes ?? 0)}
                    sub={`Pendentes: ${fmtN(resumo?.pedidosPendentes ?? 0)}`}
                    icon={<ShoppingCart className="w-5 h-5" />}
                    color="blue"
                    href="/dashboard/pedidos"
                    indisponivel={!fonteOk('vendas')}
                  />
                  <KpiCard
                    label="Ticket Médio"
                    value={fmt(resumo?.ticketMedio ?? 0)}
                    sub="no mês corrente"
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="purple"
                    indisponivel={!fonteOk('vendas')}
                  />
                  {/* "Sem Alertas Críticos" é uma AFIRMAÇÃO: só com as DUAS fontes
                  vivas. O rótulo não fala de "Estoque" porque o número não é de
                  estoque — é estoque zerado MAIS pedidos urgentes, e o `sub`
                  abre exatamente essas duas parcelas. */}
                  <KpiCard
                    label={
                      alertasCriticos > 0 || !alertasCriticosOk
                        ? 'Alertas Críticos'
                        : 'Sem Alertas Críticos'
                    }
                    value={String(alertasCriticos)}
                    sub={`${semEstoque} sem estoque · ${qtdUrgentes} pedido(s) urgente(s)`}
                    icon={<AlertTriangle className="w-5 h-5" />}
                    color={alertasCriticos > 0 ? 'red' : 'green'}
                    href="/dashboard/estoque"
                    indisponivel={!alertasCriticosOk}
                  />
                </>
              )}
            </div>
            {/* Linha 2 — 4 KPIs secundários */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
              ) : (
                <>
                  <KpiCard
                    label="NFs Emitidas 30d"
                    value={fmtN(resumo?.fiscal?.emitidas30d ?? 0)}
                    sub={`Taxa: ${resumo?.fiscal?.taxaEmissao ?? 0}%`}
                    icon={<FileText className="w-5 h-5" />}
                    color="cyan"
                    href="/dashboard/fiscal"
                    indisponivel={!fonteOk('fiscal')}
                  />
                  <KpiCard
                    label="Impostos 30d"
                    value={fmt(resumo?.fiscal?.impostos30d ?? 0)}
                    sub="ICMS + PIS + COFINS"
                    icon={<Activity className="w-5 h-5" />}
                    color="indigo"
                    indisponivel={!fonteOk('fiscal')}
                  />
                  {/*
                    `novosEsteMes` conta CADASTROS do mês (qualquer status) e `ativos` conta
                    só os ATIVO — logo "+5 este mês" ao lado de "3" é fato, mas lido como
                    badge de crescimento vira contradição aparente ("ganhei 5 e tenho 3?").
                    O sub diz as duas coisas por extenso, sem o "+" de variação.
                  */}
                  <KpiCard
                    label="Clientes Ativos"
                    value={fmtN(resumo?.clientes?.ativos ?? 0)}
                    sub={`de ${fmtN(resumo?.clientes?.total ?? 0)} cadastrados · ${fmtN(
                      resumo?.clientes?.novosEsteMes ?? 0,
                    )} novo(s) no mês`}
                    icon={<Users className="w-5 h-5" />}
                    color="blue"
                    href="/dashboard/clientes"
                    indisponivel={!fonteOk('clientes')}
                  />
                  {/* `totalProdutos` do inventory = produtos DISTINTOS com saldo. */}
                  <KpiCard
                    label="Valor em Estoque"
                    value={fmt(resumo?.estoque?.valorEmEstoque ?? 0)}
                    sub={`${resumo?.estoque?.totalProdutos ?? 0} produtos com saldo`}
                    icon={<Package className="w-5 h-5" />}
                    color="slate"
                    href="/dashboard/estoque"
                    indisponivel={!fonteOk('estoque')}
                  />
                </>
              )}
            </div>
          </div>
        );

      // ── Gráficos ─────────────────────────────────────────────────────────────
      case 'charts':
        return (
          <div key="charts" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Receita 7 dias */}
            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-marca-500" />
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    Receita Últimos 7 Dias
                  </h2>
                </div>
                {/* O total da MESMA janela das barras — comparável, ao contrário do
                  mês-calendário dos KPIs acima. Sem a fonte: "—" e o aviso, o
                  mesmo padrão dos KPIs. Antes sobrava um "R$" órfão, que lê como
                  um valor que não terminou de carregar. */}
                {fonteOk('serie7d') ? (
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {fmt(resumo!.receita7d)}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <CloudOff className="w-3 h-3 shrink-0" /> — Fonte indisponível
                  </span>
                )}
              </div>
              {!mounted || isLoading ? (
                <Skeleton className="h-56" />
              ) : !fonteOk('serie7d') ? (
                <FonteIndisponivel mensagem="A série diária é agregada a partir dos pedidos do período e não pôde ser montada agora." />
              ) : semVendas7d ? (
                <div className="flex flex-col items-center py-12 text-slate-400">
                  <BarChart3 className="w-9 h-9 mb-2 opacity-30" />
                  <p className="text-sm">Nenhuma venda registrada nos últimos 7 dias</p>
                </div>
              ) : (
                <GraficoVendas data={resumo!.vendas7d} />
              )}
            </div>

            {/* Pedidos por canal — mesma janela e mesma fonte da série diária */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-destaque-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Vendas por Canal — 7 dias
                </h2>
              </div>
              {!mounted || isLoading ? (
                <Skeleton className="h-56" />
              ) : !fonteOk('serie7d') ? (
                <FonteIndisponivel mensagem="A quebra por canal é agregada a partir dos pedidos do período." />
              ) : (resumo?.porCanal.length ?? 0) === 0 ? (
                <div className="flex flex-col items-center py-12 text-slate-400">
                  <Activity className="w-9 h-9 mb-2 opacity-30" />
                  <p className="text-sm">Nenhuma venda por canal no período</p>
                </div>
              ) : (
                <GraficoCanal data={resumo!.porCanal} />
              )}
            </div>
          </div>
        );

      // ── Pipeline de pedidos ──────────────────────────────────────────────────
      case 'pipeline':
        return (
          <div key="pipeline" className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Pipeline de Pedidos — Mês
                </h2>
              </div>
              <Link
                href="/dashboard/pedidos"
                className="text-xs text-marca-500 hover:underline flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {isLoading ? (
              <Skeleton className="h-28" />
            ) : !fonteOk('vendas') ? (
              <FonteIndisponivel mensagem="Não foi possível ler as estatísticas de pedidos agora." />
            ) : pipeline.length === 0 ? (
              // Fonte viva e nenhum pedido: isto é o FATO, não uma falha.
              <div className="flex flex-col items-center py-8 text-slate-400">
                <ShoppingCart className="w-9 h-9 mb-2 opacity-30" />
                <p className="text-sm">Nenhum pedido registrado no mês</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {pipeline.map(({ status, qtd }) => {
                  const pct = maxPipeline > 0 ? (qtd / maxPipeline) * 100 : 0;
                  return (
                    <Link
                      key={status}
                      href={`/dashboard/pedidos?status=${status}`}
                      className="flex flex-col items-center gap-1 group cursor-pointer"
                    >
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg h-20 flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-b-lg transition-all group-hover:opacity-80 ${status === 'CANCELADO' || status === 'DEVOLVIDO' ? 'bg-red-400' : status === 'ENTREGUE' ? 'bg-green-400' : 'bg-marca-400'}`}
                          style={{ height: `${Math.max(pct, 8)}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {qtd}
                      </span>
                      <span className="text-[10px] text-slate-400 text-center leading-tight">
                        {STATUS_LABEL[status] ?? status.replace(/_/g, ' ')}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );

      // ── Top Produtos ─────────────────────────────────────────────────────────
      case 'topProdutos':
        return (
          <div key="topProdutos" className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Top Produtos — Mês</h2>
              </div>
              <Link
                href="/dashboard/produtos"
                className="text-xs text-marca-500 hover:underline flex items-center gap-1"
              >
                Catálogo <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {isLoading ? (
              <Skeleton className="h-40" />
            ) : !fonteOk('vendas') ? (
              <FonteIndisponivel mensagem="Não foi possível ler as estatísticas de pedidos agora." />
            ) : (
              <div className="space-y-3">
                {(resumo?.topProdutos5 ?? []).map((p: TopProduto, i: number) => {
                  // O ranking vem ordenado por QUANTIDADE (pedido.repository.ts, topProdutos),
                  // não por receita — o 1º colocado pode ter receita menor que o 2º (100 un ×
                  // R$ 1 vence 5 un × R$ 500). Por isso a base da barra é o MAIOR valor da
                  // lista, não o primeiro: usar o primeiro dava largura acima de 100%, o
                  // overflow-hidden clipava e receitas muito diferentes viravam barras
                  // idênticas. O `1` cobre o caso de todas zeradas (0/0 = NaN → width: NaN%).
                  const maxReceita = Math.max(
                    ...(resumo?.topProdutos5 ?? []).map((x: TopProduto) => x.receita),
                    1,
                  );
                  const pct = (p.receita / maxReceita) * 100;
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-orange-50 text-orange-600'}`}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                          {p.nome}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-marca-400 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 shrink-0">{p.qtd} un.</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 shrink-0">
                        {fmt(p.receita)}
                      </span>
                    </div>
                  );
                })}
                {(resumo?.topProdutos5?.length ?? 0) === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">
                    Sem dados de vendas no período
                  </p>
                )}
              </div>
            )}
          </div>
        );

      // ── Pedidos Urgentes ─────────────────────────────────────────────────────
      case 'pedidosUrgentes':
        return (
          <div key="pedidosUrgentes" className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Pedidos Urgentes</h2>
              </div>
              <Link
                href="/dashboard/pedidos?status=PENDENTE"
                className="text-xs text-marca-500 hover:underline flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {isLoading ? (
              <Skeleton className="h-40" />
            ) : !fonteOk('urgentes') ? (
              <FonteIndisponivel mensagem="Não foi possível consultar os pedidos pendentes agora." />
            ) : (resumo?.pedidosUrgentes?.length ?? 0) === 0 ? (
              <div className="flex flex-col items-center py-8 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mb-2 text-green-400" />
                <p className="text-sm font-medium text-green-600">Tudo em dia!</p>
                <p className="text-xs mt-1">Nenhum pedido pendente há mais de 4h</p>
              </div>
            ) : (
              <div className="space-y-2">
                {resumo!.pedidosUrgentes.map((p: PedidoUrgente) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/pedidos/${p.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${p.horasAtraso > 24 ? 'bg-red-500' : p.horasAtraso > 8 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {p.numero}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{p.cliente}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {fmt(p.valor)}
                      </p>
                      <p
                        className={`text-xs ${p.horasAtraso > 24 ? 'text-red-500' : 'text-amber-500'}`}
                      >
                        {p.horasAtraso}h atraso
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-marca-500 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        );

      // ── Pedidos Recentes ─────────────────────────────────────────────────────
      case 'pedidosRecentes':
        return (
          <div key="pedidosRecentes" className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-marca-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Pedidos Recentes</h2>
              </div>
              <Link
                href="/dashboard/pedidos"
                className="text-xs text-marca-500 hover:underline flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {isLoading ? (
              <Skeleton className="h-40" />
            ) : !fonteOk('recentes') ? (
              <FonteIndisponivel mensagem="Não foi possível consultar os pedidos agora." />
            ) : (resumo?.pedidosRecentes?.length ?? 0) === 0 ? (
              <div className="flex flex-col items-center py-8 text-slate-400">
                <ShoppingCart className="w-9 h-9 mb-2 opacity-30" />
                <p className="text-sm">Nenhum pedido registrado ainda</p>
                <Link
                  href="/dashboard/pedidos/balcao"
                  className="mt-2 text-xs text-marca-500 hover:underline"
                >
                  Registrar a primeira venda →
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {resumo!.pedidosRecentes.map((p: PedidoRecente) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/pedidos/${p.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {p.numero}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COR[p.status] ?? ''}`}
                        >
                          {p.status}
                        </span>
                      </div>
                      {/* `canal` já sai do service com fallback 'OUTROS': `canalOrigem`
                        é nullable no order-service e um null aqui explodiria.
                        `rotularCanal` dá o nome pt-BR (MERCADOLIVRE → Mercado Livre). */}
                      <p className="text-xs text-slate-400 truncate">
                        {p.cliente} · {rotularCanal(p.canal)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      {fmt(p.valor)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-marca-500 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        );

      // ── Alertas de Estoque ───────────────────────────────────────────────────
      case 'alertasEstoque':
        return (
          <div key="alertasEstoque" className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Alertas de Estoque</h2>
              </div>
              <Link
                href="/dashboard/estoque"
                className="text-xs text-marca-500 hover:underline flex items-center gap-1"
              >
                Gerenciar <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {isLoading ? (
              <Skeleton className="h-40" />
            ) : !fonteOk('estoque') ? (
              <FonteIndisponivel mensagem="Não foi possível ler o resumo de estoque agora." />
            ) : (resumo?.alertasEstoque?.length ?? 0) === 0 ? (
              <div className="flex flex-col items-center py-8 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mb-2 text-green-400" />
                <p className="text-sm text-green-600 font-medium">Estoque saudável</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* `key` = id da linha de saldo: o saldo é por produto × depósito e
                  o mesmo produtoId pode aparecer duas vezes na lista. */}
                {resumo!.alertasEstoque.map((a: AlertaEstoque) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div
                      className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${ESTOQUE_COR[a.status] ?? ''}`}
                    >
                      {a.status.replace(/_/g, ' ')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {a.produto}
                      </p>
                      <p className="text-xs text-slate-400">
                        {a.sku} · {a.deposito}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {a.disponivel}
                      </p>
                      <p className="text-xs text-slate-400">mín: {a.minimo}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      // ── Painel Fiscal ────────────────────────────────────────────────────────
      case 'fiscal':
        return (
          <div key="fiscal" className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Painel Fiscal — 30 dias
                </h2>
              </div>
              <Link
                href="/dashboard/fiscal"
                className="text-xs text-marca-500 hover:underline flex items-center gap-1"
              >
                Abrir módulo <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {isLoading ? (
              <Skeleton className="h-28" />
            ) : !fonteOk('fiscal') ? (
              <FonteIndisponivel mensagem="Não foi possível ler as estatísticas fiscais agora." />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: 'Faturado',
                    value: fmt(resumo?.fiscal?.faturado30d ?? 0),
                    sub: 'NFs emitidas',
                    color: 'text-green-600',
                  },
                  {
                    label: 'Impostos',
                    value: fmt(resumo?.fiscal?.impostos30d ?? 0),
                    sub: 'ICMS+PIS+COFINS',
                    color: 'text-red-500',
                  },
                  {
                    label: 'NFs Emitidas',
                    value: String(resumo?.fiscal?.emitidas30d ?? 0),
                    sub: `taxa ${resumo?.fiscal?.taxaEmissao ?? 0}%`,
                    color: 'text-blue-600',
                  },
                  {
                    label: 'Pendentes',
                    value: String(resumo?.fiscal?.nfsPendentes ?? 0),
                    sub: 'para emitir',
                    color: resumo?.fiscal?.nfsPendentes ? 'text-amber-600' : 'text-slate-400',
                  },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
            )}
            {(resumo?.fiscal?.nfsPendentes ?? 0) > 0 && (
              <Link
                href="/dashboard/fiscal/nova"
                className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 text-sm font-medium hover:bg-cyan-100 transition-colors"
              >
                <Zap className="w-4 h-4" /> Emitir notas pendentes
              </Link>
            )}
          </div>
        );

      // ── Status do Caixa ──────────────────────────────────────────────────────
      case 'caixa':
        return (
          <div key="caixa" className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Caixa</h2>
              </div>
              <Link
                href="/dashboard/caixa"
                className="text-xs text-marca-500 hover:underline flex items-center gap-1"
              >
                Abrir <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {isLoading ? (
              <Skeleton className="h-24" />
            ) : !fonteOk('caixa') ? (
              <FonteIndisponivel mensagem="Não foi possível consultar a sessão de caixa agora." />
            ) : resumo!.caixa.aberto ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-green-600">Aberto</span>
                  <span className="text-xs text-slate-400 truncate">
                    · {resumo!.caixa.operador}
                    {resumo!.caixa.caixa ? ` · ${resumo!.caixa.caixa}` : ''}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                    <p className="text-xs text-slate-400">Entradas</p>
                    <p className="text-sm font-bold text-green-600">
                      {fmt(resumo!.caixa.totalEntradas)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
                    <p className="text-xs text-slate-400">Saídas</p>
                    <p className="text-sm font-bold text-red-500">
                      {fmt(resumo!.caixa.totalSaidas)}
                    </p>
                  </div>
                  {/* Mesmo número do "Saldo em Caixa" da tela de Caixa:
                    saldoEsperadoDinheiro = o que está NA GAVETA. `saldoEsperado`
                    incluiria cartão e PIX e as duas telas se contradiriam. */}
                  <div
                    className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30"
                    title="Dinheiro em caixa (não inclui cartão e PIX)"
                  >
                    <p className="text-xs text-slate-400">Em dinheiro</p>
                    <p className="text-sm font-bold text-indigo-600">
                      {fmt(resumo!.caixa.saldoEmCaixa)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4 text-slate-400">
                <XCircle className="w-9 h-9 mb-2 text-slate-300" />
                <p className="text-sm text-slate-500">Caixa não está aberto</p>
                <Link
                  href="/dashboard/caixa"
                  className="mt-2 text-xs text-marca-500 hover:underline"
                >
                  Abrir caixa agora →
                </Link>
              </div>
            )}
          </div>
        );

      // ── iMestreAI ────────────────────────────────────────────────────────────
      case 'ia':
        return (
          <div key="ia" className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-destaque-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">iMestreAI</h2>
              </div>
              {insights && insights.length > 0 && (
                <span className="text-xs bg-destaque-100 text-destaque-700 dark:bg-destaque-900/30 dark:text-destaque-400 font-medium px-2 py-0.5 rounded-full">
                  {insights.filter((i: Insight) => !i.visualizado).length} novos
                </span>
              )}
            </div>

            {/* Automações sugeridas */}
            {!isLoading && automacoes.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Ações recomendadas
                </p>
                <div className="space-y-2">
                  {automacoes.map((a) => (
                    <div
                      key={a.id}
                      className={`flex gap-3 p-2.5 rounded-lg border-l-4 ${a.tipo === 'alerta' ? 'border-l-red-400 bg-red-50 dark:bg-red-950/20' : a.tipo === 'acao' ? 'border-l-blue-400 bg-blue-50 dark:bg-blue-950/20' : 'border-l-green-400 bg-green-50 dark:bg-green-950/20'}`}
                    >
                      {a.icone === 'zap' && (
                        <Zap className={`w-4 h-4 shrink-0 mt-0.5 ${a.corIcone}`} />
                      )}
                      {a.icone === 'alert' && (
                        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${a.corIcone}`} />
                      )}
                      {a.icone === 'star' && (
                        <Star className={`w-4 h-4 shrink-0 mt-0.5 ${a.corIcone}`} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {a.titulo}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {a.descricao}
                        </p>
                      </div>
                      {a.href && (
                        <Link href={a.href} className="shrink-0 self-center">
                          <ArrowRight className="w-4 h-4 text-slate-400 hover:text-marca-500" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights da IA — três estados, nunca confundidos:
              (a) IA respondeu e não há alertas  → "tudo bem" (uma AFIRMAÇÃO);
              (b) IA respondeu e há alertas      → a lista;
              (c) IA não respondeu               → aviso de indisponibilidade.
              O (c) vem ANTES de qualquer conclusão: sem resposta da IA não se
              sabe se há insights, então não se pode dizer que não há. */}
            <div className="space-y-2">
              {loadingInsights ? (
                Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12" />)
              ) : erroInsights ? (
                // (c) Discreto de propósito: é a ausência de uma opinião, não um
                // problema no negócio — o resto do dashboard segue válido.
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <CloudOff className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Insights da IA indisponíveis
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Não foi possível consultar o iMestreAI agora.
                      {automacoes.length > 0 && ' As ações acima vêm dos dados do próprio ERP.'}
                    </p>
                  </div>
                </div>
              ) : insights && insights.length > 0 ? (
                // (b)
                <>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Insights
                  </p>
                  {insights.slice(0, 3).map((insight: Insight) => (
                    <button
                      key={insight.id}
                      onClick={() => marcarVisualizado.mutate(insight.id)}
                      className={`w-full text-left p-2.5 rounded-r-lg border-l-4 ${INSIGHT_CORES[insight.tipo] ?? 'border-l-slate-300 bg-slate-50 dark:bg-slate-800'} text-sm hover:opacity-80 transition-opacity`}
                    >
                      <p className="font-medium text-slate-700 dark:text-slate-300 text-xs">
                        {insight.titulo}
                      </p>
                      <p className="text-xs mt-0.5 opacity-75 line-clamp-2 text-slate-600 dark:text-slate-400">
                        {insight.descricao}
                      </p>
                    </button>
                  ))}
                </>
              ) : !isLoading && automacoes.length === 0 ? (
                // Sem automações há dois motivos possíveis, e eles são opostos:
                // não há nada a recomendar, OU não foi possível olhar. Dizer
                // "tudo funcionando bem" com as fontes caídas é falso conforto.
                semLeituraDoNegocio ? (
                  <div className="text-center py-6 text-slate-400">
                    <CloudOff className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-slate-500">Sem leitura do negócio agora</p>
                    <p className="text-xs mt-1">
                      {semResumo
                        ? 'Não foi possível ler os dados do negócio — a IA não tem base para recomendar ações.'
                        : `${fontesComFalha} de ${totalFontes} fontes não responderam — a IA não tem base para recomendar ações.`}
                    </p>
                  </div>
                ) : (
                  // (a) Só aqui: a IA respondeu, as fontes responderam, e não há
                  // nada a sinalizar. É a única combinação que sustenta a frase.
                  <div className="text-center py-6 text-slate-400">
                    <Bot className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Tudo funcionando bem!</p>
                    <p className="text-xs mt-1">A IA monitora seu negócio 24h.</p>
                  </div>
                )
              ) : null}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Grid layout por tipo de widget
  const GRID_FULL = new Set<WidgetId>(['kpis', 'charts', 'pipeline']);
  const GRID_HALF = new Set<WidgetId>([
    'topProdutos',
    'pedidosUrgentes',
    'pedidosRecentes',
    'alertasEstoque',
  ]);
  const GRID_THIRD = new Set<WidgetId>(['fiscal', 'caixa', 'ia']);

  // Agrupa widgets de 1/3 para renderizar em linha
  const groupWidgets = () => {
    const rows: React.ReactNode[] = [];
    let thirdBuffer: WidgetId[] = [];

    const flushThirds = () => {
      if (thirdBuffer.length === 0) return;
      rows.push(
        <div
          key={`thirds-${thirdBuffer.join('-')}`}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {thirdBuffer.map((id) => renderWidget(id))}
        </div>,
      );
      thirdBuffer = [];
    };

    let halfBuffer: WidgetId[] = [];
    const flushHalves = () => {
      if (halfBuffer.length === 0) return;
      rows.push(
        <div
          key={`halves-${halfBuffer.join('-')}`}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {halfBuffer.map((id) => renderWidget(id))}
        </div>,
      );
      halfBuffer = [];
    };

    for (const id of widgetOrder) {
      if (GRID_FULL.has(id)) {
        flushHalves();
        flushThirds();
        rows.push(<div key={id}>{renderWidget(id)}</div>);
      } else if (GRID_HALF.has(id)) {
        flushThirds();
        halfBuffer.push(id);
        if (halfBuffer.length === 2) flushHalves();
      } else if (GRID_THIRD.has(id)) {
        flushHalves();
        thirdBuffer.push(id);
        if (thirdBuffer.length === 3) flushThirds();
      }
    }
    flushHalves();
    flushThirds();
    return rows;
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 mt-0.5 text-sm">
            Visão 360° do negócio · atualizado{' '}
            {mounted
              ? lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              : '--:--'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          <button
            onClick={() => setShowCustomize(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Personalizar
          </button>
        </div>
      </div>

      {/* Banner de alertas críticos.
          Aparece com o que se SABE: um alerta real de estoque não some porque a
          fonte dos urgentes caiu. Mas aí o número deixa de ser um total — e o
          banner diz isso, em vez de apresentar uma contagem parcial como final. */}
      {!isLoading && alertasCriticos > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium flex-1">
            {alertasCriticos} alerta(s) crítico(s) requerendo atenção imediata
            {semEstoque > 0 && ` · ${semEstoque} produto(s) sem estoque`}
            {qtdUrgentes > 0 && ` · ${qtdUrgentes} pedido(s) urgente(s)`}
            {!alertasCriticosOk && (
              <span className="font-normal">
                {' '}
                · pode haver mais:{' '}
                {!fonteOk('estoque')
                  ? 'o estoque não respondeu'
                  : 'os pedidos pendentes não responderam'}
              </span>
            )}
          </p>
          <Link
            href="/dashboard/estoque"
            className="text-xs text-red-600 hover:text-red-800 underline shrink-0"
          >
            Ver
          </Link>
        </div>
      )}

      {/* Widgets renderizados na ordem personalizada */}
      {groupWidgets()}

      {/* Atalhos rápidos */}
      <div className="card">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Atalhos Rápidos
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            {
              href: '/dashboard/pedidos/balcao',
              label: 'Nova Venda Balcão',
              color: 'bg-indigo-500 hover:bg-indigo-600',
            },
            {
              href: '/dashboard/pedidos/interna',
              label: 'Novo Pedido Interno',
              color: 'bg-blue-500 hover:bg-blue-600',
            },
            {
              href: '/dashboard/fiscal/nova',
              label: 'Emitir Nota Fiscal',
              color: 'bg-cyan-500 hover:bg-cyan-600',
            },
            // A entrada de estoque NÃO tem página própria: ela acontece no modal
            // de movimentação da tela de Estoque (`openModal('ENTRADA')`, botão
            // "Entrada"). `/dashboard/estoque/entrada` nunca existiu — era 404.
            // A tela não lê query param nenhum, então não há como abrir o modal
            // pelo link; o atalho leva ao lugar REAL, onde o botão está à vista.
            {
              href: '/dashboard/estoque',
              label: 'Entrada de Estoque',
              color: 'bg-green-500 hover:bg-green-600',
            },
            {
              href: '/dashboard/clientes/novo',
              label: 'Novo Cliente',
              color: 'bg-purple-500 hover:bg-purple-600',
            },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-colors ${a.color}`}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Modal de customização */}
      {showCustomize && (
        <CustomizeModal
          widgets={widgets}
          onToggle={toggle}
          onMove={move}
          onReset={reset}
          onClose={() => setShowCustomize(false)}
        />
      )}
    </div>
  );
}
