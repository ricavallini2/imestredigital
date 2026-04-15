/**
 * ═══════════════════════════════════════════════════════════════
 * Tenant Middleware - Multi-tenancy
 * ═══════════════════════════════════════════════════════════════
 *
 * Extrai o tenantId do JWT e o injeta no request.
 * Todas as queries subsequentes filtraram automaticamente por tenantId.
 *
 * O token JWT é decodificado para extrair:
 * - sub: usuarioId
 * - tenantId: identificador da empresa
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = this.extrairToken(req);

      if (!token) {
        // Rotas públicas podem não ter token
        // Health checks, swagger docs, etc
        return next();
      }

      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'dev-secret-trocar-em-producao',
      });

      // Injeta no request para acesso nos handlers
      (req as any).tenantId = decoded.tenantId;
      (req as any).usuarioId = decoded.sub;

      next();
    } catch (erro) {
      // Token inválido mas continua (a validação é feita por guards)
      next();
    }
  }

  private extrairToken(req: Request): string | null {
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
