/**
 * DTO para registro de nova empresa + administrador.
 * Valida todos os dados necessários para criar um tenant.
 */

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrarDto {
  @ApiProperty({ description: 'Nome completo do administrador', example: 'Ricardo Cavallini' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  nome!: string;

  @ApiProperty({ description: 'Email de acesso', example: 'ricardo@imestredigital.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email!: string;

  @ApiProperty({ description: 'Senha de acesso (mínimo 8 caracteres)', example: 'MinhaSenh@123' })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'A senha deve conter letras maiúsculas, minúsculas e números',
  })
  senha!: string;

  @ApiProperty({ description: 'Nome da empresa', example: 'Loja Digital LTDA' })
  @IsString()
  @IsNotEmpty({ message: 'O nome da empresa é obrigatório' })
  nomeEmpresa!: string;

  @ApiPropertyOptional({ description: 'CNPJ da empresa (14 dígitos)', example: '12345678000190' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos numéricos' })
  cnpj?: string;

  @ApiPropertyOptional({ description: 'Telefone de contato', example: '11999998888' })
  @IsOptional()
  @IsString()
  telefone?: string;
}
