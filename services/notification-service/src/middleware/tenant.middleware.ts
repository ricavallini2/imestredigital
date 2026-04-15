/**
 * Middleware de Tenant.
 *
 * Extrai o tenantId do JWT e o coloca no request.
 * Todos os controladores devem usar este middleware para garantir
 * isolamento de dados multi-tenant.
 */

import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Tenta extrair do header Authorization
      const authorization = req.headers.authorization;

      if (!authorization) {
        throw new BadRequestException('Token JWT não fornecido');
      }

      const token = authorization.replace('Bearer ', '');
      const payload = this.jwtService.verify(token);

      // Armazena tenantId no request
      (req as any).tenantId = payload.tenantId;
      (req as any).usuarioId = payload.sub;

      next();
    } catch (erro) {
      throw new BadRequestException('Token JWT inválido');
    }
  }
}
