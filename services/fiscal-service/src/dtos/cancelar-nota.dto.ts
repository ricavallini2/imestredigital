/**
 * DTO para cancelar Nota Fiscal
 */

import { IsString, MinLength } from 'class-validator';

export class CancelarNotaDto {
  @IsString()
  @MinLength(15, {
    message: 'Justificativa deve ter pelo menos 15 caracteres',
  })
  justificativa: string;
}
