import { gerarState, validarState } from './oauth-state'

describe('OAuth state (HMAC anti-CSRF)', () => {
  const chave = 'chave-secreta-hmac-do-state'
  const tenantId = '10000000-0000-0000-0000-000000000001'

  it('gera e valida, extraindo o tenantId embutido', () => {
    const state = gerarState(tenantId, chave)
    expect(validarState(state, chave)).toBe(tenantId)
  })

  it('rejeita state com assinatura de outra chave', () => {
    const state = gerarState(tenantId, chave)
    expect(validarState(state, 'chave-diferente')).toBeNull()
  })

  it('rejeita state adulterado no payload', () => {
    const state = gerarState(tenantId, chave)
    const [payload, assinatura] = state.split('.')
    const outroPayload = Buffer.from('tenant-falso:nonce:0', 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    const forjado = `${outroPayload}.${assinatura}`
    void payload
    expect(validarState(forjado, chave)).toBeNull()
  })

  it('rejeita formatos inválidos', () => {
    expect(validarState('', chave)).toBeNull()
    expect(validarState('sem-separador', chave)).toBeNull()
    expect(validarState('a.b.c', chave)).toBeNull()
  })

  it('nonce muda a cada geração', () => {
    const s1 = gerarState(tenantId, chave)
    const s2 = gerarState(tenantId, chave)
    expect(s1).not.toBe(s2)
    // Ambos válidos e apontando para o mesmo tenant.
    expect(validarState(s1, chave)).toBe(tenantId)
    expect(validarState(s2, chave)).toBe(tenantId)
  })
})
