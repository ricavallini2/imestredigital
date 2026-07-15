/**
 * DTO tolerante de variação EMBUTIDA no PUT/POST de produto.
 *
 * Motivação (fix do 400): a tela de produto do front envia `variacoes` no corpo
 * do update com um shape legado orientado à UI
 *   { id?, tipo, valor, sku?, precoCusto?, preco?, estoque }
 * enquanto o contrato canônico de variação (endpoints dedicados) é
 *   { sku, nome, gtin?, precoVenda?, peso?, atributos[] }.
 *
 * Com `forbidNonWhitelisted: true`, um DTO estrito rejeitaria os campos legados.
 * Este DTO ACEITA os dois formatos (todos os campos opcionais) para que o PUT
 * atual do front volte a funcionar; o produto service normaliza cada item para
 * o shape canônico antes do upsert (deriva sku/nome/preço/atributos a partir do
 * que veio).
 *
 * O fluxo novo (wizard por grade) usa os endpoints dedicados
 * `POST /produtos/:id/variacoes/lote`, que exigem o shape canônico completo.
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

export class ProdutoVariacaoEmbutidaDto {
  // ── Campos canônicos ──────────────────────────────────────────────────────

  @ApiPropertyOptional({ description: 'SKU da variação (gerado automaticamente se ausente)' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  sku?: string

  @ApiPropertyOptional({ description: 'Nome da variação' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nome?: string

  @ApiPropertyOptional({ description: 'Código de barras EAN/GTIN da variação' })
  @IsOptional()
  @IsString()
  @MaxLength(14)
  gtin?: string

  @ApiPropertyOptional({ description: 'Preço de venda da variação (reais)' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precoVenda?: number

  @ApiPropertyOptional({ description: 'Peso da variação em gramas' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  peso?: number

  @ApiPropertyOptional({ description: 'Atributos da variação', type: [AtributoVariacaoDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => AtributoVariacaoDto)
  atributos?: AtributoVariacaoDto[]

  // ── Campos legados da UI (aceitos p/ compatibilidade; normalizados no service) ──

  @ApiPropertyOptional({ description: 'ID local/legado da linha (ignorado na persistência)' })
  @IsOptional()
  @IsString()
  id?: string

  @ApiPropertyOptional({ description: 'Tipo do atributo legado (ex: Cor, Tamanho, Única)' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  tipo?: string

  @ApiPropertyOptional({ description: 'Valor do atributo legado (ex: Preto, P)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  valor?: string

  @ApiPropertyOptional({ description: 'Preço de venda legado (reais)' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco?: number

  @ApiPropertyOptional({ description: 'Preço de custo legado (reais) — não persistido na variação' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precoCusto?: number

  @ApiPropertyOptional({ description: 'Estoque legado — não pertence ao catálogo (inventory-service)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estoque?: number
}
