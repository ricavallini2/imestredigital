'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Info,
  Brain,
  Loader2,
  CheckCircle,
  Grid3x3,
  Wand2,
  X,
} from 'lucide-react';
import { useCriarProduto } from '@/hooks/useProdutos';
import { useCategorias } from '@/hooks/useCategorias';
import { useMarcas } from '@/hooks/useMarcas';
import { useGrades } from '@/hooks/useGrades';
import { GaleriaImagens } from '@/components/ui/galeria-imagens';
import { Abas } from '@/components/ui/abas';
import { slugSku } from '@/lib/utils';

const TIPOS_VARIACAO = ['Única', 'Cor', 'Tamanho', 'Capacidade', 'Versão', 'Material', 'Voltagem'];
const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-400';
const labelCls = 'block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1';
const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type Aba = 'basico' | 'imagens' | 'precos' | 'dimensoes' | 'fiscal' | 'seo';

type VarRow = {
  id: string;
  tipo: string;
  valor: string;
  sku: string;
  precoCusto: string;
  preco: string;
  estoque: string;
};

export default function NovoProdutoPage() {
  const router = useRouter();
  const criar = useCriarProduto();
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
  const [abaAtiva, setAbaAtiva] = useState<Aba>('basico');
  const [sucesso, setSucesso] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    descricaoCurta: '',
    sku: '',
    ean: '',
    marcaId: '',
    categoriaId: '',
    status: 'RASCUNHO',
    precoPromocional: '',
    peso: '',
    altura: '',
    largura: '',
    comprimento: '',
    ncm: '',
    cfop: '5102',
    origem: '0',
    tags: '',
    metaDescricao: '',
    metaPalavrasChave: '',
    estoqueMinimo: '5',
    imagens: [] as string[],
  });

  const [variacoes, setVariacoes] = useState<VarRow[]>([
    { id: '1', tipo: 'Única', valor: 'Única', sku: '', precoCusto: '', preco: '', estoque: '0' },
  ]);
  const [erros, setErros] = useState<Record<string, string>>({});

  // ── Gerador de variação por grade (client-side, na criação) ──────────────
  // O produto ainda não existe, então não há :id para os endpoints
  // prever/lote do backend. Aqui geramos as linhas localmente com a MESMA regra
  // de SKU do backend (`${sku}-${VALOR_SLUG}-${TAMANHO}`) e populamos as
  // `variacoes` que já são enviadas no POST de criação. Na tela de detalhe, o
  // wizard completo (com prever/lote reais) fica disponível.
  const [gradeOpen, setGradeOpen] = useState(false);
  const [gAtributo, setGAtributo] = useState('Cor');
  const [gValor, setGValor] = useState('');
  const [gGradeId, setGGradeId] = useState('');
  const [gErro, setGErro] = useState('');
  const { data: gradesData, isLoading: loadingGrades } = useGrades({
    ativa: true,
    itensPorPagina: 200,
  });
  const gradesAtivas = useMemo(
    () => (gradesData?.dados ?? []).filter((g) => g.ativa && g.tamanhos.length > 0),
    [gradesData],
  );

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const setVar = (i: number, k: keyof VarRow, v: string) =>
    setVariacoes((prev) => prev.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const isUnica = variacoes.length === 1 && variacoes[0].tipo === 'Única';

  // Margem da primeira variação com preços preenchidos
  const primeiraComPreco = variacoes.find((v) => Number(v.preco) > 0 && Number(v.precoCusto) > 0);
  const margem = primeiraComPreco
    ? (
        ((Number(primeiraComPreco.preco) - Number(primeiraComPreco.precoCusto)) /
          Number(primeiraComPreco.precoCusto)) *
        100
      ).toFixed(1)
    : null;

  const marcaNome = marcas.find((m) => m.id === form.marcaId)?.nome ?? '';

  const gerarSKU = () => {
    if (!form.nome) return;
    const partes = form.nome
      .toUpperCase()
      .split(' ')
      .slice(0, 3)
      .map((p) => p.substring(0, 4));
    const marcaStr = marcaNome ? marcaNome.toUpperCase().substring(0, 4) + '-' : '';
    set('sku', marcaStr + partes.join('-'));
  };

  const adicionarVariacao = () => {
    setVariacoes((prev) => [
      // Se ainda está no modo "Única", converte para modo múltiplas
      ...prev.map((v) =>
        v.tipo === 'Única' && v.valor === 'Única' ? { ...v, tipo: 'Cor', valor: '' } : v,
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
    ]);
  };

  // Gera uma linha de variação por tamanho da grade selecionada.
  const gerarVariacoesDaGrade = () => {
    setGErro('');
    const atributo = gAtributo.trim();
    const valor = gValor.trim();
    if (!atributo) return setGErro('Informe o atributo (ex: Cor)');
    if (!valor) return setGErro('Informe o valor do atributo (ex: Preto)');
    const grade = gradesAtivas.find((g) => g.id === gGradeId);
    if (!grade) return setGErro('Selecione uma grade');

    const skuBase = form.sku.trim();
    const valorSlug = slugSku(valor);
    // Tamanho da grade → linha de variação. O tipo usa o atributo informado
    // (ex: "Cor"); o valor combina atributo + tamanho (ex: "Preto 38") para
    // ficar legível na tabela local. Custo/estoque começam zerados (editáveis);
    // preço herda o promocional/base do produto se já preenchido.
    const precoHerdado = form.precoPromocional?.trim() || '';
    const novas: VarRow[] = grade.tamanhos.map((t, i) => {
      const tamanhoSlug = slugSku(t.valor);
      const sku = [skuBase, valorSlug, tamanhoSlug].filter(Boolean).join('-');
      return {
        id: `grade-${grade.id}-${t.id || t.valor}-${Date.now()}-${i}`,
        tipo: atributo,
        valor: `${valor} ${t.valor}`,
        sku,
        precoCusto: '',
        preco: precoHerdado,
        estoque: '0',
      };
    });

    setVariacoes((prev) => {
      // Remove a linha "Única" placeholder ao entrar em modo múltiplas variações.
      const base = prev.filter(
        (v) => !(v.tipo === 'Única' && v.valor === 'Única' && !v.sku && !v.preco && !v.precoCusto),
      );
      // Evita SKUs duplicados ao gerar em cima de linhas já existentes.
      const skusExistentes = new Set(base.map((v) => v.sku.trim().toUpperCase()).filter(Boolean));
      const semDuplicar = novas.filter((v) => !skusExistentes.has(v.sku.toUpperCase()));
      return [...base, ...semDuplicar];
    });
    setGValor('');
    setGGradeId('');
    setGradeOpen(false);
  };

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};
    if (!form.nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!form.descricao.trim()) novosErros.descricao = 'Descrição é obrigatória';
    if (!form.sku.trim()) novosErros.sku = 'SKU é obrigatório';
    if (!form.categoriaId) novosErros.categoriaId = 'Categoria é obrigatória';
    const temPreco = variacoes.some((v) => Number(v.preco) > 0);
    const temCusto = variacoes.some((v) => Number(v.precoCusto) >= 0 && v.precoCusto !== '');
    if (!temPreco) novosErros.variacoes = 'Informe o preço de venda em pelo menos uma variação';
    if (!temCusto)
      novosErros.variacoesCusto = 'Informe o preço de custo em pelo menos uma variação';
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      const abaDoErro: Record<string, Aba> = {
        nome: 'basico',
        descricao: 'basico',
        sku: 'basico',
        categoriaId: 'basico',
        variacoes: 'basico',
        variacoesCusto: 'basico',
      };
      const primeiro = Object.keys(novosErros)[0];
      if (abaDoErro[primeiro]) setAbaAtiva(abaDoErro[primeiro]);
      return false;
    }
    return true;
  };

  const handleSubmit = async (statusFinal: 'RASCUNHO' | 'ATIVO' = 'RASCUNHO') => {
    if (!validar()) return;
    try {
      const variacoesDTO = variacoes
        .filter((v) => isUnica || v.valor.trim())
        .map((v) => ({
          tipo: v.tipo,
          valor: v.valor || 'Única',
          sku: v.sku || undefined,
          precoCusto: v.precoCusto ? Number(v.precoCusto) : undefined,
          preco: v.preco ? Number(v.preco) : undefined,
          estoque: Number(v.estoque) || 0,
        }));

      // Preço base derivado do mínimo das variações
      const precos = variacoesDTO.map((v) => v.preco ?? 0).filter((p) => p > 0);
      const preco = precos.length > 0 ? Math.min(...precos) : 0;
      const precoCusto = Number(variacoesDTO[0]?.precoCusto) || 0;

      // Sanitiza para o contrato do catalog (forbidNonWhitelisted):
      // `ean`→`gtin`, `preco`→`precoVenda`; `cfop`/`metaPalavrasChave` saem;
      // `imagens` string[] vira o shape {url, principal, ordem}.
      const { ean, cfop, metaPalavrasChave, imagens: imgs, ...camposProduto } = form;
      const dto = {
        ...camposProduto,
        status: statusFinal,
        gtin: ean || undefined,
        // IDs reais do catálogo (catalog-service exige categoriaId UUID; marcaId opcional).
        categoriaId: form.categoriaId,
        marcaId: form.marcaId || undefined,
        precoVenda: preco,
        precoCusto,
        precoPromocional: form.precoPromocional ? Number(form.precoPromocional) : undefined,
        peso: Number(form.peso) || 0,
        altura: Number(form.altura) || 0,
        largura: Number(form.largura) || 0,
        comprimento: Number(form.comprimento) || 0,
        origem: Number(form.origem),
        estoqueMinimo: Number(form.estoqueMinimo) || 5,
        tags: form.tags
          ? form.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        variacoes: variacoesDTO,
        imagens: (imgs ?? []).map((url, i) => ({ url, principal: i === 0, ordem: i })),
      };
      const criado = await criar.mutateAsync(dto as any);
      setSucesso(true);
      setTimeout(() => router.push(`/dashboard/produtos/${criado.id}`), 1200);
    } catch (e) {
      console.error('Erro ao criar produto', e);
    }
  };

  const ABAS: { id: Aba; label: string }[] = [
    { id: 'basico', label: 'Dados Básicos' },
    { id: 'imagens', label: 'Imagens' },
    { id: 'precos', label: 'Preços & Margem' },
    { id: 'dimensoes', label: 'Dimensões' },
    { id: 'fiscal', label: 'Fiscal' },
    { id: 'seo', label: 'SEO' },
  ];

  if (sucesso)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Produto criado com sucesso!
        </h2>
        <p className="text-slate-500">Redirecionando para o produto...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Novo Produto</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Preencha os dados do produto
            </p>
          </div>
        </div>
      </div>

      {/* Ações — acima das abas (padrão do ERP) */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleSubmit('ATIVO')}
          disabled={criar.isPending}
          className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-60"
        >
          {criar.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Publicar Produto
        </button>
        <button
          onClick={() => handleSubmit('RASCUNHO')}
          disabled={criar.isPending}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-60"
        >
          {criar.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salvar Rascunho
        </button>
      </div>

      {/* Abas */}
      <Abas abas={ABAS} ativa={abaAtiva} onChange={setAbaAtiva} />

      {/* Conteúdo */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">

        <div className="p-6">
          {/* ── Dados Básicos ── */}
          {abaAtiva === 'basico' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Nome do Produto *</label>
                <input
                  className={inputCls}
                  value={form.nome}
                  onChange={(e) => set('nome', e.target.value)}
                  placeholder="Ex: iPhone 15 Pro 256GB"
                />
                {erros.nome && <p className="mt-1 text-xs text-red-500">{erros.nome}</p>}
              </div>
              <div>
                <label className={labelCls}>Descrição Curta</label>
                <input
                  className={inputCls}
                  value={form.descricaoCurta}
                  onChange={(e) => set('descricaoCurta', e.target.value)}
                  placeholder="Resumo em até 150 caracteres"
                  maxLength={150}
                />
              </div>
              <div>
                <label className={labelCls}>Descrição Completa *</label>
                <textarea
                  className={inputCls}
                  rows={4}
                  value={form.descricao}
                  onChange={(e) => set('descricao', e.target.value)}
                  placeholder="Detalhe características, materiais, uso..."
                />
                {erros.descricao && <p className="mt-1 text-xs text-red-500">{erros.descricao}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>SKU *</label>
                  <div className="flex gap-2">
                    <input
                      className={inputCls}
                      value={form.sku}
                      onChange={(e) => set('sku', e.target.value)}
                      placeholder="MARCA-PROD-VAR"
                    />
                    <button
                      type="button"
                      onClick={gerarSKU}
                      className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                      title="Auto-gerar SKU"
                    >
                      Gerar
                    </button>
                  </div>
                  {erros.sku && <p className="mt-1 text-xs text-red-500">{erros.sku}</p>}
                </div>
                <div>
                  <label className={labelCls}>EAN/GTIN</label>
                  <input
                    className={inputCls}
                    value={form.ean}
                    onChange={(e) => set('ean', e.target.value)}
                    placeholder="Código de barras (13 dígitos)"
                    maxLength={14}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Marca</label>
                  <select
                    className={inputCls}
                    value={form.marcaId}
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
                  {!loadingMarcas && marcas.length === 0 && (
                    <p className="mt-1 text-xs text-slate-400">
                      Nenhuma marca cadastrada.{' '}
                      <Link
                        href="/dashboard/produtos/marcas"
                        className="text-marca-600 hover:underline dark:text-marca-400"
                      >
                        Cadastrar marca
                      </Link>
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Categoria *</label>
                  <select
                    className={inputCls}
                    value={form.categoriaId}
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
                  {erros.categoriaId && (
                    <p className="mt-1 text-xs text-red-500">{erros.categoriaId}</p>
                  )}
                  {!loadingCategorias && categorias.length === 0 && (
                    <p className="mt-1 text-xs text-slate-400">
                      Nenhuma categoria cadastrada.{' '}
                      <Link
                        href="/dashboard/produtos/categorias"
                        className="text-marca-600 hover:underline dark:text-marca-400"
                      >
                        Cadastrar categoria
                      </Link>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className={labelCls}>Tags (separadas por vírgula)</label>
                <input
                  className={inputCls}
                  value={form.tags}
                  onChange={(e) => set('tags', e.target.value)}
                  placeholder="ex: premium, 5g, novo, destaque"
                />
              </div>

              {/* ── Variações e Preços ── */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Variações e Preços
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isUnica
                        ? 'Produto sem variação — use "Única" ou adicione variantes.'
                        : 'Cada variação tem seu próprio custo e preço de venda.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGradeOpen((o) => !o);
                        setGErro('');
                      }}
                      className="flex items-center gap-1 text-xs font-medium text-marca-600 hover:underline dark:text-marca-400"
                    >
                      <Grid3x3 className="h-3 w-3" /> + Variação por grade
                    </button>
                    <button
                      type="button"
                      onClick={adicionarVariacao}
                      className="flex items-center gap-1 text-xs text-marca-600 hover:underline dark:text-marca-400"
                    >
                      <Plus className="h-3 w-3" /> Adicionar variação
                    </button>
                  </div>
                </div>

                {/* Gerador por grade */}
                {gradeOpen && (
                  <div className="mb-3 rounded-xl border border-marca-200 bg-marca-50/40 p-4 dark:border-marca-800 dark:bg-marca-900/10">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-marca-500">
                          <Grid3x3 className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            Gerar variações por grade
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Uma variação por tamanho (ex: Cor Preto × 34–44). SKU automático a
                            partir do SKU do produto.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGradeOpen(false)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                        title="Fechar"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {gradesAtivas.length === 0 && !loadingGrades ? (
                      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/20">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <p className="text-amber-700 dark:text-amber-400">
                          Nenhuma grade ativa com tamanhos.{' '}
                          <Link
                            href="/dashboard/produtos/grades"
                            className="font-semibold underline"
                          >
                            Cadastre uma grade
                          </Link>{' '}
                          para gerar variações.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div>
                            <label className={labelCls}>Atributo</label>
                            <input
                              className={inputCls}
                              value={gAtributo}
                              onChange={(e) => setGAtributo(e.target.value)}
                              placeholder="Cor"
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Valor do atributo</label>
                            <input
                              className={inputCls}
                              value={gValor}
                              onChange={(e) => setGValor(e.target.value)}
                              placeholder="Ex: Preto"
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Grade</label>
                            <select
                              className={inputCls}
                              value={gGradeId}
                              onChange={(e) => setGGradeId(e.target.value)}
                              disabled={loadingGrades}
                            >
                              <option value="">
                                {loadingGrades ? 'Carregando...' : 'Selecione...'}
                              </option>
                              {gradesAtivas.map((g) => (
                                <option key={g.id} value={g.id}>
                                  {g.nome} ({g.tamanhos.length} tamanhos)
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {gErro && <p className="mt-2 text-xs text-red-500">{gErro}</p>}
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={gerarVariacoesDaGrade}
                            className="flex items-center gap-1.5 rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-600"
                          >
                            <Wand2 className="h-4 w-4" /> Gerar variações
                          </button>
                          {!form.sku.trim() && (
                            <span className="text-xs text-amber-600 dark:text-amber-400">
                              Dica: preencha o SKU do produto para gerar SKUs completos.
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Erro geral de preço */}
                {(erros.variacoes || erros.variacoesCusto) && (
                  <p className="mb-2 text-xs text-red-500">
                    {erros.variacoes || erros.variacoesCusto}
                  </p>
                )}

                {/* Grid header */}
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
                    Custo (R$) *
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">
                    Venda (R$) *
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase pl-1">
                    Estoque
                  </span>
                  <span />
                </div>

                <div className="space-y-2">
                  {variacoes.map((v, i) => (
                    <div
                      key={v.id}
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
                                  sku: '',
                                  precoCusto: '',
                                  preco: '',
                                  estoque: '0',
                                },
                              ])
                        }
                        className="rounded p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title={variacoes.length > 1 ? 'Remover variação' : 'Limpar'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Imagens ── */}
          {abaAtiva === 'imagens' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-1 text-base font-semibold">Fotos do produto</h2>
              <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                A primeira imagem é a capa. Estas fotos aparecem na vitrine e nos anúncios dos
                marketplaces.
              </p>
              <GaleriaImagens
                value={form.imagens}
                onChange={(urls) => setForm((f) => ({ ...f, imagens: urls }))}
              />
            </div>
          )}

          {/* ── Preços & Margem ── */}
          {abaAtiva === 'precos' && (
            <div className="space-y-6">
              {/* Resumo por variação */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Resumo de Preços por Variação
                </h3>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        {!isUnica && (
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">
                            Variação
                          </th>
                        )}
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {variacoes.map((v) => {
                        const preco = Number(v.preco);
                        const custo = Number(v.precoCusto);
                        const mg =
                          custo > 0 && preco > 0
                            ? (((preco - custo) / custo) * 100).toFixed(1)
                            : null;
                        const lucro = preco - custo;
                        return (
                          <tr key={v.id} className="bg-white dark:bg-slate-800">
                            {!isUnica && (
                              <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                                {v.tipo}: {v.valor || '—'}
                              </td>
                            )}
                            <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">
                              {custo > 0 ? moeda(custo) : '—'}
                            </td>
                            <td className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">
                              {preco > 0 ? moeda(preco) : '—'}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {mg !== null ? (
                                <span
                                  className={`font-bold ${Number(mg) >= 40 ? 'text-green-600' : Number(mg) >= 20 ? 'text-amber-600' : 'text-red-600'}`}
                                >
                                  {mg}%
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">
                              {preco > 0 && custo > 0 ? moeda(lucro) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Margem em destaque */}
              {margem !== null && (
                <div
                  className={`rounded-xl border p-4 ${Number(margem) >= 40 ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' : Number(margem) >= 20 ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'}`}
                >
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Margem de Lucro (1ª variação)
                  </p>
                  <span
                    className={`text-3xl font-bold ${Number(margem) >= 40 ? 'text-green-600' : Number(margem) >= 20 ? 'text-amber-600' : 'text-red-600'}`}
                  >
                    {margem}%
                  </span>
                  {Number(margem) < 20 && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      ⚠️ Margem abaixo de 20% — revise a precificação
                    </p>
                  )}
                </div>
              )}

              {/* Preço promocional e estoque mínimo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Preço Promocional (R$)</label>
                  <input
                    className={inputCls}
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.precoPromocional}
                    onChange={(e) => set('precoPromocional', e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
                <div>
                  <label className={labelCls}>Estoque Mínimo para alerta</label>
                  <input
                    className={inputCls}
                    type="number"
                    min="0"
                    value={form.estoqueMinimo}
                    onChange={(e) => set('estoqueMinimo', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Dimensões ── */}
          {abaAtiva === 'dimensoes' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-700/50 dark:text-slate-400 flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0" /> Dimensões e peso são usados para cálculo de
                frete.
              </div>
              <div>
                <label className={labelCls}>Peso (gramas)</label>
                <input
                  className={`${inputCls} max-w-xs`}
                  type="number"
                  min="0"
                  value={form.peso}
                  onChange={(e) => set('peso', e.target.value)}
                  placeholder="Ex: 187"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  ['altura', 'Altura (cm)'],
                  ['largura', 'Largura (cm)'],
                  ['comprimento', 'Comprimento (cm)'],
                ].map(([k, label]) => (
                  <div key={k}>
                    <label className={labelCls}>{label}</label>
                    <input
                      className={inputCls}
                      type="number"
                      min="0"
                      step="0.1"
                      value={(form as any)[k]}
                      onChange={(e) => set(k, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Fiscal ── */}
          {abaAtiva === 'fiscal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>NCM (8 dígitos)</label>
                  <input
                    className={inputCls}
                    value={form.ncm}
                    onChange={(e) => set('ncm', e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="00000000"
                    maxLength={8}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Nomenclatura Comum do Mercosul — obrigatório para NF-e
                  </p>
                </div>
                <div>
                  <label className={labelCls}>CFOP (4 dígitos)</label>
                  <input
                    className={inputCls}
                    value={form.cfop}
                    onChange={(e) => set('cfop', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="5102"
                    maxLength={4}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Origem da Mercadoria</label>
                <select
                  className={`${inputCls} max-w-sm`}
                  value={form.origem}
                  onChange={(e) => set('origem', e.target.value)}
                >
                  <option value="0">0 — Nacional</option>
                  <option value="1">1 — Estrangeiro (importação direta)</option>
                  <option value="2">2 — Estrangeiro (mercado interno)</option>
                </select>
              </div>
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/20">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                    Dica IA
                  </span>
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Preencha nome, descrição e categoria primeiro. Após criar o produto, acesse a aba{' '}
                  <strong>✦ IA</strong> para obter sugestão de NCM automática.
                </p>
              </div>
            </div>
          )}

          {/* ── SEO ── */}
          {abaAtiva === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Meta Descrição (até 160 caracteres)</label>
                <textarea
                  className={inputCls}
                  rows={3}
                  value={form.metaDescricao}
                  onChange={(e) => set('metaDescricao', e.target.value)}
                  maxLength={160}
                  placeholder="Descrição para aparecer nos resultados de busca..."
                />
                <p className="mt-1 text-xs text-slate-500">{form.metaDescricao.length}/160</p>
              </div>
              <div>
                <label className={labelCls}>Palavras-chave (separadas por vírgula)</label>
                <input
                  className={inputCls}
                  value={form.metaPalavrasChave}
                  onChange={(e) => set('metaPalavrasChave', e.target.value)}
                  placeholder="iphone, apple, smartphone, 5g"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
