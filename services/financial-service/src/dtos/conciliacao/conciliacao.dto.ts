/**
 * DTOs para operações de Conciliação Bancária.
 */

import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IniciarConciliacaoDTO {
  @ApiProperty({
    description: 'ID da conta a conciliar',
    example: 'uuid-aqui',
  })
  @IsString()
  contaId: string;

  @ApiProperty({
    description: 'Data inicial do período (ISO 8601)',
    example: '2026-03-01',
  })
  @IsDateString()
  dataInicio: string;

  @ApiProperty({
    description: 'Data final do período (ISO 8601)',
    example: '2026-03-31',
  })
  @IsDateString()
  dataFim: string;

  @ApiProperty({
    description: 'Saldo inicial do extrato bancário',
    example: 10000.00,
  })
  @IsNumber()
  saldoInicial: number;

  @ApiProperty({
    description: 'Saldo final do extrato bancário',
    example: 12500.50,
  })
  @IsNumber()
  saldoFinal: number;
}

export class ImportarExtratoDTO {
  @ApiProperty({
    description: 'ID da conciliação',
  })
  @IsString()
  conciliacaoId: string;

  @ApiProperty({
    description: 'Arquivo do extrato (OFX ou CSV)',
    required: false,
  })
  @IsOptional()
  arquivo?: any;
}
