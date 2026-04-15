/**
 * DTO para entrada de estoque (compra, devolução, etc.).
 */

import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EntradaEstoqueDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsUUID()
  @IsNotEmpty()
  produtoId: string;

  @ApiProperty({ description: 'ID do depósito de destino' })
  @IsUUID()
  @IsNotEmpty()
  depositoId: string;

  @ApiProperty({ description: 'Quantidade a dar entrada', example: 100 })
  @IsNumber()
  @Min(1, { message: 'Quantidade mínima: 1' })
  quantidade: number;

  @ApiPropertyOptional({ description: 'Custo unitário em centavos' })
  @IsOptional()
  @IsNumber()
  custoUnitario?: number;

  @ApiPropertyOptional({ description: 'Motivo: compra, devolucao, producao, ajuste' })
  @IsOptional()
  @IsString()
  motivo?: string;

  @ApiPropertyOptional({ description: 'Observação livre' })
  @IsOptional()
  @IsString()
  observacao?: string;
}
