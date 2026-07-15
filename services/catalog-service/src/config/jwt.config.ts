/**
 * Configuração e resolução do segredo JWT (fail-fast).
 *
 * Regra canônica de segurança da Fase 0:
 * - Em produção (NODE_ENV === 'production'): JWT_SECRET é OBRIGATÓRIO.
 *   Ausente → lança erro no bootstrap (não sobe com segredo inseguro).
 * - Em dev/test: permite um default explícito, com aviso no log, para
 *   não travar o desenvolvimento local sem configuração.
 *
 * Nunca há fallback silencioso para 'dev-secret-trocar-em-producao' em produção.
 */

import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/** Default usado APENAS fora de produção. */
export const JWT_SECRET_DEV_DEFAULT = 'dev-secret-trocar-em-producao'

const logger = new Logger('JwtConfig')

/**
 * Resolve o segredo JWT a partir do ConfigService aplicando o fail-fast.
 *
 * @throws Error se estiver em produção e JWT_SECRET não estiver definido.
 */
export function resolverJwtSecret(config: ConfigService): string {
  const segredo = config.get<string>('JWT_SECRET')
  const ambiente = config.get<string>('NODE_ENV') ?? process.env.NODE_ENV

  if (segredo && segredo.length > 0) {
    return segredo
  }

  if (ambiente === 'production') {
    throw new Error(
      'JWT_SECRET não definido em produção. Configure a variável de ambiente ' +
        'JWT_SECRET (compartilhada entre todos os serviços) antes de iniciar o catalog-service.',
    )
  }

  logger.warn(
    'JWT_SECRET não definido — usando default de DESENVOLVIMENTO. ' +
      'NUNCA use este valor em produção.',
  )
  return JWT_SECRET_DEV_DEFAULT
}
