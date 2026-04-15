/**
 * DTO para geração de DRE.
 */

import { IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GerarDreDTO {
  @ApiProperty({
    description: 'Mês para o qual gerar a DRE (1-12)',
    example: 3,
  })
  @IsNumber()
  mes: number;

  @ApiProperty({
    description: 'Ano para o qual gerar a DRE',
    example: 2026,
  })
  @IsNumber()
  ano: number;

  @ApiProperty({
    description: 'Período do relatório',
    enum: ['MENSAL', 'TRIMESTRAL', 'ANUAL'],
    required: false,
  })
  @IsEnum(['MENSAL', 'TRIMESTRAL', 'ANUAL'])
  @IsOptional()
  periodo?: string;
}
