/**
 * DTO para parcelar um lançamento financeiro.
 */

import { IsNumber, IsDateString, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParcelarLancamentoDTO {
  @ApiProperty({
    description: 'Número de parcelas',
    example: 3,
  })
  @IsNumber()
  numeroParcelas: number;

  @ApiProperty({
    description: 'Data de vencimento da primeira parcela (ISO 8601)',
    example: '2026-04-30',
  })
  @IsDateString()
  dataInicioVencimento: string;

  @ApiProperty({
    description: 'Intervalo entre parcelas',
    enum: ['SEMANAL', 'QUINZENAL', 'MENSAL'],
    example: 'MENSAL',
  })
  @IsEnum(['SEMANAL', 'QUINZENAL', 'MENSAL'])
  intervalo: string;
}
