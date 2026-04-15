'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap, AlertTriangle, TrendingUp, CheckCircle2, XCircle,
  MessageSquare, Mail, Phone, Smartphone, ChevronDown, RefreshCw,
  Plus, Send, FileCheck, Handshake, Clock, DollarSign, BarChart2,
  Users, Bot, X,
} from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import {
  useTitulosCobranca, useStatsCobranca, useDisparar,
  useRegistrarAcao, useNegociar, TituloCobranca,
} from '@/hooks/useCobranca';
import { useConfiguracoesCobranca } from '@/hooks/useCobranca';
import clsx from 'clsx';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');
const fmtRelativo = (iso: string | null) => {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const dias = Math.floor(diff / 86400000);
  if (dias === 0) return 'hoje';
  if (dias === 1) return 'há 1 dia';
  return `há ${dias} dias`;
};

// ─── Config Maps ──────────────────────────────────────────────────────────────
const PRIORIDADE_CONFIG: Record<string, { cls: string; label: string }> = {
  CRITICA: { cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',       label: 'Crítica' },
  ALTA:    { cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: 'Alta' },
  MEDIA:   { cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',     label: 'Média' },
  BAIXA:   { cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',        label: 'Baixa' },
};

const STATUS_CONFIG: Record<string, { cls: string; label: string }> = {
  EM_ABERTO:   { cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',         label: 'Em Aberto' },
  EM_COBRANCA: { cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',           label: 'Em Cobrança' },
  NEGOCIANDO:  { cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',   label: 'Negociando' },
  ACORDO:      { cls: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',           label: 'Acordo' },
  PAGO:        { cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',       label: 'Pago' },
  PERDIDO:     { cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',               label: 'Perdido' },
};

function getTomConfig(diasAtraso: number) {
  if (diasAtraso <= 7)  return { label: 'Lembrete Gentil',    cor: 'text-green-600 dark:text-green-400',  icon: MessageSquare };
  if (diasAtraso <= 30) return { label: 'Aviso Formal',       cor: 'text-amber-600 dark:text-amber-400',  icon: AlertTriangle };
  if (diasAtraso <= 60) return { label: 'Cobrança Assertiva', cor: 'text-orange-600 dark:text-orange-400', icon: Zap };
  return                       { label: 'Último Aviso',       cor: 'text-red-600 dark:text-red-400',      icon: Phone };
}

const CANAL_ICONES: Record<string, { icon: React.ElementType; cor: string; label: string }> = {
  WHATSAPP: { icon: MessageSquare, cor: 'text-green-600',  label: 'WhatsApp' },
  EMAIL:    { icon: Mail,          cor: 'text-blue-600',   label: 'E-mail' },
  SMS:      { icon: Smartphone,    cor: 'text-amber-600',  label: 'SMS' },
  LIGACAO:  { icon: Phone,         cor: 'text-purple-600', label: 'Ligação' },
};

const TABS = [
  { key: 'TODOS',      label: 'Todos' },
  { key: 'EM_ABERTO',  label: 'Em Aberto' },
  { key: 'EM_COBRANCA',label: 'Em Cobrança' },
  { key: 'NEGOCIANDO', label: 'Negociando' },
  { key: 'ACORDO',     label: 'Acordo' },
  { key: 'PAGO',       label: 'Pago' },
  { key: 'PERDIDO',    label: 'Perdido' },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={clsx('animate-pulse bg-slate-200 dark:bg-slate-700 rounded', className)} />;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CobrancaPage() {
  const [tabAtiva, setTabAtiva] = useState('TODOS');
  const [busca, setBusca] = useState('');
  const [abrirDisparar, setAbrirDisparar] = useState(false);
  const [acoesAbertaId, setAcoesAbertaId] = useState<string | null>(null);
  const [negociarTituloId, setNegociarTituloId] = useState<string | null>(null);
  const [negociarDesconto, setNegociarDesconto] = useState(10);
  const [negociarParcelas, setNegociarParcelas] = useState(1);
  const [resultadoDisparar, setResultadoDisparar] = useState<{ disparados: number; webhookUrl: string } | null>(null);
  const [painelIAAberto, setPainelIAAberto] = useState(true);

  const filtros = {
    ...(tabAtiva !== 'TODOS' ? { status: tabAtiva } : {}),
    ...(busca ? { busca } : {}),
  };

  const { data: titulosData, isLoading } = useTitulosCobranca(filtros);
  const { data: stats } = useStatsCobranca();
  const { data: config } = useConfiguracoesCobranca();
  const disparar = useDisparar();
  const registrarAcao = useRegistrarAcao();
  const negociar = useNegociar();

  const titulos = titulosData?.dados ?? [];

  const titulosElegiveis = titulos.filter(t => ['EM_ABERTO', 'EM_COBRANCA'].includes(t.status));

  // Find the titulo being negotiated
  const tituloNegociando = titulos.find(t => t.id === negociarTituloId)
    ?? stats?.topCriticos?.find((t: TituloCobranca) => t.id === negociarTituloId);

  const valorNegociar = tituloNegociando?.valor ?? 0;
  const valorComDesconto = valorNegociar * (1 - negociarDesconto / 100);
  const valorParcela = negociarParcelas > 0 ? valorComDesconto / negociarParcelas : 0;

  async function handleDisparar() {
    try {
      const res = await disparar.mutateAsync({ filtro: {} });
      setResultadoDisparar({ disparados: res.disparados, webhookUrl: res.webhookUrl });
    } catch {
      // handled by react-query
    }
  }

  async function handleAcao(titulo: TituloCobranca, tipo: 'WHATSAPP' | 'EMAIL' | 'SMS' | 'LIGACAO') {
    setAcoesAbertaId(null);
    const mensagens: Record<string, string> = {
      WHATSAPP: `Olá ${titulo.clienteNome}, seu título de ${brl(titulo.valor)} está em atraso há ${titulo.diasAtraso} dias. Regularize o quanto antes.`,
      EMAIL:    `Prezado(a) ${titulo.clienteNome}, informamos que o título de ${brl(titulo.valor)} encontra-se vencido há ${titulo.diasAtraso} dias.`,
      SMS:      `${titulo.clienteNome}: débito ${brl(titulo.valor)} em atraso ${titulo.diasAtraso}d. Regularize: {link}`,
      LIGACAO:  `Ligar para ${titulo.clienteNome} (${titulo.clienteTelefone}) sobre débito de ${brl(titulo.valor)}.`,
    };
    await registrarAcao.mutateAsync({ tituloId: titulo.id, dto: { tipo, mensagem: mensagens[tipo] } });
  }

  async function handleNegociar() {
    if (!negociarTituloId) return;
    await negociar.mutateAsync({
      tituloId: negociarTituloId,
      dto: {
        descontoAplicado: negociarDesconto,
        numeroParcelas: negociarParcelas,
        observacao: `Acordo via painel — ${negociarParcelas}x com ${negociarDesconto}% desconto`,
      },
    });
    setNegociarTituloId(null);
    setNegociarDesconto(10);
    setNegociarParcelas(1);
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cobrança</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão de títulos vencidos com IA e automação WhatsApp
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/dashboard/cobranca/acordos"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            Acordos
          </Link>
          <Link
            href="/dashboard/cobranca/historico"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Histórico
          </Link>
          <button
            onClick={() => setAbrirDisparar(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
          >
            <Zap className="w-4 h-4" />
            Disparar Cobrança IA
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Vencido"
          valor={brl(stats?.totalVencido ?? 0)}
          icone={<TrendingUp className="w-6 h-6" />}
          className="border-red-200 dark:border-red-800/30"
        />
        <KPICard
          label="Em Cobrança"
          valor={String(stats?.emCobranca ?? 0)}
          icone={<MessageSquare className="w-6 h-6" />}
        />
        <KPICard
          label="Acordos Ativos"
          valor={String(stats?.acordosAtivos ?? 0)}
          icone={<FileCheck className="w-6 h-6" />}
        />
        <KPICard
          label="Taxa Recuperação"
          valor={`${stats?.taxaRecuperacao ?? 0}%`}
          icone={<CheckCircle2 className="w-6 h-6" />}
          variacao={stats?.taxaRecuperacao ? stats.taxaRecuperacao - 50 : undefined}
        />
      </div>

      {/* ── Painel IA ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-800/40 shadow-sm overflow-hidden">
        <div
          className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 cursor-pointer"
          onClick={() => setPainelIAAberto(p => !p)}
        >
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
              Análise IA — Top Prioridades
            </span>
            {stats?.porPrioridade?.CRITICA > 0 && (
              <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">
                {stats.porPrioridade.CRITICA} críticos
              </span>
            )}
          </div>
          <ChevronDown className={clsx('w-4 h-4 text-amber-600 transition-transform', painelIAAberto && 'rotate-180')} />
        </div>
        {painelIAAberto && (
          <div className="p-4">
            {!stats?.topCriticos?.length ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Nenhum título crítico no momento</p>
            ) : (
              <div className="space-y-2">
                {stats.topCriticos.map((t: TituloCobranca & { scoreIA: number }) => {
                  const tom = getTomConfig(t.diasAtraso);
                  const TomIcon = tom.icon;
                  return (
                    <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', PRIORIDADE_CONFIG[t.prioridade]?.cls)}>
                        {PRIORIDADE_CONFIG[t.prioridade]?.label}
                      </span>
                      <span className="flex-1 text-sm font-medium text-slate-900 dark:text-white truncate">{t.clienteNome}</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 shrink-0">{brl(t.valor)}</span>
                      <span className="text-xs text-red-600 dark:text-red-400 shrink-0 font-medium">D+{t.diasAtraso}</span>
                      <div className="w-20 shrink-0">
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <div
                            className={clsx('h-full rounded-full', t.scoreIA > 70 ? 'bg-red-500' : t.scoreIA > 40 ? 'bg-amber-500' : 'bg-green-500')}
                            style={{ width: `${t.scoreIA}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">Score {t.scoreIA}</span>
                      </div>
                      <div className={clsx('flex items-center gap-1 text-xs font-medium shrink-0', tom.cor)}>
                        <TomIcon className="w-3 h-3" />
                        <span className="hidden sm:inline">{tom.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Filtros e Busca ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Tabs */}
        <div className="overflow-x-auto border-b border-slate-200 dark:border-slate-700">
          <div className="flex px-4 min-w-max">
            {TABS.map(tab => {
              const count = tab.key === 'TODOS'
                ? (stats?.totalTitulos ?? titulosData?.total ?? 0)
                : titulosData?.total;
              return (
                <button
                  key={tab.key}
                  onClick={() => setTabAtiva(tab.key)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                    tabAtiva === tab.key
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
                  )}
                >
                  {tab.label}
                  {tab.key === tabAtiva && titulosData?.total !== undefined && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 rounded-full">
                      {titulosData.total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <input
            type="text"
            placeholder="Buscar por cliente ou descrição..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full max-w-sm px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Cliente</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Vencimento</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Dias Atraso</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Prioridade</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Score IA</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Último Contato</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : titulos.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                      <p className="font-medium">Nenhum título encontrado</p>
                      <p className="text-xs">Tente ajustar os filtros ou altere a busca</p>
                    </div>
                  </td>
                </tr>
              ) : (
                titulos.map(titulo => {
                  const scoreIA = (titulo as any).scoreIA ?? 0;
                  const prio = PRIORIDADE_CONFIG[titulo.prioridade];
                  const st = STATUS_CONFIG[titulo.status];
                  const diasCor = titulo.diasAtraso > 60
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : titulo.diasAtraso > 30
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    : titulo.diasAtraso > 7
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';

                  const podeNegociar = !['PAGO', 'PERDIDO', 'ACORDO'].includes(titulo.status);

                  return (
                    <tr
                      key={titulo.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[160px]">{titulo.clienteNome}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[160px]">{titulo.clienteEmail}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {brl(titulo.valor)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-slate-700 dark:text-slate-300">{fmtDate(titulo.dataVencimento)}</div>
                        <div className={clsx('text-xs font-medium', titulo.diasAtraso > 30 ? 'text-red-600 dark:text-red-400' : 'text-slate-400')}>
                          D+{titulo.diasAtraso}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={clsx('inline-block text-xs font-semibold px-2 py-0.5 rounded-full', diasCor)}>
                          {titulo.diasAtraso}d
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={clsx('inline-block text-xs font-semibold px-2 py-0.5 rounded-full', prio?.cls)}>
                          {prio?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                            <div
                              className={clsx('h-full rounded-full transition-all', scoreIA > 70 ? 'bg-red-500' : scoreIA > 40 ? 'bg-amber-500' : 'bg-green-500')}
                              style={{ width: `${scoreIA}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{scoreIA}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={clsx('inline-block text-xs font-semibold px-2 py-0.5 rounded-full', st?.cls)}>
                          {st?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {fmtRelativo(titulo.ultimaAcaoEm)}
                        {titulo.canalUltimaAcao && (
                          <div className="text-xs text-slate-400">{titulo.canalUltimaAcao}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-center">
                          {/* Ação Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => setAcoesAbertaId(acoesAbertaId === titulo.id ? null : titulo.id)}
                              disabled={registrarAcao.isPending}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              {registrarAcao.isPending ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Send className="w-3 h-3" />
                              )}
                              Ação
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            {acoesAbertaId === titulo.id && (
                              <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 w-40">
                                {Object.entries(CANAL_ICONES).map(([canal, cfg]) => {
                                  const Icon = cfg.icon;
                                  return (
                                    <button
                                      key={canal}
                                      onClick={() => handleAcao(titulo, canal as 'WHATSAPP' | 'EMAIL' | 'SMS' | 'LIGACAO')}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                      <Icon className={clsx('w-4 h-4', cfg.cor)} />
                                      {cfg.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Negociar */}
                          {podeNegociar && (
                            <button
                              onClick={() => setNegociarTituloId(titulo.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                            >
                              <Handshake className="w-3 h-3" />
                              Negociar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Overlay close ── */}
      {(acoesAbertaId || abrirDisparar || negociarTituloId) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => { setAcoesAbertaId(null); }}
        />
      )}

      {/* ── Modal Disparar ── */}
      {abrirDisparar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h2 className="font-bold text-slate-900 dark:text-white">Disparar Cobrança IA</h2>
              </div>
              <button
                onClick={() => { setAbrirDisparar(false); setResultadoDisparar(null); }}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Tone bands */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Estratégia por faixa de atraso:</p>
                <div className="space-y-2">
                  {[
                    { dias: 'D+1 a D+7',  label: 'Lembrete Gentil',    canal: 'WhatsApp',           cor: 'text-green-700 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-900/20' },
                    { dias: 'D+8 a D+30', label: 'Aviso Formal',       canal: 'WhatsApp',           cor: 'text-amber-700 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { dias: 'D+31 a D+60',label: 'Cobrança Assertiva', canal: 'WhatsApp + desconto', cor: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                    { dias: 'D+60+',      label: 'Último Aviso',       canal: 'Ligação automática', cor: 'text-red-700 dark:text-red-400',     bg: 'bg-red-50 dark:bg-red-900/20' },
                  ].map(row => (
                    <div key={row.dias} className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg', row.bg)}>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-20 shrink-0">{row.dias}</span>
                      <span className={clsx('text-xs font-semibold', row.cor)}>{row.label}</span>
                      <span className="text-xs text-slate-400 ml-auto">{row.canal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligible count */}
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Títulos elegíveis:</span>
                <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{titulosElegiveis.length}</span>
              </div>

              {/* Webhook URL */}
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Webhook n8n configurado:</p>
                <p className="text-xs font-mono bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg truncate">
                  {config?.webhookN8n || 'Não configurado — acesse Configurações'}
                </p>
              </div>

              {/* Result */}
              {resultadoDisparar && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">{resultadoDisparar.disparados} mensagens disparadas!</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                    {resultadoDisparar.webhookUrl ? 'Webhook n8n notificado com sucesso.' : 'Webhook não configurado — configure em produção.'}
                  </p>
                </div>
              )}

              {/* Action button */}
              {!resultadoDisparar && (
                <button
                  onClick={handleDisparar}
                  disabled={disparar.isPending || titulosElegiveis.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {disparar.isPending ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                  {disparar.isPending ? 'Disparando...' : `Confirmar Disparo (${titulosElegiveis.length} títulos)`}
                </button>
              )}

              {disparar.isError && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  Erro ao disparar. Tente novamente.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Negociar ── */}
      {negociarTituloId && tituloNegociando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-purple-500" />
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">Proposta de Acordo</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{tituloNegociando.clienteNome}</p>
                </div>
              </div>
              <button
                onClick={() => setNegociarTituloId(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Original value */}
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/40 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-400">Valor original:</span>
                <span className="font-bold text-slate-900 dark:text-white">{brl(valorNegociar)}</span>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Desconto (%) — máx. {config?.descontoMaximo ?? 30}%
                </label>
                <input
                  type="number"
                  min={0}
                  max={config?.descontoMaximo ?? 30}
                  value={negociarDesconto}
                  onChange={e => setNegociarDesconto(Math.min(Number(e.target.value), config?.descontoMaximo ?? 30))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Installments */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Parcelas — máx. {config?.parcelasMaximas ?? 12}x
                </label>
                <input
                  type="number"
                  min={1}
                  max={config?.parcelasMaximas ?? 12}
                  value={negociarParcelas}
                  onChange={e => setNegociarParcelas(Math.min(Math.max(1, Number(e.target.value)), config?.parcelasMaximas ?? 12))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Preview */}
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700 dark:text-purple-300">Valor com desconto:</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300">{brl(valorComDesconto)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700 dark:text-purple-300">Valor por parcela:</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-300">
                    {negociarParcelas}x {brl(valorParcela)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-purple-500 dark:text-purple-400">
                  <span>Desconto aplicado:</span>
                  <span>- {brl(valorNegociar - valorComDesconto)} ({negociarDesconto}%)</span>
                </div>
              </div>

              <button
                onClick={handleNegociar}
                disabled={negociar.isPending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {negociar.isPending ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Handshake className="w-5 h-5" />
                )}
                {negociar.isPending ? 'Firmando acordo...' : 'Firmar Acordo'}
              </button>

              {negociar.isError && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  Erro ao criar acordo. Tente novamente.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
