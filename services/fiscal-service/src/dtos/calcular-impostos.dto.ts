/**
 * DTO para cálculo de impostos
 */

import { IsArray, ValidateNested, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemCalculoImpostosDto {
  @IsString()
  produtoId: string;

  @IsString()
  ncm: string;

  @IsString()
  cfop: string;

  @IsNumber()
  @Min(0)
  quantidade: number;

  @IsNumber()
  @Min(0)
  valorUnitario: number;

  @IsString()
  ufDestino: string;
}

export class CalcularImpostosDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCalculoImpostosDto)
  itens: ItemCalculoImpostosDto[];
}
