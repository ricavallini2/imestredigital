import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { resolverJwtSecret } from '../common/jwt-secret';

/**
 * Payload esperado no JWT emitido pelo auth-service.
 */
export interface JwtPayload {
  sub: string;
  tenantId: string;
  email?: string;
  cargo?: string;
}

/**
 * Estratégia Passport JWT.
 *
 * Registrada para que rotas possam usar @UseGuards(AuthGuard('jwt')) quando
 * necessário. A verificação de assinatura usa o mesmo JWT_SECRET do
 * TenantMiddleware, mantendo uma única fonte de verdade para o segredo.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: resolverJwtSecret(configService.get<string>('JWT_SECRET')),
    });
  }

  /**
   * Valida o payload já verificado e o expõe no request.
   */
  async validate(payload: JwtPayload) {
    if (!payload?.tenantId) {
      throw new UnauthorizedException('Token inválido: tenantId não encontrado');
    }
    return {
      usuarioId: payload.sub,
      tenantId: payload.tenantId,
      email: payload.email,
      cargo: payload.cargo,
    };
  }
}
