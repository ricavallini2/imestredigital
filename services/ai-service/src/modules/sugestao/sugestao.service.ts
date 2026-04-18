/**
 * Serviço de Sugestões
 *
 * Gera sugestões para:
 * - Preço (baseado em custo e concorrência)
 * - Descrição de produto (otimizada para SEO/marketplace)
 * - Resposta a pergunta de cliente (profissional)
 * - Título de anúncio (por marketplace)
 */

import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LLMService } from '../assistente/llm.service';
import { SugestaoRepository } from './sugestao.repository';
import {
  promptRespostaMarketplace,
  promptDescricaoProduto,
} from '../assistente/prompts/system-prompt';

interface SugestaoPreco {
  precoSugerido: number;
  confianca: number;
  margemSugerida: number;
  analise: string;
}

interface SugestaoDescricao {
  descricao: string;
  palabrasChaveIdentificadas: string[];
  confianca: number;
}

interface SugestaoResposta {
  resposta: string;
  tom: 'PROFISSIONAL' | 'AMIGAVEL' | 'FORMAL';
  confianca: number;
}

@Injectable()
export class SugestaoService {
  private logger = new Logger('SugestaoService');

  constructor(
    private llmService: LLMService,
    private repository: SugestaoRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Sugere preço para um produto
   *
   * Baseado em:
   * - Custo unitário
   * - Margem desejada
   * - Análise de mercado (simulada)
   */
  async sugerirPreco(
    tenantId: string,
    produtoId: string,
    custoUnitario: number,
    margemDesejada: number = 0.3,
  ): Promise<SugestaoPreco> {
    this.logger.debug(
      `Sugerindo preço para ${produtoId}: custo ${custoUnitario}, margem ${margemDesejada}`,
    );

    // Preço base = custo / (1 - margem)
    const precoBase = custoUnitario / (1 - margemDesejada);

    // Ajustes de mercado (simulados)
    // Em produção, consultar dados de concorrentes, histórico, etc
    const ajusteVendibilidade = 1.05; // +5% se produto é popular
    const ajusteSazonalidade = 1.0; // Variação por época do ano
    const ajusteEstoque = 0.98; // -2% se estoque alto

    const precoFinal = precoBase * ajusteVendibilidade * ajusteSazonalidade * ajusteEstoque;
    const margemReal = (precoFinal - custoUnitario) / precoFinal;

    const sugestao: SugestaoPreco = {
      precoSugerido: Math.round(precoFinal * 100) / 100,
      confianca: 0.75,
      margemSugerida: Math.round(margemReal * 10000) / 100,
      analise: `Preço calculado considerando custo, margem desejada e fatores de mercado. Validar contra concorrência.`,
    };

    // Armazenar
    await this.repository.criarSugestao({
      tenantId,
      tipo: 'PRECO',
      contexto: { produtoId, custoUnitario, margemDesejada },
      sugestao: `R$ ${sugestao.precoSugerido}`,
      confianca: sugestao.confianca,
    });

    return sugestao;
  }

  /**
   * Gera descrição otimizada de produto
   *
   * Otimizada para:
   * - SEO (palavras-chave)
   * - Conversão (benefícios, call-to-action)
   * - Compatibilidade com marketplaces
   */
  async gerarDescricaoProduto(
    tenantId: string,
    produtoId: string,
    dados: {
      nome: string;
      categoria: string;
      caracteristicas: string[];
      palavrasChave?: string[];
    },
  ): Promise<SugestaoDescricao> {
    this.logger.debug(
      `Gerando descrição para produto: ${dados.nome}`,
    );

    // Verificar cache
    const chaveCache = `descricao:${produtoId}`;
    const emCache = await this.cacheManager.get(chaveCache);
    if (emCache) {
      this.logger.debug(`Descrição encontrada em cache para ${produtoId}`);
      return emCache as SugestaoDescricao;
    }

    const prompt = `${promptDescricaoProduto}

Nome: ${dados.nome}
Categoria: ${dados.categoria}
Características: ${dados.caracteristicas.join(', ')}
Palavras-chave: ${dados.palavrasChave?.join(', ') || 'não informadas'}

Gere uma descrição otimizada.`;

    try {
      const resposta = await this.llmService.completar(prompt, {
        temperatura: 0.6,
        maxTokens: 400,
      });

      const resultado: SugestaoDescricao = {
        descricao: resposta.conteudo.trim(),
        palabrasChaveIdentificadas: dados.palavrasChave || [],
        confianca: 0.8,
      };

      // Cachear por 7 dias
      await this.cacheManager.set(
        chaveCache,
        resultado,
        7 * 24 * 60 * 60 * 1000,
      );

      // Armazenar no BD
      await this.repository.criarSugestao({
        tenantId,
        tipo: 'DESCRICAO_PRODUTO',
        contexto: { produtoId, ...dados },
        sugestao: resultado.descricao,
        confianca: resultado.confianca,
      });

      return resultado;
    } catch (erro) {
      this.logger.error(`Erro ao gerar descrição: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Gera resposta profissional para pergunta de cliente
   *
   * Usado para:
   * - Marketplace (Mercado Livre, Amazon, Shopee)
   * - Chat de atendimento
   * - Formulários de contato
   */
  async sugerirRespostaMarketplace(
    tenantId: string,
    perguntaId: string,
    pergunta: string,
    contexto?: {
      nomeCliente?: string;
      marketplace?: string;
      produtoId?: string;
    },
  ): Promise<SugestaoResposta> {
    this.logger.debug(
      `Gerando resposta para pergunta: ${pergunta.substring(0, 50)}...`,
    );

    const prompt = `${promptRespostaMarketplace}

Pergunta do cliente: "${pergunta}"
${contexto?.marketplace ? `Marketplace: ${contexto.marketplace}` : ''}

Redija uma resposta profissional.`;

    try {
      const resposta = await this.llmService.completar(prompt, {
        temperatura: 0.5,
        maxTokens: 300,
      });

      const resultado: SugestaoResposta = {
        resposta: resposta.conteudo.trim(),
        tom: 'PROFISSIONAL',
        confianca: 0.85,
      };

      // Armazenar
      await this.repository.criarSugestao({
        tenantId,
        tipo: 'RESPOSTA_MARKETPLACE',
        contexto: { perguntaId, pergunta, ...contexto },
        sugestao: resultado.resposta,
        confianca: resultado.confianca,
      });

      return resultado;
    } catch (erro) {
      this.logger.error(`Erro ao gerar resposta: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Gera título otimizado para anúncio em marketplace
   */
  async sugerirTituloAnuncio(
    tenantId: string,
    produtoId: string,
    marketplace: 'MERCADO_LIVRE' | 'AMAZON' | 'SHOPEE' | 'PRÓPRIO',
    dados: { nome: string; categoria: string; destaque?: string },
  ) {
    this.logger.debug(
      `Gerando título para ${marketplace}: ${dados.nome}`,
    );

    const limites = {
      MERCADO_LIVRE: 60,
      AMAZON: 150,
      SHOPEE: 100,
      PRÓPRIO: 80,
    };

    const limite = limites[marketplace];

    const prompt = `Crie um título atrativo e otimizado para ${marketplace} com máximo ${limite} caracteres.

Produto: ${dados.nome}
Categoria: ${dados.categoria}
${dados.destaque ? `Destaque: ${dados.destaque}` : ''}

Responda apenas com o título, sem aspas.`;

    const resposta = await this.llmService.completar(prompt, {
      temperatura: 0.6,
      maxTokens: 200,
    });

    let titulo = resposta.conteudo.trim();
    if (titulo.length > limite) {
      titulo = titulo.substring(0, limite - 3) + '...';
    }

    return {
      titulo,
      caracteres: titulo.length,
      limite,
      marketplace,
    };
  }

  /**
   * Lista sugestões geradas
   */
  async listarSugestoes(
    tenantId: string,
    filtros?: {
      tipo?: string;
      aceita?: boolean;
      limite?: number;
      offset?: number;
    },
  ) {
    return this.repository.listarSugestoes(tenantId, filtros);
  }

  /**
   * Marca sugestão como aceita (registra comportamento do usuário)
   */
  async aceitarSugestao(tenantId: string, sugestaoId: string) {
    return this.repository.aceitarSugestao(sugestaoId);
  }
}
