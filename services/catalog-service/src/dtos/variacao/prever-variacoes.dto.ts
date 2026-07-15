/**
 * DTO para PREVER (gerar sem persistir) a matriz de variações de um produto a
 * partir de uma grade de tamanhos.
 *
 * Fluxo de varejo BR: o usuário informa um atributo (default 'Cor') + o valor
 * desse atributo (ex: 'Preto') e escolhe uma grade → o sistema gera uma variação
 * por tamanho da grade, com SKU/nome/preço derivados automaticamente.
 */

import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PreverVariacoesDto {
  @ApiPropertyOptional({
    description: 'Nome do atributo distintivo (além do tamanho)',
    example: 'Cor',
    default: 'Cor',
  })
  @IsOptional()
  @IsString()
  @MaxLength(60, { message: 'O atributo deve ter no máximo 60 caracteres' })
  atributo?: string

  @ApiProperty({ description: 'Valor do atributo (ex: a cor escolhida)', example: 'Preto' })
  @IsString()
  @IsNotEmpty({ message: 'O valor do atributo é obrigatório' })
  @MaxLength(100, { message: 'O valor do atributo deve ter no máximo 100 caracteres' })
  valorAtributo: string

  @ApiProperty({ description: 'ID da grade de tamanhos a aplicar' })
  @Matches(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, { message: 'O ID da grade deve ser um UUID válido' })
  gradeId: string
}
