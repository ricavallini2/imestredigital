/**
 * DTOs para devoluções.
 */

import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsDecimal, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemDevolucaoCreateDto {
  @IsString()
  itemPedidoId: string;

  @IsNumber()
  @Min(1)
  quantidade: number;

  @IsString()
  motivo: string;
}

export class SolicitarDevolucaoDto {
  @IsString()
  motivo: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDevolucaoCreateDto)
  itens: ItemDevolucaoCreateDto[];

  @IsOptional()
  @IsString()
  observacao?: string;
}

export class AprovarDevolucaoDto {
  @IsOptional()
  @IsString()
  observacao?: string;
}

export class ReceberDevolucaoDto {
  @IsOptional()
  @IsString()
  observacao?: string;
}

export class ReembolsarDevolucaoDto {
  @IsOptional()
  @IsDecimal()
  valor?: number;

  @IsOptional()
  @IsString()
  observacao?: string;
}
