/**
 * Middleware de Tenant.
 *
 * Extrai e VERIFICA a assinatura do token JWT (nunca decode puro),
 * populando req.tenantId / req.usuarioId / req.cargo no contexto da
 * requisição. Garante isolamento por tenant em todas as operações.
 *
 * Regra de segurança (Fase 0): token ausente ou inválido em rota
 * protegida resulta em 401. Não há fallback silencioso por header.
 */

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Request, Response, NextFunction } from 'express'

/**
 * Interface para estender o objeto Request do Express.
 */
declare global {
  namespace Express {
    interface Request {
      tenantId?: string
      usuarioId?: string
      cargo?: string
    }
  }
}

/** Estrutura esperada do payload do JWT emitido pelo auth-service. */
interface JwtPayload {
  sub: string
  tenantId: string
  email?: string
  cargo?: string
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const token = this.extrairToken(req)

    if (!token) {
      throw new UnauthorizedException('Token de autenticação ausente')
    }

    let payload: JwtPayload
    try {
      // Verifica a ASSINATURA do token (jwt.verify), nunca decode puro.
      payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        issuer: 'imestredigital',
        audience: 'imestredigital-api',
      })
    } catch {
      throw new UnauthorizedException('Token de autenticação inválido')
    }

    if (!payload?.tenantId) {
      throw new UnauthorizedException('Token sem tenant válido')
    }

    req.tenantId = payload.tenantId
    req.usuarioId = payload.sub
    req.cargo = payload.cargo

    next()
  }

  /** Extrai o token do header Authorization: Bearer <token>. */
  private extrairToken(req: Request): string | undefined {
    const authorization = req.headers.authorization
    if (!authorization) return undefined

    const [tipo, token] = authorization.split(' ')
    if (tipo !== 'Bearer' || !token) return undefined

    return token
  }
}
