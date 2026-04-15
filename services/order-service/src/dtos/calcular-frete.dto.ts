/**
 * DTO para cálculo de frete.
 */

import { IsString, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DimensoesDto {
  @IsNumber()
  peso: number; // em kg

  @IsNumber()
  largura: number; // em cm

  @IsNumber()
  altura: number; // em cm

  @IsNumber()
  comprimento: number; // em cm
}

export class CalcularFreteDto {
  @IsString()
  cepOrigem: string;

  @IsString()
  cepDestino: string;

  @ValidateNested()
  @Type(() => DimensoesDto)
  dimensoes: DimensoesDto;

  @IsOptional()
  @IsString()
  tipoServico?: string; // sedex, pac, etc (specific ao frete provider)
}
