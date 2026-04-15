'use client';

/**
 * Central de Marketplaces — visão geral dos canais de venda
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Star,
  MessageSquare,
  Package,
  BarChart2,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import {
  useMarketplaces,
  useStatsMarketplace,
  useSincronizar,
  Marketplace,
} from '@/hooks/useMarketplaces';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function tempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min  = Math.floor(diff / 60000);
  if (min < 1)  return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24)   return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

const CANAL_CONFIG: Record<string, { emoji: string; cor: string; corText: string }> = {
  MERCADO_LIVRE: { emoji: '🟠', cor: 'bg-yellow-100 dark:bg-yellow-900/30',  corText: 'text-yellow-700 dark:text-yellow-400' },
  SHOPEE:        { emoji: '🔴', cor: 'bg-orange-100 dark:bg-orange-900/30',  corText: 'text-orange-700 dark:text-orange-400' },
  AMAZON:        { emoji: '🟤', cor: 'bg-amber-100  dark:bg-amber-900/30',   corText: 'text-amber-700  dark:text-amber-400'  },
  SHOPIFY:       { emoji: '🟢', cor: 'bg-green-100  dark:bg-green-900/30',   corText: 'text-green-700  dark:text-green-400'  },
  MAGALU:        { emoji: '🔵', cor: 'bg-blue-100   dark:bg-blue-900/30',    corText: 'text-blue-700   dark:text-blue-400'   },
};

function StatusIcon({ status }: { status: Marketplace['status'] }) {
  if (status === 'CONECTADO')   return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (status === 'ERRO')        return <XCircle      className="h-4 w-4 text-red-500"   />;
  if (status === 'PAUSADO')     return <PauseCircle  className="h-4 w-4 text-yellow-500" />;
  return <AlertTriangle className="h-4 w-4 text-slate-400" />;
}

function StatusLabel({ status }: { status: Marketplace['status'] }) {
  const map: Record<string, { label: string; cls: string }> = {
    CONECTADO:    { label: 'Conectado',    cls: 'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400'  },
    DESCONECTADO: { label: 'Desconectado', cls: 'bg-slate-100  text-slate-600  dark:bg-slate-700     dark:text-slate-400'  },
    ERRO:         { label: 'Erro',         cls: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400'    },
    PAUSADO:      { label: 'Pausado',      cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  };
  const cfg = map[status] ?? map.DESCONECTADO;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.cls}`}>
      <StatusIcon status={status} />
      {cfg.label}
    </span>
  );
}

function HealthBadge({ score }: { score: number }) {
  if (score >= 80) return (
    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
      Excelente
    </span>
  );
  if (score >= 60) return (
    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
      Bom
    </span>
  );
  return (
    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
      Atenção
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`} />;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Revenue Bar Chart (CSS only) ─────────────────────────────────────────────

function RevenueBarChart({ marketplaces }: { marketplaces: Marketplace[] }) {
  const total = marketplaces.reduce((s, m) => s + m.receitaMes, 0);
  if (total === 0) return null;

  const cores: Record<string, string> = {
    MERCADO_LIVRE: 'bg-yellow-400',
    SHOPEE:        'bg-orange-400',
    AMAZON:        'bg-amber-600',
    SHOPIFY:       'bg-green-500',
    MAGALU:        'bg-blue-500',
  };

  return (
    <div className="space-y-3">
      {marketplaces.map((m) => {
        const pct    = total > 0 ? (m.receitaMes / total) * 100 : 0;
        const pctLiq = m.receitaMes > 0 ? (m.receitaLiquidaMes / m.receitaMes) * 100 : 0;
        const cfg    = CANAL_CONFIG[m.canal] ?? CANAL_CONFIG.SHOPIFY;
        const cor    = cores[m.canal] ?? 'bg-slate-400';
        return (
          <div key={m.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span>{cfg.emoji}</span>
                {m.nome}
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-green-600 dark:text-green-400">
                  {brl(m.receitaLiquidaMes)} líq.
                </span>
                <span>{brl(m.receitaMes)} bruto</span>
                <span className="w-8 text-right font-mono">{pct.toFixed(0)}%</span>
              </div>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className={`absolute left-0 top-0 h-full ${cor} opacity-30 transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
              <div
                className={`absolute left-0 top-0 h-full ${cor} transition-all duration-700`}
                style={{ width: `${pct * (pctLiq / 100)}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
        Barra sólida = receita líquida (após taxas) · Barra clara = receita bruta
      </p>
    </div>
  );
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

function AIInsights({ marketplaces }: { marketplaces: Marketplace[] }) {
  const [aberto, setAberto] = useState(true);

  if (marketplaces.length === 0) return null;

  const melhorMargem = [...marketplaces]
    .filter((m) => m.receitaMes > 0)
    .sort((a, b) => b.receitaLiquidaMes / b.receitaMes - a.receitaLiquidaMes / a.receitaMes)[0];

  const maisPerguntas = [...marketplaces].sort(
    (a, b) => b.perguntasPendentes - a.perguntasPendentes,
  )[0];

  const totalReceitaMes = marketplaces.reduce((s, m) => s + m.receitaMes, 0);
  const dominante       = [...marketplaces].sort((a, b) => b.receitaMes - a.receitaMes)[0];
  const pctDominante    = totalReceitaMes > 0
    ? ((dominante.receitaMes / totalReceitaMes) * 100).toFixed(0)
    : '0';

  const insights = [
    {
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      titulo: 'Melhor margem líquida',
      texto: melhorMargem
        ? `${melhorMargem.nome} tem a maior margem líquida (${((melhorMargem.receitaLiquidaMes / melhorMargem.receitaMes) * 100).toFixed(0)}%), com taxa de plataforma de apenas ${melhorMargem.taxaPlataforma}%.`
        : 'Dados insuficientes.',
    },
    {
      icon: <MessageSquare className="h-4 w-4 text-yellow-500" />,
      titulo: 'Atenção: Perguntas pendentes',
      texto:
        maisPerguntas.perguntasPendentes > 0
          ? `${maisPerguntas.nome} tem ${maisPerguntas.perguntasPendentes} pergunta(s) sem resposta. Taxa de resposta atual: ${maisPerguntas.taxaResposta}%.`
          : 'Nenhuma pergunta pendente. Excelente atendimento!',
    },
    {
      icon: <BarChart2 className="h-4 w-4 text-blue-500" />,
      titulo: 'Concentração de canal',
      texto: `${dominante.nome} representa ${pctDominante}% da receita bruta mensal (${brl(dominante.receitaMes)}). Diversificar pode reduzir riscos.`,
    },
    {
      icon: <Zap className="h-4 w-4 text-purple-500" />,
      titulo: 'Oportunidade de crescimento',
      texto: `A taxa de conversão média nos seus anúncios principais gira em torno de 3–4%. Melhorar fotos e descrições pode aumentar significativamente as vendas.`,
    },
  ];

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50 dark:border-purple-800/50 dark:bg-purple-900/10">
      <button
        onClick={() => setAberto((p) => !p)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <span className="font-semibold text-purple-800 dark:text-purple-200">Insights IA</span>
          <span className="rounded-full bg-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-800 dark:text-purple-300">
            BETA
          </span>
        </div>
        {aberto
          ? <ChevronUp className="h-4 w-4 text-purple-500" />
          : <ChevronDown className="h-4 w-4 text-purple-500" />
        }
      </button>

      {aberto && (
        <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
          {insights.map((ins, i) => (
            <div key={i} className="rounded-lg bg-white p-4 dark:bg-slate-800/60">
              <div className="mb-1 flex items-center gap-2">
                {ins.icon}
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {ins.titulo}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {ins.texto}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Marketplace Card ─────────────────────────────────────────────────────────

function MarketplaceCard({
  marketplace,
  healthScore,
  onSync,
  syncing,
}: {
  marketplace: Marketplace;
  healthScore: number;
  onSync: (id: string) => void;
  syncing: boolean;
}) {
  const cfg = CANAL_CONFIG[marketplace.canal] ?? CANAL_CONFIG.SHOPIFY;

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${cfg.cor}`}>
              {cfg.emoji}
            </div>
            <div>
              <h3 className="font-bold leading-tight text-slate-900 dark:text-slate-100">
                {marketplace.nome}
              </h3>
              <div className="mt-0.5">
                <StatusLabel status={marketplace.status} />
              </div>
            </div>
          </div>
          <HealthBadge score={healthScore} />
        </div>

        {/* Metrics grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {[
            { label: 'Pedidos hoje', val: marketplace.pedidosHoje },
            { label: 'Anúncios ativos', val: marketplace.anunciosAtivos },
            { label: 'Taxa plataforma', val: `${marketplace.taxaPlataforma}%` },
            {
              label: 'Avaliação',
              val: (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {marketplace.avaliacaoVendedor.toFixed(1)}
                </span>
              ),
            },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700/50">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Revenue */}
        <div className="mt-4 rounded-lg border border-slate-100 bg-gradient-to-r from-slate-50 to-white px-3 py-3 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Receita do mês</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-slate-100">
            {brl(marketplace.receitaMes)}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-green-600 dark:text-green-400">
              Líquida: {brl(marketplace.receitaLiquidaMes)}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Taxa: {brl(marketplace.receitaMes - marketplace.receitaLiquidaMes)}
            </p>
          </div>
        </div>

        {/* Response rate bar */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Taxa de resposta</span>
          <span
            className={`font-semibold ${
              marketplace.taxaResposta >= 90
                ? 'text-green-600 dark:text-green-400'
                : 'text-yellow-600 dark:text-yellow-400'
            }`}
          >
            {marketplace.taxaResposta}%
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className={`h-1.5 rounded-full transition-all ${
              marketplace.taxaResposta >= 90 ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${marketplace.taxaResposta}%` }}
          />
        </div>

        {/* Last sync */}
        <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
          Sincronizado {tempoRelativo(marketplace.ultimaSincronizacao)}
        </p>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onSync(marketplace.id)}
            disabled={syncing || marketplace.status === 'ERRO'}
            title={marketplace.status === 'ERRO' ? 'Conexão com erro' : 'Sincronizar'}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            Sincronizar
          </button>
          <Link
            href={`/dashboard/marketplaces/anuncios?canal=${marketplace.canal}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-marca-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-marca-600 dark:bg-marca-600 dark:hover:bg-marca-700"
          >
            <Package className="h-3.5 w-3.5" />
            Anúncios
            <span className="rounded-full bg-white/20 px-1.5 text-[10px]">
              {marketplace.anunciosAtivos}
            </span>
          </Link>
          {marketplace.perguntasPendentes > 0 && (
            <Link
              href={`/dashboard/marketplaces/perguntas?canal=${marketplace.canal}&status=PENDENTE`}
              className="flex items-center justify-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{marketplace.perguntasPendentes}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketplacesPage() {
  const { data: marketplaces = [], isLoading: loadingMkp } = useMarketplaces();
  const { data: stats,              isLoading: loadingStats } = useStatsMarketplace();
  const sincronizar = useSincronizar();
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  const handleSync = async (id: string) => {
    setSyncingIds((prev) => new Set([...prev, id]));
    try {
      await sincronizar.mutateAsync(id);
    } finally {
      setSyncingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleSyncAll = () => {
    marketplaces
      .filter((m) => m.status !== 'ERRO')
      .forEach((m) => void handleSync(m.id));
  };

  const isLoading = loadingMkp || loadingStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            Marketplaces
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gerencie todos os seus canais de venda em um único lugar
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/marketplaces/vendas"
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <BarChart2 className="h-4 w-4" />
            Vendas por Canal
          </Link>
          <button
            onClick={handleSyncAll}
            disabled={syncingIds.size > 0}
            className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-marca-600 disabled:opacity-70 dark:bg-marca-600"
          >
            <RefreshCw className={`h-4 w-4 ${syncingIds.size > 0 ? 'animate-spin' : ''}`} />
            Sincronizar Todos
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPICard
          label="Receita Bruta Mês"
          valor={isLoading ? '...' : brl(stats?.totalReceita ?? 0)}
          icone={<TrendingUp className="h-5 w-5" />}
          variacao={stats?.crescimentoMes}
        />
        <KPICard
          label="Receita Líquida"
          valor={isLoading ? '...' : brl(stats?.totalReceitaLiquida ?? 0)}
          icone={<ShoppingCart className="h-5 w-5" />}
        />
        <KPICard
          label="Total Pedidos Mês"
          valor={isLoading ? '...' : (stats?.totalPedidosMes ?? 0).toLocaleString('pt-BR')}
          icone={<Package className="h-5 w-5" />}
        />
        <KPICard
          label="Perguntas Pendentes"
          valor={isLoading ? '...' : (stats?.perguntasPendentes ?? 0)}
          icone={<MessageSquare className="h-5 w-5" />}
          destaque={(stats?.perguntasPendentes ?? 0) > 0}
        />
      </div>

      {/* Revenue Chart */}
      {!isLoading && marketplaces.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Receita por Canal — Mês Atual
          </h2>
          <RevenueBarChart marketplaces={marketplaces} />
        </div>
      )}

      {/* Marketplace Cards */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-200">
          Canais Conectados
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : marketplaces.map((mkp) => {
                const hs = stats?.healthScore?.find((h) => h.canal === mkp.canal);
                return (
                  <MarketplaceCard
                    key={mkp.id}
                    marketplace={mkp}
                    healthScore={hs?.score ?? 80}
                    onSync={handleSync}
                    syncing={syncingIds.has(mkp.id)}
                  />
                );
              })}
        </div>
      </div>

      {/* Top Anúncios */}
      {!isLoading && stats?.topAnuncios && stats.topAnuncios.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200">
              Top Anúncios (30 dias)
            </h2>
            <Link
              href="/dashboard/marketplaces/anuncios"
              className="text-xs text-marca-600 hover:underline dark:text-marca-400"
            >
              Ver todos →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {['#', 'Produto', 'Canal', 'Vendas', 'Conversão', 'Receita 30d'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 ${
                        i >= 3 ? 'text-right' : 'text-left'
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.topAnuncios.map((a, i) => {
                  const cfg = CANAL_CONFIG[a.canal] ?? CANAL_CONFIG.SHOPIFY;
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/30"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <p className="line-clamp-1 font-medium text-slate-800 dark:text-slate-200">
                          {a.titulo}
                        </p>
                        <p className="font-mono text-[11px] text-slate-400">{a.sku}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.cor} ${cfg.corText}`}
                        >
                          {cfg.emoji} {a.canal.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                        {a.vendas30d}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-semibold ${
                            a.conversao >= 3
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {a.conversao.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800 dark:text-slate-100">
                        {brl(a.receita30d)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {!isLoading && <AIInsights marketplaces={marketplaces} />}
    </div>
  );
}
