/**
 * DTO para listagem/filtragem de produtos.
 *
 * Define os parâmetros aceitos na query string para
 * busca, paginação e filtros de listagem de produtos.
 */

import { IsOptional, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Valores de status aceitos no filtro de listagem.
 *
 * Espelham EXATAMENTE o enum `StatusProduto` do schema Prisma (UPPERCASE_SNAKE),
 * para que o valor recebido na query possa ir direto ao `where.status` sem
 * conversão de caixa.
 */
export enum StatusProdutoFiltro {
  RASCUNHO = 'RASCUNHO',
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  ESGOTADO = 'ESGOTADO',
  DESCONTINUADO = 'DESCONTINUADO',
}

export class ListarProdutosDto {
  @ApiPropertyOptional({ description: 'Termo de busca (nome, SKU ou GTIN)' })
  @IsOptional()
  @IsString()
  busca?: string;

  @ApiPropertyOptional({ description: 'Filtrar por status', enum: StatusProdutoFiltro })
  @IsOptional()
  @IsEnum(StatusProdutoFiltro, { message: 'Status inválido' })
  status?: StatusProdutoFiltro;

  @ApiPropertyOptional({ description: 'Filtrar por categoria (UUID)' })
  @IsOptional()
  @IsString()
  categoriaId?: string;

  @ApiPropertyOptional({ description: 'Número da página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pagina?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500, { message: 'Máximo de 500 itens por página' })
  itensPorPagina?: number = 20;
}
