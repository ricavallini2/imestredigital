'use client';

import { useState } from 'react';
import { ChevronDown, CheckCircle2, Clock, XCircle, RefreshCw, DollarSign, FileCheck } from 'lucide-react';
import { useAcordosCobranca, usePagarParcela } from '@/hooks/useCobranca';
import type { Acordo } from '@/hooks/useCobranca';
import clsx from 'clsx';

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString('pt-BR') : '—';

const STATUS_ACORDO: Record<string, { cls: string; label: string; icon: React.ElementType }> = {
  ATIVO:    { cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',    label: 'Ativo',    icon: Clock },
  CUMPRIDO: { cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Cumprido', icon: CheckCircle2 },
  QUEBRADO: { cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',         label: 'Quebrado', icon: XCircle },
};

const TABS_FILTRO = [
  { key: '',         label: 'Todos' },
  { key: 'ATIVO',    label: 'Ativos' },
  { key: 'CUMPRIDO', label: 'Cumpridos' },
  { key: 'QUEBRADO', label: 'Quebrados' },
];

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={clsx('animate-pulse bg-slate-200 dark:bg-slate-700 rounded', className)} />;
}

function AcordoCard({ acordo }: { acordo: Acordo }) {
  const [expandido, setExpandido] = useState(false);
  const pagarParcela = usePagarParcela();
  const cfg = STATUS_ACORDO[acordo.status];
  const StatusIcon = cfg.icon;

  const parcelasPagas = acordo.parcelas.filter(p => p.pago).length;
  const totalParcelas = acordo.parcelas.length;
  const progresso = totalParcelas > 0 ? (parcelasPagas / totalParcelas) * 100 : 0;

  async function handlePagar(numeroParcela: number) {
    await pagarParcela.mutateAsync({ acordoId: acordo.id, numeroParcela });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Summary Row */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
        onClick={() => setExpandido(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 dark:text-white">{acordo.clienteNome}</span>
            <span className={clsx('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full', cfg.cls)}>
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span>
              <span className="line-through">{brl(acordo.valorOriginal)}</span>
              {' → '}
              <span className="font-semibold text-green-600 dark:text-green-400">{brl(acordo.valorFinal)}</span>
              {' '}
              <span className="text-green-600 dark:text-green-400">(-{acordo.descontoAplicado}%)</span>
            </span>
            <span className="text-slate-400">•</span>
            <span>{parcelasPagas}/{totalParcelas} parcelas pagas</span>
            <span className="text-slate-400">•</span>
            <span>Criado em {fmtDate(acordo.criadoEm)}</span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden w-full max-w-xs">
            <div
              className={clsx('h-full rounded-full transition-all', acordo.status === 'CUMPRIDO' ? 'bg-green-500' : acordo.status === 'QUEBRADO' ? 'bg-red-500' : 'bg-blue-500')}
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
        <ChevronDown className={clsx('w-5 h-5 text-slate-400 shrink-0 transition-transform', expandido && 'rotate-180')} />
      </div>

      {/* Expanded Parcelas */}
      {expandido && (
        <div className="border-t border-slate-200 dark:border-slate-700">
          {acordo.observacao && (
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">{acordo.observacao}</p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50">
                  <th className="px-5 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">#</th>
                  <th className="px-5 py-2 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">Valor</th>
                  <th className="px-5 py-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">Vencimento</th>
                  <th className="px-5 py-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-5 py-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {acordo.parcelas.map(parcela => (
                  <tr key={parcela.numero} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-2.5">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Parcela {parcela.numero}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-right font-semibold text-slate-900 dark:text-white">
                      {brl(parcela.valor)}
                    </td>
                    <td className="px-5 py-2.5 text-center text-slate-600 dark:text-slate-300">
                      {fmtDate(parcela.vencimento)}
                    </td>
                    <td className="px-5 py-2.5 text-center">
                      {parcela.pago ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          Pago em {fmtDate(parcela.pagoEm)}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Pendente</span>
                      )}
                    </td>
                    <td className="px-5 py-2.5 text-center">
                      {!parcela.pago && acordo.status === 'ATIVO' && (
                        <button
                          onClick={() => handlePagar(parcela.numero)}
                          disabled={pagarParcela.isPending}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          {pagarParcela.isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : <DollarSign className="w-3 h-3" />}
                          Confirmar Pagamento
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AcordosPage() {
  const [filtroStatus, setFiltroStatus] = useState('');
  const { data, isLoading } = useAcordosCobranca(filtroStatus ? { status: filtroStatus } : undefined);

  const acordos = data?.dados ?? [];

  // Compute stats
  const ativos   = acordos.filter(a => a.status === 'ATIVO');
  const totalComprometido = ativos.reduce((s, a) => s + a.parcelas.filter(p => !p.pago).reduce((ss, p) => ss + p.valor, 0), 0);
  const cumpridos = acordos.filter(a => a.status === 'CUMPRIDO').length;
  const quebrados = acordos.filter(a => a.status === 'QUEBRADO').length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Acordos de Pagamento</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Acompanhe todos os acordos firmados e parcelas
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{ativos.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Acordos Ativos</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{brl(totalComprometido)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Comprometido</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{cumpridos}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cumpridos</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{quebrados}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quebrados</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex border-b border-slate-200 dark:border-slate-700 min-w-max">
          {TABS_FILTRO.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFiltroStatus(tab.key)}
              className={clsx(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                filtroStatus === tab.key
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <div className="animate-pulse space-y-2">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-64" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-96" />
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded w-48 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : acordos.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <FileCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-medium text-slate-600 dark:text-slate-400">Nenhum acordo encontrado</p>
          <p className="text-sm text-slate-400 mt-1">Acordos são criados ao negociar títulos vencidos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {acordos.map(acordo => (
            <AcordoCard key={acordo.id} acordo={acordo} />
          ))}
        </div>
      )}
    </div>
  );
}
