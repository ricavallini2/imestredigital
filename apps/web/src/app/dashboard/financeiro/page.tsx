'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Wallet, DollarSign, AlertTriangle,
  ChevronRight, Plus, BarChart3, ArrowRight, Clock, CheckCircle2,
  ArrowUpRight, ArrowDownRight, BadgeDollarSign, FileText,
  Landmark, Tag, ShoppingBag,
} from 'lucide-react';
import {
  useResumoFinanceiro, useFluxoCaixa, useLancamentos,
  useContasBancarias, usePagarLancamento,
} from '@/hooks/useFinanceiro';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const fmtDate = (d: string) =>
  new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700 ${className ?? ''}`} />;
}

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function MetricCard({
  label, value, sub, icon, trend, color = 'slate', loading,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'emerald' | 'red' | 'blue' | 'amber' | 'slate' | 'purple';
  loading?: boolean;
}) {
  const palette = {
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400', val: 'text-emerald-700 dark:text-emerald-300' },
    red:     { bg: 'bg-red-50 dark:bg-red-900/20',     icon: 'text-red-600 dark:text-red-400',     val: 'text-red-700 dark:text-red-300' },
    blue:    { bg: 'bg-blue-50 dark:bg-blue-900/20',   icon: 'text-blue-600 dark:text-blue-400',   val: 'text-blue-700 dark:text-blue-300' },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400', val: 'text-amber-700 dark:text-amber-300' },
    slate:   { bg: 'bg-slate-50 dark:bg-slate-700/50', icon: 'text-slate-600 dark:text-slate-300', val: 'text-slate-900 dark:text-slate-100' },
    purple:  { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', val: 'text-purple-700 dark:text-purple-300' },
  };
  const p = palette[color];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${p.bg} ${p.icon}`}>
          {icon}
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-7 w-36" />
      ) : (
        <p className={`mt-3 text-2xl font-bold tracking-tight ${p.val}`}>{value}</p>
      )}
      <div className="mt-2 flex items-center justify-between">
        {sub && !loading && (
          <span className="text-xs text-slate-400 dark:text-slate-500">{sub}</span>
        )}
        {trend && !loading && (
          <span className={`ml-auto flex items-center gap-0.5 text-xs font-semibold ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend.value >= 0
              ? <ArrowUpRight className="h-3 w-3" />
              : <ArrowDownRight className="h-3 w-3" />
            }
            {Math.abs(trend.value).toFixed(1)}% {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { cls: string; label: string }> = {
    PAGO:      { cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Pago' },
    PENDENTE:  { cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',         label: 'Pendente' },
    ATRASADO:  { cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',                 label: 'Atrasado' },
    CANCELADO: { cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',            label: 'Cancelado' },
  };
  const c = cfg[status] ?? cfg.PENDENTE;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${c.cls}`}>
      {status === 'ATRASADO' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
      {c.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FinanceiroPage() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const { data: resumo, isLoading: loadingResumo } = useResumoFinanceiro();
  const { data: fluxoData, isLoading: loadingFluxo } = useFluxoCaixa(6);
  const { data: lancamentosData, isLoading: loadingLanc } = useLancamentos({ pagina: 1, limite: 6 });
  const { data: contasData } = useContasBancarias();
  const pagarMutation = usePagarLancamento();

  const lancamentos = lancamentosData?.dados ?? [];
  const contas = contasData ?? [];
  const fluxo = fluxoData ?? [];
  const saldoContas = contas.reduce((s, c) => s + (c.ativa ? c.saldoAtual : 0), 0);
  const maxFluxo = fluxo.length ? Math.max(...fluxo.map((f) => Math.max(f.receitas, f.despesas, 1))) : 1;

  const temAtrasados = (resumo?.contasAtrasadas ?? 0) > 0;
  const resultadoPositivo = (resumo?.resultadoMes ?? 0) >= 0;
  const margem = resumo?.receitasMes
    ? (((resumo.receitasMes - resumo.despesasMes) / resumo.receitasMes) * 100)
    : 0;

  const modulos = [
    { href: '/dashboard/financeiro/lancamentos',     icon: FileText,        label: 'Lançamentos',     desc: 'Receitas e despesas',         color: 'text-slate-600 dark:text-slate-400',   bg: 'bg-slate-50 dark:bg-slate-700/50' },
    { href: '/dashboard/financeiro/contas-a-pagar',  icon: TrendingDown,    label: 'A Pagar',          desc: brl(resumo?.aPagar ?? 0),      color: 'text-red-600 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-900/20' },
    { href: '/dashboard/financeiro/contas-a-receber',icon: TrendingUp,      label: 'A Receber',        desc: brl(resumo?.aReceber ?? 0),    color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { href: '/dashboard/financeiro/dre',             icon: BarChart3,       label: 'DRE',              desc: 'Resultado do exercício',      color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { href: '/dashboard/financeiro/contas',          icon: Landmark,        label: 'Contas',           desc: contas.length ? `${contas.filter(c=>c.ativa).length} ativa(s)` : 'Bancárias', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { href: '/dashboard/financeiro/categorias',      icon: Tag,             label: 'Categorias',       desc: 'Plano de contas',             color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { href: '/dashboard/cobranca',                   icon: BadgeDollarSign, label: 'Cobrança',         desc: 'Títulos vencidos + IA',       color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { href: '/dashboard/compras',                    icon: ShoppingBag,     label: 'Compras',          desc: 'Pedidos de compra',           color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Financeiro</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Visão geral · {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/financeiro/lancamentos?tipo=DESPESA"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Despesa
          </Link>
          <Link
            href="/dashboard/financeiro/lancamentos?tipo=RECEITA"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Receita
          </Link>
          <Link
            href="/dashboard/financeiro/dre"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <BarChart3 className="h-4 w-4" /> DRE
          </Link>
        </div>
      </div>

      {/* ── Alert Banner ── */}
      {!loadingResumo && temAtrasados && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950/30">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-300 truncate">
              <strong>{resumo?.contasAtrasadas} título(s) em atraso</strong> — {brl(resumo?.valorAtrasado ?? 0)} a regularizar
            </p>
          </div>
          <Link
            href="/dashboard/cobranca"
            className="flex-shrink-0 flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
          >
            <BadgeDollarSign className="h-3.5 w-3.5" />
            Cobrança IA
          </Link>
        </div>
      )}

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Saldo em Contas"
          value={loadingResumo ? '' : brl(saldoContas || resumo?.saldoContas || 0)}
          sub={`${contas.filter(c => c.ativa).length || '–'} conta(s) ativa(s)`}
          icon={<Wallet className="h-4 w-4" />}
          color="emerald"
          loading={loadingResumo}
        />
        <MetricCard
          label="Resultado do Mês"
          value={loadingResumo ? '' : brl(resumo?.resultadoMes ?? 0)}
          sub={`Margem: ${margem.toFixed(1)}%`}
          icon={resultadoPositivo ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          trend={resumo ? { value: resumo.crescimentoReceitas ?? 0, label: 'receitas' } : undefined}
          color={resultadoPositivo ? 'emerald' : 'red'}
          loading={loadingResumo}
        />
        <MetricCard
          label="A Receber"
          value={loadingResumo ? '' : brl(resumo?.aReceber ?? 0)}
          sub="receitas pendentes"
          icon={<Clock className="h-4 w-4" />}
          color="blue"
          loading={loadingResumo}
        />
        <MetricCard
          label="A Pagar"
          value={loadingResumo ? '' : brl(resumo?.aPagar ?? 0)}
          sub={temAtrasados ? `${resumo?.contasAtrasadas} em atraso` : 'despesas pendentes'}
          icon={<DollarSign className="h-4 w-4" />}
          color={temAtrasados ? 'red' : 'amber'}
          loading={loadingResumo}
        />
      </div>

      {/* ── Middle row: Fluxo + Módulos ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Fluxo de Caixa — ocupa 2/3 */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Fluxo de Caixa</h2>
              <p className="text-xs text-slate-400 mt-0.5">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Receitas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-400" /> Despesas
              </span>
            </div>
          </div>

          {loadingFluxo ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="flex items-end justify-between gap-2" style={{ height: '192px' }}>
              {fluxo.map((f, idx) => {
                const hr = maxFluxo > 0 ? (f.receitas / maxFluxo) * 160 : 4;
                const hd = maxFluxo > 0 ? (f.despesas / maxFluxo) * 160 : 4;
                const saldo = f.saldo ?? f.receitas - f.despesas;
                const mesLabel = f.mes ?? (f.periodo ? MESES[new Date(f.periodo + '-01').getMonth()] : MESES[idx]);
                const isHovered = hoveredBar === idx;
                return (
                  <div
                    key={idx}
                    className="group flex flex-1 cursor-default flex-col items-center gap-1"
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {isHovered && (
                      <div className="absolute -mt-14 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg dark:bg-slate-700 z-10 pointer-events-none whitespace-nowrap">
                        <div>↑ {brl(f.receitas)}</div>
                        <div>↓ {brl(f.despesas)}</div>
                        <div className={saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                          = {brl(saldo)}
                        </div>
                      </div>
                    )}
                    <div className="w-full flex gap-0.5 items-end" style={{ height: '160px' }}>
                      <div
                        className={`flex-1 rounded-t transition-all ${isHovered ? 'bg-emerald-500' : 'bg-emerald-400'} dark:bg-emerald-600`}
                        style={{ height: `${Math.max(hr, 3)}px` }}
                      />
                      <div
                        className={`flex-1 rounded-t transition-all ${isHovered ? 'bg-red-500' : 'bg-red-400'} dark:bg-red-600`}
                        style={{ height: `${Math.max(hd, 3)}px` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">{mesLabel}</span>
                    <span className={`text-[11px] font-bold ${saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {saldo >= 0 ? '+' : ''}{(saldo / 1000).toFixed(1)}k
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Despesas por categoria */}
          {!loadingResumo && (resumo?.topDespesas?.length ?? 0) > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-700">
              <p className="mb-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Top Despesas</p>
              <div className="space-y-2">
                {(resumo?.topDespesas ?? []).slice(0, 4).map((d, i) => {
                  const colors = ['bg-red-500','bg-orange-400','bg-amber-400','bg-rose-400'];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-28 truncate text-xs text-slate-600 dark:text-slate-400 flex-shrink-0">{d.categoria}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
                        <div className={`h-1.5 rounded-full ${colors[i]}`} style={{ width: `${Math.min(d.percentual, 100)}%` }} />
                      </div>
                      <span className="w-16 text-right text-xs font-medium text-slate-500">{d.percentual.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Módulos — ocupa 1/3 */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Módulos</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {modulos.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors dark:hover:bg-slate-750 group"
              >
                <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${m.bg}`}>
                  <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-none">{m.label}</p>
                  <p className="mt-0.5 text-xs text-slate-400 truncate">{m.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lançamentos Recentes ── */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Lançamentos Recentes</h2>
          </div>
          <Link
            href="/dashboard/financeiro/lancamentos"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {loadingLanc ? (
            <div className="space-y-2 p-5">
              {[1,2,3,4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : lancamentos.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              Nenhum lançamento encontrado.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
                  <th className="px-5 py-3">Data</th>
                  <th className="px-3 py-3">Descrição</th>
                  <th className="hidden px-3 py-3 md:table-cell">Categoria</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Valor</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {lancamentos.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-500">
                      {fmtDate(l.dataVencimento)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${l.tipo === 'RECEITA' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {l.tipo === 'RECEITA' ? '↑' : '↓'}
                        </span>
                        <span className="max-w-[180px] truncate font-medium text-slate-900 dark:text-slate-100">
                          {l.descricao}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-3 py-3 text-xs text-slate-400 md:table-cell">
                      {l.categoria}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className={`whitespace-nowrap px-3 py-3 text-right text-sm font-bold ${l.tipo === 'RECEITA' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {l.tipo === 'RECEITA' ? '+' : '−'} {brl(l.valor)}
                    </td>
                    <td className="px-3 py-3">
                      {(l.status === 'PENDENTE' || l.status === 'ATRASADO') && (
                        <button
                          onClick={() => pagarMutation.mutate({ id: l.id })}
                          disabled={pagarMutation.isPending}
                          title="Marcar como pago"
                          className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50 dark:bg-emerald-900/30 dark:text-emerald-400"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Pagar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
