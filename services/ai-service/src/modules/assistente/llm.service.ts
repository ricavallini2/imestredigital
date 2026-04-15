/**
 * Serviço LLM - Abstração do provider de IA
 *
 * Centraliza comunicação com OpenAI/ChatGPT
 * Implementa rate limiting, logging de tokens/custos
 * e fallback para modelos alternativos
 */

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import OpenAI from 'openai';
import {
  openaiConfig,
  configPorTarefa,
  modelosFallback,
} from '../../config/openai.config';

interface OpcoesConclusao {
  temperatura?: number;
  maxTokens?: number;
  topP?: number;
  funcoes?: object[];
}

interface RespostaConclusao {
  conteudo: string;
  tokensUsados: number;
  modeloUsado: string;
  tempoRespostaMs: number;
  custo: number;
}

interface MetadadosToken {
  tenantId: string;
  tokensUsados: number;
  timestamp: number;
}

@Injectable()
export class LLMService {
  private logger = new Logger('LLMService');
  private cliente: OpenAI;

  // Mapa de custos por modelo (USD por 1k tokens)
  private custosPorModelo = {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'text-davinci-003': { input: 0.02, output: 0.02 },
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    if (!openaiConfig.apiKey) {
      this.logger.warn('OPENAI_API_KEY não configurada!');
    }

    this.cliente = new OpenAI({
      apiKey: openaiConfig.apiKey,
    });
  }

  /**
   * Processa um completion simples
   * Mais direto que completarComContexto()
   */
  async completar(
    prompt: string,
    opcoes?: OpcoesConclusao,
  ): Promise<RespostaConclusao> {
    const inicio = Date.now();

    try {
      const config = opcoes || configPorTarefa.assistente;

      const resposta = await this.cliente.chat.completions.create({
        model: openaiConfig.modelo,
        messages: [{ role: 'user', content: prompt }],
        temperature: config.temperatura || openaiConfig.temperatura,
        max_tokens: config.maxTokens || openaiConfig.maxTokens,
        top_p: config.topP || 0.9,
      });

      const tempoMs = Date.now() - inicio;
      const conteudo = resposta.choices[0]?.message?.content || '';
      const tokensUsados = resposta.usage?.total_tokens || 0;

      const custo = this.calcularCusto(
        openaiConfig.modelo,
        resposta.usage?.prompt_tokens || 0,
        resposta.usage?.completion_tokens || 0,
      );

      this.logger.debug(
        `Completion: ${tokensUsados} tokens em ${tempoMs}ms (~$${custo.toFixed(4)})`,
      );

      return {
        conteudo,
        tokensUsados,
        modeloUsado: openaiConfig.modelo,
        tempoRespostaMs: tempoMs,
        custo,
      };
    } catch (erro) {
      this.logger.error(`Erro ao chamar LLM: ${erro.message}`);
      throw new BadRequestException('Erro ao processar requisição de IA');
    }
  }

  /**
   * Completion com contexto de conversa (mensagens anteriores)
   * Suporta function calling para respostas estruturadas
   */
  async completarComContexto(
    sistemaMensagem: string,
    mensagens: Array<{ papel: string; conteudo: string }>,
    funcoes?: object[],
  ): Promise<RespostaConclusao> {
    const inicio = Date.now();

    try {
      const mensagensFormatadas = [
        { role: 'system' as const, content: sistemaMensagem },
        ...mensagens.map((m) => ({
          role: (m.papel === 'USUARIO' ? 'user' : 'assistant') as const,
          content: m.conteudo,
        })),
      ];

      const config: any = {
        model: openaiConfig.modelo,
        messages: mensagensFormatadas,
        temperature: openaiConfig.temperatura,
        max_tokens: openaiConfig.maxTokens,
        top_p: 0.9,
      };

      // Adicionar function definitions se fornecidas
      if (funcoes && funcoes.length > 0) {
        config.functions = funcoes;
        config.function_call = 'auto';
      }

      const resposta = await this.cliente.chat.completions.create(config);

      const tempoMs = Date.now() - inicio;
      const mensagemResposta = resposta.choices[0]?.message;

      let conteudo = '';
      if (mensagemResposta?.content) {
        conteudo = mensagemResposta.content;
      } else if (mensagemResposta?.function_call) {
        // Se for function call, serializar
        conteudo = JSON.stringify(mensagemResposta.function_call);
      }

      const tokensUsados = resposta.usage?.total_tokens || 0;
      const custo = this.calcularCusto(
        openaiConfig.modelo,
        resposta.usage?.prompt_tokens || 0,
        resposta.usage?.completion_tokens || 0,
      );

      this.logger.debug(
        `CompletarComContexto: ${tokensUsados} tokens em ${tempoMs}ms (~$${custo.toFixed(4)})`,
      );

      return {
        conteudo,
        tokensUsados,
        modeloUsado: openaiConfig.modelo,
        tempoRespostaMs: tempoMs,
        custo,
      };
    } catch (erro) {
      this.logger.error(`Erro ao chamar LLM com contexto: ${erro.message}`);
      throw new BadRequestException(
        'Erro ao processar requisição de IA com contexto',
      );
    }
  }

  /**
   * Gera embedding de um texto
   * Útil para busca semântica, similaridade, etc
   */
  async gerarEmbedding(texto: string): Promise<number[]> {
    try {
      const resposta = await this.cliente.embeddings.create({
        model: 'text-embedding-3-small',
        input: texto,
      });

      return resposta.data[0].embedding;
    } catch (erro) {
      this.logger.error(`Erro ao gerar embedding: ${erro.message}`);
      throw new BadRequestException('Erro ao processar embedding de texto');
    }
  }

  /**
   * Verifica rate limit de tokens por tenant
   */
  async verificarRateLimit(
    tenantId: string,
    tokosAGastar: number,
  ): Promise<boolean> {
    const chave = `rate-limit:tokens:${tenantId}`;
    const agora = Date.now();

    try {
      const dados = (await this.cacheManager.get(chave)) as
        | MetadadosToken
        | undefined;

      // Se passou de 1 minuto, resetar contador
      if (!dados || agora - dados.timestamp > 60000) {
        await this.cacheManager.set(
          chave,
          {
            tenantId,
            tokensUsados: tokosAGastar,
            timestamp: agora,
          } as MetadadosToken,
          60000,
        );
        return true;
      }

      // Verificar se vai passar do limite
      const totalTokens = dados.tokensUsados + tokosAGastar;
      if (totalTokens > openaiConfig.tokensporMinuto) {
        this.logger.warn(
          `Rate limit excedido para ${tenantId}: ${totalTokens} / ${openaiConfig.tokensporMinuto}`,
        );
        return false;
      }

      // Incrementar
      await this.cacheManager.set(
        chave,
        {
          tenantId,
          tokensUsados: totalTokens,
          timestamp: dados.timestamp,
        } as MetadadosToken,
        60000 - (agora - dados.timestamp),
      );

      return true;
    } catch (erro) {
      this.logger.error(`Erro ao verificar rate limit: ${erro.message}`);
      // Em caso de erro, permitir (falha aberta)
      return true;
    }
  }

  /**
   * Calcula custo estimado de uma chamada LLM
   * @param modelo Modelo utilizado
   * @param promptTokens Tokens usados no prompt
   * @param completionTokens Tokens gerados na resposta
   */
  private calcularCusto(
    modelo: string,
    promptTokens: number,
    completionTokens: number,
  ): number {
    const custos = this.custosPorModelo[modelo] || {
      input: 0.01,
      output: 0.01,
    };

    const custoInput = (promptTokens / 1000) * custos.input;
    const custoOutput = (completionTokens / 1000) * custos.output;

    return custoInput + custoOutput;
  }

  /**
   * Obtém a configuração específica para uma tarefa
   */
  obterConfigPorTarefa(
    tipoTarefa: 'assistente' | 'analise' | 'classificacao' | 'geracao' | 'previsao',
  ): OpcoesConclusao {
    return configPorTarefa[tipoTarefa] || configPorTarefa.assistente;
  }
}
