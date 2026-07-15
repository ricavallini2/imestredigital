/**
 * DTO do payload de webhook (gatilho) da Focus NFe.
 *
 * A Focus NFe dispara um POST JSON para a URL configurada a cada mudança de
 * status de um documento; o corpo carrega os dados de UM documento, no mesmo
 * formato das respostas de consulta. Modelamos aqui apenas os campos que
 * consumimos; o restante é ignorado (sem forbidNonWhitelisted neste DTO).
 *
 * A `ref` é a referência que ENVIAMOS na emissão (id da NotaFiscal no nosso
 * domínio), então é o elo para localizar a nota e o tenant.
 */

import { IsOptional, IsString } from 'class-validator';

export class WebhookFocusNFeDto {
  /** Referência do documento no nosso domínio (id da NotaFiscal). */
  @IsOptional()
  @IsString()
  ref?: string;

  /** Status Focus NFe: autorizado, cancelado, erro_autorizacao, etc. */
  @IsOptional()
  @IsString()
  status?: string;

  /** Espécie do documento (nfe, nfce, ...). */
  @IsOptional()
  @IsString()
  especie?: string;

  @IsOptional()
  @IsString()
  status_sefaz?: string;

  @IsOptional()
  @IsString()
  mensagem_sefaz?: string;

  @IsOptional()
  @IsString()
  chave_nfe?: string;

  @IsOptional()
  @IsString()
  cnpj_emitente?: string;

  @IsOptional()
  @IsString()
  caminho_xml_nota_fiscal?: string;

  @IsOptional()
  @IsString()
  caminho_danfe?: string;

  @IsOptional()
  @IsString()
  caminho_xml_cancelamento?: string;
}
