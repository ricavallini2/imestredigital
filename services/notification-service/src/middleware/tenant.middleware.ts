/**
 * Middleware de Tenant.
 *
 * Extrai o token JWT do header Authorization, VERIFICA a assinatura
 * (jwt.verify com JWT_SECRET — nunca decode puro) e popula
 * req.tenantId / req.usuarioId / req.cargo para isolamento multi-tenant.
 *
 * Regra de segurança da Fase 0:
 * - Token ausente ou inválido em rota protegida → 401 (UnauthorizedException).
 * - Sem fallback silencioso: se a verificação falhar, a requisição é barrada.
 */

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { resolverJwtSecret } from '../common/jwt-secret'

export interface RequestComTenant extends Request {
  tenantId?: string
  usuarioId?: string
  cargo?: string
  usuario?: Record<string, unknown>
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name)
  private readonly segredo: string

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Resolve o segredo uma única vez (fail-fast em produção sem JWT_SECRET).
    this.segredo = resolverJwtSecret(
      this.configService.get<string>('JWT_SECRET'),
    )
  }

  use(req: RequestComTenant, res: Response, next: NextFunction) {
    const token = this.extrairToken(req)

    if (!token) {
      throw new UnauthorizedException('Token JWT não fornecido')
    }

    try {
      // Verifica a ASSINATURA do token (não é decode puro).
      const payload = this.jwtService.verify(token, {
        secret: this.segredo,
        issuer: 'imestredigital',
        audience: 'imestredigital-api',
      })

      if (!payload?.tenantId) {
        throw new UnauthorizedException(
          'Token inválido: tenantId não encontrado',
        )
      }

      req.tenantId = payload.tenantId
      req.usuarioId = payload.sub ?? payload.usuarioId
      req.cargo =
        typeof payload.cargo === 'string'
          ? payload.cargo.toLowerCase()
          : undefined
      req.usuario = payload

      next()
    } catch (erro) {
      if (erro instanceof UnauthorizedException) {
        throw erro
      }
      this.logger.warn(
        `Falha ao verificar token: ${(erro as Error)?.message ?? erro}`,
      )
      throw new UnauthorizedException('Token JWT inválido ou expirado')
    }
  }

  /** Extrai o token JWT do header Authorization: Bearer <token>. */
  private extrairToken(req: RequestComTenant): string | null {
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
