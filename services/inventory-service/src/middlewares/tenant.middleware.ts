/**
 * Middleware de Tenant - Extrai tenant ID do JWT e injeta no Request.
 * Padrão: Mesmo do Catalog Service.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Extrai o token do header Authorization
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = this.jwt.verify(token);
        (req as any).tenantId = decoded.tenantId;
      } catch (error) {
        // Token inválido, continua sem tenantId
      }
    }
    next();
  }
}
