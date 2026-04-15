/**
 * DTO para filtrar lançamentos financeiros.
 */

import { IsString, IsDateString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FiltroLancamentoDTO {
  @ApiProperty({
    description: 'Tipo do lançamento',
    enum: ['RECEITA', 'DESPESA', 'TRANSFERENCIA'],
    required: false,
  })
  @IsEnum(['RECEITA', 'DESPESA', 'TRANSFERENCIA'])
  @IsOptional()
  tipo?: string;

  @ApiProperty({
    description: 'Status do lançamento',
    enum: ['PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO'],
    required: false,
  })
  @IsEnum(['PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO'])
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'ID da conta financeira',
    required: false,
  })
  @IsString()
  @IsOptional()
  contaId?: string;

  @ApiProperty({
    description: 'Categoria do lançamento',
    required: false,
  })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({
    description: 'Data inicial (ISO 8601)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dataInicio?: string;

  @ApiProperty({
    description: 'Data final (ISO 8601)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dataFim?: string;

  @ApiProperty({
    description: 'Número da página (padrão: 1)',
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  pagina?: number;

  @ApiProperty({
    description: 'Limite de registros por página (padrão: 20, máx: 100)',
    required: false,
    example: 20,
  })
  @IsNumber()
  @IsOptional()
  limite?: number;
}
