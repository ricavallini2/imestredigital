/**
 * DTO para listagem/filtragem de categorias.
 *
 * Suporta paginação canônica, busca textual, filtro por status (ativa) e
 * filtro por categoria pai (para navegar a árvore um nível por vez).
 */

import { IsOptional, IsString, IsNumber, IsBoolean, IsUUID, Min, Max, Matches } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type, Transform } from 'class-transformer'

export class ListarCategoriasDto {
  @ApiPropertyOptional({ description: 'Termo de busca (nome ou slug)' })
  @IsOptional()
  @IsString()
  busca?: string

  @ApiPropertyOptional({ description: 'Filtrar por status (ativa)' })
  @IsOptional()
  @Transform(({ value }) => (value === 'true' || value === true ? true : value === 'false' || value === false ? false : undefined))
  @IsBoolean()
  ativa?: boolean

  @ApiPropertyOptional({
    description: 'Filtrar pelas filhas diretas desta categoria pai (UUID)',
  })
  @IsOptional()
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, { message: 'O ID da categoria pai deve ser um UUID válido' })
  categoriaPaiId?: string

  @ApiPropertyOptional({
    description: 'Retornar apenas categorias raiz (sem pai)',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  apenasRaiz?: boolean

  @ApiPropertyOptional({ description: 'Número da página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pagina?: number = 1

  @ApiPropertyOptional({ description: 'Itens por página', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500, { message: 'Máximo de 500 itens por página' })
  itensPorPagina?: number = 20
}
