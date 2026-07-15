/**
 * DTO para criação de grade de tamanhos.
 *
 * A grade agrupa uma lista ORDENADA de tamanhos. A ordem de envio no array
 * `tamanhos` é preservada (campo `ordem` no banco), pois a sequência de varejo
 * nem sempre é ordenável (ex: PP, P, M, G, GG).
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  ArrayMaxSize,
  MinLength,
  MaxLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CriarGradeDto {
  @ApiProperty({ description: 'Nome da grade', example: 'Camiseta' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome: string

  @ApiPropertyOptional({ description: 'Descrição livre da grade' })
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'A descrição deve ter no máximo 300 caracteres' })
  descricao?: string

  @ApiPropertyOptional({ description: 'Se a grade está ativa', default: true })
  @IsOptional()
  @IsBoolean()
  ativa?: boolean

  @ApiProperty({
    description: 'Tamanhos na ordem de exibição (ex: PP, P, M, G, GG)',
    example: ['PP', 'P', 'M', 'G', 'GG'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Informe pelo menos um tamanho' })
  @ArrayMaxSize(200, { message: 'A grade suporta no máximo 200 tamanhos' })
  @IsString({ each: true, message: 'Cada tamanho deve ser um texto' })
  tamanhos: string[]
}
