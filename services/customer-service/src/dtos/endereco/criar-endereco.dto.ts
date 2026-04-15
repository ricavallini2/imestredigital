/**
 * DTO para criação de endereço de cliente
 */

import { IsString, IsNotEmpty, IsOptional, IsEnum, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TipoEnderecoEnum {
  ENTREGA = 'ENTREGA',
  COBRANCA = 'COBRANCA',
  AMBOS = 'AMBOS',
}

export class CriarEnderecoDto {
  @ApiProperty({
    description: 'Tipo de endereço',
    enum: TipoEnderecoEnum,
    example: 'ENTREGA',
  })
  @IsEnum(TipoEnderecoEnum, { message: 'Tipo de endereço inválido' })
  @IsNotEmpty()
  tipo: TipoEnderecoEnum;

  @ApiProperty({
    description: 'Logradouro (rua, avenida, etc)',
    example: 'Rua das Flores',
  })
  @IsString()
  @IsNotEmpty()
  logradouro: string;

  @ApiProperty({
    description: 'Número do imóvel',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiPropertyOptional({
    description: 'Complemento (apto, sala, etc)',
    example: 'Apto 456',
  })
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Vila Mariana',
  })
  @IsString()
  @IsNotEmpty()
  bairro: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsString()
  @IsNotEmpty()
  cidade: string;

  @ApiProperty({
    description: 'Estado (UF com 2 caracteres)',
    example: 'SP',
  })
  @Matches(/^[A-Z]{2}$/, { message: 'Estado deve ser uma UF válida (ex: SP)' })
  @IsNotEmpty()
  estado: string;

  @ApiProperty({
    description: 'CEP (8 dígitos sem formatação)',
    example: '01310100',
  })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos' })
  @IsNotEmpty()
  cep: string;

  @ApiPropertyOptional({
    description: 'País (padrão: BR)',
    example: 'BR',
  })
  @IsOptional()
  @IsString()
  pais?: string = 'BR';

  @ApiPropertyOptional({
    description: 'Definir como endereço padrão',
    example: false,
  })
  @IsOptional()
  padrao?: boolean = false;
}
