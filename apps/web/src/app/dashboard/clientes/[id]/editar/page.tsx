'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, AlertCircle, MapPin, CheckCircle2 } from 'lucide-react'
import { useCliente, useAtualizarCliente } from '@/hooks/useClientes'
import { clientesService } from '@/services/clientes.service'
import type { CriarClienteDto, Papel, RegimeTributario } from '@/types'

const ORIGENS: { valor: string; rotulo: string }[] = [
  { valor: 'MANUAL', rotulo: 'Manual' },
  { valor: 'WEBSITE', rotulo: 'Website' },
  { valor: 'SITE', rotulo: 'Site' },
  { valor: 'MARKETPLACE', rotulo: 'Marketplace' },
  { valor: 'INDICACAO', rotulo: 'Indicação' },
  { valor: 'IMPORTACAO', rotulo: 'Importação' },
  { valor: 'INSTAGRAM', rotulo: 'Instagram' },
  { valor: 'FACEBOOK', rotulo: 'Facebook' },
  { valor: 'WHATSAPP', rotulo: 'WhatsApp' },
  { valor: 'VENDA_DIRETA', rotulo: 'Venda Direta' },
  { valor: 'FEIRA', rotulo: 'Feira' },
  { valor: 'TELEFONE', rotulo: 'Telefone' },
  { valor: 'EMAIL', rotulo: 'Email' },
  { valor: 'OUTRO', rotulo: 'Outro' },
]

const REGIMES: { valor: RegimeTributario; rotulo: string }[] = [
  { valor: 'SIMPLES_NACIONAL', rotulo: 'Simples Nacional' },
  { valor: 'MEI', rotulo: 'MEI' },
  { valor: 'LUCRO_PRESUMIDO', rotulo: 'Lucro Presumido' },
  { valor: 'LUCRO_REAL', rotulo: 'Lucro Real' },
  { valor: 'ISENTO', rotulo: 'Isento' },
]

export default function EditarClientePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: cliente, isLoading } = useCliente(id)
  const atualizar = useAtualizarCliente()

  const [papeis, setPapeis] = useState<Papel[]>(['CLIENTE'])
  const [form, setForm] = useState({
    nome: '',
    nomeFantasia: '',
    razaoSocial: '',
    email: '',
    emailSecundario: '',
    telefone: '',
    celular: '',
    rg: '',
    inscricaoEstadual: '',
    ieIsento: false,
    inscricaoMunicipal: '',
    regimeTributario: '',
    dataNascimento: '',
    genero: '',
    origem: '',
    tags: '',
    observacoes: '',
    // Grupo CLIENTE
    limiteCredito: '',
    vendedorId: '',
    // Grupo FORNECEDOR
    prazoPagamento: '',
    condicoesPagamento: '',
    pixChave: '',
    categoriasFornecidas: '',
    avaliacaoFornecedor: '',
    // Endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  })
  const [buscandoCEP, setBuscandoCEP] = useState(false)
  const [erroCEP, setErroCEP] = useState('')
  const [erro, setErro] = useState('')

  const isPJ = cliente?.tipo === 'PJ'
  const isFornecedor = papeis.includes('FORNECEDOR')

  useEffect(() => {
    if (!cliente) return
    const c = cliente as typeof cliente & {
      observacoes?: string
      limiteCredito?: number
      vendedorId?: string
      prazoPagamento?: number
      condicoesPagamento?: string
      pixChave?: string
      categoriasFornecidas?: string[]
      avaliacaoFornecedor?: number
    }
    setPapeis(c.papeis && c.papeis.length > 0 ? c.papeis : ['CLIENTE'])
    setForm((prev) => ({
      ...prev,
      nome: c.nome ?? '',
      nomeFantasia: c.nomeFantasia ?? '',
      razaoSocial: c.razaoSocial ?? '',
      email: c.email ?? '',
      emailSecundario: c.emailSecundario ?? '',
      telefone: c.telefone ?? '',
      celular: c.celular ?? c.telefone ?? '',
      rg: c.rg ?? '',
      inscricaoEstadual: c.inscricaoEstadual ?? '',
      ieIsento: c.ieIsento ?? false,
      inscricaoMunicipal: c.inscricaoMunicipal ?? '',
      regimeTributario: c.regimeTributario ?? '',
      dataNascimento: c.dataNascimento ? c.dataNascimento.slice(0, 10) : '',
      genero: c.genero ?? '',
      origem: typeof c.origem === 'string' ? c.origem : '',
      tags: (c.tags ?? []).join(', '),
      observacoes: c.observacoes ?? '',
      limiteCredito: c.limiteCredito != null ? String(c.limiteCredito) : '',
      vendedorId: c.vendedorId ?? '',
      prazoPagamento: c.prazoPagamento != null ? String(c.prazoPagamento) : '',
      condicoesPagamento: c.condicoesPagamento ?? '',
      pixChave: c.pixChave ?? '',
      categoriasFornecidas: (c.categoriasFornecidas ?? []).join(', '),
      avaliacaoFornecedor: c.avaliacaoFornecedor != null ? String(c.avaliacaoFornecedor) : '',
    }))
  }, [cliente])

  const set = (k: keyof typeof form, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }))

  const togglePapel = (papel: Papel) => {
    setPapeis((prev) => {
      const tem = prev.includes(papel)
      if (tem) {
        const restante = prev.filter((p) => p !== papel)
        return restante.length > 0 ? restante : prev // ao menos um papel
      }
      return [...prev, papel]
    })
  }

  const fmtFone = (v: string) => {
    const d = v.replace(/\D/g, '')
    if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2').slice(0, 14)
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15)
  }

  const fmtCEP = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!form.nome.trim()) {
      setErro('Nome é obrigatório')
      return
    }

    const dto: Partial<CriarClienteDto> = {
      papeis,
      nome: form.nome.trim(),
      email: form.email.trim() || undefined,
      emailSecundario: form.emailSecundario.trim() || undefined,
      telefone: form.telefone || undefined,
      celular: form.celular || undefined,
      origem: form.origem || undefined,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      observacoes: form.observacoes.trim() || undefined,
    }

    if (isPJ) {
      dto.razaoSocial = form.razaoSocial.trim() || undefined
      dto.nomeFantasia = form.nomeFantasia.trim() || undefined
      dto.ieIsento = form.ieIsento
      dto.inscricaoEstadual = form.ieIsento ? undefined : form.inscricaoEstadual.trim() || undefined
      dto.inscricaoMunicipal = form.inscricaoMunicipal.trim() || undefined
      dto.regimeTributario = (form.regimeTributario as RegimeTributario) || undefined
    } else {
      dto.rg = form.rg.trim() || undefined
      dto.dataNascimento = form.dataNascimento || undefined
      dto.genero = (form.genero as 'M' | 'F' | 'O') || undefined
    }

    // Grupo CLIENTE
    if (papeis.includes('CLIENTE')) {
      const limite = parseFloat(form.limiteCredito.replace(',', '.'))
      dto.limiteCredito = Number.isFinite(limite) ? limite : undefined
      dto.vendedorId = form.vendedorId.trim() || undefined
    }

    // Grupo FORNECEDOR
    if (isFornecedor) {
      const prazo = parseInt(form.prazoPagamento, 10)
      dto.prazoPagamento = Number.isFinite(prazo) ? prazo : undefined
      dto.condicoesPagamento = form.condicoesPagamento.trim() || undefined
      dto.pixChave = form.pixChave.trim() || undefined
      dto.categoriasFornecidas = form.categoriasFornecidas
        ? form.categoriasFornecidas.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined
      const avaliacao = parseInt(form.avaliacaoFornecedor, 10)
      dto.avaliacaoFornecedor = Number.isFinite(avaliacao) ? avaliacao : undefined
    }

    // Determina se o usuário preencheu endereço completo (todos os campos obrigatórios pelo back-end).
    const cepLimpo = form.cep.replace(/\D/g, '')
    const enderecoCompleto =
      form.logradouro.trim().length > 0 &&
      form.bairro.trim().length > 0 &&
      form.cidade.trim().length > 0 &&
      /^[A-Za-z]{2}$/.test(form.estado.trim()) &&
      cepLimpo.length === 8

    const algumCampoEnderecoPreenchido = Boolean(
      form.logradouro.trim() || form.cep.trim() || form.cidade.trim() || form.bairro.trim() || form.estado.trim(),
    )

    if (algumCampoEnderecoPreenchido && !enderecoCompleto) {
      setErro('Para salvar o endereço, preencha CEP (8 dígitos), logradouro, bairro, cidade e UF (2 letras).')
      return
    }

    atualizar.mutate(
      { id, dto },
      {
        onSuccess: async () => {
          // Se o usuário preencheu um endereço completo, cria-o como padrão após o update.
          if (enderecoCompleto) {
            try {
              await clientesService.criarEndereco(id, {
                tipo: 'AMBOS',
                logradouro: form.logradouro.trim(),
                numero: form.numero.trim() || 'S/N',
                complemento: form.complemento.trim() || undefined,
                bairro: form.bairro.trim(),
                cidade: form.cidade.trim(),
                estado: form.estado.trim().toUpperCase(),
                cep: cepLimpo,
                principal: true,
              })
            } catch (e) {
              const resp = (e as { response?: { data?: { message?: string | string[] } } })?.response
              const msg = resp?.data?.message ?? 'Cliente atualizado, mas falhou ao salvar endereço'
              setErro(Array.isArray(msg) ? msg.join(', ') : msg)
              return
            }
          }
          router.push(`/dashboard/clientes/${id}`)
        },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { message?: string | string[] } }; message?: string }
          const msg = e?.response?.data?.message ?? e?.message ?? 'Erro ao atualizar'
          setErro(Array.isArray(msg) ? msg.join(', ') : msg)
        },
      },
    )
  }

  const inputCls =
    'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-marca-500 focus:outline-none focus:ring-1 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
  const inputDisabledCls =
    'mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
  const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300'

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-marca-500" />
      </div>
    )

  if (!cliente)
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950/20">
        <p className="font-semibold text-red-600">Cliente não encontrado</p>
        <Link
          href="/dashboard/clientes"
          className="mt-4 inline-block rounded-lg bg-marca-500 px-4 py-2 text-white hover:bg-marca-600"
        >
          Voltar
        </Link>
      </div>
    )

  const documento = isPJ ? cliente.cnpj : cliente.cpf

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/clientes/${id}`}
          className="flex items-center justify-center rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
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
        {/* Papéis */}
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Papéis</h2>
          <div className="flex flex-wrap gap-6">
            {(['CLIENTE', 'FORNECEDOR', 'TRANSPORTADORA'] as const).map((papel) => (
              <label key={papel} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={papeis.includes(papel)}
                  onChange={() => togglePapel(papel)}
                  className="h-4 w-4 accent-marca-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {papel === 'CLIENTE' ? 'Cliente' : papel === 'FORNECEDOR' ? 'Fornecedor' : 'Transportadora'}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-500">Ao menos um papel deve estar marcado.</p>
        </div>

        {/* Dados Básicos */}
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dados Básicos</h2>

          <div>
            <label className={labelCls}>Tipo de Cliente</label>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isPJ ? 'Pessoa Jurídica' : 'Pessoa Física'}{' '}
              <span className="text-xs">(não pode ser alterado)</span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>{isPJ ? 'Razão Social' : 'Nome Completo'} *</label>
              <input type="text" value={form.nome} onChange={(e) => set('nome', e.target.value)} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{isPJ ? 'CNPJ' : 'CPF'}</label>
              <input type="text" value={documento ?? ''} disabled readOnly className={inputDisabledCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email Secundário</label>
              <input
                type="email"
                value={form.emailSecundario}
                onChange={(e) => set('emailSecundario', e.target.value)}
                className={inputCls}
              />
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
                {ORIGENS.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>
                Tags <span className="text-xs text-slate-500">(separadas por vírgula)</span>
              </label>
              <input type="text" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="VIP, Frequente" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Observações</label>
            <textarea value={form.observacoes} onChange={(e) => set('observacoes', e.target.value)} rows={3} className={inputCls} />
          </div>
        </div>

        {/* Dados Fiscais */}
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dados Fiscais</h2>

          {isPJ ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Nome Fantasia</label>
                <input
                  type="text"
                  value={form.nomeFantasia}
                  onChange={(e) => set('nomeFantasia', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Razão Social</label>
                <input
                  type="text"
                  value={form.razaoSocial}
                  onChange={(e) => set('razaoSocial', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Inscrição Estadual</label>
                <input
                  type="text"
                  value={form.ieIsento ? '' : form.inscricaoEstadual}
                  onChange={(e) => set('inscricaoEstadual', e.target.value)}
                  disabled={form.ieIsento}
                  className={form.ieIsento ? inputDisabledCls : inputCls}
                />
                <label className="mt-2 flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.ieIsento}
                    onChange={(e) => set('ieIsento', e.target.checked)}
                    className="h-4 w-4 accent-marca-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Isento de IE</span>
                </label>
              </div>
              <div>
                <label className={labelCls}>Inscrição Municipal</label>
                <input
                  type="text"
                  value={form.inscricaoMunicipal}
                  onChange={(e) => set('inscricaoMunicipal', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Regime Tributário</label>
                <select
                  value={form.regimeTributario}
                  onChange={(e) => set('regimeTributario', e.target.value)}
                  className={inputCls}
                >
                  <option value="">Selecionar</option>
                  {REGIMES.map((r) => (
                    <option key={r.valor} value={r.valor}>
                      {r.rotulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>RG</label>
                <input type="text" value={form.rg} onChange={(e) => set('rg', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Data de Nascimento</label>
                <input
                  type="date"
                  value={form.dataNascimento}
                  onChange={(e) => set('dataNascimento', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Gênero</label>
                <select value={form.genero} onChange={(e) => set('genero', e.target.value)} className={inputCls}>
                  <option value="">Selecionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Dados de Cliente */}
        {papeis.includes('CLIENTE') && (
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dados de Cliente</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Limite de Crédito (R$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.limiteCredito}
                  onChange={(e) => set('limiteCredito', e.target.value)}
                  placeholder="0,00"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Vendedor Responsável (ID)</label>
                <input
                  type="text"
                  value={form.vendedorId}
                  onChange={(e) => set('vendedorId', e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dados de Fornecedor */}
        {isFornecedor && (
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dados de Fornecedor</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Prazo de Pagamento (dias)</label>
                <input
                  type="number"
                  min={0}
                  value={form.prazoPagamento}
                  onChange={(e) => set('prazoPagamento', e.target.value)}
                  placeholder="30"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Condições de Pagamento</label>
                <input
                  type="text"
                  value={form.condicoesPagamento}
                  onChange={(e) => set('condicoesPagamento', e.target.value)}
                  placeholder="30/60/90"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Chave PIX</label>
                <input
                  type="text"
                  value={form.pixChave}
                  onChange={(e) => set('pixChave', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Avaliação (1 a 5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.avaliacaoFornecedor}
                  onChange={(e) => set('avaliacaoFornecedor', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  Categorias Fornecidas <span className="text-xs text-slate-500">(separadas por vírgula)</span>
                </label>
                <input
                  type="text"
                  value={form.categoriasFornecidas}
                  onChange={(e) => set('categoriasFornecidas', e.target.value)}
                  placeholder="Embalagens, Matéria-prima"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}

        {/* Novo Endereço (opcional) */}
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Adicionar Endereço <span className="text-sm font-normal text-slate-500">(opcional)</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>CEP</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={form.cep}
                  onChange={(e) => set('cep', fmtCEP(e.target.value))}
                  onBlur={(e) => buscarCEP(e.target.value)}
                  placeholder="12345-678"
                  className={`${inputCls} mt-0 pr-10`}
                />
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
            <div className="sm:col-span-2">
              <label className={labelCls}>Complemento</label>
              <input type="text" value={form.complemento} onChange={(e) => set('complemento', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Bairro</label>
              <input type="text" value={form.bairro} onChange={(e) => set('bairro', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Cidade / Estado</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={form.cidade}
                  onChange={(e) => set('cidade', e.target.value)}
                  placeholder="Cidade"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                />
                <input
                  type="text"
                  value={form.estado}
                  onChange={(e) => set('estado', e.target.value)}
                  maxLength={2}
                  placeholder="UF"
                  className="w-16 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Link
            href={`/dashboard/clientes/${id}`}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={atualizar.isPending}
            className="flex items-center gap-2 rounded-lg bg-marca-500 px-6 py-2.5 font-semibold text-white hover:bg-marca-600 transition-colors disabled:opacity-60"
          >
            {atualizar.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" /> Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
