'use client';

import { useState, useEffect } from 'react';
import {
  Settings, Webhook, Clock, Sliders, MessageSquare, Mail, Phone,
  Smartphone, CheckCircle2, AlertTriangle, Save, RefreshCw, Zap,
} from 'lucide-react';
import { useConfiguracoesCobranca, useAtualizarConfiguracoes } from '@/hooks/useCobranca';
import type { ConfiguracaoCobranca, RegraCobranca } from '@/hooks/useCobranca';
import clsx from 'clsx';

const CANAL_ICONES: Record<string, { icon: React.ElementType; cor: string }> = {
  WHATSAPP: { icon: MessageSquare, cor: 'text-green-600 dark:text-green-400' },
  EMAIL:    { icon: Mail,          cor: 'text-blue-600 dark:text-blue-400' },
  SMS:      { icon: Smartphone,    cor: 'text-amber-600 dark:text-amber-400' },
  LIGACAO:  { icon: Phone,         cor: 'text-purple-600 dark:text-purple-400' },
};

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative w-11 h-6 rounded-full transition-colors',
          checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </div>
      <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
    </label>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={clsx('animate-pulse bg-slate-200 dark:bg-slate-700 rounded', className)} />;
}

export default function ConfiguracoesCobrancaPage() {
  const { data: config, isLoading } = useConfiguracoesCobranca();
  const atualizar = useAtualizarConfiguracoes();

  const [local, setLocal] = useState<ConfiguracaoCobranca | null>(null);
  const [testeWebhook, setTesteWebhook] = useState<'idle' | 'testing' | 'ok' | 'erro'>('idle');
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (config && !local) setLocal(JSON.parse(JSON.stringify(config)));
  }, [config]);

  if (isLoading || !local) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <Skeleton className="h-8 w-72" />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map(j => <Skeleton key={j} className="h-10 w-full" />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function updateLocal(patch: Partial<ConfiguracaoCobranca>) {
    setLocal(prev => prev ? { ...prev, ...patch } : prev);
  }

  function updateRegra(idx: number, patch: Partial<RegraCobranca>) {
    setLocal(prev => {
      if (!prev) return prev;
      const regras = [...prev.regras];
      regras[idx] = { ...regras[idx], ...patch };
      return { ...prev, regras };
    });
  }

  async function handleTestarWebhook() {
    if (!local.webhookN8n) return;
    setTesteWebhook('testing');
    try {
      await fetch(local.webhookN8n, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teste: true, origem: 'ERP iMestre', timestamp: new Date().toISOString() }),
      });
      setTesteWebhook('ok');
    } catch {
      setTesteWebhook('erro');
    }
  }

  async function handleSalvar() {
    if (!local) return;
    await atualizar.mutateAsync(local);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  const descMax = local.descontoMaximo;
  const parcMax = local.parcelasMaximas;
  const previewMin = 1000 * (1 - descMax / 100);
  const previewParc = parcMax > 0 ? previewMin / parcMax : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações de Cobrança</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gerencie automações, regras, limites e horários de operação
          </p>
        </div>
        <button
          onClick={handleSalvar}
          disabled={atualizar.isPending}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {atualizar.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {salvo ? 'Salvo!' : atualizar.isPending ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {/* Card 1: Integração n8n */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <Webhook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-bold text-slate-900 dark:text-white">Integração n8n / WhatsApp</h2>
        </div>
        <div className="p-6 space-y-5">
          <Toggle
            checked={local.ativo}
            onChange={v => updateLocal({ ativo: v })}
            label="Cobrança automática ativa"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              URL do Webhook n8n
            </label>
            <input
              type="url"
              value={local.webhookN8n}
              onChange={e => updateLocal({ webhookN8n: e.target.value })}
              placeholder="https://n8n.exemplo.com/webhook/cobranca"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              URL de Callback
            </label>
            <input
              type="url"
              value={local.callbackUrl}
              onChange={e => updateLocal({ callbackUrl: e.target.value })}
              placeholder="https://app.exemplo.com/api/v1/cobranca/callback"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestarWebhook}
              disabled={testeWebhook === 'testing' || !local.webhookN8n}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
            >
              {testeWebhook === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Testar Webhook
            </button>
            {testeWebhook === 'ok' && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                Webhook recebeu a chamada
              </span>
            )}
            {testeWebhook === 'erro' && (
              <span className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                <AlertTriangle className="w-4 h-4" />
                Erro: URL não disponível — configure em produção
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card 2: Regras de Disparo */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-500" />
          <h2 className="font-bold text-slate-900 dark:text-white">Regras de Disparo Automático</h2>
          <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
            Placeholders: {'{nome}'} {'{valor}'} {'{dias}'} {'{link}'} {'{telefone}'} {'{vencimento}'}
          </span>
        </div>
        <div className="p-6 space-y-4">
          {local.regras.map((regra, idx) => {
            const cfg = CANAL_ICONES[regra.canal];
            const Icon = cfg.icon;
            return (
              <div key={idx} className={clsx('border rounded-xl p-4 transition-opacity', regra.ativo ? 'border-slate-200 dark:border-slate-600' : 'border-slate-100 dark:border-slate-700/50 opacity-60')}>
                <div className="flex items-center gap-4 mb-3 flex-wrap">
                  <span className="font-bold text-slate-900 dark:text-white text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    D+{regra.diasAtraso}
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400">Canal:</label>
                    <select
                      value={regra.canal}
                      onChange={e => updateRegra(idx, { canal: e.target.value as RegraCobranca['canal'] })}
                      className="text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="EMAIL">E-mail</option>
                      <option value="SMS">SMS</option>
                      <option value="LIGACAO">Ligação</option>
                    </select>
                    <Icon className={clsx('w-4 h-4', cfg.cor)} />
                  </div>
                  <div className="ml-auto">
                    <Toggle
                      checked={regra.ativo}
                      onChange={v => updateRegra(idx, { ativo: v })}
                      label={regra.ativo ? 'Ativo' : 'Inativo'}
                    />
                  </div>
                </div>
                <textarea
                  value={regra.template}
                  onChange={e => updateRegra(idx, { template: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Template da mensagem..."
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Card 3: Limites de Negociação */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple-500" />
          <h2 className="font-bold text-slate-900 dark:text-white">Limites de Negociação</h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Desconto máximo (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={local.descontoMaximo}
                onChange={e => updateLocal({ descontoMaximo: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Parcelas máximas
              </label>
              <input
                type="number"
                min={1}
                max={24}
                value={local.parcelasMaximas}
                onChange={e => updateLocal({ parcelasMaximas: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Prévia:</p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Título de R$ 1.000 → mínimo{' '}
              <strong>R$ {previewMin.toFixed(2).replace('.', ',')}</strong>{' '}
              em {parcMax}x de{' '}
              <strong>R$ {previewParc.toFixed(2).replace('.', ',')}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Card 4: Horário de Operação */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-500" />
          <h2 className="font-bold text-slate-900 dark:text-white">Horário de Operação</h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Horário de início
              </label>
              <input
                type="time"
                value={local.horarioInicio}
                onChange={e => updateLocal({ horarioInicio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Horário de fim
              </label>
              <input
                type="time"
                value={local.horarioFim}
                onChange={e => updateLocal({ horarioFim: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Toggle
            checked={local.pausarFimDeSemana}
            onChange={v => updateLocal({ pausarFimDeSemana: v })}
            label="Pausar disparos nos fins de semana"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Disparos fora do horário são enfileirados para o próximo período operacional.
          </p>
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSalvar}
          disabled={atualizar.isPending}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
        >
          {atualizar.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {salvo ? 'Configurações salvas!' : atualizar.isPending ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </div>
    </div>
  );
}
