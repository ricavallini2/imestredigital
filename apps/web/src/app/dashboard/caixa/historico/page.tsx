'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, ChevronRight, Loader2, Landmark } from 'lucide-react';
import { useSessoesCaixa } from '@/hooks/useCaixa';

const fmt  = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dthr = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export default function CaixaHistoricoPage() {
  const router = useRouter();
  const { data, isLoading } = useSessoesCaixa();
  const sessoes = data?.sessoes ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <ArrowLeft className="h-4 w-4 text-slate-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Histórico de Caixa</h1>
          <p className="text-sm text-slate-500">Todos os turnos registrados</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-marca-500" /></div>
      ) : sessoes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 p-12 text-center">
          <Landmark className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-slate-500">Nenhuma sessão registrada</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          {sessoes.map((s: any, i: number) => {
            const dif = s.diferenca ?? 0;
            const ok  = s.status === 'ABERTO' || Math.abs(dif) < 0.01;
            return (
              <button key={s.id} onClick={() => router.push(`/dashboard/caixa/${s.id}`)}
                className="w-full flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-left">
                {/* Status icon */}
                <div className={`flex-shrink-0 rounded-xl p-2.5 ${s.status === 'ABERTO' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <Landmark className={`h-5 w-5 ${s.status === 'ABERTO' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{s.numero}</span>
                    <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${s.status === 'ABERTO' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {s.status === 'ABERTO' ? 'Aberto' : 'Fechado'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{s.operador} · {s.caixa} · {dthr(s.aberturaEm)}</p>
                </div>
                <div className="text-right flex-shrink-0 space-y-0.5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{fmt(s.saldoEsperado)}</p>
                  {s.status === 'FECHADO' && s.diferenca !== undefined && (
                    <div className="flex items-center justify-end gap-1">
                      {ok ? <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                           : dif > 0 ? <AlertTriangle className="h-3 w-3 text-blue-500" />
                           : <XCircle className="h-3 w-3 text-red-500" />}
                      <span className={`text-xs font-medium ${ok ? 'text-emerald-600' : dif > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {dif >= 0 ? '+' : ''}{fmt(dif)}
                      </span>
                    </div>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
