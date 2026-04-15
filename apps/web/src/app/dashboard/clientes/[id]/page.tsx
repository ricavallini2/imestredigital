'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, MapPin, Edit, Archive, Plus, Tag,
  ShoppingCart, DollarSign, Calendar, Loader2, AlertCircle,
  MessageSquare, Brain, TrendingUp, TrendingDown, Minus,
  User, Building2, Star, Trash2, Clock, CheckCircle2,
  PhoneCall, Mail as MailIcon, MessageCircle, FileText,
  ChevronRight, Zap, Target, AlertTriangle, RefreshCw,
  Filter, Users, ExternalLink,
} from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  useCliente, useClienteResumo, useClienteTimeline,
  useClienteEnderecos, useClienteContatos,
  useAnaliseIA, useInativarCliente, useRegistrarInteracao,
  useCriarEndereco, useCriarContato,
  useRemoverEndereco, useRemoverContato,
} from '@/hooks/useClientes';
import { clientesService } from '@/services/clientes.service';
import { useQueryClient } from '@tanstack/react-query';
import type { TipoInteracao, RegistrarInteracaoDto, Endereco, Contato } from '@/types';

// ─── helpers ───────────────────────────────────────────────────────────────

const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dataFmt = (s?: string) => s ? new Date(s).toLocaleDateString('pt-BR') : '—';

const TIPO_LABELS: Record<string, string> = {
  PF: 'Pessoa Física', PJ: 'Pessoa Jurídica',
};
const STATUS_LABELS: Record<string, string> = {
  ATIVO: 'Ativo', INATIVO: 'Inativo',
};
const ORIGEM_LABELS: Record<string, string> = {
  SHOPIFY: 'Shopify', MERCADO_LIVRE: 'Mercado Livre', SHOPEE: 'Shopee',
  WEBSITE: 'Website', TELEFONE: 'Telefone', EMAIL: 'Email', INDICACAO: 'Indicação',
};

const ICONE_INTERACAO: Record<string, React.ReactNode> = {
  COMPRA:       <ShoppingCart className="h-4 w-4" />,
  ATENDIMENTO:  <PhoneCall className="h-4 w-4" />,
  RECLAMACAO:   <AlertCircle className="h-4 w-4" />,
  ELOGIO:       <Star className="h-4 w-4" />,
  EMAIL:        <MailIcon className="h-4 w-4" />,
  LIGACAO:      <Phone className="h-4 w-4" />,
  WHATSAPP:     <MessageCircle className="h-4 w-4" />,
  ORCAMENTO:    <FileText className="h-4 w-4" />,
  REUNIAO:      <Users className="h-4 w-4" />,
  VISITA:       <MapPin className="h-4 w-4" />,
  OUTRO:        <MessageSquare className="h-4 w-4" />,
};

const COR_INTERACAO: Record<string, string> = {
  COMPRA:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  RECLAMACAO:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  ELOGIO:      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  ATENDIMENTO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  EMAIL:       'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  LIGACAO:     'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  WHATSAPP:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  ORCAMENTO:   'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  REUNIAO:     'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  VISITA:      'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  OUTRO:       'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

// ─── Gauge / Anel de pontuação ──────────────────────────────────────────────
function GaugeRing({ value, max = 100, color, size = 64 }: { value: number; max?: number; color: string; size?: number }) {
  const pct = Math.min(1, value / max);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={6} className="text-slate-200 dark:text-slate-700" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" />
    </svg>
  );
}

// ─── Modal de interação ────────────────────────────────────────────────────
function ModalInteracao({ clienteId, onClose }: { clienteId: string; onClose: () => void }) {
  const [form, setForm] = useState<RegistrarInteracaoDto>({ tipo: 'ATENDIMENTO', titulo: '', descricao: '' });
  const registrar = useRegistrarInteracao();

  const TIPOS: TipoInteracao[] = ['ATENDIMENTO', 'LIGACAO', 'EMAIL', 'WHATSAPP', 'ORCAMENTO', 'REUNIAO', 'VISITA', 'ELOGIO', 'RECLAMACAO', 'OUTRO'];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    registrar.mutate({ clienteId, dto: form }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Registrar Interação</h3>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as TipoInteracao }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
              {TIPOS.map((t) => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase().replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Título *</label>
            <input type="text" value={form.titulo} onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
              placeholder="Ex: Ligação de follow-up" required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
            <textarea value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
              rows={3} placeholder="Detalhes da interação..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700">
              Cancelar
            </button>
            <button type="submit" disabled={registrar.isPending}
              className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-sm font-medium text-white hover:bg-marca-600 disabled:opacity-60">
              {registrar.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal de endereço ─────────────────────────────────────────────────────
function ModalEndereco({ clienteId, onClose }: { clienteId: string; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Endereco, 'id'>>({
    tipo: 'Residencial', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '', principal: false,
  });
  const [buscandoCEP, setBuscandoCEP] = useState(false);
  const [erroCEP, setErroCEP] = useState('');
  const criar = useCriarEndereco();
  const set = (k: keyof typeof form, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const fmtCEP = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);

  const buscarCEP = async (cep: string) => {
    const limpo = cep.replace(/\D/g, '');
    if (limpo.length !== 8) return;
    setBuscandoCEP(true); setErroCEP('');
    try {
      const dados = await clientesService.buscarCEP(limpo);
      if (dados.erro) { setErroCEP('CEP não encontrado'); return; }
      setForm((p) => ({ ...p, logradouro: dados.logradouro || p.logradouro, bairro: dados.bairro || p.bairro, cidade: dados.localidade || p.cidade, estado: dados.uf || p.estado }));
    } catch { setErroCEP('Erro ao buscar CEP'); }
    finally { setBuscandoCEP(false); }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    criar.mutate({ clienteId, dto: form }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Novo Endereço</h3>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Tipo</label>
              <select value={form.tipo} onChange={(e) => set('tipo', e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700">
                {['Residencial','Comercial','Cobrança','Entrega'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">CEP</label>
              <div className="relative mt-1">
                <input value={form.cep}
                  onChange={(e) => { const v = fmtCEP(e.target.value); set('cep', v); }}
                  onBlur={(e) => buscarCEP(e.target.value)}
                  placeholder="00000-000"
                  className="w-full rounded border border-slate-300 px-2 py-1.5 pr-7 text-sm dark:border-slate-600 dark:bg-slate-700" />
                {buscandoCEP && <Loader2 className="absolute right-2 top-2 h-3.5 w-3.5 animate-spin text-slate-400" />}
              </div>
              {erroCEP && <p className="mt-0.5 text-xs text-red-500">{erroCEP}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Logradouro *</label>
              <input value={form.logradouro} onChange={(e) => set('logradouro', e.target.value)} required
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Número *</label>
              <input value={form.numero} onChange={(e) => set('numero', e.target.value)} required
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Bairro</label>
              <input value={form.bairro} onChange={(e) => set('bairro', e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Cidade</label>
              <input value={form.cidade} onChange={(e) => set('cidade', e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Estado</label>
              <input value={form.estado} onChange={(e) => set('estado', e.target.value)} maxLength={2}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={form.principal} onChange={(e) => set('principal', e.target.checked)} />
            Definir como endereço principal
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700">
              Cancelar
            </button>
            <button type="submit" disabled={criar.isPending}
              className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-sm font-medium text-white hover:bg-marca-600 disabled:opacity-60">
              {criar.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal de contato ──────────────────────────────────────────────────────
function ModalContato({ clienteId, onClose }: { clienteId: string; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Contato, 'id'>>({ nome: '', cargo: '', email: '', telefone: '', celular: '', principal: false });
  const criar = useCriarContato();
  const set = (k: keyof typeof form, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    criar.mutate({ clienteId, dto: form }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Novo Contato</h3>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Nome *</label>
              <input value={form.nome} onChange={(e) => set('nome', e.target.value)} required
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Cargo</label>
              <input value={form.cargo} onChange={(e) => set('cargo', e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">Celular</label>
              <input value={form.celular} onChange={(e) => set('celular', e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={form.principal} onChange={(e) => set('principal', e.target.checked)} />
            Contato principal
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700">
              Cancelar
            </button>
            <button type="submit" disabled={criar.isPending}
              className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-sm font-medium text-white hover:bg-marca-600 disabled:opacity-60">
              {criar.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Painel de IA ─────────────────────────────────────────────────────────
function PainelIA({ clienteId }: { clienteId: string }) {
  const { data: analise, isLoading, isError, refetch, isFetching } = useAnaliseIA(clienteId);
  const queryClient = useQueryClient();

  if (isLoading) return (
    <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 dark:border-purple-800 dark:from-purple-950/20 dark:to-indigo-950/20">
      <div className="flex items-center gap-3">
        <Brain className="h-5 w-5 animate-pulse text-purple-500" />
        <span className="font-semibold text-purple-700 dark:text-purple-400">iMestreAI analisando cliente...</span>
      </div>
    </div>
  );

  if (isError || !analise) return null;

  const churnColor = analise.riscoChurn >= 70 ? '#ef4444' : analise.riscoChurn >= 40 ? '#f59e0b' : '#22c55e';
  const crescColor = analise.potencialCrescimento >= 70 ? '#22c55e' : analise.potencialCrescimento >= 40 ? '#f59e0b' : '#94a3b8';

  return (
    <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 dark:border-purple-800 dark:from-purple-950/20 dark:to-indigo-950/20">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-purple-900 dark:text-purple-200">Análise iMestreAI</h3>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {new Date(analise.geradoEm).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
            {analise.perfil}
          </span>
          <button onClick={() => { queryClient.removeQueries({ queryKey: ['cliente', clienteId, 'analise-ia'] }); refetch(); }}
            disabled={isFetching}
            className="flex items-center gap-1 rounded-lg border border-purple-300 px-2.5 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 disabled:opacity-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20">
            <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin' : ''}`} /> Regerar
          </button>
        </div>
      </div>

      {/* Gauges */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-slate-800/40">
          <div className="relative">
            <GaugeRing value={analise.riscoChurn} color={churnColor} size={56} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: churnColor }}>
              {analise.riscoChurn}%
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            <AlertTriangle className="h-3 w-3" /> Risco Churn
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-slate-800/40">
          <div className="relative">
            <GaugeRing value={analise.potencialCrescimento} color={crescColor} size={56} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: crescColor }}>
              {analise.potencialCrescimento}%
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            <TrendingUp className="h-3 w-3" /> Potencial
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-slate-800/40">
          <div className="flex h-14 w-14 items-center justify-center">
            <Target className="h-8 w-8 text-indigo-500" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{analise.valorVidaCliente}</p>
            <p className="text-xs text-slate-500">CLV</p>
          </div>
        </div>
      </div>

      {/* Análise */}
      <div className="mb-4 rounded-lg bg-white/60 p-3 dark:bg-slate-800/40">
        <p className="text-sm text-slate-700 dark:text-slate-300">{analise.analise}</p>
      </div>

      {/* Ações recomendadas */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Zap className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-semibold text-purple-800 dark:text-purple-300">Ações Recomendadas</span>
        </div>
        <ul className="space-y-2">
          {analise.acoesRecomendadas.map((acao, i) => (
            <li key={i} className="flex items-start gap-2 rounded-lg bg-white/60 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
              {acao}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────

type TabType = 'resumo' | 'ia' | 'historico' | 'enderecos' | 'contatos';

export default function ClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;

  const { data: cliente, isLoading, isError } = useCliente(clienteId);
  const { data: resumo } = useClienteResumo(clienteId);
  const { data: timeline = [], isLoading: loadingTimeline } = useClienteTimeline(clienteId);
  const { data: enderecos = [], isLoading: loadingEnderecos } = useClienteEnderecos(clienteId);
  const { data: contatos = [], isLoading: loadingContatos } = useClienteContatos(clienteId);
  const inativar = useInativarCliente();

  const [tabAtiva, setTabAtiva] = useState<TabType>('resumo');
  const [modalInteracao, setModalInteracao] = useState(false);
  const [modalEndereco, setModalEndereco] = useState(false);
  const [modalContato, setModalContato] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const removerEndereco = useRemoverEndereco();
  const removerContato = useRemoverContato();

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-marca-500" />
    </div>
  );

  if (isError || !cliente) return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950/20">
      <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Cliente não encontrado</h2>
      <Link href="/dashboard/clientes" className="mt-4 inline-block rounded-lg bg-marca-500 px-4 py-2 text-white hover:bg-marca-600">
        Voltar para Clientes
      </Link>
    </div>
  );

  const totalCompras = resumo?.totalCompras ?? cliente.totalCompras ?? 0;
  const totalPedidos = resumo?.totalPedidos ?? cliente.quantidadePedidos ?? 0;
  const ticketMedio = resumo?.ticketMedio ?? (totalPedidos > 0 ? totalCompras / totalPedidos : 0);
  const ultimaCompra = resumo?.ultimaCompra ?? cliente.ultimaCompra;
  const score = resumo?.score ?? (cliente as any).score;

  const scoreColor = !score ? '#94a3b8' : score >= 7 ? '#22c55e' : score >= 4 ? '#f59e0b' : '#ef4444';

  const TABS: { id: TabType; label: string; count?: number }[] = [
    { id: 'resumo', label: 'Resumo' },
    { id: 'ia', label: '✦ IA' },
    { id: 'historico', label: 'Histórico', count: timeline.length || undefined },
    { id: 'enderecos', label: 'Endereços', count: enderecos.length || undefined },
    { id: 'contatos', label: 'Contatos', count: contatos.length || undefined },
  ];

  return (
    <div className="space-y-6">
      {/* Modais */}
      {modalInteracao && <ModalInteracao clienteId={clienteId} onClose={() => setModalInteracao(false)} />}
      {modalEndereco && <ModalEndereco clienteId={clienteId} onClose={() => setModalEndereco(false)} />}
      {modalContato && <ModalContato clienteId={clienteId} onClose={() => setModalContato(false)} />}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/clientes" className="flex items-center justify-center rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{cliente.nome}</h1>
              <StatusBadge status={cliente.status} label={STATUS_LABELS[cliente.status]} />
              {score && (
                <div className="flex items-center gap-1.5 rounded-full border px-2.5 py-1" style={{ borderColor: scoreColor + '40', background: scoreColor + '15' }}>
                  <Star className="h-3.5 w-3.5" style={{ color: scoreColor }} />
                  <span className="text-xs font-bold" style={{ color: scoreColor }}>Score {score}/10</span>
                </div>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                {cliente.tipo === 'PF' ? <User className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
                {TIPO_LABELS[cliente.tipo]}
              </span>
              {cliente.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{cliente.email}</span>}
              {(cliente.celular ?? cliente.telefone) && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{cliente.celular ?? cliente.telefone}</span>}
              {cliente.origem && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{ORIGEM_LABELS[cliente.origem] ?? cliente.origem}</span>}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button onClick={() => setModalInteracao(true)}
            className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-marca-600 transition-colors">
            <Plus className="h-4 w-4" /> Interação
          </button>
          <button onClick={() => router.push(`/dashboard/clientes/${clienteId}/editar`)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
            <Edit className="h-4 w-4" /> Editar
          </button>
          <button onClick={() => { if (confirm(`Inativar "${cliente.nome}"?`)) { inativar.mutate(clienteId, { onSuccess: () => router.push('/dashboard/clientes') }); } }}
            className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20">
            <Archive className="h-4 w-4" /> Inativar
          </button>
        </div>
      </div>

      {/* Tags */}
      {(cliente.tags ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(cliente.tags ?? []).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-destaque-100 px-3 py-1 text-xs font-semibold text-destaque-700 dark:bg-destaque-900/30 dark:text-destaque-400">
              <Tag className="h-3 w-3" />{tag}
            </span>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Total de Pedidos" valor={totalPedidos} icone={<ShoppingCart className="h-6 w-6" />} />
        <KPICard label="Total Gasto" valor={moeda(totalCompras)} icone={<DollarSign className="h-6 w-6" />} destaque />
        <KPICard label="Ticket Médio" valor={moeda(ticketMedio)} icone={<TrendingUp className="h-6 w-6" />} />
        <KPICard label="Última Compra" valor={dataFmt(ultimaCompra)} icone={<Calendar className="h-6 w-6" />} />
      </div>

      {/* Abas */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-1 overflow-x-auto px-1">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setTabAtiva(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tabAtiva === tab.id
                  ? 'border-marca-500 text-marca-600 dark:text-marca-400'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              } ${tab.id === 'ia' ? 'text-purple-600 dark:text-purple-400' : ''}`}>
              {tab.label}
              {tab.count !== undefined && (
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das abas */}

      {/* ── Resumo ── */}
      {tabAtiva === 'resumo' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {/* Dados do cliente */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">Dados do Cliente</h2>
              <dl className="grid grid-cols-2 gap-4">
                {[
                  { label: 'CPF / CNPJ', value: (cliente as any).cpf ?? (cliente as any).cnpj ?? '—' },
                  { label: 'Tipo', value: TIPO_LABELS[cliente.tipo] },
                  { label: 'Email', value: cliente.email ?? '—' },
                  { label: 'Celular', value: cliente.celular ?? '—' },
                  { label: 'Telefone', value: cliente.telefone ?? '—' },
                  { label: 'Origem', value: ORIGEM_LABELS[cliente.origem ?? ''] ?? cliente.origem ?? '—' },
                  { label: 'Cadastrado em', value: dataFmt(cliente.criadoEm) },
                  { label: 'Atualizado em', value: dataFmt((cliente as any).atualizadoEm) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">{value}</dd>
                  </div>
                ))}
              </dl>
              {(cliente as any).observacoes && (
                <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Observações</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{(cliente as any).observacoes}</p>
                </div>
              )}
            </div>

            {/* Segmentos */}
            {(resumo?.segmentos ?? []).length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Segmentos</h3>
                <div className="flex flex-wrap gap-2">
                  {(resumo?.segmentos ?? []).map((s) => (
                    <span key={s} className="rounded-full bg-marca-100 px-3 py-1 text-xs font-semibold text-marca-700 dark:bg-marca-900/30 dark:text-marca-400">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Métricas laterais */}
          <div className="space-y-4">
            {score && (
              <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Score do Cliente</h3>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20">
                    <GaugeRing value={score} max={10} color={scoreColor} size={80} />
                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold" style={{ color: scoreColor }}>{score}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{score}/10</p>
                    <p className="text-sm text-slate-500">{score >= 7 ? 'Excelente' : score >= 4 ? 'Regular' : 'Atenção'}</p>
                  </div>
                </div>
              </div>
            )}

            {resumo?.diasDesdeUltimaCompra !== undefined && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Recência</span>
                  </div>
                  <span className={`text-sm font-bold ${resumo.diasDesdeUltimaCompra < 30 ? 'text-green-600' : resumo.diasDesdeUltimaCompra < 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {resumo.diasDesdeUltimaCompra}d
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Dias desde última compra</p>
              </div>
            )}

            {resumo?.frequenciaMediaDias && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Frequência</span>
                  </div>
                  <span className="text-sm font-bold text-marca-600">a cada {resumo.frequenciaMediaDias}d</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Intervalo médio entre compras</p>
              </div>
            )}

            {/* Endereço principal */}
            {enderecos.find((e) => e.principal) && (() => {
              const end = enderecos.find((e) => e.principal)!;
              return (
                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Endereço Principal</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{end.logradouro}, {end.numero}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{end.bairro} — {end.cidade}/{end.estado}</p>
                  <p className="mt-1 font-mono text-xs text-slate-400">{end.cep}</p>
                </div>
              );
            })()}

            {/* Contato principal */}
            {contatos.find((c) => c.principal) && (() => {
              const ct = contatos.find((c) => c.principal)!;
              return (
                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Contato Principal</span>
                  </div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{ct.nome}</p>
                  {ct.cargo && <p className="text-xs text-slate-500">{ct.cargo}</p>}
                  {ct.email && <a href={`mailto:${ct.email}`} className="mt-1 flex items-center gap-1 text-xs text-marca-600 hover:underline"><Mail className="h-3 w-3" />{ct.email}</a>}
                  {ct.celular && <a href={`tel:${ct.celular}`} className="flex items-center gap-1 text-xs text-marca-600 hover:underline"><Phone className="h-3 w-3" />{ct.celular}</a>}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── IA ── */}
      {tabAtiva === 'ia' && <PainelIA clienteId={clienteId} />}

      {/* ── Histórico ── */}
      {tabAtiva === 'historico' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Histórico de Interações</h2>
            <button onClick={() => setModalInteracao(true)}
              className="flex items-center gap-2 rounded-lg bg-marca-500 px-3 py-2 text-sm font-semibold text-white hover:bg-marca-600">
              <Plus className="h-4 w-4" /> Registrar
            </button>
          </div>

          {/* Filtro por tipo */}
          {timeline.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {['TODOS', ...Array.from(new Set(timeline.map((i) => i.tipo)))].map((tipo) => (
                <button key={tipo} onClick={() => setFiltroTipo(tipo)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    filtroTipo === tipo
                      ? 'bg-marca-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                  }`}>
                  {tipo !== 'TODOS' && <span className={`h-1.5 w-1.5 rounded-full ${filtroTipo === tipo ? 'bg-white' : 'bg-current'}`} />}
                  {tipo === 'TODOS' ? `Todos (${timeline.length})` : tipo.charAt(0) + tipo.slice(1).toLowerCase().replace('_', ' ')}
                </button>
              ))}
            </div>
          )}

          {loadingTimeline ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
          ) : timeline.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
              <MessageSquare className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="font-medium text-slate-600 dark:text-slate-400">Nenhuma interação registrada</p>
              <p className="mt-1 text-sm text-slate-500">Clique em "Registrar" para adicionar a primeira</p>
            </div>
          ) : (() => {
            const filtrados = filtroTipo === 'TODOS' ? timeline : timeline.filter((i) => i.tipo === filtroTipo);
            return filtrados.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
                <Filter className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                <p className="text-sm text-slate-500">Nenhuma interação do tipo "{filtroTipo.toLowerCase()}"</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filtrados.map((item, idx) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${COR_INTERACAO[item.tipo] ?? COR_INTERACAO.OUTRO}`}>
                        {ICONE_INTERACAO[item.tipo] ?? <MessageSquare className="h-4 w-4" />}
                      </div>
                      {idx < filtrados.length - 1 && <div className="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-700" style={{ minHeight: 24 }} />}
                    </div>
                    <div className="flex-1 pb-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{item.titulo}</p>
                          {item.descricao && <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{item.descricao}</p>}
                          <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-medium ${COR_INTERACAO[item.tipo] ?? COR_INTERACAO.OUTRO}`}>
                            {item.tipo.charAt(0) + item.tipo.slice(1).toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                        <div className="ml-4 shrink-0 text-right">
                          <p className="text-xs text-slate-500">{dataFmt(item.criadoEm)}</p>
                          {item.usuarioNome && <p className="text-xs text-slate-400">{item.usuarioNome}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Endereços ── */}
      {tabAtiva === 'enderecos' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Endereços</h2>
            <button onClick={() => setModalEndereco(true)}
              className="flex items-center gap-2 rounded-lg bg-marca-500 px-3 py-2 text-sm font-semibold text-white hover:bg-marca-600">
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
          {loadingEnderecos ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
          ) : enderecos.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
              <MapPin className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="font-medium text-slate-600 dark:text-slate-400">Nenhum endereço cadastrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {enderecos.map((end) => (
                <div key={end.id} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{end.tipo}</h3>
                      {end.principal && (
                        <span className="mt-1 inline-block rounded-full bg-marca-100 px-2 py-0.5 text-xs font-semibold text-marca-700 dark:bg-marca-900/30 dark:text-marca-400">
                          Principal
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(`${end.logradouro} ${end.numero}, ${end.bairro}, ${end.cidade} - ${end.estado}`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700">
                        <ExternalLink className="h-3 w-3" /> Mapa
                      </a>
                      <button onClick={() => { if (confirm('Remover este endereço?')) removerEndereco.mutate({ clienteId, enderecoId: end.id }); }}
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p>{end.logradouro}, {end.numero}{end.complemento ? `, ${end.complemento}` : ''}</p>
                    <p>{end.bairro} — {end.cidade}/{end.estado}</p>
                    <p className="font-mono text-xs">{end.cep}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Contatos ── */}
      {tabAtiva === 'contatos' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Contatos</h2>
            <button onClick={() => setModalContato(true)}
              className="flex items-center gap-2 rounded-lg bg-marca-500 px-3 py-2 text-sm font-semibold text-white hover:bg-marca-600">
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
          {loadingContatos ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
          ) : contatos.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
              <User className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="font-medium text-slate-600 dark:text-slate-400">Nenhum contato cadastrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {contatos.map((c) => (
                <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{c.nome}</h3>
                      {c.cargo && <p className="text-sm text-slate-500">{c.cargo}</p>}
                      {c.principal && (
                        <span className="mt-1 inline-block rounded-full bg-marca-100 px-2 py-0.5 text-xs font-semibold text-marca-700 dark:bg-marca-900/30 dark:text-marca-400">
                          Principal
                        </span>
                      )}
                    </div>
                    <button onClick={() => { if (confirm(`Remover contato "${c.nome}"?`)) removerContato.mutate({ clienteId, contatoId: c.id }); }}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-marca-600 hover:underline dark:text-marca-400">
                        <Mail className="h-4 w-4" />{c.email}
                      </a>
                    )}
                    {c.celular && (
                      <div className="flex items-center gap-2">
                        <a href={`tel:${c.celular}`} className="flex flex-1 items-center gap-2 text-sm text-marca-600 hover:underline dark:text-marca-400">
                          <Phone className="h-4 w-4" />{c.celular}
                        </a>
                        <a href={`https://wa.me/${c.celular.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400">
                          <MessageCircle className="h-3 w-3" /> WhatsApp
                        </a>
                      </div>
                    )}
                    {c.telefone && (
                      <a href={`tel:${c.telefone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:underline dark:text-slate-400">
                        <Phone className="h-4 w-4" />{c.telefone}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
