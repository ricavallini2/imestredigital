'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Search,
  Download,
  Upload,
  Check,
  X,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Categoria {
  id: string;
  nome: string;
  tipo: 'RECEITA' | 'DESPESA';
  cor?: string;
  totalLancamentos: number;
  filhos: Categoria[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const categoriasMock: Categoria[] = [
  {
    id: '1',
    nome: 'Receitas',
    tipo: 'RECEITA',
    totalLancamentos: 128,
    filhos: [
      {
        id: '1.1',
        nome: 'Vendas',
        tipo: 'RECEITA',
        totalLancamentos: 52,
        filhos: [
          { id: '1.1.1', nome: 'Balcão / PDV', tipo: 'RECEITA', totalLancamentos: 38, filhos: [] },
          { id: '1.1.2', nome: 'Atacado', tipo: 'RECEITA', totalLancamentos: 14, filhos: [] },
        ],
      },
      {
        id: '1.2',
        nome: 'Marketplaces',
        tipo: 'RECEITA',
        totalLancamentos: 41,
        filhos: [
          { id: '1.2.1', nome: 'Mercado Livre', tipo: 'RECEITA', totalLancamentos: 20, filhos: [] },
          { id: '1.2.2', nome: 'Shopee', tipo: 'RECEITA', totalLancamentos: 12, filhos: [] },
          { id: '1.2.3', nome: 'Amazon', tipo: 'RECEITA', totalLancamentos: 6, filhos: [] },
          { id: '1.2.4', nome: 'Magazine Luiza', tipo: 'RECEITA', totalLancamentos: 3, filhos: [] },
        ],
      },
      { id: '1.3', nome: 'Serviços', tipo: 'RECEITA', totalLancamentos: 15, filhos: [] },
      { id: '1.4', nome: 'Financeiro', tipo: 'RECEITA', totalLancamentos: 8, filhos: [] },
      { id: '1.5', nome: 'Outras Receitas', tipo: 'RECEITA', totalLancamentos: 12, filhos: [] },
    ],
  },
  {
    id: '2',
    nome: 'Despesas',
    tipo: 'DESPESA',
    totalLancamentos: 214,
    filhos: [
      {
        id: '2.1',
        nome: 'Pessoal',
        tipo: 'DESPESA',
        totalLancamentos: 48,
        filhos: [
          { id: '2.1.1', nome: 'Salários', tipo: 'DESPESA', totalLancamentos: 24, filhos: [] },
          { id: '2.1.2', nome: 'Encargos Sociais', tipo: 'DESPESA', totalLancamentos: 12, filhos: [] },
          { id: '2.1.3', nome: 'Benefícios', tipo: 'DESPESA', totalLancamentos: 8, filhos: [] },
          { id: '2.1.4', nome: 'Rescisões', tipo: 'DESPESA', totalLancamentos: 4, filhos: [] },
        ],
      },
      {
        id: '2.2',
        nome: 'Ocupação',
        tipo: 'DESPESA',
        totalLancamentos: 18,
        filhos: [
          { id: '2.2.1', nome: 'Aluguel', tipo: 'DESPESA', totalLancamentos: 12, filhos: [] },
          { id: '2.2.2', nome: 'Condomínio', tipo: 'DESPESA', totalLancamentos: 6, filhos: [] },
        ],
      },
      {
        id: '2.3',
        nome: 'Marketing',
        tipo: 'DESPESA',
        totalLancamentos: 22,
        filhos: [
          { id: '2.3.1', nome: 'Anúncios Online', tipo: 'DESPESA', totalLancamentos: 14, filhos: [] },
          { id: '2.3.2', nome: 'Material Gráfico', tipo: 'DESPESA', totalLancamentos: 5, filhos: [] },
          { id: '2.3.3', nome: 'Influenciadores', tipo: 'DESPESA', totalLancamentos: 3, filhos: [] },
        ],
      },
      {
        id: '2.4',
        nome: 'Operacional',
        tipo: 'DESPESA',
        totalLancamentos: 55,
        filhos: [
          { id: '2.4.1', nome: 'Energia Elétrica', tipo: 'DESPESA', totalLancamentos: 12, filhos: [] },
          { id: '2.4.2', nome: 'Internet / Telefone', tipo: 'DESPESA', totalLancamentos: 12, filhos: [] },
          { id: '2.4.3', nome: 'Frete e Logística', tipo: 'DESPESA', totalLancamentos: 18, filhos: [] },
          { id: '2.4.4', nome: 'Software e Sistemas', tipo: 'DESPESA', totalLancamentos: 8, filhos: [] },
          { id: '2.4.5', nome: 'Manutenção', tipo: 'DESPESA', totalLancamentos: 5, filhos: [] },
        ],
      },
      {
        id: '2.5',
        nome: 'Impostos',
        tipo: 'DESPESA',
        totalLancamentos: 24,
        filhos: [
          { id: '2.5.1', nome: 'Simples Nacional / DAS', tipo: 'DESPESA', totalLancamentos: 12, filhos: [] },
          { id: '2.5.2', nome: 'FGTS / INSS', tipo: 'DESPESA', totalLancamentos: 12, filhos: [] },
        ],
      },
      {
        id: '2.6',
        nome: 'Compras',
        tipo: 'DESPESA',
        totalLancamentos: 38,
        filhos: [
          { id: '2.6.1', nome: 'Fornecedores', tipo: 'DESPESA', totalLancamentos: 28, filhos: [] },
          { id: '2.6.2', nome: 'Importações', tipo: 'DESPESA', totalLancamentos: 10, filhos: [] },
        ],
      },
      { id: '2.7', nome: 'Financeiro', tipo: 'DESPESA', totalLancamentos: 9, filhos: [] },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countAll(cat: Categoria): number {
  return cat.totalLancamentos + cat.filhos.reduce((s, c) => s + countAll(c), 0);
}

function flatList(cats: Categoria[]): Categoria[] {
  return cats.flatMap((c) => [c, ...flatList(c.filhos)]);
}

function findParent(cats: Categoria[], targetId: string): Categoria | null {
  for (const c of cats) {
    if (c.filhos.some((f) => f.id === targetId)) return c;
    const found = findParent(c.filhos, targetId);
    if (found) return found;
  }
  return null;
}

function addToTree(cats: Categoria[], parentId: string | null, nova: Categoria): Categoria[] {
  if (!parentId) return [...cats, nova];
  return cats.map((c) => {
    if (c.id === parentId) return { ...c, filhos: [...c.filhos, nova] };
    return { ...c, filhos: addToTree(c.filhos, parentId, nova) };
  });
}

function updateInTree(cats: Categoria[], id: string, nome: string): Categoria[] {
  return cats.map((c) => {
    if (c.id === id) return { ...c, nome };
    return { ...c, filhos: updateInTree(c.filhos, id, nome) };
  });
}

function deleteFromTree(cats: Categoria[], id: string): Categoria[] {
  return cats
    .filter((c) => c.id !== id)
    .map((c) => ({ ...c, filhos: deleteFromTree(c.filhos, id) }));
}

function matchesSearch(cat: Categoria, q: string): boolean {
  if (cat.nome.toLowerCase().includes(q.toLowerCase())) return true;
  return cat.filhos.some((f) => matchesSearch(f, q));
}

function filterTree(cats: Categoria[], q: string): Categoria[] {
  if (!q) return cats;
  return cats
    .filter((c) => matchesSearch(c, q))
    .map((c) => ({ ...c, filhos: filterTree(c.filhos, q) }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasMock);
  const [expandidos, setExpandidos] = useState<Set<string>>(
    new Set(['1', '2', '1.2', '2.1', '2.4'])
  );
  const [busca, setBusca] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [formNome, setFormNome] = useState('');
  const [formTipo, setFormTipo] = useState<'RECEITA' | 'DESPESA'>('DESPESA');
  const [formError, setFormError] = useState('');

  // Inline edit
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineEditValue, setInlineEditValue] = useState('');

  const displayCats = useMemo(() => filterTree(categorias, busca), [categorias, busca]);

  const totalReceitas = categorias.find((c) => c.tipo === 'RECEITA')?.totalLancamentos ?? 0;
  const totalDespesas = categorias.find((c) => c.tipo === 'DESPESA')?.totalLancamentos ?? 0;
  const allCats = flatList(categorias);

  const toggleExpand = (id: string) => {
    setExpandidos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Add category
  const openAdd = (parentCat?: Categoria) => {
    setEditingId(null);
    setParentId(parentCat?.id ?? null);
    setFormNome('');
    setFormTipo(parentCat?.tipo ?? 'DESPESA');
    setFormError('');
    setModalOpen(true);
  };

  // Inline edit
  const startInlineEdit = (cat: Categoria) => {
    setInlineEditId(cat.id);
    setInlineEditValue(cat.nome);
  };
  const saveInlineEdit = () => {
    if (!inlineEditValue.trim()) return;
    setCategorias((prev) => updateInTree(prev, inlineEditId!, inlineEditValue));
    setInlineEditId(null);
  };

  const handleSave = () => {
    if (!formNome.trim()) { setFormError('Nome obrigatório'); return; }

    // Derive tipo from parent if applicable
    let tipo = formTipo;
    if (parentId) {
      const parent = allCats.find((c) => c.id === parentId);
      if (parent) tipo = parent.tipo;
    }

    const nova: Categoria = {
      id: `${Date.now()}`,
      nome: formNome,
      tipo,
      totalLancamentos: 0,
      filhos: [],
    };
    setCategorias((prev) => addToTree(prev, parentId, nova));
    setModalOpen(false);
  };

  const handleDelete = (cat: Categoria) => {
    const total = countAll(cat);
    const msg = total > 0
      ? `"${cat.nome}" possui ${total} lançamento(s) vinculado(s). Ao excluir, eles ficarão sem categoria. Confirmar?`
      : `Excluir "${cat.nome}"?`;
    if (confirm(msg)) {
      setCategorias((prev) => deleteFromTree(prev, cat.id));
    }
  };

  const renderTree = (list: Categoria[], nivel = 0) => {
    return list.map((cat, idx) => {
      const hasChildren = cat.filhos.length > 0;
      const isExpanded = expandidos.has(cat.id) || !!busca;
      const isLast = idx === list.length - 1;
      const isInlineEditing = inlineEditId === cat.id;
      const total = countAll(cat);

      return (
        <div key={cat.id}>
          <div
            className={`group flex items-center gap-1.5 rounded-lg py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${nivel === 0 ? 'font-bold' : ''}`}
            style={{ marginLeft: `${nivel * 20}px` }}
          >
            {/* Expand toggle */}
            <button
              onClick={() => toggleExpand(cat.id)}
              className={`flex-shrink-0 ${hasChildren ? 'text-slate-400 hover:text-slate-600' : 'invisible'}`}
            >
              {isExpanded
                ? <ChevronDown className="h-4 w-4" />
                : <ChevronRight className="h-4 w-4" />}
            </button>

            {/* Tipo indicator */}
            <span className={`flex-shrink-0 text-sm font-bold ${cat.tipo === 'RECEITA' ? 'text-emerald-600' : 'text-red-500'}`}>
              {cat.tipo === 'RECEITA' ? '↑' : '↓'}
            </span>

            {/* Name (inline editable) */}
            {isInlineEditing ? (
              <div className="flex flex-1 items-center gap-1">
                <input
                  autoFocus
                  type="text"
                  value={inlineEditValue}
                  onChange={(e) => setInlineEditValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveInlineEdit(); if (e.key === 'Escape') setInlineEditId(null); }}
                  className="flex-1 rounded border border-blue-400 px-2 py-0.5 text-sm focus:outline-none dark:bg-slate-700 dark:text-slate-100"
                />
                <button onClick={saveInlineEdit} className="text-emerald-500 hover:text-emerald-700">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => setInlineEditId(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <span className={`flex-1 text-sm text-slate-800 dark:text-slate-100 ${nivel === 0 ? 'font-semibold' : ''}`}>
                  {cat.nome}
                </span>
                {/* Count badge */}
                {total > 0 && (
                  <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                    {total}
                  </span>
                )}

                {/* Action buttons (appear on hover) */}
                <div className="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openAdd(cat)}
                    title="Adicionar subcategoria"
                    className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => startInlineEdit(cat)}
                    title="Renomear"
                    className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-600"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    title="Excluir"
                    className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Children */}
          {isExpanded && hasChildren && renderTree(cat.filhos, nivel + 1)}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Categorias Financeiras
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Organize suas receitas e despesas em categorias hierárquicas
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => alert('Importação em desenvolvimento')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <Upload className="h-4 w-4" /> Importar
          </button>
          <button
            onClick={() => alert('Exportação em desenvolvimento')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <Download className="h-4 w-4" /> Exportar
          </button>
          <button
            onClick={() => openAdd()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Nova Categoria
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500">Total de Categorias</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{allCats.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
          <p className="text-xs text-emerald-700 dark:text-emerald-300">Categorias Receita</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {allCats.filter((c) => c.tipo === 'RECEITA').length}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">{totalReceitas} lançamentos</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
          <p className="text-xs text-red-700 dark:text-red-300">Categorias Despesa</p>
          <p className="mt-1 text-2xl font-bold text-red-700 dark:text-red-300">
            {allCats.filter((c) => c.tipo === 'DESPESA').length}
          </p>
          <p className="text-xs text-red-600 dark:text-red-400">{totalDespesas} lançamentos</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500">Sem lançamentos</p>
          <p className="mt-1 text-2xl font-bold text-slate-500">
            {allCats.filter((c) => c.totalLancamentos === 0 && c.filhos.length === 0).length}
          </p>
          <p className="text-xs text-slate-400">categorias vazias</p>
        </div>
      </div>

      {/* Search + Tree */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        {/* Search bar */}
        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-2 dark:border-slate-700/50">
          <span className="text-xs text-slate-400">Passe o mouse em uma categoria para ver as ações</span>
          <div className="flex gap-3 ml-auto">
            <span className="flex items-center gap-1 text-xs text-emerald-600"><span className="font-bold">↑</span> Receita</span>
            <span className="flex items-center gap-1 text-xs text-red-500"><span className="font-bold">↓</span> Despesa</span>
          </div>
        </div>

        {/* Tree */}
        <div className="p-4">
          {displayCats.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">Nenhuma categoria encontrada.</p>
          ) : (
            <div className="space-y-0.5">{renderTree(displayCats)}</div>
          )}
        </div>

        {/* Quick add buttons */}
        <div className="flex gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-700/50">
          <button
            onClick={() => { setFormTipo('RECEITA'); openAdd(); }}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
          >
            <Plus className="h-3.5 w-3.5" /> Receita raiz
          </button>
          <button
            onClick={() => { setFormTipo('DESPESA'); openAdd(); }}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
          >
            <Plus className="h-3.5 w-3.5" /> Despesa raiz
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          parentId
            ? `Nova subcategoria em "${allCats.find((c) => c.id === parentId)?.nome ?? ''}"`
            : 'Nova Categoria'
        }
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Criar
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nome da Categoria <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={formNome}
              onChange={(e) => { setFormNome(e.target.value); setFormError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
              placeholder="Ex: Vendas Online, Salários..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
            {formError && <p className="mt-1 text-xs text-red-500">{formError}</p>}
          </div>

          {!parentId && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tipo <span className="text-red-500">*</span>
              </label>
              <div className="flex rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
                {(['RECEITA', 'DESPESA'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFormTipo(t)}
                    className={`flex-1 py-2 text-sm font-semibold transition-colors ${formTipo === t ? (t === 'RECEITA' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white') : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}
                  >
                    {t === 'RECEITA' ? '↑ Receita' : '↓ Despesa'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {parentId && (
            <p className="text-xs text-slate-500">
              Tipo herdado do pai:{' '}
              <strong className={allCats.find((c) => c.id === parentId)?.tipo === 'RECEITA' ? 'text-emerald-600' : 'text-red-600'}>
                {allCats.find((c) => c.id === parentId)?.tipo}
              </strong>
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
