import { Prisma } from '../../../generated/client'
import type {
  AnuncioMarketplace,
  ContaMarketplace,
} from '../../../generated/client'
import { AnuncioVitrine } from './vitrine.tipos'
import { TAXA_PLATAFORMA_PADRAO, NOME_PLATAFORMA } from './vitrine.constants'

/**
 * Converte Decimal (Prisma) / number / string em `number` seguro.
 * Decimal → Number na borda: a UI nunca deve receber objeto Decimal nem string.
 */
export function paraNumero(
  valor: Prisma.Decimal | number | string | null | undefined,
): number {
  if (valor === null || valor === undefined) return 0
  const n = typeof valor === 'object' ? Number(valor.toString()) : Number(valor)
  return Number.isFinite(n) ? n : 0
}

/**
 * Extrai a taxa de plataforma (percentual) de uma conta.
 * Prioriza o que estiver em `configuracoes` (taxaPlataforma direta em %, ou
 * commissionRate como fração 0-1); cai no padrão do canal.
 */
export function extrairTaxaPlataforma(conta: ContaMarketplace): number {
  const cfg = (conta.configuracoes ?? {}) as Record<string, unknown>

  const taxaDireta = cfg.taxaPlataforma
  if (typeof taxaDireta === 'number' && Number.isFinite(taxaDireta)) {
    return taxaDireta
  }

  const commission = cfg.commissionRate
  if (typeof commission === 'number' && Number.isFinite(commission)) {
    // commissionRate é fração (0.05 → 5%). Converte para percentual.
    return Number((commission * 100).toFixed(2))
  }

  return TAXA_PLATAFORMA_PADRAO[conta.plataforma] ?? 0
}

/**
 * Lê `metricas` JSON do anúncio ({ visitas, vendas, perguntas }) de forma
 * defensiva, devolvendo números seguros.
 */
export function lerMetricasAnuncio(metricas: Prisma.JsonValue): {
  visitas: number
  vendas: number
  perguntas: number
} {
  const m = (metricas ?? {}) as Record<string, unknown>
  const num = (v: unknown): number => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }
  return {
    visitas: num(m.visitas),
    vendas: num(m.vendas),
    perguntas: num(m.perguntas),
  }
}

/**
 * Lê o SKU do vendedor de `atributos` JSON, se presente.
 * A sincronização do ML guarda o seller_custom_field em produtoId; alguns
 * canais podem gravar o SKU em atributos. Cai para string vazia.
 */
function lerSku(anuncio: AnuncioMarketplace): string {
  const attrs = (anuncio.atributos ?? {}) as Record<string, unknown>
  const sku = attrs.sku ?? attrs.seller_custom_field ?? attrs.codigoSku
  if (typeof sku === 'string' && sku.length > 0) return sku
  // Fallback: usa produtoId (que na sync do ML recebe o seller_custom_field).
  return anuncio.produtoId ?? ''
}

/**
 * Mapeia um AnuncioMarketplace (Prisma) para o shape AnuncioVitrine da tela.
 *
 * @param canal plataforma do canal (vem da conta dona do anúncio).
 */
export function mapearAnuncio(
  anuncio: AnuncioMarketplace,
  canal: AnuncioVitrine['canal'],
): AnuncioVitrine {
  const metricas = lerMetricasAnuncio(anuncio.metricas)
  const preco = paraNumero(anuncio.preco)
  const vendas30d = metricas.vendas

  return {
    id: anuncio.id,
    produtoId: anuncio.produtoId,
    canal,
    titulo: anuncio.titulo,
    sku: lerSku(anuncio),
    preco,
    precoPromocional:
      anuncio.precoPromocional !== null
        ? paraNumero(anuncio.precoPromocional)
        : undefined,
    // TODO: custoMedio não vive no marketplace-service (é do catalog/inventory).
    // Sem cruzar serviços, retornamos 0 seguro.
    custoMedio: 0,
    estoque: anuncio.estoque,
    status: anuncio.status,
    // TODO: impressões/cliques/conversão não são coletadas ainda pela sync.
    // `metricas.visitas` é o proxy mais próximo de impressões disponível.
    impressoes: metricas.visitas,
    cliques: 0,
    conversao: 0,
    vendas30d,
    // Sem histórico de 30d persistido: aproxima receita como preço × vendas.
    receita30d: Number((preco * vendas30d).toFixed(2)),
    categoria: anuncio.categoria,
    urlAnuncio: anuncio.url || undefined,
    anuncioId: anuncio.idExterno,
    criadoEm: anuncio.criadoEm.toISOString(),
    atualizadoEm: anuncio.atualizadoEm.toISOString(),
  }
}

/**
 * Nome de exibição da conta: usa o `nome` salvo, senão o rótulo do canal.
 */
export function nomeExibicao(conta: ContaMarketplace): string {
  if (conta.nome && conta.nome.trim().length > 0) return conta.nome
  return NOME_PLATAFORMA[conta.plataforma] ?? conta.plataforma
}
