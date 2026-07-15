/**
 * DTO para atualização de grade de tamanhos.
 *
 * Todos os campos são opcionais (atualização parcial). Quando `tamanhos` é
 * informado, o service faz a SUBSTITUIÇÃO INTELIGENTE: preserva os tamanhos que
 * continuam na lista (mantendo o mesmo id/registro), remove os ausentes e cria
 * os novos, sempre reajustando a `ordem` conforme a posição enviada.
 *
 * Não herda de CriarGradeDto via PartialType porque a semântica de `tamanhos`
 * aqui é "substituir a lista" (opcional), e não "obrigatório na criação".
 */

import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  ArrayMaxSize,
  MinLength,
  MaxLength,
} from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class AtualizarGradeDto {
  @ApiPropertyOptional({ description: 'Novo nome da grade', example: 'Camiseta Adulto' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome?: string

  @ApiPropertyOptional({ description: 'Descrição livre da grade' })
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'A descrição deve ter no máximo 300 caracteres' })
  descricao?: string

  @ApiPropertyOptional({ description: 'Se a grade está ativa' })
  @IsOptional()
  @IsBoolean()
  ativa?: boolean

  @ApiPropertyOptional({
    description:
      'Nova lista de tamanhos na ordem de exibição. Substitui a lista atual ' +
      '(preservando os que permanecem, removendo os ausentes e criando os novos).',
    example: ['PP', 'P', 'M', 'G', 'GG', 'XG'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'A lista de tamanhos não pode ser vazia' })
  @ArrayMaxSize(200, { message: 'A grade suporta no máximo 200 tamanhos' })
  @IsString({ each: true, message: 'Cada tamanho deve ser um texto' })
  tamanhos?: string[]
}
