import { CriptoToken, derivarChaveCripto } from './cripto-token'

describe('CriptoToken (AES-256-GCM)', () => {
  const chaveHex = 'a'.repeat(64) // 32 bytes em hex
  const cripto = new CriptoToken(chaveHex)

  it('round-trip: descriptografar(criptografar(x)) === x', () => {
    const plano = 'APP_USR-123456-token-secreto-do-mercado-livre'
    const cifrado = cripto.criptografar(plano)

    expect(cifrado).not.toBeNull()
    expect(cifrado).not.toBe(plano)
    expect(cifrado!.startsWith('enc:v1:')).toBe(true)
    expect(cripto.descriptografar(cifrado)).toBe(plano)
  })

  it('gera IV aleatório: dois ciphertexts do mesmo plano diferem', () => {
    const plano = 'mesmo-token'
    const a = cripto.criptografar(plano)
    const b = cripto.criptografar(plano)
    expect(a).not.toBe(b)
    expect(cripto.descriptografar(a)).toBe(plano)
    expect(cripto.descriptografar(b)).toBe(plano)
  })

  it('trata null/vazio sem quebrar', () => {
    expect(cripto.criptografar(null)).toBeNull()
    expect(cripto.criptografar('')).toBeNull()
    expect(cripto.descriptografar(null)).toBeNull()
    expect(cripto.descriptografar('')).toBeNull()
  })

  it('retrocompat: valor legado em texto plano passa incólume', () => {
    // Token antigo sem prefixo enc:v1 → retornado como está.
    expect(cripto.descriptografar('token-legado-texto-plano')).toBe(
      'token-legado-texto-plano',
    )
  })

  it('detecta adulteração (authTag) e lança', () => {
    const cifrado = cripto.criptografar('dado-integro')!
    const partes = cifrado.split(':')
    // Corrompe o ciphertext (última parte).
    partes[4] = Buffer.from('xxxxxxxx').toString('base64')
    const adulterado = partes.join(':')
    expect(() => cripto.descriptografar(adulterado)).toThrow()
  })

  it('chave errada não descriptografa', () => {
    const outra = new CriptoToken('b'.repeat(64))
    const cifrado = cripto.criptografar('segredo')!
    expect(() => outra.descriptografar(cifrado)).toThrow()
  })

  it('estaCifrado identifica o formato', () => {
    const cifrado = cripto.criptografar('x')!
    expect(cripto.estaCifrado(cifrado)).toBe(true)
    expect(cripto.estaCifrado('texto-plano')).toBe(false)
    expect(cripto.estaCifrado(null)).toBe(false)
  })

  describe('derivarChaveCripto', () => {
    it('aceita hex de 64 chars como 32 bytes', () => {
      expect(derivarChaveCripto('f'.repeat(64))).toHaveLength(32)
    })

    it('aceita base64 de 32 bytes', () => {
      const b64 = Buffer.alloc(32, 7).toString('base64')
      expect(derivarChaveCripto(b64)).toHaveLength(32)
    })

    it('deriva via SHA-256 para segredo arbitrário (32 bytes)', () => {
      expect(derivarChaveCripto('segredo-curto')).toHaveLength(32)
    })
  })
})
