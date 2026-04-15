/**
 * DTO para saída de estoque (venda, perda, avaria, consumo).
 */

import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SaidaEstoqueDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsUUID()
  @IsNotEmpty()
  produtoId: string;

  @ApiProperty({ description: 'ID do depósito de origem' })
  @IsUUID()
  @IsNotEmpty()
  depositoId: string;

  @ApiProperty({ description: 'Quantidade a dar saída', example: 5 })
  @IsNumber()
  @Min(1)
  quantidade: number;

  @ApiPropertyOptional({ description: 'Motivo: venda, perda, avaria, consumo' })
  @IsOptional()
  @IsString()
  motivo?: string;

  @ApiPropertyOptional({ description: 'Observação adicional' })
  @IsOptional()
  @IsString()
  observacao?: string;
}
