'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Landmark, ArrowDownLeft, ArrowUpRight,
  CheckCircle2, AlertTriangle, XCircle, Loader2, User, Clock,
} from 'lucide-react';
import { useSessaoCaixa } from '@/hooks/useCaixa';

const fmt  = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dthr = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const hora = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const CATEGORIA_CONFIG: Record<string, { label: string; cor: string; bg: string }> = {
  VENDA:      { label: 'Venda',      cor: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  SUPRIMENTO: { label: 'Suprimento', cor: 'text-blue-700 dark:text-blue-400',       bg: 'bg-blue-100 dark:bg-blue-900/30' },
  REEMBOLSO:  { label: 'Reembolso',  cor: 'text-amber-700 dark:text-amber-400',     bg: 'bg-amber-100 dark:bg-amber-900/30' },
  SANGRIA:    { label: 'Sangria',    cor: 'text-red-700 dark:text-red-400',         bg: 'bg-red-100 dark:bg-red-900/30' },
  DESPESA:    { label: 'Despesa',    cor: 'text-orange-700 dark:text-orange-400',   bg: 'bg-orange-100 dark:bg-orange-900/30' },
  OUTROS:     { label: 'Outros',     cor: 'text-slate-600 dark:text-slate-400',     bg: 'bg-slate-100 dark:bg-slate-700' },
};

const FORMA_LABEL: Record<string, string> = {
  DINHEIRO: 'Dinheiro', PIX: 'PIX',
  CARTAO_CREDITO: 'Crédito', CARTAO_DEBITO: 'Débito', MISTO: 'Misto',
};

export default function SessaoCaixaPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();
  const { data, isLoading } = useSessaoCaixa(id);

  if (isLoading) return (
    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-marca-500" /></div>
  );

  if (!data?.sessao) return (
    <div className="text-center py-16 text-slate-500">Sessão não encontrada</div>
  );

  const s    = data.sessao;
  const movs = data.movimentacoes ?? [];

  const dif = s.diferenca ?? 0;
  const difOk = s.status === 'ABERTO' || Math.abs(dif) < 0.01;

  const entradas = movs.filter((m: any) => m.tipo === 'ENTRADA');
  const saidas   = movs.filter((m: any) => m.tipo === 'SAIDA');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <ArrowLeft className="h-4 w-4 text-slate-500" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{s.numero}</h1>
            <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${s.status === 'ABERTO' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
              {s.status === 'ABERTO' ? 'Aberto' : 'Fechado'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{s.caixa} · {s.operador}</p>
        </div>
      </div>

      {/* Resumo financeiro */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-700/50 px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Resumo do Turno</h2>
        </div>
        <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-slate-700 sm:grid-cols-4">
          {[
            { label: 'Abertura', value: fmt(s.valorAbertura), sub: dthr(s.aberturaEm) },
            { label: 'Entradas', value: fmt(s.totalEntradas), color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Saídas',   value: fmt(s.totalSaidas),   color: 'text-red-600 dark:text-red-400' },
            { label: 'Saldo Esperado', value: fmt(s.saldoEsperado), bold: true },
          ].map(({ label, value, sub, color, bold }) => (
            <div key={label} className="bg-white dark:bg-slate-800 p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-lg font-bold mt-0.5 tabular-nums ${color ?? (bold ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300')}`}>{value}</p>
              {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
            </div>
          ))}
        </div>

        {/* Fechamento */}
        {s.status === 'FECHADO' && (
          <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fechamento</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500">Fechado em</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.fechamentoEm ? dthr(s.fechamentoEm) : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Valor Contado</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{fmt(s.valorContado ?? 0)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Diferença</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {difOk ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          : dif > 0 ? <AlertTriangle className="h-4 w-4 text-blue-500" />
                          : <XCircle className="h-4 w-4 text-red-500" />}
                  <span className={`text-sm font-bold ${difOk ? 'text-emerald-600' : dif > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {dif >= 0 ? '+' : ''}{fmt(dif)}
                  </span>
                </div>
              </div>
            </div>
            {s.observacoesFechamento && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-300">
                {s.observacoesFechamento}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Movimentações */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Movimentações</h2>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">↓ {entradas.length} entradas</span>
            <span className="text-red-600 dark:text-red-400 font-medium">↑ {saidas.length} saídas</span>
          </div>
        </div>

        {movs.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">Nenhuma movimentação neste turno</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {movs.map((mov: any) => {
              const cfg = CATEGORIA_CONFIG[mov.categoria] ?? CATEGORIA_CONFIG.OUTROS;
              const isEntrada = mov.tipo === 'ENTRADA';
              return (
                <div key={mov.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className={`flex-shrink-0 rounded-xl p-2 ${cfg.bg}`}>
                    {isEntrada
                      ? <ArrowDownLeft className={`h-4 w-4 ${cfg.cor}`} />
                      : <ArrowUpRight  className={`h-4 w-4 ${cfg.cor}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.cor}`}>
                        {cfg.label}
                      </span>
                      {mov.formaPagamento && (
                        <span className="text-[10px] text-slate-400">{FORMA_LABEL[mov.formaPagamento]}</span>
                      )}
                      {mov.pedidoNumero && (
                        <span className="text-[10px] text-slate-400 font-mono">{mov.pedidoNumero}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{mov.descricao}</p>
                    <p className="text-xs text-slate-400">{hora(mov.criadoEm)} · {mov.operador}</p>
                  </div>
                  <span className={`text-base font-bold tabular-nums flex-shrink-0 ${isEntrada ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isEntrada ? '+' : '−'}{fmt(mov.valor)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
