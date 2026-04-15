'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText, Plus, Search, RefreshCw, Brain, ShieldCheck, AlertTriangle,
  XCircle, CheckCircle2, Clock, TrendingUp, DollarSign, Percent, Loader2,
  ChevronRight, Info, Printer,
} from 'lucide-react';
import { useNotasFiscais, useAnaliseIAFiscal, useEstatisticasFiscais } from '@/hooks/useFiscal';
import type { StatusNF, TipoNF, NotaFiscal } from '@/services/fiscal.service';

const fmt   = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pct   = (v: number) => `${v.toFixed(1)}%`;
const dtfmt = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  EMITIDA:     { label: 'Emitida',     bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: <CheckCircle2 className="h-3 w-3" /> },
  PROCESSANDO: { label: 'Processando', bg: 'bg-blue-100 dark:bg-blue-900/30',       text: 'text-blue-700 dark:text-blue-400',       icon: <Clock className="h-3 w-3 animate-pulse" /> },
  VALIDADA:    { label: 'Validada',    bg: 'bg-indigo-100 dark:bg-indigo-900/30',   text: 'text-indigo-700 dark:text-indigo-400',   icon: <ShieldCheck className="h-3 w-3" /> },
  RASCUNHO:    { label: 'Rascunho',    bg: 'bg-slate-100 dark:bg-slate-700',        text: 'text-slate-600 dark:text-slate-400',     icon: <FileText className="h-3 w-3" /> },
  REJEITADA:   { label: 'Rejeitada',   bg: 'bg-red-100 dark:bg-red-900/30',         text: 'text-red-700 dark:text-red-400',         icon: <XCircle className="h-3 w-3" /> },
  CANCELADA:   { label: 'Cancelada',   bg: 'bg-orange-100 dark:bg-orange-900/30',   text: 'text-orange-700 dark:text-orange-400',   icon: <XCircle className="h-3 w-3" /> },
  DENEGADA:    { label: 'Denegada',    bg: 'bg-rose-100 dark:bg-rose-900/30',       text: 'text-rose-700 dark:text-rose-400',       icon: <XCircle className="h-3 w-3" /> },
};

const TIPO_CFG: Record<string, { label: string; color: string }> = {
  NFE:  { label: 'NF-e',  color: 'text-blue-600 dark:text-blue-400' },
  NFCE: { label: 'NFC-e', color: 'text-purple-600 dark:text-purple-400' },
  NFSE: { label: 'NFS-e', color: 'text-teal-600 dark:text-teal-400' },
};

const SAUDE_CFG = {
  EXCELENTE: { cor: '#10b981', label: 'Excelente' },
  BOA:       { cor: '#3b82f6', label: 'Boa' },
  REGULAR:   { cor: '#f59e0b', label: 'Regular' },
  CRITICA:   { cor: '#ef4444', label: 'Crítica' },
};

// ─── Score Ring SVG ────────────────────────────────────────────────────────────
function ScoreRing({ score, saude }: { score: number; saude: string }) {
  const cfg  = SAUDE_CFG[saude as keyof typeof SAUDE_CFG] ?? SAUDE_CFG.REGULAR;
  const r    = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <svg width={96} height={96} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={48} cy={48} r={r} fill="none" stroke="#e2e8f0" strokeWidth={8} />
        <circle cx={48} cy={48} r={r} fill="none" stroke={cfg.cor} strokeWidth={8}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{score}</span>
        <span className="block text-[10px] font-medium" style={{ color: cfg.cor }}>{cfg.label}</span>
      </div>
    </div>
  );
}

const STATUS_OPCOES: { value: StatusNF | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'EMITIDA', label: 'Emitida' },
  { value: 'PROCESSANDO', label: 'Processando' },
  { value: 'VALIDADA', label: 'Validada' },
  { value: 'RASCUNHO', label: 'Rascunho' },
  { value: 'REJEITADA', label: 'Rejeitada' },
  { value: 'CANCELADA', label: 'Cancelada' },
];

const TIPO_OPCOES: { value: TipoNF | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'NFE', label: 'NF-e' },
  { value: 'NFCE', label: 'NFC-e' },
  { value: 'NFSE', label: 'NFS-e' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FiscalPage() {
  const [busca,  setBusca]  = useState('');
  const [status, setStatus] = useState<StatusNF | ''>('');
  const [tipo,   setTipo]   = useState<TipoNF | ''>('');
  const [showIA, setShowIA] = useState(true);

  const { data: listData, isLoading: loadingList, refetch } = useNotasFiscais({ busca, status, tipo, limit: 30 });
  const { data: ia,  isLoading: loadingIA  } = useAnaliseIAFiscal();
  const { data: est, isLoading: loadingEst } = useEstatisticasFiscais();

  const notas: NotaFiscal[] = listData?.notas ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Fiscal</h1>
          <p className="text-sm text-slate-500 mt-0.5">NF-e · NFC-e · NFS-e · Compliance com IA</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </button>
          <Link href="/dashboard/fiscal/configuracao"
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Configurações
          </Link>
          <Link href="/dashboard/fiscal/nova"
            className="flex items-center gap-2 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 transition-colors shadow-sm">
            <Plus className="h-4 w-4" />Nova NF
          </Link>
        </div>
      </div>

      {/* KPIs */}
      {loadingEst ? (
        <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-marca-500" /></div>
      ) : est && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Faturado (30d)',  value: fmt(est.faturado30d), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', sub: `${est.emitidas30d} NFs emitidas` },
            { label: 'Impostos (30d)', value: fmt(est.impostos30d),  icon: Percent,    color: 'text-orange-600',  bg: 'bg-orange-50 dark:bg-orange-900/20',   sub: est.faturado30d > 0 ? `${pct((est.impostos30d/est.faturado30d)*100)} do faturado` : '—' },
            { label: 'Total de NFs',   value: String(est.totalNFs),  icon: FileText,   color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-900/20',       sub: `${est.processando} em processamento` },
            { label: 'Taxa Emissão',   value: pct(est.taxaEmissao),  icon: TrendingUp, color: 'text-marca-600',   bg: 'bg-marca-50 dark:bg-marca-900/20',     sub: `${pct(est.taxaRejeicao)} de rejeição` },
          ].map(({ label, value, icon: Icon, color, bg, sub }) => (
            <div key={label} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className={`text-xl font-bold mt-1 tabular-nums ${color}`}>{value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
                </div>
                <div className={`rounded-xl p-2 ${bg}`}><Icon className={`h-4 w-4 ${color}`} /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Painel IA */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <button onClick={() => setShowIA(!showIA)}
          className="w-full flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-marca-600" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">Análise de Compliance por IA</span>
          </div>
          <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${showIA ? 'rotate-90' : ''}`} />
        </button>

        {showIA && (
          loadingIA ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-marca-500" /></div>
          ) : ia ? (
            <div className="p-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {/* Score + detalhe impostos */}
              <div className="flex items-center gap-5">
                <ScoreRing score={ia.scoreCompliance} saude={ia.saude} />
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Carga Tributária</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{pct(ia.metricas.cargaTributaria)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total Impostos</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{fmt(ia.metricas.totalImpostos)}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 space-y-0.5">
                    <div className="flex justify-between"><span>ICMS</span><span className="font-medium text-slate-600 dark:text-slate-300">{fmt(ia.metricas.detalheImpostos.icms)}</span></div>
                    <div className="flex justify-between"><span>PIS</span><span className="font-medium text-slate-600 dark:text-slate-300">{fmt(ia.metricas.detalheImpostos.pis)}</span></div>
                    <div className="flex justify-between"><span>COFINS</span><span className="font-medium text-slate-600 dark:text-slate-300">{fmt(ia.metricas.detalheImpostos.cofins)}</span></div>
                  </div>
                </div>
              </div>

              {/* Alertas */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Alertas ({ia.alertas.length})</p>
                {ia.alertas.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">Nenhum alerta</p>
                ) : ia.alertas.map((a, i) => (
                  <div key={i} className={`rounded-xl px-3 py-2 flex items-start gap-2 ${
                    a.tipo === 'CRITICO' ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50' :
                    a.tipo === 'ATENCAO' ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50' :
                    'bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50'
                  }`}>
                    {a.tipo === 'CRITICO' ? <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" /> :
                     a.tipo === 'ATENCAO' ? <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" /> :
                     <Info className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{a.titulo}</p>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{a.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Oportunidades */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Oportunidades</p>
                {ia.oportunidades.map((o, i) => (
                  <div key={i} className="rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 px-3 py-2">
                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">{o.titulo}</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{o.descricao}</p>
                    {o.economia && <p className="text-[11px] font-bold text-emerald-600 mt-1">Economia: {o.economia}</p>}
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={busca} onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por número, destinatário, chave de acesso..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUS_OPCOES.map(op => (
            <button key={op.value} onClick={() => setStatus(op.value as StatusNF | '')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${status === op.value ? 'bg-marca-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              {op.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {TIPO_OPCOES.map(op => (
            <button key={op.value} onClick={() => setTipo(op.value as TipoNF | '')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${tipo === op.value ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        {loadingList ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-marca-500" /></div>
        ) : notas.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-slate-500 text-sm">Nenhuma nota fiscal encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                  {['Número', 'Tipo', 'Destinatário', 'Emissão', 'Valor', 'Status', ''].map(h => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${h === 'Valor' ? 'text-right' : h === 'Status' ? 'text-center' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {notas.map((nf: NotaFiscal) => {
                  const sc = STATUS_CFG[nf.status] ?? STATUS_CFG.RASCUNHO;
                  const tc = TIPO_CFG[nf.tipo]    ?? TIPO_CFG.NFE;
                  return (
                    <tr key={nf.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs text-slate-700 dark:text-slate-300">{nf.numero}</div>
                        {nf.pedidoNumero && <div className="text-[10px] text-slate-400">{nf.pedidoNumero}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${tc.color}`}>{tc.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{nf.destinatario}</div>
                        <div className="text-[10px] text-slate-400">{nf.destinatarioUF}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{dtfmt(nf.dataEmissao)}</td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-800 dark:text-slate-200">{fmt(nf.valorTotal)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                          {sc.icon}{sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {['EMITIDA', 'CANCELADA'].includes(nf.status) && nf.tipo === 'NFE' && (
                            <button
                              onClick={() => window.open(`/dashboard/fiscal/${nf.id}/danfe`, '_blank')}
                              title="Imprimir DANFE"
                              className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                          )}
                          {['EMITIDA', 'CANCELADA'].includes(nf.status) && nf.tipo === 'NFCE' && (
                            <button
                              onClick={() => window.open(`/dashboard/fiscal/${nf.id}/nfce`, '_blank')}
                              title="Imprimir Cupom NFC-e"
                              className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                          )}
                          <Link href={`/dashboard/fiscal/${nf.id}`} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors inline-flex">
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {listData && listData.total > 0 && (
        <p className="text-center text-xs text-slate-400">{listData.total} nota{listData.total !== 1 ? 's' : ''} fiscal encontrada{listData.total !== 1 ? 's' : ''}</p>
      )}
    </div>
  );
}
