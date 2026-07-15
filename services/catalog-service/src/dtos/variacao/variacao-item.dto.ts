/**
 * DTO de um item de variação para persistência (upsert em lote por SKU).
 *
 * Espelha o modelo `VariacaoProduto` do schema Prisma
 * ({ sku, gtin?, nome, precoVenda?, peso? }) + a lista de atributos que serão
 * gravados em `AtributoVariacao`.
 *
 * `precoVenda` é um valor monetário (reais) mapeado para a coluna
 * Decimal(19,2); segue a mesma convenção do `precoVenda` do produto.
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
  Min,
  MaxLength,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AtributoVariacaoDto } from './atributo-variacao.dto'

export class VariacaoItemDto {
  @ApiProperty({ description: 'SKU único da variação dentro do produto', example: 'CAM-PRETO-38' })
  @IsString()
  @IsNotEmpty({ message: 'O SKU da variação é obrigatório' })
  @MaxLength(80, { message: 'O SKU deve ter no máximo 80 caracteres' })
  sku: string

  @ApiProperty({ description: 'Nome da variação', example: 'Preto 38' })
  @IsString()
  @IsNotEmpty({ message: 'O nome da variação é obrigatório' })
  @MaxLength(200, { message: 'O nome deve ter no máximo 200 caracteres' })
  nome: string

  @ApiPropertyOptional({ description: 'Código de barras EAN/GTIN da variação' })
  @IsOptional()
  @IsString()
  @MaxLength(14)
  gtin?: string

  @ApiPropertyOptional({ description: 'Preço de venda da variação (reais)', example: 59.9 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O preço deve ter no máximo 2 casas decimais' })
  @Min(0, { message: 'O preço de venda não pode ser negativo' })
  precoVenda?: number

  @ApiPropertyOptional({ description: 'Peso da variação em gramas', example: 180 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'O peso não pode ser negativo' })
  peso?: number

  @ApiPropertyOptional({
    description: 'Atributos da variação (ex: Cor=Preto, Tamanho=38)',
    type: [AtributoVariacaoDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: 'No máximo 20 atributos por variação' })
  @ValidateNested({ each: true })
  @Type(() => AtributoVariacaoDto)
  atributos?: AtributoVariacaoDto[]
}
