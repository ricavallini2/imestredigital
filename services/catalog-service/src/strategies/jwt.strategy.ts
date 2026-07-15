/**
 * Estratégia JWT para Passport no Catalog Service.
 *
 * Microserviço: valida a ASSINATURA e a expiração do JWT e extrai o
 * payload, sem consultar o banco (a validação de existência/estado do
 * usuário é responsabilidade do auth-service). O segredo é o mesmo
 * compartilhado por todos os serviços (JWT_SECRET), garantindo que um
 * token emitido pelo auth-service seja aceito aqui.
 *
 * Após validar, o retorno de `validate` é injetado em `req.user`.
 */

import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

import { resolverJwtSecret } from '../config/jwt.config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: resolverJwtSecret(configService),
      issuer: 'imestredigital',
      audience: 'imestredigital-api',
    })
  }

  async validate(payload: any) {
    return {
      usuarioId: payload.sub,
      tenantId: payload.tenantId,
      email: payload.email,
      cargo: payload.cargo,
    }
  }
}
