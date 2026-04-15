/**
 * DTO para Regra Fiscal
 */

import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CriarRegraFiscalDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsString()
  ncm: string; // Código NCM (8 dígitos)

  @IsString()
  cfop: string;

  @IsString()
  cstIcms: string;

  @IsNumber()
  @Min(0)
  aliquotaIcms: number; // Em centavos de percentual

  @IsString()
  cstPis: string;

  @IsNumber()
  @Min(0)
  aliquotaPis: number;

  @IsString()
  cstCofins: string;

  @IsNumber()
  @Min(0)
  aliquotaCofins: number;

  @IsOptional()
  @IsString()
  cstIpi?: string;

  @IsNumber()
  @Min(0)
  aliquotaIpi: number = 0;

  @IsOptional()
  @IsString()
  ufOrigem?: string;

  @IsOptional()
  @IsString()
  ufDestino?: string;

  @IsOptional()
  @IsString()
  regimeTributario?: string;
}

export class AtualizarRegraFiscalDto extends CriarRegraFiscalDto {}
