/**
 * DTO para criação de um novo cliente
 *
 * Valida os dados necessários para criar um cliente
 * (pessoa física ou jurídica).
 */

import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TipoClienteEnum {
  PESSOA_FISICA = 'PESSOA_FISICA',
  PESSOA_JURIDICA = 'PESSOA_JURIDICA',
}

export class CriarClienteDto {
  @ApiProperty({
    description: 'Tipo de cliente',
    enum: TipoClienteEnum,
    example: 'PESSOA_FISICA',
  })
  @IsEnum(TipoClienteEnum, { message: 'Tipo de cliente inválido' })
  @IsNotEmpty()
  tipo: TipoClienteEnum;

  @ApiProperty({
    description: 'Nome completo (PF) ou nome fantasia (PJ)',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional({
    description: 'Nome fantasia (apenas para PESSOA_JURIDICA)',
    example: 'Silva Comércio Ltda',
  })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiPropertyOptional({
    description: 'Razão social (apenas para PESSOA_JURIDICA)',
    example: 'Silva Comércio de Produtos Eletrônicos Ltda',
  })
  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @ApiPropertyOptional({
    description: 'CPF sem formatação (apenas para PESSOA_FISICA)',
    example: '12345678901',
  })
  @IsOptional()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos' })
  cpf?: string;

  @ApiPropertyOptional({
    description: 'CNPJ sem formatação (apenas para PESSOA_JURIDICA)',
    example: '12345678000190',
  })
  @IsOptional()
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos' })
  cnpj?: string;

  @ApiPropertyOptional({
    description: 'Inscrição estadual (apenas para PESSOA_JURIDICA)',
    example: '123.456.789.012',
  })
  @IsOptional()
  @IsString()
  inscricaoEstadual?: string;

  @ApiProperty({
    description: 'Email principal',
    example: 'joao@exemplo.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'Email secundário',
    example: 'joao.secundario@exemplo.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email secundário inválido' })
  emailSecundario?: string;

  @ApiPropertyOptional({
    description: 'Telefone comercial',
    example: '1133334444',
  })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Celular/WhatsApp',
    example: '11999998888',
  })
  @IsOptional()
  @IsString()
  celular?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento (apenas PESSOA_FISICA)',
    example: '1990-05-15',
  })
  @IsOptional()
  dataNascimento?: Date;

  @ApiPropertyOptional({
    description: 'Gênero (M/F/O)',
    example: 'M',
  })
  @IsOptional()
  @Matches(/^[MFO]$/, { message: 'Gênero inválido (M, F ou O)' })
  genero?: string;

  @ApiPropertyOptional({
    description: 'Observações internas',
    example: 'Cliente VIP, excelente pagador',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Tags/categorias',
    example: ['vip', 'industria', 'sp'],
  })
  @IsOptional()
  tags?: string[];
}
