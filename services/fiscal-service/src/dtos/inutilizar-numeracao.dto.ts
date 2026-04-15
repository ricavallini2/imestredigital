/**
 * DTO para inutilizar numeração de Nota Fiscal
 */

import { IsString, IsNumber, Min, MinLength } from 'class-validator';

export class InutilizarNumeracaoDto {
  @IsString()
  serie: string;

  @IsNumber()
  @Min(1)
  numeroInicial: number;

  @IsNumber()
  @Min(1)
  numeroFinal: number;

  @IsString()
  @MinLength(15, {
    message: 'Justificativa deve ter pelo menos 15 caracteres',
  })
  justificativa: string;
}
