import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para extrair e validar tenant do header da requisição
 * Todo request deve conter o header x-tenant-id
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;

    // Validar se tenantId foi fornecido
    if (!tenantId) {
      throw new UnauthorizedException(
        'Header x-tenant-id é obrigatório',
      );
    }

    // Validar formato básico do tenantId (não pode estar vazio)
    if (typeof tenantId !== 'string' || tenantId.trim().length === 0) {
      throw new UnauthorizedException(
        'x-tenant-id deve ser uma string válida',
      );
    }

    // Adicionar tenantId ao objeto Request para uso nos controllers/services
    (req as any).tenantId = tenantId.trim();

    // Adicionar tenantId aos locals do Express para fácil acesso em templates
    res.locals.tenantId = tenantId.trim();

    next();
  }
}

/**
 * Declare a propriedade tenantId no objeto Request
 * Usar em request.ts ou types/express.d.ts
 */
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}
