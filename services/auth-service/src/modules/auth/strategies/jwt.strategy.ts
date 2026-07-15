/**
 * Estratégia JWT para Passport.
 *
 * Extrai e valida o token JWT de cada requisição autenticada.
 * O token vem no header Authorization: Bearer <token>.
 *
 * Após validação, o payload do JWT é injetado em req.user,
 * disponibilizando tenantId e usuarioId em todos os controllers.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../prisma/prisma.service';
import { resolverJwtSecret } from '../../../common/jwt-secret';

/** Payload decodificado do JWT (assinatura já verificada pelo Passport). */
interface JwtPayload {
  sub: string; // ID do usuário
  tenantId: string; // ID do tenant (empresa)
  email: string; // Email do usuário
  cargo: string; // Cargo/role (lowercase no token)
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // Extrai JWT do header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Não ignora expiração — tokens expirados são rejeitados
      ignoreExpiration: false,
      // Chave secreta para verificar a ASSINATURA do token (jwt.verify).
      // Fail-fast em produção se JWT_SECRET estiver ausente.
      secretOrKey: resolverJwtSecret(configService.get<string>('JWT_SECRET')),
      // Valida issuer e audience
      issuer: 'imestredigital',
      audience: 'imestredigital-api',
    });
  }

  /**
   * Método chamado após o JWT ser decodificado com sucesso.
   * Valida se o usuário ainda existe e está ativo.
   *
   * @param payload - Dados decodificados do JWT (assinatura já verificada)
   * @returns Objeto que será injetado em req.user
   */
  async validate(payload: JwtPayload) {
    // Verifica se o usuário ainda existe e está ativo
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: { id: true, status: true, tenantId: true, cargo: true },
    });

    if (!usuario || usuario.status !== 'ATIVO') {
      throw new UnauthorizedException('Token inválido ou usuário desativado');
    }

    // Retorna dados que ficarão disponíveis em req.user.
    // cargo em lowercase (contrato do JWT); a fonte da verdade continua
    // sendo o banco, revalidado acima.
    return {
      usuarioId: payload.sub,
      tenantId: usuario.tenantId,
      email: payload.email,
      cargo: usuario.cargo.toLowerCase(),
    };
  }
}
