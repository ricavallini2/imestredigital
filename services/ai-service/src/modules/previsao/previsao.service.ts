/**
 * Serviço de Previsão de Demanda
 *
 * Algoritmos:
 * - Média móvel ponderada
 * - Regressão linear simples
 * - Análise de sazonalidade
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrevisaoRepository } from './previsao.repository';
import * as ss from 'simple-statistics';

interface DadosHistorico {
  data: Date;
  quantidade: number;
}

interface PrevisaoDemandaResultado {
  quantidadePrevista: number;
  confianca: number;
  tendencia: 'ALTA' | 'ESTAVEL' | 'BAIXA';
  metodo: string;
  notas: string;
}

@Injectable()
export class PrevisaoService {
  private logger = new Logger('PrevisaoService');

  constructor(private repository: PrevisaoRepository) {}

  /**
   * Prevê demanda de um produto para os próximos N dias
   */
  async preverDemanda(
    tenantId: string,
    produtoId: string,
    diasFuturos: number = 30,
  ): Promise<PrevisaoDemandaResultado> {
    this.logger.debug(
      `Prevendo demanda para ${produtoId} - próximos ${diasFuturos} dias`,
    );

    // Mock de dados históricos - em produção viria de order-service
    const historico = this.gerarDadosMock(90);

    // Aplicar algoritmos
    const mediaMovel = this.calcularMediaMovelPonderada(historico);
    const regressao = this.calcularRegressaoLinear(historico);
    const sazonalidade = this.analisarSazonalidade(historico);

    // Combinar previsões (peso: média 40%, regressão 40%, sazonalidade 20%)
    const quantidadePrevista =
      mediaMovel * 0.4 + regressao * 0.4 + sazonalidade * 0.2;

    // Calcular confiança baseada na consistência dos dados
    const confianca = this.calcularConfianca(historico);

    // Identificar tendência
    const tendencia = this.identificarTendencia(historico);

    const resultado: PrevisaoDemandaResultado = {
      quantidadePrevista: Math.round(quantidadePrevista),
      confianca,
      tendencia,
      metodo: 'COMBINADA (Media+Regressao+Sazonalidade)',
      notas: `Previsão baseada em ${historico.length} dias de histórico`,
    };

    // Armazenar no banco
    await this.repository.criarPrevisao({
      tenantId,
      produtoId,
      periodo: new Date(),
      quantidadePrevista: resultado.quantidadePrevista,
      confianca: resultado.confianca,
      metodoCalculo: resultado.metodo,
      dadosEntrada: {
        diasHistorico: historico.length,
        sazonalidade,
        tendencia: resultado.tendencia,
      },
    });

    return resultado;
  }

  /**
   * Prevê demanda por categoria
   */
  async preverDemandaCategoria(
    tenantId: string,
    categoriaId: string,
    diasFuturos: number = 30,
  ) {
    this.logger.debug(
      `Prevendo demanda para categoria ${categoriaId} - próximos ${diasFuturos} dias`,
    );

    // Mock
    const historico = this.gerarDadosMock(90);
    const quantidade = this.calcularMediaMovelPonderada(historico);

    return {
      categoriaId,
      quantidadePrevista: Math.round(quantidade),
      confianca: this.calcularConfianca(historico),
      tendencia: this.identificarTendencia(historico),
    };
  }

  /**
   * Calcula ponto de reposição (quando reabastecer)
   *
   * Fórmula: Ponto Reposição = (Demanda Média × Lead Time) + Estoque Segurança
   */
  async calcularPontoReposicao(
    tenantId: string,
    produtoId: string,
  ): Promise<{
    pontoReposicao: number;
    estoqueSugerido: number;
    leadTimeDias: number;
    demandaMedia: number;
    estoqueSeguranca: number;
  }> {
    this.logger.debug(`Calculando ponto de reposição para ${produtoId}`);

    // Mock de dados
    const demandaMedia = 10; // unidades por dia
    const leadTimeDias = 7; // dias para receber reposição
    const desvio = 2; // variação na demanda
    const nivelServico = 0.95; // 95% de disponibilidade

    // Fator de segurança baseado em distribuição normal
    const fatorSeguranca = 1.645; // Para 95% de confiabilidade

    const estoqueSeguranca = fatorSeguranca * desvio * Math.sqrt(leadTimeDias);
    const pontoReposicao = demandaMedia * leadTimeDias + estoqueSeguranca;
    const estoqueSugerido = pontoReposicao + demandaMedia * 30; // Estoque para 30 dias

    return {
      pontoReposicao: Math.ceil(pontoReposicao),
      estoqueSugerido: Math.ceil(estoqueSugerido),
      leadTimeDias,
      demandaMedia,
      estoqueSeguranca: Math.ceil(estoqueSeguranca),
    };
  }

  /**
   * Lista previsões geradas
   */
  async listarPrevisoes(
    tenantId: string,
    filtros?: {
      produtoId?: string;
      limite?: number;
      offset?: number;
    },
  ) {
    return this.repository.listarPrevisoes(tenantId, filtros);
  }

  // ======= Métodos privados de cálculo =======

  /**
   * Calcula média móvel ponderada (últimos 7 dias com peso maior)
   */
  private calcularMediaMovelPonderada(historico: DadosHistorico[]): number {
    if (historico.length === 0) return 0;

    let soma = 0;
    let pesoTotal = 0;

    historico.slice(-7).forEach((item, index) => {
      const peso = index + 1; // Mais recente = maior peso
      soma += item.quantidade * peso;
      pesoTotal += peso;
    });

    return soma / pesoTotal || 0;
  }

  /**
   * Calcula regressão linear
   * Estima tendência futura
   */
  private calcularRegressaoLinear(historico: DadosHistorico[]): number {
    if (historico.length < 2) return 0;

    const quantidades = historico.map((h) => h.quantidade);
    const indices = Array.from({ length: historico.length }, (_, i) => i);

    // Usar simple-statistics para regressão
    const regressionLine = ss.linearRegression(
      indices.map((i, idx) => [i, quantidades[idx]]),
    );

    // Prever próximo ponto (dia seguinte)
    const proximoPonto = regressionLine.m * historico.length + regressionLine.b;

    return Math.max(0, proximoPonto); // Não pode ser negativo
  }

  /**
   * Analisa sazonalidade
   * Compara vendas de períodos similares
   */
  private analisarSazonalidade(historico: DadosHistorico[]): number {
    if (historico.length < 14) return this.calcularMediaMovelPonderada(historico);

    // Comparar última semana com semana anterior
    const ultimaSemana = historico.slice(-7);
    const semanaPosterior = historico.slice(-14, -7);

    const mediaUltima = ss.mean(ultimaSemana.map((h) => h.quantidade));
    const mediaAnterior = ss.mean(semanaPosterior.map((h) => h.quantidade));

    // Se há padrão sazonal, aplicar índice
    const indicesSazonalidade = ultimaSemana.map(
      (item, idx) => (item.quantidade / mediaUltima) * mediaAnterior,
    );

    return ss.mean(indicesSazonalidade);
  }

  /**
   * Calcula nível de confiança da previsão
   * Baseado em consistência dos dados
   */
  private calcularConfianca(historico: DadosHistorico[]): number {
    if (historico.length < 30) return 0.5; // Dados insuficientes

    const quantidades = historico.map((h) => h.quantidade);
    const media = ss.mean(quantidades);
    const desvio = ss.standardDeviation(quantidades);

    // Coeficiente de variação (quanto menor, mais consistente)
    const coefVaracao = desvio / media;

    // Converter para confiança (0-1)
    const confianca = Math.max(0.3, Math.min(1.0, 1 - coefVaracao / 2));

    return parseFloat(confianca.toFixed(2));
  }

  /**
   * Identifica tendência dos dados
   */
  private identificarTendencia(
    historico: DadosHistorico[],
  ): 'ALTA' | 'ESTAVEL' | 'BAIXA' {
    if (historico.length < 7) return 'ESTAVEL';

    const ultimoSete = historico.slice(-7);
    const primeiros30dias = historico.slice(0, Math.min(30, historico.length));

    const mediaRecente = ss.mean(ultimoSete.map((h) => h.quantidade));
    const mediaAnterior = ss.mean(primeiros30dias.map((h) => h.quantidade));

    const percentualMudanca = (mediaRecente - mediaAnterior) / mediaAnterior;

    if (percentualMudanca > 0.1) return 'ALTA';
    if (percentualMudanca < -0.1) return 'BAIXA';
    return 'ESTAVEL';
  }

  /**
   * Gera dados mock para testes
   */
  private gerarDadosMock(dias: number): DadosHistorico[] {
    const dados: DadosHistorico[] = [];
    const hoje = new Date();

    for (let i = dias; i > 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);

      // Quantidade com variação aleatória e tendência
      const base = 20;
      const tendencia = i * 0.1;
      const ruido = Math.random() * 10 - 5;
      const quantidade = Math.max(5, base + tendencia + ruido);

      dados.push({
        data,
        quantidade: Math.round(quantidade),
      });
    }

    return dados;
  }
}
