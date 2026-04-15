/**
 * Guard de Autenticação
 *
 * Protege rotas verificando se o usuário tem um token JWT válido.
 */

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extrairToken(request);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const payload = this.jwtService.verify(token);

      // Valida presença de tenantId
      if (!payload.tenantId) {
        throw new UnauthorizedException('Token inválido: tenantId não encontrado');
      }

      // Adiciona payload ao request para uso posterior
      request.usuario = payload;
      request.tenantId = payload.tenantId;
      request.usuarioId = payload.sub || payload.usuarioId;

      return true;
    } catch (erro) {
      this.logger.warn(`Autenticação falhou: ${erro.message}`);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  /**
   * Extrai o token JWT do header Authorization
   *
   * @param request - Request HTTP
   * @returns Token ou null
   */
  private extrairToken(request: any): string | null {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return null;
    }

    const partes = authHeader.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return null;
    }

    return partes[1];
  }
}
