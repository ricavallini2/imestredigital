/**
 * DTO para criação de categoria financeira.
 */

import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarCategoriaDTO {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Vendas',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Tipo de categoria',
    enum: ['RECEITA', 'DESPESA'],
  })
  @IsEnum(['RECEITA', 'DESPESA'])
  tipo: string;

  @ApiProperty({
    description: 'Ícone para exibição',
    example: 'shopping-cart',
    required: false,
  })
  @IsString()
  @IsOptional()
  icone?: string;

  @ApiProperty({
    description: 'Cor para exibição (hex)',
    example: '#10B981',
    required: false,
  })
  @IsString()
  @IsOptional()
  cor?: string;

  @ApiProperty({
    description: 'ID da categoria pai (para hierarquia)',
    required: false,
  })
  @IsString()
  @IsOptional()
  paiId?: string;
}
