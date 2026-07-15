import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

/**
 * Geração e validação do parâmetro `state` do OAuth (anti-CSRF).
 *
 * O `state` carrega o tenantId + um nonce aleatório e é ASSINADO com HMAC-SHA256
 * (chave = MARKETPLACE_CRYPTO_KEY), de modo que um `state` forjado por terceiros
 * seja rejeitado no callback. Formato (base64url das partes, separadas por `.`):
 *
 *     <payload_b64>.<assinatura_b64>
 *
 * onde payload = `${tenantId}:${nonce}:${timestampMs}`.
 *
 * O callback recomputa a assinatura e confere que o tenantId embutido bate com o
 * tenant autenticado (JWT), fechando o vínculo state ↔ tenant.
 */

const SEPARADOR = '.'

/** Codifica um Buffer/string em base64url (sem padding). */
function paraBase64Url(valor: Buffer): string {
  return valor
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function deBase64Url(valor: string): Buffer {
  const base64 = valor.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(base64, 'base64')
}

function assinar(payload: string, chave: string): string {
  return paraBase64Url(createHmac('sha256', chave).update(payload).digest())
}

/**
 * Gera um `state` assinado para o tenant informado.
 */
export function gerarState(tenantId: string, chave: string): string {
  const nonce = randomBytes(16).toString('hex')
  const payload = `${tenantId}:${nonce}:${Date.now()}`
  const payloadB64 = paraBase64Url(Buffer.from(payload, 'utf8'))
  const assinatura = assinar(payloadB64, chave)
  return `${payloadB64}${SEPARADOR}${assinatura}`
}

/**
 * Valida um `state` recebido no callback e extrai o tenantId embutido.
 *
 * @returns o tenantId embutido se a assinatura for válida; null caso contrário.
 */
export function validarState(state: string, chave: string): string | null {
  if (!state || !state.includes(SEPARADOR)) return null

  const [payloadB64, assinaturaRecebida] = state.split(SEPARADOR)
  if (!payloadB64 || !assinaturaRecebida) return null

  const assinaturaEsperada = assinar(payloadB64, chave)

  // Comparação em tempo constante (evita timing attack na assinatura).
  const bufEsperada = deBase64Url(assinaturaEsperada)
  const bufRecebida = deBase64Url(assinaturaRecebida)
  if (bufEsperada.length !== bufRecebida.length) return null
  if (!timingSafeEqual(bufEsperada, bufRecebida)) return null

  const payload = deBase64Url(payloadB64).toString('utf8')
  const [tenantId] = payload.split(':')
  return tenantId || null
}
