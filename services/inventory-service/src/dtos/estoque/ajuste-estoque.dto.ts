/**
 * DTO para ajuste manual de estoque (inventário/contagem física).
 * Define a quantidade exata para um produto em um depósito.
 */

import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AjusteEstoqueDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsUUID()
  @IsNotEmpty()
  produtoId: string;

  @ApiProperty({ description: 'ID do depósito' })
  @IsUUID()
  @IsNotEmpty()
  depositoId: string;

  @ApiProperty({ description: 'Nova quantidade física (contagem real)', example: 42 })
  @IsNumber()
  @Min(0)
  novaQuantidade: number;

  @ApiPropertyOptional({ description: 'Motivo e observação do ajuste' })
  @IsOptional()
  @IsString()
  observacao?: string;
}
