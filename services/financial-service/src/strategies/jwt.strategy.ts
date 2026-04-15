/**
 * Estratégia JWT para Passport no Financial Service.
 *
 * Microserviço: valida assinatura e extrai payload do JWT
 * sem consultar o banco de dados (responsabilidade do auth-service).
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'dev-secret-trocar-em-producao'),
      issuer: 'imestredigital',
      audience: 'imestredigital-api',
    });
  }

  async validate(payload: any) {
    return {
      usuarioId: payload.sub,
      tenantId: payload.tenantId,
      email: payload.email,
      cargo: payload.cargo,
    };
  }
}
