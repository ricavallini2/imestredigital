/**
 * Criptografia simétrica de tokens de marketplace em repouso (AES-256-GCM).
 *
 * Os access/refresh tokens do Mercado Livre (e demais marketplaces OAuth) são
 * credenciais sensíveis: se vazam, dão acesso à conta do seller. Nunca devem
 * ficar em texto plano no banco. Este util aplica envelope encryption simétrica
 * com uma chave única fora do banco (MARKETPLACE_CRYPTO_KEY).
 *
 * Formato do texto cifrado persistido (base64 de cada parte, separadas por `:`):
 *
 *     enc:v1:<iv_b64>:<authTag_b64>:<ciphertext_b64>
 *
 * - prefixo `enc:v1` versiona o esquema (permite rotação/migração futura) e
 *   funciona como marcador para distinguir valor cifrado de valor legado em
 *   texto plano (retrocompatibilidade — ver `descriptografar`).
 * - IV de 12 bytes (recomendado para GCM), gerado aleatoriamente por operação.
 * - authTag de 16 bytes garante integridade/autenticidade (detecta adulteração).
 *
 * A chave (MARKETPLACE_CRYPTO_KEY) deve ter 32 bytes. Aceita:
 * - 64 chars hex (32 bytes), ou
 * - base64 que decodifique para 32 bytes, ou
 * - string arbitrária → normalizada para 32 bytes via SHA-256 (conveniência dev).
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import { Logger } from '@nestjs/common'

const ALGORITMO = 'aes-256-gcm'
const PREFIXO = 'enc:v1'
const TAMANHO_IV = 12 // bytes — padrão recomendado para AES-GCM
const TAMANHO_CHAVE = 32 // bytes — AES-256

const logger = new Logger('CriptoToken')

/**
 * Deriva uma chave de 32 bytes a partir do valor bruto da env.
 *
 * Ordem de tentativa:
 * 1. hex de 64 chars → 32 bytes exatos.
 * 2. base64 que resulte em 32 bytes exatos.
 * 3. fallback: SHA-256 do valor (sempre 32 bytes) — cobre segredos arbitrários
 *    em desenvolvimento, com aviso para não usar chave fraca em produção.
 */
export function derivarChaveCripto(bruto: string | undefined): Buffer {
  const valor = bruto?.trim()

  if (!valor) {
    const emProducao = process.env.NODE_ENV === 'production'
    if (emProducao) {
      throw new Error(
        'MARKETPLACE_CRYPTO_KEY não definida. É obrigatória em produção para ' +
          'criptografar tokens de marketplace em repouso (32 bytes: 64 hex ou base64).',
      )
    }
    logger.warn(
      'MARKETPLACE_CRYPTO_KEY ausente — usando chave de DESENVOLVIMENTO derivada. ' +
        'NUNCA use este default em produção.',
    )
    return createHash('sha256').update('dev-marketplace-crypto-key').digest()
  }

  // 1. hex de 64 chars
  if (/^[0-9a-fA-F]{64}$/.test(valor)) {
    return Buffer.from(valor, 'hex')
  }

  // 2. base64 → 32 bytes
  try {
    const emBase64 = Buffer.from(valor, 'base64')
    if (emBase64.length === TAMANHO_CHAVE) {
      return emBase64
    }
  } catch {
    // ignora — cai no fallback SHA-256
  }

  // 3. fallback determinístico (32 bytes garantidos)
  logger.warn(
    'MARKETPLACE_CRYPTO_KEY não está em hex(64)/base64(32 bytes) — ' +
      'derivando via SHA-256. Para produção, gere: openssl rand -hex 32',
  )
  return createHash('sha256').update(valor).digest()
}

/**
 * Serviço/objeto de criptografia com a chave já resolvida.
 * Instanciar uma vez por processo (a chave não muda em runtime).
 */
export class CriptoToken {
  private readonly chave: Buffer

  constructor(chaveBruta: string | undefined) {
    this.chave = derivarChaveCripto(chaveBruta)
  }

  /**
   * Criptografa um texto plano. Retorna string no formato `enc:v1:iv:tag:ct`.
   * Entrada vazia/undefined retorna a própria entrada (nada a proteger).
   */
  criptografar(textoPlano: string | null | undefined): string | null {
    if (textoPlano === null || textoPlano === undefined || textoPlano === '') {
      // Nada a proteger — normaliza entrada vazia/nula para null.
      return null
    }

    const iv = randomBytes(TAMANHO_IV)
    const cipher = createCipheriv(ALGORITMO, this.chave, iv)
    const cifrado = Buffer.concat([
      cipher.update(textoPlano, 'utf8'),
      cipher.final(),
    ])
    const authTag = cipher.getAuthTag()

    return [
      PREFIXO,
      iv.toString('base64'),
      authTag.toString('base64'),
      cifrado.toString('base64'),
    ].join(':')
  }

  /**
   * Descriptografa um valor no formato `enc:v1:iv:tag:ct`.
   *
   * Retrocompatibilidade: se o valor NÃO tiver o prefixo `enc:v1` (ex.: token
   * legado gravado em texto plano antes desta feature), retorna-o como está —
   * evita quebrar contas já conectadas. A migração acontece naturalmente no
   * próximo refresh, que regravará o token já cifrado.
   */
  descriptografar(valorArmazenado: string | null | undefined): string | null {
    if (
      valorArmazenado === null ||
      valorArmazenado === undefined ||
      valorArmazenado === ''
    ) {
      return null
    }

    if (!valorArmazenado.startsWith(`${PREFIXO}:`)) {
      // Valor legado em texto plano — retorna sem alteração.
      return valorArmazenado
    }

    const partes = valorArmazenado.split(':')
    // enc : v1 : iv : tag : ct  → 5 partes
    if (partes.length !== 5) {
      throw new Error('Token cifrado em formato inválido')
    }

    const [, , ivB64, tagB64, ctB64] = partes
    const iv = Buffer.from(ivB64, 'base64')
    const authTag = Buffer.from(tagB64, 'base64')
    const cifrado = Buffer.from(ctB64, 'base64')

    const decipher = createDecipheriv(ALGORITMO, this.chave, iv)
    decipher.setAuthTag(authTag)

    const plano = Buffer.concat([
      decipher.update(cifrado),
      decipher.final(),
    ])

    return plano.toString('utf8')
  }

  /**
   * Indica se um valor já está no formato cifrado desta versão.
   */
  estaCifrado(valor: string | null | undefined): boolean {
    return typeof valor === 'string' && valor.startsWith(`${PREFIXO}:`)
  }
}
