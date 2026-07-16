/**
 * Serviço para o módulo Fiscal — NF-e, NFC-e, NFS-e.
 *
 * Conecta ao fiscal-service REAL (NestJS/Prisma) através do proxy do Next.js.
 * Em produção/local com `USE_MICROSERVICES=true`, `/api/v1/notas-fiscais` e
 * `/api/v1/configuracao-fiscal` são reescritos para o fiscal-service (3004).
 *
 * O backend expõe um contrato diferente do modelo de tela usado pelas páginas
 * (envelope `{ dados, total, pagina, limite, totalPaginas }`, `destinatario`
 * como JSON, valores monetários como `Decimal` serializado em string, enums
 * UPPERCASE). Este módulo faz a NORMALIZAÇÃO backend → view-model, mantendo as
 * páginas (lista, detalhe, DANFE, NFC-e) desacopladas do shape do serviço.
 *
 * As estatísticas vêm do endpoint real `GET /v1/notas-fiscais/estatisticas`,
 * que agrega no banco sobre TODAS as notas do tenant e devolve exatamente o
 * shape `EstatisticasFiscais`.
 *
 * A análise de IA (compliance) continua COMPUTADA localmente a partir da lista
 * real de notas + configuração, por não existir rota equivalente no backend.
 */

import api from '@/lib/api'

// ─── Tipos ────────────────────────────────────────────────────────────────────

// Alinhado ao enum Prisma `StatusNotaFiscal` (fiscal-service).
export type StatusNF = 'RASCUNHO' | 'VALIDADA' | 'TRANSMITIDA' | 'AUTORIZADA' | 'REJEITADA' | 'CANCELADA' | 'INUTILIZADA' | 'DENEGADA'
export type TipoNF = 'NFE' | 'NFCE' | 'NFSE'
// Enum Prisma `RegimeTributario` (inclui MEI no backend real).
export type RegimeTributario = 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'MEI'
export type AmbienteSefaz = 'PRODUCAO' | 'HOMOLOGACAO'
// Enum Prisma `NaturezaOperacao`.
export type NaturezaOperacao =
  | 'VENDA' | 'DEVOLUCAO_VENDA' | 'COMPRA' | 'DEVOLUCAO_COMPRA'
  | 'TRANSFERENCIA' | 'REMESSA' | 'RETORNO' | 'BONIFICACAO'

export interface ItemNF {
  id: string
  produtoId?: string
  descricao: string
  ncm: string
  cfop: string
  unidade: string
  quantidade: number
  valorUnitario: number
  desconto: number
  valorTotal: number
  baseICMS: number
  aliquotaICMS: number
  valorICMS: number
  aliquotaPIS: number
  valorPIS: number
  aliquotaCOFINS: number
  valorCOFINS: number
  cst?: string
  csosn?: string
}

export interface NotaFiscal {
  id: string
  numero: string
  serie: string
  tipo: TipoNF
  naturezaOperacao: string
  finalidade: 'NORMAL' | 'COMPLEMENTAR' | 'AJUSTE' | 'DEVOLUCAO'
  status: StatusNF
  regimeTributario: RegimeTributario
  clienteId?: string
  destinatario: string
  destinatarioCnpjCpf: string
  destinatarioUF: string
  destinatarioEmail?: string
  enderecoEntrega?: string
  itens: ItemNF[]
  qtdItens: number
  valorProdutos: number
  valorDesconto: number
  valorFrete: number
  valorOutras: number
  baseICMS: number
  valorICMS: number
  valorPIS: number
  valorCOFINS: number
  valorIPI: number
  valorISS: number
  valorTotal: number
  chaveAcesso?: string
  protocolo?: string
  dataAutorizacao?: string
  motivoRejeicao?: string
  codigoRejeicao?: string
  motivoCancelamento?: string
  protocoloCancelamento?: string
  pedidoId?: string
  pedidoNumero?: string
  dataEmissao: string
  dataCompetencia?: string
  criadoEm: string
  atualizadoEm: string
  observacoes?: string
  informacoesAdicionais?: string
}

export interface ListarNotasFiscaisDTO {
  busca?: string
  status?: StatusNF | ''
  tipo?: TipoNF | ''
  page?: number
  limit?: number
}

export interface CriarNotaFiscalDTO {
  tipo?: TipoNF
  naturezaOperacao?: string
  finalidade?: 'NORMAL' | 'COMPLEMENTAR' | 'AJUSTE' | 'DEVOLUCAO'
  destinatario?: string
  destinatarioCnpjCpf?: string
  destinatarioUF?: string
  destinatarioEmail?: string
  enderecoEntrega?: string
  itens?: ItemNF[]
  valorProdutos?: number
  valorDesconto?: number
  valorFrete?: number
  baseICMS?: number
  valorICMS?: number
  valorPIS?: number
  valorCOFINS?: number
  valorTotal?: number
  pedidoId?: string
  pedidoNumero?: string
  observacoes?: string
  informacoesAdicionais?: string
}

/**
 * Modelo de tela (legado) da configuração fiscal — mantido para o DANFE, a
 * emissão avulsa e a tela antiga. Preenchido a partir do shape real do backend
 * pela normalização (`normalizarConfig`).
 */
export interface ConfiguracaoFiscal {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  ie: string
  im?: string
  cnae: string
  regimeTributario: RegimeTributario
  uf: string
  municipio: string
  cMunicipio: string
  cep: string
  logradouro: string
  numero: string
  bairro: string
  certificadoValidade?: string
  certificadoStatus: 'VALIDO' | 'EXPIRADO' | 'NAO_CONFIGURADO'
  certificadoTitular?: string
  ambiente: AmbienteSefaz
  sefazStatus: 'ONLINE' | 'OFFLINE' | 'INSTAVEL'
  ultimaConsulta?: string
  serieNFe: string
  proximoNumeroNFe: number
  serieNFCe: string
  proximoNumeroNFCe: number
  aliquotaICMSPadrao: number
  aliquotaPISPadrao: number
  aliquotaCOFINSPadrao: number
  cfopPadraoEstadual: string
  cfopPadraoInterestadual: string
}

/**
 * Configuração fiscal no SHAPE REAL do fiscal-service
 * (GET/PUT /v1/configuracao-fiscal). Usada pela tela `configuracoes`.
 */
export interface ConfiguracaoFiscalReal {
  id?: string
  tenantId?: string
  regimeTributario: RegimeTributario
  ambienteSefaz: AmbienteSefaz
  cnpj?: string | null
  razaoSocial?: string | null
  nomeFantasia?: string | null
  inscricaoEstadual?: string | null
  inscricaoMunicipal?: string | null
  cnae?: string | null
  crt?: string | null
  uf?: string | null
  codigoMunicipio?: string | null
  municipio?: string | null
  cep?: string | null
  endereco?: string | null
  numero?: string | null
  complemento?: string | null
  bairro?: string | null
  telefone?: string | null
  fax?: string | null
  email?: string | null
  serieNfe?: string | null
  serieNfce?: string | null
  proximoNumeroNfe?: number
  proximoNumeroNfce?: number
  tokenCsc?: string | null
  idCsc?: string | null
  naturezaOperacaoPadrao?: NaturezaOperacao
  validadeCertificado?: string | null
  criadoEm?: string
  atualizadoEm?: string
}

/**
 * Payload aceito pelo PUT /v1/configuracao-fiscal
 * (AtualizarConfiguracaoFiscalDto). `regimeTributario` e `ambienteSefaz` são
 * obrigatórios; o restante é opcional.
 */
export interface AtualizarConfiguracaoFiscalReal {
  regimeTributario: RegimeTributario
  ambienteSefaz: AmbienteSefaz
  cnpj?: string
  razaoSocial?: string
  nomeFantasia?: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  cnae?: string
  crt?: string
  uf?: string
  codigoMunicipio?: string
  municipio?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  telefone?: string
  fax?: string
  email?: string
  serieNfe?: string
  serieNfce?: string
  tokenCsc?: string
  idCsc?: string
  naturezaOperacaoPadrao?: NaturezaOperacao
}

export interface RegraFiscal {
  id: string
  ncm: string
  descricaoNCM: string
  cfopEstadual: string
  cfopInterestadual: string
  cst?: string
  csosn?: string
  aliquotaICMS: number
  aliquotaPIS: number
  aliquotaCOFINS: number
  aliquotaIPI?: number
  observacao?: string
  ativo: boolean
}

export interface AnaliseIAFiscal {
  scoreCompliance: number
  saude: 'EXCELENTE' | 'BOA' | 'REGULAR' | 'CRITICA'
  alertas: { tipo: 'CRITICO' | 'ATENCAO' | 'INFO'; titulo: string; descricao: string }[]
  oportunidades: { titulo: string; descricao: string; economia?: string }[]
  metricas: {
    totalFaturado: number
    totalImpostos: number
    cargaTributaria: number
    detalheImpostos: { icms: number; pis: number; cofins: number }
    percentualICMS: number
    percentualPIS: number
    percentualCOFINS: number
    taxaRejeicao: number
    taxaEmissao: number
    nfsPorStatus: Record<string, number>
  }
}

export interface EstatisticasFiscais {
  faturado30d: number
  faturado7d: number
  impostos30d: number
  totalNFs: number
  emitidas30d: number
  emitidas7d: number
  taxaRejeicao: number
  taxaEmissao: number
  porStatus: Record<string, number>
  porTipo: Record<string, number>
  processando: number
}

export interface ListagemNotas {
  notas: NotaFiscal[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Shapes brutos do backend (para normalização, sem `any`) ───────────────────

interface DestinatarioBackend {
  nome?: string
  cpfCnpj?: string
  estado?: string
  uf?: string
  email?: string
  logradouro?: string
  endereco?: string
}

interface ItemNotaBackend {
  id: string
  produtoId?: string
  descricao: string
  ncm: string
  cfop: string
  unidade: string
  quantidade: string | number
  valorUnitario: string | number
  valorTotal: string | number
  valorDesconto?: string | number
  origemMercadoria?: string
  cstIcms?: string
  aliquotaIcms?: string | number
  baseIcms?: string | number
  valorIcms?: string | number
  cstPis?: string
  aliquotaPis?: string | number
  valorPis?: string | number
  cstCofins?: string
  aliquotaCofins?: string | number
  valorCofins?: string | number
  cstIpi?: string | null
  valorIpi?: string | number
}

interface NotaFiscalBackend {
  id: string
  tenantId?: string
  tipo: TipoNF
  serie: string
  numero: number
  chaveAcesso?: string
  naturezaOperacao: string
  dataEmissao: string
  dataSaida?: string | null
  status: StatusNF
  valorTotal: string | number
  valorProdutos: string | number
  valorDesconto?: string | number
  valorFrete?: string | number
  valorSeguro?: string | number
  valorOutros?: string | number
  valorIcms?: string | number
  valorPis?: string | number
  valorCofins?: string | number
  valorIpi?: string | number
  protocolo?: string | null
  motivoRejeicao?: string | null
  pedidoId?: string | null
  clienteId?: string | null
  destinatario?: DestinatarioBackend | null
  informacoesAdicionais?: string | null
  criadoEm: string
  atualizadoEm: string
  itens?: ItemNotaBackend[]
}

interface EnvelopePaginado<T> {
  dados: T[]
  total: number
  pagina: number
  limite: number
  totalPaginas: number
}

// ─── Helpers de normalização ───────────────────────────────────────────────────

/** Converte `Decimal` serializado (string) ou number em number seguro. */
function num(v: string | number | null | undefined): number {
  if (v === null || v === undefined) return 0
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

/**
 * Alíquota no backend é fração em Decimal(5,4) — ex.: 0.18 = 18%. As telas
 * exibem em pontos percentuais, então multiplicamos por 100.
 */
function aliquotaPct(v: string | number | null | undefined): number {
  return num(v) * 100
}

/** Deriva o regime da configuração real → union do view-model. */
function derivarRegime(regime?: RegimeTributario | null): RegimeTributario {
  return regime ?? 'SIMPLES_NACIONAL'
}

function normalizarItem(item: ItemNotaBackend): ItemNF {
  const cst = item.cstIcms ?? undefined
  // CST 3 dígitos (ex.: 102) indica CSOSN (Simples Nacional); 2 dígitos, CST.
  const ehCsosn = !!cst && cst.length >= 3
  return {
    id: item.id,
    produtoId: item.produtoId,
    descricao: item.descricao,
    ncm: item.ncm,
    cfop: item.cfop,
    unidade: item.unidade,
    quantidade: num(item.quantidade),
    valorUnitario: num(item.valorUnitario),
    desconto: num(item.valorDesconto),
    valorTotal: num(item.valorTotal),
    baseICMS: num(item.baseIcms),
    aliquotaICMS: aliquotaPct(item.aliquotaIcms),
    valorICMS: num(item.valorIcms),
    aliquotaPIS: aliquotaPct(item.aliquotaPis),
    valorPIS: num(item.valorPis),
    aliquotaCOFINS: aliquotaPct(item.aliquotaCofins),
    valorCOFINS: num(item.valorCofins),
    cst: ehCsosn ? undefined : cst,
    csosn: ehCsosn ? cst : undefined,
  }
}

/**
 * Normaliza uma nota do backend real para o view-model das telas.
 * `regimeConfig` (regime do emitente) é injetado pois a nota não o carrega.
 */
function normalizarNota(nota: NotaFiscalBackend, regimeConfig?: RegimeTributario): NotaFiscal {
  const dest = nota.destinatario ?? {}
  const itens = (nota.itens ?? []).map(normalizarItem)
  const valorICMS = num(nota.valorIcms)
  const baseICMS = itens.reduce((s, it) => s + it.baseICMS, 0)

  return {
    id: nota.id,
    numero: String(nota.numero ?? ''),
    serie: nota.serie ?? '',
    tipo: nota.tipo,
    naturezaOperacao: nota.naturezaOperacao,
    finalidade: 'NORMAL',
    status: nota.status,
    regimeTributario: derivarRegime(regimeConfig),
    clienteId: nota.clienteId ?? undefined,
    destinatario: dest.nome ?? '',
    destinatarioCnpjCpf: dest.cpfCnpj ?? '',
    destinatarioUF: dest.estado ?? dest.uf ?? '',
    destinatarioEmail: dest.email ?? undefined,
    enderecoEntrega: dest.logradouro ?? dest.endereco ?? undefined,
    itens,
    qtdItens: itens.length,
    valorProdutos: num(nota.valorProdutos),
    valorDesconto: num(nota.valorDesconto),
    valorFrete: num(nota.valorFrete),
    valorOutras: num(nota.valorOutros),
    baseICMS,
    valorICMS,
    valorPIS: num(nota.valorPis),
    valorCOFINS: num(nota.valorCofins),
    valorIPI: num(nota.valorIpi),
    valorISS: 0,
    valorTotal: num(nota.valorTotal),
    chaveAcesso: nota.chaveAcesso ?? undefined,
    protocolo: nota.protocolo ?? undefined,
    dataAutorizacao: nota.status === 'AUTORIZADA' ? nota.atualizadoEm : undefined,
    motivoRejeicao: nota.motivoRejeicao ?? undefined,
    motivoCancelamento: nota.status === 'CANCELADA' ? (nota.motivoRejeicao ?? undefined) : undefined,
    protocoloCancelamento: nota.status === 'CANCELADA' ? (nota.protocolo ?? undefined) : undefined,
    pedidoId: nota.pedidoId ?? undefined,
    dataEmissao: nota.dataEmissao,
    criadoEm: nota.criadoEm,
    atualizadoEm: nota.atualizadoEm,
    informacoesAdicionais: nota.informacoesAdicionais ?? undefined,
  }
}

/** Mapeia a configuração real → view-model legado (DANFE/emissão/tela antiga). */
function normalizarConfig(cfg: ConfiguracaoFiscalReal): ConfiguracaoFiscal {
  return {
    cnpj: cfg.cnpj ?? '',
    razaoSocial: cfg.razaoSocial ?? '',
    nomeFantasia: cfg.nomeFantasia ?? '',
    ie: cfg.inscricaoEstadual ?? '',
    im: cfg.inscricaoMunicipal ?? undefined,
    cnae: cfg.cnae ?? '',
    regimeTributario: derivarRegime(cfg.regimeTributario),
    uf: cfg.uf ?? '',
    municipio: cfg.municipio ?? '',
    cMunicipio: cfg.codigoMunicipio ?? '',
    cep: cfg.cep ?? '',
    logradouro: cfg.endereco ?? '',
    numero: cfg.numero ?? '',
    bairro: cfg.bairro ?? '',
    certificadoValidade: cfg.validadeCertificado ?? undefined,
    certificadoStatus: cfg.validadeCertificado
      ? new Date(cfg.validadeCertificado).getTime() > Date.now()
        ? 'VALIDO'
        : 'EXPIRADO'
      : 'NAO_CONFIGURADO',
    ambiente: cfg.ambienteSefaz ?? 'HOMOLOGACAO',
    sefazStatus: 'ONLINE',
    serieNFe: cfg.serieNfe ?? '1',
    proximoNumeroNFe: cfg.proximoNumeroNfe ?? 1,
    serieNFCe: cfg.serieNfce ?? '1',
    proximoNumeroNFCe: cfg.proximoNumeroNfce ?? 1,
    aliquotaICMSPadrao: 0,
    aliquotaPISPadrao: 0,
    aliquotaCOFINSPadrao: 0,
    cfopPadraoEstadual: '5102',
    cfopPadraoInterestadual: '6102',
  }
}

/** Regime carregado da config, cacheado para enriquecer notas sem repetir GET. */
let regimeCache: RegimeTributario | undefined

// ─── Análise IA (computada localmente) ─────────────────────────────────────────

function computarAnaliseIA(nfs: NotaFiscal[], config: ConfiguracaoFiscal): AnaliseIAFiscal {
  const emitidas = nfs.filter((n) => n.status === 'AUTORIZADA').length
  const rejeitadas = nfs.filter((n) => n.status === 'REJEITADA').length
  const canceladas = nfs.filter((n) => n.status === 'CANCELADA').length
  const total = nfs.filter((n) => n.status !== 'RASCUNHO').length

  const taxaRejeicao = total > 0 ? rejeitadas / total : 0
  const taxaCancelamento = total > 0 ? canceladas / total : 0
  const taxaEmissao = total > 0 ? emitidas / total : 0

  const scoreEmissao = Math.round(taxaEmissao * 40)
  const scoreCFOP = emitidas > 0 ? 30 : 15
  const scoreCertificado = config.certificadoStatus === 'VALIDO' ? 20 : 0
  const scoreAmbiente = config.ambiente === 'PRODUCAO' ? 10 : 5
  const scoreCompliance = scoreEmissao + scoreCFOP + scoreCertificado + scoreAmbiente

  const saude: AnaliseIAFiscal['saude'] =
    scoreCompliance >= 85 ? 'EXCELENTE' : scoreCompliance >= 70 ? 'BOA' : scoreCompliance >= 50 ? 'REGULAR' : 'CRITICA'

  const nfsEmitidas = nfs.filter((n) => n.status === 'AUTORIZADA')
  const totalFaturado = nfsEmitidas.reduce((s, n) => s + n.valorTotal, 0)
  const totalICMS = nfsEmitidas.reduce((s, n) => s + n.valorICMS, 0)
  const totalPIS = nfsEmitidas.reduce((s, n) => s + n.valorPIS, 0)
  const totalCOFINS = nfsEmitidas.reduce((s, n) => s + n.valorCOFINS, 0)
  const totalImpostos = totalICMS + totalPIS + totalCOFINS
  const cargaTributaria = totalFaturado > 0 ? (totalImpostos / totalFaturado) * 100 : 0

  const alertas: AnaliseIAFiscal['alertas'] = []
  if (rejeitadas > 0)
    alertas.push({
      tipo: 'CRITICO',
      titulo: `${rejeitadas} NF-e${rejeitadas > 1 ? 's' : ''} rejeitada${rejeitadas > 1 ? 's' : ''}`,
      descricao: 'Verifique os códigos de rejeição e corrija os dados antes de retransmitir.',
    })
  if (config.ambiente === 'HOMOLOGACAO')
    alertas.push({
      tipo: 'ATENCAO',
      titulo: 'Ambiente de Homologação ativo',
      descricao: 'As notas emitidas não têm validade fiscal. Configure o ambiente de Produção.',
    })
  if (config.certificadoStatus !== 'VALIDO')
    alertas.push({
      tipo: 'CRITICO',
      titulo: 'Certificado digital inválido',
      descricao: 'O certificado A1 não está configurado ou expirou. A emissão de NF-e será bloqueada.',
    })
  if (canceladas > 0 && total > 0 && canceladas / total > 0.1)
    alertas.push({
      tipo: 'ATENCAO',
      titulo: `Taxa de cancelamento elevada (${(taxaCancelamento * 100).toFixed(1)}%)`,
      descricao: 'Revise o processo de emissão para reduzir cancelamentos desnecessários.',
    })
  const emProcessamento = nfs.filter((n) => n.status === 'TRANSMITIDA').length
  if (emProcessamento > 0)
    alertas.push({
      tipo: 'INFO',
      titulo: `${emProcessamento} NF-e em processamento`,
      descricao: 'Aguardando resposta da SEFAZ. Verifique em alguns minutos.',
    })

  const oportunidades: AnaliseIAFiscal['oportunidades'] = []
  if (config.regimeTributario === 'LUCRO_PRESUMIDO' && totalFaturado < 4800000) {
    oportunidades.push({
      titulo: 'Simples Nacional pode ser mais vantajoso',
      descricao:
        'Faturamento anual abaixo de R$ 4,8M qualifica para Simples Nacional. Economia estimada de até 3,5% na carga tributária.',
      economia: (totalImpostos * 0.035).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    })
  }
  oportunidades.push({
    titulo: 'Benefício fiscal para produtos de informática',
    descricao: 'NCMs 8517 e 8471 podem ter redução de ICMS com Decreto Estadual. Consulte seu contador.',
  })
  if (config.uf && nfs.some((n) => n.destinatarioUF && n.destinatarioUF !== config.uf)) {
    oportunidades.push({
      titulo: 'Operações interestaduais — alíquota diferenciada',
      descricao:
        'Para NF-e interestaduais, verifique convênios ICMS que podem reduzir a base de cálculo em até 20%.',
    })
  }

  return {
    scoreCompliance,
    saude,
    alertas,
    oportunidades,
    metricas: {
      totalFaturado,
      totalImpostos,
      cargaTributaria: +cargaTributaria.toFixed(2),
      detalheImpostos: { icms: +totalICMS.toFixed(2), pis: +totalPIS.toFixed(2), cofins: +totalCOFINS.toFixed(2) },
      percentualICMS: totalImpostos > 0 ? +((totalICMS / totalImpostos) * 100).toFixed(1) : 0,
      percentualPIS: totalImpostos > 0 ? +((totalPIS / totalImpostos) * 100).toFixed(1) : 0,
      percentualCOFINS: totalImpostos > 0 ? +((totalCOFINS / totalImpostos) * 100).toFixed(1) : 0,
      taxaRejeicao: +(taxaRejeicao * 100).toFixed(1),
      taxaEmissao: +(taxaEmissao * 100).toFixed(1),
      nfsPorStatus: {
        emitidas,
        rejeitadas,
        canceladas,
        processando: emProcessamento,
        rascunho: nfs.filter((n) => n.status === 'RASCUNHO').length,
        validada: nfs.filter((n) => n.status === 'VALIDADA').length,
      },
    },
  }
}

/** Busca as notas (paginação máxima) que alimentam a análise de IA local. */
async function buscarTodasNotas(): Promise<NotaFiscal[]> {
  const regime = await carregarRegimeConfig()
  const { data } = await api.get<EnvelopePaginado<NotaFiscalBackend>>('/v1/notas-fiscais', {
    params: { pagina: 1, limite: 100 },
  })
  return (data.dados ?? []).map((n) => normalizarNota(n, regime))
}

/** Carrega (e cacheia) o regime tributário do emitente da configuração real. */
async function carregarRegimeConfig(): Promise<RegimeTributario | undefined> {
  if (regimeCache) return regimeCache
  try {
    const { data } = await api.get<ConfiguracaoFiscalReal>('/v1/configuracao-fiscal')
    regimeCache = derivarRegime(data.regimeTributario)
    return regimeCache
  } catch {
    return undefined
  }
}

// ─── Serviço ──────────────────────────────────────────────────────────────────

export const fiscalService = {
  /**
   * Lista notas fiscais reais. O backend usa `pagina`/`limite` e não aceita
   * `busca` (whitelist estrita), então a busca textual é feita no cliente.
   */
  async listar(params?: ListarNotasFiscaisDTO): Promise<ListagemNotas> {
    const regime = await carregarRegimeConfig()
    const pagina = params?.page ?? 1
    const limite = Math.min(100, params?.limit ?? 20)

    const query: Record<string, string | number> = { pagina, limite }
    if (params?.status) query.status = params.status
    if (params?.tipo) query.tipo = params.tipo

    const { data } = await api.get<EnvelopePaginado<NotaFiscalBackend>>('/v1/notas-fiscais', { params: query })

    let notas = (data.dados ?? []).map((n) => normalizarNota(n, regime))

    // Busca textual client-side (número, destinatário, chave de acesso).
    const busca = params?.busca?.trim().toLowerCase()
    if (busca) {
      notas = notas.filter(
        (n) =>
          n.numero.toLowerCase().includes(busca) ||
          n.destinatario.toLowerCase().includes(busca) ||
          (n.chaveAcesso ?? '').toLowerCase().includes(busca) ||
          (n.destinatarioCnpjCpf ?? '').toLowerCase().includes(busca),
      )
    }

    return {
      notas,
      total: busca ? notas.length : data.total ?? notas.length,
      page: data.pagina ?? pagina,
      limit: data.limite ?? limite,
      totalPages: data.totalPaginas ?? 1,
    }
  },

  async obterPorId(id: string): Promise<NotaFiscal> {
    const regime = await carregarRegimeConfig()
    const { data } = await api.get<NotaFiscalBackend>(`/v1/notas-fiscais/${id}`)
    return normalizarNota(data, regime)
  },

  async criar(dto: CriarNotaFiscalDTO): Promise<NotaFiscal> {
    const { data } = await api.post<NotaFiscalBackend>('/v1/notas-fiscais', dto)
    return normalizarNota(data, await carregarRegimeConfig())
  },

  async atualizar(id: string, dto: Partial<CriarNotaFiscalDTO>): Promise<NotaFiscal> {
    const { data } = await api.put<NotaFiscalBackend>(`/v1/notas-fiscais/${id}`, dto)
    return normalizarNota(data, await carregarRegimeConfig())
  },

  /** Valida a nota (RASCUNHO/REJEITADA → VALIDADA). Backend usa PUT. */
  async validar(id: string) {
    const { data } = await api.put<NotaFiscalBackend>(`/v1/notas-fiscais/${id}/validar`, {})
    const nf = normalizarNota(data, await carregarRegimeConfig())
    return { valido: nf.status === 'VALIDADA', nf }
  },

  /** Transmite a nota ao provedor fiscal (SEFAZ/fake). */
  async emitir(id: string) {
    const { data } = await api.post<{ status?: string; protocolo?: string; motivo?: string; chaveAcesso?: string }>(
      `/v1/notas-fiscais/${id}/emitir`,
      {},
    )
    const autorizado = data.status === 'AUTORIZADO'
    return {
      sucesso: autorizado,
      protocolo: data.protocolo,
      chaveAcesso: data.chaveAcesso,
      motivoRejeicao: autorizado ? undefined : data.motivo,
    }
  },

  /** Cancela a nota. Backend espera `{ justificativa }` (mín. 15 caracteres). */
  async cancelar(id: string, motivo: string) {
    const { data } = await api.post<{ status?: string; motivo?: string }>(`/v1/notas-fiscais/${id}/cancelar`, {
      justificativa: motivo,
    })
    return { sucesso: data.status === 'CANCELADO' }
  },

  /** Análise de compliance computada localmente a partir das notas reais. */
  async analisarIA(): Promise<AnaliseIAFiscal> {
    const [nfs, config] = await Promise.all([buscarTodasNotas(), this.obterConfiguracao()])
    return computarAnaliseIA(nfs, config)
  },

  /**
   * KPIs fiscais do tenant, agregados no banco pelo fiscal-service.
   *
   * O backend devolve exatamente o shape `EstatisticasFiscais` (valores
   * monetários já em `number`), somando TODAS as notas do tenant — por isso
   * nada é recalculado aqui.
   */
  async estatisticas(): Promise<EstatisticasFiscais> {
    const { data } = await api.get<EstatisticasFiscais>('/v1/notas-fiscais/estatisticas')
    return data
  },

  /** Configuração no view-model legado (DANFE, emissão avulsa, tela antiga). */
  async obterConfiguracao(): Promise<ConfiguracaoFiscal> {
    const { data } = await api.get<ConfiguracaoFiscalReal>('/v1/configuracao-fiscal')
    regimeCache = derivarRegime(data.regimeTributario)
    return normalizarConfig(data)
  },

  /** Configuração no SHAPE REAL do backend (tela `configuracoes`). */
  async obterConfiguracaoReal(): Promise<ConfiguracaoFiscalReal> {
    const { data } = await api.get<ConfiguracaoFiscalReal>('/v1/configuracao-fiscal')
    regimeCache = derivarRegime(data.regimeTributario)
    return data
  },

  /** Persiste a configuração real (PUT /v1/configuracao-fiscal). */
  async salvarConfiguracaoReal(dto: AtualizarConfiguracaoFiscalReal): Promise<ConfiguracaoFiscalReal> {
    const { data } = await api.put<ConfiguracaoFiscalReal>('/v1/configuracao-fiscal', dto)
    regimeCache = derivarRegime(data.regimeTributario)
    return data
  },

  async listarRegras(busca?: string) {
    const q = busca ? `?busca=${encodeURIComponent(busca)}` : ''
    const { data } = await api.get<{ regras: RegraFiscal[]; total: number }>(`/v1/regras-fiscais${q}`)
    return data
  },

  async criarRegra(dto: Omit<RegraFiscal, 'id'>) {
    const { data } = await api.post<RegraFiscal>('/v1/regras-fiscais', dto)
    return data
  },

  async atualizarRegra(id: string, dto: Partial<RegraFiscal>) {
    const { data } = await api.put<RegraFiscal>(`/v1/regras-fiscais/${id}`, dto)
    return data
  },

  async obterCatalogo() {
    const { data } = await api.get<{
      produtos: ProdutoCatalogo[]
      clientes: ClienteCatalogo[]
      empresaUF: string
    }>('/v1/notas-fiscais/catalogo')
    return data
  },
}

// ─── Tipos do Catálogo ────────────────────────────────────────────────────────

export interface ProdutoCatalogo {
  id: string
  nome: string
  sku: string
  preco: number
  estoque: number
  unidade: string
  ncm: string
  cfopEstadual: string
  cfopInterestadual: string
  aliquotaICMS: number
  aliquotaPIS: number
  aliquotaCOFINS: number
  csosn: string
  descricaoNCM: string
}

export interface ClienteCatalogo {
  id: string
  nome: string
  tipo: 'PJ' | 'PF'
  cnpjCpf: string
  uf: string
  email: string
  telefone: string
}
