/**
 * DTO para atualização de depósito (armazém/centro de distribuição).
 * Todos os campos são opcionais (atualização parcial).
 */

import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarDepositoDto {
  @ApiPropertyOptional({ description: 'Nome do depósito', example: 'Depósito São Paulo' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @ApiPropertyOptional({ description: 'Endereço completo', example: 'Rua X, 123 - Osasco/SP' })
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiPropertyOptional({ description: 'Cidade', example: 'São Paulo' })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiPropertyOptional({ description: 'Estado (UF)', example: 'SP' })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ description: 'Definir como depósito padrão do tenant' })
  @IsOptional()
  @IsBoolean()
  padrao?: boolean;

  @ApiPropertyOptional({ description: 'Ativar/desativar o depósito' })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
