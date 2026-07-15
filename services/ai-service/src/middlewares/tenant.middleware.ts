/**
 * Middleware de Multi-tenancy
 *
 * Verifica a ASSINATURA do JWT (jwt.verify com JWT_SECRET, nunca decode puro)
 * e disponibiliza tenantId/usuarioId/cargo em todo o contexto da requisição.
 *
 * Sem fallback silencioso: token ausente/inválido/expirado → 401.
 *
 * Rotas públicas (health/docs): o `MiddlewareConsumer.exclude()` do NestJS NÃO
 * casa de forma confiável quando há `setGlobalPrefix('api')` combinado com
 * versionamento URI e `forRoutes('*')` — o middleware é montado num sub-router
 * onde o path visto pelo matcher diverge do caminho real chamado pelo cliente.
 * Por isso a liberação de caminhos públicos é feita AQUI dentro, de forma
 * autoritativa e independente do matcher do exclude, exatamente como
 * order/fiscal/inventory/catalog. Assim `/api/v1/saude` responde 200 sem token
 * (probe do Docker) mesmo que o exclude do módulo não pegue.
 */

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { JwtService } from '@nestjs/jwt'

// Estender interface do Express para incluir contexto de tenant
declare global {
  namespace Express {
    interface Request {
      tenantId?: string
      usuarioId?: string
      cargo?: string
    }
  }
}

interface JwtPayload {
  sub?: string
  usuarioId?: string
  tenantId?: string
  cargo?: string
}

/**
 * Prefixos de caminho liberados sem autenticação. Comparados contra o path
 * normalizado (sem query string, sem barra final), cobrindo variações com/sem
 * o prefixo global `api` e a versão `v1`.
 *
 * - saude: probe de container (health check do Docker → GET /api/v1/saude).
 * - docs: Swagger/OpenAPI.
 */
const CAMINHOS_PUBLICOS = [
  '/saude',
  '/api/saude',
  '/api/v1/saude',
  '/docs',
  '/api/docs',
] as const

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name)

  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    // Libera caminhos públicos (health/docs) sem exigir token, antes de
    // qualquer verificação de JWT. Independe do exclude() do módulo.
    if (this.ehCaminhoPublico(req)) {
      return next()
    }

    const token = this.extrairToken(req)

    if (!token) {
      throw new UnauthorizedException('Token não fornecido')
    }

    try {
      // verify (não decode) — valida assinatura e expiração
      const payload = this.jwtService.verify<JwtPayload>(token)

      if (!payload.tenantId) {
        throw new UnauthorizedException('Token inválido: tenantId não encontrado')
      }

      req.tenantId = payload.tenantId
      req.usuarioId = payload.sub ?? payload.usuarioId
      req.cargo = payload.cargo

      next()
    } catch (erro) {
      // Repassa o 401 já formatado; qualquer outro erro vira 401 genérico
      if (erro instanceof UnauthorizedException) {
        throw erro
      }
      this.logger.warn(`Falha ao validar token: ${(erro as Error).message}`)
      throw new UnauthorizedException('Token inválido ou expirado')
    }
  }

  /**
   * Determina se a requisição é para um caminho público (health/docs), que não
   * exige autenticação. Normaliza o path (sem query string, sem barra final) e
   * casa por prefixo — cobre tanto a raiz (`/api/v1/saude`) quanto sub-rotas
   * (`/api/v1/saude/detalhado`).
   *
   * Usa `originalUrl` (caminho completo, com prefixo global, recebido pelo
   * Express), com fallback para `url`, pois em sub-routers o `req.path` pode
   * vir stripado do prefixo.
   */
  private ehCaminhoPublico(req: Request): boolean {
    const caminhoBruto = (req.originalUrl || req.url || '').split('?')[0]
    const caminho = caminhoBruto.replace(/\/+$/, '') || '/'

    return CAMINHOS_PUBLICOS.some(
      (publico) => caminho === publico || caminho.startsWith(`${publico}/`),
    )
  }

  /**
   * Extrai o token JWT do header Authorization (Bearer).
   */
  private extrairToken(req: Request): string | null {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return null
    }

    const partes = authHeader.split(' ')

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return null
    }

    return partes[1]
  }
}
