/**
 * DTO para envio de push notification.
 */

import { IsString, IsUUID, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnviarPushDto {
  @ApiProperty({
    description: 'ID do usuário destinatário',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({
    description: 'Título da notificação',
    example: 'Novo pedido recebido',
  })
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'Corpo/mensagem da notificação',
    example: 'Você recebeu um novo pedido no valor de R$ 250,00',
  })
  @IsString()
  mensagem: string;

  @ApiProperty({
    description: 'Dados adicionais (payload)',
    example: { pedidoId: '123', acao: 'abrir_pedido' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  dados?: Record<string, any>;
}
