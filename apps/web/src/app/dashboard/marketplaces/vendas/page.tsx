'use client';

/**
 * Página de Vendas por Canal
 * Análise comparativa de receita entre marketplaces com tendências mensais
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Sparkles,
  DollarSign,
  ShoppingCart,
  Percent,
} from 'lucide-react';
import { useStatsMarketplace, VendaCanal } from '@/hooks/useMarketplaces';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function nomeMes(mes: string): string {
  const [, m] = mes.split('-');
  const nomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return nomes[parseInt(m, 10) - 1] ?? mes;
}

const CANAL_CONFIG: Record<string, { emoji: string; label: string; cor: string; corText: string; barCor: string }> = {
  MERCADO_LIVRE: { emoji: '🟠', label: 'Mercado Livre', cor: 'bg-yellow-100 dark:bg-yellow-900/30', corText: 'text-yellow-700 dark:text-yellow-400', barCor: 'bg-yellow-400' },
  SHOPEE:        { emoji: '🔴', label: 'Shopee',        cor: 'bg-orange-100 dark:bg-orange-900/30', corText: 'text-orange-700 dark:text-orange-400', barCor: 'bg-orange-400' },
  AMAZON:        { emoji: '🟤', label: 'Amazon',        cor: 'bg-amber-100  dark:bg-amber-900/30',  corText: 'text-amber-700  dark:text-amber-400',  barCor: 'bg-amber-600'  },
  SHOPIFY:       { emoji: '🟢', label: 'Shopify',       cor: 'bg-green-100  dark:bg-green-900/30',  corText: 'text-green-700  dark:text-green-400',  barCor: 'bg-green-500'  },
  MAGALU:        { emoji: '🔵', label: 'Magalu',        cor: 'bg-blue-100   dark:bg-blue-900/30',   corText: 'text-blue-700   dark:text-blue-400',   barCor: 'bg-blue-500'   },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`} />;
}

// ─── Stacked Bar Chart ────────────────────────────────────────────────────────

interface StackedBarChartProps {
  meses: string[];
  vendasPorCanal: VendaCanal[];
  canaisAtivos: string[];
}

function StackedBarChart({ meses, vendasPorCanal, canaisAtivos }: StackedBarChartProps) {
  const receitasPorMes = useMemo(() => {
    return meses.map((mes) => {
      const dadosMes = vendasPorCanal.filter((v) => v.mes === mes && canaisAtivos.includes(v.canal));
      const total = dadosMes.reduce((s, v) => s + v.receita, 0);
      return { mes, total, porCanal: dadosMes };
    });
  }, [meses, vendasPorCanal, canaisAtivos]);

  const maxTotal = Math.max(...receitasPorMes.map((m) => m.total), 1);

  return (
    <div className="mt-4">
      {/* Bars */}
      <div className="flex h-48 items-end gap-3">
        {receitasPorMes.map(({ mes, total, porCanal }) => {
          const pctTotal = (total / maxTotal) * 100;
          return (
            <div key={mes} className="flex flex-1 flex-col items-center gap-1">
              <div className="group relative flex w-full flex-col justify-end" style={{ height: '160px' }}>
                <div
                  className="flex w-full flex-col-reverse overflow-hidden rounded-t-md transition-all duration-700"
                  style={{ height: `${pctTotal}%` }}
                >
                  {canaisAtivos.map((canal) => {
                    const venda = porCanal.find((v) => v.canal === canal);
                    if (!venda) return null;
                    const pctCanal = total > 0 ? (venda.receita / total) * 100 : 0;
                    const cfg = CANAL_CONFIG[canal] ?? CANAL_CONFIG.SHOPIFY;
                    return (
                      <div
                        key={canal}
                        className={`w-full ${cfg.barCor} transition-all`}
                        style={{ height: `${pctCanal}%` }}
                        title={`${cfg.label}: ${brl(venda.receita)}`}
                      />
                    );
                  })}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-2 shadow-lg text-[11px] group-hover:block dark:border-slate-700 dark:bg-slate-800 z-10 min-w-[120px]">
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">{nomeMes(mes)}</p>
                  {porCanal.map((v) => {
                    const cfg = CANAL_CONFIG[v.canal];
                    return (
                      <p key={v.canal} className="text-slate-600 dark:text-slate-400">
                        {cfg?.emoji} {brl(v.receita)}
                      </p>
                    );
                  })}
                  <p className="mt-1 font-bold text-slate-800 dark:text-slate-200 border-t border-slate-100 dark:border-slate-700 pt-1">
                    Total: {brl(total)}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {nomeMes(mes)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {canaisAtivos.map((canal) => {
          const cfg = CANAL_CONFIG[canal] ?? CANAL_CONFIG.SHOPIFY;
          return (
            <div key={canal} className="flex items-center gap-1.5">
              <div className={`h-3 w-3 rounded-sm ${cfg.barCor}`} />
              <span className="text-xs text-slate-600 dark:text-slate-400">{cfg.emoji} {cfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Channel Card ─────────────────────────────────────────────────────────────

interface ChannelCardProps {
  canal: string;
  vendas: VendaCanal[];
  mesAtual: string;
  mesAnterior: string;
}

function ChannelCard({ canal, vendas, mesAtual, mesAnterior }: ChannelCardProps) {
  const cfg      = CANAL_CONFIG[canal] ?? CANAL_CONFIG.SHOPIFY;
  const atual    = vendas.find((v) => v.mes === mesAtual);
  const anterior = vendas.find((v) => v.mes === mesAnterior);

  if (!atual) return null;

  const crescimento = anterior && anterior.receita > 0
    ? ((atual.receita - anterior.receita) / anterior.receita) * 100
    : 0;

  const taxaValor = atual.receita - atual.receitaLiquida;
  const margem    = atual.receita > 0 ? (atual.receitaLiquida / atual.receita) * 100 : 0;
  const ticket    = atual.pedidos > 0 ? atual.receita / atual.pedidos : 0;

  return (
    <div className={`rounded-xl border-2 ${cfg.cor.replace('bg-', 'border-').replace('dark:bg-', 'dark:border-')} bg-white p-5 dark:bg-slate-800`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{cfg.emoji}</span>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{cfg.label}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Taxa: {atual.taxaPlataforma}%</p>
          </div>
        </div>
        {crescimento !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${crescimento > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            {crescimento > 0
              ? <TrendingUp className="h-4 w-4" />
              : <TrendingDown className="h-4 w-4" />
            }
            {Math.abs(crescimento).toFixed(1)}%
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Receita bruta</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{brl(atual.receita)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Taxa plataforma</span>
          <span className="font-medium text-red-500 dark:text-red-400">-{brl(taxaValor)}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-slate-100 pt-2 dark:border-slate-700">
          <span className="font-medium text-slate-600 dark:text-slate-300">Receita líquida</span>
          <span className="font-bold text-green-600 dark:text-green-400">{brl(atual.receitaLiquida)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Pedidos</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{atual.pedidos}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Ticket médio</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{brl(ticket)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Margem líquida</span>
          <span className={`font-bold ${margem >= 85 ? 'text-green-600 dark:text-green-400' : margem >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'}`}>
            {margem.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Revenue Table ────────────────────────────────────────────────────────────

interface RevenueTableProps {
  meses: string[];
  vendasPorCanal: VendaCanal[];
  canaisAtivos: string[];
}

function RevenueTable({ meses, vendasPorCanal, canaisAtivos }: RevenueTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-700">
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Mês
            </th>
            {canaisAtivos.map((canal) => {
              const cfg = CANAL_CONFIG[canal] ?? CANAL_CONFIG.SHOPIFY;
              return (
                <th key={canal} className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {cfg.emoji} {cfg.label.split(' ')[0]}
                </th>
              );
            })}
            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {meses.map((mes, i) => {
            const total = vendasPorCanal
              .filter((v) => v.mes === mes && canaisAtivos.includes(v.canal))
              .reduce((s, v) => s + v.receita, 0);

            const ultimoMes = meses[meses.length - 1] === mes;

            return (
              <tr
                key={mes}
                className={`border-b border-slate-50 last:border-0 dark:border-slate-700/50 ${
                  ultimoMes ? 'bg-marca-50/50 dark:bg-marca-900/10' : ''
                }`}
              >
                <td className={`px-4 py-3 font-medium ${ultimoMes ? 'text-marca-700 dark:text-marca-400' : 'text-slate-600 dark:text-slate-400'}`}>
                  {nomeMes(mes)} {mes.split('-')[0] !== '2026' ? mes.split('-')[0] : ''}
                  {ultimoMes && <span className="ml-2 text-[10px] rounded-full bg-marca-100 dark:bg-marca-900/30 text-marca-600 dark:text-marca-400 px-1.5 py-0.5">Atual</span>}
                </td>
                {canaisAtivos.map((canal) => {
                  const venda = vendasPorCanal.find((v) => v.mes === mes && v.canal === canal);
                  return (
                    <td key={canal} className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                      {venda ? brl(venda.receita) : '—'}
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-right font-bold text-slate-800 dark:text-slate-100">
                  {brl(total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Fee Impact ───────────────────────────────────────────────────────────────

function FeeImpact({ vendasPorCanal, canaisAtivos }: { vendasPorCanal: VendaCanal[]; canaisAtivos: string[] }) {
  const dadosPorCanal = canaisAtivos.map((canal) => {
    const vendas = vendasPorCanal.filter((v) => v.canal === canal);
    const totalBruto   = vendas.reduce((s, v) => s + v.receita, 0);
    const totalLiquido = vendas.reduce((s, v) => s + v.receitaLiquida, 0);
    const taxaTotal    = totalBruto - totalLiquido;
    const pctTaxa      = vendas[0]?.taxaPlataforma ?? 0;
    return { canal, totalBruto, totalLiquido, taxaTotal, pctTaxa };
  });

  const maxBruto = Math.max(...dadosPorCanal.map((d) => d.totalBruto), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">
        Impacto das Taxas (período completo)
      </h3>
      <div className="space-y-4">
        {dadosPorCanal.map(({ canal, totalBruto, taxaTotal, pctTaxa }) => {
          const cfg     = CANAL_CONFIG[canal] ?? CANAL_CONFIG.SHOPIFY;
          const pctBarra = (totalBruto / maxBruto) * 100;

          return (
            <div key={canal} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  {cfg.emoji} {cfg.label}
                  <span className={`text-xs rounded-full px-1.5 py-0.5 ${cfg.cor} ${cfg.corText}`}>
                    {pctTaxa}%
                  </span>
                </span>
                <span className="text-xs text-red-500 dark:text-red-400 font-medium">
                  -{brl(taxaTotal)} em taxas
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className={`absolute left-0 top-0 h-full ${cfg.barCor} opacity-30`}
                  style={{ width: `${pctBarra}%` }}
                />
                <div
                  className={`absolute left-0 top-0 h-full ${cfg.barCor}`}
                  style={{ width: `${pctBarra * (1 - pctTaxa / 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
        Barra sólida = receita líquida · Barra clara = receita bruta total
      </p>
    </div>
  );
}

// ─── AI Summary ───────────────────────────────────────────────────────────────

function AISummary({ vendasPorCanal, canaisAtivos, meses }: { vendasPorCanal: VendaCanal[]; canaisAtivos: string[]; meses: string[] }) {
  const totalGeral = vendasPorCanal.reduce((s, v) => s + v.receita, 0);
  const totalLiquido = vendasPorCanal.reduce((s, v) => s + v.receitaLiquida, 0);
  const totalTaxas = totalGeral - totalLiquido;

  const melhorCanal = canaisAtivos
    .map((canal) => {
      const vendas = vendasPorCanal.filter((v) => v.canal === canal);
      return {
        canal,
        receita: vendas.reduce((s, v) => s + v.receita, 0),
        taxa: vendas[0]?.taxaPlataforma ?? 0,
      };
    })
    .sort((a, b) => b.receita - a.receita)[0];

  const canalMenorTaxa = canaisAtivos
    .map((canal) => ({ canal, taxa: vendasPorCanal.find((v) => v.canal === canal)?.taxaPlataforma ?? 99 }))
    .sort((a, b) => a.taxa - b.taxa)[0];

  const cfg = melhorCanal ? (CANAL_CONFIG[melhorCanal.canal] ?? CANAL_CONFIG.SHOPIFY) : null;
  const pct = totalGeral > 0 && melhorCanal ? ((melhorCanal.receita / totalGeral) * 100).toFixed(0) : '0';

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-800/50 dark:bg-purple-900/10">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <span className="font-semibold text-purple-800 dark:text-purple-200">Análise IA</span>
      </div>
      <div className="rounded-lg bg-white p-4 dark:bg-slate-800/60">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {cfg && melhorCanal && (
            <>
              {cfg.emoji} O <strong>{cfg.label}</strong> representa <strong>{pct}%</strong> da receita bruta total
              ({brl(melhorCanal.receita)}), mas tem uma taxa de <strong>{melhorCanal.taxa}%</strong> sobre as vendas.{' '}
            </>
          )}
          {canalMenorTaxa && canalMenorTaxa.taxa > 0 && (
            <>
              Para maximizar a margem líquida, considere priorizar o{' '}
              <strong>{CANAL_CONFIG[canalMenorTaxa.canal]?.label ?? canalMenorTaxa.canal}</strong> com menor taxa de{' '}
              <strong>{canalMenorTaxa.taxa}%</strong>.{' '}
            </>
          )}
          No período analisado ({meses.length} meses), você pagou{' '}
          <strong className="text-red-600 dark:text-red-400">{brl(totalTaxas)}</strong> em taxas de plataformas,
          mantendo uma margem líquida de <strong className="text-green-600 dark:text-green-400">
            {totalGeral > 0 ? ((totalLiquido / totalGeral) * 100).toFixed(0) : 0}%
          </strong> sobre a receita bruta total de <strong>{brl(totalGeral)}</strong>.
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PERIODOS = [
  { label: 'Últimos 3 meses', value: 3 },
  { label: 'Últimos 6 meses', value: 6 },
];

export default function VendasPage() {
  const [periodo, setPeriodo] = useState(6);

  const { data: stats, isLoading } = useStatsMarketplace();

  const { meses, vendasFiltradas, canaisAtivos, mesAtual, mesAnterior } = useMemo(() => {
    if (!stats?.vendasPorCanal) {
      return { meses: [], vendasFiltradas: [], canaisAtivos: [], mesAtual: '', mesAnterior: '' };
    }

    const allMeses = [...new Set(stats.vendasPorCanal.map((v) => v.mes))].sort();
    const mesesFiltrados = allMeses.slice(-periodo);
    const vendas = stats.vendasPorCanal.filter((v) => mesesFiltrados.includes(v.mes));
    const canais = [...new Set(vendas.map((v) => v.canal))].sort();
    const ultimo = mesesFiltrados[mesesFiltrados.length - 1] ?? '';
    const penultimo = mesesFiltrados[mesesFiltrados.length - 2] ?? '';

    return {
      meses: mesesFiltrados,
      vendasFiltradas: vendas,
      canaisAtivos: canais,
      mesAtual: ultimo,
      mesAnterior: penultimo,
    };
  }, [stats, periodo]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/marketplaces"
            className="flex items-center gap-1 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Vendas por Canal
            </h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Comparativo de receita e taxas por marketplace
            </p>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
          {PERIODOS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                periodo === p.value
                  ? 'bg-marca-500 text-white dark:bg-marca-600'
                  : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs do período */}
      {!isLoading && vendasFiltradas.length > 0 && (() => {
        const totalBruto   = vendasFiltradas.reduce((s, v) => s + v.receita, 0);
        const totalLiquido = vendasFiltradas.reduce((s, v) => s + v.receitaLiquida, 0);
        const totalPedidos = vendasFiltradas.reduce((s, v) => s + v.pedidos, 0);
        const totalTaxas   = totalBruto - totalLiquido;

        return (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: `Receita Bruta (${meses.length}m)`, value: brl(totalBruto), icon: <TrendingUp className="h-5 w-5" />, cls: '' },
              { label: 'Receita Líquida', value: brl(totalLiquido), icon: <DollarSign className="h-5 w-5" />, cls: 'text-green-600 dark:text-green-400' },
              { label: 'Total Pedidos', value: totalPedidos.toLocaleString('pt-BR'), icon: <ShoppingCart className="h-5 w-5" />, cls: '' },
              { label: 'Taxas Pagas', value: brl(totalTaxas), icon: <Percent className="h-5 w-5" />, cls: 'text-red-500 dark:text-red-400' },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{kpi.label}</p>
                    <p className={`mt-1 text-xl font-bold text-slate-800 dark:text-slate-100 ${kpi.cls}`}>
                      {kpi.value}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">{kpi.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Channel Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <Skeleton className="h-8 w-36 mb-4" />
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full mb-2" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {canaisAtivos.map((canal) => (
            <ChannelCard
              key={canal}
              canal={canal}
              vendas={vendasFiltradas.filter((v) => v.canal === canal)}
              mesAtual={mesAtual}
              mesAnterior={mesAnterior}
            />
          ))}
        </div>
      )}

      {/* Stacked Bar Chart */}
      {!isLoading && meses.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">
            Evolução de Receita por Canal
          </h2>
          <StackedBarChart
            meses={meses}
            vendasPorCanal={vendasFiltradas}
            canaisAtivos={canaisAtivos}
          />
        </div>
      )}

      {/* Revenue Table */}
      {!isLoading && meses.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">
            Receita Detalhada por Mês
          </h2>
          <RevenueTable
            meses={meses}
            vendasPorCanal={vendasFiltradas}
            canaisAtivos={canaisAtivos}
          />
        </div>
      )}

      {/* Fee Impact */}
      {!isLoading && vendasFiltradas.length > 0 && (
        <FeeImpact vendasPorCanal={vendasFiltradas} canaisAtivos={canaisAtivos} />
      )}

      {/* AI Summary */}
      {!isLoading && vendasFiltradas.length > 0 && (
        <AISummary
          vendasPorCanal={vendasFiltradas}
          canaisAtivos={canaisAtivos}
          meses={meses}
        />
      )}
    </div>
  );
}
