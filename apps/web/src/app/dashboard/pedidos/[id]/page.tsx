'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Package, Truck, CreditCard, MapPin, User, Hash,
  CheckCircle, XCircle, ChevronRight, Loader2, AlertCircle, FileText,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { usePedido, useConfirmarPedido, useCancelarPedido, useAtualizarStatusPedido } from '@/hooks/usePedidos';

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente', CONFIRMADO: 'Confirmado', SEPARANDO: 'Separando',
  SEPARADO: 'Separado', FATURADO: 'Faturado', ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue', CANCELADO: 'Cancelado', DEVOLVIDO: 'Devolvido',
};

const CANAL_LABELS: Record<string, string> = {
  BALCAO: 'Balcão', INTERNA: 'Venda Interna', SHOPIFY: 'Shopify',
  MERCADO_LIVRE: 'Mercado Livre', SHOPEE: 'Shopee', AMAZON: 'Amazon', OUTROS: 'Outros',
};

const FORMA_LABELS: Record<string, string> = {
  DINHEIRO: 'Dinheiro', PIX: 'PIX', CARTAO_CREDITO: 'Cartão de Crédito',
  CARTAO_DEBITO: 'Cartão de Débito', BOLETO: 'Boleto', PRAZO: 'A Prazo',
};

const PROXIMOS_STATUS: Record<string, { status: string; label: string; cor: string }[]> = {
  PENDENTE:   [{ status: 'CONFIRMADO', label: 'Confirmar', cor: 'bg-blue-500 hover:bg-blue-600 text-white' }],
  CONFIRMADO: [{ status: 'SEPARANDO',  label: 'Iniciar Separação', cor: 'bg-indigo-500 hover:bg-indigo-600 text-white' }],
  SEPARANDO:  [{ status: 'SEPARADO',   label: 'Marcar Separado', cor: 'bg-violet-500 hover:bg-violet-600 text-white' }],
  SEPARADO:   [{ status: 'FATURADO',   label: 'Faturar', cor: 'bg-purple-500 hover:bg-purple-600 text-white' }],
  FATURADO:   [{ status: 'ENVIADO',    label: 'Marcar Enviado', cor: 'bg-cyan-500 hover:bg-cyan-600 text-white' }],
  ENVIADO:    [{ status: 'ENTREGUE',   label: 'Confirmar Entrega', cor: 'bg-emerald-500 hover:bg-emerald-600 text-white' }],
};

const TIMELINE_STEPS = ['PENDENTE','CONFIRMADO','SEPARANDO','SEPARADO','FATURADO','ENVIADO','ENTREGUE'];

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function PedidoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cancelando, setCancelando] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [rastreioForm, setRastreioForm] = useState(false);
  const [rastreio, setRastreio] = useState('');
  const [transportadora, setTransportadora] = useState('');

  const { data: pedido, isLoading, isError } = usePedido(id);
  const confirmar = useConfirmarPedido();
  const cancelar  = useCancelarPedido();
  const atualizarStatus = useAtualizarStatusPedido();

  const isBusy = confirmar.isPending || cancelar.isPending || atualizarStatus.isPending;

  const handleAvancar = async (novoStatus: string) => {
    if (novoStatus === 'ENVIADO' && !pedido?.rastreio) {
      setRastreioForm(true);
      return;
    }
    await atualizarStatus.mutateAsync({ id, status: novoStatus });
  };

  const handleEnviar = async () => {
    await atualizarStatus.mutateAsync({ id, status: 'ENVIADO', rastreio, transportadora });
    setRastreioForm(false);
  };

  const handleCancelar = async () => {
    await cancelar.mutateAsync({ id, motivo });
    setCancelando(false);
    router.push('/dashboard/pedidos');
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-marca-500" />
    </div>
  );

  if (isError || !pedido) return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950/20">
      <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
      <p className="font-semibold text-red-700 dark:text-red-400">Pedido não encontrado</p>
      <Link href="/dashboard/pedidos" className="mt-3 inline-block text-sm text-red-600 hover:underline">← Voltar</Link>
    </div>
  );

  const isCancelado = pedido.status === 'CANCELADO' || pedido.status === 'DEVOLVIDO';
  const isEntregue  = pedido.status === 'ENTREGUE';
  const stepAtual   = TIMELINE_STEPS.indexOf(pedido.status as string);
  const proximos    = PROXIMOS_STATUS[pedido.status as string] ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()}
          className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors">
          <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{pedido.numero}</h1>
            <StatusBadge status={pedido.status as string} label={STATUS_LABELS[pedido.status as string] ?? String(pedido.status)} />
          </div>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {CANAL_LABELS[(pedido as any).canal] ?? (pedido as any).canal} · {new Date((pedido as any).criadoEm).toLocaleString('pt-BR')}
          </p>
        </div>
        {/* Emitir NF-e — disponível a partir de SEPARADO */}
        {!isCancelado && ['SEPARADO','FATURADO','ENVIADO','ENTREGUE'].includes(pedido.status as string) && (
          <Link
            href={`/dashboard/fiscal/nova?pedidoId=${pedido.id}`}
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 transition-colors">
            <FileText className="h-4 w-4" /> Emitir NF-e
          </Link>
        )}
        {!isCancelado && !isEntregue && (
          <button onClick={() => setCancelando(true)}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
            <XCircle className="h-4 w-4" /> Cancelar Pedido
          </button>
        )}
      </div>

      {/* Timeline de status */}
      {!isCancelado && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {TIMELINE_STEPS.map((s, i) => {
              const done    = i <= stepAtual;
              const current = i === stepAtual;
              return (
                <div key={s} className="flex items-center gap-1 min-w-0">
                  <div className={`flex flex-col items-center min-w-[70px] ${done ? 'text-marca-600 dark:text-marca-400' : 'text-slate-400'}`}>
                    <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold mb-1
                      ${current ? 'border-marca-500 bg-marca-500 text-white' : done ? 'border-marca-500 bg-marca-50 text-marca-600 dark:bg-marca-900/30' : 'border-slate-300 dark:border-slate-600'}`}>
                      {done && !current ? '✓' : i + 1}
                    </div>
                    <span className="text-[10px] font-medium text-center leading-tight">{STATUS_LABELS[s]}</span>
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 min-w-[16px] mt-[-14px] rounded ${i < stepAtual ? 'bg-marca-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Ações de avançar */}
          {proximos.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              {proximos.map((p) => (
                <button key={p.status} onClick={() => handleAvancar(p.status)} disabled={isBusy}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${p.cor}`}>
                  {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Coluna esquerda: itens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Itens */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
            <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-500" />
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Itens do Pedido</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {((pedido as any).itensList ?? []).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.produto}</p>
                    <p className="text-xs text-slate-400 font-mono">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{fmt(item.subtotal)}</p>
                    <p className="text-xs text-slate-400">{item.quantidade}× {fmt(item.precoUnitario)}
                      {item.desconto > 0 && <span className="text-red-500"> −{fmt(item.desconto)}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Totais */}
            <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-4 space-y-1.5">
              <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>{fmt((pedido as any).subtotal ?? 0)}</span></div>
              {(pedido as any).desconto > 0 && <div className="flex justify-between text-sm text-red-600"><span>Desconto</span><span>−{fmt((pedido as any).desconto)}</span></div>}
              {(pedido as any).frete  > 0 && <div className="flex justify-between text-sm text-slate-500"><span>Frete</span><span>+{fmt((pedido as any).frete)}</span></div>}
              <div className="flex justify-between text-base font-bold text-slate-900 dark:text-slate-100 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                <span>Total</span><span>{fmt((pedido as any).valor ?? 0)}</span>
              </div>
            </div>
          </div>

          {/* Entrega + Rastreio */}
          {((pedido as any).enderecoEntrega || (pedido as any).rastreio) && (
            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="h-4 w-4 text-slate-500" />
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Entrega</h2>
              </div>
              {(pedido as any).enderecoEntrega && (
                <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                  <span>{(pedido as any).enderecoEntrega}</span>
                </div>
              )}
              {(pedido as any).rastreio && (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 px-3 py-2.5 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Rastreio: </span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{(pedido as any).rastreio}</span>
                  {(pedido as any).transportadora && <span className="ml-2 text-slate-500">· {(pedido as any).transportadora}</span>}
                </div>
              )}
            </div>
          )}

          {/* Observações */}
          {(pedido as any).observacoes && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-900/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">Observações</p>
              <p className="text-sm text-amber-900 dark:text-amber-300 whitespace-pre-line">{(pedido as any).observacoes}</p>
            </div>
          )}
        </div>

        {/* Coluna direita: resumo */}
        <div className="space-y-4">
          {/* Cliente */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-500" />
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Cliente</h2>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{pedido.cliente as string}</p>
            {(pedido as any).clienteEmail && <p className="text-xs text-slate-500">{(pedido as any).clienteEmail}</p>}
            {(pedido as any).clienteTelefone && <p className="text-xs text-slate-500">{(pedido as any).clienteTelefone}</p>}
            {(pedido as any).vendedor && <p className="text-xs text-slate-400">Vendedor: {(pedido as any).vendedor}</p>}
          </div>

          {/* Pagamento */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-500" />
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Pagamento</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Forma</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{FORMA_LABELS[(pedido as any).formaPagamento] ?? (pedido as any).formaPagamento}</span>
              </div>
              {(pedido as any).parcelas > 1 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Parcelas</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{(pedido as any).parcelas}×</span>
                </div>
              )}
              {(pedido as any).troco > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Troco</span>
                  <span className="font-medium text-emerald-600">{fmt((pedido as any).troco)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-700">
                <span className="text-slate-500">Status</span>
                <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                  (pedido as any).statusPagamento === 'PAGO' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  (pedido as any).statusPagamento === 'ESTORNADO' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {(pedido as any).statusPagamento}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-5 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="h-4 w-4 text-slate-500" />
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Informações</h2>
            </div>
            {[
              { label: 'ID', valor: pedido.id as string },
              { label: 'Canal', valor: CANAL_LABELS[(pedido as any).canal] ?? (pedido as any).canal },
              { label: 'Criado em', valor: new Date((pedido as any).criadoEm).toLocaleString('pt-BR') },
              { label: 'Atualizado em', valor: new Date((pedido as any).atualizadoEm).toLocaleString('pt-BR') },
            ].map(({ label, valor }) => (
              <div key={label} className="flex justify-between gap-2 text-xs">
                <span className="text-slate-500 shrink-0">{label}</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono text-right break-all">{valor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal cancelar */}
      {cancelando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Cancelar pedido {pedido.numero}?</h3>
            <p className="text-sm text-slate-500">Esta ação não pode ser desfeita. O pagamento (se houver) será estornado.</p>
            <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Motivo do cancelamento (opcional)"
              rows={3} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white resize-none" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setCancelando(false)} className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                Manter
              </button>
              <button onClick={handleCancelar} disabled={isBusy}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />} Cancelar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal rastreio */}
      {rastreioForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Informações de Envio</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Código de Rastreio</label>
                <input value={rastreio} onChange={(e) => setRastreio(e.target.value)} placeholder="Ex: BR123456789BR"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Transportadora</label>
                <input value={transportadora} onChange={(e) => setTransportadora(e.target.value)} placeholder="Ex: Correios SEDEX"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white" />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRastreioForm(false)} className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                Cancelar
              </button>
              <button onClick={handleEnviar} disabled={isBusy}
                className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-60">
                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />} Confirmar Envio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
