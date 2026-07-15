/**
 * Testes do TenantMiddleware — foco na liberação de caminhos públicos
 * (health/docs/webhooks) e na exigência de token nas rotas protegidas.
 *
 * Prova que `/api/health` responde SEM token (correção do 401 no health),
 * independentemente do matcher de `exclude()` do NestJS.
 */

import { UnauthorizedException } from '@nestjs/common'
import { TenantMiddleware } from './tenant.middleware'

/** JwtService fake: verify() devolve um payload fixo com tenantId. */
const jwtFake = {
  verify: jest.fn().mockReturnValue({
    sub: 'user-1',
    tenantId: '10000000-0000-0000-0000-000000000001',
    cargo: 'admin',
  }),
} as any

/** Monta um request mínimo compatível com o que o middleware lê. */
function req(originalUrl: string, authorization?: string) {
  return {
    originalUrl,
    url: originalUrl,
    headers: authorization ? { authorization } : {},
  } as any
}

describe('TenantMiddleware — caminhos públicos', () => {
  const middleware = new TenantMiddleware(jwtFake)

  beforeEach(() => jest.clearAllMocks())

  it('/api/health é público: chama next() sem exigir token', () => {
    const next = jest.fn()
    middleware.use(req('/api/health'), {} as any, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(jwtFake.verify).not.toHaveBeenCalled()
  })

  it('/api/health/ready (sub-rota) também é público', () => {
    const next = jest.fn()
    middleware.use(req('/api/health/ready'), {} as any, next)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('/api/health com query string é público', () => {
    const next = jest.fn()
    middleware.use(req('/api/health?verbose=1'), {} as any, next)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('rota protegida sem token → 401', () => {
    const next = jest.fn()
    expect(() =>
      middleware.use(req('/api/v1/notas-fiscais'), {} as any, next),
    ).toThrow(UnauthorizedException)
    expect(next).not.toHaveBeenCalled()
  })

  it('rota protegida com token válido → popula tenantId e chama next()', () => {
    const next = jest.fn()
    const request = req('/api/v1/notas-fiscais', 'Bearer token-valido')
    middleware.use(request, {} as any, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(request.tenantId).toBe('10000000-0000-0000-0000-000000000001')
  })
})
