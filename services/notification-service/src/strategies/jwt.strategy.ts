/**
 * Estratégia JWT para Passport.
 *
 * Extrai e valida (verifica a ASSINATURA de) o token JWT de cada requisição
 * autenticada. O token vem no header Authorization: Bearer <token>.
 *
 * Após a verificação da assinatura pelo passport-jwt, o payload é injetado
 * em req.user, disponibilizando tenantId, usuarioId, email e cargo em todos
 * os controllers.
 *
 * IMPORTANTE: o notification-service NÃO possui tabela de usuários — a fonte
 * da verdade da identidade é o auth-service. Aqui apenas confiamos no token
 * já verificado (assinatura + issuer + audience + expiração).
 */

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

import { resolverJwtSecret } from '../common/jwt-secret'

/** Payload decodificado do JWT (assinatura já verificada pelo Passport). */
interface JwtPayload {
  sub: string // ID do usuário
  tenantId: string // ID do tenant (empresa)
  email: string // Email do usuário
  cargo: string // Cargo/role (lowercase no token)
  iat?: number
  exp?: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // Extrai JWT do header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Não ignora expiração — tokens expirados são rejeitados
      ignoreExpiration: false,
      // Chave secreta para verificar a ASSINATURA do token (jwt.verify).
      // Fail-fast em produção se JWT_SECRET estiver ausente.
      secretOrKey: resolverJwtSecret(configService.get<string>('JWT_SECRET')),
      // Valida issuer e audience (mesmo contrato do auth-service)
      issuer: 'imestredigital',
      audience: 'imestredigital-api',
    })
  }

  /**
   * Chamado após a assinatura do JWT ser verificada com sucesso.
   * Garante que o token carrega o tenantId (isolamento multi-tenant).
   *
   * @param payload - Dados decodificados do JWT (assinatura já verificada)
   * @returns Objeto injetado em req.user
   */
  async validate(payload: JwtPayload) {
    if (!payload?.tenantId) {
      throw new UnauthorizedException(
        'Token inválido: tenantId ausente no payload',
      )
    }

    // Disponibiliza ambos `sub` e `usuarioId` para compatibilidade com os
    // controllers existentes (que leem req.user?.sub ou req.usuarioId).
    return {
      sub: payload.sub,
      usuarioId: payload.sub,
      tenantId: payload.tenantId,
      email: payload.email,
      cargo: payload.cargo?.toLowerCase(),
    }
  }
}
