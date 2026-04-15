'use client';

import { useState } from 'react';
import {
  Plus,
  Edit,
  Power,
  Wallet,
  TrendingUp,
  TrendingDown,
  Building2,
} from 'lucide-react';
import {
  useContasBancarias,
  useCriarContaBancaria,
  useAtualizarContaBancaria,
} from '@/hooks/useFinanceiro';
import type { ContaBancaria } from '@/hooks/useFinanceiro';
import { Modal } from '@/components/ui/modal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-100 dark:bg-slate-700 ${className ?? ''}`} />;
}

// Color mapping
const colorBorder: Record<string, string> = {
  blue: 'border-l-blue-500',
  green: 'border-l-emerald-500',
  purple: 'border-l-purple-500',
  orange: 'border-l-orange-500',
  red: 'border-l-red-500',
  slate: 'border-l-slate-500',
};
const colorText: Record<string, string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-emerald-600 dark:text-emerald-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
  red: 'text-red-600 dark:text-red-400',
  slate: 'text-slate-600 dark:text-slate-300',
};
const colorBg: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  slate: 'bg-slate-500',
};
const TIPO_LABELS: Record<string, string> = {
  CORRENTE: 'Conta Corrente',
  POUPANCA: 'Poupança',
  CAIXA: 'Caixa',
  INVESTIMENTO: 'Investimento',
  DIGITAL: 'Conta Digital',
};

// ─── Account Card ─────────────────────────────────────────────────────────────

function ContaCard({
  conta,
  onEdit,
  onToggle,
}: {
  conta: ContaBancaria;
  onEdit: (c: ContaBancaria) => void;
  onToggle: (c: ContaBancaria) => void;
}) {
  const cor = conta.cor ?? 'slate';
  const variacao =
    conta.saldoInicial !== 0
      ? ((conta.saldoAtual - conta.saldoInicial) / Math.abs(conta.saldoInicial)) * 100
      : 0;
  const variacaoPositiva = variacao >= 0;

  return (
    <div
      className={`rounded-xl border-l-4 border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 transition-all ${colorBorder[cor]} ${!conta.ativa ? 'opacity-60' : 'hover:shadow-md'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Bank icon */}
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${colorBg[cor]}`}>
            {conta.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{conta.nome}</h3>
            <div className="mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                {TIPO_LABELS[conta.tipo] ?? conta.tipo}
              </span>
              {!conta.ativa && (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                  Inativa
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(conta)}
            title="Editar"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onToggle(conta)}
            title={conta.ativa ? 'Desativar' : 'Reativar'}
            className={`rounded-lg p-2 transition-colors ${conta.ativa ? 'text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
          >
            <Power className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bank info */}
      {(conta.banco || conta.numeroConta) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Building2 className="h-3.5 w-3.5" />
          <span>
            {conta.banco}
            {conta.agencia && ` · Ag. ${conta.agencia}`}
            {conta.numeroConta && ` · Cc. ${conta.numeroConta}`}
          </span>
        </div>
      )}

      {/* Balance */}
      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
        <p className="text-xs text-slate-500">Saldo atual</p>
        <p className={`mt-1 text-2xl font-black ${colorText[cor]}`}>{fmt(conta.saldoAtual)}</p>
        <div className="mt-1 flex items-center gap-1.5">
          {variacaoPositiva ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span className={`text-xs font-medium ${variacaoPositiva ? 'text-emerald-600' : 'text-red-600'}`}>
            {variacaoPositiva ? '+' : ''}{variacao.toFixed(1)}% desde início
          </span>
          <span className="text-xs text-slate-400">({fmt(conta.saldoInicial)})</span>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Form ───────────────────────────────────────────────────────────────

type FormData = {
  nome: string;
  tipo: ContaBancaria['tipo'];
  banco: string;
  agencia: string;
  numeroConta: string;
  saldoInicial: string;
  cor: ContaBancaria['cor'];
};

const CORES: ContaBancaria['cor'][] = ['blue', 'green', 'purple', 'orange', 'red', 'slate'];
const CORES_LABELS: Record<string, string> = {
  blue: 'Azul', green: 'Verde', purple: 'Roxo', orange: 'Laranja', red: 'Vermelho', slate: 'Cinza',
};

function ContaModal({
  isOpen,
  onClose,
  editingItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingItem: ContaBancaria | null;
}) {
  const criarMutation = useCriarContaBancaria();
  const atualizarMutation = useAtualizarContaBancaria();

  const [form, setForm] = useState<FormData>({
    nome: editingItem?.nome ?? '',
    tipo: editingItem?.tipo ?? 'CORRENTE',
    banco: editingItem?.banco ?? '',
    agencia: editingItem?.agencia ?? '',
    numeroConta: editingItem?.numeroConta ?? '',
    saldoInicial: String(editingItem?.saldoInicial ?? '0'),
    cor: editingItem?.cor ?? 'blue',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.nome.trim()) e.nome = 'Obrigatório';
    if (isNaN(Number(form.saldoInicial))) e.saldoInicial = 'Valor inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const dto: Partial<ContaBancaria> = {
      nome: form.nome,
      tipo: form.tipo,
      banco: form.banco || undefined,
      agencia: form.agencia || undefined,
      numeroConta: form.numeroConta || undefined,
      saldoInicial: Number(form.saldoInicial),
      saldoAtual: Number(form.saldoInicial),
      cor: form.cor,
      ativa: true,
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
      title={editingItem ? 'Editar Conta' : 'Nova Conta Bancária'}
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
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Salvando...' : editingItem ? 'Salvar' : 'Criar Conta'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nome da Conta <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
            placeholder="Ex: Itaú - Corrente Principal"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
        </div>

        {/* Tipo + Cor */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as ContaBancaria['tipo'] }))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="CORRENTE">Conta Corrente</option>
              <option value="POUPANCA">Poupança</option>
              <option value="CAIXA">Caixa</option>
              <option value="INVESTIMENTO">Investimento</option>
              <option value="DIGITAL">Digital</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cor</label>
            <select
              value={form.cor}
              onChange={(e) => setForm((p) => ({ ...p, cor: e.target.value as ContaBancaria['cor'] }))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              {CORES.map((c) => <option key={c} value={c}>{CORES_LABELS[c]}</option>)}
            </select>
          </div>
        </div>

        {/* Color Preview */}
        <div className="flex gap-2">
          {CORES.map((c) => (
            <button
              key={c}
              onClick={() => setForm((p) => ({ ...p, cor: c }))}
              className={`h-7 w-7 rounded-full ${colorBg[c]} transition-transform ${form.cor === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
              title={CORES_LABELS[c]}
            />
          ))}
        </div>

        {/* Banco + Agencia */}
        {form.tipo !== 'CAIXA' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Banco</label>
              <input
                type="text"
                value={form.banco}
                onChange={(e) => setForm((p) => ({ ...p, banco: e.target.value }))}
                placeholder="Ex: Itaú, Bradesco"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Agência</label>
              <input
                type="text"
                value={form.agencia}
                onChange={(e) => setForm((p) => ({ ...p, agencia: e.target.value }))}
                placeholder="0001"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        )}
        {form.tipo !== 'CAIXA' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Número da Conta</label>
            <input
              type="text"
              value={form.numeroConta}
              onChange={(e) => setForm((p) => ({ ...p, numeroConta: e.target.value }))}
              placeholder="12345-6"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        )}

        {/* Saldo Inicial */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Saldo Inicial (R$) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={form.saldoInicial}
            onChange={(e) => setForm((p) => ({ ...p, saldoInicial: e.target.value }))}
            placeholder="0,00"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          {errors.saldoInicial && <p className="mt-1 text-xs text-red-500">{errors.saldoInicial}</p>}
        </div>
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContasPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContaBancaria | null>(null);

  const { data, isLoading } = useContasBancarias();
  const atualizarMutation = useAtualizarContaBancaria();

  const contas = data ?? [];
  const ativas = contas.filter((c) => c.ativa);
  const inativas = contas.filter((c) => !c.ativa);

  const saldoTotal = ativas.reduce((s, c) => s + c.saldoAtual, 0);
  const maiorSaldo = ativas.reduce((best, c) => (c.saldoAtual > (best?.saldoAtual ?? -Infinity) ? c : best), null as ContaBancaria | null);
  const menorSaldo = ativas.reduce((best, c) => (c.saldoAtual < (best?.saldoAtual ?? Infinity) ? c : best), null as ContaBancaria | null);

  const openModal = (item?: ContaBancaria) => {
    setEditingItem(item ?? null);
    setModalOpen(true);
  };

  const handleToggle = (conta: ContaBancaria) => {
    const action = conta.ativa ? 'desativar' : 'reativar';
    if (confirm(`Deseja ${action} a conta "${conta.nome}"?`)) {
      atualizarMutation.mutate({ id: conta.id, ativa: !conta.ativa });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Contas Bancárias</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Gerencie suas contas bancárias e de caixa
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex w-fit items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nova Conta
        </button>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="col-span-2 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:border-blue-800 dark:from-blue-950/30 dark:to-blue-900/20 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Saldo Total</p>
            </div>
            <p className="mt-2 text-2xl font-black text-blue-700 dark:text-blue-300">{fmt(saldoTotal)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-500">Contas Ativas</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{ativas.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-medium text-slate-500">Maior Saldo</p>
            </div>
            <p className="mt-2 text-lg font-bold text-emerald-600 dark:text-emerald-400 truncate">
              {maiorSaldo?.nome ?? '—'}
            </p>
            {maiorSaldo && <p className="text-xs text-slate-400">{fmt(maiorSaldo.saldoAtual)}</p>}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4 text-amber-500" />
              <p className="text-xs font-medium text-slate-500">Menor Saldo</p>
            </div>
            <p className="mt-2 text-lg font-bold text-amber-600 dark:text-amber-400 truncate">
              {menorSaldo?.nome ?? '—'}
            </p>
            {menorSaldo && <p className="text-xs text-slate-400">{fmt(menorSaldo.saldoAtual)}</p>}
          </div>
        </div>
      )}

      {/* Active Accounts */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
        </div>
      ) : ativas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-600">
          <Building2 className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="mt-3 font-semibold text-slate-500 dark:text-slate-400">Nenhuma conta ativa</p>
          <button
            onClick={() => openModal()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Criar primeira conta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ativas.map((c) => (
            <ContaCard key={c.id} conta={c} onEdit={openModal} onToggle={handleToggle} />
          ))}
        </div>
      )}

      {/* Inactive Accounts */}
      {inativas.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs font-medium text-slate-400">Contas Inativas ({inativas.length})</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inativas.map((c) => (
              <ContaCard key={c.id} conta={c} onEdit={openModal} onToggle={handleToggle} />
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      <ContaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingItem={editingItem}
      />
    </div>
  );
}
