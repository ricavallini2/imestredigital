'use client';

import { useState, useMemo } from 'react';
import {
  Package, AlertTriangle, TrendingDown, Search, Filter,
  ArrowDown, ArrowUp, ArrowRight, Zap, RefreshCw, Cpu,
  Boxes, DollarSign, BarChart3, ShoppingCart, X, ChevronRight,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { KPICard } from '@/components/ui/kpi-card';
import { SkeletonCard } from '@/components/ui/loading';
import {
  useResumoEstoque, useAlertasEstoque, useAnaliseIAEstoque,
  useDepositos, useRegistrarEntrada, useRegistrarSaida,
  useRegistrarTransferencia, useRegistrarAjuste,
} from '@/hooks/useEstoque';
import { useQueryClient } from '@tanstack/react-query';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  NORMAL: 'Normal', BAIXO: 'Baixo', CRITICO: 'Crítico', SEM_ESTOQUE: 'Sem Estoque',
};

const STATUS_BAR: Record<string, string> = {
  NORMAL: 'bg-emerald-500', BAIXO: 'bg-amber-400', CRITICO: 'bg-orange-500', SEM_ESTOQUE: 'bg-red-500',
};

const CLASSE_COLOR: Record<string, string> = {
  A: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  B: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  C: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
};

function fmt(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
}

// ─── Modal de Movimentação ────────────────────────────────────────────────────

type TipoMov = 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA' | 'AJUSTE';

interface SaldoItem {
  produtoId: string; produto: string; sku: string;
  variacaoId?: string; variacao?: string;
  depositoId: string; deposito: string; disponivel: number;
}

interface ModalMovProps {
  open: boolean;
  tipoInicial?: TipoMov;
  produtoIdInicial?: string;
  onClose: () => void;
  saldos: SaldoItem[];
  depositos: Array<{ id: string; nome: string }>;
  onSuccess: () => void;
}

function ModalMovimentacao({ open, tipoInicial = 'ENTRADA', produtoIdInicial, onClose, saldos, depositos, onSuccess }: ModalMovProps) {
  const [tipo, setTipo] = useState<TipoMov>(tipoInicial);
  const [produtoId, setProdutoId] = useState(produtoIdInicial ?? '');
  const [variacaoId, setVariacaoId] = useState('');
  const [depositoOrigemId, setDepositoOrigemId] = useState('');
  const [depositoDestinoId, setDepositoDestinoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState('');

  const entrada = useRegistrarEntrada();
  const saida = useRegistrarSaida();
  const transferencia = useRegistrarTransferencia();
  const ajuste = useRegistrarAjuste();

  const isBusy = entrada.isPending || saida.isPending || transferencia.isPending || ajuste.isPending;

  // Produtos únicos (deduplica por produtoId, conta variações)
  const produtosUnicos = useMemo(() => {
    const seen = new Map<string, SaldoItem>();
    const varCount = new Map<string, Set<string>>();
    for (const s of saldos) {
      if (!seen.has(s.produtoId)) seen.set(s.produtoId, s);
      if (s.variacaoId) {
        if (!varCount.has(s.produtoId)) varCount.set(s.produtoId, new Set());
        varCount.get(s.produtoId)!.add(s.variacaoId);
      }
    }
    return Array.from(seen.values()).map(s => ({
      ...s,
      _qtdVariacoes: varCount.get(s.produtoId)?.size ?? 0,
    }));
  }, [saldos]);

  // Variações disponíveis para o produto selecionado (únicas, excluindo tipo "Única")
  const variacoesOptions = useMemo(() => {
    if (!produtoId) return [];
    const seen = new Map<string, string>(); // variacaoId → label
    for (const s of saldos) {
      if (s.produtoId === produtoId && s.variacaoId && s.variacao !== 'Única') {
        seen.set(s.variacaoId, s.variacao ?? s.variacaoId);
      }
    }
    return Array.from(seen.entries()).map(([id, label]) => ({ id, label }));
  }, [saldos, produtoId]);

  // variacaoId efetivo: usuário selecionou, ou auto-resolve se só há 1
  const variacaoEfetiva = variacaoId || (variacoesOptions.length === 1 ? variacoesOptions[0].id : '');

  // Depósitos onde o produto/variação tem saldo
  const depositosComSaldo = useMemo(() => {
    if (!produtoId) return [];
    const porDeposito = new Map<string, { id: string; nome: string; disponivel: number }>();
    for (const s of saldos) {
      if (s.produtoId !== produtoId) continue;
      if (variacaoEfetiva && s.variacaoId !== variacaoEfetiva) continue;
      const ex = porDeposito.get(s.depositoId);
      if (ex) ex.disponivel += s.disponivel;
      else porDeposito.set(s.depositoId, { id: s.depositoId, nome: s.deposito, disponivel: s.disponivel });
    }
    return Array.from(porDeposito.values());
  }, [saldos, produtoId, variacaoEfetiva]);

  if (!open) return null;

  const resetForm = () => {
    setProdutoId(produtoIdInicial ?? '');
    setVariacaoId('');
    setDepositoOrigemId(''); setDepositoDestinoId('');
    setQuantidade(''); setMotivo(''); setErro('');
  };

  const handleSubmit = async () => {
    setErro('');
    const qty = parseFloat(quantidade);
    if (!produtoId) { setErro('Selecione um produto'); return; }
    if (variacoesOptions.length > 1 && !variacaoId) { setErro('Selecione a variação'); return; }
    if (!quantidade || isNaN(qty) || qty === 0) { setErro('Informe a quantidade'); return; }

    const vidEfetivo = variacaoEfetiva || undefined;
    try {
      if (tipo === 'ENTRADA') {
        if (!depositoDestinoId) { setErro('Selecione o depósito de destino'); return; }
        await entrada.mutateAsync({ produtoId, variacaoId: vidEfetivo, depositoId: depositoDestinoId, quantidade: qty, motivo });
      } else if (tipo === 'SAIDA') {
        if (!depositoOrigemId) { setErro('Selecione o depósito de origem'); return; }
        await saida.mutateAsync({ produtoId, variacaoId: vidEfetivo, depositoId: depositoOrigemId, quantidade: qty, motivo });
      } else if (tipo === 'TRANSFERENCIA') {
        if (!depositoOrigemId || !depositoDestinoId) { setErro('Selecione origem e destino'); return; }
        await transferencia.mutateAsync({ produtoId, variacaoId: vidEfetivo, depositoOrigemId, depositoDestinoId, quantidade: qty, motivo });
      } else {
        if (!depositoOrigemId) { setErro('Selecione o depósito'); return; }
        await ajuste.mutateAsync({ produtoId, variacaoId: vidEfetivo, depositoId: depositoOrigemId, quantidade: qty, motivo });
      }
      resetForm();
      onSuccess();
      onClose();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErro(msg ?? 'Erro ao registrar movimentação');
    }
  };

  const tipoConfig = {
    ENTRADA: { label: 'Entrada', color: 'bg-emerald-500', icon: <ArrowDown className="h-4 w-4" /> },
    SAIDA: { label: 'Saída', color: 'bg-red-500', icon: <ArrowUp className="h-4 w-4" /> },
    TRANSFERENCIA: { label: 'Transferência', color: 'bg-blue-500', icon: <ArrowRight className="h-4 w-4" /> },
    AJUSTE: { label: 'Ajuste', color: 'bg-amber-500', icon: <Zap className="h-4 w-4" /> },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Registrar Movimentação</h2>
          <button onClick={() => { resetForm(); onClose(); }} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Tipo */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Movimentação</label>
            <div className="grid grid-cols-4 gap-2">
              {(['ENTRADA', 'SAIDA', 'TRANSFERENCIA', 'AJUSTE'] as TipoMov[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTipo(t); setDepositoOrigemId(''); setDepositoDestinoId(''); setErro(''); }}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 p-2 text-xs font-medium transition-all ${
                    tipo === t
                      ? `border-marca-500 bg-marca-50 text-marca-700 dark:bg-marca-900/20 dark:text-marca-300`
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className={`rounded-full p-1 text-white ${tipoConfig[t].color}`}>{tipoConfig[t].icon}</span>
                  {tipoConfig[t].label}
                </button>
              ))}
            </div>
          </div>

          {/* Produto */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Produto *</label>
            <select
              value={produtoId}
              onChange={(e) => { setProdutoId(e.target.value); setVariacaoId(''); setDepositoOrigemId(''); setDepositoDestinoId(''); }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Selecione o produto...</option>
              {produtosUnicos.map((p) => (
                <option key={p.produtoId} value={p.produtoId}>
                  {p.produto}{p._qtdVariacoes > 1 ? ` (${p._qtdVariacoes} variações)` : ` — ${p.sku}`}
                </option>
              ))}
            </select>
          </div>

          {/* Variação (quando produto tem múltiplas) */}
          {variacoesOptions.length > 1 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Variação *</label>
              <select
                value={variacaoId}
                onChange={(e) => { setVariacaoId(e.target.value); setDepositoOrigemId(''); setDepositoDestinoId(''); }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="">Selecione a variação...</option>
                {variacoesOptions.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Depósito Origem */}
          {(tipo === 'SAIDA' || tipo === 'TRANSFERENCIA' || tipo === 'AJUSTE') && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {tipo === 'TRANSFERENCIA' ? 'Depósito Origem *' : 'Depósito *'}
              </label>
              <select
                value={depositoOrigemId}
                onChange={(e) => setDepositoOrigemId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="">Selecione o depósito...</option>
                {(depositosComSaldo.length > 0 ? depositosComSaldo : depositos.map(d => ({ id: d.id, nome: d.nome, disponivel: 0 }))).map((d) => (
                  <option key={d.id} value={d.id}>{d.nome}{d.disponivel !== undefined ? ` (${d.disponivel} disp.)` : ''}</option>
                ))}
              </select>
            </div>
          )}

          {/* Depósito Destino */}
          {(tipo === 'ENTRADA' || tipo === 'TRANSFERENCIA') && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {tipo === 'TRANSFERENCIA' ? 'Depósito Destino *' : 'Depósito *'}
              </label>
              <select
                value={depositoDestinoId}
                onChange={(e) => setDepositoDestinoId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="">Selecione o depósito...</option>
                {depositos.filter(d => d.id !== depositoOrigemId).map((d) => (
                  <option key={d.id} value={d.id}>{d.nome}</option>
                ))}
              </select>
            </div>
          )}

          {/* Quantidade */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Quantidade {tipo === 'AJUSTE' ? '(positivo = sobra, negativo = falta) *' : '*'}
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder={tipo === 'AJUSTE' ? 'Ex: -2 ou 5' : 'Ex: 10'}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Motivo */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Motivo / Observação</label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: NF 4521, Pedido #1234..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {erro && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400">
              {erro}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 px-5 py-4">
          <button
            onClick={() => { resetForm(); onClose(); }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isBusy}
            className="rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-60 transition-colors"
          >
            {isBusy ? 'Registrando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Painel IA ───────────────────────────────────────────────────────────────

function PainelIA({ analise, onRegerar }: { analise: ReturnType<typeof Object.assign> | null; onRegerar: () => void }) {
  if (!analise) return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/20 p-5">
      <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
        <Cpu className="h-5 w-5 animate-pulse" />
        <span className="text-sm font-medium">iMestreAI analisando estoque...</span>
      </div>
    </div>
  );

  const score = analise.scoreGeral as number;
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';

  return (
    <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 dark:border-violet-800 dark:from-violet-950/20 dark:to-purple-950/20 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-violet-500 p-2">
            <Cpu className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">Análise iMestreAI</p>
            <p className="text-xs text-violet-600 dark:text-violet-400">{new Date(analise.geradoEm as string).toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <button
          onClick={onRegerar}
          className="flex items-center gap-1 rounded-lg border border-violet-300 bg-white/70 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-white dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50"
        >
          <RefreshCw className="h-3 w-3" />
          Regerar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Score + Saúde */}
        <div className="flex items-center gap-3">
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
            <circle cx="36" cy="36" r={radius} fill="none" stroke={color} strokeWidth="6"
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
              transform="rotate(-90 36 36)" />
            <text x="36" y="41" textAnchor="middle" fontSize="14" fontWeight="bold" fill={color}>{score}</text>
          </svg>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Saúde Geral</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{analise.saude as string}</p>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-2 text-center sm:col-span-1">
          {[
            { label: 'SKUs', value: (analise.metricas as { totalSKUs: number }).totalSKUs },
            { label: 'Cobertura', value: `${(analise.metricas as { coberturaMedia: number }).coberturaMedia}d` },
            { label: 'Em Risco', value: (analise.metricas as { produtosEmRisco: number }).produtosEmRisco, red: true },
            { label: 'Sem Estoque', value: (analise.metricas as { produtosSemEstoque: number }).produtosSemEstoque, red: true },
          ].map((m) => (
            <div key={m.label} className="rounded-xl bg-white/60 dark:bg-white/5 p-2">
              <p className={`text-base font-bold ${m.red && (m.value as number) > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                {m.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{m.label}</p>
            </div>
          ))}
        </div>

        {/* ABC */}
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-400">Classificação ABC</p>
          {['A', 'B', 'C'].map((cls) => {
            const n = (analise.metricas as { classificacaoABC: Record<string, number> }).classificacaoABC[cls];
            const total = (analise.metricas as { totalSKUs: number }).totalSKUs;
            const pct = total > 0 ? (n / total) * 100 : 0;
            return (
              <div key={cls} className="mb-1 flex items-center gap-2">
                <span className={`w-5 rounded text-center text-xs font-bold ${CLASSE_COLOR[cls]}`}>{cls}</span>
                <div className="flex-1 rounded-full bg-slate-200 dark:bg-slate-700 h-2">
                  <div className="h-2 rounded-full bg-violet-500" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-4 text-right text-xs text-slate-600 dark:text-slate-400">{n}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ações */}
      {(analise.acoes as string[]).length > 0 && (
        <div className="mt-4 border-t border-violet-200/50 dark:border-violet-800/50 pt-4">
          <p className="mb-2 text-xs font-semibold text-violet-800 dark:text-violet-300">⚡ Ações Recomendadas</p>
          <div className="space-y-1">
            {(analise.acoes as string[]).map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <ChevronRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-violet-500" />
                {a}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compras urgentes */}
      {(analise.recomendacoes as Array<{ urgente: boolean; produto: string; qtdSugerida: number; valorCompra: number; coberturaDias: number; classe: string }>).filter(r => r.urgente).length > 0 && (
        <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3">
          <p className="mb-2 text-xs font-semibold text-amber-800 dark:text-amber-400">🛒 Compras Urgentes</p>
          <div className="space-y-1">
            {(analise.recomendacoes as Array<{ urgente: boolean; produto: string; qtdSugerida: number; valorCompra: number; coberturaDias: number; classe: string }>)
              .filter(r => r.urgente).slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-amber-800 dark:text-amber-300 font-medium">{r.produto}</span>
                  <span className="text-amber-700 dark:text-amber-400">{r.qtdSugerida} un · {fmt(r.valorCompra)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Página Principal ────────────────────────────────────────────────────────

export default function EstoquePage() {
  const [busca, setBusca] = useState('');
  const [depositoFiltro, setDepositoFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState<'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA' | 'AJUSTE'>('ENTRADA');
  const [produtoIdModal, setProdutoIdModal] = useState<string | undefined>();

  const queryClient = useQueryClient();
  const { data: resumo, isLoading, isError } = useResumoEstoque();
  const { data: alertas } = useAlertasEstoque();
  const { data: analise, refetch: refetchIA } = useAnaliseIAEstoque();
  const { data: depositos = [] } = useDepositos();

  const itens = resumo?.itens ?? [];
  const depositosNomes = [...new Set(itens.map((e) => e.deposito).filter(Boolean))];

  const itensFiltrados = useMemo(() => {
    return itens.filter((e) => {
      const matchBusca = e.produto.toLowerCase().includes(busca.toLowerCase()) || e.sku.toLowerCase().includes(busca.toLowerCase());
      const matchDeposito = !depositoFiltro || e.deposito === depositoFiltro;
      const matchStatus = !statusFiltro || e.status === statusFiltro;
      return matchBusca && matchDeposito && matchStatus;
    });
  }, [itens, busca, depositoFiltro, statusFiltro]);

  const openModal = (tipo: typeof tipoModal, produtoId?: string) => {
    setTipoModal(tipo);
    setProdutoIdModal(produtoId);
    setModalOpen(true);
  };

  const handleRegerarIA = () => {
    queryClient.removeQueries({ queryKey: ['estoque', 'analise-ia'] });
    refetchIA();
  };

  const depositosParaModal = depositos.map((d: { id: string; nome: string }) => ({ id: d.id, nome: d.nome }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Estoque</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Gerencie o inventário do seu negócio</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => openModal('ENTRADA')} className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors">
            <ArrowDown className="h-4 w-4" /> Entrada
          </button>
          <button onClick={() => openModal('SAIDA')} className="flex items-center gap-1.5 rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors">
            <ArrowUp className="h-4 w-4" /> Saída
          </button>
          <button onClick={() => openModal('TRANSFERENCIA')} className="flex items-center gap-1.5 rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors">
            <ArrowRight className="h-4 w-4" /> Transferir
          </button>
          <button onClick={() => openModal('AJUSTE')} className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Zap className="h-4 w-4" /> Ajuste
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {isLoading ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <KPICard label="SKUs Cadastrados" valor={(resumo as { totalProdutos?: number })?.totalProdutos ?? 0} icone={<Boxes className="h-6 w-6" />} />
            <KPICard label="Total em Estoque" valor={resumo?.totalUnidades ?? 0} unidade="un." icone={<Package className="h-6 w-6" />} />
            <KPICard label="Valor Imobilizado" valor={fmt((resumo as { valorEmEstoque?: number })?.valorEmEstoque ?? 0)} icone={<DollarSign className="h-6 w-6" />} destaque />
            <KPICard label="Estoque Baixo/Crítico" valor={resumo?.estoqueBaixo ?? 0} icone={<AlertTriangle className="h-6 w-6" />} />
            <KPICard label="Sem Estoque" valor={resumo?.semEstoque ?? 0} icone={<TrendingDown className="h-6 w-6" />} />
          </>
        )}
      </div>

      {/* Alertas */}
      {alertas && alertas.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span className="font-semibold text-amber-800 dark:text-amber-400">
              {alertas.length} produto(s) precisam de atenção
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alertas.slice(0, 6).map((alerta: { produtoId: string; produto: string; status: string; disponivel: number; deposito: string }) => (
              <button
                key={`${alerta.produtoId}-${alerta.deposito}`}
                onClick={() => openModal('ENTRADA', alerta.produtoId)}
                className={`group flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  alerta.status === 'SEM_ESTOQUE'
                    ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                }`}
              >
                <ArrowDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                {alerta.produto} · {alerta.deposito} ({alerta.disponivel} un.)
              </button>
            ))}
            {alertas.length > 6 && <span className="text-xs text-amber-600 dark:text-amber-500 self-center">+{alertas.length - 6} mais</span>}
          </div>
        </div>
      )}

      {/* Painel IA */}
      <PainelIA analise={analise ?? null} onRegerar={handleRegerarIA} />

      {/* Filtros */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filtros</span>
          {(busca || depositoFiltro || statusFiltro) && (
            <button onClick={() => { setBusca(''); setDepositoFiltro(''); setStatusFiltro(''); }} className="ml-auto text-xs text-slate-500 hover:text-slate-700">Limpar</button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Buscar produto ou SKU..." value={busca} onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-9 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
          </div>
          <select value={depositoFiltro} onChange={(e) => setDepositoFiltro(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
            <option value="">Todos os depósitos</option>
            {depositosNomes.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
          </select>
          <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
            <option value="">Todos os status</option>
            <option value="NORMAL">Normal</option>
            <option value="BAIXO">Baixo</option>
            <option value="CRITICO">Crítico</option>
            <option value="SEM_ESTOQUE">Sem Estoque</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="animate-pulse space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-slate-700" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/20">
          <p className="font-medium text-red-700 dark:text-red-400">Erro ao carregar estoque</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
                  {['Produto / SKU', 'Depósito', 'Físico', 'Reservado', 'Disponível', 'Cobertura', 'Status', 'Ações'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {itensFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <BarChart3 className="mx-auto mb-2 h-10 w-10 text-slate-300" />
                      <p className="text-slate-500">Nenhum item encontrado</p>
                    </td>
                  </tr>
                ) : itensFiltrados.map((item) => {
                  const giroDiario = item.giro30d / 30;
                  const cobertura = giroDiario > 0 ? Math.round(item.disponivel / giroDiario) : item.disponivel > 0 ? 999 : 0;
                  const coberturaText = cobertura >= 999 ? '∞' : cobertura === 0 ? '—' : `${cobertura}d`;
                  const coberturaColor = cobertura < 7 ? 'text-red-600' : cobertura < 15 ? 'text-amber-600' : 'text-emerald-600';

                  return (
                    <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900 dark:text-white text-sm">{item.produto}</div>
                        <div className="font-mono text-xs text-slate-500 dark:text-slate-400">{item.sku}</div>
                        {(item as any).variacao && (item as any).variacao !== 'Única' && (
                          <div className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{(item as any).variacao}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">{item.deposito}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{item.fisico}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{item.reservado > 0 ? <span className="text-amber-600">{item.reservado}</span> : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${item.disponivel <= 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>{item.disponivel}</span>
                          <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-600">
                            <div className={`h-1.5 rounded-full ${STATUS_BAR[item.status]}`}
                              style={{ width: `${Math.min(100, (item.fisico / Math.max(item.maximo, 1)) * 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold ${coberturaColor}`}>{coberturaText}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} label={STATUS_LABELS[item.status] ?? item.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal('ENTRADA', item.produtoId)}
                            className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40" title="Entrada">
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => openModal('SAIDA', item.produtoId)}
                            className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40" title="Saída">
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => openModal('TRANSFERENCIA', item.produtoId)}
                            className="rounded-lg bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40" title="Transferir">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3 text-xs text-slate-500">
            {itensFiltrados.length} de {itens.length} registros · Clique nos alertas para registrar entrada rápida
          </div>
        </div>
      )}

      {/* Modal */}
      <ModalMovimentacao
        open={modalOpen}
        tipoInicial={tipoModal}
        produtoIdInicial={produtoIdModal}
        onClose={() => setModalOpen(false)}
        saldos={itens}
        depositos={depositosParaModal}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['estoque'] });
          queryClient.invalidateQueries({ queryKey: ['movimentacoes'] });
        }}
      />
    </div>
  );
}
