/**
 * Middleware de Tenant
 * Extrai o tenantId do JWT e o armazena no contexto da requisição.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

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
  constructor(private readonly jwt: JwtService) {}

  /**
   * Processa a requisição e extrai tenantId do token JWT.
   * O token deve estar no header: Authorization: Bearer <token>
   */
  use(req: Request, res: Response, next: NextFunction) {
    // Extrai o token do header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    try {
      // Decodifica o JWT (sem validar assinatura, apenas lê o payload)
      const payload = this.jwt.decode(token) as any;

      if (payload) {
        req.tenantId = payload.tenantId;
        req.usuarioId = payload.sub || payload.usuarioId;
      }
    } catch (erro) {
      // Se o token for inválido, apenas continua sem extrair tenantId
      // A validação completa do JWT é feita por guards específicos
    }

    next();
  }
}
