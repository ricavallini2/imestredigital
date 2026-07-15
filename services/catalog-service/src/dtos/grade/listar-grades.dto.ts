/**
 * DTO para listagem/filtragem de grades de tamanhos.
 *
 * Suporta paginação canônica, busca textual (nome) e filtro por status (ativa).
 */

import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type, Transform } from 'class-transformer'

export class ListarGradesDto {
  @ApiPropertyOptional({ description: 'Termo de busca (nome)' })
  @IsOptional()
  @IsString()
  busca?: string

  @ApiPropertyOptional({ description: 'Filtrar por status (ativa)' })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' || value === true
      ? true
      : value === 'false' || value === false
        ? false
        : undefined,
  )
  @IsBoolean()
  ativa?: boolean

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
