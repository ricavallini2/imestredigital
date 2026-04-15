/**
 * Serviço de Email.
 *
 * Responsável por enviar notificações por email usando SMTP/Nodemailer.
 * Suporta templates Handlebars, tentativas com backoff exponencial
 * e rastreamento de status.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import { PrismaService } from '../prisma/prisma.service';

interface ConfiguracaoEmail {
  destinatario: string;
  assunto: string;
  corpo: string;
  cc?: string[];
  bcc?: string[];
}

interface EnviarComTemplateOpcoes {
  destinatario: string;
  templateSlug: string;
  variaveisTemplate: Record<string, any>;
  cc?: string[];
  bcc?: string[];
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private tentativasMaximas = 3;
  private delayInicialMs = 1000;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.inicializarTransporter();
  }

  /**
   * Inicializa o transportador SMTP do Nodemailer.
   */
  private inicializarTransporter() {
    const smtpHost = this.configService.get('SMTP_HOST');
    const smtpPort = this.configService.get('SMTP_PORT');
    const smtpUser = this.configService.get('SMTP_USER');
    const smtpPass = this.configService.get('SMTP_PASS');

    if (!smtpHost || !smtpUser || !smtpPass) {
      this.logger.warn('SMTP não configurado. Usando modo mockado para desenvolvimento.');
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort || 587,
      secure: (smtpPort || 587) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  /**
   * Envia um email simples.
   */
  async enviarEmail(
    tenantId: string,
    config: ConfiguracaoEmail,
  ): Promise<string> {
    try {
      const remetente = this.configService.get('SMTP_FROM');

      if (!this.transporter) {
        this.logger.log(`[MOCK] Email para ${config.destinatario}: ${config.assunto}`);
        return 'mock-id-' + Math.random().toString(36).substr(2, 9);
      }

      const informacoes = await this.transporter.sendMail({
        from: remetente,
        to: config.destinatario,
        cc: config.cc,
        bcc: config.bcc,
        subject: config.assunto,
        html: config.corpo,
      });

      this.logger.log(`Email enviado para ${config.destinatario}. Message ID: ${informacoes.messageId}`);
      return informacoes.messageId || 'email-enviado';
    } catch (erro) {
      this.logger.error(`Erro ao enviar email para ${config.destinatario}:`, erro);
      throw erro;
    }
  }

  /**
   * Envia email usando um template com variáveis.
   */
  async enviarComTemplate(
    tenantId: string,
    opcoes: EnviarComTemplateOpcoes,
  ): Promise<string> {
    try {
      // Busca o template no banco
      const template = await this.prisma.templateNotificacao.findUnique({
        where: {
          tenantId_slug: {
            tenantId,
            slug: opcoes.templateSlug,
          },
        },
      });

      if (!template) {
        throw new Error(`Template ${opcoes.templateSlug} não encontrado`);
      }

      // Compila o template Handlebars
      const templateCompilado = Handlebars.compile(template.conteudo);
      const conteudoFinal = templateCompilado(opcoes.variaveisTemplate);

      // Compila o assunto (se existir)
      let assuntoFinal = template.assunto || '';
      if (assuntoFinal) {
        const assuntoCompilado = Handlebars.compile(assuntoFinal);
        assuntoFinal = assuntoCompilado(opcoes.variaveisTemplate);
      }

      return this.enviarEmail(tenantId, {
        destinatario: opcoes.destinatario,
        assunto: assuntoFinal,
        corpo: conteudoFinal,
        cc: opcoes.cc,
        bcc: opcoes.bcc,
      });
    } catch (erro) {
      this.logger.error(
        `Erro ao enviar email com template ${opcoes.templateSlug}:`,
        erro,
      );
      throw erro;
    }
  }

  /**
   * Envia emails em massa para múltiplos destinatários.
   */
  async enviarEmMassa(
    tenantId: string,
    destinatarios: string[],
    assunto: string,
    corpo: string,
  ): Promise<{ sucesso: number; falhas: number }> {
    let sucesso = 0;
    let falhas = 0;

    for (const destinatario of destinatarios) {
      try {
        await this.enviarEmail(tenantId, {
          destinatario,
          assunto,
          corpo,
        });
        sucesso++;
      } catch (erro) {
        this.logger.error(`Falha ao enviar para ${destinatario}:`, erro);
        falhas++;
      }
    }

    return { sucesso, falhas };
  }

  /**
   * Tenta enviar email com retry exponencial.
   */
  async enviarComRetry(
    tenantId: string,
    config: ConfiguracaoEmail,
    tentativa: number = 0,
  ): Promise<string> {
    try {
      return await this.enviarEmail(tenantId, config);
    } catch (erro) {
      if (tentativa < this.tentativasMaximas - 1) {
        const delayMs = this.delayInicialMs * Math.pow(2, tentativa);
        this.logger.warn(
          `Retry email para ${config.destinatario} em ${delayMs}ms (tentativa ${tentativa + 1}/${this.tentativasMaximas})`,
        );
        await this.aguardar(delayMs);
        return this.enviarComRetry(tenantId, config, tentativa + 1);
      }
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
