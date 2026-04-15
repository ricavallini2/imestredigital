'use client';

/**
 * Página de Anúncios dos Marketplaces
 * Listagem completa com filtros, edição de preço e gestão de status
 */

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  Plus,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Eye,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useAnuncios, useAtualizarAnuncio, Anuncio, StatusAnuncio } from '@/hooks/useMarketplaces';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const CANAL_CONFIG: Record<string, { emoji: string; cor: string; corText: string }> = {
  MERCADO_LIVRE: { emoji: '🟠', cor: 'bg-yellow-100 dark:bg-yellow-900/30', corText: 'text-yellow-700 dark:text-yellow-400' },
  SHOPEE:        { emoji: '🔴', cor: 'bg-orange-100 dark:bg-orange-900/30', corText: 'text-orange-700 dark:text-orange-400' },
  AMAZON:        { emoji: '🟤', cor: 'bg-amber-100  dark:bg-amber-900/30',  corText: 'text-amber-700  dark:text-amber-400'  },
  SHOPIFY:       { emoji: '🟢', cor: 'bg-green-100  dark:bg-green-900/30',  corText: 'text-green-700  dark:text-green-400'  },
  MAGALU:        { emoji: '🔵', cor: 'bg-blue-100   dark:bg-blue-900/30',   corText: 'text-blue-700   dark:text-blue-400'   },
};

const STATUS_CONFIG: Record<StatusAnuncio, { label: string; cls: string }> = {
  ATIVO:       { label: 'Ativo',       cls: 'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400'  },
  PAUSADO:     { label: 'Pausado',     cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  SEM_ESTOQUE: { label: 'Sem Estoque', cls: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400'    },
  REMOVIDO:    { label: 'Removido',    cls: 'bg-slate-100  text-slate-600  dark:bg-slate-700     dark:text-slate-400'  },
  BLOQUEADO:   { label: 'Bloqueado',   cls: 'bg-red-200    text-red-800    dark:bg-red-900/40    dark:text-red-300'    },
};

const TAXA_CANAL: Record<string, number> = {
  MERCADO_LIVRE: 13,
  SHOPEE:        20,
  AMAZON:        15,
  SHOPIFY:        2,
  MAGALU:        16,
};

function precoLiquido(preco: number, canal: string) {
  const taxa = TAXA_CANAL[canal] ?? 0;
  return preco * (1 - taxa / 100);
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`} />;
}

// ─── Editar Preço Modal ───────────────────────────────────────────────────────

interface EditarPrecoModalProps {
  anuncio: Anuncio;
  onClose: () => void;
  onSave: (id: string, preco: number, precoPromo: number | null) => void;
  salvando: boolean;
}

function EditarPrecoModal({ anuncio, onClose, onSave, salvando }: EditarPrecoModalProps) {
  const [preco, setPreco]         = useState(anuncio.preco.toString());
  const [precoPromo, setPrecoPromo] = useState(anuncio.precoPromocional?.toString() ?? '');

  const taxa = TAXA_CANAL[anuncio.canal] ?? 0;
  const precoNum = parseFloat(preco) || 0;
  const liquido  = precoNum * (1 - taxa / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Editar Preço</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{anuncio.titulo}</p>
            <p className="text-xs text-slate-400 font-mono">{anuncio.sku} · {anuncio.canal.replace('_', ' ')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Preço de Venda (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
            {precoNum > 0 && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                Líquido após taxa ({taxa}%): {brl(liquido)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Preço Promocional (opcional)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={precoPromo}
              onChange={(e) => setPrecoPromo(e.target.value)}
              placeholder="Deixe em branco para remover"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>

          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Taxa de plataforma: <strong>{taxa}%</strong>. Custo médio: {brl(anuncio.custoMedio)}.
                Margem estimada: {precoNum > 0 ? brl(liquido - anuncio.custoMedio) : '—'}.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 px-5 py-4 dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            disabled={salvando || !preco || parseFloat(preco) <= 0}
            onClick={() =>
              onSave(
                anuncio.id,
                parseFloat(preco),
                precoPromo ? parseFloat(precoPromo) : null,
              )
            }
            className="flex-1 rounded-lg bg-marca-500 py-2 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-50 dark:bg-marca-600"
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const LIMITE = 12;
const STATUS_CHIPS: { label: string; value: string }[] = [
  { label: 'Todos',      value: '' },
  { label: 'Ativo',      value: 'ATIVO' },
  { label: 'Pausado',    value: 'PAUSADO' },
  { label: 'Sem Estoque', value: 'SEM_ESTOQUE' },
  { label: 'Bloqueado',  value: 'BLOQUEADO' },
];

export default function AnunciosPage() {
  const searchParams = useSearchParams();
  const canalInicial = searchParams.get('canal') ?? '';

  const [busca,    setBusca]    = useState('');
  const [canal,    setCanal]    = useState(canalInicial);
  const [status,   setStatus]   = useState('');
  const [pagina,   setPagina]   = useState(1);
  const [editando, setEditando] = useState<Anuncio | null>(null);

  const filtros = useMemo(() => ({
    busca: busca || undefined,
    canal: canal  || undefined,
    status: status || undefined,
    pagina,
    limite: LIMITE,
  }), [busca, canal, status, pagina]);

  const { data, isLoading } = useAnuncios(filtros as Parameters<typeof useAnuncios>[0]);
  const atualizar = useAtualizarAnuncio();

  const anuncios      = data?.dados ?? [];
  const total         = data?.total ?? 0;
  const totalPaginas  = data?.totalPaginas ?? 1;

  // Summary counts (from full data, approximate from current page)
  const ativos      = anuncios.filter((a) => a.status === 'ATIVO').length;
  const semEstoque  = anuncios.filter((a) => a.status === 'SEM_ESTOQUE').length;
  const receita30d  = anuncios.reduce((s, a) => s + a.receita30d, 0);

  const handleToggleStatus = async (anuncio: Anuncio) => {
    const novoStatus: StatusAnuncio =
      anuncio.status === 'ATIVO' ? 'PAUSADO' : 'ATIVO';
    await atualizar.mutateAsync({ id: anuncio.id, dto: { status: novoStatus } });
  };

  const handleSavePreco = async (
    id: string,
    preco: number,
    precoPromo: number | null,
  ) => {
    await atualizar.mutateAsync({
      id,
      dto: {
        preco,
        precoPromocional: precoPromo ?? undefined,
      },
    });
    setEditando(null);
  };

  const resetFiltros = () => {
    setBusca('');
    setCanal('');
    setStatus('');
    setPagina(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Anúncios</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Gerencie preços, estoque e status dos seus anúncios
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-marca-600 dark:bg-marca-600">
          <Plus className="h-4 w-4" />
          Novo Anúncio
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total Anúncios',  value: total,       cls: '' },
          { label: 'Ativos',          value: ativos,      cls: 'text-green-600 dark:text-green-400' },
          { label: 'Sem Estoque',     value: semEstoque,  cls: semEstoque > 0 ? 'text-red-600 dark:text-red-400' : '' },
          { label: 'Receita 30d',     value: brl(receita30d), cls: 'text-marca-600 dark:text-marca-400' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">{kpi.label}</p>
            <p className={`mt-1 text-xl font-bold text-slate-800 dark:text-slate-100 ${kpi.cls}`}>
              {isLoading ? <span className="animate-pulse">...</span> : kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3">
        {/* Search + canal */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título, SKU ou categoria..."
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
            />
          </div>
          <select
            value={canal}
            onChange={(e) => { setCanal(e.target.value); setPagina(1); }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
          >
            <option value="">Todos os canais</option>
            <option value="MERCADO_LIVRE">🟠 Mercado Livre</option>
            <option value="SHOPEE">🔴 Shopee</option>
            <option value="AMAZON">🟤 Amazon</option>
            <option value="SHOPIFY">🟢 Shopify</option>
          </select>
        </div>

        {/* Status chips */}
        <div className="flex flex-wrap gap-2">
          {STATUS_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => { setStatus(chip.value); setPagina(1); }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                status === chip.value
                  ? 'bg-marca-500 text-white dark:bg-marca-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {chip.label}
            </button>
          ))}
          {(busca || canal || status) && (
            <button
              onClick={resetFiltros}
              className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
            >
              <X className="h-3 w-3" /> Limpar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : anuncios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 font-medium text-slate-500 dark:text-slate-400">
              Nenhum anúncio encontrado
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Tente ajustar os filtros ou criar um novo anúncio.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {[
                    { label: 'Produto / SKU', cls: 'text-left' },
                    { label: 'Canal',          cls: 'text-left' },
                    { label: 'Preço',          cls: 'text-right' },
                    { label: 'Estoque',        cls: 'text-right' },
                    { label: 'Status',         cls: 'text-center' },
                    { label: 'Impressões',     cls: 'text-right hidden sm:table-cell' },
                    { label: 'Conversão',      cls: 'text-right hidden md:table-cell' },
                    { label: 'Vendas 30d',     cls: 'text-right hidden lg:table-cell' },
                    { label: 'Receita 30d',    cls: 'text-right hidden lg:table-cell' },
                    { label: 'Ações',          cls: 'text-center' },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 ${col.cls}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {anuncios.map((anuncio) => {
                  const canalCfg = CANAL_CONFIG[anuncio.canal] ?? CANAL_CONFIG.SHOPIFY;
                  const statusCfg = STATUS_CONFIG[anuncio.status] ?? STATUS_CONFIG.PAUSADO;
                  const liq = precoLiquido(anuncio.preco, anuncio.canal);
                  const isMutating = atualizar.isPending;

                  return (
                    <tr
                      key={anuncio.id}
                      className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/30"
                    >
                      {/* Produto */}
                      <td className="px-4 py-3 max-w-[240px]">
                        <p className="line-clamp-1 font-medium text-slate-800 dark:text-slate-200">
                          {anuncio.titulo}
                        </p>
                        <p className="font-mono text-[11px] text-slate-400">{anuncio.sku}</p>
                        <p className="text-[11px] text-slate-400">{anuncio.categoria}</p>
                      </td>

                      {/* Canal */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${canalCfg.cor} ${canalCfg.corText}`}
                        >
                          {canalCfg.emoji}
                          <span className="hidden sm:inline">
                            {anuncio.canal.replace('_', ' ')}
                          </span>
                        </span>
                      </td>

                      {/* Preço */}
                      <td className="px-4 py-3 text-right">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-100">
                            {brl(anuncio.preco)}
                          </p>
                          {anuncio.precoPromocional && (
                            <p className="text-xs font-medium text-red-500">
                              Promo: {brl(anuncio.precoPromocional)}
                            </p>
                          )}
                          <p className="text-[11px] text-green-600 dark:text-green-400 whitespace-nowrap">
                            Líq: {brl(liq)}
                          </p>
                        </div>
                      </td>

                      {/* Estoque */}
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-bold ${
                            anuncio.estoque === 0
                              ? 'text-red-600 dark:text-red-400'
                              : anuncio.estoque <= 3
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {anuncio.estoque}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusCfg.cls}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Impressões */}
                      <td className="hidden px-4 py-3 text-right text-slate-600 dark:text-slate-400 sm:table-cell">
                        {anuncio.impressoes.toLocaleString('pt-BR')}
                      </td>

                      {/* Conversão */}
                      <td className="hidden px-4 py-3 text-right md:table-cell">
                        <span
                          className={`font-medium ${
                            anuncio.conversao >= 3
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {anuncio.conversao.toFixed(1)}%
                        </span>
                      </td>

                      {/* Vendas 30d */}
                      <td className="hidden px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300 lg:table-cell">
                        {anuncio.vendas30d}
                      </td>

                      {/* Receita 30d */}
                      <td className="hidden px-4 py-3 text-right font-bold text-slate-800 dark:text-slate-100 lg:table-cell">
                        {brl(anuncio.receita30d)}
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Pausar/Ativar */}
                          {(anuncio.status === 'ATIVO' || anuncio.status === 'PAUSADO') && (
                            <button
                              disabled={isMutating}
                              onClick={() => handleToggleStatus(anuncio)}
                              title={anuncio.status === 'ATIVO' ? 'Pausar' : 'Ativar'}
                              className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                                anuncio.status === 'ATIVO'
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                              }`}
                            >
                              {anuncio.status === 'ATIVO' ? 'Pausar' : 'Ativar'}
                            </button>
                          )}

                          {/* Editar preço */}
                          <button
                            onClick={() => setEditando(anuncio)}
                            title="Editar preço"
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          {/* Link externo */}
                          {anuncio.urlAnuncio && (
                            <a
                              href={anuncio.urlAnuncio}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Ver anúncio"
                              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPaginas > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {total} anúncios · Página {pagina} de {totalPaginas}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={pagina === 1}
                onClick={() => setPagina((p) => p - 1)}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPagina(p)}
                    className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors ${
                      p === pagina
                        ? 'bg-marca-500 text-white dark:bg-marca-600'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                disabled={pagina === totalPaginas}
                onClick={() => setPagina((p) => p + 1)}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal editar preço */}
      {editando && (
        <EditarPrecoModal
          anuncio={editando}
          onClose={() => setEditando(null)}
          onSave={handleSavePreco}
          salvando={atualizar.isPending}
        />
      )}
    </div>
  );
}
