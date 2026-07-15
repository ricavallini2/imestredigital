/**
 * Serviço de Insights - Análise automática de dados
 *
 * Gera insights sobre:
 * - Vendas (tendências, sazonalidade)
 * - Estoque (crítico, encalhado)
 * - Financeiro (fluxo de caixa, contas atrasadas)
 * - Fiscal (pendências)
 * - Marketplace (avaliações, perguntas)
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InsightsRepository } from './insights.repository';
import { LLMService } from '../assistente/llm.service';
import { promptAnaliseVendas } from '../assistente/prompts/system-prompt';
import { ProdutorEventosService } from '../eventos/produtor-eventos.service';

interface FiltrosInsights {
  tipo?: string;
  prioridade?: string;
  apenasNaoLidos?: boolean;
  pagina?: number;
  limite?: number;
}

interface DadosCriacaoInsight {
  tenantId: string;
  tipo: string;
  titulo: string;
  descricao: string;
  prioridade: string;
  dados?: Record<string, any>;
  acaoSugerida?: string;
}

@Injectable()
export class InsightsService {
  private logger = new Logger('InsightsService');

  constructor(
    private repository: InsightsRepository,
    private llmService: LLMService,
    private produtorEventos: ProdutorEventosService,
  ) {}

  /**
   * Gera insights diários para um tenant
   *
   * Seria acionado por:
   * - Cronjob diário
   * - Evento PEDIDO_PAGO
   * - Evento ESTOQUE_ATUALIZADO
   */
  async gerarInsightsDiarios(tenantId: string) {
    this.logger.debug(`Gerando insights diários para ${tenantId}`);

    // Em produção, buscaria dados reais de outros serviços
    // Por agora, apenas demonstração

    const insights = [
      await this.gerarInsightVenda(tenantId),
      await this.gerarInsightEstoque(tenantId),
      await this.gerarInsightFinanceiro(tenantId),
    ];

    return insights.filter((i) => i !== null);
  }

  /**
   * Analisa vendas e gera insights
   */
  async analisarVendas(
    tenantId: string,
    periodo?: { dataInicio: Date; dataFim: Date },
  ) {
    this.logger.debug(`Analisando vendas para ${tenantId}`);

    // Mock de dados - em produção viria de order-service
    const dadosVendas = {
      totalVendas: 15420.5,
      quantidadePedidos: 45,
      ticketMedio: 342.67,
      produtosVendidos: 120,
      crescimentoPeriodoAnterior: 12.5,
      categoriaTop: 'Eletrônicos',
    };

    // Usar LLM para análise contextualizada
    const prompt = `${promptAnaliseVendas}

Dados: ${JSON.stringify(dadosVendas, null, 2)}

Analise e forneça insights.`;

    const analise = await this.llmService.completar(prompt, {
      temperatura: 0.3,
      maxTokens: 1000,
    });

    return this.persistirInsight({
      tenantId,
      tipo: 'VENDA',
      titulo: 'Análise de Vendas',
      descricao: analise.conteudo,
      prioridade: 'MEDIA',
      dados: dadosVendas,
      acaoSugerida: 'Revisar estratégia de preços da categoria top',
    });
  }

  /**
   * Analisa estoque e identifica problemas
   */
  async analisarEstoque(tenantId: string) {
    this.logger.debug(`Analisando estoque para ${tenantId}`);

    // Mock - em produção viria de inventory-service
    const produtosCriticos = [
      { nome: 'Produto A', estoque: 2, vendiaMedia: 10 },
      { nome: 'Produto B', estoque: 5, vendiaMedia: 15 },
    ];

    const produtosEncalhados = [
      { nome: 'Produto X', estoque: 500, vendiaMedia: 1 },
    ];

    const descricao = `
Produtos com estoque crítico (risco de falta):
${produtosCriticos.map((p) => `- ${p.nome}: ${p.estoque} un (venda média: ${p.vendiaMedia}/dia)`).join('\n')}

Produtos encalhados (risco de obsolescência):
${produtosEncalhados.map((p) => `- ${p.nome}: ${p.estoque} un (venda média: ${p.vendiaMedia}/dia)`).join('\n')}
    `;

    return this.persistirInsight({
      tenantId,
      tipo: 'ESTOQUE',
      titulo: 'Alerta de Estoque',
      descricao,
      prioridade: 'ALTA',
      dados: { produtosCriticos, produtosEncalhados },
      acaoSugerida: 'Reabastecer produtos críticos e revisar precificação dos encalhados',
    });
  }

  /**
   * Analisa dados financeiros
   */
  async analisarFinanceiro(tenantId: string) {
    this.logger.debug(`Analisando financeiro para ${tenantId}`);

    // Mock
    const fluxoCaixa = {
      recebitasEsperadas: 45000,
      despesasFixas: 12000,
      despesasVariaveis: 8000,
      saldoProjetado: 25000,
    };

    const descricao = `
Análise de fluxo de caixa:
- Receitas esperadas: R$ ${fluxoCaixa.recebitasEsperadas}
- Despesas fixas: R$ ${fluxoCaixa.despesasFixas}
- Despesas variáveis: R$ ${fluxoCaixa.despesasVariaveis}
- Saldo projetado: R$ ${fluxoCaixa.saldoProjetado}
    `;

    return this.persistirInsight({
      tenantId,
      tipo: 'FINANCEIRO',
      titulo: 'Análise de Fluxo de Caixa',
      descricao,
      prioridade: 'MEDIA',
      dados: fluxoCaixa,
    });
  }

  /**
   * Lista insights com filtros, no envelope paginado canônico:
   * { dados, total, pagina, limite, totalPaginas }.
   */
  async listarInsights(tenantId: string, filtros: FiltrosInsights) {
    const pagina = filtros.pagina ?? 0;
    const limite = filtros.limite ?? 20;

    const { insights, total } = await this.repository.listarInsights(tenantId, {
      tipo: filtros.tipo,
      prioridade: filtros.prioridade,
      apenasNaoLidos: filtros.apenasNaoLidos,
      limite,
      offset: pagina * limite,
    });

    return {
      dados: insights,
      total,
      pagina,
      limite,
      totalPaginas: limite > 0 ? Math.ceil(total / limite) : 0,
    };
  }

  /**
   * Obtém um insight específico do tenant.
   */
  async obterInsight(tenantId: string, insightId: string) {
    const insight = await this.repository.obterInsight(tenantId, insightId);

    if (!insight) {
      throw new NotFoundException('Insight não encontrado');
    }

    return insight;
  }

  /**
   * Marca insight como visualizado (escopado por tenant).
   */
  async marcarComoVisualizado(tenantId: string, insightId: string) {
    const atualizado = await this.repository.marcarVisualizado(tenantId, insightId);

    if (!atualizado) {
      throw new NotFoundException('Insight não encontrado');
    }

    return atualizado;
  }

  /**
   * Cria um insight diretamente a partir de dados externos.
   * Usado por outros módulos (ex: ConsumidorEventosService).
   * Publica o evento insight_gerado no Kafka.
   */
  async criarInsight(dados: DadosCriacaoInsight) {
    return this.persistirInsight(dados);
  }

  /**
   * Persiste o insight e publica o evento insight_gerado no Kafka.
   * Ponto único de criação para garantir a publicação do evento.
   */
  private async persistirInsight(dados: DadosCriacaoInsight) {
    const insight = await this.repository.criarInsight(dados);

    await this.produtorEventos.publicarInsightGerado({
      tenantId: insight.tenantId,
      insightId: insight.id,
      tipo: insight.tipo,
      titulo: insight.titulo,
      prioridade: insight.prioridade,
    });

    return insight;
  }

  /**
   * Helper privado: gera insight de venda
   */
  private async gerarInsightVenda(tenantId: string) {
    try {
      return await this.analisarVendas(tenantId);
    } catch (erro) {
      this.logger.error(`Erro ao gerar insight de venda: ${erro.message}`);
      return null;
    }
  }

  /**
   * Helper privado: gera insight de estoque
   */
  private async gerarInsightEstoque(tenantId: string) {
    try {
      return await this.analisarEstoque(tenantId);
    } catch (erro) {
      this.logger.error(`Erro ao gerar insight de estoque: ${erro.message}`);
      return null;
    }
  }

  /**
   * Helper privado: gera insight financeiro
   */
  private async gerarInsightFinanceiro(tenantId: string) {
    try {
      return await this.analisarFinanceiro(tenantId);
    } catch (erro) {
      this.logger.error(`Erro ao gerar insight financeiro: ${erro.message}`);
      return null;
    }
  }
}
