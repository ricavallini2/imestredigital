'use client';

import { useState } from 'react';
import { MessageSquare, Mail, Phone, Smartphone, Bot, LayoutList, Clock } from 'lucide-react';
import { useHistoricoCobranca } from '@/hooks/useCobranca';
import type { AcaoCobranca } from '@/hooks/useCobranca';
import clsx from 'clsx';

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const fmtRelativo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const horas = Math.floor(diff / 3600000);
  const dias = Math.floor(diff / 86400000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `há ${mins} min`;
  if (horas < 24) return `há ${horas}h`;
  if (dias === 1) return 'ontem';
  return `há ${dias} dias`;
};

const fmtData = (iso: string) => new Date(iso).toLocaleString('pt-BR', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

const CANAL_CFG: Record<string, { icon: React.ElementType; cor: string; bgCor: string; label: string }> = {
  WHATSAPP: { icon: MessageSquare, cor: 'text-green-600 dark:text-green-400',  bgCor: 'bg-green-100 dark:bg-green-900/30', label: 'WhatsApp' },
  EMAIL:    { icon: Mail,          cor: 'text-blue-600 dark:text-blue-400',    bgCor: 'bg-blue-100 dark:bg-blue-900/30',   label: 'E-mail' },
  SMS:      { icon: Smartphone,    cor: 'text-amber-600 dark:text-amber-400',  bgCor: 'bg-amber-100 dark:bg-amber-900/30', label: 'SMS' },
  LIGACAO:  { icon: Phone,         cor: 'text-purple-600 dark:text-purple-400', bgCor: 'bg-purple-100 dark:bg-purple-900/30', label: 'Ligação' },
};

const STATUS_CFG: Record<string, { cls: string; label: string }> = {
  ENVIADO:    { cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',     label: 'Enviado' },
  ENTREGUE:   { cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',         label: 'Entregue' },
  LIDO:       { cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',          label: 'Lido' },
  RESPONDIDO: { cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',     label: 'Respondido' },
  FALHOU:     { cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',             label: 'Falhou' },
};

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={clsx('animate-pulse bg-slate-200 dark:bg-slate-700 rounded', className)} />;
}

export default function HistoricoCobrancaPage() {
  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [visao, setVisao] = useState<'timeline' | 'tabela'>('timeline');

  const filtros = {
    ...(busca ? { busca } : {}),
    ...(tipoFiltro ? { tipo: tipoFiltro } : {}),
    ...(dataInicio ? { dataInicio } : {}),
    ...(dataFim ? { dataFim } : {}),
  };

  const { data, isLoading } = useHistoricoCobranca(filtros);
  const acoes = data?.dados ?? [];

  const automaticas = acoes.filter(a => a.automatica).length;
  const manuais = acoes.filter(a => !a.automatica).length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Histórico de Cobranças</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Todas as ações de cobrança — automáticas e manuais
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Buscar cliente ou mensagem..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="flex-1 min-w-48 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={tipoFiltro}
            onChange={e => setTipoFiltro(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os canais</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="EMAIL">E-mail</option>
            <option value="SMS">SMS</option>
            <option value="LIGACAO">Ligação</option>
          </select>
          <input
            type="date"
            value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{acoes.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total de ações</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{automaticas}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Automáticas</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{manuais}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manuais</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setVisao('timeline')}
          className={clsx('inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors', visao === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50')}
        >
          <Clock className="w-4 h-4" />
          Timeline
        </button>
        <button
          onClick={() => setVisao('tabela')}
          className={clsx('inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors', visao === 'tabela' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50')}
        >
          <LayoutList className="w-4 h-4" />
          Tabela
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full max-w-md" />
              </div>
            </div>
          ))}
        </div>
      ) : acoes.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-medium text-slate-600 dark:text-slate-400">Nenhuma ação encontrada</p>
          <p className="text-sm text-slate-400 mt-1">Tente ajustar os filtros de busca</p>
        </div>
      ) : visao === 'timeline' ? (
        /* ── Timeline View ── */
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-4">
            {acoes.map(acao => {
              const cfg = CANAL_CFG[acao.tipo];
              const st = STATUS_CFG[acao.status];
              const Icon = cfg.icon;
              return (
                <div key={acao.id} className="flex gap-4 relative">
                  {/* Icon circle */}
                  <div className={clsx('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10', cfg.bgCor)}>
                    <Icon className={clsx('w-5 h-5', cfg.cor)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{acao.clienteNome}</span>
                        <span className={clsx('inline-block text-xs font-semibold px-2 py-0.5 rounded-full', cfg.bgCor, cfg.cor)}>
                          {cfg.label}
                        </span>
                        {acao.automatica && (
                          <span className="inline-flex items-center gap-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                            <Bot className="w-3 h-3" />
                            Automático
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', st?.cls)}>
                          {st?.label}
                        </span>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{fmtRelativo(acao.criadoEm)}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {acao.mensagem.length > 100 ? acao.mensagem.slice(0, 100) + '…' : acao.mensagem}
                    </p>
                    {acao.valor && (
                      <p className="mt-1 text-xs text-slate-400">
                        Título: {brl(acao.valor)} · Vencimento: {acao.dataVencimento ? new Date(acao.dataVencimento).toLocaleDateString('pt-BR') : '—'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── Table View ── */
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Canal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Mensagem</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Automática</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {acoes.map(acao => {
                  const cfg = CANAL_CFG[acao.tipo];
                  const st = STATUS_CFG[acao.status];
                  const Icon = cfg.icon;
                  return (
                    <tr key={acao.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {fmtData(acao.criadoEm)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Icon className={clsx('w-4 h-4', cfg.cor)} />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{cfg.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {acao.clienteNome}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-xs">
                        <span className="line-clamp-1">
                          {acao.mensagem.length > 80 ? acao.mensagem.slice(0, 80) + '…' : acao.mensagem}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', st?.cls)}>
                          {st?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {acao.automatica ? (
                          <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                            <Bot className="w-3.5 h-3.5" />
                            Sim
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Manual</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
