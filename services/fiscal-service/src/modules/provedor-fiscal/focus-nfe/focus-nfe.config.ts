/**
 * Resolução de configuração do provedor Focus NFe a partir do ambiente.
 *
 * Tokens:
 * - `FOCUS_NFE_TOKEN_HOMOLOGACAO` e `FOCUS_NFE_TOKEN_PRODUCAO` são os tokens
 *   globais da v1 (uma conta Focus para o SaaS). Por tenant, o token pode ser
 *   sobrescrito quando a ConfiguracaoFiscal fornecer um (passado no contexto
 *   da operação), mas o fallback é sempre o token global do ambiente.
 *
 * Base URLs (fixas por ambiente, conforme doc oficial):
 * - Homologação: https://homologacao.focusnfe.com.br
 * - Produção:    https://api.focusnfe.com.br
 */

import { ConfigService } from '@nestjs/config';
import { AmbienteFiscal } from '../tipos/provedor-fiscal.tipos';

export const FOCUS_BASE_URL_HOMOLOGACAO = 'https://homologacao.focusnfe.com.br';
export const FOCUS_BASE_URL_PRODUCAO = 'https://api.focusnfe.com.br';

/** URL base da API Focus NFe para o ambiente informado. */
export function baseUrlFocus(ambiente: AmbienteFiscal): string {
  return ambiente === 'PRODUCAO' ? FOCUS_BASE_URL_PRODUCAO : FOCUS_BASE_URL_HOMOLOGACAO;
}

/**
 * Resolve o token da Focus NFe para o ambiente. Prioriza o token do tenant
 * (quando fornecido), caindo para o token global de ambiente definido em env.
 *
 * @throws Error quando nenhum token está disponível (falha explícita — sem
 *   token não há como transmitir, e mascarar isso levaria a falhas obscuras).
 */
export function resolverTokenFocus(
  config: ConfigService,
  ambiente: AmbienteFiscal,
  tokenTenant?: string,
): string {
  if (tokenTenant && tokenTenant.length > 0) {
    return tokenTenant;
  }

  const chaveEnv =
    ambiente === 'PRODUCAO' ? 'FOCUS_NFE_TOKEN_PRODUCAO' : 'FOCUS_NFE_TOKEN_HOMOLOGACAO';

  const token = config.get<string>(chaveEnv);
  if (!token || token.length === 0) {
    throw new Error(
      `Token da Focus NFe não configurado para ambiente ${ambiente}. ` +
        `Defina ${chaveEnv} ou o token do tenant na configuração fiscal.`,
    );
  }
  return token;
}

/**
 * Monta o header Authorization Basic da Focus NFe: token como usuário e senha
 * em branco → base64("token:").
 */
export function headerAuthorizationFocus(token: string): string {
  const credenciais = Buffer.from(`${token}:`).toString('base64');
  return `Basic ${credenciais}`;
}
