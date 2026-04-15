'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, Users, TrendingUp, ShoppingCart, Search, Filter,
  Edit, Trash2, DollarSign, Star, UserCheck, UserX, RefreshCw,
} from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { KPICard } from '@/components/ui/kpi-card';
import { SkeletonTable, SkeletonCard } from '@/components/ui/loading';
import { useClientes, useEstatisticasClientes, useInativarCliente } from '@/hooks/useClientes';
import type { Cliente } from '@/types';

const STATUS_LABELS: Record<string, string> = { ATIVO: 'Ativo', INATIVO: 'Inativo' };
const TIPO_LABELS: Record<string, string> = { PF: 'Pessoa Física', PJ: 'Pessoa Jurídica' };
const ORIGEM_LABELS: Record<string, string> = {
  SHOPIFY: 'Shopify', MERCADO_LIVRE: 'Mercado Livre', SHOPEE: 'Shopee',
  WEBSITE: 'Website', TELEFONE: 'Telefone', EMAIL: 'Email', INDICACAO: 'Indicação',
};

function ScoreBadge({ score }: { score?: number }) {
  if (!score) return <span className="text-xs text-slate-400">—</span>;
  const color = score >= 7 ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
    : score >= 4 ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400'
    : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${color}`}>
      <Star className="h-3 w-3" />{score}
    </span>
  );
}

export default function ClientesPage() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [origemFiltro, setOrigemFiltro] = useState('');

  const { data, isLoading, isError, refetch } = useClientes({ pagina: 1, limite: 200 });
  const { data: estatisticas, isLoading: loadingStats } = useEstatisticasClientes();
  const inativar = useInativarCliente();

  const clientes = data?.dados ?? [];

  const clientesFiltrados = useMemo(() => {
    return clientes.filter((c) => {
      const q = busca.toLowerCase();
      const matchBusca = !busca
        || c.nome.toLowerCase().includes(q)
        || (c.email ?? '').toLowerCase().includes(q)
        || (c.telefone ?? '').includes(busca)
        || (c.celular ?? '').includes(busca);
      const matchStatus = !statusFiltro || c.status === statusFiltro;
      const matchTipo = !tipoFiltro || c.tipo === tipoFiltro;
      const matchOrigem = !origemFiltro || c.origem === origemFiltro;
      return matchBusca && matchStatus && matchTipo && matchOrigem;
    });
  }, [clientes, busca, statusFiltro, tipoFiltro, origemFiltro]);

  const origens = [...new Set(clientes.map((c) => c.origem).filter(Boolean))];
  const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const ativos = estatisticas?.ativos ?? clientes.filter((c) => c.status === 'ATIVO').length;
  const inativos = clientes.length - ativos;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Clientes</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Gerencie seus clientes e relacionamentos</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
            <RefreshCw className="h-4 w-4" />
          </button>
          <Link href="/dashboard/clientes/novo"
            className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2.5 font-semibold text-white hover:bg-marca-600 transition-colors">
            <Plus className="h-5 w-5" /> Novo Cliente
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loadingStats ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <KPICard label="Total" valor={estatisticas?.total ?? clientes.length} icone={<Users className="h-6 w-6" />} />
            <KPICard label="Ativos" valor={ativos} icone={<UserCheck className="h-6 w-6" />} />
            <KPICard label="Novos este Mês" valor={estatisticas?.novosEsteMes ?? 0} icone={<TrendingUp className="h-6 w-6" />} />
            <KPICard label="Total em Compras" valor={moeda(estatisticas?.valorTotalCompras ?? 0)} icone={<DollarSign className="h-6 w-6" />} destaque />
          </>
        )}
      </div>

      {/* Filtros */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-3 flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filtros</span>
          {(busca || statusFiltro || tipoFiltro || origemFiltro) && (
            <button onClick={() => { setBusca(''); setStatusFiltro(''); setTipoFiltro(''); setOrigemFiltro(''); }}
              className="ml-auto text-xs text-marca-600 hover:underline dark:text-marca-400">
              Limpar filtros
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Nome, email ou telefone..." value={busca} onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
          </div>
          <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
            <option value="">Todos os status</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
            <option value="">Todos os tipos</option>
            <option value="PF">Pessoa Física</option>
            <option value="PJ">Pessoa Jurídica</option>
          </select>
          {origens.length > 0 && (
            <select value={origemFiltro} onChange={(e) => setOrigemFiltro(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
              <option value="">Todas as origens</option>
              {origens.map((o) => <option key={o} value={o!}>{ORIGEM_LABELS[o!] ?? o}</option>)}
            </select>
          )}
        </div>

        {clientesFiltrados.length !== clientes.length && (
          <p className="mt-3 text-xs text-slate-500">
            Mostrando <strong>{clientesFiltrados.length}</strong> de {clientes.length} clientes
          </p>
        )}
      </div>

      {/* Tabela */}
      {isLoading ? (
        <SkeletonTable rows={6} cols={7} />
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/20">
          <p className="font-medium text-red-600 dark:text-red-400">Erro ao carregar clientes</p>
          <p className="mt-1 text-sm text-red-500">Verifique se o serviço de CRM está disponível</p>
          <button onClick={() => refetch()} className="mt-3 text-sm text-red-600 underline hover:no-underline">Tentar novamente</button>
        </div>
      ) : (
        <DataTable<Cliente>
          columns={[
            {
              key: 'nome',
              label: 'Cliente',
              sortable: true,
              render: (value, row) => (
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{value}</p>
                  {row.email && <p className="text-xs text-slate-500">{row.email}</p>}
                </div>
              ),
            },
            {
              key: 'tipo',
              label: 'Tipo',
              render: (value) => (
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                  value === 'PF' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                }`}>{TIPO_LABELS[value] ?? value}</span>
              ),
            },
            { key: 'telefone', label: 'Contato',
              render: (v, row) => <span className="text-sm">{row.celular ?? row.telefone ?? '—'}</span>,
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => <StatusBadge status={value} label={STATUS_LABELS[value] ?? value} />,
            },
            {
              key: 'totalCompras',
              label: 'Total Compras',
              sortable: true,
              render: (value) => (
                <span className="font-medium text-slate-900 dark:text-slate-100">{moeda(Number(value ?? 0))}</span>
              ),
            },
            {
              key: 'quantidadePedidos',
              label: 'Pedidos',
              render: (value) => (
                <span className="flex items-center gap-1 text-sm">
                  <ShoppingCart className="h-3.5 w-3.5 text-slate-400" />{value ?? 0}
                </span>
              ),
            },
            {
              key: 'score' as any,
              label: 'Score',
              render: (_v, row) => <ScoreBadge score={(row as any).score} />,
            },
          ]}
          data={clientesFiltrados}
          onRowClick={(c: Cliente) => router.push(`/dashboard/clientes/${c.id}`)}
          actions={[
            {
              label: 'Editar',
              icon: <Edit className="h-4 w-4" />,
              onClick: (c: Cliente) => router.push(`/dashboard/clientes/${c.id}/editar`),
            },
            {
              label: 'Inativar',
              icon: <Trash2 className="h-4 w-4" />,
              danger: true,
              onClick: (c: Cliente) => {
                if (confirm(`Inativar cliente "${c.nome}"?`)) inativar.mutate(c.id);
              },
            },
          ]}
          emptyState={{
            title: 'Nenhum cliente encontrado',
            description: busca || statusFiltro || tipoFiltro || origemFiltro
              ? 'Nenhum cliente corresponde aos filtros aplicados'
              : 'Crie seu primeiro cliente para começar',
          }}
        />
      )}
    </div>
  );
}
