/**
 * Serviço de Webhooks.
 *
 * Responsável por disparar webhooks para URLs externas com assinatura HMAC-SHA256.
 * Implementa retry com backoff exponencial e circuit breaker para falhas consecutivas.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

interface ConfiguracaoWebhookData {
  nome: string;
  url: string;
  eventos: string[];
  segredo?: string;
  ativo: boolean;
}

interface PayloadWebhook {
  evento: string;
  timestamp: string;
  dados: Record<string, any>;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private tentativasMaximas: number;
  private delayInicialMs: number;
  private limiarCircuitBreaker: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.tentativasMaximas = parseInt(
      this.configService.get('WEBHOOK_RETRY_ATTEMPTS', '3'),
    );
    this.delayInicialMs = parseInt(
      this.configService.get('WEBHOOK_RETRY_DELAY_MS', '1000'),
    );
    this.limiarCircuitBreaker = parseInt(
      this.configService.get('WEBHOOK_CIRCUIT_BREAKER_THRESHOLD', '5'),
    );
  }

  /**
   * Dispara um webhook para uma URL externa.
   */
  async dispararWebhook(
    tenantId: string,
    evento: string,
    dados: Record<string, any>,
    tentativa: number = 0,
  ): Promise<void> {
    try {
      // Busca webhooks ativos para este evento
      const webhooks = await this.prisma.configuracaoWebhook.findMany({
        where: {
          tenantId,
          ativo: true,
          eventos: {
            has: evento,
          },
        },
      });

      if (webhooks.length === 0) {
        this.logger.log(`Nenhum webhook configurado para evento: ${evento}`);
        return;
      }

      for (const webhook of webhooks) {
        // Verifica se o webhook está em circuit breaker
        if (
          webhook.falhasConsecutivas >= this.limiarCircuitBreaker
        ) {
          this.logger.warn(
            `Webhook ${webhook.id} desativado (circuit breaker ativo). ` +
            `Falhas consecutivas: ${webhook.falhasConsecutivas}`,
          );
          continue;
        }

        // Monta payload
        const payload: PayloadWebhook = {
          evento,
          timestamp: new Date().toISOString(),
          dados,
        };

        // Tenta enviar com retry
        const sucesso = await this.enviarComRetry(
          webhook,
          payload,
          tentativa,
        );

        if (sucesso) {
          // Reseta contador de falhas
          await this.prisma.configuracaoWebhook.update({
            where: { id: webhook.id },
            data: {
              falhasConsecutivas: 0,
              ultimoEnvio: new Date(),
            },
          });
        } else {
          // Incrementa contador de falhas
          await this.prisma.configuracaoWebhook.update({
            where: { id: webhook.id },
            data: {
              falhasConsecutivas: webhook.falhasConsecutivas + 1,
            },
          });
        }
      }
    } catch (erro) {
      this.logger.error(`Erro ao disparar webhook para evento ${evento}:`, erro);
    }
  }

  /**
   * Envia webhook com retry exponencial.
   */
  private async enviarComRetry(
    webhook: any,
    payload: PayloadWebhook,
    tentativa: number,
  ): Promise<boolean> {
    try {
      const resultado = await this.enviarWebhookHttp(webhook, payload);
      return resultado;
    } catch (erro) {
      if (tentativa < this.tentativasMaximas - 1) {
        const delayMs = this.delayInicialMs * Math.pow(2, tentativa);
        this.logger.warn(
          `Retry webhook ${webhook.id} em ${delayMs}ms (tentativa ${tentativa + 1}/${this.tentativasMaximas})`,
        );
        await this.aguardar(delayMs);
        return this.enviarComRetry(webhook, payload, tentativa + 1);
      }
      return false;
    }
  }

  /**
   * Envia requisição HTTP para o webhook.
   */
  private async enviarWebhookHttp(
    webhook: any,
    payload: PayloadWebhook,
  ): Promise<boolean> {
    try {
      // Monta headers com assinatura
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Webhook-Event': payload.evento,
        'X-Webhook-Timestamp': payload.timestamp,
      };

      // Se existe segredo, calcula assinatura HMAC-SHA256
      if (webhook.segredo) {
        const payloadJson = JSON.stringify(payload);
        const assinatura = crypto
          .createHmac('sha256', webhook.segredo)
          .update(payloadJson)
          .digest('hex');
        headers['X-Webhook-Signature'] = `sha256=${assinatura}`;
      }

      // Envia POST
      const resposta = await axios.post(webhook.url, payload, {
        headers,
        timeout: 5000,
      });

      // Registra no histórico
      await this.prisma.historicoWebhook.create({
        data: {
          tenantId: webhook.tenantId,
          webhookId: webhook.id,
          evento: payload.evento,
          payload: payload as any,
          statusCode: resposta.status,
          resposta: JSON.stringify(resposta.data).substring(0, 1000),
          tentativa: 1,
          sucesso: resposta.status >= 200 && resposta.status < 300,
        },
      });

      this.logger.log(
        `Webhook ${webhook.id} disparado com sucesso. Status: ${resposta.status}`,
      );
      return true;
    } catch (erro: any) {
      this.logger.error(`Erro ao enviar webhook HTTP:`, erro.message);

      // Registra falha no histórico
      try {
        await this.prisma.historicoWebhook.create({
          data: {
            tenantId: webhook.tenantId,
            webhookId: webhook.id,
            evento: payload.evento,
            payload: payload as any,
            statusCode: erro.response?.status || null,
            resposta: erro.message.substring(0, 1000),
            tentativa: 1,
            sucesso: false,
          },
        });
      } catch (erroDb) {
        this.logger.error('Erro ao registrar histórico webhook:', erroDb);
      }

      throw erro;
    }
  }

  /**
   * Registra um novo webhook.
   */
  async registrarWebhook(
    tenantId: string,
    dados: ConfiguracaoWebhookData,
  ): Promise<any> {
    try {
      const webhook = await this.prisma.configuracaoWebhook.create({
        data: {
          tenantId,
          nome: dados.nome,
          url: dados.url,
          eventos: dados.eventos,
          segredo: dados.segredo,
          ativo: dados.ativo ?? true,
        },
      });

      this.logger.log(`Webhook criado: ${webhook.id}`);
      return webhook;
    } catch (erro) {
      this.logger.error('Erro ao registrar webhook:', erro);
      throw erro;
    }
  }

  /**
   * Atualiza um webhook existente.
   */
  async atualizarWebhook(
    tenantId: string,
    webhookId: string,
    dados: Partial<ConfiguracaoWebhookData>,
  ): Promise<any> {
    try {
      const webhook = await this.prisma.configuracaoWebhook.update({
        where: { id: webhookId },
        data: {
          ...(dados.nome && { nome: dados.nome }),
          ...(dados.url && { url: dados.url }),
          ...(dados.eventos && { eventos: dados.eventos }),
          ...(dados.segredo !== undefined && { segredo: dados.segredo }),
          ...(dados.ativo !== undefined && { ativo: dados.ativo }),
        },
      });

      this.logger.log(`Webhook atualizado: ${webhookId}`);
      return webhook;
    } catch (erro) {
      this.logger.error('Erro ao atualizar webhook:', erro);
      throw erro;
    }
  }

  /**
   * Lista webhooks de um tenant.
   */
  async listarWebhooks(tenantId: string): Promise<any[]> {
    try {
      const webhooks = await this.prisma.configuracaoWebhook.findMany({
        where: { tenantId },
        orderBy: { criadoEm: 'desc' },
      });

      return webhooks;
    } catch (erro) {
      this.logger.error('Erro ao listar webhooks:', erro);
      throw erro;
    }
  }

  /**
   * Obtém um webhook específico.
   */
  async obterWebhook(tenantId: string, webhookId: string): Promise<any> {
    try {
      const webhook = await this.prisma.configuracaoWebhook.findUnique({
        where: { id: webhookId },
      });

      if (!webhook || webhook.tenantId !== tenantId) {
        throw new Error('Webhook não encontrado');
      }

      return webhook;
    } catch (erro) {
      this.logger.error('Erro ao obter webhook:', erro);
      throw erro;
    }
  }

  /**
   * Desativa um webhook.
   */
  async desativarWebhook(tenantId: string, webhookId: string): Promise<any> {
    try {
      const webhook = await this.prisma.configuracaoWebhook.update({
        where: { id: webhookId },
        data: { ativo: false },
      });

      this.logger.log(`Webhook desativado: ${webhookId}`);
      return webhook;
    } catch (erro) {
      this.logger.error('Erro ao desativar webhook:', erro);
      throw erro;
    }
  }

  /**
   * Obtém histórico de envios de um webhook.
   */
  async obterHistoricoWebhook(
    tenantId: string,
    webhookId: string,
    limite: number = 50,
  ): Promise<any[]> {
    try {
      const historico = await this.prisma.historicoWebhook.findMany({
        where: {
          tenantId,
          webhookId,
        },
        orderBy: { criadoEm: 'desc' },
        take: limite,
      });

      return historico;
    } catch (erro) {
      this.logger.error('Erro ao obter histórico webhook:', erro);
      throw erro;
    }
  }

  /**
   * Aguarda um tempo em milissegundos.
   */
  private aguardar(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
