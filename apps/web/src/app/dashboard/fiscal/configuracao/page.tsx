'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, ShieldCheck, Wifi, WifiOff, AlertTriangle,
  Building2, FileKey, Settings, ChevronDown, Loader2, CheckCircle2,
  Plus, Trash2, Search,
} from 'lucide-react';
import {
  useConfiguracaoFiscal, useSalvarConfiguracao,
  useRegrasFiscais, useCriarRegra, useAtualizarRegra,
} from '@/hooks/useFiscal';
import type { ConfiguracaoFiscal, RegraFiscal } from '@/services/fiscal.service';

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

// ─── Tab config ───────────────────────────────────────────────────────────────
type Tab = 'empresa' | 'certificado' | 'sefaz' | 'series' | 'regras';
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'empresa',      label: 'Empresa',        icon: <Building2 className="h-4 w-4" /> },
  { id: 'certificado',  label: 'Certificado',     icon: <FileKey className="h-4 w-4" /> },
  { id: 'sefaz',        label: 'SEFAZ',           icon: <Wifi className="h-4 w-4" /> },
  { id: 'series',       label: 'Séries',          icon: <Settings className="h-4 w-4" /> },
  { id: 'regras',       label: 'Regras Fiscais',  icon: <ShieldCheck className="h-4 w-4" /> },
];

// ─── Modal nova regra ─────────────────────────────────────────────────────────
function ModalRegra({
  regra, onClose, onSave, loading,
}: {
  regra?: Partial<RegraFiscal>;
  onClose: () => void;
  onSave: (data: Omit<RegraFiscal, 'id'>) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<Omit<RegraFiscal, 'id'>>({
    ncm:               regra?.ncm ?? '',
    descricaoNCM:      regra?.descricaoNCM ?? '',
    cfopEstadual:      regra?.cfopEstadual ?? '5102',
    cfopInterestadual: regra?.cfopInterestadual ?? '6102',
    cst:               regra?.cst,
    csosn:             regra?.csosn ?? '400',
    aliquotaICMS:      regra?.aliquotaICMS ?? 12,
    aliquotaPIS:       regra?.aliquotaPIS ?? 0.65,
    aliquotaCOFINS:    regra?.aliquotaCOFINS ?? 3,
    aliquotaIPI:       regra?.aliquotaIPI,
    observacao:        regra?.observacao ?? '',
    ativo:             regra?.ativo ?? true,
  });

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{regra?.ncm ? 'Editar Regra' : 'Nova Regra Fiscal'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">NCM *</label>
              <input value={form.ncm} onChange={e => set('ncm', e.target.value)}
                placeholder="0000.00.00"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">CSOSN / CST</label>
              <input value={form.csosn ?? ''} onChange={e => set('csosn', e.target.value)}
                placeholder="400"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Descrição NCM</label>
            <input value={form.descricaoNCM} onChange={e => set('descricaoNCM', e.target.value)}
              placeholder="Ex: Smartphones e aparelhos celulares"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">CFOP Estadual</label>
              <input value={form.cfopEstadual} onChange={e => set('cfopEstadual', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">CFOP Interestadual</label>
              <input value={form.cfopInterestadual} onChange={e => set('cfopInterestadual', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {([
              { key: 'aliquotaICMS' as const,   label: 'ICMS %' },
              { key: 'aliquotaPIS' as const,    label: 'PIS %' },
              { key: 'aliquotaCOFINS' as const, label: 'COFINS %' },
            ]).map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                <input type="number" min={0} step={0.01} value={form[f.key]}
                  onChange={e => set(f.key, +e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-marca-500" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Observação</label>
            <input value={form.observacao ?? ''} onChange={e => set('observacao', e.target.value)}
              placeholder="Observação opcional"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500" />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancelar
          </button>
          <button onClick={() => onSave(form)} disabled={!form.ncm || loading}
            className="flex-1 rounded-xl bg-marca-600 py-2 text-sm font-semibold text-white hover:bg-marca-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ConfiguracaoFiscalPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('empresa');
  const [form, setForm] = useState<Partial<ConfiguracaoFiscal>>({});
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<{ msg: string; tipo: 'ok' | 'err' } | null>(null);
  const [buscaRegra, setBuscaRegra] = useState('');
  const [modalRegra, setModalRegra] = useState<{ open: boolean; regra?: Partial<RegraFiscal> & { id?: string } }>({ open: false });

  const { data: cfg, isLoading: loadingCfg } = useConfiguracaoFiscal();
  const salvar = useSalvarConfiguracao();
  const { data: regrasData, isLoading: loadingRegras } = useRegrasFiscais(buscaRegra);
  const criarRegra    = useCriarRegra();
  const atualizarRegra = useAtualizarRegra();

  useEffect(() => {
    if (cfg && !dirty) setForm(cfg);
  }, [cfg, dirty]);

  const set = (k: keyof ConfiguracaoFiscal, v: any) => {
    setForm(f => ({ ...f, [k]: v }));
    setDirty(true);
  };

  const showToast = (msg: string, tipo: 'ok' | 'err') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSalvar = async () => {
    try {
      await salvar.mutateAsync(form);
      setDirty(false);
      showToast('Configurações salvas com sucesso', 'ok');
    } catch {
      showToast('Erro ao salvar configurações', 'err');
    }
  };

  const handleSalvarRegra = async (data: Omit<RegraFiscal, 'id'>) => {
    try {
      if (modalRegra.regra?.id) {
        await atualizarRegra.mutateAsync({ id: modalRegra.regra.id, data });
      } else {
        await criarRegra.mutateAsync(data);
      }
      setModalRegra({ open: false });
      showToast('Regra salva com sucesso', 'ok');
    } catch {
      showToast('Erro ao salvar regra', 'err');
    }
  };

  const regras: RegraFiscal[] = regrasData?.regras ?? [];

  if (loadingCfg) return (
    <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-marca-500" /></div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 rounded-2xl px-4 py-3 shadow-lg text-sm font-medium flex items-center gap-2 ${toast.tipo === 'ok' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.tipo === 'ok' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {modalRegra.open && (
        <ModalRegra
          regra={modalRegra.regra}
          onClose={() => setModalRegra({ open: false })}
          onSave={handleSalvarRegra}
          loading={criarRegra.isPending || atualizarRegra.isPending}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft className="h-4 w-4 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Configuração Fiscal</h1>
            <p className="text-sm text-slate-500 mt-0.5">Empresa, certificado digital, SEFAZ e regras</p>
          </div>
        </div>
        {tab !== 'regras' && (
          <button onClick={handleSalvar} disabled={!dirty || salvar.isPending}
            className="flex items-center gap-2 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 disabled:opacity-50 transition-colors shadow-sm">
            {salvar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar
          </button>
        )}
      </div>

      {/* SEFAZ status banner */}
      {cfg && (
        <div className={`rounded-2xl border px-5 py-3 flex items-center gap-3 ${
          cfg.sefazStatus === 'ONLINE'  ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50' :
          cfg.sefazStatus === 'INSTAVEL'? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50' :
          'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50'
        }`}>
          {cfg.sefazStatus === 'ONLINE' ? <Wifi className="h-4 w-4 text-emerald-600 flex-shrink-0" /> :
           cfg.sefazStatus === 'INSTAVEL' ? <Wifi className="h-4 w-4 text-amber-600 flex-shrink-0" /> :
           <WifiOff className="h-4 w-4 text-red-600 flex-shrink-0" />}
          <div className="flex-1 flex items-center gap-3">
            <span className={`text-sm font-semibold ${cfg.sefazStatus === 'ONLINE' ? 'text-emerald-700 dark:text-emerald-400' : cfg.sefazStatus === 'INSTAVEL' ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400'}`}>
              SEFAZ {cfg.sefazStatus === 'ONLINE' ? 'Online' : cfg.sefazStatus === 'INSTAVEL' ? 'Instável' : 'Offline'}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.ambiente === 'HOMOLOGACAO' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
              {cfg.ambiente === 'HOMOLOGACAO' ? 'Homologação' : 'Produção'}
            </span>
          </div>
          {cfg.certificadoStatus !== 'VALIDO' && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              Certificado inválido
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors ${tab === t.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Empresa ── */}
      {tab === 'empresa' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Dados da Empresa Emitente</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Razão Social *</label>
              <input value={form.razaoSocial ?? ''} onChange={e => set('razaoSocial', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nome Fantasia</label>
              <input value={form.nomeFantasia ?? ''} onChange={e => set('nomeFantasia', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">CNPJ</label>
              <input value={form.cnpj ?? ''} onChange={e => set('cnpj', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Inscrição Estadual</label>
              <input value={form.ie ?? ''} onChange={e => set('ie', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Inscrição Municipal</label>
              <input value={form.im ?? ''} onChange={e => set('im', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">CNAE</label>
              <input value={form.cnae ?? ''} onChange={e => set('cnae', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Regime Tributário</label>
              <div className="relative">
                <select value={form.regimeTributario ?? 'LUCRO_PRESUMIDO'} onChange={e => set('regimeTributario', e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-8 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500">
                  <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                  <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                  <option value="LUCRO_REAL">Lucro Real</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Endereço</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Logradouro</label>
                <input value={form.logradouro ?? ''} onChange={e => set('logradouro', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Número</label>
                <input value={form.numero ?? ''} onChange={e => set('numero', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Bairro</label>
                <input value={form.bairro ?? ''} onChange={e => set('bairro', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Município</label>
                <input value={form.municipio ?? ''} onChange={e => set('municipio', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500" />
              </div>
              <div className="flex gap-3">
                <div className="w-24">
                  <label className="block text-xs font-medium text-slate-500 mb-1">UF</label>
                  <div className="relative">
                    <select value={form.uf ?? 'SP'} onChange={e => set('uf', e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-7 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500">
                      {UFS.map(uf => <option key={uf}>{uf}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">CEP</label>
                  <input value={form.cep ?? ''} onChange={e => set('cep', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Alíquotas padrão */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Alíquotas Padrão</h3>
            <div className="grid grid-cols-3 gap-4">
              {([
                { key: 'aliquotaICMSPadrao' as const, label: 'ICMS %' },
                { key: 'aliquotaPISPadrao'  as const, label: 'PIS %'  },
                { key: 'aliquotaCOFINSPadrao' as const, label: 'COFINS %' },
              ]).map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                  <input type="number" min={0} step={0.01} value={form[f.key] ?? 0}
                    onChange={e => set(f.key, +e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-marca-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Certificado ── */}
      {tab === 'certificado' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Certificado Digital A1</h2>

          {/* Status card */}
          <div className={`rounded-2xl border p-5 flex items-center gap-4 ${
            form.certificadoStatus === 'VALIDO'    ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50' :
            form.certificadoStatus === 'EXPIRADO'  ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50' :
            'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700'
          }`}>
            <div className={`rounded-xl p-3 ${form.certificadoStatus === 'VALIDO' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
              <FileKey className={`h-6 w-6 ${form.certificadoStatus === 'VALIDO' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {form.certificadoStatus === 'VALIDO' ? 'Certificado válido' :
                 form.certificadoStatus === 'EXPIRADO' ? 'Certificado expirado' :
                 'Certificado não configurado'}
              </p>
              {form.certificadoTitular && <p className="text-sm text-slate-500 mt-0.5">{form.certificadoTitular}</p>}
              {form.certificadoValidade && <p className="text-xs text-slate-400 mt-0.5">Validade: {new Date(form.certificadoValidade).toLocaleDateString('pt-BR')}</p>}
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              form.certificadoStatus === 'VALIDO'   ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
              form.certificadoStatus === 'EXPIRADO' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
            }`}>
              {form.certificadoStatus === 'VALIDO' ? 'Válido' : form.certificadoStatus === 'EXPIRADO' ? 'Expirado' : 'Não configurado'}
            </span>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
            <FileKey className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Arraste o arquivo .pfx ou clique para selecionar</p>
            <p className="text-xs text-slate-400 mt-1">Certificado A1 — Arquivo .pfx com senha</p>
            <button className="mt-4 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 transition-colors">
              Selecionar Certificado
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: SEFAZ ── */}
      {tab === 'sefaz' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Configurações SEFAZ</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Ambiente</label>
              <div className="flex gap-3">
                {[
                  { value: 'HOMOLOGACAO', label: 'Homologação', desc: 'Testes — NFs sem validade fiscal' },
                  { value: 'PRODUCAO',    label: 'Produção',    desc: 'NFs com validade jurídica' },
                ].map(op => (
                  <button key={op.value} onClick={() => set('ambiente', op.value as any)}
                    className={`flex-1 rounded-2xl border-2 p-4 text-left transition-colors ${form.ambiente === op.value ? 'border-marca-500 bg-marca-50 dark:bg-marca-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                    <p className={`font-semibold text-sm ${form.ambiente === op.value ? 'text-marca-700 dark:text-marca-300' : 'text-slate-800 dark:text-slate-200'}`}>{op.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{op.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            {form.ambiente === 'PRODUCAO' && (
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 px-5 py-3 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Atenção:</strong> Em Produção, todas as NFs emitidas têm validade fiscal e obrigações tributárias.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Séries ── */}
      {tab === 'series' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Séries e Numeração</h2>
          <div className="grid grid-cols-2 gap-5">
            {[
              { serieKey: 'serieNFe' as const, numKey: 'proximoNumeroNFe' as const, label: 'NF-e' },
              { serieKey: 'serieNFCe' as const, numKey: 'proximoNumeroNFCe' as const, label: 'NFC-e' },
            ].map(f => (
              <div key={f.label} className="rounded-2xl border border-slate-100 dark:border-slate-700 p-4 space-y-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{f.label}</p>
                <div className="flex gap-3">
                  <div className="w-20">
                    <label className="block text-[10px] text-slate-400 mb-1">Série</label>
                    <input value={form[f.serieKey] ?? ''} onChange={e => set(f.serieKey, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-center font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-400 mb-1">Próximo Número</label>
                    <input type="number" min={1} value={form[f.numKey] ?? 1} onChange={e => set(f.numKey, +e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-right tabular-nums font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">CFOP Padrão Estadual</label>
              <input value={form.cfopPadraoEstadual ?? ''} onChange={e => set('cfopPadraoEstadual', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">CFOP Padrão Interestadual</label>
              <input value={form.cfopPadraoInterestadual ?? ''} onChange={e => set('cfopPadraoInterestadual', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Regras Fiscais ── */}
      {tab === 'regras' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input value={buscaRegra} onChange={e => setBuscaRegra(e.target.value)}
                placeholder="Buscar por NCM ou descrição..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500" />
            </div>
            <button onClick={() => setModalRegra({ open: true, regra: undefined })}
              className="flex items-center gap-2 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 transition-colors shadow-sm">
              <Plus className="h-4 w-4" />Nova Regra
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            {loadingRegras ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-marca-500" /></div>
            ) : regras.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">Nenhuma regra fiscal cadastrada</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                      {['NCM', 'Descrição', 'CFOP Est.', 'CFOP Inter.', 'ICMS', 'PIS', 'COFINS', 'Status', ''].map(h => (
                        <th key={h} className={`px-3 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wide ${['ICMS','PIS','COFINS'].includes(h) ? 'text-right' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {regras.map((r: RegraFiscal) => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-3 py-2.5 font-mono text-xs text-slate-700 dark:text-slate-300">{r.ncm}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 max-w-[180px] truncate">{r.descricaoNCM}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-slate-500">{r.cfopEstadual}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-slate-500">{r.cfopInterestadual}</td>
                        <td className="px-3 py-2.5 text-right text-xs tabular-nums text-orange-600">{r.aliquotaICMS}%</td>
                        <td className="px-3 py-2.5 text-right text-xs tabular-nums text-orange-600">{r.aliquotaPIS}%</td>
                        <td className="px-3 py-2.5 text-right text-xs tabular-nums text-orange-600">{r.aliquotaCOFINS}%</td>
                        <td className="px-3 py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.ativo ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                            {r.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button onClick={() => setModalRegra({ open: true, regra: r })}
                            className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
