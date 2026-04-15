/**
 * DTO para Configuração Fiscal
 */

import { IsString, IsOptional, IsDateString } from 'class-validator';

export class AtualizarConfiguracaoFiscalDto {
  @IsString()
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'MEI';

  @IsOptional()
  @IsString()
  inscricaoEstadual?: string;

  @IsOptional()
  @IsString()
  inscricaoMunicipal?: string;

  @IsOptional()
  @IsString()
  cnae?: string;

  @IsOptional()
  @IsString()
  crt?: string;

  @IsString()
  ambienteSefaz: 'PRODUCAO' | 'HOMOLOGACAO';

  @IsOptional()
  @IsString()
  serieNfe?: string;

  @IsOptional()
  @IsString()
  serieNfce?: string;

  @IsOptional()
  @IsString()
  tokenCsc?: string;

  @IsOptional()
  @IsString()
  idCsc?: string;
}

/**
 * DTO para upload de certificado digital
 */
export class UploadCertificadoDto {
  // Arquivo será recebido via multipart/form-data
  // A senha virá em um campo separado
}
