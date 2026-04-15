/**
 * DTO para criação de segmento de cliente
 */

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarSegmentoDto {
  @ApiProperty({
    description: 'Nome do segmento',
    example: 'Clientes VIP',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional({
    description: 'Descrição do segmento',
    example: 'Clientes que gastaram mais de R$50.000 nos últimos 12 meses',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Regras de filtro em JSON',
    example: {
      valorMinimo: 50000,
      periodo: 12,
      unidade: 'meses',
      status: ['ATIVO'],
    },
  })
  @IsNotEmpty()
  regras: Record<string, any>;
}
