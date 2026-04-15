'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, Search, Edit, Trash2, Filter, Package,
  TrendingUp, DollarSign, AlertTriangle, CheckCircle,
  Tag, BarChart2, Eye, Printer,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { KPICard } from '@/components/ui/kpi-card';
import { SkeletonCard } from '@/components/ui/loading';
import { useProdutos, useRemoverProduto, useEstatisticasProdutos } from '@/hooks/useProdutos';
import type { Produto } from '@/types';

const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const STATUS_LABELS: Record<string, string> = {
  ATIVO: 'Ativo', INATIVO: 'Inativo', RASCUNHO: 'Rascunho',
};

const CATEGORIA_CORES: Record<string, string> = {
  'Eletrônicos': 'bg-blue-100 text-blue-700',
  'Informática': 'bg-indigo-100 text-indigo-700',
  'Calçados': 'bg-orange-100 text-orange-700',
  'Vestuário': 'bg-pink-100 text-pink-700',
  'Acessórios': 'bg-purple-100 text-purple-700',
};

export default function ProdutosPage() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');

  const { data, isLoading, isError } = useProdutos({ pagina: 1, limite: 100 });
  const { data: stats, isLoading: loadingStats } = useEstatisticasProdutos();
  const removerProduto = useRemoverProduto();

  const produtos = (data?.dados ?? []) as any[];

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchBusca = !busca || p.nome.toLowerCase().includes(busca.toLowerCase()) || p.sku.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria = !categoriaFiltro || p.categoria === categoriaFiltro;
      const matchStatus = !statusFiltro || p.status === statusFiltro;
      return matchBusca && matchCategoria && matchStatus;
    });
  }, [produtos, busca, categoriaFiltro, statusFiltro]);

  const categorias = [...new Set(produtos.map((p) => p.categoria).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Produtos</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Gerencie seu catálogo de produtos</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href="/dashboard/produtos/etiquetas"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Tag className="h-4 w-4" /> Etiquetas
          </Link>
          <Link href="/dashboard/produtos/novo"
            className="inline-flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2.5 font-semibold text-white hover:bg-marca-600 transition-colors">
            <Plus className="h-5 w-5" /> Novo Produto
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loadingStats ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <KPICard label="Total de Produtos" valor={stats?.total ?? 0} icone={<Package className="h-6 w-6" />} />
            <KPICard label="Ativos" valor={stats?.ativos ?? 0} icone={<CheckCircle className="h-6 w-6" />} />
            <KPICard label="Valor do Catálogo" valor={moeda(stats?.valorCatalogo ?? 0)} icone={<DollarSign className="h-6 w-6" />} destaque />
            <KPICard label="Margem Média" valor={`${stats?.margemMedia?.toFixed(1) ?? 0}%`} icone={<TrendingUp className="h-6 w-6" />} />
          </>
        )}
      </div>

      {/* Alertas de Estoque */}
      {(stats?.semEstoque ?? 0) > 0 || (stats?.estoqueMinimo ?? 0) > 0 ? (
        <div className="flex flex-wrap gap-3">
          {(stats?.semEstoque ?? 0) > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              {stats?.semEstoque} produto(s) sem estoque
            </div>
          )}
          {(stats?.estoqueMinimo ?? 0) > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              {stats?.estoqueMinimo} produto(s) com estoque crítico
            </div>
          )}
        </div>
      ) : null}

      {/* Filtros */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filtros</span>
          {(busca || categoriaFiltro || statusFiltro) && (
            <button onClick={() => { setBusca(''); setCategoriaFiltro(''); setStatusFiltro(''); }}
              className="ml-auto text-xs text-marca-600 hover:underline dark:text-marca-400">
              Limpar filtros
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Buscar por nome ou SKU..."
              value={busca} onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-9 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
          </div>
          <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
            <option value="">Todos os status</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
            <option value="RASCUNHO">Rascunho</option>
          </select>
        </div>
      </div>

      {/* Tabela / Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/20">
          <p className="text-red-600 dark:text-red-400 font-medium">Erro ao carregar produtos</p>
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center dark:border-slate-600">
          <Package className="mx-auto mb-3 h-12 w-12 text-slate-300" />
          <p className="font-semibold text-slate-600 dark:text-slate-400">Nenhum produto encontrado</p>
          <p className="mt-1 text-sm text-slate-500">
            {busca || categoriaFiltro || statusFiltro ? 'Tente ajustar os filtros' : 'Crie seu primeiro produto'}
          </p>
          {!busca && !categoriaFiltro && !statusFiltro && (
            <Link href="/dashboard/produtos/novo"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-600">
              <Plus className="h-4 w-4" /> Novo Produto
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Produto</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">SKU</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Categoria</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Preço</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">Margem</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">Estoque</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {produtosFiltrados.map((produto) => {
                  const estoqueCritico = produto.estoque <= produto.estoqueMinimo && produto.estoque > 0;
                  const semEstoque = produto.estoque === 0;
                  return (
                    <tr key={produto.id}
                      className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-700">
                            📦
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{produto.nome}</p>
                            <p className="text-xs text-slate-500">{produto.marca}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{produto.sku}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORIA_CORES[produto.categoria] ?? 'bg-slate-100 text-slate-700'}`}>
                          {produto.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{moeda(produto.preco)}</p>
                          {produto.precoCusto > 0 && (
                            <p className="text-xs text-slate-400">custo: {moeda(produto.precoCusto)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${produto.margemLucro >= 50 ? 'text-green-600' : produto.margemLucro >= 30 ? 'text-amber-600' : 'text-red-600'}`}>
                          {produto.margemLucro?.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          semEstoque ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : estoqueCritico ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {semEstoque && <AlertTriangle className="h-3 w-3" />}
                          {produto.estoque} un
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={produto.status} label={STATUS_LABELS[produto.status] ?? produto.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => router.push(`/dashboard/produtos/${produto.id}`)}
                            className="rounded p-1.5 text-slate-500 hover:bg-marca-50 hover:text-marca-600 dark:hover:bg-marca-900/20"
                            title="Ver detalhes">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => router.push(`/dashboard/produtos/${produto.id}`)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Editar">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              const v = produto.variacoes?.[0];
                              const item = {
                                id: `${produto.id}-${v?.sku ?? produto.sku}-${Date.now()}`,
                                produtoId: produto.id, nome: produto.nome,
                                sku: v?.sku ?? produto.sku, ean: produto.ean,
                                preco: v?.preco ?? produto.preco, precoPromocional: produto.precoPromocional,
                                categoria: produto.categoria, marca: produto.marca,
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
                            className="rounded p-1.5 text-slate-500 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20"
                            title="Gerar etiqueta">
                            <Tag className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Desativar "${produto.nome}"?`)) removerProduto.mutate(produto.id); }}
                            className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                            title="Desativar">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            <p className="text-xs text-slate-500">
              {produtosFiltrados.length} de {produtos.length} produtos
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
