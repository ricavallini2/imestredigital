/**
 * DTO para criação de notificação.
 */

import {
  IsString,
  IsUUID,
  IsEmail,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TipoNotificacao {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS',
  WEBHOOK = 'WEBHOOK',
  INTERNA = 'INTERNA',
}

export enum PrioridadeNotificacao {
  BAIXA = 'BAIXA',
  NORMAL = 'NORMAL',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}

export class CriarNotificacaoDto {
  @ApiProperty({
    description: 'Tipo da notificação',
    enum: TipoNotificacao,
    example: TipoNotificacao.EMAIL,
  })
  @IsEnum(TipoNotificacao)
  tipo: TipoNotificacao;

  @ApiProperty({
    description: 'Título da notificação',
    example: 'Seu pedido foi confirmado',
  })
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'Mensagem da notificação',
    example: 'Seu pedido #123 foi confirmado. Entrega prevista em 5 dias.',
  })
  @IsString()
  mensagem: string;

  @ApiProperty({
    description: 'ID do usuário destinatário',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  destinatarioId?: string;

  @ApiProperty({
    description: 'Email do destinatário (se não tiver ID)',
    example: 'usuario@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  destinatarioEmail?: string;

  @ApiProperty({
    description: 'Nível de prioridade',
    enum: PrioridadeNotificacao,
    example: PrioridadeNotificacao.NORMAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(PrioridadeNotificacao)
  prioridade?: PrioridadeNotificacao;

  @ApiProperty({
    description: 'Metadados customizados',
    example: { pedidoId: '123', cliente: 'João Silva' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
