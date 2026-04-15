'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Landmark, Plus, Minus, ArrowDownLeft, ArrowUpRight,
  Clock, User, Lock, Unlock, Loader2, AlertTriangle,
  CheckCircle2, XCircle, ChevronRight, History,
} from 'lucide-react';
import {
  useCaixaAtual, useSessoesCaixa,
  useAbrirCaixa, useFecharCaixa, useRegistrarMovimentacao,
} from '@/hooks/useCaixa';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt  = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const hora = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dthr = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

function tempoAberto(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}min`;
  const h = Math.floor(mins / 60); const m = mins % 60;
  return `${h}h${m > 0 ? m + 'min' : ''}`;
}

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

// ─── Modal Abertura ───────────────────────────────────────────────────────────
function ModalAbertura({ onClose, onConfirm, loading }: {
  onClose: () => void;
  onConfirm: (v: { operador: string; valorAbertura: number; caixa: string; observacoes: string }) => void;
  loading: boolean;
}) {
  const [operador, setOperador] = useState('');
  const [valor, setValor]       = useState('200');
  const [caixa, setCaixa]       = useState('Caixa 01');
  const [obs, setObs]           = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-500 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2.5"><Unlock className="h-5 w-5 text-white" /></div>
            <div>
              <h2 className="text-lg font-bold text-white">Abrir Caixa</h2>
              <p className="text-sm text-emerald-100">Início do turno</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Operador <span className="text-red-500">*</span></label>
              <input value={operador} onChange={(e) => setOperador(e.target.value)} placeholder="Seu nome"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Caixa</label>
              <select value={caixa} onChange={(e) => setCaixa(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white">
                <option>Caixa 01</option><option>Caixa 02</option><option>Caixa 03</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valor de Abertura (Troco Inicial) <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">R$</span>
              <input type="number" min="0" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 pl-9 pr-3 text-sm dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observações</label>
            <textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={2}
              placeholder="Observações do turno (opcional)"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
              Cancelar
            </button>
            <button onClick={() => onConfirm({ operador, valorAbertura: Number(valor), caixa, observacoes: obs })}
              disabled={!operador || loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
              Abrir Caixa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Movimentação ────────────────────────────────────────────────────────
function ModalMovimentacao({ tipo, sessaoId, operador, onClose, onSuccess, loading }: {
  tipo: 'SUPRIMENTO' | 'SANGRIA' | 'DESPESA' | 'OUTROS';
  sessaoId: string; operador: string;
  onClose: () => void; onSuccess: () => void;
  loading: boolean;
}) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor]         = useState('');
  const [forma, setForma]         = useState('DINHEIRO');
  const registrar = useRegistrarMovimentacao();

  const cfg = {
    SUPRIMENTO: { label: 'Suprimento de Caixa', cor: 'bg-blue-500', icon: <ArrowDownLeft className="h-4 w-4" />, placeholder: 'Ex: Reforço de troco' },
    SANGRIA:    { label: 'Sangria de Caixa',    cor: 'bg-red-500',  icon: <ArrowUpRight  className="h-4 w-4" />, placeholder: 'Ex: Depósito bancário' },
    DESPESA:    { label: 'Despesa',              cor: 'bg-orange-500', icon: <Minus        className="h-4 w-4" />, placeholder: 'Ex: Material de escritório' },
    OUTROS:     { label: 'Outra Movimentação',   cor: 'bg-slate-500',  icon: <Plus         className="h-4 w-4" />, placeholder: 'Descreva a movimentação' },
  }[tipo];

  const handleConfirm = async () => {
    await registrar.mutateAsync({ sessaoId, categoria: tipo, descricao, valor: Number(valor), formaPagamento: forma, operador });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
        <div className={`${cfg.cor} px-5 py-4 flex items-center gap-3`}>
          <div className="rounded-lg bg-white/20 p-2">{cfg.icon}</div>
          <h2 className="font-bold text-white">{cfg.label}</h2>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição <span className="text-red-500">*</span></label>
            <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder={cfg.placeholder}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valor <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">R$</span>
              <input type="number" min="0.01" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 pl-9 pr-3 text-sm dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Forma de Pagamento</label>
            <select value={forma} onChange={(e) => setForma(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white">
              <option value="DINHEIRO">Dinheiro</option>
              <option value="PIX">PIX</option>
              <option value="CARTAO_CREDITO">Cartão Crédito</option>
              <option value="CARTAO_DEBITO">Cartão Débito</option>
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancelar</button>
            <button onClick={handleConfirm} disabled={!descricao || !valor || registrar.isPending}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl ${cfg.cor} py-2 text-sm font-bold text-white disabled:opacity-50`}>
              {registrar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : cfg.icon}
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Fechamento ─────────────────────────────────────────────────────────
function ModalFechamento({ sessao, onClose, onConfirm, loading }: {
  sessao: any; onClose: () => void;
  onConfirm: (valorContado: number, obs: string) => void;
  loading: boolean;
}) {
  const [valor, setValor] = useState(String(sessao.saldoEsperado?.toFixed(2) ?? '0'));
  const [obs, setObs]     = useState('');

  const contado   = Number(valor) || 0;
  const esperado  = sessao.saldoEsperado ?? 0;
  const diferenca = contado - esperado;
  const ok        = Math.abs(diferenca) < 0.01;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
        <div className="bg-slate-800 dark:bg-slate-900 px-6 py-5 flex items-center gap-3">
          <div className="rounded-xl bg-white/10 p-2.5"><Lock className="h-5 w-5 text-white" /></div>
          <div>
            <h2 className="text-lg font-bold text-white">Fechar Caixa</h2>
            <p className="text-sm text-slate-400">{sessao.numero} · {sessao.caixa}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Resumo da sessão */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/50 p-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Abertura', valor: fmt(sessao.valorAbertura ?? 0), neutral: true },
              { label: 'Total Entradas', valor: fmt(sessao.totalEntradas ?? 0), positive: true },
              { label: 'Total Saídas', valor: fmt(sessao.totalSaidas ?? 0), negative: true },
              { label: 'Saldo Esperado', valor: fmt(esperado), bold: true },
            ].map(({ label, valor: v, positive, negative, neutral, bold }) => (
              <div key={label} className="flex flex-col">
                <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                <span className={`text-sm font-semibold mt-0.5 ${positive ? 'text-emerald-600 dark:text-emerald-400' : negative ? 'text-red-600 dark:text-red-400' : bold ? 'text-slate-900 dark:text-slate-100 text-base' : 'text-slate-700 dark:text-slate-300'}`}>
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* Contagem física */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Valor Contado em Caixa <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-2">Informe o total de dinheiro fisicamente presente no caixa</p>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
              <input type="number" min="0" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-3 pl-10 pr-4 text-lg font-bold dark:text-white focus:border-marca-400 focus:outline-none" />
            </div>
          </div>

          {/* Diferença */}
          <div className={`rounded-xl px-5 py-4 flex items-center justify-between
            ${ok ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                 : diferenca > 0 ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                 : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Diferença</p>
              <p className="text-xs text-slate-500">
                {ok ? 'Caixa conferido — sem divergência' : diferenca > 0 ? 'Sobra de caixa' : 'Falta de caixa'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {ok ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  : diferenca > 0 ? <AlertTriangle className="h-5 w-5 text-blue-500" />
                  : <XCircle className="h-5 w-5 text-red-500" />}
              <span className={`text-xl font-bold tabular-nums
                ${ok ? 'text-emerald-600 dark:text-emerald-400'
                     : diferenca > 0 ? 'text-blue-600 dark:text-blue-400'
                     : 'text-red-600 dark:text-red-400'}`}>
                {diferenca >= 0 ? '+' : ''}{fmt(diferenca)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observações do Fechamento</label>
            <textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={2}
              placeholder="Ocorrências, diferenças, etc."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white resize-none" />
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
              Cancelar
            </button>
            <button onClick={() => onConfirm(contado, obs)} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 dark:bg-slate-700 py-2.5 text-sm font-bold text-white hover:bg-slate-900 disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Confirmar Fechamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function CaixaPage() {
  const router = useRouter();
  const { data, isLoading, refetch } = useCaixaAtual();
  const { data: historico } = useSessoesCaixa();

  const abrir  = useAbrirCaixa();
  const fechar = useFecharCaixa();

  const [showAbertura,  setShowAbertura]  = useState(false);
  const [showFechamento, setShowFechamento] = useState(false);
  const [showMovModal,  setShowMovModal]  = useState<'SUPRIMENTO'|'SANGRIA'|'DESPESA'|null>(null);

  const sessaoAberta = data?.sessao;
  const movs         = data?.movimentacoes ?? [];
  const sessoes      = historico?.sessoes ?? [];

  const handleAbrir = async (dto: any) => {
    await abrir.mutateAsync(dto);
    setShowAbertura(false);
    refetch();
  };

  const handleFechar = async (valorContado: number, obs: string) => {
    if (!sessaoAberta) return;
    await fechar.mutateAsync({ id: sessaoAberta.id, valorContado, observacoes: obs });
    setShowFechamento(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 p-3">
            <Landmark className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Controle de Caixa</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Abertura, movimentações e fechamento de turno</p>
          </div>
        </div>
        <button onClick={() => router.push('/dashboard/caixa/historico')}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <History className="h-4 w-4" /> Histórico
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-marca-500" />
        </div>
      ) : !sessaoAberta ? (
        // ── SEM CAIXA ABERTO ──────────────────────────────────────────────────
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
              <Lock className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Caixa Fechado</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Nenhum turno em andamento. Abra o caixa para começar a operar.</p>
            <button onClick={() => setShowAbertura(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-3 font-bold text-white hover:bg-emerald-600 transition-colors text-base">
              <Unlock className="h-5 w-5" /> Abrir Caixa
            </button>
          </div>

          {/* Últimas sessões */}
          {sessoes.filter((s: any) => s.status === 'FECHADO').length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
              <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Últimas Sessões</h2>
              </div>
              {sessoes.filter((s: any) => s.status === 'FECHADO').slice(0, 5).map((s: any) => (
                <button key={s.id} onClick={() => router.push(`/dashboard/caixa/${s.id}`)}
                  className="w-full flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.numero}</p>
                    <p className="text-xs text-slate-400">{s.operador} · {dthr(s.aberturaEm)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{fmt(s.saldoEsperado)}</p>
                      {s.diferenca !== undefined && (
                        <p className={`text-xs font-medium ${s.diferenca === 0 ? 'text-emerald-600' : s.diferenca > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {s.diferenca >= 0 ? '+' : ''}{fmt(s.diferenca)}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        // ── CAIXA ABERTO ──────────────────────────────────────────────────────
        <div className="space-y-5">
          {/* Banner de status */}
          <div className="rounded-2xl bg-emerald-500 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/20 p-3">
                <Unlock className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                  <p className="font-bold text-white text-lg">{sessaoAberta.numero} — {sessaoAberta.caixa}</p>
                </div>
                <div className="flex items-center gap-4 mt-0.5">
                  <span className="flex items-center gap-1 text-emerald-100 text-sm">
                    <User className="h-3.5 w-3.5" /> {sessaoAberta.operador}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-100 text-sm">
                    <Clock className="h-3.5 w-3.5" /> Aberto há {tempoAberto(sessaoAberta.aberturaEm)}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowFechamento(true)}
              className="flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-5 py-2.5 text-sm font-bold text-white transition-colors border border-white/30">
              <Lock className="h-4 w-4" /> Fechar Caixa
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Saldo atual */}
            <div className="col-span-2 lg:col-span-1 rounded-2xl bg-slate-900 dark:bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Saldo em Caixa</p>
              <p className="mt-1 text-2xl font-bold text-white tabular-nums">{fmt(sessaoAberta.saldoEsperado)}</p>
              <p className="mt-1 text-xs text-slate-500">Abertura: {fmt(sessaoAberta.valorAbertura)}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5">
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Entradas</p>
              <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">{fmt(sessaoAberta.totalEntradas)}</p>
            </div>
            <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-5">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Saídas</p>
              <p className="mt-1 text-xl font-bold text-red-700 dark:text-red-300 tabular-nums">{fmt(sessaoAberta.totalSaidas)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <p className="text-sm text-slate-500">Movimentações</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{sessaoAberta.qtdMovimentacoes}</p>
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => setShowMovModal('SUPRIMENTO')}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <div className="rounded-xl bg-blue-500 p-2.5"><ArrowDownLeft className="h-5 w-5 text-white" /></div>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Suprimento</span>
            </button>
            <button onClick={() => setShowMovModal('SANGRIA')}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <div className="rounded-xl bg-red-500 p-2.5"><ArrowUpRight className="h-5 w-5 text-white" /></div>
              <span className="text-sm font-semibold text-red-700 dark:text-red-300">Sangria</span>
            </button>
            <button onClick={() => setShowMovModal('DESPESA')}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-4 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
              <div className="rounded-xl bg-orange-500 p-2.5"><Minus className="h-5 w-5 text-white" /></div>
              <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">Despesa</span>
            </button>
          </div>

          {/* Movimentações do turno */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Movimentações do Turno</h2>
              <span className="text-xs text-slate-400">{movs.length} registro{movs.length !== 1 ? 's' : ''}</span>
            </div>

            {movs.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">Nenhuma movimentação ainda</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {movs.map((mov: any) => {
                  const cfg = CATEGORIA_CONFIG[mov.categoria] ?? CATEGORIA_CONFIG.OUTROS;
                  const isEntrada = mov.tipo === 'ENTRADA';
                  return (
                    <div key={mov.id} className="flex items-center gap-4 px-5 py-3.5">
                      {/* Ícone */}
                      <div className={`flex-shrink-0 rounded-xl p-2 ${cfg.bg}`}>
                        {isEntrada
                          ? <ArrowDownLeft className={`h-4 w-4 ${cfg.cor}`} />
                          : <ArrowUpRight  className={`h-4 w-4 ${cfg.cor}`} />}
                      </div>
                      {/* Descrição */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.cor}`}>
                            {cfg.label}
                          </span>
                          {mov.formaPagamento && (
                            <span className="text-[10px] text-slate-400">{FORMA_LABEL[mov.formaPagamento]}</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{mov.descricao}</p>
                        <p className="text-xs text-slate-400">{hora(mov.criadoEm)} · {mov.operador}</p>
                      </div>
                      {/* Valor */}
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
      )}

      {/* Modais */}
      {showAbertura && (
        <ModalAbertura onClose={() => setShowAbertura(false)} onConfirm={handleAbrir} loading={abrir.isPending} />
      )}
      {showFechamento && sessaoAberta && (
        <ModalFechamento sessao={sessaoAberta} onClose={() => setShowFechamento(false)} onConfirm={handleFechar} loading={fechar.isPending} />
      )}
      {showMovModal && sessaoAberta && (
        <ModalMovimentacao
          tipo={showMovModal} sessaoId={sessaoAberta.id} operador={sessaoAberta.operador}
          onClose={() => setShowMovModal(null)} onSuccess={() => { setShowMovModal(null); refetch(); }}
          loading={false}
        />
      )}
    </div>
  );
}
