/**
 * Middleware de Multi-tenancy
 *
 * Extrai o tenant ID da requisição (header ou JWT)
 * e o disponibiliza em todo o contexto da aplicação
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Estender interface do Express para incluir tenantId
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
    // Estratégia 1: Tenant do header customizado
    let tenantId = req.headers['x-tenant-id'] as string;

    // Estratégia 2: Extrair do JWT (se houver)
    if (!tenantId && req.headers.authorization) {
      try {
        // Aqui você decodificaria o JWT e extrairia o tenantId
        // Por enquanto, deixamos como fallback
        const token = req.headers.authorization.replace('Bearer ', '');
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // tenantId = decoded.tenantId;
      } catch (e) {
        // Ignorar erro, usar fallback
      }
    }

    // Fallback: usar tenant padrão em desenvolvimento
    if (!tenantId) {
      tenantId = process.env.DEFAULT_TENANT_ID || 'tenant-dev-001';
    }

    // Armazenar no request para uso posterior
    req.tenantId = tenantId;

    // Também extrair usuarioId se disponível
    const usuarioId = req.headers['x-usuario-id'] as string;
    if (usuarioId) {
      req.usuarioId = usuarioId;
    }

    next();
  }
}
