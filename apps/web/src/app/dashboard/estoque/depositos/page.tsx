'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Package, X, Warehouse } from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import { useDepositos, useCriarDeposito, useAtualizarDeposito, useRemoverDeposito } from '@/hooks/useEstoque';

interface DepositoForm {
  nome: string; descricao: string; endereco: string; area: string; responsavel: string;
}

const FORM_VAZIO: DepositoForm = { nome: '', descricao: '', endereco: '', area: '', responsavel: '' };

interface DepositoItem {
  id: string; nome: string; descricao?: string; ativo: boolean;
  endereco?: string; area?: number; responsavel?: string;
}

export default function DepositosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<DepositoItem | null>(null);
  const [form, setForm] = useState<DepositoForm>(FORM_VAZIO);
  const [erro, setErro] = useState('');

  const { data: depositos = [], isLoading } = useDepositos();
  const criar = useCriarDeposito();
  const atualizar = useAtualizarDeposito();
  const remover = useRemoverDeposito();

  const abrirNovo = () => { setEditando(null); setForm(FORM_VAZIO); setErro(''); setModalOpen(true); };
  const abrirEditar = (dep: DepositoItem) => {
    setEditando(dep);
    setForm({ nome: dep.nome, descricao: dep.descricao ?? '', endereco: dep.endereco ?? '', area: String(dep.area ?? ''), responsavel: dep.responsavel ?? '' });
    setErro(''); setModalOpen(true);
  };
  const fechar = () => { setModalOpen(false); setEditando(null); setForm(FORM_VAZIO); setErro(''); };

  const handleSalvar = async () => {
    setErro('');
    if (!form.nome.trim()) { setErro('Nome é obrigatório'); return; }
    const dto = { nome: form.nome, descricao: form.descricao, endereco: form.endereco, area: Number(form.area) || 0, responsavel: form.responsavel };
    try {
      if (editando) await atualizar.mutateAsync({ id: editando.id, ...dto });
      else await criar.mutateAsync(dto);
      fechar();
    } catch {
      setErro('Erro ao salvar depósito');
    }
  };

  const handleRemover = async (id: string, nome: string) => {
    if (!confirm(`Remover o depósito "${nome}"?`)) return;
    try { await remover.mutateAsync(id); } catch { alert('Erro ao remover'); }
  };

  const isBusy = criar.isPending || atualizar.isPending;
  const areaTotal = (depositos as DepositoItem[]).reduce((s, d) => s + (d.area ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Depósitos</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Gerencie seus almoxarifados e centros de distribuição</p>
        </div>
        <button onClick={abrirNovo}
          className="flex items-center gap-2 rounded-xl bg-marca-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-marca-600 transition-colors">
          <Plus className="h-4 w-4" /> Novo Depósito
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="Total de Depósitos" valor={(depositos as DepositoItem[]).filter(d => d.ativo).length} icone={<Warehouse className="h-6 w-6" />} />
        <KPICard label="Área Total" valor={`${areaTotal.toLocaleString('pt-BR')} m²`} icone={<MapPin className="h-6 w-6" />} />
        <KPICard label="Depósitos Ativos" valor={(depositos as DepositoItem[]).filter(d => d.ativo).length} icone={<Package className="h-6 w-6" />} destaque />
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 h-44" />
          ))}
        </div>
      ) : (depositos as DepositoItem[]).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 p-12 text-center">
          <Warehouse className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p className="font-medium text-slate-500">Nenhum depósito cadastrado</p>
          <button onClick={abrirNovo} className="mt-4 text-sm font-medium text-marca-600 hover:underline">Criar primeiro depósito</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(depositos as DepositoItem[]).map((dep) => (
            <div key={dep.id} className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow dark:border-slate-700 dark:bg-slate-800">
              {/* Status dot */}
              <div className={`absolute right-4 top-4 h-2.5 w-2.5 rounded-full ${dep.ativo ? 'bg-emerald-400' : 'bg-slate-300'}`} title={dep.ativo ? 'Ativo' : 'Inativo'} />

              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-marca-50 p-2.5 dark:bg-marca-900/30">
                  <Warehouse className="h-5 w-5 text-marca-600 dark:text-marca-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{dep.nome}</h3>
                  {dep.descricao && <p className="text-xs text-slate-500 dark:text-slate-400">{dep.descricao}</p>}
                </div>
              </div>

              <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                {dep.endereco && (
                  <div className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                    <span className="text-xs leading-tight">{dep.endereco}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 pt-1">
                  {dep.area ? <span className="text-xs"><strong>{dep.area.toLocaleString('pt-BR')}</strong> m²</span> : null}
                  {dep.responsavel ? <span className="text-xs text-slate-500">{dep.responsavel}</span> : null}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => abrirEditar(dep)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  <Edit className="h-3.5 w-3.5" /> Editar
                </button>
                <button onClick={() => handleRemover(dep.id, dep.nome)}
                  className="flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400">
                  <Trash2 className="h-3.5 w-3.5" /> Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{editando ? 'Editar Depósito' : 'Novo Depósito'}</h2>
              <button onClick={fechar} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            <div className="space-y-4 p-5">
              {[
                { label: 'Nome *', key: 'nome', placeholder: 'Ex: Depósito Principal' },
                { label: 'Descrição', key: 'descricao', placeholder: 'Breve descrição' },
                { label: 'Endereço', key: 'endereco', placeholder: 'Endereço completo' },
                { label: 'Área (m²)', key: 'area', placeholder: 'Ex: 500', type: 'number' },
                { label: 'Responsável', key: 'responsavel', placeholder: 'Nome do responsável' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
                  <input type={type ?? 'text'} value={form[key as keyof DepositoForm]} placeholder={placeholder}
                    onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                </div>
              ))}
              {erro && <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">{erro}</div>}
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 px-5 py-4">
              <button onClick={fechar} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Cancelar</button>
              <button onClick={handleSalvar} disabled={isBusy} className="rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-60">
                {isBusy ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
