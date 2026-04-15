'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Loader2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCriarCliente } from '@/hooks/useClientes';
import { clientesService } from '@/services/clientes.service';
import type { CriarClienteDto } from '@/types';

interface FormData {
  tipo: 'PF' | 'PJ';
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  celular: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  origem: string;
  tags: string;
  observacoes: string;
}

const ESTADO_INICIAL: FormData = {
  tipo: 'PF', nome: '', cpfCnpj: '', email: '', telefone: '', celular: '',
  cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  origem: 'WEBSITE', tags: '', observacoes: '',
};

export default function NovoClientePage() {
  const router = useRouter();
  const criarCliente = useCriarCliente();

  const [form, setForm] = useState<FormData>(ESTADO_INICIAL);
  const [buscandoCEP, setBuscandoCEP] = useState(false);
  const [erroCEP, setErroCEP] = useState('');
  const [erro, setErro] = useState('');

  const set = (field: keyof FormData, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  // ─── Formatações ─────────────────────────────────────────────────────────

  const fmtCPF = (v: string) =>
    v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14);

  const fmtCNPJ = (v: string) =>
    v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2').slice(0, 18);

  const fmtFone = (v: string) => {
    const d = v.replace(/\D/g, '');
    if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2').slice(0, 14);
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15);
  };

  const fmtCEP = (v: string) =>
    v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);

  // ─── Busca de CEP ──────────────────────────────────────────────────────────

  const buscarCEP = async (cep: string) => {
    const limpo = cep.replace(/\D/g, '');
    if (limpo.length !== 8) return;
    setBuscandoCEP(true);
    setErroCEP('');
    try {
      const dados = await clientesService.buscarCEP(limpo);
      if (dados.erro) {
        setErroCEP('CEP não encontrado');
        return;
      }
      setForm((p) => ({
        ...p,
        logradouro: dados.logradouro ?? p.logradouro,
        bairro: dados.bairro ?? p.bairro,
        cidade: dados.localidade ?? p.cidade,
        estado: dados.uf ?? p.estado,
      }));
    } catch {
      setErroCEP('Erro ao buscar CEP');
    } finally {
      setBuscandoCEP(false);
    }
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!form.nome.trim()) { setErro('Nome é obrigatório'); return; }
    if (!form.email.trim()) { setErro('Email é obrigatório'); return; }
    if (!form.cpfCnpj.trim()) { setErro(`${form.tipo === 'PF' ? 'CPF' : 'CNPJ'} é obrigatório`); return; }

    const cpfCnpjLimpo = form.cpfCnpj.replace(/\D/g, '');

    const dto: CriarClienteDto = {
      tipo: form.tipo,
      nome: form.nome.trim(),
      email: form.email.trim() || undefined,
      telefone: form.telefone || undefined,
      celular: form.celular || undefined,
      ...(form.tipo === 'PF' ? { cpf: cpfCnpjLimpo } : { cnpj: cpfCnpjLimpo }),
      origem: form.origem || undefined,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      observacoes: form.observacoes.trim() || undefined,
      ...(form.logradouro && {
        endereco: {
          logradouro: form.logradouro,
          numero: form.numero,
          complemento: form.complemento || undefined,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.estado,
          cep: form.cep.replace(/\D/g, ''),
        },
      }),
    };

    criarCliente.mutate(dto, {
      onSuccess: (cliente) => {
        router.push(`/dashboard/clientes/${cliente.id}`);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message ?? err?.message ?? 'Erro ao salvar cliente';
        setErro(Array.isArray(msg) ? msg.join(', ') : msg);
      },
    });
  };

  const inputCls = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-marca-500 focus:outline-none focus:ring-1 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100';
  const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clientes" className="flex items-center justify-center rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Novo Cliente</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Cadastre um novo cliente no CRM</p>
        </div>
      </div>

      {erro && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950/20">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700 dark:text-red-400">{erro}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Básicos */}
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dados Básicos</h2>

          <div>
            <label className={labelCls}>Tipo de Cliente</label>
            <div className="mt-2 flex gap-6">
              {(['PF', 'PJ'] as const).map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2">
                  <input type="radio" checked={form.tipo === t} onChange={() => { set('tipo', t); set('cpfCnpj', ''); }}
                    className="h-4 w-4 accent-marca-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {t === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>{form.tipo === 'PJ' ? 'Razão Social' : 'Nome Completo'} *</label>
              <input type="text" value={form.nome} onChange={(e) => set('nome', e.target.value)}
                placeholder={form.tipo === 'PF' ? 'João Silva' : 'Empresa LTDA'} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{form.tipo === 'PF' ? 'CPF' : 'CNPJ'} *</label>
              <input type="text" value={form.cpfCnpj}
                onChange={(e) => set('cpfCnpj', form.tipo === 'PF' ? fmtCPF(e.target.value) : fmtCNPJ(e.target.value))}
                placeholder={form.tipo === 'PF' ? '123.456.789-00' : '12.345.678/0001-99'} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                placeholder="cliente@email.com" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Celular</label>
              <input type="tel" value={form.celular} onChange={(e) => set('celular', fmtFone(e.target.value))}
                placeholder="(11) 98765-4321" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Telefone</label>
              <input type="tel" value={form.telefone} onChange={(e) => set('telefone', fmtFone(e.target.value))}
                placeholder="(11) 3456-7890" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Origem</label>
              <select value={form.origem} onChange={(e) => set('origem', e.target.value)} className={inputCls}>
                <option value="WEBSITE">Website</option>
                <option value="SHOPIFY">Shopify</option>
                <option value="MERCADO_LIVRE">Mercado Livre</option>
                <option value="SHOPEE">Shopee</option>
                <option value="TELEFONE">Telefone</option>
                <option value="EMAIL">Email</option>
                <option value="INDICACAO">Indicação</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Endereço</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* CEP com busca automática */}
            <div>
              <label className={labelCls}>CEP</label>
              <div className="relative mt-1">
                <input type="text" value={form.cep}
                  onChange={(e) => set('cep', fmtCEP(e.target.value))}
                  onBlur={(e) => buscarCEP(e.target.value)}
                  placeholder="12345-678" className={`${inputCls} mt-0 pr-10`} />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {buscandoCEP && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                  {!buscandoCEP && form.cidade && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {!buscandoCEP && erroCEP && <AlertCircle className="h-4 w-4 text-red-500" />}
                  {!buscandoCEP && !form.cidade && !erroCEP && <MapPin className="h-4 w-4 text-slate-400" />}
                </div>
              </div>
              {erroCEP && <p className="mt-1 text-xs text-red-500">{erroCEP}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Logradouro</label>
              <input type="text" value={form.logradouro} onChange={(e) => set('logradouro', e.target.value)}
                placeholder="Rua das Flores" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Número</label>
              <input type="text" value={form.numero} onChange={(e) => set('numero', e.target.value)}
                placeholder="123" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Complemento</label>
              <input type="text" value={form.complemento} onChange={(e) => set('complemento', e.target.value)}
                placeholder="Apto 501, Bloco A" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Bairro</label>
              <input type="text" value={form.bairro} onChange={(e) => set('bairro', e.target.value)}
                placeholder="Vila Mariana" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Cidade</label>
              <input type="text" value={form.cidade} onChange={(e) => set('cidade', e.target.value)}
                placeholder="São Paulo" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Estado</label>
              <select value={form.estado} onChange={(e) => set('estado', e.target.value)} className={inputCls}>
                <option value="">UF</option>
                {['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'].map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Informações Adicionais</h2>
          <div>
            <label className={labelCls}>Tags <span className="text-xs text-slate-500">(separadas por vírgula)</span></label>
            <input type="text" value={form.tags} onChange={(e) => set('tags', e.target.value)}
              placeholder="VIP, Frequente, B2B" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Observações</label>
            <textarea value={form.observacoes} onChange={(e) => set('observacoes', e.target.value)}
              placeholder="Anotações sobre o cliente..." rows={3} className={inputCls} />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-between gap-4">
          <Link href="/dashboard/clientes"
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
            <X className="h-5 w-5" /> Cancelar
          </Link>
          <button type="submit" disabled={criarCliente.isPending}
            className="flex items-center gap-2 rounded-lg bg-marca-500 px-6 py-2.5 font-semibold text-white hover:bg-marca-600 transition-colors disabled:opacity-60">
            {criarCliente.isPending
              ? <><Loader2 className="h-5 w-5 animate-spin" /> Salvando...</>
              : <><Save className="h-5 w-5" /> Salvar Cliente</>}
          </button>
        </div>
      </form>
    </div>
  );
}
