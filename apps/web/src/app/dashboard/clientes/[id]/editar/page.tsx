'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, AlertCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { useCliente, useAtualizarCliente } from '@/hooks/useClientes';
import { clientesService } from '@/services/clientes.service';
import type { CriarClienteDto } from '@/types';

export default function EditarClientePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: cliente, isLoading } = useCliente(id);
  const atualizar = useAtualizarCliente();

  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', celular: '',
    origem: '', tags: '', observacoes: '',
    cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  });
  const [buscandoCEP, setBuscandoCEP] = useState(false);
  const [erroCEP, setErroCEP] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!cliente) return;
    setForm((prev) => ({
      ...prev,
      nome: cliente.nome ?? '',
      email: cliente.email ?? '',
      telefone: (cliente as any).telefone ?? '',
      celular: (cliente as any).celular ?? (cliente as any).telefone ?? '',
      origem: cliente.origem ?? '',
      tags: (cliente.tags ?? []).join(', '),
      observacoes: (cliente as any).observacoes ?? '',
    }));
  }, [cliente]);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const fmtFone = (v: string) => {
    const d = v.replace(/\D/g, '');
    if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2').slice(0, 14);
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15);
  };

  const fmtCEP = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);

  const buscarCEP = async (cep: string) => {
    const limpo = cep.replace(/\D/g, '');
    if (limpo.length !== 8) return;
    setBuscandoCEP(true);
    setErroCEP('');
    try {
      const dados = await clientesService.buscarCEP(limpo);
      if (dados.erro) { setErroCEP('CEP não encontrado'); return; }
      setForm((p) => ({ ...p, logradouro: dados.logradouro ?? p.logradouro, bairro: dados.bairro ?? p.bairro, cidade: dados.localidade ?? p.cidade, estado: dados.uf ?? p.estado }));
    } catch { setErroCEP('Erro ao buscar CEP'); }
    finally { setBuscandoCEP(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    if (!form.nome.trim()) { setErro('Nome é obrigatório'); return; }

    const dto: Partial<CriarClienteDto> = {
      nome: form.nome.trim(),
      email: form.email.trim() || undefined,
      telefone: form.telefone || undefined,
      celular: form.celular || undefined,
      origem: form.origem || undefined,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      observacoes: form.observacoes.trim() || undefined,
    };

    atualizar.mutate({ id, dto }, {
      onSuccess: () => router.push(`/dashboard/clientes/${id}`),
      onError: (err: any) => {
        const msg = err?.response?.data?.message ?? err?.message ?? 'Erro ao atualizar';
        setErro(Array.isArray(msg) ? msg.join(', ') : msg);
      },
    });
  };

  const inputCls = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-marca-500 focus:outline-none focus:ring-1 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100';
  const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300';

  if (isLoading) return (
    <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-marca-500" /></div>
  );

  if (!cliente) return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950/20">
      <p className="font-semibold text-red-600">Cliente não encontrado</p>
      <Link href="/dashboard/clientes" className="mt-4 inline-block rounded-lg bg-marca-500 px-4 py-2 text-white hover:bg-marca-600">Voltar</Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/clientes/${id}`}
          className="flex items-center justify-center rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Editar Cliente</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{cliente.nome}</p>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>{cliente.tipo === 'PJ' ? 'Razão Social' : 'Nome Completo'} *</label>
              <input type="text" value={form.nome} onChange={(e) => set('nome', e.target.value)} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Celular</label>
              <input type="tel" value={form.celular} onChange={(e) => set('celular', fmtFone(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Telefone</label>
              <input type="tel" value={form.telefone} onChange={(e) => set('telefone', fmtFone(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Origem</label>
              <select value={form.origem} onChange={(e) => set('origem', e.target.value)} className={inputCls}>
                <option value="">Selecionar</option>
                {['WEBSITE','SITE','SHOPIFY','MERCADO_LIVRE','SHOPEE','TELEFONE','EMAIL','INDICACAO','VENDA_DIRETA','INSTAGRAM','FEIRA','OUTRO'].map(o => (
                  <option key={o} value={o}>{o.charAt(0) + o.slice(1).toLowerCase().replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Tags <span className="text-xs text-slate-500">(separadas por vírgula)</span></label>
              <input type="text" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="VIP, Frequente" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Observações</label>
            <textarea value={form.observacoes} onChange={(e) => set('observacoes', e.target.value)} rows={3} className={inputCls} />
          </div>
        </div>

        {/* Novo Endereço (opcional) */}
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Adicionar Endereço <span className="text-sm font-normal text-slate-500">(opcional)</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <input type="text" value={form.logradouro} onChange={(e) => set('logradouro', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Número</label>
              <input type="text" value={form.numero} onChange={(e) => set('numero', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Bairro</label>
              <input type="text" value={form.bairro} onChange={(e) => set('bairro', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Cidade / Estado</label>
              <div className="mt-1 flex gap-2">
                <input type="text" value={form.cidade} onChange={(e) => set('cidade', e.target.value)} placeholder="Cidade"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
                <input type="text" value={form.estado} onChange={(e) => set('estado', e.target.value)} maxLength={2} placeholder="UF"
                  className="w-16 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Link href={`/dashboard/clientes/${id}`}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
            Cancelar
          </Link>
          <button type="submit" disabled={atualizar.isPending}
            className="flex items-center gap-2 rounded-lg bg-marca-500 px-6 py-2.5 font-semibold text-white hover:bg-marca-600 transition-colors disabled:opacity-60">
            {atualizar.isPending ? <><Loader2 className="h-5 w-5 animate-spin" /> Salvando...</> : <><Save className="h-5 w-5" /> Salvar Alterações</>}
          </button>
        </div>
      </form>
    </div>
  );
}
