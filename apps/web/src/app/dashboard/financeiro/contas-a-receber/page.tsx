'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Store,
  BadgeDollarSign,
  ExternalLink,
} from 'lucide-react';
import { useLancamentos, usePagarLancamento, useEnviarCobranca } from '@/hooks/useFinanceiro';
import type { Lancamento } from '@/hooks/useFinanceiro';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-100 dark:bg-slate-700 ${className ?? ''}`} />;
}

function diasParaVencer(d: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const venc = new Date(d + 'T00:00:00');
  return Math.round((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}
function diasEmAtraso(d: string) { return -diasParaVencer(d); }
function isEstaSemana(d: string) { const n = diasParaVencer(d); return n >= 0 && n <= 7; }
function isEsteMes(d: string) { const n = diasParaVencer(d); return n >= 0 && n <= 31; }

function CategoryIcon({ categoria, origem }: { categoria: string; origem?: string }) {
  if (origem === 'PEDIDO') return <ShoppingBag className="h-4 w-4 text-blue-500" />;
  if (origem === 'CAIXA') return <CreditCard className="h-4 w-4 text-emerald-500" />;
  const map: Record<string, React.ReactNode> = {
    Vendas: <Store className="h-4 w-4 text-emerald-500" />,
    Marketplaces: <ShoppingBag className="h-4 w-4 text-blue-500" />,
    Serviços: <span className="text-indigo-500">🔧</span>,
    Financeiro: <CreditCard className="h-4 w-4 text-purple-500" />,
  };
  return <span>{map[categoria] ?? <TrendingUp className="h-4 w-4 text-slate-400" />}</span>;
}

type FilterChip = 'todos' | 'semana' | 'mes' | 'atrasadas';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContasAReceberPage() {
  const [chipFilter, setChipFilter] = useState<FilterChip>('todos');
  const [cobrancaEnviada, setCobrancaEnviada] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useLancamentos({
    tipo: 'RECEITA',
    status: 'PENDENTE,ATRASADO',
    limite: 200,
    pagina: 1,
  });
  const pagarMutation = usePagarLancamento();
  const enviarCobrancaMutation = useEnviarCobranca();

  const all = data?.dados ?? [];

  const lancamentos = useMemo(() => {
    return all.filter((l) => {
      if (chipFilter === 'atrasadas') return l.status === 'ATRASADO';
      if (chipFilter === 'semana') return isEstaSemana(l.dataVencimento) || l.status === 'ATRASADO';
      if (chipFilter === 'mes') return isEsteMes(l.dataVencimento) || l.status === 'ATRASADO';
      return true;
    });
  }, [all, chipFilter]);

  // KPIs
  const totalAReceber = all.reduce((s, l) => s + l.valor, 0);
  const venceSemana = all.filter((l) => isEstaSemana(l.dataVencimento)).length;
  const previstoMes = all
    .filter((l) => isEsteMes(l.dataVencimento) || l.status === 'PENDENTE')
    .reduce((s, l) => s + l.valor, 0);
  const atrasadas = all.filter((l) => l.status === 'ATRASADO');
  const valorAtrasado = atrasadas.reduce((s, l) => s + l.valor, 0);

  const chips: { key: FilterChip; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'semana', label: 'Esta Semana' },
    { key: 'mes', label: 'Este Mês' },
    { key: 'atrasadas', label: `Atrasadas (${atrasadas.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Contas a Receber</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Acompanhe os valores a receber e confirme recebimentos
          </p>
        </div>
        <Link
          href="/dashboard/financeiro/lancamentos?tipo=RECEITA"
          className="flex w-fit items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nova Receita
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/30">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Total a Receber</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{fmt(totalAReceber)}</p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{all.length} conta(s)</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-medium text-slate-500">Vence esta Semana</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{venceSemana}</p>
          <p className="mt-1 text-xs text-slate-400">conta(s)</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-purple-500" />
            <p className="text-xs font-medium text-slate-500">Previsto este Mês</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">{fmt(previstoMes)}</p>
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

      {/* Alert com link para Cobrança */}
      {!isLoading && atrasadas.length > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              <strong>{atrasadas.length} recebimento(s) em atraso</strong> — total{' '}
              <strong>{fmt(valorAtrasado)}</strong>. Use "Enviar para Cobrança" para acionar a automação de cobrança.
            </p>
          </div>
          <Link
            href="/dashboard/cobranca"
            className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Ver Cobrança
          </Link>
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
                ? 'bg-emerald-600 text-white'
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
          <p className="text-4xl">✅</p>
          <p className="mt-3 font-semibold text-slate-700 dark:text-slate-300">
            Nenhuma conta a receber pendente
          </p>
          <p className="mt-1 text-sm text-slate-400">Todos os recebimentos confirmados!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lancamentos.map((l) => (
            <ReceitaCard
              key={l.id}
              lancamento={l}
              onConfirmar={() => pagarMutation.mutate({ id: l.id })}
              onEnviarCobranca={() => {
                enviarCobrancaMutation.mutate(l.id, {
                  onSuccess: () => setCobrancaEnviada((prev) => ({ ...prev, [l.id]: true })),
                });
              }}
              jaEmCobranca={!!(l.emCobranca || cobrancaEnviada[l.id])}
              isLoading={pagarMutation.isPending || enviarCobrancaMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReceitaCard({
  lancamento: l,
  onConfirmar,
  onEnviarCobranca,
  jaEmCobranca,
  isLoading,
}: {
  lancamento: Lancamento;
  onConfirmar: () => void;
  onEnviarCobranca: () => void;
  jaEmCobranca: boolean;
  isLoading: boolean;
}) {
  const isAtrasado = l.status === 'ATRASADO';
  const dias = isAtrasado ? diasEmAtraso(l.dataVencimento) : diasParaVencer(l.dataVencimento);
  const temCliente = !!(l.clienteNome);

  const origemBadge: Record<string, { label: string; cls: string }> = {
    PEDIDO: { label: 'Pedido', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    CAIXA: { label: 'Caixa', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    MANUAL: { label: 'Manual', cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
  };
  const badge = l.origem ? origemBadge[l.origem] : null;

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border bg-white px-5 py-4 dark:bg-slate-800 transition-all ${
        isAtrasado
          ? 'border-l-4 border-l-red-500 border-red-200 dark:border-red-800'
          : 'border-l-4 border-l-emerald-500 border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Icon */}
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${isAtrasado ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
        <CategoryIcon categoria={l.categoria} origem={l.origem} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{l.descricao}</p>
          {badge && (
            <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${badge.cls}`}>
              {badge.label}
            </span>
          )}
          {jaEmCobranca && (
            <span className="flex-shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              Em Cobrança
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3 flex-wrap">
          {temCliente ? (
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {l.clienteNome}
            </span>
          ) : (
            <span className="text-xs text-slate-500">{l.categoria}</span>
          )}
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

      {/* Value + Actions */}
      <div className="flex flex-shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{fmt(l.valor)}</p>
        <div className="flex items-center gap-2">
          {isAtrasado && !jaEmCobranca && (
            <button
              onClick={onEnviarCobranca}
              disabled={isLoading}
              title={!temCliente ? 'Lançamento sem cliente vinculado — edite e adicione o cliente primeiro' : 'Enviar para Cobrança IA'}
              className="flex items-center gap-1.5 rounded-lg border border-orange-300 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors disabled:opacity-50 dark:border-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
            >
              <BadgeDollarSign className="h-3.5 w-3.5" />
              Cobrança
            </button>
          )}
          <button
            onClick={onConfirmar}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Recebido
          </button>
        </div>
      </div>
    </div>
  );
}
