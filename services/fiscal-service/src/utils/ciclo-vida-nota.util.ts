/**
 * Máquina de estados do ciclo de vida da Nota Fiscal.
 *
 * Transições válidas:
 *
 *   RASCUNHO    → VALIDADA | CANCELADA(descartada localmente? não) — apenas VALIDADA
 *   VALIDADA    → TRANSMITIDA | RASCUNHO (voltar para edição)
 *   TRANSMITIDA → AUTORIZADA | REJEITADA | DENEGADA
 *   AUTORIZADA  → CANCELADA
 *   REJEITADA   → RASCUNHO (corrigir e reenviar) | VALIDADA
 *   DENEGADA    → (terminal — denegação não permite reemissão da mesma nota)
 *   CANCELADA   → (terminal)
 *   INUTILIZADA → (terminal)
 *
 * INUTILIZADA é um estado de faixa de numeração, aplicado fora do fluxo normal
 * da nota emitida (não há transição a partir de outro status da nota para
 * INUTILIZADA aqui).
 */

import { StatusNotaFiscal } from '../../generated/client'

/** Mapa de transições permitidas por status de origem. */
const TRANSICOES: Record<StatusNotaFiscal, StatusNotaFiscal[]> = {
  [StatusNotaFiscal.RASCUNHO]: [StatusNotaFiscal.VALIDADA],
  [StatusNotaFiscal.VALIDADA]: [StatusNotaFiscal.TRANSMITIDA, StatusNotaFiscal.RASCUNHO],
  [StatusNotaFiscal.TRANSMITIDA]: [
    StatusNotaFiscal.AUTORIZADA,
    StatusNotaFiscal.REJEITADA,
    StatusNotaFiscal.DENEGADA,
  ],
  [StatusNotaFiscal.AUTORIZADA]: [StatusNotaFiscal.CANCELADA],
  [StatusNotaFiscal.REJEITADA]: [StatusNotaFiscal.RASCUNHO, StatusNotaFiscal.VALIDADA],
  [StatusNotaFiscal.DENEGADA]: [],
  [StatusNotaFiscal.CANCELADA]: [],
  [StatusNotaFiscal.INUTILIZADA]: [],
}

/** Estados terminais (sem transições de saída). */
export const STATUS_TERMINAIS: ReadonlySet<StatusNotaFiscal> = new Set([
  StatusNotaFiscal.DENEGADA,
  StatusNotaFiscal.CANCELADA,
  StatusNotaFiscal.INUTILIZADA,
])

/**
 * Indica se a transição de `origem` para `destino` é permitida.
 */
export function transicaoPermitida(
  origem: StatusNotaFiscal,
  destino: StatusNotaFiscal,
): boolean {
  if (origem === destino) {
    return false
  }
  return (TRANSICOES[origem] ?? []).includes(destino)
}

/**
 * Retorna os próximos status válidos a partir de um status.
 */
export function proximosStatus(origem: StatusNotaFiscal): StatusNotaFiscal[] {
  return [...(TRANSICOES[origem] ?? [])]
}

/**
 * Mensagem de erro padronizada para transição inválida.
 */
export function mensagemTransicaoInvalida(
  origem: StatusNotaFiscal,
  destino: StatusNotaFiscal,
): string {
  const permitidos = proximosStatus(origem)
  const alvo = permitidos.length > 0 ? permitidos.join(', ') : 'nenhum (status terminal)'
  return `Transição inválida: ${origem} → ${destino}. A partir de ${origem}, os status permitidos são: ${alvo}.`
}
