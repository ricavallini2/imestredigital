/**
 * DTO para filtro de busca de clientes
 *
 * Permite filtrar clientes por múltiplos critérios
 * com paginação.
 */

import { IsOptional, IsString, IsInt, Min, IsEnum, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum StatusClienteFiltro {
  PROSPECT = 'PROSPECT',
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  BLOQUEADO = 'BLOQUEADO',
}

export enum OrigemClienteFiltro {
  MANUAL = 'MANUAL',
  MARKETPLACE = 'MARKETPLACE',
  SITE = 'SITE',
  INDICACAO = 'INDICACAO',
  IMPORTACAO = 'IMPORTACAO',
}

export class FiltroClienteDto {
  @ApiPropertyOptional({
    description: 'Página (começa em 1)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @ApiPropertyOptional({
    description: 'Itens por página',
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limite?: number = 20;

  @ApiPropertyOptional({
    description: 'Busca por nome ou email',
    example: 'João',
  })
  @IsOptional()
  @IsString()
  busca?: string;

  @ApiPropertyOptional({
    description: 'Filtro por email',
    example: 'joao@exemplo.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filtro por CPF (apenas números)',
    example: '12345678901',
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({
    description: 'Filtro por CNPJ (apenas números)',
    example: '12345678000190',
  })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiPropertyOptional({
    description: 'Filtro por status',
    enum: StatusClienteFiltro,
    isArray: true,
    example: ['ATIVO'],
  })
  @IsOptional()
  @IsArray()
  status?: StatusClienteFiltro[];

  @ApiPropertyOptional({
    description: 'Filtro por origem',
    enum: OrigemClienteFiltro,
    isArray: true,
    example: ['MANUAL'],
  })
  @IsOptional()
  @IsArray()
  origem?: OrigemClienteFiltro[];

  @ApiPropertyOptional({
    description: 'Filtro por tags',
    example: ['vip', 'industria'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Ordenação (nome, email, criadoEm, ultimaCompra)',
    example: 'nome',
  })
  @IsOptional()
  @IsString()
  ordenar?: string = 'criadoEm';

  @ApiPropertyOptional({
    description: 'Direção da ordenação (asc ou desc)',
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  direcao?: string = 'desc';
}
