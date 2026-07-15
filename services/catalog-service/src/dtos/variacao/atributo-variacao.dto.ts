/**
 * DTO de um atributo de variação (ex: { nome: 'Cor', valor: 'Preto' }).
 *
 * Usado dentro dos itens de variação em lote/atualização. Espelha o modelo
 * `AtributoVariacao` do schema Prisma (nome + valor).
 */

import { IsString, IsNotEmpty, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AtributoVariacaoDto {
  @ApiProperty({ description: 'Nome do atributo', example: 'Cor' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do atributo é obrigatório' })
  @MaxLength(60, { message: 'O nome do atributo deve ter no máximo 60 caracteres' })
  nome: string

  @ApiProperty({ description: 'Valor do atributo', example: 'Preto' })
  @IsString()
  @IsNotEmpty({ message: 'O valor do atributo é obrigatório' })
  @MaxLength(100, { message: 'O valor do atributo deve ter no máximo 100 caracteres' })
  valor: string
}
