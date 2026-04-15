'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowRight, Zap, Search, Filter, Plus, X } from 'lucide-react';
import { useMovimentacoes, useDepositos, useRegistrarEntrada, useRegistrarSaida, useRegistrarTransferencia, useRegistrarAjuste } from '@/hooks/useEstoque';
import { useQueryClient } from '@tanstack/react-query';
import { useResumoEstoque } from '@/hooks/useEstoque';

// ─── Constantes ───────────────────────────────────────────────────────────────

type TipoMov = 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA' | 'AJUSTE';

const TIPO_CONFIG: Record<TipoMov, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
  ENTRADA: { label: 'Entrada', icon: <ArrowDown className="h-3.5 w-3.5" />, bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  SAIDA: { label: 'Saída', icon: <ArrowUp className="h-3.5 w-3.5" />, bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  TRANSFERENCIA: { label: 'Transferência', icon: <ArrowRight className="h-3.5 w-3.5" />, bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  AJUSTE: { label: 'Ajuste', icon: <Zap className="h-3.5 w-3.5" />, bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
};

// ─── Modal ────────────────────────────────────────────────────────────────────

type SaldoItem = { produtoId: string; produto: string; sku: string; variacaoId?: string; variacao?: string; depositoId: string; deposito: string; disponivel: number };

function ModalMovimentacao({ open, onClose, depositos, produtos }: {
  open: boolean; onClose: () => void;
  depositos: Array<{ id: string; nome: string }>;
  produtos: SaldoItem[];
}) {
  const [tipo, setTipo] = useState<TipoMov>('ENTRADA');
  const [produtoId, setProdutoId] = useState('');
  const [variacaoId, setVariacaoId] = useState('');
  const [depositoOrigemId, setDepositoOrigemId] = useState('');
  const [depositoDestinoId, setDepositoDestinoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState('');

  const entrada = useRegistrarEntrada();
  const saida = useRegistrarSaida();
  const transferencia = useRegistrarTransferencia();
  const ajuste = useRegistrarAjuste();
  const isBusy = entrada.isPending || saida.isPending || transferencia.isPending || ajuste.isPending;

  const varCountMap = new Map<string, Set<string>>();
  for (const s of produtos) { if (s.variacaoId) { if (!varCountMap.has(s.produtoId)) varCountMap.set(s.produtoId, new Set()); varCountMap.get(s.produtoId)!.add(s.variacaoId); } }
  const produtosUnicos = [...new Map(produtos.map(p => [p.produtoId, p])).values()];

  const variacoesOptions = (() => {
    if (!produtoId) return [];
    const seen = new Map<string, string>();
    for (const s of produtos) { if (s.produtoId === produtoId && s.variacaoId && s.variacao !== 'Única') seen.set(s.variacaoId, s.variacao ?? s.variacaoId); }
    return Array.from(seen.entries()).map(([id, label]) => ({ id, label }));
  })();

  const variacaoEfetiva = variacaoId || (variacoesOptions.length === 1 ? variacoesOptions[0].id : '');

  const depositosComSaldo = (() => {
    if (!produtoId) return [];
    const map = new Map<string, { id: string; nome: string; disponivel: number }>();
    for (const s of produtos) {
      if (s.produtoId !== produtoId) continue;
      if (variacaoEfetiva && s.variacaoId !== variacaoEfetiva) continue;
      const ex = map.get(s.depositoId);
      if (ex) ex.disponivel += s.disponivel; else map.set(s.depositoId, { id: s.depositoId, nome: s.deposito, disponivel: s.disponivel });
    }
    return Array.from(map.values());
  })();

  if (!open) return null;

  const reset = () => { setProdutoId(''); setVariacaoId(''); setDepositoOrigemId(''); setDepositoDestinoId(''); setQuantidade(''); setMotivo(''); setErro(''); };

  const handleSubmit = async () => {
    setErro('');
    const qty = parseFloat(quantidade);
    if (!produtoId) { setErro('Selecione um produto'); return; }
    if (variacoesOptions.length > 1 && !variacaoId) { setErro('Selecione a variação'); return; }
    if (!quantidade || isNaN(qty) || qty === 0) { setErro('Informe a quantidade'); return; }
    const vid = variacaoEfetiva || undefined;
    try {
      if (tipo === 'ENTRADA') {
        if (!depositoDestinoId) { setErro('Selecione o depósito'); return; }
        await entrada.mutateAsync({ produtoId, variacaoId: vid, depositoId: depositoDestinoId, quantidade: qty, motivo });
      } else if (tipo === 'SAIDA') {
        if (!depositoOrigemId) { setErro('Selecione o depósito'); return; }
        await saida.mutateAsync({ produtoId, variacaoId: vid, depositoId: depositoOrigemId, quantidade: qty, motivo });
      } else if (tipo === 'TRANSFERENCIA') {
        if (!depositoOrigemId || !depositoDestinoId) { setErro('Selecione origem e destino'); return; }
        await transferencia.mutateAsync({ produtoId, variacaoId: vid, depositoOrigemId, depositoDestinoId, quantidade: qty, motivo });
      } else {
        if (!depositoOrigemId) { setErro('Selecione o depósito'); return; }
        await ajuste.mutateAsync({ produtoId, variacaoId: vid, depositoId: depositoOrigemId, quantidade: qty, motivo });
      }
      reset(); onClose();
    } catch (e: unknown) {
      setErro((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erro ao registrar');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Nova Movimentação</h2>
          <button onClick={() => { reset(); onClose(); }} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-5 w-5 text-slate-500" /></button>
        </div>
        <div className="space-y-4 p-5">
          {/* Tipo */}
          <div className="grid grid-cols-4 gap-2">
            {(['ENTRADA', 'SAIDA', 'TRANSFERENCIA', 'AJUSTE'] as TipoMov[]).map((t) => (
              <button key={t} onClick={() => { setTipo(t); setDepositoOrigemId(''); setDepositoDestinoId(''); }}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-2 text-xs font-medium transition-all ${tipo === t ? 'border-marca-500 bg-marca-50 text-marca-700 dark:bg-marca-900/20' : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-600'}`}>
                <span className={`rounded-full p-1 text-white ${t === 'ENTRADA' ? 'bg-emerald-500' : t === 'SAIDA' ? 'bg-red-500' : t === 'TRANSFERENCIA' ? 'bg-blue-500' : 'bg-amber-500'}`}>
                  {TIPO_CONFIG[t].icon}
                </span>
                {TIPO_CONFIG[t].label}
              </button>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Produto *</label>
            <select value={produtoId} onChange={(e) => { setProdutoId(e.target.value); setVariacaoId(''); setDepositoOrigemId(''); setDepositoDestinoId(''); }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
              <option value="">Selecione...</option>
              {produtosUnicos.map(p => {
                const nVar = varCountMap.get(p.produtoId)?.size ?? 0;
                return <option key={p.produtoId} value={p.produtoId}>{p.produto}{nVar > 1 ? ` (${nVar} variações)` : ` — ${p.sku}`}</option>;
              })}
            </select>
          </div>
          {variacoesOptions.length > 1 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Variação *</label>
              <select value={variacaoId} onChange={(e) => { setVariacaoId(e.target.value); setDepositoOrigemId(''); setDepositoDestinoId(''); }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                <option value="">Selecione a variação...</option>
                {variacoesOptions.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
              </select>
            </div>
          )}
          {(tipo === 'SAIDA' || tipo === 'TRANSFERENCIA' || tipo === 'AJUSTE') && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{tipo === 'TRANSFERENCIA' ? 'Depósito Origem *' : 'Depósito *'}</label>
              <select value={depositoOrigemId} onChange={(e) => setDepositoOrigemId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                <option value="">Selecione...</option>
                {(depositosComSaldo.length > 0 ? depositosComSaldo : depositos.map(d => ({ ...d, disponivel: 0 }))).map(d => (
                  <option key={d.id} value={d.id}>{d.nome} ({d.disponivel} disp.)</option>
                ))}
              </select>
            </div>
          )}
          {(tipo === 'ENTRADA' || tipo === 'TRANSFERENCIA') && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{tipo === 'TRANSFERENCIA' ? 'Depósito Destino *' : 'Depósito *'}</label>
              <select value={depositoDestinoId} onChange={(e) => setDepositoDestinoId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                <option value="">Selecione...</option>
                {depositos.filter(d => d.id !== depositoOrigemId).map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Quantidade {tipo === 'AJUSTE' ? '(+ sobra / - falta)' : ''} *</label>
            <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder={tipo === 'AJUSTE' ? 'Ex: -2 ou 5' : 'Ex: 10'}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Motivo / Referência</label>
            <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex: NF 4521, Pedido #1234..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
          </div>
          {erro && <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">{erro}</div>}
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 px-5 py-4">
          <button onClick={() => { reset(); onClose(); }} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Cancelar</button>
          <button onClick={handleSubmit} disabled={isBusy} className="rounded-lg bg-marca-500 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-60">
            {isBusy ? 'Registrando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function MovimentacoesPage() {
  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [periodo, setPeriodo] = useState('30d');
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useMovimentacoes({ busca, tipo: tipoFiltro, periodo });
  const { data: depositos = [] } = useDepositos();
  const { data: resumo } = useResumoEstoque();

  const movimentacoes = data?.dados ?? [];
  const produtos = (resumo?.itens ?? []) as SaldoItem[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Movimentações</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Histórico de entradas, saídas, transferências e ajustes</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-marca-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-marca-600 transition-colors">
          <Plus className="h-4 w-4" /> Nova Movimentação
        </button>
      </div>

      {/* Filtros */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filtros</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Buscar produto ou SKU..." value={busca} onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-9 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
          </div>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
            <option value="">Todos os tipos</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
            <option value="TRANSFERENCIA">Transferência</option>
            <option value="AJUSTE">Ajuste</option>
          </select>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
            <option value="7d">Últimos 7 dias</option>
            <option value="15d">Últimos 15 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="60d">Últimos 60 dias</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        {isLoading ? (
          <div className="animate-pulse space-y-3 p-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-slate-700" />)}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
                    {['Data', 'Tipo', 'Produto / SKU', 'Qtd', 'Depósito', 'Motivo', 'Responsável'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {movimentacoes.length === 0 ? (
                    <tr><td colSpan={7} className="py-12 text-center text-slate-500">Nenhuma movimentação no período</td></tr>
                  ) : movimentacoes.map((m: {
                    id: string; tipo: string; produto: string; sku: string;
                    variacao?: string; variacaoId?: string; quantidade: number;
                    depositoOrigem?: string; depositoDestino?: string; motivo?: string;
                    responsavel: string; criadoEm: string;
                  }) => {
                    const cfg = TIPO_CONFIG[m.tipo as TipoMov];
                    const deposito = m.depositoOrigem
                      ? m.depositoDestino ? `${m.depositoOrigem} → ${m.depositoDestino}` : m.depositoOrigem
                      : m.depositoDestino ?? '—';
                    const qtyColor = m.tipo === 'SAIDA' || (m.tipo === 'AJUSTE' && m.quantidade < 0) ? 'text-red-600' : 'text-emerald-600';
                    const qtyPrefix = m.tipo === 'SAIDA' || (m.tipo === 'AJUSTE' && m.quantidade < 0) ? '−' : '+';

                    return (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {new Date(m.criadoEm).toLocaleDateString('pt-BR')}<br />
                          <span className="text-slate-400">{new Date(m.criadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{m.produto}</div>
                          <div className="font-mono text-xs text-slate-400">{m.sku}</div>
                          {m.variacao && m.variacao !== 'Única' && (
                            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{m.variacao}</div>
                          )}
                        </td>
                        <td className={`px-4 py-3 text-sm font-bold ${qtyColor}`}>
                          {qtyPrefix}{Math.abs(m.quantidade)} un.
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{deposito}</td>
                        <td className="px-4 py-3 text-xs text-slate-500 max-w-[160px] truncate" title={m.motivo}>{m.motivo || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{m.responsavel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3 text-xs text-slate-500">
              {movimentacoes.length} movimentações · Total: {data?.paginacao?.total ?? 0}
            </div>
          </>
        )}
      </div>

      <ModalMovimentacao
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        depositos={depositos.map((d: { id: string; nome: string }) => ({ id: d.id, nome: d.nome }))}
        produtos={produtos}
      />
    </div>
  );
}
