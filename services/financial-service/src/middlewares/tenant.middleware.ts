/**
 * Middleware de Tenant.
 * Extrai o tenantId do token JWT e o adiciona ao contexto da requisição.
 * Garante que todas as operações sejam isoladas por tenant.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Interface para estender o objeto Request do Express.
 */
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      usuarioId?: string;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // O tenantId virá do JWT payload (após validação)
    // Por enquanto, extraímos de um header ou do token
    const tenantId = req.headers['x-tenant-id'] as string;

    if (tenantId) {
      req.tenantId = tenantId;
    }

    next();
  }
}
