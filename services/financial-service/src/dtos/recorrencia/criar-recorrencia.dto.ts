/**
 * DTO para criação de recorrência financeira.
 */

import { IsString, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarRecorrenciaDTO {
  @ApiProperty({
    description: 'Descrição da recorrência',
    example: 'Aluguel do escritório',
  })
  @IsString()
  descricao: string;

  @ApiProperty({
    description: 'Tipo de lançamento',
    enum: ['RECEITA', 'DESPESA'],
  })
  @IsEnum(['RECEITA', 'DESPESA'])
  tipo: string;

  @ApiProperty({
    description: 'Categoria do lançamento',
    example: 'aluguel',
  })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({
    description: 'Valor em reais',
    example: 3000.00,
  })
  @IsNumber()
  valor: number;

  @ApiProperty({
    description: 'ID da conta financeira',
    required: false,
  })
  @IsString()
  @IsOptional()
  contaId?: string;

  @ApiProperty({
    description: 'Frequência da recorrência',
    enum: ['DIARIA', 'SEMANAL', 'QUINZENAL', 'MENSAL', 'BIMESTRAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'],
  })
  @IsEnum(['DIARIA', 'SEMANAL', 'QUINZENAL', 'MENSAL', 'BIMESTRAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'])
  frequencia: string;

  @ApiProperty({
    description: 'Dia do mês para vencimento (1-31)',
    example: 5,
    required: false,
  })
  @IsOptional()
  diaVencimento?: number;

  @ApiProperty({
    description: 'Data da próxima geração de lançamento (ISO 8601)',
    example: '2026-04-05',
  })
  @IsDateString()
  proximaGeracao: string;
}
