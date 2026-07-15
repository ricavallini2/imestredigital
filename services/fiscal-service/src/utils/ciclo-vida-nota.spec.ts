/**
 * Testes da máquina de estados do ciclo de vida da nota fiscal.
 */

import { StatusNotaFiscal } from '../../generated/client'
import {
  transicaoPermitida,
  proximosStatus,
  STATUS_TERMINAIS,
} from './ciclo-vida-nota.util'

describe('Ciclo de vida da Nota Fiscal', () => {
  it('permite o caminho feliz RASCUNHO → VALIDADA → TRANSMITIDA → AUTORIZADA', () => {
    expect(transicaoPermitida(StatusNotaFiscal.RASCUNHO, StatusNotaFiscal.VALIDADA)).toBe(true)
    expect(transicaoPermitida(StatusNotaFiscal.VALIDADA, StatusNotaFiscal.TRANSMITIDA)).toBe(true)
    expect(transicaoPermitida(StatusNotaFiscal.TRANSMITIDA, StatusNotaFiscal.AUTORIZADA)).toBe(true)
  })

  it('permite cancelar apenas a partir de AUTORIZADA', () => {
    expect(transicaoPermitida(StatusNotaFiscal.AUTORIZADA, StatusNotaFiscal.CANCELADA)).toBe(true)
    expect(transicaoPermitida(StatusNotaFiscal.RASCUNHO, StatusNotaFiscal.CANCELADA)).toBe(false)
    expect(transicaoPermitida(StatusNotaFiscal.VALIDADA, StatusNotaFiscal.CANCELADA)).toBe(false)
  })

  it('não permite emitir (TRANSMITIDA) direto de RASCUNHO', () => {
    expect(transicaoPermitida(StatusNotaFiscal.RASCUNHO, StatusNotaFiscal.TRANSMITIDA)).toBe(false)
  })

  it('permite REJEITADA voltar para RASCUNHO/VALIDADA (correção e reenvio)', () => {
    expect(transicaoPermitida(StatusNotaFiscal.REJEITADA, StatusNotaFiscal.RASCUNHO)).toBe(true)
    expect(transicaoPermitida(StatusNotaFiscal.REJEITADA, StatusNotaFiscal.VALIDADA)).toBe(true)
  })

  it('estados terminais não têm transição de saída', () => {
    for (const terminal of STATUS_TERMINAIS) {
      expect(proximosStatus(terminal)).toHaveLength(0)
    }
    expect(transicaoPermitida(StatusNotaFiscal.CANCELADA, StatusNotaFiscal.RASCUNHO)).toBe(false)
    expect(transicaoPermitida(StatusNotaFiscal.DENEGADA, StatusNotaFiscal.VALIDADA)).toBe(false)
  })

  it('a mesma origem = destino não é considerada transição válida', () => {
    expect(transicaoPermitida(StatusNotaFiscal.AUTORIZADA, StatusNotaFiscal.AUTORIZADA)).toBe(false)
  })
})
