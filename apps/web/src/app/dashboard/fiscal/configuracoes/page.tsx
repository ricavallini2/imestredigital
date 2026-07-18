'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Save, Building2, MapPin, Wifi, Settings, ShieldCheck,
  ChevronDown, Loader2, CheckCircle2, AlertTriangle, Info,
} from 'lucide-react'
import { useConfiguracaoFiscalReal, useSalvarConfiguracaoFiscalReal } from '@/hooks/useFiscal'
import { Abas } from '@/components/ui/abas'
import type {
  ConfiguracaoFiscalReal,
  AtualizarConfiguracaoFiscalReal,
  RegimeTributario,
  AmbienteSefaz,
  NaturezaOperacao,
} from '@/services/fiscal.service'

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

const REGIMES: { value: RegimeTributario; label: string }[] = [
  { value: 'SIMPLES_NACIONAL', label: 'Simples Nacional' },
  { value: 'MEI', label: 'MEI' },
  { value: 'LUCRO_PRESUMIDO', label: 'Lucro Presumido' },
  { value: 'LUCRO_REAL', label: 'Lucro Real' },
]

const NATUREZAS: { value: NaturezaOperacao; label: string }[] = [
  { value: 'VENDA', label: 'Venda' },
  { value: 'DEVOLUCAO_VENDA', label: 'Devolução de Venda' },
  { value: 'COMPRA', label: 'Compra' },
  { value: 'DEVOLUCAO_COMPRA', label: 'Devolução de Compra' },
  { value: 'TRANSFERENCIA', label: 'Transferência' },
  { value: 'REMESSA', label: 'Remessa' },
  { value: 'RETORNO', label: 'Retorno' },
  { value: 'BONIFICACAO', label: 'Bonificação' },
]

// ─── Máscaras (formatação para exibição; sempre desmascaradas antes do envio) ──
const soDigitos = (v: string) => v.replace(/\D/g, '')

const mascaraCNPJ = (v: string) =>
  soDigitos(v)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')

const mascaraCEP = (v: string) =>
  soDigitos(v)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, '$1-$2')

const mascaraTelefone = (v: string) => {
  const d = soDigitos(v).slice(0, 11)
  if (d.length <= 10) return d.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
  return d.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

// ─── Estado do formulário (strings para inputs controlados) ────────────────────
interface FormState {
  regimeTributario: RegimeTributario
  ambienteSefaz: AmbienteSefaz
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  inscricaoEstadual: string
  inscricaoMunicipal: string
  cnae: string
  crt: string
  uf: string
  codigoMunicipio: string
  municipio: string
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  telefone: string
  email: string
  serieNfe: string
  serieNfce: string
  tokenCsc: string
  idCsc: string
  naturezaOperacaoPadrao: NaturezaOperacao
}

const FORM_VAZIO: FormState = {
  regimeTributario: 'SIMPLES_NACIONAL',
  ambienteSefaz: 'HOMOLOGACAO',
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  inscricaoEstadual: '',
  inscricaoMunicipal: '',
  cnae: '',
  crt: '',
  uf: 'SP',
  codigoMunicipio: '',
  municipio: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  telefone: '',
  email: '',
  serieNfe: '1',
  serieNfce: '1',
  tokenCsc: '',
  idCsc: '',
  naturezaOperacaoPadrao: 'VENDA',
}

/** Preenche o formulário a partir da configuração real do backend. */
function configParaForm(cfg: ConfiguracaoFiscalReal): FormState {
  return {
    regimeTributario: cfg.regimeTributario ?? 'SIMPLES_NACIONAL',
    ambienteSefaz: cfg.ambienteSefaz ?? 'HOMOLOGACAO',
    cnpj: cfg.cnpj ? mascaraCNPJ(cfg.cnpj) : '',
    razaoSocial: cfg.razaoSocial ?? '',
    nomeFantasia: cfg.nomeFantasia ?? '',
    inscricaoEstadual: cfg.inscricaoEstadual ?? '',
    inscricaoMunicipal: cfg.inscricaoMunicipal ?? '',
    cnae: cfg.cnae ?? '',
    crt: cfg.crt ?? '',
    uf: cfg.uf ?? 'SP',
    codigoMunicipio: cfg.codigoMunicipio ?? '',
    municipio: cfg.municipio ?? '',
    cep: cfg.cep ? mascaraCEP(cfg.cep) : '',
    endereco: cfg.endereco ?? '',
    numero: cfg.numero ?? '',
    complemento: cfg.complemento ?? '',
    bairro: cfg.bairro ?? '',
    telefone: cfg.telefone ? mascaraTelefone(cfg.telefone) : '',
    email: cfg.email ?? '',
    serieNfe: cfg.serieNfe ?? '1',
    serieNfce: cfg.serieNfce ?? '1',
    tokenCsc: cfg.tokenCsc ?? '',
    idCsc: cfg.idCsc ?? '',
    naturezaOperacaoPadrao: cfg.naturezaOperacaoPadrao ?? 'VENDA',
  }
}

/**
 * Converte o formulário → DTO do backend, desmascarando e OMITINDO opcionais
 * vazios (o backend usa whitelist estrita + validações de tamanho: CNPJ 14,
 * CEP 8, código do município 7 dígitos, UF 2 letras, e-mail válido).
 */
function formParaDto(form: FormState): AtualizarConfiguracaoFiscalReal {
  const dto: AtualizarConfiguracaoFiscalReal = {
    regimeTributario: form.regimeTributario,
    ambienteSefaz: form.ambienteSefaz,
    naturezaOperacaoPadrao: form.naturezaOperacaoPadrao,
  }
  const set = (k: keyof AtualizarConfiguracaoFiscalReal, v: string) => {
    const t = v.trim()
    if (t) (dto as Record<string, unknown>)[k] = t
  }

  const cnpj = soDigitos(form.cnpj)
  if (cnpj) dto.cnpj = cnpj
  const cep = soDigitos(form.cep)
  if (cep) dto.cep = cep
  const telefone = soDigitos(form.telefone)
  if (telefone) dto.telefone = telefone
  const codMun = soDigitos(form.codigoMunicipio)
  if (codMun) dto.codigoMunicipio = codMun

  set('razaoSocial', form.razaoSocial)
  set('nomeFantasia', form.nomeFantasia)
  set('inscricaoEstadual', form.inscricaoEstadual)
  set('inscricaoMunicipal', form.inscricaoMunicipal)
  set('cnae', form.cnae)
  set('crt', form.crt)
  set('uf', form.uf)
  set('municipio', form.municipio)
  set('endereco', form.endereco)
  set('numero', form.numero)
  set('complemento', form.complemento)
  set('bairro', form.bairro)
  set('email', form.email)
  set('serieNfe', form.serieNfe)
  set('serieNfce', form.serieNfce)
  set('tokenCsc', form.tokenCsc)
  set('idCsc', form.idCsc)

  return dto
}

/** Validação client-side espelhando as regras do backend. */
function validar(form: FormState): string[] {
  const erros: string[] = []
  const cnpj = soDigitos(form.cnpj)
  if (cnpj && cnpj.length !== 14) erros.push('CNPJ deve ter 14 dígitos')
  const cep = soDigitos(form.cep)
  if (cep && cep.length !== 8) erros.push('CEP deve ter 8 dígitos')
  const codMun = soDigitos(form.codigoMunicipio)
  if (codMun && codMun.length !== 7) erros.push('Código do município (IBGE) deve ter 7 dígitos')
  if (form.uf && form.uf.length !== 2) erros.push('UF deve ter 2 letras')
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) erros.push('E-mail inválido')
  return erros
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────
type Tab = 'empresa' | 'endereco' | 'sefaz' | 'series'
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'empresa',  label: 'Empresa',   icon: <Building2 className="h-4 w-4" /> },
  { id: 'endereco', label: 'Endereço',  icon: <MapPin className="h-4 w-4" /> },
  { id: 'sefaz',    label: 'SEFAZ',     icon: <Wifi className="h-4 w-4" /> },
  { id: 'series',   label: 'Séries & NFC-e', icon: <Settings className="h-4 w-4" /> },
]

// ─── Campo reutilizável ─────────────────────────────────────────────────────────
const inputCls =
  'w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-marca-500'

function Campo({
  label, value, onChange, placeholder, mono, className, maxLength, hint, type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  mono?: boolean
  className?: string
  maxLength?: number
  hint?: string
  type?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} ${mono ? 'font-mono' : ''}`}
      />
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

// ─── Página ──────────────────────────────────────────────────────────────────────
export default function ConfiguracoesFiscaisPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('empresa')
  const [form, setForm] = useState<FormState>(FORM_VAZIO)
  const [dirty, setDirty] = useState(false)
  const [toast, setToast] = useState<{ msg: string; tipo: 'ok' | 'err' } | null>(null)

  const { data: cfg, isLoading } = useConfiguracaoFiscalReal()
  const salvar = useSalvarConfiguracaoFiscalReal()

  useEffect(() => {
    if (cfg && !dirty) setForm(configParaForm(cfg))
  }, [cfg, dirty])

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setDirty(true)
  }

  const erros = useMemo(() => validar(form), [form])

  const showToast = (msg: string, tipo: 'ok' | 'err') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3500)
  }

  const handleSalvar = async () => {
    if (erros.length > 0) {
      showToast(erros[0], 'err')
      return
    }
    try {
      await salvar.mutateAsync(formParaDto(form))
      setDirty(false)
      showToast('Configuração fiscal salva com sucesso', 'ok')
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'response' in e
          ? extrairMensagemErro((e as { response?: { data?: { message?: string | string[] } } }).response?.data?.message)
          : 'Erro ao salvar configuração'
      showToast(msg, 'err')
    }
  }

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-marca-500" />
      </div>
    )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-2xl px-4 py-3 shadow-lg text-sm font-medium flex items-center gap-2 ${
            toast.tipo === 'ok' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.tipo === 'ok' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/fiscal')}
            className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Configuração Fiscal</h1>
            <p className="text-sm text-slate-500 mt-0.5">Emitente, endereço, ambiente SEFAZ e numeração</p>
          </div>
        </div>
      </div>

      {/* Banner ambiente */}
      <div
        className={`rounded-2xl border px-5 py-3 flex items-center gap-3 ${
          form.ambienteSefaz === 'PRODUCAO'
            ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50'
            : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50'
        }`}
      >
        {form.ambienteSefaz === 'PRODUCAO' ? (
          <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
        ) : (
          <Info className="h-4 w-4 text-amber-600 flex-shrink-0" />
        )}
        <span
          className={`text-sm font-semibold ${
            form.ambienteSefaz === 'PRODUCAO'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-amber-700 dark:text-amber-400'
          }`}
        >
          Ambiente {form.ambienteSefaz === 'PRODUCAO' ? 'Produção' : 'Homologação'}
        </span>
        <span className="text-xs text-slate-500">
          {form.ambienteSefaz === 'PRODUCAO'
            ? 'Notas emitidas têm validade fiscal.'
            : 'Notas de teste, sem validade fiscal.'}
        </span>
      </div>

      {/* Ações — acima das abas (padrão do ERP) */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSalvar}
          disabled={!dirty || salvar.isPending || erros.length > 0}
          className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-50 transition-colors shadow-sm"
        >
          {salvar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar
        </button>
      </div>

      {/* Abas */}
      <Abas
        abas={TABS.map((t) => ({ id: t.id, label: t.label, icone: t.icon }))}
        ativa={tab}
        onChange={setTab}
      />

      {/* ── Tab: Empresa ── */}
      {tab === 'empresa' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Dados do Emitente</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo className="sm:col-span-2" label="Razão Social *" value={form.razaoSocial} onChange={(v) => set('razaoSocial', v)} placeholder="Empresa Exemplo LTDA" />
            <Campo label="Nome Fantasia" value={form.nomeFantasia} onChange={(v) => set('nomeFantasia', v)} placeholder="Minha Loja" />
            <Campo label="CNPJ" value={form.cnpj} onChange={(v) => set('cnpj', mascaraCNPJ(v))} placeholder="00.000.000/0000-00" mono hint="14 dígitos" />
            <Campo label="Inscrição Estadual" value={form.inscricaoEstadual} onChange={(v) => set('inscricaoEstadual', v)} mono placeholder="ISENTO ou número" />
            <Campo label="Inscrição Municipal" value={form.inscricaoMunicipal} onChange={(v) => set('inscricaoMunicipal', v)} mono />
            <Campo label="CNAE Principal" value={form.cnae} onChange={(v) => set('cnae', v)} mono placeholder="4751201" />
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Regime Tributário *</label>
              <div className="relative">
                <select
                  value={form.regimeTributario}
                  onChange={(e) => set('regimeTributario', e.target.value as RegimeTributario)}
                  className={`${inputCls} appearance-none pr-8`}
                >
                  {REGIMES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
            <Campo label="CRT" value={form.crt} onChange={(v) => set('crt', v)} mono placeholder="Derivado do regime se vazio" hint="Código de Regime Tributário (1, 2 ou 3)" />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo label="Telefone" value={form.telefone} onChange={(v) => set('telefone', mascaraTelefone(v))} mono placeholder="(11) 90000-0000" />
            <Campo label="E-mail" type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="contato@empresa.com.br" />
          </div>
        </div>
      )}

      {/* ── Tab: Endereço ── */}
      {tab === 'endereco' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Endereço do Emitente</h2>
          <p className="text-xs text-slate-500 -mt-3">Compõe o grupo <code className="font-mono">enderEmit</code> do XML da NF-e.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <Campo className="sm:col-span-4" label="Logradouro" value={form.endereco} onChange={(v) => set('endereco', v)} placeholder="Av. Paulista" />
            <Campo className="sm:col-span-2" label="Número" value={form.numero} onChange={(v) => set('numero', v)} mono placeholder="1000" />
            <Campo className="sm:col-span-3" label="Complemento" value={form.complemento} onChange={(v) => set('complemento', v)} placeholder="Sala 101" />
            <Campo className="sm:col-span-3" label="Bairro" value={form.bairro} onChange={(v) => set('bairro', v)} placeholder="Bela Vista" />
            <Campo className="sm:col-span-3" label="Município" value={form.municipio} onChange={(v) => set('municipio', v)} placeholder="São Paulo" />
            <Campo className="sm:col-span-3" label="Código do Município (IBGE)" value={form.codigoMunicipio} onChange={(v) => set('codigoMunicipio', soDigitos(v).slice(0, 7))} mono placeholder="3550308" hint="7 dígitos" />
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">UF</label>
              <div className="relative">
                <select
                  value={form.uf}
                  onChange={(e) => set('uf', e.target.value)}
                  className={`${inputCls} appearance-none pr-8`}
                >
                  {UFS.map((uf) => (
                    <option key={uf}>{uf}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
            <Campo className="sm:col-span-2" label="CEP" value={form.cep} onChange={(v) => set('cep', mascaraCEP(v))} mono placeholder="00000-000" hint="8 dígitos" />
          </div>
        </div>
      )}

      {/* ── Tab: SEFAZ ── */}
      {tab === 'sefaz' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Ambiente SEFAZ</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            {([
              { value: 'HOMOLOGACAO', label: 'Homologação', desc: 'Testes — NFs sem validade fiscal' },
              { value: 'PRODUCAO', label: 'Produção', desc: 'NFs com validade jurídica' },
            ] as const).map((op) => (
              <button
                key={op.value}
                onClick={() => set('ambienteSefaz', op.value)}
                className={`flex-1 rounded-2xl border-2 p-4 text-left transition-colors ${
                  form.ambienteSefaz === op.value
                    ? 'border-marca-500 bg-marca-50 dark:bg-marca-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <p
                  className={`font-semibold text-sm ${
                    form.ambienteSefaz === op.value ? 'text-marca-700 dark:text-marca-300' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {op.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{op.desc}</p>
              </button>
            ))}
          </div>
          {form.ambienteSefaz === 'PRODUCAO' && (
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 px-5 py-3 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Atenção:</strong> em Produção, todas as NFs emitidas têm validade fiscal e obrigações tributárias.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <label className="block text-xs font-medium text-slate-500 mb-1">Natureza de Operação Padrão</label>
            <div className="relative max-w-xs">
              <select
                value={form.naturezaOperacaoPadrao}
                onChange={(e) => set('naturezaOperacaoPadrao', e.target.value as NaturezaOperacao)}
                className={`${inputCls} appearance-none pr-8`}
              >
                {NATUREZAS.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Aplicada a novas notas quando nenhuma natureza é informada.</p>
          </div>
        </div>
      )}

      {/* ── Tab: Séries & NFC-e ── */}
      {tab === 'series' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-5">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Séries de Numeração</h2>
            <div className="grid grid-cols-2 gap-5">
              <Campo label="Série NF-e (mod. 55)" value={form.serieNfe} onChange={(v) => set('serieNfe', v)} mono placeholder="1" />
              <Campo label="Série NFC-e (mod. 65)" value={form.serieNfce} onChange={(v) => set('serieNfce', v)} mono placeholder="1" />
            </div>
            {cfg && (
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-700/40 px-4 py-3">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Próximo número NF-e</p>
                  <p className="text-lg font-bold tabular-nums text-slate-800 dark:text-slate-200">{cfg.proximoNumeroNfe ?? 1}</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-700/40 px-4 py-3">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Próximo número NFC-e</p>
                  <p className="text-lg font-bold tabular-nums text-slate-800 dark:text-slate-200">{cfg.proximoNumeroNfce ?? 1}</p>
                </div>
              </div>
            )}
            <p className="text-[10px] text-slate-400">A numeração é controlada atomicamente pelo serviço a cada emissão.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-5">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">NFC-e — Código de Segurança do Contribuinte (CSC)</h2>
            <p className="text-xs text-slate-500 -mt-3">Obrigatório para emissão de NFC-e (modelo 65). Emitido pela SEFAZ do seu estado.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Campo className="sm:col-span-2" label="Token CSC" value={form.tokenCsc} onChange={(v) => set('tokenCsc', v)} mono placeholder="Código alfanumérico" />
              <Campo label="ID do CSC" value={form.idCsc} onChange={(v) => set('idCsc', v)} mono placeholder="000001" />
            </div>
          </div>
        </div>
      )}

      {/* Erros de validação */}
      {erros.length > 0 && dirty && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 px-5 py-3">
          <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Corrija antes de salvar:</p>
          <ul className="list-disc list-inside text-xs text-red-600 dark:text-red-400 space-y-0.5">
            {erros.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/** Extrai mensagem legível do corpo de erro do NestJS (string | string[]). */
function extrairMensagemErro(message?: string | string[]): string {
  if (!message) return 'Erro ao salvar configuração'
  return Array.isArray(message) ? message[0] : message
}
