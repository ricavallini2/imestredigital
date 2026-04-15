/**
 * Middleware de Tenant.
 *
 * Extrai o tenantId do token JWT decodificado e injeta
 * no contexto da requisição. Garante que toda query ao
 * banco inclua o filtro por tenant automaticamente.
 *
 * O tenantId é propagado para:
 * - req.tenantId (acesso direto)
 * - Repositories (filtro automático)
 * - Eventos Kafka (header do evento)
 */

import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

// Estende a interface Request para incluir tenantId
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
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Rotas públicas não precisam de tenant
    if (req.path.includes('/health') || req.path.includes('/docs')) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação não fornecido');
    }

    try {
      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify(token);

      // Injeta tenantId e usuarioId na requisição
      req.tenantId = payload.tenantId;
      req.usuarioId = payload.sub;

      next();
    } catch (erro) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
