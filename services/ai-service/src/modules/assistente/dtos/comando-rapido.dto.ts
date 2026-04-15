/**
 * DTO para comando rápido (sem histórico de conversa)
 */

import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ComandoRapidoDTO {
  @ApiProperty({
    description: 'Comando em linguagem natural',
    example: 'Qual foi meu faturamento de hoje?',
  })
  @IsString()
  comando: string;

  @ApiProperty({
    description: 'Contexto adicional para o comando',
    example: { dataConsulta: '2024-03-23' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  contexto?: Record<string, any>;
}
