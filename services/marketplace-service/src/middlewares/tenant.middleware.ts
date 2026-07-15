import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

/**
 * Request enriquecido com dados extraídos do JWT.
 */
export interface RequestComTenant extends Request {
  tenantId?: string;
  usuarioId?: string;
  cargo?: string;
  usuario?: Record<string, any>;
}

/**
 * Middleware de Tenant.
 *
 * Verifica a ASSINATURA do JWT (jwt.verify com JWT_SECRET) e popula
 * req.tenantId / req.usuarioId / req.cargo. Nunca usa jwt.decode puro.
 * Token ausente ou inválido em rota protegida resulta em 401.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  use(req: RequestComTenant, res: Response, next: NextFunction) {
    const token = this.extrairToken(req);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    let payload: Record<string, any>;
    try {
      // verify (não decode) — valida a assinatura com o JWT_SECRET.
      payload = this.jwtService.verify(token);
    } catch (erro) {
      this.logger.warn(`Falha ao verificar token: ${(erro as Error).message}`);
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    if (!payload.tenantId) {
      throw new UnauthorizedException('Token inválido: tenantId não encontrado');
    }

    req.tenantId = payload.tenantId;
    req.usuarioId = payload.sub || payload.usuarioId;
    req.cargo = payload.cargo;
    req.usuario = payload;

    this.logger.debug(`Tenant ${req.tenantId} autenticado`);
    next();
  }

  /**
   * Extrai o token JWT do header Authorization (Bearer).
   */
  private extrairToken(req: RequestComTenant): string | null {
    const authHeader = req.headers.authorization;

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
