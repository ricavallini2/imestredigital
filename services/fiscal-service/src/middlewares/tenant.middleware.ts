/**
 * Middleware de Tenant
 *
 * Extrai o tenantId do JWT e o adiciona ao request. Garante que todos os
 * dados fiquem filtrados por tenant.
 *
 * Segurança (Fase 0): a assinatura do token É verificada (jwt.verify com o
 * JWT_SECRET compartilhado — NUNCA jwt.decode puro). Token ausente ou
 * inválido em rota protegida → 401, sem fallback silencioso.
 *
 * Rotas públicas (health/docs): o `MiddlewareConsumer.exclude()` do NestJS
 * não casa de forma confiável quando há `setGlobalPrefix('api')` combinado
 * com `forRoutes('*')` (o path-to-regexp recebe o caminho já com o prefixo,
 * mas as regras de exclude divergem por versão). Por isso a checagem de
 * caminho público é feita AQUI dentro, de forma autoritativa e independente
 * do matcher do exclude. Assim `/api/health` responde 200 sem token.
 */

import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

/**
 * Prefixos de caminho liberados sem autenticação (probes de container,
 * documentação e webhooks de provedores externos). Comparados contra o path
 * normalizado (sem query string), cobrindo variações com/sem o prefixo
 * global `api`.
 *
 * Os webhooks do provedor fiscal (ex.: Focus NFe) são chamados PELO provedor,
 * que não possui um JWT do nosso sistema; por isso o caminho é público. O
 * isolamento multi-tenant desses gatilhos é garantido no serviço, que resolve
 * o tenant pela referência da nota no payload.
 */
const CAMINHOS_PUBLICOS = [
  '/health',
  '/api/health',
  '/docs',
  '/api/docs',
  '/v1/fiscal/webhooks',
  '/api/v1/fiscal/webhooks',
] as const;

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      usuarioId?: string;
      cargo?: string;
      usuario?: Record<string, any>;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(private readonly jwt: JwtService) {}

  /**
   * Processa a requisição, verifica a assinatura do JWT e extrai o contexto
   * do tenant. O token deve estar no header: Authorization: Bearer <token>
   */
  use(req: Request, res: Response, next: NextFunction) {
    // Libera caminhos públicos (health/docs) sem exigir token. Usa
    // originalUrl (path completo recebido pelo Express) e ignora a query
    // string, cobrindo /api/health e /api/health/* de forma robusta.
    if (this.ehCaminhoPublico(req)) {
      return next();
    }

    const token = this.extrairToken(req);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    let payload: any;
    try {
      // Verifica a ASSINATURA e a expiração do token (não apenas decodifica).
      payload = this.jwt.verify(token);
    } catch (erro) {
      this.logger.warn(`Token inválido ou expirado: ${erro.message}`);
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    if (!payload?.tenantId) {
      throw new UnauthorizedException('Token inválido: tenantId não encontrado');
    }

    // Popula o contexto da requisição a partir do token verificado.
    req.tenantId = payload.tenantId;
    req.usuarioId = payload.sub || payload.usuarioId;
    req.cargo = payload.cargo;
    req.usuario = payload;

    this.logger.debug(`Tenant ${req.tenantId} autenticado`);
    next();
  }

  /**
   * Determina se a requisição é para um caminho público (health/docs), que
   * não exige autenticação. Normaliza o path (sem query string) e casa por
   * prefixo, cobrindo tanto a raiz do recurso (`/api/health`) quanto
   * sub-rotas (`/api/health/ready`).
   *
   * @param req - Request HTTP
   * @returns true se o caminho for público
   */
  private ehCaminhoPublico(req: Request): boolean {
    // originalUrl inclui o prefixo global e a query; baseUrl+path também
    // servem, mas originalUrl é o mais fiel ao que o cliente chamou.
    const caminhoBruto = (req.originalUrl || req.url || '').split('?')[0];
    // Normaliza barra final para casar '/api/health' e '/api/health/'.
    const caminho = caminhoBruto.replace(/\/+$/, '') || '/';

    return CAMINHOS_PUBLICOS.some(
      (publico) => caminho === publico || caminho.startsWith(`${publico}/`),
    );
  }

  /**
   * Extrai o token JWT do header Authorization.
   *
   * @param req - Request HTTP
   * @returns Token ou null
   */
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
