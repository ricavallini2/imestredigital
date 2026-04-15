/**
 * Serviço Central de Notificações.
 *
 * Orquestra o envio de notificações através de vários canais,
 * respeitando as preferências do usuário e gerenciando o status.
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { EmailService } from '../email/email.service';
import { PushService } from '../push/push.service';
import { WebhookService } from '../webhook/webhook.service';
import { CriarNotificacaoDto, TipoNotificacao } from '../../dtos/criar-notificacao.dto';

interface DesdeWhere {
  tenantId: string;
  destinatarioId?: string;
  status?: string;
  tipo?: string;
}

@Injectable()
export class NotificacaoService {
  private readonly logger = new Logger(NotificacaoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly email: EmailService,
    private readonly push: PushService,
    private readonly webhook: WebhookService,
  ) {}

  /**
   * Cria e envia uma nova notificação.
   */
  async criarNotificacao(
    tenantId: string,
    dto: CriarNotificacaoDto,
  ): Promise<any> {
    try {
      // Verifica preferências do usuário
      if (dto.destinatarioId) {
        const preferenciasDesabilitadas = await this.verificarPreferencias(
          tenantId,
          dto.destinatarioId,
          dto.tipo,
        );

        if (preferenciasDesabilitadas) {
          this.logger.log(
            `Notificação não enviada: preferências do usuário desabilitam ${dto.tipo}`,
          );
          return {
            aviso: 'Notificação não enviada: preferências do usuário desabilitam este canal',
          };
        }
      }

      // Cria registro no banco
      const notificacao = await this.prisma.notificacao.create({
        data: {
          tenantId,
          tipo: dto.tipo,
          titulo: dto.titulo,
          mensagem: dto.mensagem,
          destinatarioId: dto.destinatarioId,
          destinatarioEmail: dto.destinatarioEmail,
          status: 'PENDENTE',
          prioridade: dto.prioridade || 'NORMAL',
          metadata: dto.metadata || {},
        },
      });

      // Dispara envio assíncrono (em produção, seria uma fila/job)
      this.dispararNotificacao(tenantId, notificacao).catch((erro) => {
        this.logger.error(`Erro ao disparar notificação ${notificacao.id}:`, erro);
      });

      return notificacao;
    } catch (erro) {
      this.logger.error('Erro ao criar notificação:', erro);
      throw erro;
    }
  }

  /**
   * Verifica as preferências de notificação do usuário.
   */
  private async verificarPreferencias(
    tenantId: string,
    usuarioId: string,
    tipo: string,
  ): Promise<boolean> {
    try {
      const chaveCache = `preferencias:${tenantId}:${usuarioId}:${tipo}`;

      // Tenta buscar do cache
      const cacheado = await this.cache.obter<boolean>(chaveCache);
      if (cacheado !== undefined) {
        return cacheado;
      }

      // Busca do banco
      const preferencia = await this.prisma.preferenciaNotificacao.findFirst({
        where: {
          tenantId,
          usuarioId,
          tipoEvento: tipo,
        },
      });

      const desabilitada = preferencia ? !preferencia.habilitado : false;

      // Armazena no cache por 1 hora
      await this.cache.armazenar(chaveCache, desabilitada, 3600);

      return desabilitada;
    } catch (erro) {
      this.logger.error('Erro ao verificar preferências:', erro);
      return false;
    }
  }

  /**
   * Dispara a notificação através do canal apropriado.
   */
  private async dispararNotificacao(
    tenantId: string,
    notificacao: any,
  ): Promise<void> {
    try {
      await this.prisma.notificacao.update({
        where: { id: notificacao.id },
        data: { status: 'ENVIANDO' },
      });

      switch (notificacao.tipo) {
        case TipoNotificacao.EMAIL:
          await this.email.enviarEmail(tenantId, {
            destinatario: notificacao.destinatarioEmail || '',
            assunto: notificacao.titulo,
            corpo: notificacao.mensagem,
          });
          break;

        case TipoNotificacao.PUSH:
          if (notificacao.destinatarioId) {
            await this.push.enviarPush(
              tenantId,
              notificacao.destinatarioId,
              notificacao.titulo,
              notificacao.mensagem,
              notificacao.metadata,
            );
          }
          break;

        case TipoNotificacao.WEBHOOK:
          await this.webhook.dispararWebhook(
            tenantId,
            notificacao.metadata?.evento || 'notificacao.enviada',
            {
              notificacaoId: notificacao.id,
              titulo: notificacao.titulo,
              mensagem: notificacao.mensagem,
              ...notificacao.metadata,
            },
          );
          break;

        case TipoNotificacao.INTERNA:
          // Notificação interna apenas registra no banco (já feito acima)
          break;

        default:
          this.logger.warn(`Tipo de notificação desconhecido: ${notificacao.tipo}`);
      }

      // Marca como enviada
      await this.prisma.notificacao.update({
        where: { id: notificacao.id },
        data: {
          status: 'ENVIADA',
          enviadaEm: new Date(),
        },
      });
    } catch (erro) {
      this.logger.error(`Erro ao disparar notificação ${notificacao.id}:`, erro);

      // Registra falha
      await this.prisma.notificacao.update({
        where: { id: notificacao.id },
        data: {
          status: 'FALHA',
          erroMensagem: (erro as any)?.message || 'Erro desconhecido',
          tentativas: (notificacao.tentativas || 0) + 1,
          ultimaTentativa: new Date(),
        },
      });
    }
  }

  /**
   * Lista notificações de um usuário.
   */
  async listarNotificacoes(
    tenantId: string,
    usuarioId: string,
    filtros?: {
      status?: string;
      tipo?: string;
      pagina?: number;
      limite?: number;
    },
  ): Promise<{ dados: any[]; total: number }> {
    try {
      const where: DesdeWhere = {
        tenantId,
        destinatarioId: usuarioId,
      };

      if (filtros?.status) where.status = filtros.status;
      if (filtros?.tipo) where.tipo = filtros.tipo;

      const total = await this.prisma.notificacao.count({ where });

      const pagina = filtros?.pagina || 1;
      const limite = filtros?.limite || 20;
      const skip = (pagina - 1) * limite;

      const dados = await this.prisma.notificacao.findMany({
        where,
        skip,
        take: limite,
        orderBy: { criadoEm: 'desc' },
      });

      return { dados, total };
    } catch (erro) {
      this.logger.error('Erro ao listar notificações:', erro);
      throw erro;
    }
  }

  /**
   * Marca uma notificação como lida.
   */
  async marcarComoLida(
    tenantId: string,
    notificacaoId: string,
    usuarioId: string,
  ): Promise<any> {
    try {
      const notificacao = await this.prisma.notificacao.update({
        where: { id: notificacaoId },
        data: {
          status: 'LIDA',
          lidaEm: new Date(),
        },
      });

      // Limpa cache de não lidas
      await this.cache.remover(`nao_lidas:${tenantId}:${usuarioId}`);

      return notificacao;
    } catch (erro) {
      this.logger.error('Erro ao marcar notificação como lida:', erro);
      throw erro;
    }
  }

  /**
   * Marca todas as notificações de um usuário como lidas.
   */
  async marcarTodasComoLidas(
    tenantId: string,
    usuarioId: string,
  ): Promise<{ atualizadas: number }> {
    try {
      const resultado = await this.prisma.notificacao.updateMany({
        where: {
          tenantId,
          destinatarioId: usuarioId,
          status: { not: 'LIDA' },
        },
        data: {
          status: 'LIDA',
          lidaEm: new Date(),
        },
      });

      // Limpa cache
      await this.cache.remover(`nao_lidas:${tenantId}:${usuarioId}`);

      return { atualizadas: resultado.count };
    } catch (erro) {
      this.logger.error('Erro ao marcar todas como lidas:', erro);
      throw erro;
    }
  }

  /**
   * Conta notificações não lidas de um usuário.
   */
  async contarNaoLidas(tenantId: string, usuarioId: string): Promise<number> {
    try {
      const chaveCache = `nao_lidas:${tenantId}:${usuarioId}`;

      // Tenta buscar do cache
      const cacheado = await this.cache.obter<number>(chaveCache);
      if (cacheado !== undefined) {
        return cacheado;
      }

      // Busca do banco
      const total = await this.prisma.notificacao.count({
        where: {
          tenantId,
          destinatarioId: usuarioId,
          status: { not: 'LIDA' },
        },
      });

      // Armazena no cache por 5 minutos
      await this.cache.armazenar(chaveCache, total, 300);

      return total;
    } catch (erro) {
      this.logger.error('Erro ao contar não lidas:', erro);
      return 0;
    }
  }

  /**
   * Obtém as preferências de notificação de um usuário.
   */
  async obterPreferencias(
    tenantId: string,
    usuarioId: string,
  ): Promise<any[]> {
    try {
      const preferencias = await this.prisma.preferenciaNotificacao.findMany({
        where: {
          tenantId,
          usuarioId,
        },
      });

      return preferencias;
    } catch (erro) {
      this.logger.error('Erro ao obter preferências:', erro);
      throw erro;
    }
  }

  /**
   * Atualiza as preferências de notificação de um usuário.
   */
  async atualizarPreferencias(
    tenantId: string,
    usuarioId: string,
    preferencias: Array<{
      canal: string;
      tipoEvento: string;
      habilitado: boolean;
    }>,
  ): Promise<any[]> {
    try {
      // Deleta preferências antigas
      await this.prisma.preferenciaNotificacao.deleteMany({
        where: {
          tenantId,
          usuarioId,
        },
      });

      // Cria novas
      const novasPreferencias = await Promise.all(
        preferencias.map((pref) =>
          this.prisma.preferenciaNotificacao.create({
            data: {
              tenantId,
              usuarioId,
              canal: pref.canal,
              tipoEvento: pref.tipoEvento,
              habilitado: pref.habilitado,
            },
          }),
        ),
      );

      // Limpa cache
      const tiposeventos = [...new Set(preferencias.map((p) => p.tipoEvento))];
      for (const tipo of tiposeventos) {
        await this.cache.remover(`preferencias:${tenantId}:${usuarioId}:${tipo}`);
      }

      this.logger.log(`Preferências atualizadas para usuário ${usuarioId}`);
      return novasPreferencias;
    } catch (erro) {
      this.logger.error('Erro ao atualizar preferências:', erro);
      throw erro;
    }
  }
}
