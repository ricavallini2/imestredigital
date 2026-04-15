'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, ShoppingCart, TrendingUp, BarChart3, Search, Package,
  Store, Briefcase, ChevronRight,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { KPICard } from '@/components/ui/kpi-card';
import { usePedidos, useEstatisticasPedidos } from '@/hooks/usePedidos';

const CANAL_CONFIG: Record<string, { label: string; emoji: string; cor: string }> = {
  BALCAO:       { label: 'Balcão',        emoji: '🏪', cor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  INTERNA:      { label: 'Interna',       emoji: '💼', cor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  SHOPIFY:      { label: 'Shopify',       emoji: '🛍️', cor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  MERCADO_LIVRE:{ label: 'Mercado Livre', emoji: '🟠', cor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  SHOPEE:       { label: 'Shopee',        emoji: '🔴', cor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  AMAZON:       { label: 'Amazon',        emoji: '📦', cor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  OUTROS:       { label: 'Outros',        emoji: '🌐', cor: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
};

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente', CONFIRMADO: 'Confirmado', SEPARANDO: 'Separando',
  SEPARADO: 'Separado', FATURADO: 'Faturado', ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue', CANCELADO: 'Cancelado', DEVOLVIDO: 'Devolvido',
};

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function PedidosPage() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [canal, setCanal] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = usePedidos({ pagina: 1, limite: 100 });
  const { data: stats, isLoading: loadingStats } = useEstatisticasPedidos();

  const pedidos = data?.dados ?? [];

  const filtrados = useMemo(() => pedidos.filter((p) => {
    const q = busca.toLowerCase();
    const okBusca  = !busca  || p.numero?.toLowerCase().includes(q) || p.cliente?.toLowerCase().includes(q);
    const okCanal  = !canal  || p.canal === canal;
    const okStatus = !status || p.status === status;
    return okBusca && okCanal && okStatus;
  }), [pedidos, busca, canal, status]);

  const canaisAtivos = [...new Set(pedidos.map((p) => p.canal).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Pedidos</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Gerencie todos os pedidos e vendas</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/pedidos/balcao"
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            <Store className="h-4 w-4" /> <span className="hidden sm:inline">Venda </span>Balcão
          </Link>
          <Link href="/dashboard/pedidos/interna"
            className="flex items-center gap-1.5 rounded-xl border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            <Briefcase className="h-4 w-4" /> <span className="hidden sm:inline">Venda </span>Interna
          </Link>
          <Link href="/dashboard/pedidos/novo"
            className="flex items-center gap-1.5 rounded-xl bg-marca-500 px-3 py-2 text-sm font-semibold text-white hover:bg-marca-600 transition-colors">
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Novo </span>Pedido
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loadingStats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white h-24 dark:border-slate-700 dark:bg-slate-800" />
          ))
        ) : (
          <>
            <KPICard label="Receita 30 dias" valor={fmt(stats?.receita30d ?? 0)} icone={<TrendingUp className="h-6 w-6" />} destaque />
            <KPICard label="Pedidos 30 dias" valor={stats?.pedidos30d ?? 0} icone={<ShoppingCart className="h-6 w-6" />} />
            <KPICard label="Ticket Médio" valor={fmt(stats?.ticketMedio ?? 0)} icone={<BarChart3 className="h-6 w-6" />} />
            <KPICard label="Pendentes" valor={stats?.porStatus?.PENDENTE ?? 0} icone={<Package className="h-6 w-6" />} />
          </>
        )}
      </div>

      {/* Canal chips + Filtros */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 space-y-4">
        {/* Canal chips */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCanal('')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${!canal ? 'bg-marca-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}>
            Todos
          </button>
          {canaisAtivos.map((c) => {
            const cfg = CANAL_CONFIG[c] ?? { label: c, emoji: '📦', cor: '' };
            return (
              <button key={c} onClick={() => setCanal(c === canal ? '' : c)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${c === canal ? 'bg-marca-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}>
                {cfg.emoji} {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Busca + Status */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Buscar por número ou cliente..." value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
            <option value="">Todos os status</option>
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse h-14 border-b border-slate-100 dark:border-slate-700 last:border-0 px-6 flex items-center gap-4">
              <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="ml-auto h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 p-12 text-center">
          <Package className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p className="font-medium text-slate-500">Nenhum pedido encontrado</p>
          <p className="text-sm text-slate-400 mt-1">Ajuste os filtros ou crie um novo pedido</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
          <div className="min-w-[560px]">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 border-b border-slate-200 dark:border-slate-700 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span>Número</span>
            <span>Cliente</span>
            <span>Canal</span>
            <span className="text-right">Valor</span>
            <span>Status</span>
            <span />
          </div>

          {filtrados.map((p) => {
            const cfg = CANAL_CONFIG[p.canal] ?? CANAL_CONFIG.OUTROS;
            return (
              <div key={p.id}
                onClick={() => router.push(`/dashboard/pedidos/${p.id}`)}
                className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center border-b border-slate-100 dark:border-slate-700/50 px-6 py-3.5 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors">
                <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">{p.numero}</span>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-[220px]">{p.cliente}</p>
                  <p className="text-xs text-slate-400">{p.itens} {p.itens === 1 ? 'item' : 'itens'} · {new Date(p.criadoEm ?? p.data).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.cor}`}>
                  {cfg.emoji} {cfg.label}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {fmt(p.valor)}
                </span>
                <StatusBadge status={p.status} label={STATUS_LABELS[p.status] ?? p.status} />
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            );
          })}
          </div>
          </div>
        </div>
      )}

      {filtrados.length > 0 && (
        <p className="text-right text-xs text-slate-400">{filtrados.length} pedido{filtrados.length !== 1 ? 's' : ''}</p>
      )}
    </div>
  );
}
