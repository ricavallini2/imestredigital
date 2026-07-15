/**
 * DTO para criação de marca.
 *
 * O slug é derivado do nome automaticamente no service (não é aceito na entrada).
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CriarMarcaDto {
  @ApiProperty({ description: 'Nome da marca', example: 'TechBrand' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome: string

  @ApiPropertyOptional({ description: 'URL do logotipo da marca' })
  @IsOptional()
  @IsUrl({}, { message: 'O logo deve ser uma URL válida' })
  @MaxLength(500)
  logoUrl?: string

  @ApiPropertyOptional({ description: 'Se a marca está ativa', default: true })
  @IsOptional()
  @IsBoolean()
  ativa?: boolean
}
