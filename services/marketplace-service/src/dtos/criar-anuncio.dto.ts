import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsObject,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO para criar novo anúncio no marketplace
 */
export class CriarAnuncioDto {
  @ApiProperty({
    description: 'ID da conta marketplace',
    example: 'cm1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  contaMarketplaceId: string;

  @ApiProperty({
    description: 'ID do produto no catálogo interno',
    example: 'prod-001',
  })
  @IsString()
  @IsNotEmpty()
  produtoId: string;

  @ApiProperty({
    description: 'ID da variação do produto (opcional)',
    example: 'var-001',
  })
  @IsString()
  @IsOptional()
  variacaoId?: string;

  @ApiProperty({
    description: 'Título do anúncio',
    example: 'Camiseta Básica Premium',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  titulo: string;

  @ApiProperty({
    description: 'Descrição completa do anúncio',
    example: 'Camiseta de algodão 100% com excelente qualidade...',
  })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({
    description: 'Preço do anúncio',
    example: 79.99,
    minimum: 0.01,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  @Type(() => Number)
  preco: number;

  @ApiProperty({
    description: 'Preço promocional (opcional)',
    example: 59.99,
    minimum: 0.01,
  })
  @IsNumber()
  @IsOptional()
  @Min(0.01)
  @Type(() => Number)
  precoPromocional?: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  estoque: number;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'cat-1',
  })
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @ApiProperty({
    description: 'Lista de URLs de fotos',
    example: [
      'https://example.com/foto1.jpg',
      'https://example.com/foto2.jpg',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  fotos: string[];

  @ApiProperty({
    description: 'Atributos adicionais do produto',
    example: { marca: 'Nike', cor: 'Azul', tamanho: 'M' },
  })
  @IsObject()
  @IsOptional()
  atributos?: Record<string, any>;
}
