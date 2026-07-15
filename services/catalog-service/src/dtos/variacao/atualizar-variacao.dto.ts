/**
 * DTO para atualização de UMA variação (PUT :id/variacoes/:variacaoId).
 *
 * Todos os campos são opcionais (atualização parcial). Quando `atributos` é
 * informado, a lista substitui integralmente os atributos atuais da variação.
 */

import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
  Min,
  MaxLength,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

import { AtributoVariacaoDto } from './atributo-variacao.dto'

export class AtualizarVariacaoDto {
  @ApiPropertyOptional({ description: 'SKU único da variação dentro do produto' })
  @IsOptional()
  @IsString()
  @MaxLength(80, { message: 'O SKU deve ter no máximo 80 caracteres' })
  sku?: string

  @ApiPropertyOptional({ description: 'Nome da variação' })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'O nome deve ter no máximo 200 caracteres' })
  nome?: string

  @ApiPropertyOptional({ description: 'Código de barras EAN/GTIN da variação' })
  @IsOptional()
  @IsString()
  @MaxLength(14)
  gtin?: string

  @ApiPropertyOptional({ description: 'Preço de venda da variação (reais)' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O preço deve ter no máximo 2 casas decimais' })
  @Min(0, { message: 'O preço de venda não pode ser negativo' })
  precoVenda?: number

  @ApiPropertyOptional({ description: 'Peso da variação em gramas' })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'O peso não pode ser negativo' })
  peso?: number

  @ApiPropertyOptional({
    description: 'Atributos da variação (substitui a lista atual)',
    type: [AtributoVariacaoDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: 'No máximo 20 atributos por variação' })
  @ValidateNested({ each: true })
  @Type(() => AtributoVariacaoDto)
  atributos?: AtributoVariacaoDto[]
}
