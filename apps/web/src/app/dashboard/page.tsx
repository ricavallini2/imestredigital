'use client';

/**
 * Dashboard principal — iMestreDigital ERP
 * Visão 360° do negócio com IA, gráficos, feeds e customização por widget.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  TrendingUp, TrendingDown, ShoppingCart, Package, AlertTriangle,
  Bot, RefreshCw, Settings2, X, FileText, Users, Wallet,
  ArrowRight, Clock, CheckCircle2, XCircle, Zap, BarChart3,
  ChevronUp, ChevronDown, Eye, EyeOff, GripVertical,
  Activity, DollarSign, Star, Sparkles,
} from 'lucide-react';

// Gráficos carregados sem SSR — Recharts usa APIs do browser
const GraficoVendas = dynamic(() => import('@/components/dashboard/GraficoVendas'), { ssr: false });
const GraficoCanal  = dynamic(() => import('@/components/dashboard/GraficoCanal'),  { ssr: false });
import { useDashboardResumo, useRefreshDashboard, useDashboardInsights } from '@/hooks/useDashboard';
import { useMarcarInsightVisualizado } from '@/hooks/useIA';
import type { AlertaEstoque, PedidoRecente, PedidoUrgente, TopProduto } from '@/hooks/useDashboard';
import type { Insight } from '@/types';

// ─── Constantes ───────────────────────────────────────────────────────────────
const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtN = (v: number) => v.toLocaleString('pt-BR');
const fmtPct = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;

const STATUS_COR: Record<string, string> = {
  PENDENTE: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  CONFIRMADO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  SEPARANDO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  SEPARADO: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
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
  | 'kpis' | 'charts' | 'pipeline' | 'topProdutos'
  | 'pedidosRecentes' | 'pedidosUrgentes' | 'alertasEstoque'
  | 'fiscal' | 'caixa' | 'ia';

interface Widget { id: WidgetId; label: string; visible: boolean; }

const WIDGETS_DEFAULT: Widget[] = [
  { id: 'kpis',            label: 'KPIs Principais',       visible: true },
  { id: 'charts',          label: 'Gráficos de Vendas',    visible: true },
  { id: 'pipeline',        label: 'Pipeline de Pedidos',   visible: true },
  { id: 'topProdutos',     label: 'Top Produtos',          visible: true },
  { id: 'pedidosUrgentes', label: 'Pedidos Urgentes',      visible: true },
  { id: 'pedidosRecentes', label: 'Pedidos Recentes',      visible: true },
  { id: 'alertasEstoque',  label: 'Alertas de Estoque',    visible: true },
  { id: 'fiscal',          label: 'Painel Fiscal',         visible: true },
  { id: 'caixa',           label: 'Status do Caixa',       visible: true },
  { id: 'ia',              label: 'iMestreAI',             visible: true },
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
        const merged = WIDGETS_DEFAULT.map(def => {
          const found = parsed.find(p => p.id === def.id);
          return found ?? def;
        });
        setWidgets(merged);
      }
    } catch {}
  }, []);

  const save = useCallback((next: Widget[]) => {
    setWidgets(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const toggle = useCallback((id: WidgetId) => {
    save(widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  }, [widgets, save]);

  const move = useCallback((id: WidgetId, dir: 'up' | 'down') => {
    const idx = widgets.findIndex(w => w.id === id);
    if (idx < 0) return;
    const next = [...widgets];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    save(next);
  }, [widgets, save]);

  const reset = useCallback(() => save(WIDGETS_DEFAULT), [save]);

  const isVisible = useCallback((id: WidgetId) => widgets.find(w => w.id === id)?.visible ?? true, [widgets]);

  return { widgets, toggle, move, reset, isVisible };
}

// ─── Componentes menores ──────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700 ${className}`} />;
}

function KpiCard({
  label, value, sub, icon, trend, trendLabel, color = 'blue', href,
}: {
  label: string; value: string; sub?: string; icon: React.ReactNode;
  trend?: number; trendLabel?: string; color?: string; href?: string;
}) {
  const colors: Record<string, string> = {
    blue:   'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    green:  'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    amber:  'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    red:    'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
    cyan:   'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
    slate:  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };
  const inner = (
    <div className="card h-full group hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white truncate">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {fmtPct(trend)} {trendLabel ?? 'vs mês ant.'}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors[color] ?? colors.blue} shrink-0 ml-3`}>{icon}</div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}


// ─── Seção de customização ───────────────────────────────────────────────────
function CustomizeModal({ widgets, onToggle, onMove, onReset, onClose }: {
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
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {widgets.map((w, i) => (
            <div key={w.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${w.visible ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800' : 'border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 opacity-60'}`}>
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
              <span className="flex-1 text-sm font-medium">{w.label}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => onMove(w.id, 'up')} disabled={i === 0} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-20">
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onMove(w.id, 'down')} disabled={i === widgets.length - 1} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-20">
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onToggle(w.id)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded ml-1">
                  {w.visible ? <Eye className="w-4 h-4 text-marca-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
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
function gerarAutomacoes(resumo: any): Array<{ id: string; tipo: 'acao' | 'alerta' | 'oportunidade'; titulo: string; descricao: string; href?: string; corIcone: string; icone: 'zap' | 'alert' | 'star' }> {
  const items: any[] = [];

  if ((resumo?.estoque?.semEstoque ?? 0) > 0) {
    items.push({
      id: 'sem-estoque',
      tipo: 'alerta',
      icone: 'alert',
      corIcone: 'text-red-500',
      titulo: `${resumo.estoque.semEstoque} produto(s) sem estoque`,
      descricao: 'Produtos zerados estão gerando perda de vendas. Registre uma entrada de estoque agora.',
      href: '/dashboard/estoque?filtro=SEM_ESTOQUE',
    });
  }

  if ((resumo?.pedidosUrgentes?.length ?? 0) >= 3) {
    items.push({
      id: 'pedidos-urgentes',
      tipo: 'alerta',
      icone: 'alert',
      corIcone: 'text-amber-500',
      titulo: `${resumo.pedidosUrgentes.length} pedidos aguardando confirmação`,
      descricao: 'Pedidos parados em PENDENTE há mais de 4h. Confirme ou entre em contato com os clientes.',
      href: '/dashboard/pedidos?status=PENDENTE',
    });
  }

  if ((resumo?.fiscal?.nfsPendentes ?? 0) > 0) {
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

  if ((resumo?.estoque?.estoqueBaixo ?? 0) > 2) {
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

  const taxa = resumo?.fiscal?.taxaEmissao ?? 100;
  if (taxa < 90 && taxa > 0) {
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

  const cresc = resumo?.crescimentoReceita ?? 0;
  if (cresc > 10) {
    items.push({
      id: 'crescimento',
      tipo: 'oportunidade',
      icone: 'star',
      corIcone: 'text-green-500',
      titulo: `Crescimento de ${fmtPct(cresc)} na receita`,
      descricao: 'Excelente performance! Considere ampliar o estoque dos produtos mais vendidos.',
      href: '/dashboard/produtos',
    });
  }

  if (resumo?.clientes?.novosEsteMes > 3) {
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

  if (!resumo?.caixa?.aberto) {
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
  const { data: insights, isLoading: loadingInsights } = useDashboardInsights();
  const marcarVisualizado = useMarcarInsightVisualizado();
  const refresh = useRefreshDashboard();

  const { widgets, toggle, move, reset, isVisible } = useWidgets();

  useEffect(() => { setMounted(true); }, []);

  const handleRefresh = useCallback(() => {
    refresh();
    refetch();
    setLastUpdate(new Date());
  }, [refresh, refetch]);

  const automacoes = useMemo(() => gerarAutomacoes(resumo), [resumo]);

  const crescimento = resumo?.crescimentoReceita ?? 0;
  const alertasCriticos = (resumo?.estoque?.semEstoque ?? 0) + (resumo?.pedidosUrgentes?.length ?? 0);

  // Renderização ordenada de widgets
  const widgetOrder = widgets.filter(w => w.visible).map(w => w.id);

  const renderWidget = (id: WidgetId): React.ReactNode => {
    switch (id) {
      // ── KPIs ────────────────────────────────────────────────────────────────
      case 'kpis': return (
        <div key="kpis" className="space-y-4">
          {/* Linha 1 — 4 KPIs principais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />) : (<>
              <KpiCard label="Receita 30 dias" value={fmt(resumo?.receita30d ?? 0)}
                sub={`7d: ${fmt(resumo?.receita7d ?? 0)}`}
                trend={crescimento} icon={<DollarSign className="w-5 h-5" />}
                color="green" href="/dashboard/pedidos" />
              <KpiCard label="Pedidos 30 dias" value={fmtN(resumo?.pedidos30d ?? 0)}
                sub={`Pendentes: ${fmtN(resumo?.pedidosPendentes ?? 0)}`}
                icon={<ShoppingCart className="w-5 h-5" />} color="blue" href="/dashboard/pedidos" />
              <KpiCard label="Ticket Médio" value={fmt(resumo?.ticketMedio ?? 0)}
                sub="últimos 30 dias" icon={<TrendingUp className="w-5 h-5" />}
                color="purple" />
              <KpiCard label={alertasCriticos > 0 ? 'Alertas Críticos' : 'Estoque OK'}
                value={String(alertasCriticos)}
                sub={`${resumo?.estoque?.estoqueBaixo ?? 0} baixo · ${resumo?.estoque?.semEstoque ?? 0} zerado`}
                icon={<AlertTriangle className="w-5 h-5" />}
                color={alertasCriticos > 0 ? 'red' : 'green'} href="/dashboard/estoque" />
            </>)}
          </div>
          {/* Linha 2 — 4 KPIs secundários */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (<>
              <KpiCard label="NFs Emitidas 30d" value={fmtN(resumo?.fiscal?.emitidas30d ?? 0)}
                sub={`Taxa: ${resumo?.fiscal?.taxaEmissao ?? 0}%`}
                icon={<FileText className="w-5 h-5" />} color="cyan" href="/dashboard/fiscal" />
              <KpiCard label="Impostos 30d" value={fmt(resumo?.fiscal?.impostos30d ?? 0)}
                sub="ICMS + PIS + COFINS"
                icon={<Activity className="w-5 h-5" />} color="indigo" />
              <KpiCard label="Clientes Ativos" value={fmtN(resumo?.clientes?.ativos ?? 0)}
                sub={`+${resumo?.clientes?.novosEsteMes ?? 0} este mês`}
                icon={<Users className="w-5 h-5" />} color="blue" href="/dashboard/clientes" />
              <KpiCard label="Valor em Estoque" value={fmt(resumo?.estoque?.valorEmEstoque ?? 0)}
                sub={`${resumo?.estoque?.totalProdutos ?? 0} SKUs`}
                icon={<Package className="w-5 h-5" />} color="slate" href="/dashboard/estoque" />
            </>)}
          </div>
        </div>
      );

      // ── Gráficos ─────────────────────────────────────────────────────────────
      case 'charts': return (
        <div key="charts" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Receita 7 dias */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-marca-500" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Receita Últimos 7 Dias</h2>
              </div>
              <span className="text-xs text-slate-400">R$</span>
            </div>
            {!mounted || isLoading ? (
              <Skeleton className="h-56" />
            ) : (
              <GraficoVendas data={resumo?.vendas7d ?? []} />
            )}
          </div>

          {/* Pedidos por canal */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-destaque-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Vendas por Canal</h2>
            </div>
            {!mounted || isLoading ? (
              <Skeleton className="h-56" />
            ) : (
              <GraficoCanal data={resumo?.porCanal ?? []} />
            )}
          </div>
        </div>
      );

      // ── Pipeline de pedidos ──────────────────────────────────────────────────
      case 'pipeline': return (
        <div key="pipeline" className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Pipeline de Pedidos</h2>
            </div>
            <Link href="/dashboard/pedidos" className="text-xs text-marca-500 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? <Skeleton className="h-28" /> : (
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {(['PENDENTE','CONFIRMADO','SEPARANDO','SEPARADO','FATURADO','ENVIADO','ENTREGUE','CANCELADO'] as const).map(status => {
                const qtd = resumo?.porStatus?.[status] ?? 0;
                const max = Math.max(...Object.values(resumo?.porStatus ?? {}).map(Number));
                const pct = max > 0 ? (qtd / max) * 100 : 0;
                return (
                  <Link key={status} href={`/dashboard/pedidos?status=${status}`}
                    className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg h-20 flex items-end overflow-hidden">
                      <div className={`w-full rounded-b-lg transition-all group-hover:opacity-80 ${status === 'CANCELADO' ? 'bg-red-400' : status === 'ENTREGUE' ? 'bg-green-400' : 'bg-marca-400'}`}
                        style={{ height: `${Math.max(pct, 8)}%` }} />
                    </div>
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{qtd}</span>
                    <span className="text-[10px] text-slate-400 text-center leading-tight">{status}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );

      // ── Top Produtos ─────────────────────────────────────────────────────────
      case 'topProdutos': return (
        <div key="topProdutos" className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Top Produtos — 30 dias</h2>
            </div>
            <Link href="/dashboard/produtos" className="text-xs text-marca-500 hover:underline flex items-center gap-1">
              Catálogo <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? <Skeleton className="h-40" /> : (
            <div className="space-y-3">
              {(resumo?.topProdutos5 ?? []).map((p: TopProduto, i: number) => {
                const maxReceita = resumo?.topProdutos5?.[0]?.receita ?? 1;
                const pct = (p.receita / maxReceita) * 100;
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-orange-50 text-orange-600'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{p.nome}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-marca-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{p.qtd} un.</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 shrink-0">{fmt(p.receita)}</span>
                  </div>
                );
              })}
              {(resumo?.topProdutos5?.length ?? 0) === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">Sem dados de vendas no período</p>
              )}
            </div>
          )}
        </div>
      );

      // ── Pedidos Urgentes ─────────────────────────────────────────────────────
      case 'pedidosUrgentes': return (
        <div key="pedidosUrgentes" className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Pedidos Urgentes</h2>
            </div>
            <Link href="/dashboard/pedidos?status=PENDENTE" className="text-xs text-marca-500 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? <Skeleton className="h-40" /> : (resumo?.pedidosUrgentes?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center py-8 text-slate-400">
              <CheckCircle2 className="w-10 h-10 mb-2 text-green-400" />
              <p className="text-sm font-medium text-green-600">Tudo em dia!</p>
              <p className="text-xs mt-1">Nenhum pedido pendente urgente</p>
            </div>
          ) : (
            <div className="space-y-2">
              {resumo!.pedidosUrgentes.map((p: PedidoUrgente) => (
                <Link key={p.id} href={`/dashboard/pedidos/${p.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${p.horasAtraso > 24 ? 'bg-red-500' : p.horasAtraso > 8 ? 'bg-amber-500' : 'bg-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{p.numero}</p>
                    <p className="text-xs text-slate-400 truncate">{p.cliente}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{fmt(p.valor)}</p>
                    <p className={`text-xs ${p.horasAtraso > 24 ? 'text-red-500' : 'text-amber-500'}`}>{p.horasAtraso}h atraso</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-marca-500 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      );

      // ── Pedidos Recentes ─────────────────────────────────────────────────────
      case 'pedidosRecentes': return (
        <div key="pedidosRecentes" className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-marca-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Pedidos Recentes</h2>
            </div>
            <Link href="/dashboard/pedidos" className="text-xs text-marca-500 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? <Skeleton className="h-40" /> : (
            <div className="space-y-1">
              {(resumo?.pedidosRecentes ?? []).map((p: PedidoRecente) => (
                <Link key={p.id} href={`/dashboard/pedidos/${p.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{p.numero}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COR[p.status] ?? ''}`}>{p.status}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{p.cliente} · {p.canal.replace('_', ' ')}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 shrink-0">{fmt(p.valor)}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-marca-500 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      );

      // ── Alertas de Estoque ───────────────────────────────────────────────────
      case 'alertasEstoque': return (
        <div key="alertasEstoque" className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Alertas de Estoque</h2>
            </div>
            <Link href="/dashboard/estoque" className="text-xs text-marca-500 hover:underline flex items-center gap-1">
              Gerenciar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? <Skeleton className="h-40" /> : (resumo?.alertasEstoque?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center py-8 text-slate-400">
              <CheckCircle2 className="w-10 h-10 mb-2 text-green-400" />
              <p className="text-sm text-green-600 font-medium">Estoque saudável</p>
            </div>
          ) : (
            <div className="space-y-2">
              {resumo!.alertasEstoque.map((a: AlertaEstoque) => (
                <div key={a.produtoId} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${ESTOQUE_COR[a.status] ?? ''}`}>
                    {a.status.replace('_', ' ')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{a.produto}</p>
                    <p className="text-xs text-slate-400">{a.sku} · {a.deposito}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{a.disponivel}</p>
                    <p className="text-xs text-slate-400">mín: {a.minimo}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

      // ── Painel Fiscal ────────────────────────────────────────────────────────
      case 'fiscal': return (
        <div key="fiscal" className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Painel Fiscal — 30 dias</h2>
            </div>
            <Link href="/dashboard/fiscal" className="text-xs text-marca-500 hover:underline flex items-center gap-1">
              Abrir módulo <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? <Skeleton className="h-28" /> : (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Faturado', value: fmt(resumo?.fiscal?.faturado30d ?? 0), sub: 'NFs emitidas', color: 'text-green-600' },
                { label: 'Impostos', value: fmt(resumo?.fiscal?.impostos30d ?? 0), sub: 'ICMS+PIS+COFINS', color: 'text-red-500' },
                { label: 'NFs Emitidas', value: String(resumo?.fiscal?.emitidas30d ?? 0), sub: `taxa ${resumo?.fiscal?.taxaEmissao ?? 0}%`, color: 'text-blue-600' },
                { label: 'Pendentes', value: String(resumo?.fiscal?.nfsPendentes ?? 0), sub: 'para emitir', color: resumo?.fiscal?.nfsPendentes ? 'text-amber-600' : 'text-slate-400' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          )}
          {(resumo?.fiscal?.nfsPendentes ?? 0) > 0 && (
            <Link href="/dashboard/fiscal/nova" className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 text-sm font-medium hover:bg-cyan-100 transition-colors">
              <Zap className="w-4 h-4" /> Emitir notas pendentes
            </Link>
          )}
        </div>
      );

      // ── Status do Caixa ──────────────────────────────────────────────────────
      case 'caixa': return (
        <div key="caixa" className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-indigo-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Caixa</h2>
            </div>
            <Link href="/dashboard/caixa" className="text-xs text-marca-500 hover:underline flex items-center gap-1">
              Abrir <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? <Skeleton className="h-24" /> : resumo?.caixa?.aberto ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-600">Aberto</span>
                <span className="text-xs text-slate-400">· {resumo.caixa.operador}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                  <p className="text-xs text-slate-400">Entradas</p>
                  <p className="text-sm font-bold text-green-600">{fmt(resumo.caixa.totalEntradas ?? 0)}</p>
                </div>
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
                  <p className="text-xs text-slate-400">Saídas</p>
                  <p className="text-sm font-bold text-red-500">{fmt(resumo.caixa.totalSaidas ?? 0)}</p>
                </div>
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
                  <p className="text-xs text-slate-400">Saldo</p>
                  <p className="text-sm font-bold text-indigo-600">{fmt(resumo.caixa.saldoAtual ?? 0)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-slate-400">
              <XCircle className="w-9 h-9 mb-2 text-slate-300" />
              <p className="text-sm text-slate-500">Caixa não está aberto</p>
              <Link href="/dashboard/caixa" className="mt-2 text-xs text-marca-500 hover:underline">
                Abrir caixa agora →
              </Link>
            </div>
          )}
        </div>
      );

      // ── iMestreAI ────────────────────────────────────────────────────────────
      case 'ia': return (
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
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Ações recomendadas</p>
              <div className="space-y-2">
                {automacoes.map(a => (
                  <div key={a.id} className={`flex gap-3 p-2.5 rounded-lg border-l-4 ${a.tipo === 'alerta' ? 'border-l-red-400 bg-red-50 dark:bg-red-950/20' : a.tipo === 'acao' ? 'border-l-blue-400 bg-blue-50 dark:bg-blue-950/20' : 'border-l-green-400 bg-green-50 dark:bg-green-950/20'}`}>
                    {a.icone === 'zap' && <Zap className={`w-4 h-4 shrink-0 mt-0.5 ${a.corIcone}`} />}
                    {a.icone === 'alert' && <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${a.corIcone}`} />}
                    {a.icone === 'star' && <Star className={`w-4 h-4 shrink-0 mt-0.5 ${a.corIcone}`} />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{a.titulo}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{a.descricao}</p>
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

          {/* Insights da IA */}
          <div className="space-y-2">
            {loadingInsights ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12" />) :
            insights && insights.length > 0 ? (
              <>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Insights</p>
                {insights.slice(0, 3).map((insight: Insight) => (
                  <button key={insight.id} onClick={() => marcarVisualizado.mutate(insight.id)}
                    className={`w-full text-left p-2.5 rounded-r-lg border-l-4 ${INSIGHT_CORES[insight.tipo] ?? 'border-l-slate-300 bg-slate-50 dark:bg-slate-800'} text-sm hover:opacity-80 transition-opacity`}>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-xs">{insight.titulo}</p>
                    <p className="text-xs mt-0.5 opacity-75 line-clamp-2 text-slate-600 dark:text-slate-400">{insight.descricao}</p>
                  </button>
                ))}
              </>
            ) : !isLoading && automacoes.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <Bot className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Tudo funcionando bem!</p>
                <p className="text-xs mt-1">A IA monitora seu negócio 24h.</p>
              </div>
            ) : null}
          </div>
        </div>
      );

      default: return null;
    }
  };

  // Grid layout por tipo de widget
  const GRID_FULL = new Set<WidgetId>(['kpis', 'charts', 'pipeline']);
  const GRID_HALF = new Set<WidgetId>(['topProdutos', 'pedidosUrgentes', 'pedidosRecentes', 'alertasEstoque']);
  const GRID_THIRD = new Set<WidgetId>(['fiscal', 'caixa', 'ia']);

  // Agrupa widgets de 1/3 para renderizar em linha
  const groupWidgets = () => {
    const rows: React.ReactNode[] = [];
    let thirdBuffer: WidgetId[] = [];

    const flushThirds = () => {
      if (thirdBuffer.length === 0) return;
      rows.push(
        <div key={`thirds-${thirdBuffer.join('-')}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {thirdBuffer.map(id => renderWidget(id))}
        </div>
      );
      thirdBuffer = [];
    };

    let halfBuffer: WidgetId[] = [];
    const flushHalves = () => {
      if (halfBuffer.length === 0) return;
      rows.push(
        <div key={`halves-${halfBuffer.join('-')}`} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {halfBuffer.map(id => renderWidget(id))}
        </div>
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
            Visão 360° do negócio · atualizado {mounted ? lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          <button onClick={() => setShowCustomize(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Settings2 className="w-3.5 h-3.5" />
            Personalizar
          </button>
        </div>
      </div>

      {/* Banner de alertas críticos */}
      {!isLoading && alertasCriticos > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium flex-1">
            {alertasCriticos} alerta(s) crítico(s) requerendo atenção imediata
            {(resumo?.estoque?.semEstoque ?? 0) > 0 && ` · ${resumo!.estoque.semEstoque} produto(s) sem estoque`}
            {(resumo?.pedidosUrgentes?.length ?? 0) > 0 && ` · ${resumo!.pedidosUrgentes.length} pedido(s) urgente(s)`}
          </p>
          <Link href="/dashboard/estoque" className="text-xs text-red-600 hover:text-red-800 underline shrink-0">Ver</Link>
        </div>
      )}

      {/* Widgets renderizados na ordem personalizada */}
      {groupWidgets()}

      {/* Atalhos rápidos */}
      <div className="card">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Atalhos Rápidos</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/dashboard/pedidos/balcao', label: 'Nova Venda Balcão', color: 'bg-indigo-500 hover:bg-indigo-600' },
            { href: '/dashboard/pedidos/interna', label: 'Novo Pedido Interno', color: 'bg-blue-500 hover:bg-blue-600' },
            { href: '/dashboard/fiscal/nova', label: 'Emitir Nota Fiscal', color: 'bg-cyan-500 hover:bg-cyan-600' },
            { href: '/dashboard/estoque/entrada', label: 'Entrada de Estoque', color: 'bg-green-500 hover:bg-green-600' },
            { href: '/dashboard/clientes/novo', label: 'Novo Cliente', color: 'bg-purple-500 hover:bg-purple-600' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className={`px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-colors ${a.color}`}>
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
