'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Save, Package, DollarSign, BarChart2, Brain,
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown, RefreshCw,
  Loader2, Edit, Tag, Zap, ChevronRight, AlertCircle,
  ShoppingCart, Percent, Box, Star, Plus, Trash2,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { KPICard } from '@/components/ui/kpi-card';
import { useProduto, useAtualizarProduto, useAnaliseIAProduto } from '@/hooks/useProdutos';
import { useQueryClient } from '@tanstack/react-query';

const moeda = (v: number) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00';
const fmt = (v: any) => v ?? '—';
const TIPOS_VARIACAO = ['Única', 'Cor', 'Tamanho', 'Capacidade', 'Versão', 'Material', 'Voltagem'];
type VarRow = { id: string; tipo: string; valor: string; sku: string; precoCusto: string; preco: string; estoque: string };

const STATUS_OPTS = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'INATIVO', label: 'Inativo' },
  { value: 'RASCUNHO', label: 'Rascunho' },
];

const CATEGORIAS = ['Eletrônicos', 'Informática', 'Calçados', 'Vestuário', 'Acessórios', 'Casa & Jardim', 'Esporte', 'Alimentação', 'Outros'];

// ── Gauge Ring ──────────────────────────────────────────────────────────────
function GaugeRing({ value, max = 100, color, size = 56 }: { value: number; max?: number; color: string; size?: number }) {
  const pct = Math.min(1, value / max);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={6} className="text-slate-200 dark:text-slate-700" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" />
    </svg>
  );
}

// ── Painel IA ───────────────────────────────────────────────────────────────
function PainelIA({ produtoId }: { produtoId: string }) {
  const { data: analise, isLoading, isError, refetch, isFetching } = useAnaliseIAProduto(produtoId);
  const queryClient = useQueryClient();

  if (isLoading || isFetching) return (
    <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 dark:border-purple-800 dark:from-purple-950/20 dark:to-indigo-950/20">
      <div className="flex items-center gap-3">
        <Brain className="h-5 w-5 animate-pulse text-purple-500" />
        <span className="font-semibold text-purple-700 dark:text-purple-400">iMestreAI analisando produto...</span>
      </div>
    </div>
  );
  if (isError || !analise) return null;

  const scoreColor = analise.scoreGeral >= 70 ? '#22c55e' : analise.scoreGeral >= 40 ? '#f59e0b' : '#ef4444';
  const estoqueOk = analise.metricas.estoqueStatus === 'NORMAL';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 dark:border-purple-800 dark:from-purple-950/20 dark:to-indigo-950/20">
        {/* Header IA */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-purple-900 dark:text-purple-200">Análise iMestreAI</h3>
              <p className="text-xs text-purple-600 dark:text-purple-400">{new Date(analise.geradoEm).toLocaleString('pt-BR')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              {analise.perfil}
            </span>
            <button onClick={() => { queryClient.removeQueries({ queryKey: ['produto', produtoId, 'analise-ia'] }); refetch(); }}
              className="flex items-center gap-1 rounded-lg border border-purple-300 px-2.5 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20">
              <RefreshCw className="h-3 w-3" /> Regerar
            </button>
          </div>
        </div>

        {/* Alerta */}
        {analise.alerta && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{analise.alerta}</p>
          </div>
        )}

        {/* Score + Métricas */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-slate-800/40">
            <div className="relative">
              <GaugeRing value={analise.scoreGeral} color={scoreColor} size={56} />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: scoreColor }}>
                {analise.scoreGeral}
              </span>
            </div>
            <p className="text-center text-xs font-medium text-slate-600 dark:text-slate-400">Score Geral</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-slate-800/40">
            <div className="relative">
              <GaugeRing value={Math.min(100, analise.metricas.margemLiquida)} color="#8b5cf6" size={56} />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-600">
                {analise.metricas.margemLiquida.toFixed(0)}%
              </span>
            </div>
            <p className="text-center text-xs font-medium text-slate-600 dark:text-slate-400">Margem</p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-slate-800/40">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${estoqueOk ? 'bg-green-100' : 'bg-red-100'}`}>
              <Box className={`h-7 w-7 ${estoqueOk ? 'text-green-600' : 'text-red-500'}`} />
            </div>
            <p className="text-center text-xs font-medium text-slate-600 dark:text-slate-400">
              {analise.metricas.estoqueStatus.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Métricas detalhadas */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: 'Receita Mensal', valor: moeda(analise.metricas.receitaMensal) },
            { label: 'Ticket Médio', valor: moeda(analise.metricas.ticketMedio) },
            { label: 'Giro Estoque', valor: `${analise.metricas.giroEstoque}x/mês` },
            { label: 'Preço IA Sugerido', valor: moeda(analise.precoSugeridoIA), destaque: true },
            { label: 'NCM Sugerido', valor: analise.ncmSugerido },
            { label: 'Dias Sem Venda', valor: analise.metricas.diasSemVenda === '0' ? 'Vendendo' : `>${analise.metricas.diasSemVenda}d` },
          ].map(({ label, valor, destaque }) => (
            <div key={label} className={`rounded-lg p-3 ${destaque ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-white/60 dark:bg-slate-800/40'}`}>
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              <p className={`mt-0.5 text-sm font-bold ${destaque ? 'text-purple-700 dark:text-purple-300' : 'text-slate-900 dark:text-slate-100'}`}>
                {valor}
              </p>
            </div>
          ))}
        </div>

        {/* Recomendações */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold text-purple-800 dark:text-purple-300">Ações Recomendadas</span>
          </div>
          <ul className="space-y-2">
            {analise.recomendacoes.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg bg-white/60 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Página Principal ─────────────────────────────────────────────────────────
type TabType = 'detalhes' | 'precos' | 'estoque' | 'fiscal' | 'ia';

export default function ProdutoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const produtoId = params.id as string;

  const { data: produto, isLoading, isError } = useProduto(produtoId);
  const atualizar = useAtualizarProduto();

  const [tabAtiva, setTabAtiva] = useState<TabType>('detalhes');
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [variacoes, setVariacoes] = useState<VarRow[]>([]);

  const p = produto as any;

  useEffect(() => {
    if (!p) return;
    setForm({
      nome: p.nome ?? '', descricao: p.descricao ?? '', descricaoCurta: p.descricaoCurta ?? '',
      sku: p.sku ?? '', ean: p.ean ?? '', marca: p.marca ?? '', categoria: p.categoria ?? '',
      status: p.status ?? 'ATIVO', tags: (p.tags ?? []).join(', '),
      precoPromocional: p.precoPromocional ?? '',
      peso: p.peso ?? 0, altura: p.altura ?? 0, largura: p.largura ?? 0, comprimento: p.comprimento ?? 0,
      ncm: p.ncm ?? '', cfop: p.cfop ?? '',
      estoqueMinimo: p.estoqueMinimo ?? 0,
      metaDescricao: p.metaDescricao ?? '', metaPalavrasChave: p.metaPalavrasChave ?? '',
    });
    const vars = (p.variacoes ?? []) as any[];
    if (vars.length > 0) {
      setVariacoes(vars.map((v: any) => ({
        id: v.id ?? String(Math.random()),
        tipo: v.tipo ?? 'Única',
        valor: v.valor ?? 'Única',
        sku: v.sku ?? '',
        precoCusto: v.precoCusto != null ? String(v.precoCusto) : '',
        preco: v.preco != null ? String(v.preco) : '',
        estoque: String(v.estoque ?? 0),
      })));
    } else {
      setVariacoes([{ id: '1', tipo: 'Única', valor: 'Única', sku: p.sku ?? '', precoCusto: String(p.precoCusto ?? ''), preco: String(p.preco ?? ''), estoque: String(p.estoque ?? 0) }]);
    }
  }, [produto]);

  const set = (k: string, v: any) => setForm((prev) => ({ ...prev, [k]: v }));
  const setVar = (i: number, k: keyof VarRow, v: string) =>
    setVariacoes(prev => prev.map((x, j) => j === i ? { ...x, [k]: v } : x));

  const isUnica = variacoes.length === 1 && variacoes[0]?.tipo === 'Única';
  const primeiraComPreco = variacoes.find(v => Number(v.preco) > 0 && Number(v.precoCusto) > 0);
  const margem = primeiraComPreco
    ? ((Number(primeiraComPreco.preco) - Number(primeiraComPreco.precoCusto)) / Number(primeiraComPreco.precoCusto) * 100).toFixed(1)
    : (p?.margemLucro ?? 0).toFixed(1);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const variacoesDTO = variacoes.map(v => ({
        id: v.id,
        tipo: v.tipo, valor: v.valor,
        sku: v.sku || undefined,
        precoCusto: v.precoCusto ? Number(v.precoCusto) : undefined,
        preco: v.preco ? Number(v.preco) : undefined,
        estoque: Number(v.estoque) || 0,
      }));
      await atualizar.mutateAsync({ id: produtoId, dto: {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        precoPromocional: form.precoPromocional ? Number(form.precoPromocional) : undefined,
        variacoes: variacoesDTO,
      }});
      setEditando(false);
    } finally { setSalvando(false); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-marca-500" /></div>;
  if (isError || !p) return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950/20">
      <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
      <h2 className="text-lg font-semibold">Produto não encontrado</h2>
      <Link href="/dashboard/produtos" className="mt-4 inline-block rounded-lg bg-marca-500 px-4 py-2 text-white">Voltar</Link>
    </div>
  );

  const TABS: { id: TabType; label: string }[] = [
    { id: 'detalhes', label: 'Detalhes' },
    { id: 'precos', label: 'Preços & Margem' },
    { id: 'estoque', label: 'Estoque' },
    { id: 'fiscal', label: 'Fiscal' },
    { id: 'ia', label: '✦ IA' },
  ];

  const Field = ({ label, children, col2 = false }: { label: string; children: React.ReactNode; col2?: boolean }) => (
    <div className={col2 ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
      {children}
    </div>
  );

  const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-400';
  const textCls = 'text-sm font-medium text-slate-900 dark:text-slate-100';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/produtos"
            className="flex items-center justify-center rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{p.nome}</h1>
              <StatusBadge status={p.status} label={{ ATIVO: 'Ativo', INATIVO: 'Inativo', RASCUNHO: 'Rascunho' }[p.status] ?? p.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500 font-mono">{p.sku} · {p.marca} · {p.categoria}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {editando ? (
            <>
              <button onClick={() => setEditando(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700">
                Cancelar
              </button>
              <button onClick={handleSalvar} disabled={salvando}
                className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-60">
                {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  const v = p.variacoes?.[0];
                  const item = {
                    id: `${p.id}-${v?.sku ?? p.sku}-${Date.now()}`,
                    produtoId: p.id, nome: p.nome,
                    sku: v?.sku ?? p.sku, ean: p.ean,
                    preco: v?.preco ?? p.preco, precoPromocional: p.precoPromocional,
                    categoria: p.categoria, marca: p.marca,
                    variacao: v?.tipo !== 'Única' ? v?.valor : undefined,
                    variacaoTipo: v?.tipo !== 'Única' ? v?.tipo : undefined,
                    quantidade: 1,
                  };
                  try {
                    const existing = JSON.parse(sessionStorage.getItem('etiqueta-items') ?? '[]');
                    sessionStorage.setItem('etiqueta-items', JSON.stringify([...existing, item]));
                  } catch { /* ignore */ }
                  router.push('/dashboard/produtos/etiquetas');
                }}
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-amber-900/20 transition-colors"
                title="Gerar etiqueta deste produto">
                <Tag className="h-4 w-4" /> Etiqueta
              </button>
              <button onClick={() => setEditando(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                <Edit className="h-4 w-4" /> Editar
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KPICard label="Preço de Venda" valor={(() => { const precos = (p.variacoes ?? []).map((v: any) => v.preco).filter(Boolean); return precos.length > 1 && Math.min(...precos) !== Math.max(...precos) ? `${moeda(Math.min(...precos))} – ${moeda(Math.max(...precos))}` : moeda(p.preco); })()} icone={<DollarSign className="h-5 w-5" />} destaque />
        <KPICard label="Margem de Lucro" valor={`${p.margemLucro?.toFixed(1)}%`} icone={<Percent className="h-5 w-5" />} />
        <KPICard label="Em Estoque" valor={`${p.estoque} un`} icone={<Box className="h-5 w-5" />} />
        <KPICard label="Vendas (30d)" valor={p.vendasUltimos30Dias ?? 0} icone={<ShoppingCart className="h-5 w-5" />} />
      </div>

      {/* Tags */}
      {(p.tags ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(p.tags ?? []).map((tag: string) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
              <Tag className="h-3 w-3" />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Abas */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-1 overflow-x-auto px-1">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setTabAtiva(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tabAtiva === tab.id
                  ? 'border-marca-500 text-marca-600 dark:text-marca-400'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              } ${tab.id === 'ia' ? 'text-purple-600 dark:text-purple-400' : ''}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Detalhes ── */}
      {tabAtiva === 'detalhes' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">Informações do Produto</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome" col2>
              {editando ? <input className={inputCls} value={form.nome} onChange={e => set('nome', e.target.value)} />
                : <p className={textCls}>{fmt(p.nome)}</p>}
            </Field>
            <Field label="Descrição Curta" col2>
              {editando ? <input className={inputCls} value={form.descricaoCurta} onChange={e => set('descricaoCurta', e.target.value)} />
                : <p className={textCls}>{fmt(p.descricaoCurta)}</p>}
            </Field>
            <Field label="Descrição Completa" col2>
              {editando ? <textarea className={inputCls} rows={3} value={form.descricao} onChange={e => set('descricao', e.target.value)} />
                : <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{fmt(p.descricao)}</p>}
            </Field>
            <Field label="SKU">
              {editando ? <input className={inputCls} value={form.sku} onChange={e => set('sku', e.target.value)} />
                : <p className={`${textCls} font-mono`}>{fmt(p.sku)}</p>}
            </Field>
            <Field label="EAN/GTIN">
              {editando ? <input className={inputCls} value={form.ean} onChange={e => set('ean', e.target.value)} />
                : <p className={`${textCls} font-mono`}>{fmt(p.ean)}</p>}
            </Field>
            <Field label="Marca">
              {editando ? <input className={inputCls} value={form.marca} onChange={e => set('marca', e.target.value)} />
                : <p className={textCls}>{fmt(p.marca)}</p>}
            </Field>
            <Field label="Categoria">
              {editando
                ? <select className={inputCls} value={form.categoria} onChange={e => set('categoria', e.target.value)}>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                : <p className={textCls}>{fmt(p.categoria)}</p>}
            </Field>
            <Field label="Status">
              {editando
                ? <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                    {STATUS_OPTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                : <StatusBadge status={p.status} label={{ ATIVO: 'Ativo', INATIVO: 'Inativo', RASCUNHO: 'Rascunho' }[p.status] ?? p.status} />}
            </Field>
            <Field label="Tags" col2>
              {editando ? <input className={inputCls} placeholder="ex: premium, 5g, novo" value={form.tags} onChange={e => set('tags', e.target.value)} />
                : <div className="flex flex-wrap gap-1">{(p.tags ?? []).map((t: string) => <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-700">{t}</span>)}</div>}
            </Field>
            <Field label="Peso (g)">
              {editando ? <input className={inputCls} type="number" value={form.peso} onChange={e => set('peso', Number(e.target.value))} />
                : <p className={textCls}>{fmt(p.peso)}g</p>}
            </Field>
            <Field label="Dimensões (cm)">
              {editando
                ? <div className="grid grid-cols-3 gap-2">
                    <input className={inputCls} type="number" placeholder="A" value={form.altura} onChange={e => set('altura', Number(e.target.value))} />
                    <input className={inputCls} type="number" placeholder="L" value={form.largura} onChange={e => set('largura', Number(e.target.value))} />
                    <input className={inputCls} type="number" placeholder="P" value={form.comprimento} onChange={e => set('comprimento', Number(e.target.value))} />
                  </div>
                : <p className={textCls}>{p.altura}×{p.largura}×{p.comprimento} cm</p>}
            </Field>
          </div>

          {/* Variações e Preços */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Variações e Preços</h3>
              {editando && (
                <button type="button"
                  onClick={() => setVariacoes(prev => [
                    ...prev.map(v => v.tipo === 'Única' && v.valor === 'Única' ? { ...v, tipo: 'Cor', valor: '' } : v),
                    { id: String(Date.now()), tipo: 'Cor', valor: '', sku: '', precoCusto: '', preco: '', estoque: '0' },
                  ])}
                  className="flex items-center gap-1 text-xs text-marca-600 hover:underline dark:text-marca-400">
                  <Plus className="h-3 w-3" /> Adicionar
                </button>
              )}
            </div>

            {editando ? (
              <div className="space-y-2">
                {/* Header */}
                <div className="grid gap-2 items-center" style={{ gridTemplateColumns: isUnica ? '1.2fr 1.2fr 1fr auto' : '1fr 1.5fr 1.2fr 1.2fr 1fr auto' }}>
                  {!isUnica && <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Tipo</span>}
                  {!isUnica && <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Valor</span>}
                  <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Custo (R$)</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Venda (R$)</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Estoque</span>
                  <span />
                </div>
                {variacoes.map((v, i) => (
                  <div key={v.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: isUnica ? '1.2fr 1.2fr 1fr auto' : '1fr 1.5fr 1.2fr 1.2fr 1fr auto' }}>
                    {!isUnica && (
                      <select value={v.tipo} onChange={e => setVar(i, 'tipo', e.target.value)} className={inputCls}>
                        {TIPOS_VARIACAO.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    )}
                    {!isUnica && (
                      <input className={inputCls} placeholder="Ex: Preto, P, 64GB"
                        value={v.valor} onChange={e => setVar(i, 'valor', e.target.value)} />
                    )}
                    <input type="number" step="0.01" min="0" placeholder="0,00" className={inputCls}
                      value={v.precoCusto} onChange={e => setVar(i, 'precoCusto', e.target.value)} />
                    <input type="number" step="0.01" min="0" placeholder="0,00" className={inputCls}
                      value={v.preco} onChange={e => setVar(i, 'preco', e.target.value)} />
                    <input type="number" min="0" placeholder="0" className={inputCls}
                      value={v.estoque} onChange={e => setVar(i, 'estoque', e.target.value)} />
                    <button
                      onClick={() => variacoes.length > 1
                        ? setVariacoes(prev => prev.filter((_, j) => j !== i))
                        : setVariacoes([{ id: '1', tipo: 'Única', valor: 'Única', sku: p.sku ?? '', precoCusto: '', preco: '', estoque: '0' }])
                      }
                      className="rounded p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      {!isUnica && <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Variação</th>}
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">SKU</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">Custo</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">Venda</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">Margem</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">Estoque</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {variacoes.map((v) => {
                      const preco = Number(v.preco);
                      const custo = Number(v.precoCusto);
                      const mg = custo > 0 && preco > 0 ? ((preco - custo) / custo * 100).toFixed(1) : null;
                      return (
                        <tr key={v.id} className="bg-white dark:bg-slate-800">
                          {!isUnica && <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{v.tipo}: {v.valor}</td>}
                          <td className="px-3 py-2 font-mono text-xs text-slate-500">{v.sku || '—'}</td>
                          <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{custo > 0 ? moeda(custo) : '—'}</td>
                          <td className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">{preco > 0 ? moeda(preco) : '—'}</td>
                          <td className="px-3 py-2 text-right">
                            {mg !== null ? (
                              <span className={`font-bold ${Number(mg) >= 40 ? 'text-green-600' : Number(mg) >= 20 ? 'text-amber-600' : 'text-red-600'}`}>
                                {mg}%
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">{v.estoque} un</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Preços & Margem ── */}
      {tabAtiva === 'precos' && (
        <div className="space-y-6">
          {/* Tabela de variações com preços */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Preços por Variação</h2>
              {editando && (
                <button type="button"
                  onClick={() => setVariacoes(prev => [
                    ...prev.map(v => v.tipo === 'Única' && v.valor === 'Única' ? { ...v, tipo: 'Cor', valor: '' } : v),
                    { id: String(Date.now()), tipo: 'Cor', valor: '', sku: '', precoCusto: '', preco: '', estoque: '0' },
                  ])}
                  className="flex items-center gap-1 text-xs text-marca-600 hover:underline dark:text-marca-400">
                  <Plus className="h-3 w-3" /> Adicionar variação
                </button>
              )}
            </div>

            {editando ? (
              <div className="space-y-2">
                <div className="grid gap-2 items-center mb-1" style={{ gridTemplateColumns: isUnica ? '1.2fr 1.2fr 1fr auto' : '1fr 1.5fr 1.2fr 1.2fr 1fr auto' }}>
                  {!isUnica && <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Tipo</span>}
                  {!isUnica && <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Valor</span>}
                  <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Custo (R$)</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Venda (R$)</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">Estoque</span>
                  <span />
                </div>
                {variacoes.map((v, i) => (
                  <div key={v.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: isUnica ? '1.2fr 1.2fr 1fr auto' : '1fr 1.5fr 1.2fr 1.2fr 1fr auto' }}>
                    {!isUnica && (
                      <select value={v.tipo} onChange={e => setVar(i, 'tipo', e.target.value)} className={inputCls}>
                        {TIPOS_VARIACAO.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    )}
                    {!isUnica && (
                      <input className={inputCls} placeholder="Ex: Preto, P, 64GB"
                        value={v.valor} onChange={e => setVar(i, 'valor', e.target.value)} />
                    )}
                    <input type="number" step="0.01" min="0" placeholder="0,00" className={inputCls}
                      value={v.precoCusto} onChange={e => setVar(i, 'precoCusto', e.target.value)} />
                    <input type="number" step="0.01" min="0" placeholder="0,00" className={inputCls}
                      value={v.preco} onChange={e => setVar(i, 'preco', e.target.value)} />
                    <input type="number" min="0" placeholder="0" className={inputCls}
                      value={v.estoque} onChange={e => setVar(i, 'estoque', e.target.value)} />
                    <button
                      onClick={() => variacoes.length > 1
                        ? setVariacoes(prev => prev.filter((_, j) => j !== i))
                        : setVariacoes([{ id: '1', tipo: 'Única', valor: 'Única', sku: p.sku ?? '', precoCusto: '', preco: '', estoque: '0' }])
                      }
                      className="rounded p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      {!isUnica && <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Variação</th>}
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">Custo</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">Venda</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">Margem</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">Lucro/un</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {variacoes.map((v) => {
                      const preco = Number(v.preco);
                      const custo = Number(v.precoCusto);
                      const mg = custo > 0 && preco > 0 ? ((preco - custo) / custo * 100).toFixed(1) : null;
                      return (
                        <tr key={v.id} className="bg-white dark:bg-slate-800">
                          {!isUnica && <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{v.tipo}: {v.valor}</td>}
                          <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">{custo > 0 ? moeda(custo) : '—'}</td>
                          <td className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">{preco > 0 ? moeda(preco) : '—'}</td>
                          <td className="px-3 py-2 text-right">
                            {mg !== null ? (
                              <span className={`font-bold ${Number(mg) >= 40 ? 'text-green-600' : Number(mg) >= 20 ? 'text-amber-600' : 'text-red-600'}`}>
                                {mg}%
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">
                            {preco > 0 && custo > 0 ? moeda(preco - custo) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Análise de Margem */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-base font-semibold">Análise de Margem</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {isUnica ? 'Margem de Lucro' : 'Margem (1ª variação)'}
                  </span>
                  <span className={`text-2xl font-bold ${Number(margem) >= 50 ? 'text-green-600' : Number(margem) >= 30 ? 'text-amber-600' : 'text-red-600'}`}>
                    {margem}%
                  </span>
                </div>
                {primeiraComPreco && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Lucro por unidade</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {moeda(Number(primeiraComPreco.preco) - Number(primeiraComPreco.precoCusto))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Receita (30d)</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {moeda((p.vendasUltimos30Dias ?? 0) * Number(primeiraComPreco.preco))}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Receita total acumulada</span>
                  <span className="font-semibold text-marca-600 dark:text-marca-400">
                    {moeda(p.receitaTotal ?? 0)}
                  </span>
                </div>
                <div className="mt-3 rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950/20">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">Sugestão IA</span>
                  </div>
                  <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
                    Veja a aba <strong>✦ IA</strong> para sugestão de preço baseada em desempenho e margem ideal.
                  </p>
                </div>
              </div>
            </div>

            {/* Preço Promocional e Estoque Mínimo */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-base font-semibold">Configurações</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Preço Promocional (R$)</label>
                  {editando
                    ? <input className={inputCls} type="number" step="0.01" value={form.precoPromocional} onChange={e => set('precoPromocional', e.target.value)} placeholder="Opcional" />
                    : <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{form.precoPromocional ? moeda(Number(form.precoPromocional)) : '—'}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Estoque Mínimo</label>
                  {editando
                    ? <input className={`${inputCls} max-w-xs`} type="number" min="0" value={form.estoqueMinimo} onChange={e => set('estoqueMinimo', Number(e.target.value))} />
                    : <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{form.estoqueMinimo} unidades</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Estoque ── */}
      {tabAtiva === 'estoque' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-base font-semibold">Controle de Estoque</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Estoque Atual', valor: `${p.estoque} unidades`, color: p.estoque === 0 ? 'text-red-600' : p.estoque <= p.estoqueMinimo ? 'text-amber-600' : 'text-green-600' },
              { label: 'Estoque Mínimo', valor: `${p.estoqueMinimo} unidades`, color: 'text-slate-900 dark:text-slate-100' },
              { label: 'Vendas (30d)', valor: `${p.vendasUltimos30Dias} un`, color: 'text-slate-900 dark:text-slate-100' },
              { label: 'Total Vendido', valor: `${p.vendasTotal} un`, color: 'text-marca-600' },
            ].map(({ label, valor, color }) => (
              <div key={label} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50">
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`mt-1 text-xl font-bold ${color}`}>{valor}</p>
              </div>
            ))}
          </div>
          {p.estoque <= p.estoqueMinimo && (
            <div className={`mt-4 flex items-start gap-3 rounded-lg border p-4 ${
              p.estoque === 0
                ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20'
            }`}>
              <AlertTriangle className={`mt-0.5 h-5 w-5 shrink-0 ${p.estoque === 0 ? 'text-red-500' : 'text-amber-500'}`} />
              <div>
                <p className={`font-semibold text-sm ${p.estoque === 0 ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {p.estoque === 0 ? 'Estoque zerado!' : 'Estoque abaixo do mínimo!'}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Reposição recomendada. Estoque mínimo: {p.estoqueMinimo} unidades.
                </p>
              </div>
            </div>
          )}
          {editando && (
            <p className="mt-4 text-xs text-slate-400">Para ajustar o estoque mínimo, acesse a aba <strong>Preços & Margem</strong>.</p>
          )}
        </div>
      )}

      {/* ── Fiscal ── */}
      {tabAtiva === 'fiscal' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-base font-semibold">Dados Fiscais</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="NCM (Nomenclatura Comum do Mercosul)">
              {editando ? <input className={inputCls} placeholder="00000000" value={form.ncm} onChange={e => set('ncm', e.target.value)} maxLength={8} />
                : <p className={`${textCls} font-mono`}>{fmt(p.ncm)}</p>}
            </Field>
            <Field label="CFOP (Código Fiscal de Operação)">
              {editando ? <input className={inputCls} placeholder="5102" value={form.cfop} onChange={e => set('cfop', e.target.value)} maxLength={4} />
                : <p className={`${textCls} font-mono`}>{fmt(p.cfop)}</p>}
            </Field>
            <Field label="Origem">
              {editando
                ? <select className={inputCls} value={form.origem} onChange={e => set('origem', Number(e.target.value))}>
                    <option value={0}>0 - Nacional</option>
                    <option value={1}>1 - Estrangeiro (importação direta)</option>
                    <option value={2}>2 - Estrangeiro (adquirido no mercado interno)</option>
                  </select>
                : <p className={textCls}>{p.origem === 0 ? '0 - Nacional' : `${p.origem} - Estrangeiro`}</p>}
            </Field>
            <Field label="EAN/GTIN">
              {editando ? <input className={inputCls} value={form.ean} onChange={e => set('ean', e.target.value)} />
                : <p className={`${textCls} font-mono`}>{fmt(p.ean)}</p>}
            </Field>
          </div>
          <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/20">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">Sugestão Automática de NCM</span>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Acesse a aba <strong>✦ IA</strong> para obter sugestão de NCM baseada na descrição e categoria do produto.
            </p>
          </div>
        </div>
      )}

      {/* ── IA ── */}
      {tabAtiva === 'ia' && <PainelIA produtoId={produtoId} />}
    </div>
  );
}
