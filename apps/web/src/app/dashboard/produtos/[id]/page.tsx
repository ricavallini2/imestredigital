'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Package,
  DollarSign,
  BarChart2,
  Brain,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  Edit,
  Tag,
  Zap,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  ShoppingCart,
  Percent,
  Box,
  Star,
  Plus,
  Trash2,
  Images,
  FileText,
  Sparkles,
  Receipt,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { KPICard } from '@/components/ui/kpi-card';
import { GaleriaImagens } from '@/components/ui/galeria-imagens';
import { useProduto, useAtualizarProduto, useAnaliseIAProduto } from '@/hooks/useProdutos';
import { useSaldoPorProduto } from '@/hooks/useEstoque';
import { useCategorias } from '@/hooks/useCategorias';
import { useMarcas } from '@/hooks/useMarcas';
import { useQueryClient } from '@tanstack/react-query';
import { WizardVariacaoGrade } from './wizard-variacao-grade';

const moeda = (v: number) =>
  (Number.isFinite(v) ? v : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmt = (v: any) => (v === null || v === undefined || v === '' ? '—' : v);

// ── Margem × Markup ───────────────────────────────────────────────────────────
// Duas medidas distintas que o lojista usa; rotuladas para nunca se confundirem.
// Margem = fração do PREÇO DE VENDA que sobra (consistente com o KPI do topo).
const margemSobreVenda = (venda: number, custo: number) =>
  venda > 0 ? ((venda - custo) / venda) * 100 : 0;
// Markup = quanto o custo é multiplicado até o preço de venda.
const markupSobreCusto = (venda: number, custo: number) =>
  custo > 0 ? ((venda - custo) / custo) * 100 : 0;
// Cor semântica por faixa de margem (verde saudável · âmbar apertada · vermelho baixa).
const corMargem = (m: number) =>
  m >= 40 ? 'text-green-600' : m >= 20 ? 'text-amber-600' : 'text-red-600';
const corMargemBg = (m: number) =>
  m >= 40
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : m >= 20
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
const TIPOS_VARIACAO = ['Única', 'Cor', 'Tamanho', 'Capacidade', 'Versão', 'Material', 'Voltagem'];
type VarRow = {
  id: string;
  tipo: string;
  valor: string;
  sku: string;
  precoCusto: string;
  preco: string;
  estoque: string;
  /** Atributo principal (ex: Cor → "Preto") usado para agrupar na exibição. */
  grupo?: string;
  /** Atributo(s) secundário(s) (ex: Tamanho → "PP") — o item dentro do grupo. */
  subValor?: string;
};

const STATUS_OPTS = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'INATIVO', label: 'Inativo' },
  { value: 'RASCUNHO', label: 'Rascunho' },
  { value: 'ESGOTADO', label: 'Esgotado' },
  { value: 'DESCONTINUADO', label: 'Descontinuado' },
];

// Rótulos por status (cobre todo o enum canônico `StatusProduto`).
const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  STATUS_OPTS.map((s) => [s.value, s.label]),
);

// ── Gauge Ring ──────────────────────────────────────────────────────────────
function GaugeRing({
  value,
  max = 100,
  color,
  size = 56,
}: {
  value: number;
  max?: number;
  color: string;
  size?: number;
}) {
  const pct = Math.min(1, value / max);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={6}
        className="text-slate-200 dark:text-slate-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Caixa de valor (precificação) ────────────────────────────────────────────
function CaixaValor({
  label,
  valor,
  sub,
  destaque = false,
  cor,
}: {
  label: string;
  valor: string;
  sub?: string;
  destaque?: boolean;
  cor?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        destaque
          ? 'border-marca-200 bg-marca-50 dark:border-marca-800 dark:bg-marca-900/20'
          : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/40'
      }`}
    >
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p
        className={`mt-1 text-xl font-bold ${cor ?? (destaque ? 'text-marca-700 dark:text-marca-300' : 'text-slate-900 dark:text-slate-100')}`}
      >
        {valor}
      </p>
      {sub && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
    </div>
  );
}

// ── Barra de margem (custo × lucro sobre o preço de venda) ────────────────────
function BarraMargem({ custo, venda }: { custo: number; venda: number }) {
  if (!(venda > 0) || custo > venda) return null;
  const pctCusto = Math.max(0, Math.min(100, (custo / venda) * 100));
  const pctLucro = 100 - pctCusto;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-500 dark:text-slate-400">Composição do preço</span>
        <span className="text-slate-400">{moeda(venda)}</span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="bg-slate-400 dark:bg-slate-500" style={{ width: `${pctCusto}%` }} />
        <div className="bg-green-500" style={{ width: `${pctLucro}%` }} />
      </div>
      <div className="mt-1.5 flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
          Custo {pctCusto.toFixed(0)}%
        </span>
        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Lucro {pctLucro.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

// ── Painel IA ───────────────────────────────────────────────────────────────
function PainelIA({ produtoId }: { produtoId: string }) {
  const { data: analise, isLoading, isError, refetch, isFetching } = useAnaliseIAProduto(produtoId);
  const queryClient = useQueryClient();

  if (isLoading || isFetching)
    return (
      <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 dark:border-purple-800 dark:from-purple-950/20 dark:to-indigo-950/20">
        <div className="flex items-center gap-3">
          <Brain className="h-5 w-5 animate-pulse text-purple-500" />
          <span className="font-semibold text-purple-700 dark:text-purple-400">
            iMestreAI analisando produto...
          </span>
        </div>
      </div>
    );
  if (isError || !analise) return null;

  const scoreColor =
    analise.scoreGeral >= 70 ? '#22c55e' : analise.scoreGeral >= 40 ? '#f59e0b' : '#ef4444';
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
              <p className="text-xs text-purple-600 dark:text-purple-400">
                {new Date(analise.geradoEm).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              {analise.perfil}
            </span>
            <button
              onClick={() => {
                queryClient.removeQueries({ queryKey: ['produto', produtoId, 'analise-ia'] });
                refetch();
              }}
              className="flex items-center gap-1 rounded-lg border border-purple-300 px-2.5 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20"
            >
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
              <span
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ color: scoreColor }}
              >
                {analise.scoreGeral}
              </span>
            </div>
            <p className="text-center text-xs font-medium text-slate-600 dark:text-slate-400">
              Score Geral
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-slate-800/40">
            <div className="relative">
              <GaugeRing
                value={Math.min(100, analise.metricas.margemLiquida)}
                color="#8b5cf6"
                size={56}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-600">
                {analise.metricas.margemLiquida.toFixed(0)}%
              </span>
            </div>
            <p className="text-center text-xs font-medium text-slate-600 dark:text-slate-400">
              Margem
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-slate-800/40">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${estoqueOk ? 'bg-green-100' : 'bg-red-100'}`}
            >
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
            {
              label: 'Dias Sem Venda',
              valor:
                analise.metricas.diasSemVenda === '0'
                  ? 'Vendendo'
                  : `>${analise.metricas.diasSemVenda}d`,
            },
          ].map(({ label, valor, destaque }) => (
            <div
              key={label}
              className={`rounded-lg p-3 ${destaque ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-white/60 dark:bg-slate-800/40'}`}
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              <p
                className={`mt-0.5 text-sm font-bold ${destaque ? 'text-purple-700 dark:text-purple-300' : 'text-slate-900 dark:text-slate-100'}`}
              >
                {valor}
              </p>
            </div>
          ))}
        </div>

        {/* Recomendações */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold text-purple-800 dark:text-purple-300">
              Ações Recomendadas
            </span>
          </div>
          <ul className="space-y-2">
            {analise.recomendacoes.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-lg bg-white/60 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800/40 dark:text-slate-300"
              >
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
type TabType = 'detalhes' | 'imagens' | 'precos' | 'estoque' | 'fiscal' | 'ia';

export default function ProdutoDetailPage() {
  const params = useParams();
  const produtoId = params.id as string;

  const { data: produto, isLoading, isError } = useProduto(produtoId);
  // Saldo real do inventory-service (agregado por produtoId), sem chamada extra por linha.
  const { mapa: saldoPorProduto, isLoading: loadingSaldo } = useSaldoPorProduto();
  const estoqueDisponivel = saldoPorProduto.get(produtoId);
  const temSaldo = estoqueDisponivel !== undefined;
  const atualizar = useAtualizarProduto();
  const { data: categoriasData, isLoading: loadingCategorias } = useCategorias({
    ativa: true,
    itensPorPagina: 200,
  });
  const { data: marcasData, isLoading: loadingMarcas } = useMarcas({
    ativa: true,
    itensPorPagina: 200,
  });
  const categorias = categoriasData?.dados ?? [];
  const marcas = marcasData?.dados ?? [];

  const [tabAtiva, setTabAtiva] = useState<TabType>('detalhes');
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [variacoes, setVariacoes] = useState<VarRow[]>([]);
  // Grupos de variação (por cor) recolhidos na exibição de Preços & Margem.
  const [gruposRecolhidos, setGruposRecolhidos] = useState<Set<string>>(new Set());
  const toggleGrupo = (g: string) =>
    setGruposRecolhidos((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });

  const p = produto as any;

  useEffect(() => {
    if (!p) return;
    // Resolve categoriaId/marcaId: usa o ID do produto quando disponível,
    // senão casa pelo nome contra as listas reais do catálogo.
    const categoriaId = p.categoriaId ?? categorias.find((c) => c.nome === p.categoria)?.id ?? '';
    const marcaId = p.marcaId ?? marcas.find((m) => m.nome === p.marca)?.id ?? '';
    setForm({
      nome: p.nome ?? '',
      descricao: p.descricao ?? '',
      descricaoCurta: p.descricaoCurta ?? '',
      sku: p.sku ?? '',
      ean: p.ean ?? '',
      marcaId,
      categoriaId,
      status: p.status ?? 'ATIVO',
      tags: (p.tags ?? []).join(', '),
      precoPromocional: p.precoPromocional ?? '',
      peso: p.peso ?? 0,
      altura: p.altura ?? 0,
      largura: p.largura ?? 0,
      comprimento: p.comprimento ?? 0,
      ncm: p.ncm ?? '',
      cfop: p.cfop ?? '',
      cest: p.cest ?? '',
      origem: p.origem ?? 0,
      unidadeMedida: p.unidadeMedida ?? '',
      estoqueMinimo: p.estoqueMinimo ?? 0,
      metaDescricao: p.metaDescricao ?? '',
      metaPalavrasChave: p.metaPalavrasChave ?? '',
      // Galeria de imagens (URLs, capa = primeira) — normalizada em string[] no service.
      imagens: Array.isArray(p.imagens) ? p.imagens : [],
    });
    const vars = (p.variacoes ?? []) as any[];
    if (vars.length > 0) {
      setVariacoes(
        vars.map((v: any) => {
          // Shape real do catalog: { nome, precoVenda, atributos:[{nome,valor}] }.
          // (Sem `tipo`/`valor`/`preco`/`precoCusto` planos — daí o mapeamento explícito.)
          const atributos = (v.atributos ?? []) as { nome?: string; valor?: string }[];
          const rotulo =
            v.valor ??
            v.nome ??
            atributos
              .map((a) => a.valor)
              .filter(Boolean)
              .join(' ') ??
            'Variação';
          const tipo = v.tipo ?? atributos[0]?.nome ?? 'Variação';
          // Agrupamento: atributo "Cor" (ou o 1º) vira o grupo; o restante (ex: Tamanho)
          // vira o subvalor (o item dentro do grupo). Permite unir por cor e recolher.
          const attrPrincipal =
            atributos.find((a) => (a.nome ?? '').toLowerCase() === 'cor') ?? atributos[0];
          const grupo = attrPrincipal?.valor ?? '';
          const subValor = atributos
            .filter((a) => a !== attrPrincipal)
            .map((a) => a.valor)
            .filter(Boolean)
            .join(' ');
          // Variação não carrega custo próprio → usa o custo-base do produto p/ estimar margem.
          const custoRaw = v.precoCusto ?? p.precoCusto;
          const precoRaw = v.preco ?? v.precoVenda;
          return {
            id: v.id ?? String(Math.random()),
            tipo,
            valor: rotulo,
            sku: v.sku ?? '',
            precoCusto: custoRaw != null ? String(custoRaw) : '',
            preco: precoRaw != null ? String(precoRaw) : '',
            estoque: String(v.estoque ?? 0),
            grupo,
            subValor,
          };
        }),
      );
    } else {
      setVariacoes([
        {
          id: '1',
          tipo: 'Única',
          valor: 'Única',
          sku: p.sku ?? '',
          precoCusto: String(p.precoCusto ?? ''),
          preco: String(p.preco ?? ''),
          estoque: String(p.estoque ?? 0),
        },
      ]);
    }
    // categorias/marcas entram na dependência para reprocessar o casamento por
    // nome assim que as listas do catálogo terminarem de carregar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produto, categorias.length, marcas.length]);

  const set = (k: string, v: any) => setForm((prev) => ({ ...prev, [k]: v }));
  const setVar = (i: number, k: keyof VarRow, v: string) =>
    setVariacoes((prev) => prev.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const isUnica = variacoes.length === 1 && variacoes[0]?.tipo === 'Única';
  const primeiraComPreco = variacoes.find((v) => Number(v.preco) > 0 && Number(v.precoCusto) > 0);
  // Margem SOBRE VENDA (mesma definição do KPI do topo — evita divergir de 57% vs 132%).
  const margem = primeiraComPreco
    ? margemSobreVenda(Number(primeiraComPreco.preco), Number(primeiraComPreco.precoCusto)).toFixed(
        1,
      )
    : (p?.margem ?? p?.margemLucro ?? 0).toFixed(1);

  // Margem do catálogo (sobre o preço de venda), derivada no service. Para os KPIs/topo.
  const margemProduto = p?.margem ?? p?.margemLucro;
  // Texto de estoque do inventory-service: 'X un' ou '—' (ou '…' enquanto carrega).
  const estoqueTexto = temSaldo ? `${estoqueDisponivel} un` : loadingSaldo ? '…' : '—';

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const variacoesDTO = variacoes.map((v) => ({
        id: v.id,
        tipo: v.tipo,
        valor: v.valor,
        sku: v.sku || undefined,
        precoCusto: v.precoCusto ? Number(v.precoCusto) : undefined,
        preco: v.preco ? Number(v.preco) : undefined,
        estoque: Number(v.estoque) || 0,
      }));
      // Sanitiza o payload para o contrato do catalog (forbidNonWhitelisted):
      // `ean` vira `gtin`; `cfop`/`metaPalavrasChave`/`imagens` string[] saem do
      // spread e entram no shape correto abaixo. Evita o 400 do save de edição.
      const { ean, cfop, metaPalavrasChave, imagens: _imgForm, ...camposProduto } = form;
      await atualizar.mutateAsync({
        id: produtoId,
        dto: {
          ...camposProduto,
          // O catalog usa `gtin`; a UI edita como `ean`.
          gtin: ean || undefined,
          // IDs reais do catálogo; marcaId vazio vira undefined (backend @IsUUID).
          // Os nomes de exibição são resolvidos pelo backend/mock a partir do ID —
          // não enviamos `categoria`/`marca` como texto para não violar o whitelist do DTO.
          categoriaId: form.categoriaId || undefined,
          marcaId: form.marcaId || undefined,
          tags: form.tags
            ? form.tags
                .split(',')
                .map((t: string) => t.trim())
                .filter(Boolean)
            : [],
          precoPromocional: form.precoPromocional ? Number(form.precoPromocional) : undefined,
          variacoes: variacoesDTO,
          // Galeria → shape do backend (url + capa + ordem). 1ª imagem = principal.
          imagens: ((form.imagens ?? []) as string[]).map((url, i) => ({
            url,
            principal: i === 0,
            ordem: i,
          })),
        },
      });
      setEditando(false);
    } finally {
      setSalvando(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-marca-500" />
      </div>
    );
  if (isError || !p)
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950/20">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h2 className="text-lg font-semibold">Produto não encontrado</h2>
        <Link
          href="/dashboard/produtos"
          className="mt-4 inline-block rounded-lg bg-marca-500 px-4 py-2 text-white"
        >
          Voltar
        </Link>
      </div>
    );

  const TABS: { id: TabType; label: string; Icone: typeof Package }[] = [
    { id: 'detalhes', label: 'Detalhes', Icone: Package },
    { id: 'imagens', label: 'Imagens', Icone: Images },
    { id: 'precos', label: 'Preços & Margem', Icone: DollarSign },
    { id: 'estoque', label: 'Estoque', Icone: Box },
    { id: 'fiscal', label: 'Fiscal', Icone: Receipt },
    { id: 'ia', label: 'IA', Icone: Sparkles },
  ];

  const Field = ({
    label,
    children,
    col2 = false,
  }: {
    label: string;
    children: React.ReactNode;
    col2?: boolean;
  }) => (
    <div className={col2 ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </label>
      {children}
    </div>
  );

  const inputCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-400';
  const textCls = 'text-sm font-medium text-slate-900 dark:text-slate-100';

  return (
    <div className="space-y-6">
      {/* Breadcrumb — Dashboard fica acima do nome do produto e do botão Editar */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <Link
          href="/dashboard"
          className="font-medium transition-colors hover:text-marca-600 dark:hover:text-marca-400"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        <Link
          href="/dashboard/produtos"
          className="font-medium transition-colors hover:text-marca-600 dark:hover:text-marca-400"
        >
          Produtos
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        <span className="max-w-[16rem] truncate font-semibold text-slate-700 dark:text-slate-200">
          {p.nome}
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/produtos"
            className="flex items-center justify-center rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                {p.nome}
              </h1>
              <StatusBadge status={p.status} label={STATUS_LABELS[p.status] ?? p.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500 font-mono">
              {p.sku} · {p.marca} · {p.categoria}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {editando ? (
            <>
              <button
                onClick={() => setEditando(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvar}
                disabled={salvando}
                className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-60"
              >
                {salvando ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-marca-600"
            >
              <Edit className="h-4 w-4" /> Editar
            </button>
          )}
        </div>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KPICard
          label="Preço de Venda"
          valor={(() => {
            // Variação usa `precoVenda`; tolera `preco` legado. Ignora nulos/zeros.
            const precos = (p.variacoes ?? [])
              .map((v: any) => Number(v.precoVenda ?? v.preco))
              .filter((n: number) => Number.isFinite(n) && n > 0);
            return precos.length > 1 && Math.min(...precos) !== Math.max(...precos)
              ? `${moeda(Math.min(...precos))} – ${moeda(Math.max(...precos))}`
              : moeda(p.preco);
          })()}
          icone={<DollarSign className="h-5 w-5" />}
          destaque
        />
        <KPICard
          label="Margem de Lucro"
          valor={margemProduto !== undefined ? `${margemProduto.toFixed(1)}%` : '—'}
          icone={<Percent className="h-5 w-5" />}
        />
        <KPICard label="Em Estoque" valor={estoqueTexto} icone={<Box className="h-5 w-5" />} />
        <KPICard
          label="Vendas (30d)"
          valor={p.vendasUltimos30Dias ?? 0}
          icone={<ShoppingCart className="h-5 w-5" />}
        />
      </div>

      {/* Tags */}
      {(p.tags ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(p.tags ?? []).map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Abas */}
      <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const ativa = tabAtiva === tab.id;
            const ehIA = tab.id === 'ia';
            return (
              <button
                key={tab.id}
                onClick={() => setTabAtiva(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  ativa
                    ? ehIA
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm'
                      : 'bg-marca-500 text-white shadow-sm'
                    : `text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-slate-100 ${ehIA ? 'text-purple-600 dark:text-purple-400' : ''}`
                }`}
              >
                <tab.Icone className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Detalhes ── */}
      {tabAtiva === 'detalhes' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            Informações do Produto
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome" col2>
              {editando ? (
                <input
                  className={inputCls}
                  value={form.nome}
                  onChange={(e) => set('nome', e.target.value)}
                />
              ) : (
                <p className={textCls}>{fmt(p.nome)}</p>
              )}
            </Field>
            <Field label="Descrição Curta" col2>
              {editando ? (
                <input
                  className={inputCls}
                  value={form.descricaoCurta}
                  onChange={(e) => set('descricaoCurta', e.target.value)}
                />
              ) : (
                <p className={textCls}>{fmt(p.descricaoCurta)}</p>
              )}
            </Field>
            <Field label="Descrição Completa" col2>
              {editando ? (
                <textarea
                  className={inputCls}
                  rows={3}
                  value={form.descricao}
                  onChange={(e) => set('descricao', e.target.value)}
                />
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {fmt(p.descricao)}
                </p>
              )}
            </Field>
            <Field label="SKU">
              {editando ? (
                <input
                  className={inputCls}
                  value={form.sku}
                  onChange={(e) => set('sku', e.target.value)}
                />
              ) : (
                <p className={`${textCls} font-mono`}>{fmt(p.sku)}</p>
              )}
            </Field>
            <Field label="EAN/GTIN">
              {editando ? (
                <input
                  className={inputCls}
                  value={form.ean}
                  onChange={(e) => set('ean', e.target.value)}
                />
              ) : (
                <p className={`${textCls} font-mono`}>{fmt(p.ean)}</p>
              )}
            </Field>
            <Field label="Marca">
              {editando ? (
                <select
                  className={inputCls}
                  value={form.marcaId ?? ''}
                  onChange={(e) => set('marcaId', e.target.value)}
                  disabled={loadingMarcas}
                >
                  <option value="">{loadingMarcas ? 'Carregando...' : 'Sem marca'}</option>
                  {marcas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              ) : (
                <p className={textCls}>{fmt(p.marca)}</p>
              )}
            </Field>
            <Field label="Categoria">
              {editando ? (
                <select
                  className={inputCls}
                  value={form.categoriaId ?? ''}
                  onChange={(e) => set('categoriaId', e.target.value)}
                  disabled={loadingCategorias}
                >
                  <option value="">{loadingCategorias ? 'Carregando...' : 'Selecione...'}</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              ) : (
                <p className={textCls}>{fmt(p.categoria)}</p>
              )}
            </Field>
            <Field label="Status">
              {editando ? (
                <select
                  className={inputCls}
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                >
                  {STATUS_OPTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              ) : (
                <StatusBadge status={p.status} label={STATUS_LABELS[p.status] ?? p.status} />
              )}
            </Field>
            <Field label="Tags" col2>
              {editando ? (
                <input
                  className={inputCls}
                  placeholder="ex: premium, 5g, novo"
                  value={form.tags}
                  onChange={(e) => set('tags', e.target.value)}
                />
              ) : (
                <div className="flex flex-wrap gap-1">
                  {(p.tags ?? []).map((t: string) => (
                    <span
                      key={t}
                      className="rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Field>
            <Field label="Peso (g)">
              {editando ? (
                <input
                  className={inputCls}
                  type="number"
                  value={form.peso}
                  onChange={(e) => set('peso', Number(e.target.value))}
                />
              ) : (
                <p className={textCls}>{fmt(p.peso)}g</p>
              )}
            </Field>
            <Field label="Dimensões (cm)">
              {editando ? (
                <div className="grid grid-cols-3 gap-2">
                  <input
                    className={inputCls}
                    type="number"
                    placeholder="A"
                    value={form.altura}
                    onChange={(e) => set('altura', Number(e.target.value))}
                  />
                  <input
                    className={inputCls}
                    type="number"
                    placeholder="L"
                    value={form.largura}
                    onChange={(e) => set('largura', Number(e.target.value))}
                  />
                  <input
                    className={inputCls}
                    type="number"
                    placeholder="P"
                    value={form.comprimento}
                    onChange={(e) => set('comprimento', Number(e.target.value))}
                  />
                </div>
              ) : (
                <p className={textCls}>
                  {p.altura}×{p.largura}×{p.comprimento} cm
                </p>
              )}
            </Field>
          </div>

          {/* Resumo de precificação — a edição completa vive na aba Preços & Margem
              (evita duplicar a tabela de variações e mantê-las sempre em sincronia). */}
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Preço de venda</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {(() => {
                    const precos = (p.variacoes ?? [])
                      .map((v: any) => Number(v.precoVenda ?? v.preco))
                      .filter((n: number) => Number.isFinite(n) && n > 0);
                    return precos.length > 1 && Math.min(...precos) !== Math.max(...precos)
                      ? `${moeda(Math.min(...precos))} – ${moeda(Math.max(...precos))}`
                      : moeda(p.preco);
                  })()}
                </p>
              </div>
              {margemProduto !== undefined && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Margem</p>
                  <p className={`text-lg font-bold ${corMargem(Number(margemProduto))}`}>
                    {Number(margemProduto).toFixed(1)}%
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isUnica ? 'Variação' : 'Variações'}
                </p>
                <p className="max-w-[16rem] truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                  {isUnica
                    ? 'Sem variações'
                    : variacoes
                        .map((v) => v.valor)
                        .filter(Boolean)
                        .join(', ')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTabAtiva('precos')}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-marca-300 px-3 py-2 text-sm font-semibold text-marca-600 hover:bg-marca-50 dark:border-marca-700 dark:text-marca-400 dark:hover:bg-marca-900/20"
            >
              <DollarSign className="h-4 w-4" /> Preços &amp; variações
            </button>
          </div>

          {/* Wizard de variação por grade (contrato novo: variacoes/prever + lote) */}
          <WizardVariacaoGrade produtoId={produtoId} skuBase={p.sku} precoBase={p.preco} />
        </div>
      )}

      {/* ── Imagens ── */}
      {tabAtiva === 'imagens' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Fotos do produto</h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                A primeira imagem é a capa. Estas fotos aparecem na vitrine e nos anúncios dos
                marketplaces.
              </p>
            </div>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Edit className="h-4 w-4" /> Editar fotos
              </button>
            )}
          </div>
          <GaleriaImagens
            value={(form.imagens ?? []) as string[]}
            onChange={(urls) => set('imagens', urls)}
            editavel={editando}
          />
          {editando && (
            <p className="mt-4 text-xs text-slate-400">
              As alterações nas fotos são salvas ao clicar em <strong>Salvar</strong> no topo.
            </p>
          )}
        </div>
      )}

      {/* ── Preços & Margem ── */}
      {tabAtiva === 'precos' && (
        <div className="space-y-6">
          {/* Preços & variações — card de precificação (produto único) ou tabela (múltiplas) */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">
                  {isUnica ? 'Precificação' : 'Preços por variação'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {isUnica
                    ? 'Custo, preço de venda e margem deste produto.'
                    : `${variacoes.length} variações · margem calculada sobre o preço de venda.`}
                </p>
              </div>
              {editando && (
                <button
                  type="button"
                  onClick={() =>
                    setVariacoes((prev) => [
                      ...prev.map((v) =>
                        v.tipo === 'Única' && v.valor === 'Única'
                          ? { ...v, tipo: 'Cor', valor: '' }
                          : v,
                      ),
                      {
                        id: String(Date.now()),
                        tipo: 'Cor',
                        valor: '',
                        sku: '',
                        precoCusto: '',
                        preco: '',
                        estoque: '0',
                      },
                    ])
                  }
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-marca-300 px-3 py-1.5 text-xs font-semibold text-marca-600 hover:bg-marca-50 dark:border-marca-700 dark:text-marca-400 dark:hover:bg-marca-900/20"
                >
                  <Plus className="h-3.5 w-3.5" /> Adicionar variação
                </button>
              )}
            </div>

            {editando ? (
              <div className="space-y-2">
                <div
                  className="grid gap-2 items-center mb-1"
                  style={{
                    gridTemplateColumns: isUnica
                      ? '1.2fr 1.2fr 1fr auto'
                      : '1fr 1.5fr 1.2fr 1.2fr 1fr auto',
                  }}
                >
                  {!isUnica && (
                    <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">
                      Tipo
                    </span>
                  )}
                  {!isUnica && (
                    <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">
                      Valor
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">
                    Custo (R$)
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">
                    Venda (R$)
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">
                    Estoque
                  </span>
                  <span />
                </div>
                {variacoes.map((v, i) => {
                  const cst = Number(v.precoCusto);
                  const vnd = Number(v.preco);
                  const mv = cst > 0 && vnd > 0 ? margemSobreVenda(vnd, cst) : null;
                  return (
                    <div key={v.id} className="space-y-1">
                      <div
                        className="grid gap-2 items-center"
                        style={{
                          gridTemplateColumns: isUnica
                            ? '1.2fr 1.2fr 1fr auto'
                            : '1fr 1.5fr 1.2fr 1.2fr 1fr auto',
                        }}
                      >
                        {!isUnica && (
                          <select
                            value={v.tipo}
                            onChange={(e) => setVar(i, 'tipo', e.target.value)}
                            className={inputCls}
                          >
                            {TIPOS_VARIACAO.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        )}
                        {!isUnica && (
                          <input
                            className={inputCls}
                            placeholder="Ex: Preto, P, 64GB"
                            value={v.valor}
                            onChange={(e) => setVar(i, 'valor', e.target.value)}
                          />
                        )}
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          className={inputCls}
                          value={v.precoCusto}
                          onChange={(e) => setVar(i, 'precoCusto', e.target.value)}
                        />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          className={inputCls}
                          value={v.preco}
                          onChange={(e) => setVar(i, 'preco', e.target.value)}
                        />
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className={inputCls}
                          value={v.estoque}
                          onChange={(e) => setVar(i, 'estoque', e.target.value)}
                        />
                        <button
                          onClick={() =>
                            variacoes.length > 1
                              ? setVariacoes((prev) => prev.filter((_, j) => j !== i))
                              : setVariacoes([
                                  {
                                    id: '1',
                                    tipo: 'Única',
                                    valor: 'Única',
                                    sku: p.sku ?? '',
                                    precoCusto: '',
                                    preco: '',
                                    estoque: '0',
                                  },
                                ])
                          }
                          className="rounded p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {mv !== null && (
                        <p className="pl-1 text-[11px] text-slate-400">
                          Margem{' '}
                          <span className={`font-semibold ${corMargem(mv)}`}>{mv.toFixed(1)}%</span>
                          {' · '}Lucro {moeda(vnd - cst)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : isUnica ? (
              (() => {
                const custo = Number(variacoes[0]?.precoCusto) || Number(p.precoCusto) || 0;
                const venda = Number(variacoes[0]?.preco) || Number(p.preco) || 0;
                if (!(venda > 0))
                  return (
                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
                      <DollarSign className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Sem preço de venda definido. Clique em <strong>Editar</strong> para
                        precificar.
                      </p>
                    </div>
                  );
                const mVenda = margemSobreVenda(venda, custo);
                const mMarkup = markupSobreCusto(venda, custo);
                const lucro = venda - custo;
                const promo = Number(form.precoPromocional) || 0;
                return (
                  <div className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <CaixaValor label="Preço de custo" valor={custo > 0 ? moeda(custo) : '—'} />
                      <CaixaValor label="Preço de venda" valor={moeda(venda)} destaque />
                      <CaixaValor
                        label="Margem"
                        valor={`${mVenda.toFixed(1)}%`}
                        sub={custo > 0 ? `Markup ${mMarkup.toFixed(0)}%` : 'defina o custo'}
                        cor={corMargem(mVenda)}
                      />
                      <CaixaValor
                        label="Lucro por unidade"
                        valor={moeda(lucro)}
                        cor={lucro >= 0 ? 'text-green-600' : 'text-red-600'}
                      />
                    </div>
                    {custo > 0 && <BarraMargem custo={custo} venda={venda} />}
                    {promo > 0 && (
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg border border-destaque-200 bg-destaque-50 p-3 text-sm dark:border-destaque-800 dark:bg-destaque-900/20">
                        <span className="font-semibold text-destaque-700 dark:text-destaque-400">
                          Promoção ativa: {moeda(promo)}
                        </span>
                        {custo > 0 && (
                          <span className="text-slate-500 dark:text-slate-400">
                            Margem na promoção:{' '}
                            <strong className={corMargem(margemSobreVenda(promo, custo))}>
                              {margemSobreVenda(promo, custo).toFixed(1)}%
                            </strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              (() => {
                // Estatísticas globais (rodapé).
                const precos = variacoes.map((v) => Number(v.preco)).filter((n) => n > 0);
                const margens = variacoes
                  .filter((v) => Number(v.preco) > 0 && Number(v.precoCusto) > 0)
                  .map((v) => margemSobreVenda(Number(v.preco), Number(v.precoCusto)));
                const margemMedia = margens.length
                  ? margens.reduce((a, b) => a + b, 0) / margens.length
                  : null;

                // Cabeçalho reutilizável (a 1ª coluna muda entre plano e agrupado).
                const cabecalho = (primeira: string) => (
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">
                        {primeira}
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">
                        SKU
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">
                        Custo
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">
                        Venda
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">
                        Margem
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">
                        Lucro/un
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">
                        Estoque
                      </th>
                    </tr>
                  </thead>
                );

                // Linha da tabela (1ª coluna = rótulo informado).
                const linha = (v: VarRow, rotulo: string) => {
                  const preco = Number(v.preco);
                  const custo = Number(v.precoCusto);
                  const mv = custo > 0 && preco > 0 ? margemSobreVenda(preco, custo) : null;
                  return (
                    <tr
                      key={v.id}
                      className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/40"
                    >
                      <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                        {rotulo || '—'}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-slate-500">{v.sku || '—'}</td>
                      <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">
                        {custo > 0 ? moeda(custo) : '—'}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">
                        {preco > 0 ? moeda(preco) : '—'}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {mv !== null ? (
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${corMargemBg(mv)}`}
                          >
                            {mv.toFixed(1)}%
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">
                        {preco > 0 && custo > 0 ? moeda(preco - custo) : '—'}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
                        {Number(v.estoque) > 0 ? `${v.estoque} un` : '—'}
                      </td>
                    </tr>
                  );
                };

                const rodape =
                  precos.length > 0 || margemMedia !== null ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 dark:bg-slate-700/40 dark:text-slate-400">
                      <span>
                        {precos.length > 0 &&
                          `Faixa: ${moeda(Math.min(...precos))} – ${moeda(Math.max(...precos))}`}
                      </span>
                      {margemMedia !== null && (
                        <span>
                          Margem média:{' '}
                          <strong className={corMargem(margemMedia)}>
                            {margemMedia.toFixed(1)}%
                          </strong>
                        </span>
                      )}
                    </div>
                  ) : null;

                // Agrupa por cor (atributo principal). Chave vazia = variação sem atributo.
                const grupos = new Map<string, VarRow[]>();
                variacoes.forEach((v) => {
                  const k = v.grupo || '';
                  if (!grupos.has(k)) grupos.set(k, []);
                  grupos.get(k)!.push(v);
                });
                const chaves = Array.from(grupos.keys());
                // Só agrupa quando há +de 1 cor e TODAS as variações têm cor definida.
                const agrupavel = chaves.length > 1 && chaves.every((k) => k !== '');

                // Sem agrupamento útil → tabela plana (rótulo = nome completo da variação).
                if (!agrupavel) {
                  return (
                    <div className="space-y-3">
                      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-sm">
                          {cabecalho('Variação')}
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {variacoes.map((v) => linha(v, v.valor))}
                          </tbody>
                        </table>
                      </div>
                      {rodape}
                    </div>
                  );
                }

                // Acordeão: um bloco recolhível por cor.
                const todosRecolhidos = chaves.every((k) => gruposRecolhidos.has(k));
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        {chaves.length} cores · {variacoes.length} variações
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setGruposRecolhidos(todosRecolhidos ? new Set() : new Set(chaves))
                        }
                        className="text-xs font-medium text-marca-600 hover:underline dark:text-marca-400"
                      >
                        {todosRecolhidos ? 'Expandir tudo' : 'Recolher tudo'}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {chaves.map((k) => {
                        const rows = grupos.get(k)!;
                        const recolhido = gruposRecolhidos.has(k);
                        const gp = rows.map((r) => Number(r.preco)).filter((n) => n > 0);
                        const gm = rows
                          .filter((r) => Number(r.preco) > 0 && Number(r.precoCusto) > 0)
                          .map((r) => margemSobreVenda(Number(r.preco), Number(r.precoCusto)));
                        const gMargem = gm.length
                          ? gm.reduce((a, b) => a + b, 0) / gm.length
                          : null;
                        const faixa = gp.length
                          ? Math.min(...gp) !== Math.max(...gp)
                            ? `${moeda(Math.min(...gp))} – ${moeda(Math.max(...gp))}`
                            : moeda(gp[0])
                          : '—';
                        return (
                          <div
                            key={k}
                            className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
                          >
                            <button
                              type="button"
                              onClick={() => toggleGrupo(k)}
                              className="flex w-full items-center gap-2 bg-slate-50 px-3 py-2.5 text-left hover:bg-slate-100 dark:bg-slate-700/40 dark:hover:bg-slate-700"
                            >
                              <ChevronRight
                                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${recolhido ? '' : 'rotate-90'}`}
                              />
                              <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {k}
                              </span>
                              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-600 dark:text-slate-200">
                                {rows.length} {rows.length === 1 ? 'item' : 'itens'}
                              </span>
                              <span className="ml-auto flex items-center gap-3 text-xs">
                                <span className="hidden text-slate-500 dark:text-slate-400 sm:inline">
                                  {faixa}
                                </span>
                                {gMargem !== null && (
                                  <span
                                    className={`rounded-md px-2 py-0.5 font-bold ${corMargemBg(gMargem)}`}
                                  >
                                    {gMargem.toFixed(1)}%
                                  </span>
                                )}
                              </span>
                            </button>
                            {!recolhido && (
                              <div className="overflow-x-auto border-t border-slate-100 dark:border-slate-700">
                                <table className="w-full text-sm">
                                  {cabecalho('Tamanho')}
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {rows.map((v) => linha(v, v.subValor || v.valor))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {rodape}
                  </div>
                );
              })()
            )}
          </div>

          {/* Análise de Margem */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-base font-semibold">Desempenho &amp; margem</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isUnica ? 'Margem de lucro' : 'Margem (1ª variação)'}
                    </p>
                    <p className={`mt-1 text-2xl font-bold ${corMargem(Number(margem))}`}>
                      {margem}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Vendas (30 dias)</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {p.vendasUltimos30Dias ?? 0}
                      <span className="ml-1 text-sm font-normal text-slate-400">un</span>
                    </p>
                  </div>
                </div>
                {primeiraComPreco && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Receita (30 dias)</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {moeda((p.vendasUltimos30Dias ?? 0) * Number(primeiraComPreco.preco))}
                    </span>
                  </div>
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
                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                      Sugestão IA
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
                    Veja a aba <strong>✦ IA</strong> para sugestão de preço baseada em desempenho e
                    margem ideal.
                  </p>
                </div>
              </div>
            </div>

            {/* Preço Promocional e Estoque Mínimo */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-base font-semibold">Configurações</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Preço Promocional (R$)
                  </label>
                  {editando ? (
                    <input
                      className={inputCls}
                      type="number"
                      step="0.01"
                      value={form.precoPromocional}
                      onChange={(e) => set('precoPromocional', e.target.value)}
                      placeholder="Opcional"
                    />
                  ) : (
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {form.precoPromocional ? moeda(Number(form.precoPromocional)) : '—'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Estoque Mínimo
                  </label>
                  {editando ? (
                    <input
                      className={`${inputCls} max-w-xs`}
                      type="number"
                      min="0"
                      value={form.estoqueMinimo}
                      onChange={(e) => set('estoqueMinimo', Number(e.target.value))}
                    />
                  ) : (
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {form.estoqueMinimo} unidades
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Estoque ── */}
      {tabAtiva === 'estoque' &&
        (() => {
          // Saldo real vem do inventory-service (agregado por produtoId). O catalog
          // não guarda vendas; mostramos '—' para métricas que ele não fornece.
          const estoqueMin = Number(p.estoqueMinimo ?? form.estoqueMinimo ?? 0);
          const estoqueAtual = estoqueDisponivel; // number | undefined
          const abaixoMinimo = temSaldo && (estoqueAtual as number) <= estoqueMin;
          const zerado = temSaldo && estoqueAtual === 0;
          return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-base font-semibold">Controle de Estoque</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  {
                    label: 'Estoque Atual',
                    valor: temSaldo ? `${estoqueAtual} unidades` : loadingSaldo ? '…' : '—',
                    color: !temSaldo
                      ? 'text-slate-400'
                      : zerado
                        ? 'text-red-600'
                        : abaixoMinimo
                          ? 'text-amber-600'
                          : 'text-green-600',
                  },
                  {
                    label: 'Estoque Mínimo',
                    valor: `${estoqueMin} unidades`,
                    color: 'text-slate-900 dark:text-slate-100',
                  },
                  { label: 'Vendas (30d)', valor: '—', color: 'text-slate-400' },
                  { label: 'Total Vendido', valor: '—', color: 'text-slate-400' },
                ].map(({ label, valor, color }) => (
                  <div key={label} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className={`mt-1 text-xl font-bold ${color}`}>{valor}</p>
                  </div>
                ))}
              </div>
              {abaixoMinimo && (
                <div
                  className={`mt-4 flex items-start gap-3 rounded-lg border p-4 ${
                    zerado
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                      : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20'
                  }`}
                >
                  <AlertTriangle
                    className={`mt-0.5 h-5 w-5 shrink-0 ${zerado ? 'text-red-500' : 'text-amber-500'}`}
                  />
                  <div>
                    <p
                      className={`font-semibold text-sm ${zerado ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}
                    >
                      {zerado ? 'Estoque zerado!' : 'Estoque abaixo do mínimo!'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Reposição recomendada. Estoque mínimo: {estoqueMin} unidades.
                    </p>
                  </div>
                </div>
              )}
              {!temSaldo && !loadingSaldo && (
                <p className="mt-4 text-xs text-slate-400">
                  Sem registro de estoque no inventário para este produto.
                </p>
              )}
              {editando && (
                <p className="mt-4 text-xs text-slate-400">
                  Para ajustar o estoque mínimo, acesse a aba <strong>Preços & Margem</strong>.
                </p>
              )}
            </div>
          );
        })()}

      {/* ── Fiscal ── */}
      {tabAtiva === 'fiscal' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-base font-semibold">Dados Fiscais</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="NCM (Nomenclatura Comum do Mercosul)">
              {editando ? (
                <input
                  className={inputCls}
                  placeholder="00000000"
                  value={form.ncm}
                  onChange={(e) => set('ncm', e.target.value)}
                  maxLength={8}
                />
              ) : (
                <p className={`${textCls} font-mono`}>{fmt(p.ncm)}</p>
              )}
            </Field>
            <Field label="CFOP (Código Fiscal de Operação)">
              {editando ? (
                <input
                  className={inputCls}
                  placeholder="5102"
                  value={form.cfop}
                  onChange={(e) => set('cfop', e.target.value)}
                  maxLength={4}
                />
              ) : (
                <p className={`${textCls} font-mono`}>{fmt(p.cfop)}</p>
              )}
            </Field>
            <Field label="CEST (Código Especificador da Subst. Tributária)">
              {editando ? (
                <input
                  className={inputCls}
                  placeholder="0000000"
                  value={form.cest}
                  onChange={(e) => set('cest', e.target.value)}
                  maxLength={7}
                />
              ) : (
                <p className={`${textCls} font-mono`}>{fmt(p.cest)}</p>
              )}
            </Field>
            <Field label="Origem">
              {editando ? (
                <select
                  className={inputCls}
                  value={form.origem ?? 0}
                  onChange={(e) => set('origem', Number(e.target.value))}
                >
                  <option value={0}>0 - Nacional</option>
                  <option value={1}>1 - Estrangeiro (importação direta)</option>
                  <option value={2}>2 - Estrangeiro (adquirido no mercado interno)</option>
                </select>
              ) : (
                <p className={textCls}>
                  {p.origem === 0
                    ? '0 - Nacional'
                    : p.origem != null
                      ? `${p.origem} - Estrangeiro`
                      : '—'}
                </p>
              )}
            </Field>
            <Field label="Unidade de Medida">
              {editando ? (
                <input
                  className={inputCls}
                  placeholder="UN"
                  value={form.unidadeMedida}
                  onChange={(e) => set('unidadeMedida', e.target.value)}
                  maxLength={6}
                />
              ) : (
                <p className={textCls}>{fmt(p.unidadeMedida)}</p>
              )}
            </Field>
            <Field label="EAN/GTIN">
              {editando ? (
                <input
                  className={inputCls}
                  value={form.ean}
                  onChange={(e) => set('ean', e.target.value)}
                />
              ) : (
                <p className={`${textCls} font-mono`}>{fmt(p.ean)}</p>
              )}
            </Field>
          </div>
          <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/20">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                Sugestão Automática de NCM
              </span>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Acesse a aba <strong>✦ IA</strong> para obter sugestão de NCM baseada na descrição e
              categoria do produto.
            </p>
          </div>
        </div>
      )}

      {/* ── IA ── */}
      {tabAtiva === 'ia' && <PainelIA produtoId={produtoId} />}
    </div>
  );
}
