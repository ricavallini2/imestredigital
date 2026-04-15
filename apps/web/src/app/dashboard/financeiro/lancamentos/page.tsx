'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Search,
  X,
  Edit,
  Trash2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  useLancamentos,
  useCriarLancamento,
  useAtualizarLancamento,
  usePagarLancamento,
  useDeletarLancamento,
  useContasBancarias,
} from '@/hooks/useFinanceiro';
import type { Lancamento, FiltrosLancamento } from '@/hooks/useFinanceiro';
import { Modal } from '@/components/ui/modal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');
}
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-100 dark:bg-slate-700 ${className ?? ''}`} />;
}

const CATEGORIAS_RECEITA = ['Vendas', 'Marketplaces', 'Serviços', 'Financeiro', 'Outras'];
const CATEGORIAS_DESPESA = ['Pessoal', 'Ocupação', 'Marketing', 'Operacional', 'Impostos', 'Compras', 'Outras'];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAGO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    PENDENTE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    ATRASADO: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    CANCELADO: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
  };
  const labels: Record<string, string> = { PAGO: 'Pago', PENDENTE: 'Pendente', ATRASADO: 'Atrasado', CANCELADO: 'Cancelado' };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? map.PENDENTE}`}>
      {status === 'ATRASADO' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />}
      {labels[status] ?? status}
    </span>
  );
}

// ─── Modal Form ───────────────────────────────────────────────────────────────

type FormData = {
  tipo: 'RECEITA' | 'DESPESA';
  descricao: string;
  valor: string;
  categoria: string;
  contaId: string;
  dataVencimento: string;
  recorrente: boolean;
  observacoes: string;
};

function LancamentoModal({
  isOpen,
  onClose,
  editingItem,
  defaultTipo,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: Lancamento | null;
  defaultTipo?: 'RECEITA' | 'DESPESA';
}) {
  const { data: contasData } = useContasBancarias();
  const contas = contasData ?? [];
  const criarMutation = useCriarLancamento();
  const atualizarMutation = useAtualizarLancamento();

  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<FormData>({
    tipo: defaultTipo ?? 'DESPESA',
    descricao: '',
    valor: '',
    categoria: '',
    contaId: '',
    dataVencimento: today,
    recorrente: false,
    observacoes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (editingItem) {
      setForm({
        tipo: editingItem.tipo,
        descricao: editingItem.descricao,
        valor: String(editingItem.valor),
        categoria: editingItem.categoria,
        contaId: editingItem.contaId ?? '',
        dataVencimento: editingItem.dataVencimento.slice(0, 10),
        recorrente: editingItem.recorrente,
        observacoes: editingItem.observacoes ?? '',
      });
    } else {
      setForm((prev) => ({ ...prev, tipo: defaultTipo ?? 'DESPESA', categoria: '' }));
    }
    setErrors({});
  }, [editingItem, isOpen, defaultTipo]);

  const categorias = form.tipo === 'RECEITA' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;

  const validate = () => {
    const e: typeof errors = {};
    if (!form.descricao.trim()) e.descricao = 'Obrigatório';
    if (!form.valor || isNaN(Number(form.valor)) || Number(form.valor) <= 0) e.valor = 'Valor inválido';
    if (!form.categoria) e.categoria = 'Obrigatório';
    if (!form.dataVencimento) e.dataVencimento = 'Obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const dto: Partial<Lancamento> = {
      tipo: form.tipo,
      descricao: form.descricao,
      valor: Number(form.valor),
      categoria: form.categoria,
      contaId: form.contaId || undefined,
      dataVencimento: form.dataVencimento,
      recorrente: form.recorrente,
      observacoes: form.observacoes || undefined,
    };
    if (editingItem) {
      await atualizarMutation.mutateAsync({ id: editingItem.id, ...dto });
    } else {
      await criarMutation.mutateAsync(dto);
    }
    onClose();
  };

  const isSaving = criarMutation.isPending || atualizarMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Editar Lançamento' : form.tipo === 'RECEITA' ? 'Nova Receita' : 'Nova Despesa'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${form.tipo === 'RECEITA' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isSaving ? 'Salvando...' : editingItem ? 'Salvar' : 'Criar'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Tipo */}
        {!editingItem && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
            <div className="flex rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
              {(['RECEITA', 'DESPESA'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setForm((p) => ({ ...p, tipo: t, categoria: '' }))}
                  className={`flex-1 py-2 text-sm font-semibold transition-colors ${form.tipo === t ? (t === 'RECEITA' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white') : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400'}`}
                >
                  {t === 'RECEITA' ? '↑ Receita' : '↓ Despesa'}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Descrição <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.descricao}
            onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
            placeholder="Ex: Venda no Mercado Livre"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          {errors.descricao && <p className="mt-1 text-xs text-red-500">{errors.descricao}</p>}
        </div>
        {/* Valor + Categoria */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Valor (R$) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.valor}
              onChange={(e) => setForm((p) => ({ ...p, valor: e.target.value }))}
              placeholder="0,00"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.valor && <p className="mt-1 text-xs text-red-500">{errors.valor}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              value={form.categoria}
              onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Selecione...</option>
              {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.categoria && <p className="mt-1 text-xs text-red-500">{errors.categoria}</p>}
          </div>
        </div>
        {/* Conta + Data */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Conta</label>
            <select
              value={form.contaId}
              onChange={(e) => setForm((p) => ({ ...p, contaId: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Nenhuma</option>
              {contas.filter((c) => c.ativa).map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Vencimento <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.dataVencimento}
              onChange={(e) => setForm((p) => ({ ...p, dataVencimento: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
        {/* Recorrente */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.recorrente}
            onChange={(e) => setForm((p) => ({ ...p, recorrente: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Recorrente (mensal)</span>
        </label>
        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observações</label>
          <textarea
            value={form.observacoes}
            onChange={(e) => setForm((p) => ({ ...p, observacoes: e.target.value }))}
            rows={2}
            placeholder="Observações opcionais..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LancamentosPage() {
  const searchParams = useSearchParams();
  const [pagina, setPagina] = useState(1);
  const LIMITE = 20;

  const [filters, setFilters] = useState<FiltrosLancamento>({
    tipo: (searchParams.get('tipo') as 'RECEITA' | 'DESPESA' | undefined) ?? undefined,
    status: undefined,
    categoria: undefined,
    dataInicio: undefined,
    dataFim: undefined,
    busca: undefined,
  });
  const [busca, setBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Lancamento | null>(null);
  const [defaultTipo, setDefaultTipo] = useState<'RECEITA' | 'DESPESA'>('DESPESA');

  const queryFilters: FiltrosLancamento = {
    ...filters,
    busca: busca || undefined,
    pagina,
    limite: LIMITE,
  };

  const { data, isLoading } = useLancamentos(queryFilters);
  const pagarMutation = usePagarLancamento();
  const deletarMutation = useDeletarLancamento();

  const lancamentos = data?.dados ?? [];
  const total = data?.total ?? 0;
  const totalPaginas = data?.totalPaginas ?? 1;

  // KPI computations from current page data
  const receitasPagas = useMemo(
    () => lancamentos.filter((l) => l.tipo === 'RECEITA' && l.status === 'PAGO').reduce((s, l) => s + l.valor, 0),
    [lancamentos]
  );
  const despesasPagas = useMemo(
    () => lancamentos.filter((l) => l.tipo === 'DESPESA' && l.status === 'PAGO').reduce((s, l) => s + l.valor, 0),
    [lancamentos]
  );
  const pendentes = useMemo(
    () => lancamentos.filter((l) => l.status === 'PENDENTE' || l.status === 'ATRASADO').length,
    [lancamentos]
  );

  const categorias = useMemo(
    () => Array.from(new Set(lancamentos.map((l) => l.categoria).filter(Boolean))),
    [lancamentos]
  );

  const handleDelete = (id: string) => {
    if (confirm('Confirmar exclusão? Esta ação não pode ser desfeita.')) {
      deletarMutation.mutate(id);
    }
  };

  const openModal = (tipo: 'RECEITA' | 'DESPESA', item?: Lancamento) => {
    setDefaultTipo(tipo);
    setEditingItem(item ?? null);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setFilters({ tipo: undefined, status: undefined, categoria: undefined, dataInicio: undefined, dataFim: undefined });
    setBusca('');
    setPagina(1);
  };

  const setFilter = <K extends keyof FiltrosLancamento>(key: K, value: FiltrosLancamento[K]) => {
    setFilters((p) => ({ ...p, [key]: value || undefined }));
    setPagina(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Lançamentos</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Gerencie todas as receitas e despesas da empresa
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openModal('RECEITA')}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Nova Receita
          </button>
          <button
            onClick={() => openModal('DESPESA')}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Nova Despesa
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-slate-500">Receitas Pagas</span>
          </div>
          <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">{fmt(receitasPagas)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="text-xs font-medium text-slate-500">Despesas Pagas</span>
          </div>
          <p className="mt-1 text-lg font-bold text-red-600 dark:text-red-400">{fmt(despesasPagas)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-slate-500">Saldo (pago)</span>
          </div>
          <p className={`mt-1 text-lg font-bold ${receitasPagas - despesasPagas >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {fmt(receitasPagas - despesasPagas)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-slate-500">Pendentes</span>
          </div>
          <p className="mt-1 text-lg font-bold text-amber-600 dark:text-amber-400">{pendentes}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar lançamento..."
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          {/* Tipo */}
          <select
            value={filters.tipo ?? ''}
            onChange={(e) => setFilter('tipo', e.target.value as 'RECEITA' | 'DESPESA' | undefined)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Todos os tipos</option>
            <option value="RECEITA">Receita</option>
            <option value="DESPESA">Despesa</option>
          </select>
          {/* Status */}
          <select
            value={filters.status ?? ''}
            onChange={(e) => setFilter('status', e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Todos os status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="PAGO">Pago</option>
            <option value="ATRASADO">Atrasado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
          {/* Categoria */}
          <select
            value={filters.categoria ?? ''}
            onChange={(e) => setFilter('categoria', e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Todas categorias</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {/* Data Inicio */}
          <input
            type="date"
            value={filters.dataInicio ?? ''}
            onChange={(e) => setFilter('dataInicio', e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          {/* Data Fim */}
          <input
            type="date"
            value={filters.dataFim ?? ''}
            onChange={(e) => setFilter('dataFim', e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          {/* Clear */}
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" /> Limpar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : lancamentos.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-400">Nenhum lançamento encontrado.</p>
              <p className="mt-1 text-sm text-slate-400">Tente ajustar os filtros.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-700">
                <tr className="text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                  <th className="px-4 py-3">Data Venc.</th>
                  <th className="px-3 py-3">Descrição</th>
                  <th className="hidden px-3 py-3 md:table-cell">Categoria</th>
                  <th className="hidden px-3 py-3 lg:table-cell">Conta</th>
                  <th className="px-3 py-3">Tipo</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Valor</th>
                  <th className="px-3 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {lancamentos.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                      {fmtDate(l.dataVencimento)}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-900 dark:text-slate-100">
                      <span className="block max-w-[200px] truncate">{l.descricao}</span>
                    </td>
                    <td className="hidden px-3 py-3 text-slate-500 dark:text-slate-400 md:table-cell">
                      {l.categoria}
                    </td>
                    <td className="hidden px-3 py-3 text-slate-500 dark:text-slate-400 lg:table-cell">
                      {l.conta ?? '—'}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-sm font-bold ${l.tipo === 'RECEITA' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {l.tipo === 'RECEITA' ? '↑ Receita' : '↓ Despesa'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className={`whitespace-nowrap px-3 py-3 text-right font-bold ${l.tipo === 'RECEITA' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {l.tipo === 'RECEITA' ? '+' : '-'} {fmt(l.valor)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {(l.status === 'PENDENTE' || l.status === 'ATRASADO') && (
                          <button
                            onClick={() => pagarMutation.mutate({ id: l.id })}
                            disabled={pagarMutation.isPending}
                            title="Marcar como pago"
                            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openModal(l.tipo, l)}
                          title="Editar"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(l.id)}
                          title="Excluir"
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            <p className="text-sm text-slate-500">
              {total} lançamento(s) · página {pagina} de {totalPaginas}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="rounded-lg border border-slate-300 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="rounded-lg border border-slate-300 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <LancamentoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingItem={editingItem}
        defaultTipo={defaultTipo}
      />
    </div>
  );
}
