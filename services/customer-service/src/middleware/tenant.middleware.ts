/**
 * Middleware de Tenant
 *
 * Extrai o tenantId do JWT e adiciona ao request.
 * Garante que todos os dados estejam filtrados por tenant.
 */

import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

export interface RequestComTenant extends Request {
  tenantId?: string;
  usuarioId?: string;
  usuario?: Record<string, any>;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(private jwtService: JwtService) {}

  use(req: RequestComTenant, res: Response, next: NextFunction) {
    try {
      // Obtém token do header Authorization
      const token = this.extrairToken(req);

      if (!token) {
        throw new UnauthorizedException('Token não fornecido');
      }

      // Valida e decodifica token
      const payload = this.jwtService.verify(token);

      // Verifica se tenantId existe no payload
      if (!payload.tenantId) {
        throw new UnauthorizedException('Token inválido: tenantId não encontrado');
      }

      // Adiciona tenantId e usuarioId ao request
      req.tenantId = payload.tenantId;
      req.usuarioId = payload.sub || payload.usuarioId;
      req.usuario = payload;

      this.logger.debug(`Tenant ${req.tenantId} autenticado`);
      next();
    } catch (erro) {
      this.logger.warn(`Erro ao extrair tenant: ${erro.message}`);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  /**
   * Extrai o token JWT do header Authorization
   *
   * @param req - Request HTTP
   * @returns Token ou null
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
