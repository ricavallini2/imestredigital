'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Grid3x3,
  Loader2,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  ChevronDown,
  Palette,
} from 'lucide-react';
import { useGrades } from '@/hooks/useGrades';
import { useVariacoes, useSalvarVariacoesLote } from '@/hooks/useVariacoes';
import type { VariacaoLoteItem } from '@/types';
import { slugSku } from '@/lib/utils';

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-400';
const cellCls =
  'w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-400';

const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** Linha da matriz: uma combinação (cor × tamanho da grade). */
type LinhaVar = {
  key: string;
  cor: string;
  tamanho: string;
  sku: string;
  precoVenda: string;
  gtin: string;
};

/**
 * Variações por grade — fluxo "grade do produto".
 *
 * 1. O usuário escolhe a GRADE do produto (uma por produto: ex. Camiseta = P,M,G,GG).
 * 2. Ao adicionar uma variação (ex. Cor "Preta"), o sistema JÁ GERA as linhas da
 *    grade (Preta-P, Preta-M, ...) com SKU pré-preenchido (editável) e preço.
 * 3. A setinha ⌄ ao lado de um campo copia o valor para as linhas abaixo.
 * 4. Salvar grava tudo em lote (POST /v1/produtos/:id/variacoes/lote).
 */
export function WizardVariacaoGrade({
  produtoId,
  skuBase,
  precoBase,
}: {
  produtoId: string;
  skuBase?: string;
  precoBase?: number;
}) {
  const [gradeId, setGradeId] = useState('');
  const [atributo, setAtributo] = useState('Cor');
  const [novaCor, setNovaCor] = useState('');
  const [linhas, setLinhas] = useState<LinhaVar[]>([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const { data: gradesData, isLoading: loadingGrades } = useGrades({
    ativa: true,
    itensPorPagina: 200,
  });
  const gradesAtivas = useMemo(
    () => (gradesData?.dados ?? []).filter((g) => g.ativa && g.tamanhos.length > 0),
    [gradesData],
  );
  const gradeSelecionada = gradesAtivas.find((g) => g.id === gradeId);

  const { data: variacoesExistentes, isLoading: loadingVariacoes } = useVariacoes(produtoId);
  const salvarLote = useSalvarVariacoesLote(produtoId);

  const base = (skuBase ?? '').trim();

  // Cores (blocos) já geradas, na ordem em que foram adicionadas.
  const cores = useMemo(() => {
    const vistos: string[] = [];
    for (const l of linhas) if (!vistos.includes(l.cor)) vistos.push(l.cor);
    return vistos;
  }, [linhas]);

  const adicionarCor = () => {
    setErro('');
    setSucesso(false);
    const cor = novaCor.trim();
    if (!gradeSelecionada) return setErro('Selecione primeiro a grade do produto.');
    if (!atributo.trim()) return setErro('Informe o atributo (ex: Cor).');
    if (!cor) return setErro('Informe o valor (ex: Preta).');
    if (linhas.some((l) => l.cor.toLowerCase() === cor.toLowerCase()))
      return setErro(`"${cor}" já foi adicionada.`);

    const novas: LinhaVar[] = gradeSelecionada.tamanhos.map((t, i) => ({
      key: `${cor}-${t.valor}-${i}-${t.id ?? ''}`,
      cor,
      tamanho: t.valor,
      // SKU já vem preenchido: BASE-COR-TAMANHO (usuário altera se quiser).
      sku: [base, slugSku(cor), slugSku(t.valor)].filter(Boolean).join('-'),
      precoVenda: precoBase && precoBase > 0 ? String(precoBase) : '',
      gtin: '',
    }));
    setLinhas((prev) => [...prev, ...novas]);
    setNovaCor('');
  };

  const setCampo = (key: string, campo: keyof LinhaVar, valor: string) =>
    setLinhas((prev) => prev.map((l) => (l.key === key ? { ...l, [campo]: valor } : l)));

  const removerCor = (cor: string) => setLinhas((prev) => prev.filter((l) => l.cor !== cor));

  // Copia o valor de um campo para todas as linhas ABAIXO (na ordem da matriz).
  const preencherAbaixo = (key: string, campo: 'precoVenda' | 'gtin') =>
    setLinhas((prev) => {
      const idx = prev.findIndex((l) => l.key === key);
      if (idx < 0) return prev;
      const valor = prev[idx][campo];
      return prev.map((l, j) => (j > idx ? { ...l, [campo]: valor } : l));
    });

  const handleSalvar = async () => {
    setErro('');
    if (linhas.length === 0) return setErro('Adicione ao menos uma variação.');
    if (linhas.some((l) => !l.sku.trim())) return setErro('Toda variação precisa de um SKU.');
    const skus = linhas.map((l) => l.sku.trim().toUpperCase());
    if (new Set(skus).size !== skus.length) return setErro('Há SKUs duplicados — ajuste-os.');

    const variacoes: VariacaoLoteItem[] = linhas.map((l) => ({
      sku: l.sku.trim(),
      nome: `${l.cor} ${l.tamanho}`.trim(),
      precoVenda: l.precoVenda !== '' ? Number(l.precoVenda) : undefined,
      gtin: l.gtin.trim() || undefined,
      atributos: [
        { nome: atributo.trim(), valor: l.cor },
        { nome: 'Tamanho', valor: l.tamanho },
      ],
    }));

    try {
      await salvarLote.mutateAsync({ variacoes });
      setSucesso(true);
      setLinhas([]);
      setNovaCor('');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string | string[] } } })?.response?.data
        ?.message;
      setErro(Array.isArray(msg) ? msg[0] : (msg ?? 'Erro ao salvar as variações.'));
    }
  };

  // Índice global (na matriz achatada) da 1ª linha de cada cor — usado pelo fill-down.
  const indicePorKey = useMemo(() => {
    const m = new Map<string, number>();
    linhas.forEach((l, i) => m.set(l.key, i));
    return m;
  }, [linhas]);

  return (
    <div className="mt-6 rounded-xl border border-marca-200 bg-gradient-to-br from-marca-50/60 to-white p-5 dark:border-marca-800 dark:from-marca-900/10 dark:to-slate-800">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-marca-500 to-marca-600 shadow-sm">
          <Grid3x3 className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Variações por grade
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Escolha a grade do produto e adicione as variações — a grade é gerada automaticamente.
          </p>
        </div>
      </div>

      {/* Variações já cadastradas */}
      {!loadingVariacoes && (variacoesExistentes?.length ?? 0) > 0 && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {variacoesExistentes!.length} variação(ões) já cadastrada(s)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {variacoesExistentes!.map((v) => (
              <span
                key={v.id}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              >
                <span className="font-medium">{v.nome}</span>
                <span className="font-mono text-slate-400">{v.sku}</span>
                {v.precoVenda != null && (
                  <span className="text-marca-600 dark:text-marca-400">{moeda(v.precoVenda)}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {gradesAtivas.length === 0 && !loadingGrades ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/20">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-amber-700 dark:text-amber-400">
            Nenhuma grade ativa com tamanhos.{' '}
            <Link href="/dashboard/produtos/grades" className="font-semibold underline">
              Cadastre uma grade
            </Link>{' '}
            (ex: Camiseta = P, M, G, GG) para gerar variações.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Passo 1: grade do produto + atributo */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Grade do produto
              </label>
              <select
                className={inputCls}
                value={gradeId}
                onChange={(e) => setGradeId(e.target.value)}
                disabled={loadingGrades}
              >
                <option value="">{loadingGrades ? 'Carregando...' : 'Selecione a grade...'}</option>
                {gradesAtivas.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nome} ({g.tamanhos.map((t) => t.valor).join(', ')})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Atributo da variação
              </label>
              <input
                className={inputCls}
                value={atributo}
                onChange={(e) => setAtributo(e.target.value)}
                placeholder="Cor"
              />
            </div>
          </div>

          {gradeSelecionada && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Tamanhos da grade:</span>
              {gradeSelecionada.tamanhos.map((t) => (
                <span
                  key={t.id || t.valor}
                  className="rounded bg-marca-100 px-1.5 py-0.5 font-mono font-medium text-marca-700 dark:bg-marca-900/40 dark:text-marca-300"
                >
                  {t.valor}
                </span>
              ))}
            </div>
          )}

          {/* Passo 2: adicionar variação (cor) → gera a grade */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Adicionar {atributo.trim() || 'variação'} (ex: Preta)
              </label>
              <div className="relative">
                <Palette className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className={`${inputCls} pl-8`}
                  value={novaCor}
                  onChange={(e) => setNovaCor(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarCor())}
                  placeholder="Ex: Preta"
                  disabled={!gradeSelecionada}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={adicionarCor}
              disabled={!gradeSelecionada}
              className="flex items-center gap-1.5 rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
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

          {/* Matriz gerada, agrupada por cor */}
          {cores.length > 0 && (
            <div className="space-y-3">
              {cores.map((cor) => {
                const doGrupo = linhas.filter((l) => l.cor === cor);
                return (
                  <div
                    key={cor}
                    className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between bg-slate-50 px-3 py-2 dark:bg-slate-700/50">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <span className="inline-flex h-5 items-center rounded bg-marca-100 px-2 text-xs font-bold text-marca-700 dark:bg-marca-900/40 dark:text-marca-300">
                          {atributo.trim() || 'Variação'}
                        </span>
                        {cor}
                        <span className="text-xs font-normal text-slate-400">
                          · {doGrupo.length} tamanhos
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removerCor(cor)}
                        className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title={`Remover ${cor}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[10px] font-semibold uppercase text-slate-400">
                          <th className="px-3 py-1.5">Tamanho</th>
                          <th className="px-3 py-1.5">SKU</th>
                          <th className="px-3 py-1.5">Preço (R$)</th>
                          <th className="px-3 py-1.5">GTIN</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {doGrupo.map((l) => {
                          const gi = indicePorKey.get(l.key) ?? 0;
                          const temAbaixo = gi < linhas.length - 1;
                          return (
                            <tr key={l.key} className="bg-white dark:bg-slate-800">
                              <td className="px-3 py-1.5">
                                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                  {l.tamanho}
                                </span>
                              </td>
                              <td className="px-3 py-1.5">
                                <input
                                  className={`${cellCls} font-mono`}
                                  value={l.sku}
                                  onChange={(e) => setCampo(l.key, 'sku', e.target.value)}
                                />
                              </td>
                              <td className="px-3 py-1.5">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={cellCls}
                                    value={l.precoVenda}
                                    onChange={(e) => setCampo(l.key, 'precoVenda', e.target.value)}
                                    placeholder="0,00"
                                  />
                                  {temAbaixo && (
                                    <button
                                      type="button"
                                      onClick={() => preencherAbaixo(l.key, 'precoVenda')}
                                      className="shrink-0 rounded p-1 text-slate-400 hover:bg-marca-50 hover:text-marca-600 dark:hover:bg-marca-900/20"
                                      title="Repetir este preço para as linhas abaixo"
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-1.5">
                                <div className="flex items-center gap-1">
                                  <input
                                    className={`${cellCls} font-mono`}
                                    value={l.gtin}
                                    onChange={(e) => setCampo(l.key, 'gtin', e.target.value)}
                                    placeholder="Opcional"
                                  />
                                  {temAbaixo && (
                                    <button
                                      type="button"
                                      onClick={() => preencherAbaixo(l.key, 'gtin')}
                                      className="shrink-0 rounded p-1 text-slate-400 hover:bg-marca-50 hover:text-marca-600 dark:hover:bg-marca-900/20"
                                      title="Repetir este GTIN para as linhas abaixo"
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  {linhas.length} variação(ões) em {cores.length}{' '}
                  {atributo.trim().toLowerCase() || 'variação'}(es)
                </p>
                <button
                  type="button"
                  onClick={handleSalvar}
                  disabled={salvarLote.isPending}
                  className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {salvarLote.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Salvar variações
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
