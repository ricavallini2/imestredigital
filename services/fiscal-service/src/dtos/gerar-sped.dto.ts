/**
 * DTO para gerar SPED
 */

import { IsNumber, Min, Max } from 'class-validator';

export class GerarSpedDto {
  @IsNumber()
  @Min(1)
  @Max(12)
  mes: number;

  @IsNumber()
  @Min(2000)
  @Max(2099)
  ano: number;
}
