/**
 * DTO para criação de produto.
 *
 * Define e valida os campos aceitos na criação de um novo produto.
 * Usa class-validator para validação automática via pipes do NestJS.
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  IsInt,
  IsIn,
  MinLength,
  MaxLength,
  Min,
  IsUUID,
  Matches,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Imagem do produto (padrão e-commerce).
 *
 * `url` aceita tanto URL http(s) hospedada (recomendado p/ marketplaces) quanto
 * data URL (upload local). A capa é a imagem com `principal: true` (ou `ordem 0`).
 */
export class ImagemProdutoDto {
  @ApiProperty({ description: 'URL da imagem (http(s) ou data URL)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200000, { message: 'URL de imagem muito longa' })
  url: string;

  @ApiPropertyOptional({ description: 'URL da miniatura' })
  @IsOptional()
  @IsString()
  @MaxLength(200000)
  urlMiniatura?: string;

  @ApiPropertyOptional({ description: 'Se é a imagem principal (capa)' })
  @IsOptional()
  @IsBoolean()
  principal?: boolean;

  @ApiPropertyOptional({ description: 'Ordem de exibição (0 = capa)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  ordem?: number;

  @ApiPropertyOptional({ description: 'Texto alternativo (acessibilidade/SEO)' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  textoAlternativo?: string;
}

export class CriarProdutoDto {
  @ApiProperty({ description: 'Código SKU único do produto', example: 'CAM-AZL-M' })
  @IsString()
  @IsNotEmpty({ message: 'O SKU é obrigatório' })
  @MaxLength(50, { message: 'O SKU deve ter no máximo 50 caracteres' })
  sku: string;

  @ApiPropertyOptional({ description: 'Código de barras EAN/GTIN', example: '7891234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(14)
  gtin?: string;

  @ApiProperty({ description: 'Nome do produto', example: 'Camiseta Algodão Premium' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  @MaxLength(200, { message: 'O nome deve ter no máximo 200 caracteres' })
  nome: string;

  @ApiProperty({ description: 'Descrição completa do produto' })
  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @MinLength(10, { message: 'A descrição deve ter pelo menos 10 caracteres' })
  descricao: string;

  @ApiPropertyOptional({ description: 'Descrição curta para listagens' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  descricaoCurta?: string;

  @ApiProperty({ description: 'ID da categoria', example: 'uuid-da-categoria' })
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, { message: 'ID da categoria deve ser um UUID válido' })
  categoriaId: string;

  @ApiPropertyOptional({ description: 'ID da marca' })
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, { message: 'ID da marca deve ser um UUID válido' })
  marcaId?: string;

  @ApiProperty({ description: 'NCM do produto (8 dígitos)', example: '61091000' })
  @IsString()
  @IsNotEmpty({ message: 'O NCM é obrigatório' })
  @MaxLength(8)
  ncm: string;

  @ApiPropertyOptional({ description: 'CEST do produto' })
  @IsOptional()
  @IsString()
  cest?: string;

  @ApiProperty({ description: 'Origem fiscal do produto (0-8)', example: 0 })
  @IsNumber()
  @Min(0)
  origem: number;

  @ApiProperty({ description: 'Preço de custo em centavos', example: 2500 })
  @IsNumber()
  @Min(0, { message: 'O preço de custo não pode ser negativo' })
  precoCusto: number;

  @ApiProperty({ description: 'Preço de venda em centavos', example: 5990 })
  @IsNumber()
  @Min(1, { message: 'O preço de venda deve ser maior que zero' })
  precoVenda: number;

  @ApiPropertyOptional({ description: 'Preço promocional em centavos' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  precoPromocional?: number;

  @ApiProperty({ description: 'Peso em gramas', example: 250 })
  @IsNumber()
  @Min(1, { message: 'O peso deve ser maior que zero' })
  peso: number;

  @ApiProperty({ description: 'Altura em cm', example: 5 })
  @IsNumber()
  @Min(0.1)
  altura: number;

  @ApiProperty({ description: 'Largura em cm', example: 30 })
  @IsNumber()
  @Min(0.1)
  largura: number;

  @ApiProperty({ description: 'Comprimento em cm', example: 40 })
  @IsNumber()
  @Min(0.1)
  comprimento: number;

  @ApiPropertyOptional({
    description: 'Status do produto',
    enum: ['ATIVO', 'INATIVO', 'RASCUNHO', 'ESGOTADO', 'DESCONTINUADO'],
  })
  @IsOptional()
  @IsIn(['ATIVO', 'INATIVO', 'RASCUNHO', 'ESGOTADO', 'DESCONTINUADO'], {
    message: 'Status inválido',
  })
  status?: string;

  @ApiPropertyOptional({ description: 'Estoque mínimo (para alertas)', example: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  estoqueMinimo?: number;

  @ApiPropertyOptional({ description: 'Unidade de medida', example: 'UN' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  unidadeMedida?: string;

  @ApiPropertyOptional({ description: 'Título para SEO/anúncio' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  metaTitulo?: string;

  @ApiPropertyOptional({ description: 'Descrição para SEO/anúncio' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaDescricao?: string;

  @ApiPropertyOptional({ description: 'Tags para busca', example: ['algodão', 'premium'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Galeria de imagens (capa = principal/ordem 0). Usada na vitrine e nos anúncios.',
    type: [ImagemProdutoDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: 'No máximo 20 imagens por produto' })
  @ValidateNested({ each: true })
  @Type(() => ImagemProdutoDto)
  imagens?: ImagemProdutoDto[];
}
