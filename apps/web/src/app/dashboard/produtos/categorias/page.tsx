'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, X, FolderTree, Package, CheckCircle, Search, ArrowLeft, Layers } from 'lucide-react'
import { KPICard } from '@/components/ui/kpi-card'
import {
  useCategorias,
  useCriarCategoria,
  useAtualizarCategoria,
  useRemoverCategoria,
} from '@/hooks/useCategorias'
import type { Categoria } from '@/types'

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-marca-400'

export default function CategoriasPage() {
  const [busca, setBusca] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [form, setForm] = useState<{ nome: string; categoriaPaiId: string; ativa: boolean }>({
    nome: '',
    categoriaPaiId: '',
    ativa: true,
  })
  const [erro, setErro] = useState('')

  const { data, isLoading, isError } = useCategorias({ itensPorPagina: 200 })
  const criar = useCriarCategoria()
  const atualizar = useAtualizarCategoria()
  const remover = useRemoverCategoria()

  const categorias = data?.dados ?? []
  const isBusy = criar.isPending || atualizar.isPending

  const categoriasFiltradas = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return categorias
    return categorias.filter((c) => c.nome.toLowerCase().includes(q) || c.slug.includes(q))
  }, [categorias, busca])

  // Candidatas a categoria-pai (exclui a própria categoria em edição).
  const possiveisPais = useMemo(
    () => categorias.filter((c) => c.id !== editando?.id),
    [categorias, editando],
  )
  const nomePorId = useMemo(
    () => new Map(categorias.map((c) => [c.id, c.nome])),
    [categorias],
  )

  const ativas = categorias.filter((c) => c.ativa).length
  const totalProdutosVinculados = categorias.reduce((s, c) => s + (c._count?.produtos ?? 0), 0)

  const abrirNovo = () => {
    setEditando(null)
    setForm({ nome: '', categoriaPaiId: '', ativa: true })
    setErro('')
    setModalOpen(true)
  }
  const abrirEditar = (cat: Categoria) => {
    setEditando(cat)
    setForm({ nome: cat.nome, categoriaPaiId: cat.categoriaPaiId ?? '', ativa: cat.ativa })
    setErro('')
    setModalOpen(true)
  }
  const fechar = () => {
    setModalOpen(false)
    setEditando(null)
    setErro('')
  }

  const handleSalvar = async () => {
    setErro('')
    if (!form.nome.trim()) {
      setErro('O nome é obrigatório')
      return
    }
    const dto = {
      nome: form.nome.trim(),
      categoriaPaiId: form.categoriaPaiId || null,
      ativa: form.ativa,
    }
    try {
      if (editando) await atualizar.mutateAsync({ id: editando.id, dto })
      else await criar.mutateAsync(dto)
      fechar()
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message
      setErro(Array.isArray(msg) ? msg[0] : msg ?? 'Erro ao salvar categoria')
    }
  }

  const handleRemover = async (cat: Categoria) => {
    if (!confirm(`Inativar a categoria "${cat.nome}"?`)) return
    try {
      await remover.mutateAsync(cat.id)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(msg ?? 'Erro ao inativar categoria')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/produtos" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700">
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Categorias</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">Organize o catálogo em categorias</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href="/dashboard/produtos/marcas"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Layers className="h-4 w-4" /> Marcas
          </Link>
          <button onClick={abrirNovo}
            className="inline-flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2.5 font-semibold text-white hover:bg-marca-600 transition-colors">
            <Plus className="h-5 w-5" /> Nova Categoria
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="Total de Categorias" valor={categorias.length} icone={<FolderTree className="h-6 w-6" />} />
        <KPICard label="Ativas" valor={ativas} icone={<CheckCircle className="h-6 w-6" />} />
        <KPICard label="Produtos Vinculados" valor={totalProdutosVinculados} icone={<Package className="h-6 w-6" />} destaque />
      </div>

      {/* Busca */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Buscar categoria..." value={busca} onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-9 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/20">
          <p className="font-medium text-red-600 dark:text-red-400">Erro ao carregar categorias</p>
        </div>
      ) : categoriasFiltradas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center dark:border-slate-600">
          <FolderTree className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p className="font-semibold text-slate-600 dark:text-slate-400">Nenhuma categoria encontrada</p>
          {!busca && (
            <button onClick={abrirNovo} className="mt-4 text-sm font-medium text-marca-600 hover:underline">
              Criar primeira categoria
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Categoria</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Categoria Pai</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">Produtos</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {categoriasFiltradas.map((cat) => (
                  <tr key={cat.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-marca-50 dark:bg-marca-900/30">
                          <FolderTree className="h-4 w-4 text-marca-600 dark:text-marca-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{cat.nome}</p>
                          <p className="font-mono text-xs text-slate-400">{cat.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {cat.categoriaPaiId ? (nomePorId.get(cat.categoriaPaiId) ?? '—') : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {cat._count?.produtos ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        cat.ativa
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {cat.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => abrirEditar(cat)}
                          className="rounded p-1.5 text-slate-500 hover:bg-marca-50 hover:text-marca-600 dark:hover:bg-marca-900/20" title="Editar">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleRemover(cat)}
                          className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20" title="Inativar">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            <p className="text-xs text-slate-500">{categoriasFiltradas.length} de {categorias.length} categorias</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{editando ? 'Editar Categoria' : 'Nova Categoria'}</h2>
              <button onClick={fechar} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Nome *</label>
                <input type="text" value={form.nome} placeholder="Ex: Eletrônicos" className={inputCls}
                  onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} autoFocus />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Categoria Pai</label>
                <select value={form.categoriaPaiId} className={inputCls}
                  onChange={(e) => setForm((p) => ({ ...p, categoriaPaiId: e.target.value }))}>
                  <option value="">Nenhuma (categoria raiz)</option>
                  {possiveisPais.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={form.ativa} onChange={(e) => setForm((p) => ({ ...p, ativa: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-marca-500 focus:ring-marca-400" />
                Categoria ativa
              </label>
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
  )
}
