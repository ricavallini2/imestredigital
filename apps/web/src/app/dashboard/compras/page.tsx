'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Plus, Search, RefreshCw, Brain, TrendingDown,
  ChevronRight, Loader2, FileCheck, Truck, Building2, DollarSign,
  FileX, Clock, CheckCircle2, XCircle, AlertTriangle, FileText,
  Upload, PackageCheck, TrendingUp,
} from 'lucide-react';
import {
  useCompras,
  useEstatisticasCompras,
  type PedidoCompra,
  type StatusCompra,
} from '@/hooks/useCompras';

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dtfmt = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<StatusCompra, {
  label: string;
  bg: string;
  text: string;
  icon: React.ReactNode;
}> = {
  RASCUNHO:              { label: 'Rascunho',    bg: 'bg-slate-100 dark:bg-slate-700',        text: 'text-slate-600 dark:text-slate-400',      icon: <FileText className="h-3 w-3" /> },
  ENVIADO:               { label: 'Enviado',     bg: 'bg-blue-100 dark:bg-blue-900/30',        text: 'text-blue-700 dark:text-blue-400',         icon: <Truck className="h-3 w-3" /> },
  AGUARDANDO_RECEBIMENTO:{ label: 'Aguardando',  bg: 'bg-amber-100 dark:bg-amber-900/30',      text: 'text-amber-700 dark:text-amber-400',       icon: <Clock className="h-3 w-3 animate-pulse" /> },
  RECEBIDO_PARCIAL:      { label: 'Rec. Parcial',bg: 'bg-orange-100 dark:bg-orange-900/30',    text: 'text-orange-700 dark:text-orange-400',     icon: <PackageCheck className="h-3 w-3" /> },
  RECEBIDO:              { label: 'Recebido',    bg: 'bg-emerald-100 dark:bg-emerald-900/30',  text: 'text-emerald-700 dark:text-emerald-400',   icon: <CheckCircle2 className="h-3 w-3" /> },
  CANCELADO:             { label: 'Cancelado',   bg: 'bg-red-100 dark:bg-red-900/30',          text: 'text-red-700 dark:text-red-400',           icon: <XCircle className="h-3 w-3" /> },
};

const STATUS_FILTROS: { value: StatusCompra | ''; label: string }[] = [
  { value: '',                     label: 'Todos' },
  { value: 'RASCUNHO',             label: 'Rascunho' },
  { value: 'ENVIADO',              label: 'Enviado' },
  { value: 'AGUARDANDO_RECEBIMENTO', label: 'Aguardando' },
  { value: 'RECEBIDO_PARCIAL',     label: 'Parcial' },
  { value: 'RECEBIDO',             label: 'Recebido' },
  { value: 'CANCELADO',            label: 'Cancelado' },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-100 dark:bg-slate-700 ${className ?? ''}`} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComprasPage() {
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState<StatusCompra | ''>('');
  const [showIA, setShowIA] = useState(true);

  const { data: comprasData, isLoading: loadingCompras, refetch } = useCompras({
    status: status || undefined,
    busca: busca || undefined,
  });
  const { data: est, isLoading: loadingEst } = useEstatisticasCompras();

  const compras: PedidoCompra[] = comprasData?.dados ?? [];
  const temNfes = (est?.nfesImportadas ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Compras</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pedidos · NF-e · Fornecedores · Recebimento
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => refetch()}
            className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </button>
          <Link
            href="/dashboard/compras/fornecedores"
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Building2 className="h-4 w-4" />
            Fornecedores
          </Link>
          <Link
            href="/dashboard/compras/importar-nfe"
            className="flex items-center gap-2 rounded-xl bg-destaque-500 hover:bg-destaque-600 px-4 py-2 text-sm font-semibold text-white transition-colors shadow-sm"
          >
            <Upload className="h-4 w-4" />
            Importar NF-e
          </Link>
          <Link
            href="/dashboard/compras/nova"
            className="flex items-center gap-2 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nova Compra
          </Link>
        </div>
      </div>

      {/* KPIs */}
      {loadingEst ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-7 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      ) : est && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: 'Gastos (30d)',
              value: fmt(est.gastosTotal30d),
              icon: DollarSign,
              color: 'text-marca-600',
              bg: 'bg-marca-50 dark:bg-marca-900/20',
              sub: est.crescimentoGastos < 0
                ? `${Math.abs(est.crescimentoGastos).toFixed(1)}% vs mês anterior`
                : `+${est.crescimentoGastos.toFixed(1)}% vs mês anterior`,
              subColor: est.crescimentoGastos < 0 ? 'text-emerald-500' : 'text-red-500',
            },
            {
              label: 'Pedidos Pendentes',
              value: String(est.pedidosPendentes),
              icon: Clock,
              color: 'text-amber-600',
              bg: 'bg-amber-50 dark:bg-amber-900/20',
              sub: `${est.pedidosRecebidos30d} recebidos este mês`,
              subColor: 'text-slate-400',
            },
            {
              label: 'NFs Importadas',
              value: String(est.nfesImportadas),
              icon: FileCheck,
              color: 'text-blue-600',
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              sub: `Ticket médio ${fmt(est.ticketMedioCompra)}`,
              subColor: 'text-slate-400',
            },
            {
              label: 'Fornecedores Ativos',
              value: String(est.fornecedoresAtivos),
              icon: Building2,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50 dark:bg-emerald-900/20',
              sub: est.topFornecedores[0] ? `Top: ${est.topFornecedores[0].nome}` : '—',
              subColor: 'text-slate-400',
            },
          ].map(({ label, value, icon: Icon, color, bg, sub, subColor }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className={`text-xl font-bold mt-1 tabular-nums ${color}`}>{value}</p>
                  <p className={`text-[11px] mt-0.5 truncate ${subColor}`}>{sub}</p>
                </div>
                <div className={`rounded-xl p-2 shrink-0 ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Painel IA */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <button
          onClick={() => setShowIA(!showIA)}
          className="w-full flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-destaque-500" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Insights de Compras — IA
            </span>
          </div>
          <ChevronRight
            className={`h-4 w-4 text-slate-400 transition-transform ${showIA ? 'rotate-90' : ''}`}
          />
        </button>

        {showIA && est && (
          <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Maior fornecedor */}
            <div className="rounded-xl bg-marca-50 dark:bg-marca-900/10 border border-marca-200 dark:border-marca-800/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-marca-600" />
                <p className="text-xs font-semibold text-marca-700 dark:text-marca-400 uppercase tracking-wide">
                  Maior Fornecedor
                </p>
              </div>
              {est.topFornecedores[0] ? (
                <>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {est.topFornecedores[0].nome}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {fmt(est.topFornecedores[0].total)} em {est.topFornecedores[0].qtd} compras
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-400">Nenhum dado disponível</p>
              )}
            </div>

            {/* Pedidos pendentes */}
            <div className={`rounded-xl border p-4 ${
              est.pedidosPendentes > 0
                ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50'
                : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {est.pedidosPendentes > 0
                  ? <AlertTriangle className="h-4 w-4 text-amber-600" />
                  : <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                }
                <p className={`text-xs font-semibold uppercase tracking-wide ${
                  est.pedidosPendentes > 0
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-emerald-700 dark:text-emerald-400'
                }`}>
                  Recebimentos Pendentes
                </p>
              </div>
              <p className="font-bold text-slate-900 dark:text-slate-100">
                {est.pedidosPendentes === 0
                  ? 'Tudo em dia!'
                  : `${est.pedidosPendentes} pedido${est.pedidosPendentes > 1 ? 's' : ''} aguardando`}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {est.pedidosPendentes > 0
                  ? 'Verifique os pedidos enviados e em trânsito'
                  : 'Nenhum pedido pendente de recebimento'}
              </p>
            </div>

            {/* Oportunidade */}
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-emerald-600" />
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                  Oportunidade
                </p>
              </div>
              <p className="font-bold text-slate-900 dark:text-slate-100">
                Redução de 8.5% nos gastos
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Consolidar pedidos por fornecedor pode reduzir fretes e obter descontos por volume.
              </p>
              <Link
                href="/dashboard/ia"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                Perguntar à IA <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Call-to-action NF-e se ainda não importou */}
      {!temNfes && !loadingEst && (
        <div className="rounded-2xl border-2 border-dashed border-destaque-200 dark:border-destaque-800/50 bg-destaque-50/50 dark:bg-destaque-900/10 p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold text-destaque-700 dark:text-destaque-300 text-lg">
              Importe NF-e para automatizar suas compras
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Basta fazer upload do XML da nota fiscal — produtos, estoque e contas a pagar são atualizados automaticamente.
            </p>
          </div>
          <Link
            href="/dashboard/compras/importar-nfe"
            className="flex items-center gap-2 rounded-xl bg-destaque-500 hover:bg-destaque-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm whitespace-nowrap"
          >
            <Upload className="h-4 w-4" />
            Importar NF-e XML
          </Link>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por número, fornecedor, NF-e..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTROS.map((op) => (
            <button
              key={op.value}
              onClick={() => setStatus(op.value as StatusCompra | '')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                status === op.value
                  ? 'bg-marca-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        {loadingCompras ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32 flex-1" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        ) : compras.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-slate-200 dark:text-slate-600" />
            <p className="text-slate-500 text-sm font-medium">
              {busca || status ? 'Nenhum pedido encontrado com esses filtros' : 'Nenhum pedido de compra'}
            </p>
            {!busca && !status && (
              <Link
                href="/dashboard/compras/importar-nfe"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Importar primeira NF-e
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                  {['Número', 'NF-e', 'Fornecedor', 'Data', 'Status', 'Valor Total', ''].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${
                        h === 'Valor Total' ? 'text-right' : h === 'Status' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {compras.map((compra) => {
                  const sc = STATUS_CFG[compra.status];
                  return (
                    <tr
                      key={compra.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                      onClick={() => { window.location.href = `/dashboard/compras/${compra.id}`; }}
                    >
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                          #{compra.numero}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {(compra as any).qtdItens ?? 0} {(compra as any).qtdItens === 1 ? 'item' : 'itens'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {compra.nfeNumero ? (
                          <div className="flex items-center gap-1">
                            <FileCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                            <span className="font-mono text-xs text-blue-600 dark:text-blue-400">
                              {compra.nfeNumero}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Sem NF-e</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                          {compra.fornecedor}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {dtfmt(compra.dataEmissao)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${sc.bg} ${sc.text}`}
                        >
                          {sc.icon}
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                        {fmt(compra.valorTotal)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/dashboard/compras/${compra.id}`}
                          className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors inline-flex"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {comprasData && comprasData.total > 0 && (
        <p className="text-center text-xs text-slate-400">
          {comprasData.total} pedido{comprasData.total !== 1 ? 's' : ''} de compra encontrado{comprasData.total !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
