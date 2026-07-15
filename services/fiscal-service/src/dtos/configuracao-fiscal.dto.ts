/**
 * DTO para Configuração Fiscal do tenant.
 *
 * Cobre todos os dados necessários para emissão fiscal por tenant:
 * - Regime tributário (SIMPLES_NACIONAL/MEI/LUCRO_PRESUMIDO/LUCRO_REAL)
 * - Ambiente SEFAZ (HOMOLOGACAO/PRODUCAO)
 * - Identificação do emitente: CNPJ, IE, IM, razão social, nome fantasia
 * - Endereço completo do emitente (para o grupo `emit` do XML NF-e)
 * - Séries e numeração por modelo (55/65)
 * - CSC + idCSC (NFC-e mod. 65)
 * - Natureza de operação padrão
 *
 * O arquivo do certificado A1 e a senha NÃO trafegam neste DTO — são enviados
 * pelo endpoint dedicado de upload (multipart) e ficam sob responsabilidade do
 * provedor fiscal na v1 (ADR-001).
 */

import {
  IsString,
  IsOptional,
  IsEnum,
  Length,
  Matches,
  IsEmail,
} from 'class-validator'
import { RegimeTributario, AmbienteSefaz, NaturezaOperacao } from '../../generated/client'

export class AtualizarConfiguracaoFiscalDto {
  // ─── Regime e ambiente ───────────────────────────────────────
  @IsEnum(RegimeTributario, {
    message: 'regimeTributario deve ser SIMPLES_NACIONAL, MEI, LUCRO_PRESUMIDO ou LUCRO_REAL',
  })
  regimeTributario: RegimeTributario

  @IsEnum(AmbienteSefaz, { message: 'ambienteSefaz deve ser HOMOLOGACAO ou PRODUCAO' })
  ambienteSefaz: AmbienteSefaz

  // ─── Identificação do emitente ───────────────────────────────
  @IsOptional()
  @IsString()
  @Matches(/^\d{14}$/, { message: 'cnpj deve conter 14 dígitos numéricos' })
  cnpj?: string

  @IsOptional()
  @IsString()
  razaoSocial?: string

  @IsOptional()
  @IsString()
  nomeFantasia?: string

  @IsOptional()
  @IsString()
  inscricaoEstadual?: string

  @IsOptional()
  @IsString()
  inscricaoMunicipal?: string

  @IsOptional()
  @IsString()
  cnae?: string

  /**
   * Código de Regime Tributário (CRT) do XML NF-e. Se ausente, é derivado do
   * regimeTributario no serviço (Simples/MEI → "1"; regime normal → "3").
   */
  @IsOptional()
  @IsString()
  crt?: string

  // ─── Endereço do emitente (grupo enderEmit) ──────────────────
  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'uf deve ter 2 letras' })
  uf?: string

  @IsOptional()
  @IsString()
  @Matches(/^\d{7}$/, { message: 'codigoMunicipio deve ser o código IBGE de 7 dígitos' })
  codigoMunicipio?: string

  @IsOptional()
  @IsString()
  municipio?: string

  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'cep deve conter 8 dígitos numéricos' })
  cep?: string

  @IsOptional()
  @IsString()
  endereco?: string

  @IsOptional()
  @IsString()
  numero?: string

  @IsOptional()
  @IsString()
  complemento?: string

  @IsOptional()
  @IsString()
  bairro?: string

  @IsOptional()
  @IsString()
  telefone?: string

  @IsOptional()
  @IsString()
  fax?: string

  @IsOptional()
  @IsEmail({}, { message: 'email do emitente inválido' })
  email?: string

  // ─── Séries e numeração ──────────────────────────────────────
  @IsOptional()
  @IsString()
  serieNfe?: string

  @IsOptional()
  @IsString()
  serieNfce?: string

  // ─── NFC-e (mod. 65) ─────────────────────────────────────────
  @IsOptional()
  @IsString()
  tokenCsc?: string

  @IsOptional()
  @IsString()
  idCsc?: string

  // ─── Operação padrão ─────────────────────────────────────────
  @IsOptional()
  @IsEnum(NaturezaOperacao, { message: 'naturezaOperacaoPadrao inválida' })
  naturezaOperacaoPadrao?: NaturezaOperacao
}

/**
 * DTO para upload de certificado digital.
 *
 * O arquivo é recebido via multipart/form-data (campo `certificado`) e a senha
 * vem em campo separado (`senha`), tratados no controller.
 */
export class UploadCertificadoDto {}
