/**
 * Estratégia JWT para Passport no Financial Service.
 *
 * Microserviço: valida assinatura e extrai payload do JWT
 * sem consultar o banco de dados (responsabilidade do auth-service).
 *
 * Segurança (Fase 0): sem fallback silencioso de segredo. Em produção
 * o JWT_SECRET é obrigatório; em dev usa default explícito com aviso.
 */

import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Resolve o segredo JWT com política de fail-fast.
 * Em produção, ausência do segredo interrompe o bootstrap.
 */
function resolverJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');
  if (secret) return secret;

  if (configService.get<string>('NODE_ENV') === 'production') {
    throw new Error(
      'JWT_SECRET é obrigatório em produção. Configure a variável de ambiente.',
    );
  }

  new Logger('JwtStrategy').warn(
    'JWT_SECRET não definido — usando segredo de desenvolvimento. NÃO use em produção.',
  );
  return 'dev-secret-financial-local';
}

interface JwtPayload {
  sub: string;
  tenantId: string;
  email?: string;
  cargo?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: resolverJwtSecret(configService),
      issuer: 'imestredigital',
      audience: 'imestredigital-api',
    });
  }

  async validate(payload: JwtPayload) {
    return {
      usuarioId: payload.sub,
      tenantId: payload.tenantId,
      email: payload.email,
      cargo: payload.cargo,
    };
  }
}
