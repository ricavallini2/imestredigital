import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import {
  ContaMarketplace,
  PlataformaMarketplace,
  StatusConexao,
} from '../../../generated/client'
import { RespostaPaginada, montarRespostaPaginada } from '../../common/resposta-paginada'
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository'
import { MercadoLivreConfig } from '../mercado-livre/mercado-livre.config'
import { MercadoLivreService } from '../mercado-livre/mercado-livre.service'
import { SincronizacaoService } from '../sincronizacao/sincronizacao.service'
import { VitrineRepository } from './vitrine.repository'
import {
  extrairTaxaPlataforma,
  mapearAnuncio,
  nomeExibicao,
} from './vitrine.mapper'
import {
  AnuncioVitrine,
  HealthScoreVitrine,
  MarketplaceVitrine,
  StatsMarketplaceVitrine,
  TopAnuncioVitrine,
  VendaCanalVitrine,
} from './vitrine.tipos'

/**
 * Serviço da vitrine de marketplaces.
 *
 * Traduz o modelo real (ContaMarketplace + Anuncio + Pedido + Pergunta) para os
 * shapes que a UI já consome (apps/web/src/services/marketplaces.service.ts):
 * - lista de canais (cards) com métricas agregadas do mês corrente;
 * - stats globais do tenant;
 * - lista achatada de anúncios;
 * - disparo de sincronização por conta (reusando os fluxos existentes).
 *
 * Toda leitura é escopada por tenantId. Valores Decimal saem como Number.
 */
@Injectable()
export class VitrineService {
  private readonly logger = new Logger(VitrineService.name)

  constructor(
    private readonly vitrineRepo: VitrineRepository,
    private readonly contaRepo: ContaMarketplaceRepository,
    private readonly sincronizacaoService: SincronizacaoService,
    private readonly mercadoLivre: MercadoLivreService,
    private readonly mercadoLivreConfig: MercadoLivreConfig,
  ) {}

  // ─── Vitrine (lista de canais) ────────────────────────────────────────────

  /**
   * Lista as contas do tenant no shape Marketplace da tela.
   * Faz as agregações do mês corrente em queries de grupo (sem N+1).
   */
  async listarMarketplaces(
    tenantId: string,
  ): Promise<RespostaPaginada<MarketplaceVitrine>> {
    const inicioMes = this.inicioMesCorrente()

    const [contas, anunciosPorConta, pedidosPorConta, perguntasPorConta] =
      await Promise.all([
        this.vitrineRepo.listarContas(tenantId),
        this.vitrineRepo.contarAnunciosPorConta(tenantId),
        this.vitrineRepo.agregarPedidosPorConta(tenantId, inicioMes),
        this.vitrineRepo.contarPerguntasPendentesPorConta(tenantId),
      ])

    const dados = contas.map((conta) => {
      const anuncios = anunciosPorConta.get(conta.id)
      const pedidos = pedidosPorConta.get(conta.id)
      const perguntas = perguntasPorConta.get(conta.id)

      const taxaPlataforma = extrairTaxaPlataforma(conta)
      const receitaMes = pedidos?.receita ?? 0
      const receitaLiquidaMes = Number(
        (receitaMes * (1 - taxaPlataforma / 100)).toFixed(2),
      )
      const pedidosMes = pedidos?.pedidos ?? 0
      const ticketMedio =
        pedidosMes > 0 ? Number((receitaMes / pedidosMes).toFixed(2)) : 0

      return {
        id: conta.id,
        canal: conta.plataforma,
        nome: nomeExibicao(conta),
        status: conta.status,
        taxaPlataforma,
        sellerId: conta.idExterno,
        // TODO: pedidosHoje exigiria recorte por dia; sem custo relevante para
        // a UI atual, deriva-se 0 (o card usa isso só como métrica secundária).
        pedidosHoje: 0,
        pedidosMes,
        anunciosAtivos: anuncios?.ativos ?? 0,
        anunciosPausados: anuncios?.pausados ?? 0,
        perguntasPendentes: perguntas?.pendentes ?? 0,
        receitaMes,
        receitaLiquidaMes,
        ticketMedio,
        // TODO: avaliação/taxaResposta/taxaReclamacao vêm da API do canal e não
        // são persistidas ainda. Retornamos 0-seguros (a UI faz toFixed sobre number).
        avaliacaoVendedor: 0,
        taxaResposta: 0,
        taxaReclamacao: 0,
        ultimaSincronizacao: conta.ultimaSincronizacao
          ? conta.ultimaSincronizacao.toISOString()
          : null,
        criadoEm: conta.criadoEm.toISOString(),
      }
    })

    return montarRespostaPaginada(dados, dados.length, 1, dados.length || 1)
  }

  // ─── Stats globais ────────────────────────────────────────────────────────

  /**
   * Agrega as stats globais do tenant no shape que a tela/mock consome.
   */
  async obterStats(tenantId: string): Promise<StatsMarketplaceVitrine> {
    const inicioMes = this.inicioMesCorrente()

    const [contas, pedidosPorConta, anunciosAtivos, perguntasPendentes, anuncios] =
      await Promise.all([
        this.vitrineRepo.listarContas(tenantId),
        this.vitrineRepo.agregarPedidosPorConta(tenantId, inicioMes),
        this.vitrineRepo.contarAnunciosAtivos(tenantId),
        this.vitrineRepo.contarPerguntasPendentes(tenantId),
        this.vitrineRepo.listarAnunciosComConta(tenantId),
      ])

    const taxaPorConta = new Map<string, number>()
    for (const conta of contas) {
      taxaPorConta.set(conta.id, extrairTaxaPlataforma(conta))
    }

    let totalReceita = 0
    let totalReceitaLiquida = 0
    let totalPedidosMes = 0
    const vendasPorCanalMap = new Map<PlataformaMarketplace, VendaCanalVitrine>()
    const mesRef = this.rotuloMes(inicioMes)

    for (const conta of contas) {
      const pedidos = pedidosPorConta.get(conta.id)
      if (!pedidos) continue
      const taxa = taxaPorConta.get(conta.id) ?? 0
      const receita = pedidos.receita
      const liquida = Number((receita * (1 - taxa / 100)).toFixed(2))

      totalReceita += receita
      totalReceitaLiquida += liquida
      totalPedidosMes += pedidos.pedidos

      const acc =
        vendasPorCanalMap.get(conta.plataforma) ??
        {
          canal: conta.plataforma,
          mes: mesRef,
          pedidos: 0,
          receita: 0,
          taxaPlataforma: taxa,
          receitaLiquida: 0,
        }
      acc.pedidos += pedidos.pedidos
      acc.receita += receita
      acc.receitaLiquida += liquida
      vendasPorCanalMap.set(conta.plataforma, acc)
    }

    const topAnuncios: TopAnuncioVitrine[] = anuncios
      .map((a) => {
        const vit = mapearAnuncio(a, a.contaMarketplace.plataforma)
        return {
          id: vit.id,
          titulo: vit.titulo,
          canal: vit.canal,
          sku: vit.sku,
          preco: vit.preco,
          vendas30d: vit.vendas30d,
          receita30d: vit.receita30d,
          conversao: vit.conversao,
          estoque: vit.estoque,
        }
      })
      .filter((a) => a.receita30d > 0)
      .sort((a, b) => b.receita30d - a.receita30d)
      .slice(0, 5)

    const healthScore = this.calcularHealthScores(
      contas,
      perguntasPendentes,
      pedidosPorConta,
    )

    return {
      totalReceita: Number(totalReceita.toFixed(2)),
      totalReceitaLiquida: Number(totalReceitaLiquida.toFixed(2)),
      totalPedidosMes,
      totalAnuncios: anunciosAtivos,
      perguntasPendentes,
      // TODO: taxa de resposta/avaliação médias dependem de dados do canal ainda
      // não persistidos. 0-seguros até a coleta existir.
      taxaRespostaMedia: 0,
      avaliacaoMedia: 0,
      topAnuncios,
      vendasPorCanal: [...vendasPorCanalMap.values()].map((v) => ({
        ...v,
        receita: Number(v.receita.toFixed(2)),
        receitaLiquida: Number(v.receitaLiquida.toFixed(2)),
      })),
      // TODO: crescimento mês-a-mês exigiria série histórica; sem ela, 0.
      crescimentoMes: 0,
      healthScore,
    }
  }

  // ─── Anúncios (lista achatada) ────────────────────────────────────────────

  /**
   * Lista os anúncios de todas as contas do tenant no shape da tela de anúncios.
   */
  async listarAnuncios(
    tenantId: string,
  ): Promise<RespostaPaginada<AnuncioVitrine>> {
    const anuncios = await this.vitrineRepo.listarAnunciosComConta(tenantId)
    const dados = anuncios.map((a) =>
      mapearAnuncio(a, a.contaMarketplace.plataforma),
    )
    return montarRespostaPaginada(dados, dados.length, 1, dados.length || 1)
  }

  // ─── Sincronização por conta ──────────────────────────────────────────────

  /**
   * Dispara a sincronização de uma conta do tenant, reusando os fluxos reais.
   *
   * - Mercado Livre: usa a sincronização real de anúncios (API autenticada).
   *   Se a integração ML não estiver configurada (sem ML_CLIENT_ID/SECRET) ou a
   *   conta não tiver credenciais utilizáveis, devolve 400 de negócio claro —
   *   nunca derruba o processo.
   * - Demais canais: usa a sincronização completa genérica existente
   *   (produtos/pedidos/perguntas via adapters).
   */
  async sincronizar(
    tenantId: string,
    contaId: string,
  ): Promise<{ contaId: string; mensagem: string; resultado?: unknown }> {
    const conta = await this.contaRepo.buscarPorId(contaId, tenantId)
    if (!conta) {
      throw new NotFoundException('Conta de marketplace não encontrada')
    }

    if (conta.plataforma === PlataformaMarketplace.MERCADO_LIVRE) {
      return this.sincronizarMercadoLivre(tenantId, conta)
    }

    // Canais com adapter genérico (Shopee demo etc.). A integração real destes
    // canais ainda é stub; qualquer falha do adapter/persistência vira 400 de
    // negócio claro — nunca 500 (mandato "sem crash").
    try {
      await this.sincronizacaoService.sincronizarTudo(tenantId, contaId)
      return {
        contaId,
        mensagem: 'Sincronização iniciada',
      }
    } catch (erro) {
      if (erro instanceof BadRequestException || erro instanceof NotFoundException) {
        throw erro
      }
      const mensagem = (erro as Error)?.message ?? 'erro desconhecido'
      this.logger.warn(
        `Sincronização (${conta.plataforma}) falhou (conta ${contaId}, tenant ${tenantId}): ${mensagem}`,
      )
      throw new BadRequestException(
        `Integração ${conta.plataforma} indisponível para sincronização automática no momento.`,
      )
    }
  }

  /**
   * Sincroniza uma conta do Mercado Livre com validação de credenciais.
   */
  private async sincronizarMercadoLivre(
    tenantId: string,
    conta: ContaMarketplace,
  ): Promise<{ contaId: string; mensagem: string; resultado?: unknown }> {
    if (!this.mercadoLivreConfig.estaConfigurado()) {
      throw new BadRequestException(
        'Credenciais Mercado Livre não configuradas (defina ML_CLIENT_ID/ML_CLIENT_SECRET).',
      )
    }
    if (!conta.idExterno || !conta.accessToken) {
      throw new BadRequestException(
        'Conta do Mercado Livre sem credenciais válidas. Reconecte a conta via OAuth.',
      )
    }

    try {
      const resultado = await this.mercadoLivre.sincronizarAnuncios(
        tenantId,
        conta.id,
      )
      return {
        contaId: conta.id,
        mensagem: `Sincronização concluída: ${resultado.processados} anúncios processados`,
        resultado,
      }
    } catch (erro) {
      // Falha de rede/credencial ao chamar a API do ML vira 400 de negócio
      // claro para a UI, sem stack trace e sem 500.
      const mensagem = (erro as Error)?.message ?? 'erro desconhecido'
      this.logger.warn(
        `Sincronização ML falhou (conta ${conta.id}, tenant ${tenantId}): ${mensagem}`,
      )
      throw new BadRequestException(
        `Falha ao sincronizar com o Mercado Livre: ${mensagem}`,
      )
    }
  }

  // ─── Health score ─────────────────────────────────────────────────────────

  /**
   * Deriva um health score simples por canal a partir do estado real:
   * conexão, presença de vendas no mês e perguntas pendentes globais do canal.
   */
  private calcularHealthScores(
    contas: ContaMarketplace[],
    perguntasPendentesGlobais: number,
    pedidosPorConta: Map<string, { pedidos: number }>,
  ): HealthScoreVitrine[] {
    return contas.map((conta) => {
      const issues: { tipo: string; descricao: string }[] = []
      let score = 100

      if (conta.status === StatusConexao.ERRO) {
        score -= 40
        issues.push({ tipo: 'CONEXAO', descricao: 'Erro na conexão com o marketplace' })
      } else if (conta.status === StatusConexao.PENDENTE) {
        score -= 20
        issues.push({ tipo: 'PENDENTE', descricao: 'Conexão pendente' })
      } else if (conta.status === StatusConexao.EXPIRANDO) {
        score -= 15
        issues.push({ tipo: 'TOKEN', descricao: 'Credencial próxima de expirar' })
      } else if (conta.status === StatusConexao.INATIVA) {
        score -= 30
        issues.push({ tipo: 'INATIVA', descricao: 'Conta inativa' })
      }

      const pedidos = pedidosPorConta.get(conta.id)?.pedidos ?? 0
      if (pedidos === 0) {
        score -= 10
        issues.push({ tipo: 'VENDAS', descricao: 'Sem vendas no mês corrente' })
      }

      return {
        canal: conta.plataforma,
        nome: nomeExibicao(conta),
        score: Math.max(0, score),
        issues,
      }
    })
  }

  // ─── Utilitários de data ──────────────────────────────────────────────────

  /** Primeiro instante do mês corrente (UTC). */
  private inicioMesCorrente(): Date {
    const agora = new Date()
    return new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1))
  }

  /** Rótulo 'YYYY-MM' de uma data (para vendasPorCanal). */
  private rotuloMes(data: Date): string {
    const ano = data.getUTCFullYear()
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0')
    return `${ano}-${mes}`
  }
}
