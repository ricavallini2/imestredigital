'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Landmark,
  Plus,
  Minus,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  User,
  Lock,
  Unlock,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  History,
  Wallet,
  Receipt,
  ShoppingCart,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  useCaixaAtual,
  useSessoesCaixa,
  useAbrirCaixa,
  useFecharCaixa,
  useRegistrarMovimentacao,
} from '@/hooks/useCaixa';
import { baseConferencia, type SessaoCaixa } from '@/services/caixa.service';
import { pedidosService } from '@/services/pedidos.service';
import { useFormasPagamento } from '@/hooks/useFormasPagamento';
import {
  excedeDescontoMaximo,
  percentualDesconto,
  obterDescontoMaximoPct,
} from '@/lib/config-vendas';
import { obterSessao, obterUsuarioLogado } from '@/lib/sessao';
import { ModalAutorizacao } from '@/components/ui/modal-autorizacao';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
/** Dinheiro em 2 casas: impede que a subtração de floats vaze para o backend. */
const arredondar = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;
/** Um centavo de folga — comparação de dinheiro nunca usa igualdade exata. */
const EPS = 0.004;
const hora = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dthr = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

/** Extrai a mensagem do erro do backend (que pode vir como array do class-validator). */
const mensagemErro = (e: any, padrao: string) => {
  const m = e?.response?.data?.message;
  return Array.isArray(m) ? m[0] : (m ?? padrao);
};

function tempoAberto(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h${m > 0 ? m + 'min' : ''}`;
}

const CATEGORIA_CONFIG: Record<string, { label: string; cor: string; bg: string }> = {
  VENDA: {
    label: 'Venda',
    cor: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  SUPRIMENTO: {
    label: 'Suprimento',
    cor: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  REEMBOLSO: {
    label: 'Reembolso',
    cor: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  SANGRIA: {
    label: 'Sangria',
    cor: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
  },
  DESPESA: {
    label: 'Despesa',
    cor: 'text-orange-700 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
  },
  OUTROS: {
    label: 'Outros',
    cor: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-700',
  },
};

/** Cobre todo o enum TipoPagamento do order-service (+ MISTO, legado do mock). */
const FORMA_LABEL: Record<string, string> = {
  DINHEIRO: 'Dinheiro',
  PIX: 'PIX',
  CARTAO_CREDITO: 'Crédito',
  CARTAO_DEBITO: 'Débito',
  BOLETO: 'Boleto',
  TRANSFERENCIA: 'Transferência',
  MARKETPLACE: 'Marketplace',
  MISTO: 'Misto',
};

// ─── Modal Abertura ───────────────────────────────────────────────────────────
function ModalAbertura({
  operador,
  onClose,
  onConfirm,
  loading,
  erro,
}: {
  /** Operador FIXO = usuário logado. Não é editável (regra do negócio). */
  operador: string;
  onClose: () => void;
  onConfirm: (v: {
    operador: string;
    valorAbertura: number;
    caixa: string;
    observacoes: string;
  }) => void;
  loading: boolean;
  /** Ex.: 409 quando já existe um caixa aberto no tenant. */
  erro?: string;
}) {
  const [valor, setValor] = useState('200');
  const [caixa, setCaixa] = useState('Caixa 01');
  const [obs, setObs] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-500 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2.5">
              <Unlock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Abrir Caixa</h2>
              <p className="text-sm text-emerald-100">Início do turno</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Operador
              </label>
              {/* Travado no usuário logado: quem abre o turno é quem responde por
                  ele. Não editável — nem por gerente/admin (regra do negócio). */}
              <div
                title="Operador do turno é sempre o usuário logado"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-200"
              >
                <User className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate font-medium">{operador || '—'}</span>
                <Lock className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Caixa
              </label>
              <select
                value={caixa}
                onChange={(e) => setCaixa(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white"
              >
                <option>Caixa 01</option>
                <option>Caixa 02</option>
                <option>Caixa 03</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Valor de Abertura (Troco Inicial) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                R$
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 pl-9 pr-3 text-sm dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Observações
            </label>
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              rows={2}
              placeholder="Observações do turno (opcional)"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white resize-none"
            />
          </div>

          {erro && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
              {erro}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={() =>
                onConfirm({ operador, valorAbertura: Number(valor), caixa, observacoes: obs })
              }
              // Campo vazio abriria o turno com R$ 0,00: `Number('')` é 0 e passa
              // no `@Min(0)` do backend. Zero digitado continua válido. Operador
              // vem travado do usuário logado — se faltar, não há quem responda.
              disabled={!operador || valor.trim() === '' || loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
              Abrir Caixa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Movimentação ────────────────────────────────────────────────────────
function ModalMovimentacao({
  tipo,
  sessaoId,
  operador,
  onClose,
  onSuccess,
  loading,
}: {
  tipo: 'SUPRIMENTO' | 'SANGRIA' | 'DESPESA' | 'OUTROS';
  sessaoId: string;
  operador: string;
  onClose: () => void;
  onSuccess: () => void;
  loading: boolean;
}) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [forma, setForma] = useState('DINHEIRO');
  const [erro, setErro] = useState('');
  const registrar = useRegistrarMovimentacao();

  // Suprimento e sangria são movimento de GAVETA por definição — o backend os
  // trata como dinheiro qualquer que seja a forma enviada ("sangria via PIX" não
  // existe). Oferecer o select só geraria dado ruim (PIX negativo nos totais por
  // forma). Despesa e outros, sim, podem sair por outra forma.
  const escolheForma = tipo === 'DESPESA' || tipo === 'OUTROS';

  const cfg = {
    SUPRIMENTO: {
      label: 'Suprimento de Caixa',
      cor: 'bg-blue-500',
      icon: <ArrowDownLeft className="h-4 w-4" />,
      placeholder: 'Ex: Reforço de troco',
    },
    SANGRIA: {
      label: 'Sangria de Caixa',
      cor: 'bg-red-500',
      icon: <ArrowUpRight className="h-4 w-4" />,
      placeholder: 'Ex: Depósito bancário',
    },
    DESPESA: {
      label: 'Despesa',
      cor: 'bg-orange-500',
      icon: <Minus className="h-4 w-4" />,
      placeholder: 'Ex: Material de escritório',
    },
    OUTROS: {
      label: 'Outra Movimentação',
      cor: 'bg-slate-500',
      icon: <Plus className="h-4 w-4" />,
      placeholder: 'Descreva a movimentação',
    },
  }[tipo];

  const handleConfirm = async () => {
    setErro('');
    try {
      await registrar.mutateAsync({
        sessaoId,
        categoria: tipo,
        descricao,
        valor: Number(valor),
        formaPagamento: escolheForma ? forma : 'DINHEIRO',
        operador,
      });
      onSuccess();
    } catch (e: any) {
      // 422 quando o caixa foi fechado em outra aba entre abrir o modal e confirmar.
      setErro(mensagemErro(e, 'Erro ao registrar a movimentação.'));
    }
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descrição <span className="text-red-500">*</span>
            </label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder={cfg.placeholder}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Valor <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                R$
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 pl-9 pr-3 text-sm dark:text-white"
              />
            </div>
          </div>
          {escolheForma ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Forma de Pagamento
              </label>
              <select
                value={forma}
                onChange={(e) => setForma(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white"
              >
                <option value="DINHEIRO">Dinheiro</option>
                <option value="PIX">PIX</option>
                <option value="CARTAO_CREDITO">Cartão Crédito</option>
                <option value="CARTAO_DEBITO">Cartão Débito</option>
              </select>
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
              Movimentação em <span className="font-semibold">dinheiro</span> — entra e sai da
              gaveta.
            </p>
          )}
          {erro && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
              {erro}
            </p>
          )}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!descricao || !valor || registrar.isPending}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl ${cfg.cor} py-2 text-sm font-bold text-white disabled:opacity-50`}
            >
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
function ModalFechamento({
  sessao,
  onClose,
  onConfirm,
  loading,
  erro,
}: {
  sessao: SessaoCaixa;
  onClose: () => void;
  onConfirm: (valorContado: number, obs: string) => void;
  loading: boolean;
  /** Ex.: 422 quando o turno já foi fechado em outra aba. */
  erro?: string;
}) {
  // A conferência é contra o DINHEIRO da gaveta, não contra o movimento total do
  // turno: cartão e PIX entram no `saldoEsperado` mas não estão fisicamente ali.
  // O service já garante `number` e já degrada `saldoEsperadoDinheiro` para
  // `saldoEsperado` quando o backend não expõe o campo.
  const esperadoDinheiro = sessao.saldoEsperadoDinheiro;
  // Começa VAZIO de propósito: pré-preencher com o esperado faz o operador só
  // clicar em Confirmar, a diferença dá zero sempre e a conferência vira teatro
  // (uma sangria não registrada nunca apareceria). A contagem tem que ser digitada.
  const [valor, setValor] = useState('');
  const [obs, setObs] = useState('');

  const contou = valor.trim() !== '';
  const contado = Number(valor) || 0;
  const diferenca = contado - esperadoDinheiro;
  const ok = Math.abs(diferenca) < 0.01;

  // Formas que NÃO entram na conferência: explicam por que o esperado em dinheiro
  // é menor que o movimento do turno. Formas zeradas só poluiriam o modal.
  const outrasFormas = sessao.totaisPorForma.filter(
    (t) => t.formaPagamento !== 'DINHEIRO' && Math.abs(t.liquido) >= 0.01,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
        <div className="bg-slate-800 dark:bg-slate-900 px-6 py-5 flex items-center gap-3">
          <div className="rounded-xl bg-white/10 p-2.5">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Fechar Caixa</h2>
            <p className="text-sm text-slate-400">
              {sessao.numero} · {sessao.caixa}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Resumo da sessão */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/50 p-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Abertura', valor: fmt(sessao.valorAbertura), neutral: true },
              { label: 'Total Entradas', valor: fmt(sessao.totalEntradas), positive: true },
              { label: 'Total Saídas', valor: fmt(sessao.totalSaidas), negative: true },
              { label: 'Movimento Total do Turno', valor: fmt(sessao.saldoEsperado), bold: true },
            ].map(({ label, valor: v, positive, negative, neutral, bold }) => (
              <div key={label} className="flex flex-col">
                <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                <span
                  className={`text-sm font-semibold mt-0.5 ${positive ? 'text-emerald-600 dark:text-emerald-400' : negative ? 'text-red-600 dark:text-red-400' : bold ? 'text-slate-900 dark:text-slate-100 text-base' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* Base da conferência: só o dinheiro da gaveta */}
          <div className="rounded-2xl border border-marca-200 dark:border-marca-800 bg-marca-50 dark:bg-marca-900/20 px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-marca-800 dark:text-marca-200">
                  Dinheiro na gaveta (esperado)
                </p>
                <p className="text-xs text-marca-600/80 dark:text-marca-400/80">
                  Base da conferência
                </p>
              </div>
              <span className="text-2xl font-bold tabular-nums text-marca-700 dark:text-marca-300">
                {fmt(esperadoDinheiro)}
              </span>
            </div>

            {outrasFormas.length > 0 && (
              <div className="mt-3 border-t border-marca-200/70 dark:border-marca-800/70 pt-2.5">
                <p className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {outrasFormas.map((t, i) => (
                    <span key={t.formaPagamento}>
                      {i > 0 && <span className="mr-2 text-slate-300 dark:text-slate-600">·</span>}
                      {FORMA_LABEL[t.formaPagamento] ?? t.formaPagamento}{' '}
                      <span className="font-semibold tabular-nums text-slate-600 dark:text-slate-300">
                        {fmt(t.liquido)}
                      </span>
                    </span>
                  ))}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Não entram na conferência — não estão na gaveta.
                </p>
              </div>
            )}
          </div>

          {/* Contagem física */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Valor Contado em Caixa <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Informe o total de dinheiro fisicamente presente no caixa
            </p>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                R$
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-3 pl-10 pr-4 text-lg font-bold dark:text-white focus:border-marca-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Diferença */}
          <div
            className={`rounded-xl px-5 py-4 flex items-center justify-between
            ${
              !contou
                ? 'bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700'
                : ok
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                  : diferenca > 0
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Diferença</p>
              <p className="text-xs text-slate-500">
                {!contou
                  ? 'Conte o dinheiro da gaveta e informe o valor acima'
                  : ok
                    ? 'Caixa conferido — sem divergência'
                    : diferenca > 0
                      ? 'Sobra de caixa'
                      : 'Falta de caixa'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!contou ? (
                <span className="text-xl font-bold tabular-nums text-slate-300 dark:text-slate-600">
                  —
                </span>
              ) : (
                <>
                  {ok ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : diferenca > 0 ? (
                    <AlertTriangle className="h-5 w-5 text-blue-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span
                    className={`text-xl font-bold tabular-nums
                    ${
                      ok
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : diferenca > 0
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {diferenca >= 0 ? '+' : ''}
                    {fmt(diferenca)}
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Observações do Fechamento
            </label>
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              rows={2}
              placeholder="Ocorrências, diferenças, etc."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white resize-none"
            />
          </div>

          {erro && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
              {erro}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(contado, obs)}
              // Sem contagem digitada não há conferência: o botão fica travado.
              disabled={loading || !contou}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 dark:bg-slate-700 py-2.5 text-sm font-bold text-white hover:bg-slate-900 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
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
  const { data, isLoading, isError, error, refetch } = useCaixaAtual();
  const { data: historico } = useSessoesCaixa();

  const abrir = useAbrirCaixa();
  const fechar = useFecharCaixa();

  const [showAbertura, setShowAbertura] = useState(false);
  const [showFechamento, setShowFechamento] = useState(false);
  const [erroAbertura, setErroAbertura] = useState('');
  const [erroFechamento, setErroFechamento] = useState('');
  const [showMovModal, setShowMovModal] = useState<'SUPRIMENTO' | 'SANGRIA' | 'DESPESA' | null>(
    null,
  );

  const sessaoAberta = data?.sessao;

  // ── Vendas em aberto (fechadas pelo vendedor, aguardando recebimento) ──────
  const { data: vendasAbertas, refetch: refetchVendas } = useQuery({
    queryKey: ['pedidos', 'aguardando-recebimento'],
    queryFn: () => pedidosService.listar({ statusPagamento: 'PENDENTE', limite: 50 } as any),
    refetchInterval: 30_000,
    enabled: !!sessaoAberta,
  });
  const pendentes = ((vendasAbertas as any)?.dados ?? []) as any[];
  const [receber, setReceber] = useState<any | null>(null);
  const [formaReceb, setFormaReceb] = useState('DINHEIRO');
  const [formaDescReceb, setFormaDescReceb] = useState('');
  const [valorReceb, setValorReceb] = useState('');
  const [parcelasReceb, setParcelasReceb] = useState(1);
  const [recebendo, setRecebendo] = useState(false);
  const [recebidoOk, setRecebidoOk] = useState<{
    id: string;
    numero: string;
    /** Excedente devolvido ao cliente — não foi recebido, é só aviso ao operador. */
    troco: number;
  } | null>(null);
  const [erroReceb, setErroReceb] = useState('');
  const [liberacaoPend, setLiberacaoPend] = useState<any | null>(null);
  const [liberadoPorReceb, setLiberadoPorReceb] = useState<string | null>(null);

  // Formas de pagamento cadastradas (bandeira × parcelas).
  const { data: formasCadastradas } = useFormasPagamento({ ativa: true });

  /** % de desconto do pedido (bruto = total líquido + desconto; PDV não usa frete). */
  const descontoPedidoPct = (p: any) => {
    const descontoV = Number(p?.valorDesconto ?? 0);
    const bruto = Number(p?.valorTotal ?? 0) + descontoV - Number(p?.valorFrete ?? 0);
    return percentualDesconto(bruto, descontoV);
  };
  const pedidoExcedeTeto = (p: any) => {
    const descontoV = Number(p?.valorDesconto ?? 0);
    const bruto = Number(p?.valorTotal ?? 0) + descontoV - Number(p?.valorFrete ?? 0);
    return excedeDescontoMaximo(bruto, descontoV);
  };

  /** Abre o modal de recebimento, pré-preenchido com o pagamento PREVISTO do pedido. */
  const abrirReceberEfetivo = (p: any) => {
    setReceber(p);
    setValorReceb(String(Number(p.valorTotal ?? 0).toFixed(2)));
    setErroReceb('');
    // Pré-preenche: metodoPagamento pode ser uma forma cadastrada ("Amex Crédito 02x")
    // ou um tipo puro ("PIX"). Casa com o cadastro para preencher tipo+parcelas.
    const previsto = String(p.metodoPagamento ?? '');
    const forma = (formasCadastradas ?? []).find((f) => f.descricao === previsto);
    if (forma) {
      setFormaReceb(forma.tipo);
      setFormaDescReceb(forma.descricao);
      setParcelasReceb(forma.parcelas ?? 1);
    } else if (
      ['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO'].includes(previsto)
    ) {
      setFormaReceb(previsto);
      setFormaDescReceb('');
      setParcelasReceb(Number(p.parcelas) || 1);
    } else {
      setFormaReceb('DINHEIRO');
      setFormaDescReceb('');
      setParcelasReceb(1);
    }
  };

  /** Gate de liberação: desconto acima do teto exige gerente/admin ou flag. */
  const abrirReceber = (p: any) => {
    setLiberadoPorReceb(null);
    const cargo = String(obterSessao()?.cargo ?? '').toUpperCase();
    if (pedidoExcedeTeto(p) && cargo !== 'ADMIN' && cargo !== 'GERENTE') {
      setLiberacaoPend(p);
      return;
    }
    abrirReceberEfetivo(p);
  };

  // ── Valor recebido × total do pedido ──────────────────────────────────────
  // O campo é editável, então o operador digita o que o cliente ENTREGOU. Em
  // dinheiro, o excedente é TROCO (volta para o cliente) e não pode ser
  // registrado como pagamento — a gaveta não fica com ele. Nas demais formas não
  // existe troco: valor acima do total é erro de digitação, e registrar inflaria
  // o caixa em silêncio.
  const totalPedidoReceb = arredondar(Number(receber?.valorTotal ?? 0));
  const informadoReceb = arredondar(Number(valorReceb) || 0);
  const excedenteReceb = Math.max(0, arredondar(informadoReceb - totalPedidoReceb));
  const trocoReceb = formaReceb === 'DINHEIRO' ? excedenteReceb : 0;
  const excedenteInvalido = formaReceb !== 'DINHEIRO' && excedenteReceb > EPS;
  // SUB-RECEBIMENTO: o caixa recebe o valor INTEGRAL do pedido. Receber menos
  // deixaria o pedido PARCIAL — que sai da lista de "Vendas em Aberto" (filtra
  // statusPagamento=PENDENTE) e vira saldo órfão, invisível e incobrável. Este
  // modal é de forma ÚNICA; pagamento dividido/parcial não é suportado aqui.
  const faltaReceber = informadoReceb + EPS < totalPedidoReceb;

  const confirmarRecebimento = async () => {
    if (!receber) return;
    if (excedenteInvalido) {
      setErroReceb(
        `Valor acima do total do pedido (${fmt(totalPedidoReceb)}). Em ${
          FORMA_LABEL[formaReceb] ?? formaReceb
        } não há troco — corrija o valor recebido.`,
      );
      return;
    }
    if (faltaReceber) {
      setErroReceb(
        `O caixa recebe o valor integral do pedido (${fmt(totalPedidoReceb)}). ` +
          'Recebimento parcial não é suportado — informe o valor total.',
      );
      return;
    }
    // Pagamento = o que a loja RETÉM. Com troco, o registro é pelo total do
    // pedido; o excedente só é informado ao operador para devolução.
    const valorPago =
      informadoReceb > 0 ? arredondar(informadoReceb - trocoReceb) : totalPedidoReceb;
    setRecebendo(true);
    setErroReceb('');
    try {
      await pedidosService.registrarPagamento(receber.id, {
        forma: formaReceb,
        valor: valorPago,
        parcelas: formaReceb === 'CARTAO_CREDITO' ? parcelasReceb : undefined,
        descricao:
          formaDescReceb || (liberadoPorReceb ? `Liberado por: ${liberadoPorReceb}` : undefined),
      });
      setRecebidoOk({ id: receber.id, numero: receber.numero ?? receber.id, troco: trocoReceb });
      setReceber(null);
      refetchVendas();
      refetch();
    } catch (e: any) {
      const m = e?.response?.data?.message;
      setErroReceb(Array.isArray(m) ? m[0] : (m ?? 'Erro ao registrar o recebimento.'));
    } finally {
      setRecebendo(false);
    }
  };
  const movs = data?.movimentacoes ?? [];
  const sessoes = historico?.sessoes ?? [];

  const handleAbrir = async (dto: {
    operador: string;
    valorAbertura: number;
    caixa: string;
    observacoes: string;
  }) => {
    setErroAbertura('');
    try {
      await abrir.mutateAsync(dto);
      setShowAbertura(false);
      refetch();
    } catch (e: any) {
      // 409: outro operador já abriu o caixa deste tenant.
      setErroAbertura(mensagemErro(e, 'Erro ao abrir o caixa.'));
      refetch();
    }
  };

  const handleFechar = async (valorContado: number, obs: string) => {
    if (!sessaoAberta) return;
    setErroFechamento('');
    try {
      await fechar.mutateAsync({ id: sessaoAberta.id, valorContado, observacoes: obs });
      setShowFechamento(false);
      refetch();
    } catch (e: any) {
      // 422: o turno já havia sido fechado (ex.: outra aba).
      setErroFechamento(mensagemErro(e, 'Erro ao fechar o caixa.'));
      refetch();
    }
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Controle de Caixa
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Abertura, movimentações e fechamento de turno
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/dashboard/caixa/historico')}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <History className="h-4 w-4" /> Histórico
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-marca-500" />
        </div>
      ) : isError ? (
        // Falha ao consultar o caixa: NÃO cair no estado "Caixa Fechado", que
        // convidaria a abrir um segundo turno em cima de um já aberto.
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-800 dark:bg-red-900/20">
          <XCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
          <h2 className="text-lg font-bold text-red-800 dark:text-red-300">
            Não foi possível carregar o caixa
          </h2>
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {mensagemErro(error, 'Verifique sua conexão e tente novamente.')}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      ) : !sessaoAberta ? (
        // ── SEM CAIXA ABERTO ──────────────────────────────────────────────────
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
              <Lock className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Caixa Fechado</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Nenhum turno em andamento. Abra o caixa para começar a operar.
            </p>
            <button
              onClick={() => {
                setErroAbertura('');
                setShowAbertura(true);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-3 font-bold text-white hover:bg-emerald-600 transition-colors text-base"
            >
              <Unlock className="h-5 w-5" /> Abrir Caixa
            </button>
          </div>

          {/* Últimas sessões */}
          {sessoes.filter((s: any) => s.status === 'FECHADO').length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
              <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Últimas Sessões
                </h2>
              </div>
              {sessoes
                .filter((s: any) => s.status === 'FECHADO')
                .slice(0, 5)
                .map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => router.push(`/dashboard/caixa/${s.id}`)}
                    className="w-full flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {s.numero}
                      </p>
                      <p className="text-xs text-slate-400">
                        {s.operador} · {dthr(s.aberturaEm)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        {/* Ao lado da diferença só cabe a base dela: a gaveta. */}
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {fmt(baseConferencia(s))}
                        </p>
                        <p className="text-[10px] text-slate-400">esperado na gaveta</p>
                        {s.diferenca !== undefined && (
                          <p
                            className={`text-xs font-medium ${s.diferenca === 0 ? 'text-emerald-600' : s.diferenca > 0 ? 'text-blue-600' : 'text-red-600'}`}
                          >
                            {s.diferenca >= 0 ? '+' : ''}
                            {fmt(s.diferenca)}
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
                  <p className="font-bold text-white text-lg">
                    {sessaoAberta.numero} — {sessaoAberta.caixa}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-0.5">
                  <span className="flex items-center gap-1 text-emerald-100 text-sm">
                    <User className="h-3.5 w-3.5" /> {sessaoAberta.operador}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-100 text-sm">
                    <Clock className="h-3.5 w-3.5" /> Aberto há{' '}
                    {tempoAberto(sessaoAberta.aberturaEm)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setErroFechamento('');
                setShowFechamento(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-5 py-2.5 text-sm font-bold text-white transition-colors border border-white/30"
            >
              <Lock className="h-4 w-4" /> Fechar Caixa
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Saldo atual — dinheiro na gaveta, o mesmo número que o fechamento
                pede na conferência. O movimento do turno (cartão/PIX incluídos)
                fica abaixo, como informação, para não competir com a gaveta. */}
            <div className="col-span-2 lg:col-span-1 rounded-2xl bg-slate-900 dark:bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Saldo em Caixa</p>
              <p className="text-[11px] text-slate-500">Dinheiro na gaveta</p>
              <p className="mt-1 text-2xl font-bold text-white tabular-nums">
                {fmt(sessaoAberta.saldoEsperadoDinheiro)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Abertura: {fmt(sessaoAberta.valorAbertura)}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Movimento do turno (todas as formas):{' '}
                <span className="tabular-nums text-slate-400">
                  {fmt(sessaoAberta.saldoEsperado)}
                </span>
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5">
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Entradas</p>
              <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                {fmt(sessaoAberta.totalEntradas)}
              </p>
            </div>
            <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-5">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Saídas</p>
              <p className="mt-1 text-xl font-bold text-red-700 dark:text-red-300 tabular-nums">
                {fmt(sessaoAberta.totalSaidas)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <p className="text-sm text-slate-500">Movimentações</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                {sessaoAberta.qtdMovimentacoes}
              </p>
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowMovModal('SUPRIMENTO')}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="rounded-xl bg-blue-500 p-2.5">
                <ArrowDownLeft className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Suprimento
              </span>
            </button>
            <button
              onClick={() => setShowMovModal('SANGRIA')}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <div className="rounded-xl bg-red-500 p-2.5">
                <ArrowUpRight className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-red-700 dark:text-red-300">Sangria</span>
            </button>
            <button
              onClick={() => setShowMovModal('DESPESA')}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-4 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <div className="rounded-xl bg-orange-500 p-2.5">
                <Minus className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                Despesa
              </span>
            </button>
          </div>

          {/* Vendas em aberto — fechadas pelo vendedor, aguardando o caixa receber */}
          {recebidoOk && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 dark:border-emerald-800 dark:bg-emerald-900/20">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              <p className="flex-1 text-sm text-emerald-700 dark:text-emerald-300">
                Pedido <span className="font-mono font-semibold">{recebidoOk.numero}</span> recebido
                com sucesso.
                {recebidoOk.troco > 0 && (
                  <span className="font-semibold"> Troco a devolver: {fmt(recebidoOk.troco)}.</span>
                )}
              </p>
              <Link
                href={`/dashboard/fiscal/nova?pedidoId=${recebidoOk.id}&tipo=NFCE`}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <Receipt className="h-3.5 w-3.5" /> Emitir NFC-e
              </Link>
              <button
                onClick={() => setRecebidoOk(null)}
                className="text-emerald-400 hover:text-emerald-600"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          )}
          {pendentes.length > 0 && (
            <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800 overflow-hidden">
              <div className="border-b border-amber-100 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 px-5 py-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <ShoppingCart className="h-4 w-4 text-amber-500" />
                  Vendas em Aberto
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white">
                    {pendentes.length}
                  </span>
                </h2>
                <span className="text-xs text-slate-400">aguardando recebimento</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {pendentes.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        <span className="font-mono">{p.numero ?? p.id?.slice(0, 8)}</span>
                        {p.clienteNome && (
                          <span className="ml-2 font-normal text-slate-500">{p.clienteNome}</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">
                        {p.criadoEm ? dthr(p.criadoEm) : ''}
                        {p.observacao ? ` · ${p.observacao}` : ''}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-slate-900 dark:text-slate-100">
                      {fmt(Number(p.valorTotal ?? 0))}
                    </span>
                    <button
                      onClick={() => abrirReceber(p)}
                      className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <Wallet className="h-3.5 w-3.5" /> Receber
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Movimentações do turno */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                Movimentações do Turno
              </h2>
              <span className="text-xs text-slate-400">
                {movs.length} registro{movs.length !== 1 ? 's' : ''}
              </span>
            </div>

            {movs.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                Nenhuma movimentação ainda
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {movs.map((mov: any) => {
                  const cfg = CATEGORIA_CONFIG[mov.categoria] ?? CATEGORIA_CONFIG.OUTROS;
                  const isEntrada = mov.tipo === 'ENTRADA';
                  return (
                    <div key={mov.id} className="flex items-center gap-4 px-5 py-3.5">
                      {/* Ícone */}
                      <div className={`flex-shrink-0 rounded-xl p-2 ${cfg.bg}`}>
                        {isEntrada ? (
                          <ArrowDownLeft className={`h-4 w-4 ${cfg.cor}`} />
                        ) : (
                          <ArrowUpRight className={`h-4 w-4 ${cfg.cor}`} />
                        )}
                      </div>
                      {/* Descrição */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.cor}`}
                          >
                            {cfg.label}
                          </span>
                          {mov.formaPagamento && (
                            <span className="text-[10px] text-slate-400">
                              {FORMA_LABEL[mov.formaPagamento] ?? mov.formaPagamento}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                          {mov.descricao}
                        </p>
                        <p className="text-xs text-slate-400">
                          {hora(mov.criadoEm)} · {mov.operador}
                        </p>
                      </div>
                      {/* Valor */}
                      <span
                        className={`text-base font-bold tabular-nums flex-shrink-0 ${isEntrada ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                      >
                        {isEntrada ? '+' : '−'}
                        {fmt(mov.valor)}
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
        <ModalAbertura
          operador={obterUsuarioLogado()?.nome ?? ''}
          onClose={() => setShowAbertura(false)}
          onConfirm={handleAbrir}
          loading={abrir.isPending}
          erro={erroAbertura}
        />
      )}
      {showFechamento && sessaoAberta && (
        <ModalFechamento
          sessao={sessaoAberta}
          onClose={() => setShowFechamento(false)}
          onConfirm={handleFechar}
          loading={fechar.isPending}
          erro={erroFechamento}
        />
      )}
      {showMovModal && sessaoAberta && (
        <ModalMovimentacao
          tipo={showMovModal}
          sessaoId={sessaoAberta.id}
          operador={sessaoAberta.operador}
          onClose={() => setShowMovModal(null)}
          onSuccess={() => {
            setShowMovModal(null);
            refetch();
          }}
          loading={false}
        />
      )}

      {/* Modal de recebimento de venda em aberto */}
      {receber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
            <div className="bg-emerald-600 px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <Wallet className="h-5 w-5" /> Receber Venda
              </h2>
              <p className="text-sm text-emerald-100">
                Pedido <span className="font-mono font-semibold">{receber.numero ?? ''}</span>
                {receber.clienteNome ? ` · ${receber.clienteNome}` : ''}
              </p>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Forma de pagamento
                </label>
                <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 p-1 dark:border-slate-600">
                  {(['DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setFormaReceb(f);
                        setFormaDescReceb('');
                        if (f !== 'CARTAO_CREDITO') setParcelasReceb(1);
                      }}
                      className={`rounded-lg py-1.5 text-[10px] font-bold transition-colors ${
                        formaReceb === f
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {f === 'DINHEIRO'
                        ? 'DIN'
                        : f === 'PIX'
                          ? 'PIX'
                          : f === 'CARTAO_CREDITO'
                            ? 'CRD'
                            : 'DBT'}
                    </button>
                  ))}
                </div>
                {(formaReceb === 'CARTAO_CREDITO' || formaReceb === 'CARTAO_DEBITO') &&
                  (formasCadastradas ?? []).some((f) => f.tipo === formaReceb) && (
                    <select
                      value={formaDescReceb}
                      onChange={(e) => {
                        const f = (formasCadastradas ?? []).find(
                          (x) => x.descricao === e.target.value,
                        );
                        setFormaDescReceb(e.target.value);
                        if (f) setParcelasReceb(f.parcelas ?? 1);
                      }}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Bandeira / parcelas...</option>
                      {(formasCadastradas ?? [])
                        .filter((f) => f.tipo === formaReceb)
                        .map((f) => (
                          <option key={f.id} value={f.descricao}>
                            {f.descricao}
                          </option>
                        ))}
                    </select>
                  )}
                {receber?.metodoPagamento && (
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Previsto pelo vendedor:{' '}
                    <span className="font-semibold text-slate-500 dark:text-slate-300">
                      {receber.metodoPagamento}
                    </span>
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Valor recebido
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    R$
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={valorReceb}
                    onChange={(e) => setValorReceb(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-base font-bold dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Total do pedido:{' '}
                  <span className="font-semibold text-slate-500 dark:text-slate-300 tabular-nums">
                    {fmt(totalPedidoReceb)}
                  </span>
                </p>
                {trocoReceb > 0 && (
                  <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-800 dark:bg-emerald-900/20">
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        Troco
                      </p>
                      <p className="text-[10px] text-emerald-600/80 dark:text-emerald-500/80">
                        Devolver ao cliente — o caixa recebe {fmt(totalPedidoReceb)}
                      </p>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                      {fmt(trocoReceb)}
                    </span>
                  </div>
                )}
                {excedenteInvalido && (
                  <p className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
                    Valor acima do total do pedido ({fmt(totalPedidoReceb)}). Em{' '}
                    {FORMA_LABEL[formaReceb] ?? formaReceb} não há troco — corrija o valor.
                  </p>
                )}
                {faltaReceber && Number(valorReceb) > 0 && (
                  <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
                    Abaixo do total do pedido ({fmt(totalPedidoReceb)}). O caixa recebe o valor
                    integral — recebimento parcial não é suportado.
                  </p>
                )}
              </div>
              {formaReceb === 'CARTAO_CREDITO' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Parcelas
                  </label>
                  <select
                    value={parcelasReceb}
                    onChange={(e) => setParcelasReceb(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    {[1, 2, 3, 4, 6, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n}× de {fmt((Number(valorReceb) || 0) / n)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {erroReceb && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
                  {erroReceb}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setReceber(null)}
                  className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarRecebimento}
                  disabled={
                    recebendo || !(Number(valorReceb) > 0) || excedenteInvalido || faltaReceber
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {recebendo ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Confirmar Recebimento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liberação de recebimento com desconto acima do teto */}
      <ModalAutorizacao
        aberto={liberacaoPend !== null}
        motivo={
          liberacaoPend
            ? `Pedido ${liberacaoPend.numero ?? ''} tem desconto de ${descontoPedidoPct(liberacaoPend).toFixed(1)}%, acima do máximo configurado (${obterDescontoMaximoPct() ?? 0}%). Informe as credenciais de quem autoriza o recebimento.`
            : ''
        }
        onClose={() => setLiberacaoPend(null)}
        onAutorizado={(nome) => {
          const p = liberacaoPend;
          setLiberacaoPend(null);
          setLiberadoPorReceb(nome);
          if (p) abrirReceberEfetivo(p);
        }}
      />
    </div>
  );
}
