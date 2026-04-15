/**
 * DTO para criar/convidar um novo usuário ao tenant.
 */

import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CargoUsuario {
  ADMIN = 'admin',
  GERENTE = 'gerente',
  OPERADOR = 'operador',
  VISUALIZADOR = 'visualizador',
}

export class CriarUsuarioDto {
  @ApiProperty({ description: 'Nome completo', example: 'Maria Silva' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Email do novo usuário', example: 'maria@empresa.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Cargo/permissão', enum: CargoUsuario, default: 'operador' })
  @IsOptional()
  @IsEnum(CargoUsuario, { message: 'Cargo inválido' })
  cargo?: string;
}
