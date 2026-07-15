/**
 * Estratégia JWT do Passport.
 *
 * Valida a assinatura do token (HS256 com JWT_SECRET) e expõe o payload
 * no `req.user`. Registrada globalmente via PassportModule + JwtAuthGuard.
 *
 * Payload esperado (emitido pelo auth-service):
 *   { sub, tenantId, email, cargo }
 */

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

import { resolverJwtSecret } from '../../../common/jwt-secret'

/** Formato do payload após validação bem-sucedida. */
export interface UsuarioAutenticado {
  usuarioId: string
  tenantId: string
  email?: string
  cargo?: string
}

/** Estrutura crua do payload assinado no JWT. */
interface JwtPayload {
  sub?: string
  usuarioId?: string
  tenantId?: string
  email?: string
  cargo?: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: resolverJwtSecret(config.get<string>('JWT_SECRET')),
    })
  }

  /**
   * Executado após a verificação da assinatura. O retorno vira `req.user`.
   * Exige tenantId — sem ele o token não é utilizável em rota multi-tenant.
   */
  validate(payload: JwtPayload): UsuarioAutenticado {
    if (!payload?.tenantId) {
      throw new UnauthorizedException('Token inválido: tenantId ausente')
    }

    return {
      usuarioId: payload.sub ?? payload.usuarioId ?? '',
      tenantId: payload.tenantId,
      email: payload.email,
      cargo: payload.cargo,
    }
  }
}
