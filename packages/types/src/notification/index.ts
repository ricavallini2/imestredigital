/**
 * Tipos do domínio de Notificações.
 * Define canais, templates, prioridades e status de envio.
 *
 * FONTE DA VERDADE: enums do schema Prisma do notification-service
 * (services/notification-service/prisma/schema.prisma). Todos os valores são
 * UPPERCASE_SNAKE e devem casar 1:1 com o Prisma e com os DTOs do serviço.
 */

import { BaseEntity, EntityId } from '../common';

/** Tipo/canal de entrega da notificação (Prisma: TipoNotificacao). */
export enum TipoNotificacao {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  WHATSAPP = 'WHATSAPP',
  WEBHOOK = 'WEBHOOK',
  INTERNA = 'INTERNA',
}

/** Canal de preferência de notificação (Prisma: CanalNotificacao). */
export enum CanalNotificacao {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  WHATSAPP = 'WHATSAPP',
  WEBHOOK = 'WEBHOOK',
  INTERNA = 'INTERNA',
}

/** Status de envio (Prisma: StatusNotificacao). */
export enum StatusNotificacao {
  PENDENTE = 'PENDENTE',
  ENVIADA = 'ENVIADA',
  ENTREGUE = 'ENTREGUE',
  FALHA = 'FALHA',
  LIDA = 'LIDA',
}

/** Prioridade da notificação (Prisma: PrioridadeNotificacao). */
export enum PrioridadeNotificacao {
  BAIXA = 'BAIXA',
  NORMAL = 'NORMAL',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}

/** Tipo de template de notificação (Prisma: TipoTemplateNotificacao). */
export enum TipoTemplateNotificacao {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  INTERNA = 'INTERNA',
}

/** Notificação enviada ou a ser enviada a um usuário. */
export interface Notificacao extends BaseEntity {
  tenantId: EntityId;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  canal?: CanalNotificacao;
  destinatarioId?: EntityId;
  destinatarioEmail?: string;
  status: StatusNotificacao;
  prioridade: PrioridadeNotificacao;
  metadata?: Record<string, unknown>;
  tentativas: number;
  ultimaTentativa?: string;
  enviadaEm?: string;
  lidaEm?: string;
  erroMensagem?: string;
}

/** Template reutilizável de notificação (Handlebars). */
export interface TemplateNotificacao extends BaseEntity {
  tenantId: EntityId;
  nome: string;
  slug: string;
  tipo: TipoTemplateNotificacao;
  assunto?: string;
  conteudo: string;
  variaveis: string[];
  ativo: boolean;
}

/** Preferência de notificação de um usuário por canal/evento. */
export interface PreferenciaNotificacao extends BaseEntity {
  tenantId: EntityId;
  usuarioId: EntityId;
  canal: CanalNotificacao;
  tipoEvento: string;
  habilitado: boolean;
}
