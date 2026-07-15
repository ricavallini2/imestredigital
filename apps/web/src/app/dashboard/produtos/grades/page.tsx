'use client'

import { useState, useMemo, useRef, type KeyboardEvent } from 'react'
import Link from 'next/link'
import {
  Plus, Edit, Trash2, X, Grid3x3, CheckCircle, Search, ArrowLeft,
  ChevronLeft, ChevronRight, Ruler, Layers,
} from 'lucide-react'
import { KPICard } from '@/components/ui/kpi-card'
import {
  useGrades,
  useCriarGrade,
  useAtualizarGrade,
  useInativarGrade,
} from '@/hooks/useGrades'
import type { Grade, GradeDto } from '@/types'

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-marca-400'

/** Presets rápidos de tamanhos comuns do varejo BR. */
const PRESETS: { rotulo: string; valores: string[] }[] = [
  { rotulo: 'Vestuário (PP–GG)', valores: ['PP', 'P', 'M', 'G', 'GG'] },
  { rotulo: 'Vestuário estendido', valores: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'] },
  { rotulo: 'Calçados 34–44', valores: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'] },
  { rotulo: 'Numérico 36–48', valores: ['36', '38', '40', '42', '44', '46', '48'] },
  { rotulo: 'Único', valores: ['Único'] },
]

export default function GradesPage() {
  const [busca, setBusca] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Grade | null>(null)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [ativa, setAtiva] = useState(true)
  const [tamanhos, setTamanhos] = useState<string[]>([])
  const [novoTamanho, setNovoTamanho] = useState('')
  const [erro, setErro] = useState('')
  const inputTamanhoRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, isError } = useGrades({ itensPorPagina: 200 })
  const criar = useCriarGrade()
  const atualizar = useAtualizarGrade()
  const inativar = useInativarGrade()

  const grades = data?.dados ?? []
  const isBusy = criar.isPending || atualizar.isPending

  const gradesFiltradas = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return grades
    return grades.filter(
      (g) =>
        g.nome.toLowerCase().includes(q) ||
        g.tamanhos.some((t) => t.valor.toLowerCase().includes(q)),
    )
  }, [grades, busca])

  const ativasCount = grades.filter((g) => g.ativa).length
  const totalTamanhos = grades.reduce((s, g) => s + g.tamanhos.length, 0)

  const abrirNovo = () => {
    setEditando(null)
    setNome('')
    setDescricao('')
    setAtiva(true)
    setTamanhos([])
    setNovoTamanho('')
    setErro('')
    setModalOpen(true)
  }

  const abrirEditar = (g: Grade) => {
    setEditando(g)
    setNome(g.nome)
    setDescricao(g.descricao ?? '')
    setAtiva(g.ativa)
    setTamanhos(g.tamanhos.map((t) => t.valor))
    setNovoTamanho('')
    setErro('')
    setModalOpen(true)
  }

  const fechar = () => {
    setModalOpen(false)
    setEditando(null)
    setErro('')
  }

  // ── Manipulação de chips de tamanho ──────────────────────────────
  const adicionarTamanho = (bruto?: string) => {
    const valor = (bruto ?? novoTamanho).trim()
    if (!valor) return
    // Permite colar vários de uma vez separados por vírgula/espaço.
    const partes = valor
      .split(/[,;\s]+/)
      .map((v) => v.trim())
      .filter(Boolean)
    setTamanhos((prev) => {
      const existentes = new Set(prev.map((v) => v.toLowerCase()))
      const novos = partes.filter((v) => !existentes.has(v.toLowerCase()))
      return [...prev, ...novos]
    })
    setNovoTamanho('')
    inputTamanhoRef.current?.focus()
  }

  const removerTamanho = (i: number) =>
    setTamanhos((prev) => prev.filter((_, j) => j !== i))

  const moverTamanho = (i: number, dir: -1 | 1) => {
    setTamanhos((prev) => {
      const alvo = i + dir
      if (alvo < 0 || alvo >= prev.length) return prev
      const copia = [...prev]
      ;[copia[i], copia[alvo]] = [copia[alvo], copia[i]]
      return copia
    })
  }

  const aplicarPreset = (valores: string[]) => {
    setTamanhos((prev) => {
      const existentes = new Set(prev.map((v) => v.toLowerCase()))
      const novos = valores.filter((v) => !existentes.has(v.toLowerCase()))
      return [...prev, ...novos]
    })
  }

  const onKeyDownTamanho = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      adicionarTamanho()
    } else if (e.key === 'Backspace' && !novoTamanho && tamanhos.length > 0) {
      // Backspace com input vazio remove o último chip.
      removerTamanho(tamanhos.length - 1)
    }
  }

  const handleSalvar = async () => {
    setErro('')
    if (!nome.trim()) {
      setErro('O nome é obrigatório')
      return
    }
    if (tamanhos.length === 0) {
      setErro('Adicione ao menos um tamanho')
      return
    }
    const dto: GradeDto = {
      nome: nome.trim(),
      descricao: descricao.trim() || undefined,
      ativa,
      tamanhos: tamanhos.map((valor, ordem) => ({ valor, ordem })),
    }
    try {
      if (editando) await atualizar.mutateAsync({ id: editando.id, dto })
      else await criar.mutateAsync(dto)
      fechar()
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message
      setErro(Array.isArray(msg) ? msg[0] : msg ?? 'Erro ao salvar grade')
    }
  }

  const handleInativar = async (g: Grade) => {
    if (!confirm(`Inativar a grade "${g.nome}"?`)) return
    try {
      await inativar.mutateAsync(g.id)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response
        ?.data?.message
      alert(msg ?? 'Erro ao inativar grade')
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
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Grades de Tamanho</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Modelos reutilizáveis de tamanhos para gerar variações de produtos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href="/dashboard/produtos/categorias"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Layers className="h-4 w-4" /> Categorias
          </Link>
          <button onClick={abrirNovo}
            className="inline-flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2.5 font-semibold text-white hover:bg-marca-600 transition-colors">
            <Plus className="h-5 w-5" /> Nova Grade
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard label="Total de Grades" valor={grades.length} icone={<Grid3x3 className="h-6 w-6" />} />
        <KPICard label="Ativas" valor={ativasCount} icone={<CheckCircle className="h-6 w-6" />} />
        <KPICard label="Tamanhos Cadastrados" valor={totalTamanhos} icone={<Ruler className="h-6 w-6" />} destaque />
      </div>

      {/* Busca */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Buscar grade ou tamanho..." value={busca} onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-9 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/20">
          <p className="font-medium text-red-600 dark:text-red-400">Erro ao carregar grades</p>
        </div>
      ) : gradesFiltradas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center dark:border-slate-600">
          <Grid3x3 className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p className="font-semibold text-slate-600 dark:text-slate-400">Nenhuma grade encontrada</p>
          {!busca && (
            <button onClick={abrirNovo} className="mt-4 text-sm font-medium text-marca-600 hover:underline">
              Criar primeira grade
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Grade</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Tamanhos</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">Qtd.</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {gradesFiltradas.map((g) => (
                  <tr key={g.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-marca-50 dark:bg-marca-900/30">
                          <Grid3x3 className="h-4 w-4 text-marca-600 dark:text-marca-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{g.nome}</p>
                          {g.descricao && <p className="text-xs text-slate-400">{g.descricao}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {g.tamanhos.slice(0, 12).map((t) => (
                          <span key={t.id || t.valor}
                            className="inline-block rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {t.valor}
                          </span>
                        ))}
                        {g.tamanhos.length > 12 && (
                          <span className="inline-block rounded-md px-2 py-0.5 text-xs text-slate-400">
                            +{g.tamanhos.length - 12}
                          </span>
                        )}
                        {g.tamanhos.length === 0 && <span className="text-xs text-slate-400">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {g.tamanhos.length}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        g.ativa
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {g.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => abrirEditar(g)}
                          className="rounded p-1.5 text-slate-500 hover:bg-marca-50 hover:text-marca-600 dark:hover:bg-marca-900/20" title="Editar">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleInativar(g)}
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
            <p className="text-xs text-slate-500">{gradesFiltradas.length} de {grades.length} grades</p>
          </div>
        </div>
      )}

      {/* Modal criar/editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{editando ? 'Editar Grade' : 'Nova Grade'}</h2>
              <button onClick={fechar} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Nome *</label>
                <input type="text" value={nome} placeholder="Ex: Calçados Numérico 34–44" className={inputCls}
                  onChange={(e) => setNome(e.target.value)} autoFocus />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
                <input type="text" value={descricao} placeholder="Opcional" className={inputCls}
                  onChange={(e) => setDescricao(e.target.value)} />
              </div>

              {/* Editor de tamanhos (chips) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tamanhos * <span className="font-normal text-slate-400">(na ordem de exibição)</span>
                </label>
                <div className="rounded-lg border border-slate-300 p-2 dark:border-slate-600">
                  {tamanhos.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {tamanhos.map((t, i) => (
                        <span key={`${t}-${i}`}
                          className="inline-flex items-center gap-0.5 rounded-md border border-marca-200 bg-marca-50 py-0.5 pl-2 pr-0.5 text-xs font-medium text-marca-700 dark:border-marca-800 dark:bg-marca-900/30 dark:text-marca-300">
                          <button type="button" onClick={() => moverTamanho(i, -1)} disabled={i === 0}
                            className="rounded p-0.5 hover:bg-marca-100 disabled:opacity-30 dark:hover:bg-marca-800" title="Mover para a esquerda">
                            <ChevronLeft className="h-3 w-3" />
                          </button>
                          <span className="px-0.5 font-mono">{t}</span>
                          <button type="button" onClick={() => moverTamanho(i, 1)} disabled={i === tamanhos.length - 1}
                            className="rounded p-0.5 hover:bg-marca-100 disabled:opacity-30 dark:hover:bg-marca-800" title="Mover para a direita">
                            <ChevronRight className="h-3 w-3" />
                          </button>
                          <button type="button" onClick={() => removerTamanho(i)}
                            className="rounded p-0.5 text-marca-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" title="Remover">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input ref={inputTamanhoRef} type="text" value={novoTamanho} onChange={(e) => setNovoTamanho(e.target.value)}
                      onKeyDown={onKeyDownTamanho} placeholder="Digite um tamanho e tecle Enter (ex: 38, M, GG)"
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-marca-400" />
                    <button type="button" onClick={() => adicionarTamanho()}
                      className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700">
                      Adicionar
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Use as setas para reordenar. Você pode colar vários separados por vírgula ou espaço.
                </p>
              </div>

              {/* Presets rápidos */}
              <div>
                <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Presets rápidos</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((preset) => (
                    <button key={preset.rotulo} type="button" onClick={() => aplicarPreset(preset.valores)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-marca-300 hover:bg-marca-50 hover:text-marca-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-marca-900/20">
                      + {preset.rotulo}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={ativa} onChange={(e) => setAtiva(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-marca-500 focus:ring-marca-400" />
                Grade ativa
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
