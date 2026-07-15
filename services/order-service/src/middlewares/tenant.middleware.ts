/**
 * ═══════════════════════════════════════════════════════════════
 * Tenant Middleware - Multi-tenancy
 * ═══════════════════════════════════════════════════════════════
 *
 * Extrai o tenantId do JWT e o injeta no request. Todas as queries
 * subsequentes filtram automaticamente por tenantId.
 *
 * Segurança (Fase 0):
 * - Verifica a ASSINATURA e a expiração do token (jwt.verify), NUNCA
 *   decode puro.
 * - Sem fallback silencioso: token ausente/inválido/expirado em rota
 *   protegida → 401. Token válido sem tenantId → 401.
 *
 * O token JWT é verificado para extrair:
 * - sub: usuarioId
 * - tenantId: identificador da empresa
 * - cargo: papel do usuário (para RBAC)
 *
 * Rotas públicas (health/docs/webhooks): o `MiddlewareConsumer.exclude()` do
 * NestJS NÃO casa de forma confiável quando há `setGlobalPrefix('api')`
 * combinado com versionamento URI e `forRoutes('*')` — o middleware é montado
 * num sub-router onde o path visto pelo matcher diverge do caminho real
 * chamado pelo cliente. Por isso a liberação de caminhos públicos é feita AQUI
 * dentro, de forma autoritativa e independente do matcher do exclude, exatamente
 * como fiscal/inventory/catalog. Assim `/api/v1/health` responde 200 sem token
 * (probe do Docker) mesmo que o exclude do módulo não pegue.
 */

import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

// Estende a interface Request para incluir os dados extraídos do JWT
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      tenantId?: string;
      usuarioId?: string;
      cargo?: string;
    }
  }
}

/**
 * Prefixos de caminho liberados sem autenticação. Comparados contra o path
 * normalizado (sem query string, sem barra final), cobrindo variações com/sem
 * o prefixo global `api` e a versão `v1`.
 *
 * - health/docs: probes de container e Swagger.
 * - pagamentos/webhook: chamado PELO gateway de pagamento, que não possui um
 *   JWT do nosso sistema; o isolamento multi-tenant é resolvido no serviço a
 *   partir da credencial/payload do webhook (ver TODO Fase 1 no PagamentoService).
 */
const CAMINHOS_PUBLICOS = [
  '/health',
  '/api/health',
  '/api/v1/health',
  '/docs',
  '/api/docs',
  '/pagamentos/webhook',
  '/api/v1/pagamentos/webhook',
] as const;

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Libera caminhos públicos (health/docs/webhook) sem exigir token, antes
    // de qualquer verificação de JWT. Independe do exclude() do módulo.
    if (this.ehCaminhoPublico(req)) {
      return next();
    }

    const token = this.extrairToken(req);

    if (!token) {
      throw new UnauthorizedException('Token de autenticação não fornecido');
    }

    try {
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
      // Preserva a mensagem específica (ex.: tenantId ausente); demais viram 401 genérico.
      if (erro instanceof UnauthorizedException) {
        throw erro;
      }
      this.logger.warn(`Falha na autenticação: ${erro?.message ?? erro}`);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  /**
   * Determina se a requisição é para um caminho público (health/docs/webhook),
   * que não exige autenticação. Normaliza o path (sem query string, sem barra
   * final) e casa por prefixo — cobre tanto a raiz (`/api/v1/health`) quanto
   * sub-rotas (`/api/v1/health/ready`).
   *
   * Usa `originalUrl` (caminho completo, com prefixo global, recebido pelo
   * Express), com fallback para `url`, pois em sub-routers o `req.path` pode
   * vir stripado do prefixo.
   */
  private ehCaminhoPublico(req: Request): boolean {
    const caminhoBruto = (req.originalUrl || req.url || '').split('?')[0];
    const caminho = caminhoBruto.replace(/\/+$/, '') || '/';

    return CAMINHOS_PUBLICOS.some(
      (publico) => caminho === publico || caminho.startsWith(`${publico}/`),
    );
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
