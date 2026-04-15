/**
 * DTO para criação de conta financeira.
 */

import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarContaDTO {
  @ApiProperty({
    description: 'Nome da conta',
    example: 'Conta Corrente Principal',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Tipo de conta',
    enum: ['CORRENTE', 'POUPANCA', 'CAIXA', 'CARTAO', 'DIGITAL'],
  })
  @IsEnum(['CORRENTE', 'POUPANCA', 'CAIXA', 'CARTAO', 'DIGITAL'])
  tipo: string;

  @ApiProperty({
    description: 'Banco (nome ou código)',
    example: 'Banco do Brasil',
    required: false,
  })
  @IsString()
  @IsOptional()
  banco?: string;

  @ApiProperty({
    description: 'Número da agência',
    example: '0001',
    required: false,
  })
  @IsString()
  @IsOptional()
  agencia?: string;

  @ApiProperty({
    description: 'Número da conta',
    example: '12345678-9',
    required: false,
  })
  @IsString()
  @IsOptional()
  conta?: string;

  @ApiProperty({
    description: 'Saldo inicial',
    example: 5000.00,
  })
  @IsNumber()
  saldoInicial: number;

  @ApiProperty({
    description: 'Cor para exibição (hex)',
    example: '#3B82F6',
    required: false,
  })
  @IsString()
  @IsOptional()
  cor?: string;

  @ApiProperty({
    description: 'Ícone para exibição',
    example: 'bank',
    required: false,
  })
  @IsString()
  @IsOptional()
  icone?: string;
}
