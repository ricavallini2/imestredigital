'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Loader2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCriarCliente } from '@/hooks/useClientes';
import { clientesService } from '@/services/clientes.service';
import type { CriarClienteDto } from '@/types';

// ─── Contrato canônico (docs/design/parceiro-unificado.md) ──────────────────

type Papel = 'CLIENTE' | 'FORNECEDOR' | 'TRANSPORTADORA';

type RegimeTributario =
  | 'SIMPLES_NACIONAL'
  | 'MEI'
  | 'LUCRO_PRESUMIDO'
  | 'LUCRO_REAL'
  | 'ISENTO';

const ORIGENS: { valor: string; rotulo: string }[] = [
  { valor: 'MANUAL', rotulo: 'Manual' },
  { valor: 'MARKETPLACE', rotulo: 'Marketplace' },
  { valor: 'SITE', rotulo: 'Site' },
  { valor: 'INDICACAO', rotulo: 'Indicação' },
  { valor: 'IMPORTACAO', rotulo: 'Importação' },
  { valor: 'WEBSITE', rotulo: 'Website' },
  { valor: 'INSTAGRAM', rotulo: 'Instagram' },
  { valor: 'FACEBOOK', rotulo: 'Facebook' },
  { valor: 'WHATSAPP', rotulo: 'WhatsApp' },
  { valor: 'VENDA_DIRETA', rotulo: 'Venda Direta' },
  { valor: 'FEIRA', rotulo: 'Feira' },
  { valor: 'TELEFONE', rotulo: 'Telefone' },
  { valor: 'EMAIL', rotulo: 'Email' },
  { valor: 'OUTRO', rotulo: 'Outro' },
];

const REGIMES: { valor: RegimeTributario; rotulo: string }[] = [
  { valor: 'SIMPLES_NACIONAL', rotulo: 'Simples Nacional' },
  { valor: 'MEI', rotulo: 'MEI' },
  { valor: 'LUCRO_PRESUMIDO', rotulo: 'Lucro Presumido' },
  { valor: 'LUCRO_REAL', rotulo: 'Lucro Real' },
  { valor: 'ISENTO', rotulo: 'Isento' },
];

// DTO estendido com os campos do parceiro unificado. Superset de CriarClienteDto,
// portanto compatível com a mutation (mocks em DEV ecoam os campos extras).
interface NovoParceiroDto extends CriarClienteDto {
  papeis: Papel[]
  nomeFantasia?: string
  razaoSocial?: string
  rg?: string
  inscricaoEstadual?: string
  ieIsento?: boolean
  inscricaoMunicipal?: string
  regimeTributario?: RegimeTributario
  dataNascimento?: string
  genero?: string
  emailSecundario?: string
  limiteCredito?: number
  vendedorId?: string
  prazoPagamento?: number
  condicoesPagamento?: string
  pixChave?: string
  categoriasFornecidas?: string[]
  avaliacaoFornecedor?: number
}

interface FormData {
  papelCliente: boolean
  papelFornecedor: boolean
  papelTransportadora: boolean
  tipo: 'PF' | 'PJ'
  nome: string
  razaoSocial: string
  nomeFantasia: string
  cpfCnpj: string
  rg: string
  inscricaoEstadual: string
  ieIsento: boolean
  inscricaoMunicipal: string
  regimeTributario: '' | RegimeTributario
  dataNascimento: string
  genero: '' | 'M' | 'F' | 'O'
  email: string
  emailSecundario: string
  telefone: string
  celular: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  origem: string
  tags: string
  observacoes: string
  // Grupo cliente
  limiteCredito: string
  vendedorId: string
  // Grupo fornecedor
  prazoPagamento: string
  condicoesPagamento: string
  pixChave: string
  categoriasFornecidas: string
  avaliacaoFornecedor: string
}

const ESTADO_INICIAL: FormData = {
  papelCliente: true,
  papelFornecedor: false,
  papelTransportadora: false,
  tipo: 'PF',
  nome: '',
  razaoSocial: '',
  nomeFantasia: '',
  cpfCnpj: '',
  rg: '',
  inscricaoEstadual: '',
  ieIsento: false,
  inscricaoMunicipal: '',
  regimeTributario: '',
  dataNascimento: '',
  genero: '',
  email: '',
  emailSecundario: '',
  telefone: '',
  celular: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  origem: 'MANUAL',
  tags: '',
  observacoes: '',
  limiteCredito: '',
  vendedorId: '',
  prazoPagamento: '',
  condicoesPagamento: '',
  pixChave: '',
  categoriasFornecidas: '',
  avaliacaoFornecedor: '',
}

export default function NovoClientePage() {
  const router = useRouter()
  const criarCliente = useCriarCliente()

  const [form, setForm] = useState<FormData>(ESTADO_INICIAL)
  const [buscandoCEP, setBuscandoCEP] = useState(false)
  const [erroCEP, setErroCEP] = useState('')
  const [erro, setErro] = useState('')

  const set = <K extends keyof FormData>(field: K, value: FormData[K]) =>
    setForm((p) => ({ ...p, [field]: value }))

  const isPJ = form.tipo === 'PJ'

  // ─── Formatações ─────────────────────────────────────────────────────────

  const fmtCPF = (v: string) =>
    v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14)

  const fmtCNPJ = (v: string) =>
    v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2').slice(0, 18)

  const fmtFone = (v: string) => {
    const d = v.replace(/\D/g, '')
    if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2').slice(0, 14)
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15)
  }

  const fmtCEP = (v: string) =>
    v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9)

  // ─── Busca de CEP ──────────────────────────────────────────────────────────

  const buscarCEP = async (cep: string) => {
    const limpo = cep.replace(/\D/g, '')
    if (limpo.length !== 8) return
    setBuscandoCEP(true)
    setErroCEP('')
    try {
      const dados = await clientesService.buscarCEP(limpo)
      if (dados.erro) {
        setErroCEP('CEP não encontrado')
        return
      }
      setForm((p) => ({
        ...p,
        logradouro: dados.logradouro ?? p.logradouro,
        bairro: dados.bairro ?? p.bairro,
        cidade: dados.localidade ?? p.cidade,
        estado: dados.uf ?? p.estado,
      }))
    } catch {
      setErroCEP('Erro ao buscar CEP')
    } finally {
      setBuscandoCEP(false)
    }
  }

  // ─── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    const papeis: Papel[] = []
    if (form.papelCliente) papeis.push('CLIENTE')
    if (form.papelFornecedor) papeis.push('FORNECEDOR')
    if (form.papelTransportadora) papeis.push('TRANSPORTADORA')
    if (papeis.length === 0) {
      setErro('Selecione ao menos um papel (Cliente, Fornecedor ou Transportadora)')
      return
    }

    if (!form.nome.trim()) {
      setErro(isPJ ? 'Nome/Identificação é obrigatório' : 'Nome é obrigatório')
      return
    }
    if (!form.email.trim()) { setErro('Email é obrigatório'); return }
    if (!form.cpfCnpj.trim()) { setErro(`${isPJ ? 'CNPJ' : 'CPF'} é obrigatório`); return }
    if (isPJ && !form.razaoSocial.trim()) { setErro('Razão Social é obrigatória para PJ'); return }

    const cpfCnpjLimpo = form.cpfCnpj.replace(/\D/g, '')

    const limiteCredito = form.limiteCredito.replace(/[^\d,.-]/g, '').replace(',', '.')
    const prazoPagamento = parseInt(form.prazoPagamento, 10)
    const avaliacaoFornecedor = parseInt(form.avaliacaoFornecedor, 10)

    const dto: NovoParceiroDto = {
      papeis,
      tipo: form.tipo,
      nome: form.nome.trim(),
      email: form.email.trim() || undefined,
      emailSecundario: form.emailSecundario.trim() || undefined,
      telefone: form.telefone || undefined,
      celular: form.celular || undefined,
      origem: form.origem || undefined,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      observacoes: form.observacoes.trim() || undefined,
      // Documento conforme o tipo
      ...(isPJ ? { cnpj: cpfCnpjLimpo } : { cpf: cpfCnpjLimpo }),
      // Campos PF
      ...(!isPJ && {
        rg: form.rg.trim() || undefined,
        dataNascimento: form.dataNascimento || undefined,
        genero: form.genero || undefined,
      }),
      // Campos PJ
      ...(isPJ && {
        razaoSocial: form.razaoSocial.trim() || undefined,
        nomeFantasia: form.nomeFantasia.trim() || undefined,
        ieIsento: form.ieIsento,
        inscricaoEstadual: form.ieIsento ? undefined : form.inscricaoEstadual.trim() || undefined,
        inscricaoMunicipal: form.inscricaoMunicipal.trim() || undefined,
        regimeTributario: form.regimeTributario || undefined,
      }),
      // Grupo cliente
      ...(form.papelCliente && {
        limiteCredito: limiteCredito ? Number(limiteCredito) : undefined,
        vendedorId: form.vendedorId.trim() || undefined,
      }),
      // Grupo fornecedor
      ...(form.papelFornecedor && {
        prazoPagamento: Number.isNaN(prazoPagamento) ? undefined : prazoPagamento,
        condicoesPagamento: form.condicoesPagamento.trim() || undefined,
        pixChave: form.pixChave.trim() || undefined,
        categoriasFornecidas: form.categoriasFornecidas
          ? form.categoriasFornecidas.split(',').map((c) => c.trim()).filter(Boolean)
          : undefined,
        avaliacaoFornecedor: Number.isNaN(avaliacaoFornecedor) ? undefined : avaliacaoFornecedor,
      }),
      // Endereço inline
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
    }

    criarCliente.mutate(dto as CriarClienteDto, {
      onSuccess: (cliente) => {
        router.push(`/dashboard/clientes/${cliente.id}`)
      },
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { message?: string | string[] } }; message?: string }
        const msg = e?.response?.data?.message ?? e?.message ?? 'Erro ao salvar cliente'
        setErro(Array.isArray(msg) ? msg.join(', ') : msg)
      },
    })
  }

  const inputCls = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-marca-500 focus:outline-none focus:ring-1 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
  const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clientes" className="flex items-center justify-center rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Novo Parceiro</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Cadastre um cliente e/ou fornecedor</p>
        </div>
      </div>

      {erro && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950/20">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700 dark:text-red-400">{erro}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Papéis e Tipo */}
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tipo de Cadastro</h2>

          <div>
            <label className={labelCls}>Papéis <span className="text-xs text-slate-500">(ao menos um)</span></label>
            <div className="mt-2 flex flex-wrap gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={form.papelCliente}
                  onChange={(e) => set('papelCliente', e.target.checked)}
                  className="h-4 w-4 accent-marca-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Cliente</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={form.papelFornecedor}
                  onChange={(e) => set('papelFornecedor', e.target.checked)}
                  className="h-4 w-4 accent-marca-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Fornecedor</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={form.papelTransportadora}
                  onChange={(e) => set('papelTransportadora', e.target.checked)}
                  className="h-4 w-4 accent-marca-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Transportadora</span>
              </label>
            </div>
          </div>

          <div>
            <label className={labelCls}>Tipo de Pessoa</label>
            <div className="mt-2 flex gap-6">
              {(['PF', 'PJ'] as const).map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2">
                  <input type="radio" checked={form.tipo === t} onChange={() => { set('tipo', t); set('cpfCnpj', '') }}
                    className="h-4 w-4 accent-marca-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {t === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Dados Básicos */}
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dados Básicos</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>{isPJ ? 'Nome / Identificação' : 'Nome Completo'} *</label>
              <input type="text" value={form.nome} onChange={(e) => set('nome', e.target.value)}
                placeholder={isPJ ? 'Nome fantasia ou identificação' : 'João Silva'} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{isPJ ? 'CNPJ' : 'CPF'} *</label>
              <input type="text" value={form.cpfCnpj}
                onChange={(e) => set('cpfCnpj', isPJ ? fmtCNPJ(e.target.value) : fmtCPF(e.target.value))}
                placeholder={isPJ ? '12.345.678/0001-99' : '123.456.789-00'} required className={inputCls} />
            </div>

            {/* Campos exclusivos PJ */}
            {isPJ && (
              <>
                <div>
                  <label className={labelCls}>Razão Social *</label>
                  <input type="text" value={form.razaoSocial} onChange={(e) => set('razaoSocial', e.target.value)}
                    placeholder="Empresa LTDA" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Nome Fantasia</label>
                  <input type="text" value={form.nomeFantasia} onChange={(e) => set('nomeFantasia', e.target.value)}
                    placeholder="Marca comercial" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Inscrição Estadual</label>
                  <input type="text" value={form.inscricaoEstadual}
                    onChange={(e) => set('inscricaoEstadual', e.target.value)}
                    disabled={form.ieIsento}
                    placeholder={form.ieIsento ? 'Isento' : '000.000.000.000'}
                    className={`${inputCls} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-800`} />
                  <label className="mt-2 flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={form.ieIsento}
                      onChange={(e) => set('ieIsento', e.target.checked)}
                      className="h-4 w-4 accent-marca-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">Isento de Inscrição Estadual</span>
                  </label>
                </div>
                <div>
                  <label className={labelCls}>Inscrição Municipal</label>
                  <input type="text" value={form.inscricaoMunicipal}
                    onChange={(e) => set('inscricaoMunicipal', e.target.value)}
                    placeholder="000000" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Regime Tributário</label>
                  <select value={form.regimeTributario}
                    onChange={(e) => set('regimeTributario', e.target.value as FormData['regimeTributario'])}
                    className={inputCls}>
                    <option value="">Selecionar</option>
                    {REGIMES.map((r) => (
                      <option key={r.valor} value={r.valor}>{r.rotulo}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Campos exclusivos PF */}
            {!isPJ && (
              <>
                <div>
                  <label className={labelCls}>RG</label>
                  <input type="text" value={form.rg} onChange={(e) => set('rg', e.target.value)}
                    placeholder="00.000.000-0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Data de Nascimento</label>
                  <input type="date" value={form.dataNascimento}
                    onChange={(e) => set('dataNascimento', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Gênero</label>
                  <select value={form.genero}
                    onChange={(e) => set('genero', e.target.value as FormData['genero'])}
                    className={inputCls}>
                    <option value="">Selecionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className={labelCls}>Email *</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                placeholder="parceiro@email.com" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email Secundário</label>
              <input type="email" value={form.emailSecundario} onChange={(e) => set('emailSecundario', e.target.value)}
                placeholder="financeiro@email.com" className={inputCls} />
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
                {ORIGENS.map((o) => (
                  <option key={o.valor} value={o.valor}>{o.rotulo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dados de Cliente */}
        {form.papelCliente && (
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dados de Cliente</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Limite de Crédito (R$)</label>
                <input type="text" inputMode="decimal" value={form.limiteCredito}
                  onChange={(e) => set('limiteCredito', e.target.value)}
                  placeholder="5000,00" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Vendedor Responsável</label>
                <input type="text" value={form.vendedorId} onChange={(e) => set('vendedorId', e.target.value)}
                  placeholder="ID ou nome do vendedor" className={inputCls} />
              </div>
            </div>
          </div>
        )}

        {/* Dados de Fornecedor */}
        {form.papelFornecedor && (
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dados de Fornecedor</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Prazo de Pagamento (dias)</label>
                <input type="number" min={0} value={form.prazoPagamento}
                  onChange={(e) => set('prazoPagamento', e.target.value)}
                  placeholder="30" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Condições de Pagamento</label>
                <input type="text" value={form.condicoesPagamento}
                  onChange={(e) => set('condicoesPagamento', e.target.value)}
                  placeholder="30/60/90" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Chave PIX</label>
                <input type="text" value={form.pixChave} onChange={(e) => set('pixChave', e.target.value)}
                  placeholder="CPF, CNPJ, e-mail ou chave aleatória" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Avaliação <span className="text-xs text-slate-500">(1 a 5)</span></label>
                <select value={form.avaliacaoFornecedor}
                  onChange={(e) => set('avaliacaoFornecedor', e.target.value)} className={inputCls}>
                  <option value="">Sem avaliação</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Categorias Fornecidas <span className="text-xs text-slate-500">(separadas por vírgula)</span></label>
                <input type="text" value={form.categoriasFornecidas}
                  onChange={(e) => set('categoriasFornecidas', e.target.value)}
                  placeholder="Embalagens, Matéria-prima, Logística" className={inputCls} />
              </div>
            </div>
          </div>
        )}

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
              placeholder="Anotações sobre o parceiro..." rows={3} className={inputCls} />
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
              : <><Save className="h-5 w-5" /> Salvar Parceiro</>}
          </button>
        </div>
      </form>
    </div>
  )
}
