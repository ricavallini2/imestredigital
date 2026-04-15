/**
 * DTOs para operações de Fluxo de Caixa.
 */

import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FiltroFluxoCaixaDTO {
  @ApiProperty({
    description: 'Data inicial (ISO 8601)',
    example: '2026-03-01',
  })
  @IsDateString()
  dataInicio: string;

  @ApiProperty({
    description: 'Data final (ISO 8601)',
    example: '2026-03-31',
  })
  @IsDateString()
  dataFim: string;

  @ApiProperty({
    description: 'Número de meses para projetar (padrão: 6)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  mesesProjecao?: number;
}

export class ProjecaoFluxoCaixaDTO {
  @ApiProperty({
    description: 'Número de meses a projetar no futuro',
    example: 6,
  })
  @IsNumber()
  meses: number;
}
