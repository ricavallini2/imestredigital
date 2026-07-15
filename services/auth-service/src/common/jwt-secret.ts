/**
 * Resolução fail-fast do segredo JWT.
 *
 * Regra canônica da Fase 0:
 * - Em produção (NODE_ENV === 'production'), JWT_SECRET é OBRIGATÓRIO.
 *   Ausência derruba o bootstrap imediatamente — sem fallback silencioso.
 * - Em desenvolvimento, permite um default explícito com aviso no log,
 *   para não travar quem roda o serviço localmente sem .env.
 *
 * NUNCA usar o antigo fallback silencioso 'dev-secret-trocar-em-producao'
 * dentro do código de verificação de token.
 */

import { Logger } from '@nestjs/common'

/** Default usado APENAS em desenvolvimento, sempre acompanhado de warn. */
const DEV_FALLBACK_SECRET = 'dev-secret-somente-desenvolvimento'

const logger = new Logger('JwtSecret')

/**
 * Retorna o segredo JWT a partir do ambiente.
 *
 * @param secret Valor lido de JWT_SECRET (via ConfigService ou process.env).
 * @throws Error se estiver em produção e o segredo estiver ausente/vazio.
 */
export function resolverJwtSecret(secret: string | undefined): string {
  const valor = secret?.trim()

  if (valor) {
    return valor
  }

  const emProducao = process.env.NODE_ENV === 'production'

  if (emProducao) {
    throw new Error(
      'JWT_SECRET não definido. É obrigatório em produção — ' +
        'defina a variável de ambiente antes de iniciar o auth-service.',
    )
  }

  logger.warn(
    'JWT_SECRET ausente — usando default de DESENVOLVIMENTO. ' +
      'NUNCA use este valor em produção.',
  )

  return DEV_FALLBACK_SECRET
}
