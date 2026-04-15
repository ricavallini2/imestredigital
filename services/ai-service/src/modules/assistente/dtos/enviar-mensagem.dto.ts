/**
 * DTO para envio de mensagem em conversa
 */

import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnviarMensagemDTO {
  @ApiProperty({
    description: 'Mensagem do usuário',
    example: 'Qual é o estoque atual do produto X?',
  })
  @IsString()
  mensagem: string;

  @ApiProperty({
    description: 'Contexto extra para esta mensagem específica',
    example: { produtoId: 'prod-123' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  contextoExtra?: Record<string, any>;
}
