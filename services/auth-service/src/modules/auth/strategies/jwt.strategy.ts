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
      // Chave secreta para verificar assinatura
      secretOrKey: configService.get('JWT_SECRET', 'dev-secret-trocar-em-producao'),
      // Valida issuer e audience
      issuer: 'imestredigital',
      audience: 'imestredigital-api',
    });
  }

  /**
   * Método chamado após o JWT ser decodificado com sucesso.
   * Valida se o usuário ainda existe e está ativo.
   *
   * @param payload - Dados decodificados do JWT
   * @returns Objeto que será injetado em req.user
   */
  async validate(payload: any) {
    // Verifica se o usuário ainda existe e está ativo
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: { id: true, status: true, tenantId: true, cargo: true },
    });

    if (!usuario || usuario.status !== 'ativo') {
      throw new UnauthorizedException('Token inválido ou usuário desativado');
    }

    // Retorna dados que ficarão disponíveis em req.user
    return {
      usuarioId: payload.sub,
      tenantId: payload.tenantId,
      email: payload.email,
      cargo: payload.cargo,
    };
  }
}
