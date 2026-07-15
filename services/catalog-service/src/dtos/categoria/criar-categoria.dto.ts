/**
 * DTO para criação de categoria.
 *
 * O slug é derivado do nome automaticamente no service (não é aceito na
 * entrada). O nível na árvore é calculado a partir da categoria pai.
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CriarCategoriaDto {
  @ApiProperty({ description: 'Nome da categoria', example: 'Eletrônicos' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome: string

  @ApiPropertyOptional({
    description: 'ID da categoria pai (para hierarquia). Ausente = categoria raiz.',
    example: '30000000-0000-0000-0000-000000000001',
  })
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, { message: 'O ID da categoria pai deve ser um UUID válido' })
  categoriaPaiId?: string

  @ApiPropertyOptional({ description: 'Se a categoria está ativa', default: true })
  @IsOptional()
  @IsBoolean()
  ativa?: boolean
}
