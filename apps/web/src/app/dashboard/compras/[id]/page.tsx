'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, FileCheck, Building2, Calendar, CreditCard,
  CheckCircle2, XCircle, Clock, Truck, PackageCheck, FileText,
  ChevronRight, Loader2, AlertTriangle, Package,
} from 'lucide-react';
import { useCompra, useReceberCompra, type StatusCompra, type ItemCompra } from '@/hooks/useCompras';

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dtfmt = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<StatusCompra, {
  label: string; bg: string; text: string; icon: React.ReactNode;
}> = {
  RASCUNHO:              { label: 'Rascunho',     bg: 'bg-slate-100 dark:bg-slate-700',       text: 'text-slate-600 dark:text-slate-400',    icon: <FileText className="h-4 w-4" /> },
  ENVIADO:               { label: 'Enviado',      bg: 'bg-blue-100 dark:bg-blue-900/30',       text: 'text-blue-700 dark:text-blue-400',      icon: <Truck className="h-4 w-4" /> },
  AGUARDANDO_RECEBIMENTO:{ label: 'Aguardando',   bg: 'bg-amber-100 dark:bg-amber-900/30',     text: 'text-amber-700 dark:text-amber-400',    icon: <Clock className="h-4 w-4 animate-pulse" /> },
  RECEBIDO_PARCIAL:      { label: 'Rec. Parcial', bg: 'bg-orange-100 dark:bg-orange-900/30',   text: 'text-orange-700 dark:text-orange-400',  icon: <PackageCheck className="h-4 w-4" /> },
  RECEBIDO:              { label: 'Recebido',     bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: <CheckCircle2 className="h-4 w-4" /> },
  CANCELADO:             { label: 'Cancelado',    bg: 'bg-red-100 dark:bg-red-900/30',         text: 'text-red-700 dark:text-red-400',        icon: <XCircle className="h-4 w-4" /> },
};

const TIMELINE_STEPS: { status: StatusCompra; label: string }[] = [
  { status: 'RASCUNHO',               label: 'Rascunho' },
  { status: 'ENVIADO',                label: 'Enviado' },
  { status: 'AGUARDANDO_RECEBIMENTO', label: 'Aguardando' },
  { status: 'RECEBIDO',               label: 'Recebido' },
];
const TIMELINE_ORDER: StatusCompra[] = [
  'RASCUNHO', 'ENVIADO', 'AGUARDANDO_RECEBIMENTO', 'RECEBIDO_PARCIAL', 'RECEBIDO',
];

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-100 dark:bg-slate-700 ${className ?? ''}`} />;
}

// ─── Recebimento Modal ─────────────────────────────────────────────────────────

function ModalRecebimento({
  itens,
  onConfirm,
  onClose,
  loading,
}: {
  itens: ItemCompra[];
  onConfirm: (data: Array<{ itemId: string; quantidadeRecebida: number }>) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [qtds, setQtds] = useState<Record<string, number>>(() =>
    Object.fromEntries(itens.map((i) => [i.id, i.quantidade - i.quantidadeRecebida])),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-marca-600" />
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Registrar Recebimento</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <XCircle className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* Itens */}
        <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
          {itens.filter(i => i.quantidadeRecebida < i.quantidade).map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.produto}</p>
                <p className="text-xs text-slate-400">{item.sku} · {item.unidade}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pedido: {item.quantidade} · Já recebido: {item.quantidadeRecebida}
                </p>
              </div>
              <div className="shrink-0">
                <label className="block text-xs text-slate-500 mb-1 text-right">Qtd. receber</label>
                <input
                  type="number"
                  min={0}
                  max={item.quantidade - item.quantidadeRecebida}
                  value={qtds[item.id] ?? 0}
                  onChange={(e) =>
                    setQtds((prev) => ({ ...prev, [item.id]: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-24 text-right rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
          <button onClick={onClose} className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(Object.entries(qtds).map(([itemId, quantidadeRecebida]) => ({ itemId, quantidadeRecebida })))}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-marca-600 hover:bg-marca-700 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Confirmar Recebimento
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompraDetalhePage() {
  const params = useParams();
  const id = params.id as string;
  const [showReceberModal, setShowReceberModal] = useState(false);

  const { data: compra, isLoading, error } = useCompra(id);
  const { mutate: receber, isPending: recebendo } = useReceberCompra(id);

  const handleReceber = (itensRecebidos: Array<{ itemId: string; quantidadeRecebida: number }>) => {
    receber(
      { itensRecebidos },
      {
        onSuccess: () => setShowReceberModal(false),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !compra) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertTriangle className="h-12 w-12 text-slate-300" />
        <p className="text-slate-500">Pedido de compra não encontrado.</p>
        <Link
          href="/dashboard/compras"
          className="flex items-center gap-2 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Compras
        </Link>
      </div>
    );
  }

  const sc = STATUS_CFG[compra.status];
  const podeReceber = ['ENVIADO', 'AGUARDANDO_RECEBIMENTO', 'RECEBIDO_PARCIAL'].includes(compra.status);
  const itensAReceber = (compra.itens ?? []).filter((i) => i.quantidadeRecebida < i.quantidade);

  const currentStepIdx = TIMELINE_ORDER.indexOf(compra.status);

  return (
    <>
      {showReceberModal && compra.itens && itensAReceber.length > 0 && (
        <ModalRecebimento
          itens={itensAReceber}
          onConfirm={handleReceber}
          onClose={() => setShowReceberModal(false)}
          loading={recebendo}
        />
      )}

      <div className="space-y-6">
        {/* Breadcrumb + Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/compras"
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-500" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-500">
                  <Link href="/dashboard/compras" className="hover:text-marca-600 transition-colors">
                    Compras
                  </Link>
                  <ChevronRight className="inline h-3 w-3 mx-1" />
                  #{compra.numero}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Pedido #{compra.numero}
                </h1>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${sc.bg} ${sc.text}`}>
                  {sc.icon}
                  {sc.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {podeReceber && itensAReceber.length > 0 && (
              <button
                onClick={() => setShowReceberModal(true)}
                className="flex items-center gap-2 rounded-xl bg-marca-600 hover:bg-marca-700 px-4 py-2 text-sm font-semibold text-white transition-colors shadow-sm"
              >
                <PackageCheck className="h-4 w-4" />
                Registrar Recebimento
              </button>
            )}
          </div>
        </div>

        {/* Cards de info */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Fornecedor */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-purple-500" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fornecedor</p>
            </div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{compra.fornecedor}</p>
            <Link
              href="/dashboard/compras/fornecedores"
              className="text-xs text-marca-600 hover:text-marca-700 mt-1 inline-block"
            >
              Ver detalhes
            </Link>
          </div>

          {/* NF-e */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck className="h-4 w-4 text-blue-500" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">NF-e</p>
            </div>
            {compra.nfeNumero ? (
              <>
                <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                  {compra.nfeNumero}/{compra.nfeSerie}
                </p>
                {compra.nfeChave && (
                  <p className="text-xs text-slate-400 mt-1 font-mono truncate" title={compra.nfeChave}>
                    {compra.nfeChave.slice(0, 16)}...
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400 italic">Sem NF-e</p>
            )}
          </div>

          {/* Datas */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Datas</p>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Emissão</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{dtfmt(compra.dataEmissao)}</span>
              </div>
              {compra.dataPrevistaEntrega && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Previsão</span>
                  <span className="font-medium text-amber-600">{dtfmt(compra.dataPrevistaEntrega)}</span>
                </div>
              )}
              {compra.dataRecebimento && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Recebimento</span>
                  <span className="font-medium text-emerald-600">{dtfmt(compra.dataRecebimento)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pagamento */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-orange-500" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pagamento</p>
            </div>
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{compra.formaPagamento}</p>
            <p className="text-xs text-slate-400 mt-0.5">{compra.condicaoPagamento}</p>
          </div>
        </div>

        {/* Itens */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <Package className="h-4 w-4 text-slate-400" />
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              Itens ({compra.itens?.length ?? 0})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                  {['Produto', 'SKU', 'Qtd Pedida', 'Qtd Recebida', 'Valor Unit.', 'Total', 'ICMS', 'IPI'].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${
                        ['Qtd Pedida', 'Qtd Recebida', 'Valor Unit.', 'Total', 'ICMS', 'IPI'].includes(h)
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {(compra.itens ?? []).map((item) => {
                  const completo = item.quantidadeRecebida >= item.quantidade;
                  const parcial = item.quantidadeRecebida > 0 && !completo;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {completo ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          ) : parcial ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                          )}
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                            {item.produto}
                          </span>
                        </div>
                        {item.ncm && (
                          <p className="text-[10px] text-slate-400 mt-0.5 pl-5">NCM: {item.ncm}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.sku}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                        {item.quantidade} {item.unidade}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span className={completo ? 'text-emerald-600 font-medium' : parcial ? 'text-amber-600 font-medium' : 'text-slate-400'}>
                          {item.quantidadeRecebida} {item.unidade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                        {fmt(item.valorUnitario)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                        {fmt(item.valorTotal)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-xs text-slate-500">
                        {fmt(item.valorICMS)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-xs text-slate-500">
                        {fmt(item.valorIPI)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totais */}
          <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4">
            <div className="flex justify-end">
              <div className="space-y-1.5 min-w-64">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal Produtos</span>
                  <span className="tabular-nums text-slate-700 dark:text-slate-300">{fmt(compra.valorProdutos)}</span>
                </div>
                {compra.valorFrete > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Frete</span>
                    <span className="tabular-nums text-slate-700 dark:text-slate-300">{fmt(compra.valorFrete)}</span>
                  </div>
                )}
                {compra.valorImpostos > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Impostos</span>
                    <span className="tabular-nums text-slate-700 dark:text-slate-300">{fmt(compra.valorImpostos)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold border-t border-slate-200 dark:border-slate-600 pt-2 mt-2">
                  <span className="text-slate-900 dark:text-slate-100">Total</span>
                  <span className="tabular-nums text-marca-600">{fmt(compra.valorTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        {compra.observacoes && (
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10 p-4">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
              Observações
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300">{compra.observacoes}</p>
          </div>
        )}

        {/* Timeline */}
        {compra.status !== 'CANCELADO' && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-5">
              Status do Pedido
            </h3>
            <div className="flex items-center gap-0">
              {TIMELINE_STEPS.map((step, i) => {
                const stepIdx = TIMELINE_ORDER.indexOf(step.status);
                const isComplete = currentStepIdx > stepIdx;
                const isCurrent = currentStepIdx === stepIdx || (step.status === 'RECEBIDO' && compra.status === 'RECEBIDO_PARCIAL');
                const isLast = i === TIMELINE_STEPS.length - 1;

                return (
                  <div key={step.status} className={`flex items-center ${!isLast ? 'flex-1' : ''}`}>
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isComplete
                            ? 'bg-marca-600 border-marca-600'
                            : isCurrent
                            ? 'bg-white dark:bg-slate-800 border-marca-600'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        ) : (
                          <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-marca-600' : 'bg-slate-200 dark:bg-slate-600'}`} />
                        )}
                      </div>
                      <p className={`text-[10px] font-medium whitespace-nowrap ${
                        isComplete || isCurrent
                          ? 'text-marca-600 dark:text-marca-400'
                          : 'text-slate-400'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                    {!isLast && (
                      <div className={`flex-1 h-0.5 mx-2 -mt-5 transition-colors ${
                        isComplete ? 'bg-marca-600' : 'bg-slate-200 dark:bg-slate-600'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
