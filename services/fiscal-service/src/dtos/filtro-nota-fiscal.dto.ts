/**
 * DTO para filtrar Notas Fiscais
 */

import { IsOptional, IsString, IsNumber, IsISO8601, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltroNotaFiscalDto {
  @IsOptional()
  @IsString()
  tipo?: 'NFE' | 'NFSE' | 'NFCE';

  @IsOptional()
  @IsString()
  status?: string; // RASCUNHO, VALIDADA, ENVIADA, AUTORIZADA, REJEITADA, CANCELADA, INUTILIZADA

  @IsOptional()
  @IsISO8601()
  dataInicio?: string;

  @IsOptional()
  @IsISO8601()
  dataFim?: string;

  @IsOptional()
  @IsString()
  clienteId?: string; // UUID do cliente

  @IsOptional()
  @IsString()
  chaveAcesso?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pagina: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limite: number = 20;
}
