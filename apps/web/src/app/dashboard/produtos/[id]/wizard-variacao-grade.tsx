'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Grid3x3, Wand2, Loader2, Trash2, Save, X, AlertCircle, CheckCircle, Info,
} from 'lucide-react'
import { useGrades } from '@/hooks/useGrades'
import {
  useVariacoes,
  usePreverVariacoes,
  useSalvarVariacoesLote,
} from '@/hooks/useVariacoes'
import type { VariacaoLoteItem, AtributoVariacao } from '@/types'

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-400'
const cellCls =
  'w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-400'

const moeda = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/** Linha editável da matriz gerada. */
type LinhaMatriz = {
  key: string
  sku: string
  nome: string
  precoVenda: string
  gtin: string
  /** Atributos preservados (Cor + Tamanho) para gravar no lote. */
  atributos: AtributoVariacao[]
}

/**
 * Wizard de variação por grade.
 *
 * Fluxo: atributo (default 'Cor') + valor (ex 'Preto') + grade → prever gera a
 * matriz (uma linha por tamanho) → usuário edita nome/sku/preço/gtin e remove
 * linhas → salvar chama o endpoint de lote e refaz o fetch das variações.
 *
 * Programado contra o contrato:
 *   POST /v1/produtos/:id/variacoes/prever {atributo, valorAtributo, gradeId}
 *   POST /v1/produtos/:id/variacoes/lote   {variacoes:[...]}
 *   GET  /v1/produtos/:id/variacoes
 */
export function WizardVariacaoGrade({
  produtoId,
  precoBase,
}: {
  produtoId: string
  precoBase?: number
}) {
  const [aberto, setAberto] = useState(false)
  const [atributo, setAtributo] = useState('Cor')
  const [valorAtributo, setValorAtributo] = useState('')
  const [gradeId, setGradeId] = useState('')
  const [matriz, setMatriz] = useState<LinhaMatriz[] | null>(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const { data: gradesData, isLoading: loadingGrades } = useGrades({ ativa: true, itensPorPagina: 200 })
  const grades = gradesData?.dados ?? []
  const gradesAtivas = useMemo(() => grades.filter((g) => g.ativa && g.tamanhos.length > 0), [grades])

  const { data: variacoesExistentes, isLoading: loadingVariacoes } = useVariacoes(produtoId)
  const prever = usePreverVariacoes(produtoId)
  const salvarLote = useSalvarVariacoesLote(produtoId)

  const gradeSelecionada = gradesAtivas.find((g) => g.id === gradeId)

  const reset = () => {
    setValorAtributo('')
    setGradeId('')
    setMatriz(null)
    setErro('')
    setSucesso(false)
  }

  const fechar = () => {
    setAberto(false)
    reset()
  }

  const handlePrever = async () => {
    setErro('')
    setSucesso(false)
    if (!atributo.trim()) return setErro('Informe o atributo (ex: Cor)')
    if (!valorAtributo.trim()) return setErro('Informe o valor do atributo (ex: Preto)')
    if (!gradeId) return setErro('Selecione uma grade')
    try {
      const previstas = await prever.mutateAsync({
        atributo: atributo.trim(),
        valorAtributo: valorAtributo.trim(),
        gradeId,
      })
      if (previstas.length === 0) {
        setErro('A grade selecionada não gerou nenhuma variação')
        setMatriz(null)
        return
      }
      setMatriz(
        previstas.map((v, i) => ({
          key: `${v.sku}-${i}`,
          sku: v.sku,
          nome: v.nome,
          precoVenda: v.precoVenda != null ? String(v.precoVenda) : '',
          gtin: v.gtin ?? '',
          atributos: v.atributos,
        })),
      )
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message
      setErro(Array.isArray(msg) ? msg[0] : msg ?? 'Erro ao gerar a matriz de variações')
      setMatriz(null)
    }
  }

  const setLinha = (i: number, campo: keyof LinhaMatriz, valor: string) =>
    setMatriz((prev) =>
      prev ? prev.map((l, j) => (j === i ? { ...l, [campo]: valor } : l)) : prev,
    )

  const removerLinha = (i: number) =>
    setMatriz((prev) => (prev ? prev.filter((_, j) => j !== i) : prev))

  const handleSalvar = async () => {
    setErro('')
    if (!matriz || matriz.length === 0) return setErro('Nenhuma variação para salvar')
    const semSku = matriz.some((l) => !l.sku.trim())
    if (semSku) return setErro('Toda variação precisa de um SKU')
    // SKUs duplicados dentro do lote quebram a persistência — valida antes.
    const skus = matriz.map((l) => l.sku.trim().toUpperCase())
    if (new Set(skus).size !== skus.length) return setErro('Há SKUs duplicados na matriz')

    const variacoes: VariacaoLoteItem[] = matriz.map((l) => ({
      sku: l.sku.trim(),
      nome: l.nome.trim(),
      precoVenda: l.precoVenda !== '' ? Number(l.precoVenda) : undefined,
      gtin: l.gtin.trim() || undefined,
      atributos: l.atributos,
    }))

    try {
      await salvarLote.mutateAsync({ variacoes })
      setSucesso(true)
      setMatriz(null)
      setValorAtributo('')
      setGradeId('')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message
      setErro(Array.isArray(msg) ? msg[0] : msg ?? 'Erro ao salvar as variações')
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-marca-200 bg-marca-50/40 p-4 dark:border-marca-800 dark:bg-marca-900/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-marca-500">
            <Grid3x3 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Variações por grade</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gere uma variação por tamanho a partir de uma grade (ex: Cor Preto × 34–44)
            </p>
          </div>
        </div>
        {!aberto ? (
          <button type="button" onClick={() => setAberto(true)}
            className="flex items-center gap-1.5 rounded-lg bg-marca-500 px-3 py-2 text-xs font-semibold text-white hover:bg-marca-600">
            <Wand2 className="h-3.5 w-3.5" /> + Variação por grade
          </button>
        ) : (
          <button type="button" onClick={fechar}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700" title="Fechar">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Variações já cadastradas */}
      {!loadingVariacoes && (variacoesExistentes?.length ?? 0) > 0 && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {variacoesExistentes!.length} variação(ões) cadastrada(s)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {variacoesExistentes!.map((v) => (
              <span key={v.id}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <span className="font-medium">{v.nome}</span>
                <span className="font-mono text-slate-400">{v.sku}</span>
                {v.precoVenda != null && <span className="text-marca-600 dark:text-marca-400">{moeda(v.precoVenda)}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {aberto && (
        <div className="mt-4 space-y-4">
          {gradesAtivas.length === 0 && !loadingGrades ? (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/20">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-amber-700 dark:text-amber-400">
                Nenhuma grade ativa com tamanhos.{' '}
                <Link href="/dashboard/produtos/grades" className="font-semibold underline">
                  Cadastre uma grade
                </Link>{' '}
                para gerar variações.
              </p>
            </div>
          ) : (
            <>
              {/* Parâmetros */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Atributo</label>
                  <input className={inputCls} value={atributo} onChange={(e) => setAtributo(e.target.value)} placeholder="Cor" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Valor do atributo</label>
                  <input className={inputCls} value={valorAtributo} onChange={(e) => setValorAtributo(e.target.value)} placeholder="Ex: Preto" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Grade</label>
                  <select className={inputCls} value={gradeId} onChange={(e) => setGradeId(e.target.value)} disabled={loadingGrades}>
                    <option value="">{loadingGrades ? 'Carregando...' : 'Selecione...'}</option>
                    {gradesAtivas.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nome} ({g.tamanhos.length} tamanhos)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {gradeSelecionada && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span>Tamanhos:</span>
                  {gradeSelecionada.tamanhos.map((t) => (
                    <span key={t.id || t.valor} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-700">{t.valor}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button type="button" onClick={handlePrever} disabled={prever.isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-60">
                  {prever.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  Gerar matriz
                </button>
                {precoBase != null && precoBase > 0 && (
                  <span className="text-xs text-slate-400">
                    Preço herdado do produto: {moeda(precoBase)}
                  </span>
                )}
              </div>

              {/* Feedback */}
              {erro && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950/20">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <p className="text-red-700 dark:text-red-400">{erro}</p>
                </div>
              )}
              {sucesso && (
                <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm dark:border-green-800 dark:bg-green-950/20">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <p className="text-green-700 dark:text-green-400">Variações salvas com sucesso.</p>
                </div>
              )}

              {/* Matriz editável */}
              {matriz && matriz.length > 0 && (
                <div className="space-y-3">
                  <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                          <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase text-slate-400">Tamanho</th>
                          <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase text-slate-400">Nome</th>
                          <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase text-slate-400">SKU</th>
                          <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase text-slate-400">Preço (R$)</th>
                          <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase text-slate-400">GTIN</th>
                          <th className="px-3 py-2" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {matriz.map((l, i) => {
                          const tamanho = l.atributos.find((a) => a.nome.toLowerCase() === 'tamanho')?.valor
                            ?? l.atributos[l.atributos.length - 1]?.valor
                            ?? '—'
                          return (
                            <tr key={l.key} className="bg-white dark:bg-slate-800">
                              <td className="px-3 py-2">
                                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                  {tamanho}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <input className={cellCls} value={l.nome} onChange={(e) => setLinha(i, 'nome', e.target.value)} />
                              </td>
                              <td className="px-3 py-2">
                                <input className={`${cellCls} font-mono`} value={l.sku} onChange={(e) => setLinha(i, 'sku', e.target.value)} />
                              </td>
                              <td className="px-3 py-2">
                                <input type="number" step="0.01" min="0" className={cellCls} value={l.precoVenda}
                                  onChange={(e) => setLinha(i, 'precoVenda', e.target.value)} placeholder="0,00" />
                              </td>
                              <td className="px-3 py-2">
                                <input className={`${cellCls} font-mono`} value={l.gtin} onChange={(e) => setLinha(i, 'gtin', e.target.value)} placeholder="Opcional" />
                              </td>
                              <td className="px-3 py-2 text-right">
                                <button type="button" onClick={() => removerLinha(i)}
                                  className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" title="Remover linha">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">{matriz.length} variação(ões) na matriz</p>
                    <button type="button" onClick={handleSalvar} disabled={salvarLote.isPending}
                      className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
                      {salvarLote.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Salvar variações
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
