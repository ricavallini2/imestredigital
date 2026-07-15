import {
  PlataformaMarketplace,
  StatusConexao,
  StatusAnuncio,
} from '../../../generated/client'

/**
 * Shapes servidos à UI (apps/web) pelo controller `api/v1/marketplaces`.
 *
 * Estes tipos espelham EXATAMENTE o contrato consumido em
 * apps/web/src/services/marketplaces.service.ts (interfaces Marketplace,
 * Anuncio, StatsMarketplace...). Todos os campos monetários já saem como
 * `number` (Decimal do Prisma convertido na borda). Nada de Decimal cru.
 */

/** Item da vitrine: uma conta de marketplace no shape que a tela renderiza. */
export interface MarketplaceVitrine {
  id: string
  canal: PlataformaMarketplace
  nome: string
  status: StatusConexao
  taxaPlataforma: number
  sellerId: string
  pedidosHoje: number
  pedidosMes: number
  anunciosAtivos: number
  anunciosPausados: number
  perguntasPendentes: number
  receitaMes: number
  receitaLiquidaMes: number
  ticketMedio: number
  avaliacaoVendedor: number
  taxaResposta: number
  taxaReclamacao: number
  ultimaSincronizacao: string | null
  criadoEm: string
}

/** Anúncio no shape da tela de anúncios (métricas achatadas de `metricas` JSON). */
export interface AnuncioVitrine {
  id: string
  produtoId: string
  canal: PlataformaMarketplace
  titulo: string
  sku: string
  preco: number
  precoPromocional?: number
  custoMedio: number
  estoque: number
  status: StatusAnuncio
  impressoes: number
  cliques: number
  conversao: number
  vendas30d: number
  receita30d: number
  categoria: string
  urlAnuncio?: string
  anuncioId: string
  criadoEm: string
  atualizadoEm: string
}

/** Top anúncio no ranking de stats. */
export interface TopAnuncioVitrine {
  id: string
  titulo: string
  canal: PlataformaMarketplace
  sku: string
  preco: number
  vendas30d: number
  receita30d: number
  conversao: number
  estoque: number
}

/** Vendas agregadas por canal/mês. */
export interface VendaCanalVitrine {
  canal: string
  mes: string
  pedidos: number
  receita: number
  taxaPlataforma: number
  receitaLiquida: number
}

/** Item de issue do health score. */
export interface HealthIssueVitrine {
  tipo: string
  descricao: string
}

/** Health score por canal. */
export interface HealthScoreVitrine {
  canal: string
  nome: string
  score: number
  issues: HealthIssueVitrine[]
}

/** Stats agregadas globais do tenant (shape do mock stats). */
export interface StatsMarketplaceVitrine {
  totalReceita: number
  totalReceitaLiquida: number
  totalPedidosMes: number
  totalAnuncios: number
  perguntasPendentes: number
  taxaRespostaMedia: number
  avaliacaoMedia: number
  topAnuncios: TopAnuncioVitrine[]
  vendasPorCanal: VendaCanalVitrine[]
  crescimentoMes: number
  healthScore: HealthScoreVitrine[]
}
