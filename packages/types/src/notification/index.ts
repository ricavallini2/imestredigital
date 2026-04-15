/**
 * Tipos do domínio de Notificações.
 * Define canais, templates e configurações de envio.
 */

import { BaseEntity, EntityId } from '../common';

/** Canal de notificação */
export enum CanalNotificacao {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  WEBHOOK = 'webhook',
  WHATSAPP = 'whatsapp',
}

/** Status de envio */
export enum StatusNotificacao {
  PENDENTE = 'pendente',
  ENVIADA = 'enviada',
  ENTREGUE = 'entregue',
  FALHA = 'falha',
  LIDA = 'lida',
}

/** Notificação enviada */
export interface Notificacao extends BaseEntity {
  tenantId: EntityId;
  canal: CanalNotificacao;
  destinatario: string;
  assunto?: string;
  conteudo: string;
  status: StatusNotificacao;
  tentativas: number;
  ultimaTentativa?: Date;
  templateId?: string;
  dadosTemplate?: Record<string, unknown>;
}
