'use client';

/**
 * Conferência da NF-e ANTES de confirmar a importação.
 *
 * Mostra o que foi reconhecido e deixa o usuário resolver o que faltou:
 * - FORNECEDOR: não achou → escolhe um do cadastro ou cadastra o da nota;
 *               achou com diferenças → escolhe quais campos atualizar.
 * - ITENS: já vinculado (De-Para de uma nota anterior), sugerido por SKU/EAN,
 *          ou sem vínculo → escolhe um produto do catálogo ou cadastra novo.
 *
 * Toda vinculação feita aqui vira De-Para no servidor: a PRÓXIMA nota do mesmo
 * fornecedor já reconhece o item sozinha.
 */

import { useMemo, useState } from 'react';
import {
  Building2,
  Package,
  CheckCircle2,
  AlertTriangle,
  Link2,
  PlusCircle,
  SkipForward,
  Loader2,
  FileCheck,
  Search,
  Sparkles,
} from 'lucide-react';
import type {
  AnaliseNFe,
  ConfirmacaoImportacao,
  ItemAnalise,
} from '@/hooks/useCompras';
import { useCategorias } from '@/hooks/useCategorias';
import { useFornecedores } from '@/hooks/useFornecedores';

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** GTIN só vale se for numérico de 8/12/13/14 dígitos (a NF-e manda "SEM GTIN"). */
const eanValido = (v: string | null | undefined): string | undefined => {
  const so = String(v ?? '').replace(/\D/g, '');
  return [8, 12, 13, 14].includes(so.length) ? so : undefined;
};

/** Arredonda para N casas — o vUnCom da nota tem até 10 e o DTO recusa. */
const arredondar = (v: number, casas: number) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 10 ** casas) / 10 ** casas;
};

type AcaoItem = 'VINCULAR' | 'CRIAR' | 'IGNORAR';

interface DecisaoItemUI {
  acao: AcaoItem;
  produtoId?: string;
  nome: string;
  sku: string;
  categoriaId?: string;
  precoVenda?: string;
}

interface Props {
  analise: AnaliseNFe;
  confirmando: boolean;
  erro?: string;
  onConfirmar: (payload: Omit<ConfirmacaoImportacao, 'xml'>) => void;
  onCancelar: () => void;
}

export function ConferenciaNFe({ analise, confirmando, erro, onConfirmar, onCancelar }: Props) {
  const { data: categoriasResp } = useCategorias();
  const categorias = useMemo(() => {
    const lista = (categoriasResp as unknown as { dados?: Array<{ id: string; nome: string }> })
      ?.dados;
    return Array.isArray(lista) ? lista : Array.isArray(categoriasResp) ? (categoriasResp as Array<{ id: string; nome: string }>) : [];
  }, [categoriasResp]);
  const categoriaPadrao = categorias[0]?.id;

  const [buscaFornecedor, setBuscaFornecedor] = useState('');
  const { data: fornecedoresResp } = useFornecedores({ limite: 50 } as never);
  const fornecedores = useMemo(() => {
    const lista = (fornecedoresResp as unknown as { dados?: Array<{ id: string; nome: string }> })
      ?.dados;
    const arr = Array.isArray(lista) ? lista : [];
    const termo = buscaFornecedor.trim().toLowerCase();
    return termo ? arr.filter((f) => (f.nome ?? '').toLowerCase().includes(termo)) : arr;
  }, [fornecedoresResp, buscaFornecedor]);

  // ── Decisão do fornecedor ────────────────────────────────────────────────
  const achou = analise.fornecedor.status === 'ENCONTRADO';
  const [acaoFornecedor, setAcaoFornecedor] = useState<'USAR_EXISTENTE' | 'CRIAR'>(
    achou ? 'USAR_EXISTENTE' : 'CRIAR',
  );
  const [clienteId, setClienteId] = useState<string>(analise.fornecedor.cadastro?.id ?? '');
  const [camposAtualizar, setCamposAtualizar] = useState<Set<string>>(new Set());

  const alternarCampo = (campo: string) =>
    setCamposAtualizar((prev) => {
      const novo = new Set(prev);
      if (novo.has(campo)) novo.delete(campo);
      else novo.add(campo);
      return novo;
    });

  // ── Decisões dos itens ───────────────────────────────────────────────────
  const [decisoes, setDecisoes] = useState<Record<string, DecisaoItemUI>>(() => {
    const inicial: Record<string, DecisaoItemUI> = {};
    for (const item of analise.itens) {
      inicial[item.codigo] = item.produto
        ? {
            acao: 'VINCULAR',
            produtoId: item.produto.id,
            nome: item.produto.nome,
            sku: item.produto.sku,
          }
        : {
            // Sem vínculo, o padrão é CADASTRAR (o objetivo da compra é ter o
            // item no estoque). O usuário pode trocar para vincular ou ignorar.
            acao: 'CRIAR',
            nome: item.descricao,
            sku: item.codigo,
            precoVenda: '',
          };
    }
    return inicial;
  });

  const setDecisao = (codigo: string, patch: Partial<DecisaoItemUI>) =>
    setDecisoes((prev) => ({ ...prev, [codigo]: { ...prev[codigo], ...patch } }));

  // ── Validação do que falta antes de confirmar ────────────────────────────
  const pendencias = useMemo(() => {
    const lista: string[] = [];
    if (acaoFornecedor === 'USAR_EXISTENTE' && !clienteId) {
      lista.push('Selecione o fornecedor no cadastro (ou escolha cadastrar o da NF-e).');
    }
    for (const item of analise.itens) {
      const d = decisoes[item.codigo];
      if (!d) continue;
      if (d.acao === 'VINCULAR' && !d.produtoId) {
        lista.push(`Item ${item.codigo}: escolha o produto do catálogo.`);
      }
      if (d.acao === 'CRIAR') {
        if (!d.nome?.trim() || !d.sku?.trim()) {
          lista.push(`Item ${item.codigo}: informe nome e SKU do produto novo.`);
        }
        if (!(d.categoriaId || categoriaPadrao)) {
          lista.push(`Item ${item.codigo}: escolha a categoria do produto novo.`);
        }
      }
    }
    return lista;
  }, [acaoFornecedor, clienteId, decisoes, analise.itens, categoriaPadrao]);

  const totais = useMemo(() => {
    const vals = Object.values(decisoes);
    return {
      vincular: vals.filter((d) => d.acao === 'VINCULAR').length,
      criar: vals.filter((d) => d.acao === 'CRIAR').length,
      ignorar: vals.filter((d) => d.acao === 'IGNORAR').length,
    };
  }, [decisoes]);

  const confirmar = () => {
    if (pendencias.length > 0) return;
    onConfirmar({
      fornecedor: {
        acao:
          acaoFornecedor === 'CRIAR'
            ? 'CRIAR'
            : camposAtualizar.size > 0
              ? 'ATUALIZAR'
              : 'USAR_EXISTENTE',
        clienteId: acaoFornecedor === 'CRIAR' ? undefined : clienteId,
        camposAtualizar: camposAtualizar.size > 0 ? [...camposAtualizar] : undefined,
      },
      itens: analise.itens.map((item) => {
        const d = decisoes[item.codigo];
        if (d?.acao === 'VINCULAR') {
          return { codigo: item.codigo, acao: 'VINCULAR' as const, produtoId: d.produtoId, salvarVinculo: true };
        }
        if (d?.acao === 'CRIAR') {
          return {
            codigo: item.codigo,
            acao: 'CRIAR' as const,
            salvarVinculo: true,
            novoProduto: {
              nome: d.nome.trim(),
              // O catálogo aceita SKU de até 50 caracteres (o cProd vai até 60).
              sku: d.sku.trim().slice(0, 50),
              categoriaId: d.categoriaId || categoriaPadrao,
              // vUnCom da NF-e tem até 10 casas; o DTO recusa mais de 4.
              precoCusto: arredondar(item.valorUnitario, 4),
              // O catálogo exige preço de venda >= 1: o piso evita derrubar a
              // nota inteira por causa de item barato ou bonificação (R$ 0).
              precoVenda: d.precoVenda
                ? Math.max(1, arredondar(Number(d.precoVenda), 2))
                : undefined,
              // "SEM GTIN" não é EAN — gravar contaminaria o match das próximas notas.
              ean: eanValido(item.ean),
              ncm: item.ncm || undefined,
              unidade: item.unidade || undefined,
            },
          };
        }
        return { codigo: item.codigo, acao: 'IGNORAR' as const };
      }),
    });
  };

  return (
    <div className="space-y-5">
      {/* Cabeçalho da nota */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
              <FileCheck className="h-5 w-5 text-marca-500" />
              Conferência da NF-e {analise.nfe.numero}/{analise.nfe.serie}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {analise.nfe.naturezaOperacao} · Emissão{' '}
              {analise.nfe.dataEmissao
                ? new Date(analise.nfe.dataEmissao).toLocaleDateString('pt-BR')
                : '—'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Total da nota</p>
            <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
              {fmt(analise.nfe.totais.valorTotal)}
            </p>
          </div>
        </div>

        {analise.jaImportada && (
          <p className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Esta NF-e já foi importada no pedido {analise.jaImportada.numero} — a confirmação será
            recusada.
          </p>
        )}
      </div>

      {/* ── Fornecedor ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <Building2 className="h-4 w-4 text-marca-500" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Fornecedor</h3>
          {achou ? (
            <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Localizado no cadastro
            </span>
          ) : (
            <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertTriangle className="h-3 w-3" /> Não encontrado
            </span>
          )}
        </div>

        <div className="space-y-4 p-5">
          {/* Dados da nota */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label="Razão social (NF-e)" valor={analise.fornecedor.daNfe.razaoSocial} />
            <Campo label="CNPJ" valor={analise.fornecedor.daNfe.cnpj} mono />
            <Campo label="Nome fantasia" valor={analise.fornecedor.daNfe.nomeFantasia} />
            <Campo label="Inscrição estadual" valor={analise.fornecedor.daNfe.inscricaoEstadual} />
          </div>

          {/* Diferenças (só quando achou e há divergência) */}
          {achou && analise.fornecedor.diferencas.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                O cadastro está diferente da NF-e. Deseja atualizar?
              </p>
              <p className="mt-0.5 text-xs text-amber-700/80 dark:text-amber-400/80">
                Marque o que quer gravar no cadastro do fornecedor. Nada é alterado sem marcar.
              </p>
              <div className="mt-3 space-y-2">
                {analise.fornecedor.diferencas.map((d) => (
                  <label
                    key={d.campo}
                    className="flex cursor-pointer items-start gap-3 rounded-lg bg-white/70 p-2.5 dark:bg-slate-800/60"
                  >
                    <input
                      type="checkbox"
                      checked={camposAtualizar.has(d.campo)}
                      onChange={() => alternarCampo(d.campo)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-marca-600 focus:ring-marca-400"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {d.label}
                      </span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-400 line-through">
                          {d.valorCadastro || '(vazio)'}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {d.valorNfe}
                        </span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {achou && analise.fornecedor.diferencas.length === 0 && (
            <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Cadastro em dia: <strong>{analise.fornecedor.cadastro?.nome}</strong> — nada a
              atualizar.
            </p>
          )}

          {/* Escolha quando NÃO encontrou */}
          {!achou && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <BotaoEscolha
                  ativo={acaoFornecedor === 'CRIAR'}
                  onClick={() => setAcaoFornecedor('CRIAR')}
                  icone={<PlusCircle className="h-4 w-4" />}
                  titulo="Cadastrar o da NF-e"
                  descricao="Cria o fornecedor com os dados da nota"
                />
                <BotaoEscolha
                  ativo={acaoFornecedor === 'USAR_EXISTENTE'}
                  onClick={() => setAcaoFornecedor('USAR_EXISTENTE')}
                  icone={<Link2 className="h-4 w-4" />}
                  titulo="Selecionar do cadastro"
                  descricao="Vincula a um fornecedor já existente"
                />
              </div>

              {acaoFornecedor === 'USAR_EXISTENTE' && (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={buscaFornecedor}
                      onChange={(e) => setBuscaFornecedor(e.target.value)}
                      placeholder="Buscar fornecedor..."
                      className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Selecione o fornecedor...</option>
                    {fornecedores.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {acaoFornecedor === 'CRIAR' && !analise.fornecedor.daNfe.email && (
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                  A NF-e não traz e-mail do emitente. O cadastro exige um, então será gravado um
                  marcador com o CNPJ — edite depois na ficha do fornecedor.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Itens ───────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <Package className="h-4 w-4 text-marca-500" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Produtos ({analise.itens.length})
          </h3>
          <div className="ml-auto flex flex-wrap gap-2 text-xs">
            <Pill cor="emerald" texto={`${totais.vincular} vincular`} />
            <Pill cor="blue" texto={`${totais.criar} cadastrar`} />
            {totais.ignorar > 0 && <Pill cor="slate" texto={`${totais.ignorar} ignorar`} />}
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {analise.itens.map((item, i) => (
            <LinhaItem
              // A NF-e pode repetir o mesmo cProd em linhas `det` diferentes
              // (lote/CFOP distintos): o índice evita chave React duplicada.
              key={`${item.codigo}-${i}`}
              item={item}
              decisao={decisoes[item.codigo]}
              categorias={categorias}
              onChange={(patch) => setDecisao(item.codigo, patch)}
            />
          ))}
        </div>
      </div>

      {/* ── Rodapé: pendências + confirmar ──────────────────────────────── */}
      {categorias.length === 0 && totais.criar > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/20">
          <p className="font-semibold text-amber-800 dark:text-amber-300">
            Nenhuma categoria cadastrada
          </p>
          <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
            O catálogo exige categoria para criar produto. Cadastre uma em Produtos › Categorias,
            ou marque os itens como “Vincular”/“Ignorar” para importar mesmo assim.
          </p>
        </div>
      )}

      {pendencias.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            Falta resolver antes de importar:
          </p>
          <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-xs text-amber-700 dark:text-amber-400">
            {pendencias.slice(0, 6).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {erro && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
          {erro}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={confirmar}
          disabled={confirmando || pendencias.length > 0 || !!analise.jaImportada}
          className="flex items-center gap-2 rounded-xl bg-marca-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-marca-600 disabled:opacity-50"
        >
          {confirmando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          Confirmar importação
        </button>
        <button
          onClick={onCancelar}
          disabled={confirmando}
          className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Cancelar
        </button>
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Sparkles className="h-3.5 w-3.5" />
          Os vínculos criados aqui fazem a próxima nota deste fornecedor já reconhecer os produtos.
        </span>
      </div>
    </div>
  );
}

// ─── Subcomponentes ─────────────────────────────────────────────────────────

function Campo({ label, valor, mono }: { label: string; valor: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`text-sm font-medium text-slate-800 dark:text-slate-200 ${mono ? 'font-mono' : ''}`}
      >
        {valor || '—'}
      </p>
    </div>
  );
}

function Pill({ cor, texto }: { cor: 'emerald' | 'blue' | 'slate'; texto: string }) {
  const cores = {
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  };
  return <span className={`rounded-full px-2.5 py-0.5 font-semibold ${cores[cor]}`}>{texto}</span>;
}

function BotaoEscolha({
  ativo,
  onClick,
  icone,
  titulo,
  descricao,
}: {
  ativo: boolean;
  onClick: () => void;
  icone: React.ReactNode;
  titulo: string;
  descricao: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 min-w-[200px] items-start gap-2 rounded-xl border-2 p-3 text-left transition-colors ${
        ativo
          ? 'border-marca-500 bg-marca-50 dark:bg-marca-900/20'
          : 'border-slate-200 hover:border-slate-300 dark:border-slate-600'
      }`}
    >
      <span className={ativo ? 'text-marca-600 dark:text-marca-400' : 'text-slate-400'}>
        {icone}
      </span>
      <span>
        <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
          {titulo}
        </span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">{descricao}</span>
      </span>
    </button>
  );
}

function LinhaItem({
  item,
  decisao,
  categorias,
  onChange,
}: {
  item: ItemAnalise;
  decisao?: DecisaoItemUI;
  categorias: Array<{ id: string; nome: string }>;
  onChange: (patch: Partial<DecisaoItemUI>) => void;
}) {
  if (!decisao) return null;

  const badge =
    item.status === 'VINCULADO'
      ? { texto: 'Vínculo salvo', classe: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' }
      : item.status === 'SUGERIDO'
        ? {
            texto: `Sugerido por ${item.origemVinculo === 'EAN' ? 'EAN' : 'SKU'}`,
            classe: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          }
        : { texto: 'Sem vínculo', classe: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };

  return (
    <div className="px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-slate-500">{item.codigo}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.classe}`}>
              {badge.texto}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
            {item.descricao}
          </p>
          <p className="text-xs text-slate-400">
            {item.quantidade} {item.unidade} × {fmt(item.valorUnitario)} = {fmt(item.valorTotal)}
            {item.ean ? ` · EAN ${item.ean}` : ''}
            {item.ncm ? ` · NCM ${item.ncm}` : ''}
          </p>
        </div>

        {/* Ações do item */}
        <div className="flex shrink-0 gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-600">
          {(
            [
              { acao: 'VINCULAR' as const, icone: <Link2 className="h-3.5 w-3.5" />, titulo: 'Vincular' },
              { acao: 'CRIAR' as const, icone: <PlusCircle className="h-3.5 w-3.5" />, titulo: 'Cadastrar' },
              { acao: 'IGNORAR' as const, icone: <SkipForward className="h-3.5 w-3.5" />, titulo: 'Ignorar' },
            ] as const
          ).map((op) => (
            <button
              key={op.acao}
              onClick={() =>
                onChange(
                  // Ao trocar para "Cadastrar", o nome/SKU voltam a ser os da
                  // NOTA. Sem isso herdaria o SKU do produto que estava vinculado
                  // e o catálogo recusaria por duplicidade.
                  op.acao === 'CRIAR'
                    ? { acao: op.acao, nome: item.descricao, sku: item.codigo }
                    : { acao: op.acao },
                )
              }
              title={op.titulo}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
                decisao.acao === op.acao
                  ? 'bg-marca-500 text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {op.icone}
              {op.titulo}
            </button>
          ))}
        </div>
      </div>

      {/* Detalhe conforme a ação */}
      {decisao.acao === 'VINCULAR' && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
          {item.produto || item.candidatos.length > 0 ? (
            <select
              value={decisao.produtoId ?? ''}
              onChange={(e) => onChange({ produtoId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Selecione o produto do catálogo...</option>
              {item.produto && (
                <option value={item.produto.id}>
                  {item.produto.sku} — {item.produto.nome}
                </option>
              )}
              {item.candidatos
                .filter((c) => c.id !== item.produto?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.sku} — {c.nome}
                  </option>
                ))}
            </select>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nenhum produto parecido foi encontrado no catálogo. Use “Cadastrar” para criar este
              item.
            </p>
          )}
        </div>
      )}

      {decisao.acao === 'CRIAR' && (
        <div className="mt-3 grid gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Nome do produto
            </label>
            <input
              value={decisao.nome}
              onChange={(e) => onChange({ nome: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              SKU no seu catálogo
            </label>
            <input
              value={decisao.sku}
              onChange={(e) => onChange({ sku: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Categoria
            </label>
            <select
              value={decisao.categoriaId ?? categorias[0]?.id ?? ''}
              onChange={(e) => onChange({ categoriaId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              {categorias.length === 0 && <option value="">Nenhuma categoria cadastrada</option>}
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Preço de venda (opcional)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={decisao.precoVenda ?? ''}
              onChange={(e) => onChange({ precoVenda: e.target.value })}
              placeholder={`custo ${fmt(item.valorUnitario)}`}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Em branco: usa o custo da nota como preço inicial.
            </p>
          </div>
        </div>
      )}

      {decisao.acao === 'IGNORAR' && (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
          Entra no pedido apenas como registro fiscal — não vira produto e o recebimento não
          movimenta estoque.
        </p>
      )}
    </div>
  );
}
