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

// Estende a interface Request para incluir os dados extraídos do JWT
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      usuarioId?: string;
      cargo?: string;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Rotas públicas não precisam de tenant
    // Usa originalUrl porque NestJS com setGlobalPrefix + URI versioning
    // monta o middleware num sub-router onde req.path é stripado (ex: "/" ao invés de "/api/v1/health")
    const url = req.originalUrl || req.url;
    if (url.includes('/health') || url.includes('/docs')) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação não fornecido');
    }

    try {
      const token = authHeader.split(' ')[1];
      // Verifica a ASSINATURA e a expiração do token (nunca decode puro).
      const payload = this.jwtService.verify(token);

      // Token válido mas sem tenant → não autoriza (evita queries sem isolamento).
      if (!payload?.tenantId) {
        throw new UnauthorizedException('Token inválido: tenantId ausente');
      }

      // Injeta contexto de tenant/usuário na requisição.
      req.tenantId = payload.tenantId;
      req.usuarioId = payload.sub ?? payload.usuarioId;
      req.cargo = payload.cargo;

      next();
    } catch (erro) {
      // Preserva a mensagem específica de tenantId ausente; demais viram 401 genérico.
      if (erro instanceof UnauthorizedException) {
        throw erro;
      }
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
