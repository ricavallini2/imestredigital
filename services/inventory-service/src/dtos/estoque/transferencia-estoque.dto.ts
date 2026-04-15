/**
 * DTO para transferência entre depósitos.
 * Move estoque de um depósito para outro atomicamente.
 */

import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransferenciaEstoqueDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsUUID()
  @IsNotEmpty()
  produtoId: string;

  @ApiProperty({ description: 'Depósito de origem' })
  @IsUUID()
  @IsNotEmpty()
  depositoOrigemId: string;

  @ApiProperty({ description: 'Depósito de destino' })
  @IsUUID()
  @IsNotEmpty()
  depositoDestinoId: string;

  @ApiProperty({ description: 'Quantidade a transferir', example: 25 })
  @IsNumber()
  @Min(1)
  quantidade: number;

  @ApiPropertyOptional({ description: 'Observação sobre a transferência' })
  @IsOptional()
  @IsString()
  observacao?: string;
}
