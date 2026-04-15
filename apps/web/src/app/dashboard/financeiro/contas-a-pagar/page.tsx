'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  TrendingDown,
  ShoppingCart,
  Receipt,
  Building2,
} from 'lucide-react';
import { useLancamentos, usePagarLancamento } from '@/hooks/useFinanceiro';
import type { Lancamento } from '@/hooks/useFinanceiro';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-100 dark:bg-slate-700 ${className ?? ''}`} />;
}

function diasParaVencer(dataVencimento: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const venc = new Date(dataVencimento + 'T00:00:00');
  return Math.round((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

function diasEmAtraso(dataVencimento: string): number {
  return -diasParaVencer(dataVencimento);
}

function isHoje(dataVencimento: string): boolean {
  return diasParaVencer(dataVencimento) === 0;
}

function isEstaSemana(dataVencimento: string): boolean {
  const d = diasParaVencer(dataVencimento);
  return d >= 0 && d <= 7;
}

function isEsteMes(dataVencimento: string): boolean {
  const d = diasParaVencer(dataVencimento);
  return d >= 0 && d <= 31;
}

function CategoryIcon({ categoria }: { categoria: string }) {
  const map: Record<string, React.ReactNode> = {
    Pessoal: <span className="text-blue-500">👥</span>,
    Ocupação: <Building2 className="h-4 w-4 text-slate-500" />,
    Marketing: <span className="text-pink-500">📢</span>,
    Operacional: <span className="text-orange-500">⚙️</span>,
    Impostos: <Receipt className="h-4 w-4 text-red-500" />,
    Compras: <ShoppingCart className="h-4 w-4 text-purple-500" />,
  };
  return <span>{map[categoria] ?? <TrendingDown className="h-4 w-4 text-slate-400" />}</span>;
}

type FilterChip = 'todos' | 'hoje' | 'semana' | 'mes' | 'atrasadas';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContasAPagarPage() {
  const [chipFilter, setChipFilter] = useState<FilterChip>('todos');

  const { data, isLoading } = useLancamentos({
    tipo: 'DESPESA',
    status: 'PENDENTE,ATRASADO',
    limite: 200,
    pagina: 1,
  });
  const pagarMutation = usePagarLancamento();

  const all = data?.dados ?? [];

  // Apply chip filter
  const lancamentos = useMemo(() => {
    return all.filter((l) => {
      if (chipFilter === 'atrasadas') return l.status === 'ATRASADO';
      if (chipFilter === 'hoje') return isHoje(l.dataVencimento);
      if (chipFilter === 'semana') return isEstaSemana(l.dataVencimento) || l.status === 'ATRASADO';
      if (chipFilter === 'mes') return isEsteMes(l.dataVencimento) || l.status === 'ATRASADO';
      return true;
    });
  }, [all, chipFilter]);

  // KPIs
  const totalAPagar = all.reduce((s, l) => s + l.valor, 0);
  const venceHoje = all.filter((l) => isHoje(l.dataVencimento) && l.status !== 'ATRASADO').length;
  const venceSemana = all.filter((l) => isEstaSemana(l.dataVencimento)).length;
  const atrasadas = all.filter((l) => l.status === 'ATRASADO');
  const valorAtrasado = atrasadas.reduce((s, l) => s + l.valor, 0);

  const chips: { key: FilterChip; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'hoje', label: 'Vence Hoje' },
    { key: 'semana', label: 'Esta Semana' },
    { key: 'mes', label: 'Este Mês' },
    { key: 'atrasadas', label: `Atrasadas (${atrasadas.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Contas a Pagar</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Gerencie seus compromissos financeiros
          </p>
        </div>
        <Link
          href="/dashboard/financeiro/lancamentos?tipo=DESPESA"
          className="flex w-fit items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nova Despesa
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-medium text-slate-500">Total a Pagar</p>
          <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">{fmt(totalAPagar)}</p>
          <p className="mt-1 text-xs text-slate-400">{all.length} conta(s)</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-500" />
            <p className="text-xs font-medium text-slate-500">Vence Hoje</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{venceHoje}</p>
          <p className="mt-1 text-xs text-slate-400">conta(s)</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-medium text-slate-500">Vence esta Semana</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{venceSemana}</p>
          <p className="mt-1 text-xs text-slate-400">conta(s)</p>
        </div>
        <div className={`rounded-xl border p-5 ${atrasadas.length > 0 ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'}`}>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className={`h-4 w-4 ${atrasadas.length > 0 ? 'text-red-500' : 'text-slate-400'}`} />
            <p className="text-xs font-medium text-slate-500">Atrasadas</p>
          </div>
          <p className={`mt-2 text-2xl font-bold ${atrasadas.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
            {atrasadas.length}
          </p>
          {atrasadas.length > 0 && (
            <p className="mt-1 text-xs text-red-500 font-medium">{fmt(valorAtrasado)}</p>
          )}
        </div>
      </div>

      {/* Alert Banner */}
      {!isLoading && atrasadas.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950/30">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            <strong>{atrasadas.length} conta(s) em atraso</strong> — total{' '}
            <strong>{fmt(valorAtrasado)}</strong>. Regularize agora para evitar juros!
          </p>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setChipFilter(c.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              chipFilter === c.key
                ? 'bg-red-600 text-white'
                : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : lancamentos.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-4xl">🎉</p>
          <p className="mt-3 font-semibold text-slate-700 dark:text-slate-300">
            Nenhuma conta a pagar pendente
          </p>
          <p className="mt-1 text-sm text-slate-400">Tudo em dia!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lancamentos.map((l) => (
            <ContaCard
              key={l.id}
              lancamento={l}
              onPagar={() => pagarMutation.mutate({ id: l.id })}
              isPaying={pagarMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ContaCard({
  lancamento: l,
  onPagar,
  isPaying,
}: {
  lancamento: Lancamento;
  onPagar: () => void;
  isPaying: boolean;
}) {
  const isAtrasado = l.status === 'ATRASADO';
  const dias = isAtrasado ? diasEmAtraso(l.dataVencimento) : diasParaVencer(l.dataVencimento);

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border bg-white px-5 py-4 dark:bg-slate-800 transition-all ${
        isAtrasado
          ? 'border-l-4 border-l-red-500 border-red-200 dark:border-red-800'
          : 'border-l-4 border-l-amber-400 border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Icon */}
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${isAtrasado ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
        <CategoryIcon categoria={l.categoria} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
            {l.descricao}
          </p>
          {l.origem === 'COMPRA' && (
            <span className="flex-shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              Compra
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3 flex-wrap">
          <span className="text-xs text-slate-500">{l.categoria}</span>
          <span className="text-xs text-slate-400">
            Vence {new Date(l.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
          </span>
          {isAtrasado ? (
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
              {dias} dia(s) em atraso
            </span>
          ) : dias === 0 ? (
            <span className="text-xs font-semibold text-amber-600">Vence hoje!</span>
          ) : (
            <span className="text-xs text-slate-400">{dias} dia(s) restantes</span>
          )}
        </div>
      </div>

      {/* Value + Action */}
      <div className="flex flex-shrink-0 items-center gap-3">
        <p className="text-lg font-bold text-red-600 dark:text-red-400">{fmt(l.valor)}</p>
        <button
          onClick={onPagar}
          disabled={isPaying}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Pagar
        </button>
      </div>
    </div>
  );
}
