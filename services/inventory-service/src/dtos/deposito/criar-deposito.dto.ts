/**
 * DTO para criação de depósito (armazém/centro de distribuição).
 */

import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarDepositoDto {
  @ApiProperty({ description: 'Nome do depósito', example: 'Depósito São Paulo' })
  @IsString()
  @IsNotEmpty()
  nome: string;

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

  @ApiPropertyOptional({ description: 'Definir como depósito padrão do tenant', default: false })
  @IsOptional()
  @IsBoolean()
  padrao?: boolean;
}
