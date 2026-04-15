'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, FileText, CheckCircle2, XCircle, Clock, ShieldCheck,
  Copy, ExternalLink, AlertTriangle, Loader2, Send, Ban, RefreshCw, Printer,
} from 'lucide-react';
import { useNotaFiscal, useEmitirNF, useValidarNF, useCancelarNF } from '@/hooks/useFiscal';
import type { NotaFiscal } from '@/services/fiscal.service';

const fmt   = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pct   = (v: number) => `${v.toFixed(2)}%`;
const dtfmt = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const dtcur = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

// ─── Status/tipo helpers ───────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  EMITIDA:     { label: 'Autorizada',  bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: <CheckCircle2 className="h-4 w-4" /> },
  PROCESSANDO: { label: 'Processando', bg: 'bg-blue-100 dark:bg-blue-900/30',       text: 'text-blue-700 dark:text-blue-400',       icon: <Clock className="h-4 w-4 animate-spin" /> },
  VALIDADA:    { label: 'Validada',    bg: 'bg-indigo-100 dark:bg-indigo-900/30',   text: 'text-indigo-700 dark:text-indigo-400',   icon: <ShieldCheck className="h-4 w-4" /> },
  RASCUNHO:    { label: 'Rascunho',    bg: 'bg-slate-100 dark:bg-slate-700',        text: 'text-slate-600 dark:text-slate-400',     icon: <FileText className="h-4 w-4" /> },
  REJEITADA:   { label: 'Rejeitada',   bg: 'bg-red-100 dark:bg-red-900/30',         text: 'text-red-700 dark:text-red-400',         icon: <XCircle className="h-4 w-4" /> },
  CANCELADA:   { label: 'Cancelada',   bg: 'bg-orange-100 dark:bg-orange-900/30',   text: 'text-orange-700 dark:text-orange-400',   icon: <XCircle className="h-4 w-4" /> },
};

const TIPO_LABEL: Record<string, string> = { NFE: 'NF-e', NFCE: 'NFC-e', NFSE: 'NFS-e' };

// ─── Modal cancelamento ────────────────────────────────────────────────────────
function ModalCancelamento({ onClose, onConfirm, loading }: {
  onClose: () => void; onConfirm: (motivo: string) => void; loading: boolean;
}) {
  const [motivo, setMotivo] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Cancelar NF-e</h2>
          <p className="text-sm text-slate-500 mt-1">O cancelamento só é permitido nas primeiras 24 horas após a autorização.</p>
        </div>
        <div className="p-6 space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Motivo do cancelamento *</label>
          <textarea value={motivo} onChange={e => setMotivo(e.target.value)} rows={3} minLength={15}
            placeholder="Descreva o motivo com pelo menos 15 caracteres..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-red-500" />
          <p className="text-[11px] text-slate-400">{motivo.length}/15 caracteres mínimos</p>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Voltar
          </button>
          <button onClick={() => onConfirm(motivo)} disabled={motivo.length < 15 || loading}
            className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
            Confirmar Cancelamento
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NotaFiscalDetalhe() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const [showCancel, setShowCancel] = useState(false);
  const [toast, setToast] = useState<{ msg: string; tipo: 'ok' | 'err' } | null>(null);

  const { data: nf, isLoading, refetch } = useNotaFiscal(id);
  const emitir   = useEmitirNF();
  const validar  = useValidarNF();
  const cancelar = useCancelarNF();

  const showToast = (msg: string, tipo: 'ok' | 'err') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 4000);
  };

  const handleEmitir = async () => {
    try {
      const res = await emitir.mutateAsync(id);
      if (res.sucesso) showToast('NF-e autorizada com sucesso pela SEFAZ!', 'ok');
      else showToast(`Rejeição ${res.motivoRejeicao ?? 'desconhecida'}`, 'err');
      refetch();
    } catch {
      showToast('Erro ao emitir NF-e', 'err');
    }
  };

  const handleValidar = async () => {
    try {
      await validar.mutateAsync(id);
      showToast('NF-e validada com sucesso', 'ok');
      refetch();
    } catch {
      showToast('Erro ao validar NF-e', 'err');
    }
  };

  const handleCancelar = async (motivo: string) => {
    try {
      await cancelar.mutateAsync({ id, motivo });
      setShowCancel(false);
      showToast('NF-e cancelada', 'ok');
      refetch();
    } catch (e: any) {
      showToast(e?.message ?? 'Erro ao cancelar', 'err');
    }
  };

  if (isLoading) return (
    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-marca-500" /></div>
  );
  if (!nf) return (
    <div className="text-center py-16 text-slate-500">NF-e não encontrada</div>
  );

  const n = nf as NotaFiscal;
  const sc = STATUS_CFG[n.status] ?? STATUS_CFG.RASCUNHO;
  const totalImpostos = n.valorICMS + n.valorPIS + n.valorCOFINS + n.valorIPI + n.valorISS;
  const carga = n.valorTotal > 0 ? (totalImpostos / n.valorTotal) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 rounded-2xl px-4 py-3 shadow-lg text-sm font-medium flex items-center gap-2 ${toast.tipo === 'ok' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.tipo === 'ok' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {showCancel && (
        <ModalCancelamento
          onClose={() => setShowCancel(false)}
          onConfirm={handleCancelar}
          loading={cancelar.isPending}
        />
      )}

      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => router.back()} className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors mt-1">
          <ArrowLeft className="h-4 w-4 text-slate-500" />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{n.numero}</h1>
            <span className="text-xs font-semibold text-slate-500">Série {n.serie}</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{TIPO_LABEL[n.tipo]}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${sc.bg} ${sc.text}`}>
              {sc.icon}{sc.label}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{n.naturezaOperacao} · {dtcur(n.dataEmissao)}</p>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => refetch()} className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </button>
          {/* Print buttons */}
          {['EMITIDA', 'CANCELADA'].includes(n.status) && n.tipo === 'NFE' && (
            <button
              onClick={() => window.open(`/dashboard/fiscal/${n.id}/danfe`, '_blank')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Printer className="h-4 w-4" /> DANFE
            </button>
          )}
          {['EMITIDA', 'CANCELADA'].includes(n.status) && n.tipo === 'NFCE' && (
            <button
              onClick={() => window.open(`/dashboard/fiscal/${n.id}/nfce`, '_blank')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Printer className="h-4 w-4" /> Cupom NFC-e
            </button>
          )}
          {['RASCUNHO', 'REJEITADA'].includes(n.status) && (
            <button onClick={handleValidar} disabled={validar.isPending}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {validar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Validar
            </button>
          )}
          {['VALIDADA', 'RASCUNHO'].includes(n.status) && (
            <button onClick={handleEmitir} disabled={emitir.isPending}
              className="flex items-center gap-1.5 rounded-xl bg-marca-600 px-3 py-2 text-sm font-semibold text-white hover:bg-marca-700 disabled:opacity-50 transition-colors">
              {emitir.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Emitir
            </button>
          )}
          {['EMITIDA', 'VALIDADA'].includes(n.status) && (
            <button onClick={() => setShowCancel(true)}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-800 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Ban className="h-4 w-4" />Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Alerta rejeição */}
      {n.status === 'REJEITADA' && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-300">Código {n.codigoRejeicao} — Rejeição SEFAZ</p>
            <p className="text-sm text-red-700 dark:text-red-400 mt-0.5">{n.motivoRejeicao}</p>
            <p className="text-xs text-red-500 mt-1">Corrija os dados e reenvie para emissão.</p>
          </div>
        </div>
      )}

      {/* Alerta cancelamento */}
      {n.status === 'CANCELADA' && n.motivoCancelamento && (
        <div className="rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/50 px-5 py-4">
          <p className="font-semibold text-orange-800 dark:text-orange-300">NF-e Cancelada</p>
          <p className="text-sm text-orange-700 dark:text-orange-400 mt-0.5">{n.motivoCancelamento}</p>
          {n.protocoloCancelamento && <p className="text-xs text-orange-500 mt-1">Protocolo: {n.protocoloCancelamento}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Destinatário */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Destinatário</h2>
          <div className="space-y-2.5">
            {[
              { label: 'Razão Social', value: n.destinatario },
              { label: 'CNPJ/CPF', value: n.destinatarioCnpjCpf || 'Consumidor Final' },
              { label: 'UF', value: n.destinatarioUF },
              ...(n.destinatarioEmail ? [{ label: 'E-mail', value: n.destinatarioEmail }] : []),
              ...(n.enderecoEntrega ? [{ label: 'Endereço', value: n.enderecoEntrega }] : []),
            ].map(f => (
              <div key={f.label}>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">{f.label}</p>
                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dados SEFAZ */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Dados SEFAZ</h2>
          <div className="space-y-2.5">
            {n.chaveAcesso && (
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Chave de Acesso</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 break-all">{n.chaveAcesso}</p>
                  <button onClick={() => navigator.clipboard.writeText(n.chaveAcesso!)}
                    className="flex-shrink-0 rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Copy className="h-3 w-3 text-slate-400" />
                  </button>
                </div>
              </div>
            )}
            {n.protocolo && (
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Protocolo</p>
                <p className="text-sm font-mono text-slate-800 dark:text-slate-200">{n.protocolo}</p>
              </div>
            )}
            {n.dataAutorizacao && (
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Autorizado em</p>
                <p className="text-sm text-slate-800 dark:text-slate-200">{dtfmt(n.dataAutorizacao)}</p>
              </div>
            )}
            {n.pedidoNumero && (
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Pedido Vinculado</p>
                <p className="text-sm font-semibold text-marca-600">{n.pedidoNumero}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Regime Tributário</p>
              <p className="text-sm text-slate-800 dark:text-slate-200">{n.regimeTributario.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Itens */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Itens ({n.itens.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                {['Descrição', 'NCM', 'CFOP', 'Qtd', 'Unit.', 'Desc.', 'Total', 'ICMS', 'PIS', 'COFINS'].map(h => (
                  <th key={h} className={`px-3 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wide ${['Qtd', 'Unit.', 'Desc.', 'Total', 'ICMS', 'PIS', 'COFINS'].includes(h) ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {n.itens.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  <td className="px-3 py-2.5">
                    <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{it.descricao}</div>
                    <div className="text-[10px] text-slate-400">{it.unidade} · {it.csosn ? `CSOSN ${it.csosn}` : it.cst ? `CST ${it.cst}` : ''}</div>
                  </td>
                  <td className="px-3 py-2.5 text-xs font-mono text-slate-500">{it.ncm}</td>
                  <td className="px-3 py-2.5 text-xs font-mono text-slate-500">{it.cfop}</td>
                  <td className="px-3 py-2.5 text-right text-xs text-slate-600 dark:text-slate-400 tabular-nums">{it.quantidade}</td>
                  <td className="px-3 py-2.5 text-right text-xs tabular-nums text-slate-600 dark:text-slate-400">{fmt(it.valorUnitario)}</td>
                  <td className="px-3 py-2.5 text-right text-xs tabular-nums text-red-500">{it.desconto > 0 ? `-${fmt(it.desconto)}` : '—'}</td>
                  <td className="px-3 py-2.5 text-right text-xs font-semibold tabular-nums text-slate-800 dark:text-slate-200">{fmt(it.valorTotal)}</td>
                  <td className="px-3 py-2.5 text-right text-[10px] tabular-nums text-orange-600">{pct(it.aliquotaICMS)}</td>
                  <td className="px-3 py-2.5 text-right text-[10px] tabular-nums text-orange-600">{pct(it.aliquotaPIS)}</td>
                  <td className="px-3 py-2.5 text-right text-[10px] tabular-nums text-orange-600">{pct(it.aliquotaCOFINS)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totais tributários */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Totais & Tributação</h2>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Produtos',   value: fmt(n.valorProdutos),  color: 'text-slate-800 dark:text-slate-200' },
            { label: 'Desconto',   value: n.valorDesconto > 0 ? `-${fmt(n.valorDesconto)}` : '—', color: 'text-red-600' },
            { label: 'Frete',      value: n.valorFrete > 0 ? fmt(n.valorFrete) : '—', color: 'text-slate-800 dark:text-slate-200' },
            { label: 'Total NF',   value: fmt(n.valorTotal), color: 'text-marca-600 font-bold text-lg' },
          ].map(f => (
            <div key={f.label}>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">{f.label}</p>
              <p className={`text-sm font-semibold mt-0.5 tabular-nums ${f.color}`}>{f.value}</p>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Impostos</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'ICMS', value: fmt(n.valorICMS), aliq: pct(n.itens[0]?.aliquotaICMS ?? 0) },
                { label: 'PIS',  value: fmt(n.valorPIS),  aliq: pct(n.itens[0]?.aliquotaPIS ?? 0) },
                { label: 'COFINS', value: fmt(n.valorCOFINS), aliq: pct(n.itens[0]?.aliquotaCOFINS ?? 0) },
                { label: 'IPI',  value: fmt(n.valorIPI),  aliq: '—' },
                { label: 'ISS',  value: fmt(n.valorISS),  aliq: '—' },
              ].map(t => (
                <div key={t.label} className="rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 p-3">
                  <p className="text-[10px] text-orange-600 font-semibold uppercase">{t.label} · {t.aliq}</p>
                  <p className="text-sm font-bold text-orange-700 dark:text-orange-400 tabular-nums mt-0.5">{t.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 sm:col-span-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 px-4 py-2.5 flex items-center gap-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total de Impostos</p>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">{fmt(totalImpostos)}</p>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-600" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Carga Tributária</p>
                <p className="text-base font-bold text-orange-600 tabular-nums">{pct(carga)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Observações */}
      {(n.observacoes || n.informacoesAdicionais) && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-3">
          {n.observacoes && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Observações</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{n.observacoes}</p>
            </div>
          )}
          {n.informacoesAdicionais && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Informações Adicionais</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{n.informacoesAdicionais}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
