/**
 * Testes do utilitário de composição de SKU de variação.
 *
 * Cobre as regras da spec de varejo: MAIÚSCULAS, sem espaços, sem acentos,
 * remoção de símbolos (barra, etc.), colapso de hífens e omissão de segmentos
 * vazios.
 */

import { segmentoSku, composeSkuVariacao } from './sku.util'

describe('segmentoSku', () => {
  it('coloca em MAIÚSCULAS e troca espaços por hífen', () => {
    expect(segmentoSku('Preto Fosco')).toBe('PRETO-FOSCO')
  })

  it('remove acentos', () => {
    expect(segmentoSku('Cinza Grafíte')).toBe('CINZA-GRAFITE')
    expect(segmentoSku('Ação')).toBe('ACAO')
  })

  it('descarta barras e símbolos (33/34 vira 3334)', () => {
    expect(segmentoSku('33/34')).toBe('3334')
    expect(segmentoSku('P&B')).toBe('PB')
  })

  it('colapsa hífens repetidos e apara as pontas', () => {
    expect(segmentoSku('  --Azul  Royal-- ')).toBe('AZUL-ROYAL')
    expect(segmentoSku('a__b')).toBe('A-B')
  })

  it('trata entradas vazias/nulas sem quebrar', () => {
    expect(segmentoSku('')).toBe('')
    // Robustez em runtime: o util usa `?? ''`, então null/undefined não quebram.
    // (o cast evita depender do nível de strictness do tsconfig para compilar)
    expect(segmentoSku(null as unknown as string)).toBe('')
    expect(segmentoSku(undefined as unknown as string)).toBe('')
  })

  it('preserva alfanuméricos e hífens já existentes', () => {
    expect(segmentoSku('CAM-001')).toBe('CAM-001')
  })
})

describe('composeSkuVariacao', () => {
  it('monta o SKU no formato ${produto}-${VALOR}-${TAMANHO}', () => {
    expect(composeSkuVariacao('CAM-001', 'Preto', '38')).toBe('CAM-001-PRETO-38')
  })

  it('normaliza cada segmento (acentos, espaços, símbolos)', () => {
    expect(composeSkuVariacao('cam 001', 'Cinza Grafíte', '33/34')).toBe(
      'CAM-001-CINZA-GRAFITE-3334',
    )
  })

  it('omite o segmento de tamanho quando vazio (sem hífen solto)', () => {
    expect(composeSkuVariacao('CAM-001', 'Preto', '')).toBe('CAM-001-PRETO')
  })

  it('omite o segmento de atributo quando vazio', () => {
    expect(composeSkuVariacao('CAM-001', '', '38')).toBe('CAM-001-38')
  })
})
