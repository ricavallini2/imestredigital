/**
 * DTO para atualização de dados do tenant.
 */

import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarTenantDto {
  @ApiPropertyOptional({ description: 'Nome da empresa' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'Email principal da empresa' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Telefone' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ description: 'Endereço completo' })
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiPropertyOptional({ description: 'Inscrição Estadual' })
  @IsOptional()
  @IsString()
  inscricaoEstadual?: string;
}
