/**
 * DTO para iniciação de conversa
 */

import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IniciarConversaDTO {
  @ApiProperty({
    description: 'Título/tópico da conversa',
    example: 'Análise de estoque de produtos',
  })
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'Contexto inicial (módulo ativo, dados relevantes)',
    example: {
      modulo: 'estoque',
      produtoId: 'prod-123',
      dadosRelevantes: { estoque: 50, vendiaMedia: 10 },
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  contexto?: Record<string, any>;
}
