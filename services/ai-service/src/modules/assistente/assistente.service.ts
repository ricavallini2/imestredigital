/**
 * Serviço Assistente - Lógica de negócio
 *
 * Implementa:
 * - Gerenciamento de conversas
 * - Processamento de mensagens com IA
 * - Processamento de comandos naturais
 * - Geração de contexto
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LLMService } from './llm.service';
import { AssistenteRepository } from './assistente.repository';
import { gerarSystemPrompt } from './prompts/system-prompt';
import { IniciarConversaDTO } from './dtos/iniciar-conversa.dto';
import { EnviarMensagemDTO } from './dtos/enviar-mensagem.dto';
import { ComandoRapidoDTO } from './dtos/comando-rapido.dto';

interface ConversaComMensagens {
  id: string;
  tenantId: string;
  usuarioId: string;
  titulo: string;
  contexto: Record<string, any>;
  mensagens: Array<{
    id: string;
    papel: string;
    conteudo: string;
    criadoEm: Date;
  }>;
}

@Injectable()
export class AssistenteService {
  private logger = new Logger('AssistenteService');

  constructor(
    private llmService: LLMService,
    private repository: AssistenteRepository,
  ) {}

  /**
   * Inicia uma nova conversa
   */
  async iniciarConversa(
    tenantId: string,
    usuarioId: string,
    dados: IniciarConversaDTO,
  ) {
    this.logger.debug(
      `Iniciando conversa para ${tenantId}/${usuarioId}: ${dados.titulo}`,
    );

    const conversa = await this.repository.criarConversa({
      tenantId,
      usuarioId,
      titulo: dados.titulo,
      contexto: dados.contexto,
    });

    // Adicionar mensagem inicial do sistema
    await this.repository.adicionarMensagem({
      conversaId: conversa.id,
      papel: 'SISTEMA',
      conteudo: `Conversa iniciada: ${dados.titulo}`,
      metadados: { inicial: true },
    });

    return conversa;
  }

  /**
   * Processa uma mensagem do usuário e obtém resposta da IA
   */
  async enviarMensagem(
    tenantId: string,
    conversaId: string,
    dados: EnviarMensagemDTO,
  ) {
    this.logger.debug(`Processando mensagem em conversa ${conversaId}`);

    // Validar conversa existe e pertence ao tenant
    const conversa = await this.repository.obterConversa(conversaId);
    if (!conversa || conversa.tenantId !== tenantId) {
      throw new NotFoundException(
        'Conversa não encontrada ou não pertence a este tenant',
      );
    }

    // 1. Adicionar mensagem do usuário
    const mensagemUsuario = await this.repository.adicionarMensagem({
      conversaId,
      papel: 'USUARIO',
      conteudo: dados.mensagem,
      metadados: { contextoExtra: dados.contextoExtra || {} },
    });

    // 2. Obter histórico para contexto
    const historico = await this.repository.obterUltimasMensagens(conversaId, 10);

    // 3. Construir system prompt
    const contexto = { ...conversa.contexto, ...dados.contextoExtra };
    const systemPrompt = gerarSystemPrompt(contexto);

    // 4. Preparar mensagens para LLM
    const mensagensLLM = historico
      .reverse()
      .filter((m) => m.papel !== 'SISTEMA')
      .map((m) => ({
        papel: m.papel,
        conteudo: m.conteudo,
      }));

    // 5. Chamar LLM
    const rateOk = await this.llmService.verificarRateLimit(tenantId, 500); // Estimativa
    if (!rateOk) {
      throw new Error('Rate limit excedido. Tente novamente em alguns instantes.');
    }

    const respostaLLM = await this.llmService.completarComContexto(
      systemPrompt,
      mensagensLLM,
    );

    // 6. Armazenar resposta
    const mensagemAssistente = await this.repository.adicionarMensagem({
      conversaId,
      papel: 'ASSISTENTE',
      conteudo: respostaLLM.conteudo,
      metadados: {
        tokensUsados: respostaLLM.tokensUsados,
        modelo: respostaLLM.modeloUsado,
        tempoRespostaMs: respostaLLM.tempoRespostaMs,
        custo: respostaLLM.custo,
      },
    });

    this.logger.debug(
      `Resposta gerada: ${respostaLLM.tokensUsados} tokens, ~$${respostaLLM.custo.toFixed(4)}`,
    );

    return {
      conversa,
      respostaAssistente: mensagemAssistente.conteudo,
      metadados: {
        tokensUsados: respostaLLM.tokensUsados,
        tempoMs: respostaLLM.tempoRespostaMs,
        custo: respostaLLM.custo,
      },
    };
  }

  /**
   * Processa um comando rápido (sem conversa)
   *
   * Exemplos:
   * - "qual meu faturamento de hoje?"
   * - "produtos mais vendidos da semana"
   * - "como está meu estoque?"
   * - "gerar relatório de vendas"
   */
  async processarComando(
    tenantId: string,
    usuarioId: string,
    dados: ComandoRapidoDTO,
  ) {
    this.logger.debug(`Processando comando: ${dados.comando}`);

    // Montar prompt específico para comandos
    const systemPrompt = gerarSystemPrompt(dados.contexto);

    // Chamar LLM
    const rateOk = await this.llmService.verificarRateLimit(tenantId, 300);
    if (!rateOk) {
      throw new Error('Rate limit excedido. Tente novamente em alguns instantes.');
    }

    const resposta = await this.llmService.completarComContexto(
      systemPrompt,
      [{ papel: 'USUARIO', conteudo: dados.comando }],
    );

    return {
      comando: dados.comando,
      resposta: resposta.conteudo,
      metadados: {
        tokensUsados: resposta.tokensUsados,
        tempoMs: resposta.tempoRespostaMs,
        custo: resposta.custo,
      },
    };
  }

  /**
   * Lista todas as conversas de um usuário
   */
  async listarConversas(
    tenantId: string,
    usuarioId: string,
    pagina: number = 0,
    limite: number = 20,
  ) {
    const offset = pagina * limite;
    return this.repository.listarConversas(tenantId, usuarioId, limite, offset);
  }

  /**
   * Obtém uma conversa com seu histórico
   */
  async obterConversa(tenantId: string, conversaId: string) {
    const conversa = await this.repository.obterConversa(conversaId);

    if (!conversa || conversa.tenantId !== tenantId) {
      throw new NotFoundException('Conversa não encontrada');
    }

    return conversa;
  }

  /**
   * Monta contexto do tenant para enriquecer respostas
   *
   * Em uma implementação real, isso consultaria dados de outros serviços
   * (order-service, catalog-service, etc) via HTTP ou Kafka
   */
  async obterContexto(tenantId: string): Promise<Record<string, any>> {
    // Contexto padrão - seria substituído por dados reais
    return {
      tenantId,
      dataAtual: new Date().toISOString(),
      modulo: 'geral',
      // Em produção, buscar dados reais de:
      // - Faturamento do dia
      // - Produtos top 5
      // - Alertas de estoque
      // - Métricas financeiras
      // etc.
    };
  }
}
