'use client';

import { useState } from 'react';
import {
  Building2, Plus, Search, Phone, Mail, MapPin,
  CheckCircle2, XCircle, ShoppingBag, DollarSign,
  Loader2, ChevronRight, X, AlertTriangle, Users,
  TrendingUp, Calendar,
} from 'lucide-react';
import { useFornecedores, useCriarFornecedor, type Fornecedor } from '@/hooks/useCompras';

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dtfmt = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-100 dark:bg-slate-700 ${className ?? ''}`} />;
}

// ─── Modal Novo Fornecedor ─────────────────────────────────────────────────────

function ModalNovoFornecedor({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { mutate: criar, isPending } = useCriarFornecedor();
  const [form, setForm] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    email: '',
    telefone: '',
    prazoMedioPagamento: 30,
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
  });
  const [erro, setErro] = useState('');

  const setF = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    if (!form.razaoSocial || !form.cnpj) {
      setErro('Razão Social e CNPJ são obrigatórios.');
      return;
    }
    criar(
      {
        razaoSocial: form.razaoSocial,
        nomeFantasia: form.nomeFantasia || form.razaoSocial,
        cnpj: form.cnpj,
        email: form.email,
        telefone: form.telefone,
        prazoMedioPagamento: form.prazoMedioPagamento,
        endereco: {
          logradouro: form.logradouro,
          numero: form.numero,
          bairro: form.bairro,
          cidade: form.cidade,
          uf: form.uf,
          cep: form.cep,
        },
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: () => setErro('Erro ao criar fornecedor. Tente novamente.'),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-marca-600" />
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Novo Fornecedor</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {erro && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>
            </div>
          )}

          {/* Dados básicos */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Dados da Empresa</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Razão Social <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.razaoSocial}
                  onChange={(e) => setF('razaoSocial', e.target.value)}
                  placeholder="Ex.: Tech Distribuidora Ltda"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nome Fantasia</label>
                <input
                  value={form.nomeFantasia}
                  onChange={(e) => setF('nomeFantasia', e.target.value)}
                  placeholder="Ex.: TechDist"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  CNPJ <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.cnpj}
                  onChange={(e) => setF('cnpj', e.target.value)}
                  placeholder="XX.XXX.XXX/0001-XX"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setF('email', e.target.value)}
                  placeholder="compras@empresa.com.br"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Telefone</label>
                <input
                  value={form.telefone}
                  onChange={(e) => setF('telefone', e.target.value)}
                  placeholder="(11) 3456-7890"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Prazo Médio de Pagamento (dias)</label>
                <input
                  type="number"
                  min={0}
                  value={form.prazoMedioPagamento}
                  onChange={(e) => setF('prazoMedioPagamento', parseInt(e.target.value) || 30)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Endereço</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">CEP</label>
                <input
                  value={form.cep}
                  onChange={(e) => setF('cep', e.target.value)}
                  placeholder="XXXXX-XXX"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Número</label>
                <input
                  value={form.numero}
                  onChange={(e) => setF('numero', e.target.value)}
                  placeholder="123"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Logradouro</label>
                <input
                  value={form.logradouro}
                  onChange={(e) => setF('logradouro', e.target.value)}
                  placeholder="Av. Paulista"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Bairro</label>
                <input
                  value={form.bairro}
                  onChange={(e) => setF('bairro', e.target.value)}
                  placeholder="Bela Vista"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Cidade</label>
                <input
                  value={form.cidade}
                  onChange={(e) => setF('cidade', e.target.value)}
                  placeholder="São Paulo"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">UF</label>
                <input
                  value={form.uf}
                  onChange={(e) => setF('uf', e.target.value.toUpperCase().slice(0, 2))}
                  placeholder="SP"
                  maxLength={2}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-marca-600 hover:bg-marca-700 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition-colors"
            >
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Criando...</>
              ) : (
                <><Plus className="h-4 w-4" /> Criar Fornecedor</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FornecedoresPage() {
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<'ATIVO' | 'INATIVO' | ''>('');
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, refetch } = useFornecedores({
    busca: busca || undefined,
    status: statusFiltro || undefined,
  });

  const fornecedores: Fornecedor[] = data?.dados ?? [];

  const totalGasto = fornecedores.reduce((s, f) => s + f.totalCompras, 0);
  const ativos = fornecedores.filter((f) => f.status === 'ATIVO').length;
  const ticketMedio = fornecedores.length > 0 && fornecedores.some(f => f.qtdCompras > 0)
    ? fornecedores.reduce((s, f) => s + f.totalCompras, 0) /
      Math.max(fornecedores.reduce((s, f) => s + f.qtdCompras, 0), 1)
    : 0;

  return (
    <>
      {showModal && (
        <ModalNovoFornecedor
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Fornecedores</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Gerencie seus fornecedores e histórico de compras
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-marca-600 hover:bg-marca-700 px-4 py-2 text-sm font-semibold text-white transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Novo Fornecedor
          </button>
        </div>

        {/* KPIs */}
        {!isLoading && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Total', value: String(data?.total ?? 0), icon: Users, color: 'text-marca-600', bg: 'bg-marca-50 dark:bg-marca-900/20' },
              { label: 'Ativos', value: String(ativos), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { label: 'Total Gasto', value: fmt(totalGasto), icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { label: 'Ticket Médio', value: fmt(ticketMedio), icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className={`text-xl font-bold mt-1 tabular-nums ${color}`}>{value}</p>
                  </div>
                  <div className={`rounded-xl p-2 ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, CNPJ, e-mail..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500"
            />
          </div>
          <div className="flex gap-1">
            {[
              { value: '' as const, label: 'Todos' },
              { value: 'ATIVO' as const, label: 'Ativos' },
              { value: 'INATIVO' as const, label: 'Inativos' },
            ].map((op) => (
              <button
                key={op.value}
                onClick={() => setStatusFiltro(op.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  statusFiltro === op.value
                    ? 'bg-marca-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de fornecedores */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : fornecedores.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-16 text-center">
            <Building2 className="mx-auto mb-3 h-12 w-12 text-slate-200 dark:text-slate-600" />
            <p className="text-slate-500 font-medium">
              {busca || statusFiltro ? 'Nenhum fornecedor encontrado' : 'Nenhum fornecedor cadastrado'}
            </p>
            {!busca && !statusFiltro && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Cadastrar primeiro fornecedor
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fornecedores.map((f) => (
              <div
                key={f.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:border-marca-200 dark:hover:border-marca-700 transition-colors"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-marca-100 to-marca-200 dark:from-marca-900/50 dark:to-marca-800/50 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-marca-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {f.nomeFantasia || f.razaoSocial}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{f.razaoSocial}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      f.status === 'ATIVO'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {f.status === 'ATIVO'
                      ? <CheckCircle2 className="h-3 w-3" />
                      : <XCircle className="h-3 w-3" />
                    }
                    {f.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{f.endereco.cidade}/{f.endereco.uf} · {f.cnpj}</span>
                  </div>
                  {f.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate">{f.email}</span>
                    </div>
                  )}
                  {f.telefone && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span>{f.telefone}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <DollarSign className="h-3 w-3 text-slate-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {fmt(f.totalCompras)}
                    </p>
                    <p className="text-[10px] text-slate-400">Total</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <ShoppingBag className="h-3 w-3 text-slate-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {f.qtdCompras}
                    </p>
                    <p className="text-[10px] text-slate-400">Compras</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <Calendar className="h-3 w-3 text-slate-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {f.prazoMedioPagamento}d
                    </p>
                    <p className="text-[10px] text-slate-400">Prazo</p>
                  </div>
                </div>

                {/* Última compra */}
                {f.ultimaCompra && (
                  <p className="text-xs text-slate-400 mb-3">
                    Última compra: {dtfmt(f.ultimaCompra)}
                  </p>
                )}

                {/* Ações */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-600 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Editar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-marca-50 dark:bg-marca-900/20 py-2 text-xs font-medium text-marca-600 dark:text-marca-400 hover:bg-marca-100 dark:hover:bg-marca-900/30 transition-colors">
                    Ver Compras
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {data && data.total > 0 && (
          <p className="text-center text-xs text-slate-400">
            {data.total} fornecedor{data.total !== 1 ? 'es' : ''} encontrado{data.total !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </>
  );
}
