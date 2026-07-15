/**
 * Testes do gerador de DANFE mínimo (PDF montado à mão).
 *
 * Garante que o Buffer produzido é um PDF estruturalmente válido (assinatura,
 * objetos, xref com offsets, trailer, EOF) e que os dados essenciais da nota
 * aparecem no conteúdo — o suficiente para o fluxo de dev baixar e abrir o
 * arquivo.
 */

import { gerarDanfePdfMinimo, DadosDanfeMinimo } from './danfe-pdf.util'

const DADOS_BASE: DadosDanfeMinimo = {
  titulo: 'DANFE - Documento Auxiliar da NF-e',
  chaveAcesso: '35260111222333000181550010000000011326973713',
  numero: 1,
  serie: 1,
  modelo: '55',
  emitente: 'Empresa Teste LTDA',
  cnpjEmitente: '11222333000181',
  destinatario: 'Cliente Teste',
  valorTotal: 1234.56,
  protocolo: '135260000000001',
  ambiente: 'HOMOLOGACAO',
}

describe('gerarDanfePdfMinimo', () => {
  it('produz um Buffer com assinatura de PDF e EOF', () => {
    const pdf = gerarDanfePdfMinimo(DADOS_BASE)
    expect(pdf).toBeInstanceOf(Buffer)
    expect(pdf.length).toBeGreaterThan(0)
    const texto = pdf.toString('latin1')
    expect(texto.startsWith('%PDF-1.4')).toBe(true)
    expect(texto.trimEnd().endsWith('%%EOF')).toBe(true)
  })

  it('inclui a estrutura mínima de objetos, xref e trailer', () => {
    const texto = gerarDanfePdfMinimo(DADOS_BASE).toString('latin1')
    expect(texto).toContain('/Type /Catalog')
    expect(texto).toContain('/Type /Pages')
    expect(texto).toContain('/Type /Page')
    expect(texto).toContain('/BaseFont /Helvetica')
    expect(texto).toContain('stream')
    expect(texto).toContain('endstream')
    expect(texto).toContain('xref')
    expect(texto).toContain('trailer')
    expect(texto).toContain('/Root 1 0 R')
    expect(texto).toContain('startxref')
  })

  it('declara o offset de startxref apontando para a tabela xref real', () => {
    const pdf = gerarDanfePdfMinimo(DADOS_BASE)
    const texto = pdf.toString('latin1')
    const match = texto.match(/startxref\n(\d+)\n%%EOF/)
    expect(match).not.toBeNull()
    const offset = Number(match![1])
    // No offset declarado o arquivo deve conter a palavra-chave "xref".
    expect(pdf.subarray(offset, offset + 4).toString('latin1')).toBe('xref')
  })

  it('declara /Length coerente com o tamanho real do stream de conteúdo', () => {
    const pdf = gerarDanfePdfMinimo(DADOS_BASE).toString('latin1')
    const lengthMatch = pdf.match(/<< \/Length (\d+) >>/)
    expect(lengthMatch).not.toBeNull()
    const declarado = Number(lengthMatch![1])
    const stream = pdf.substring(
      pdf.indexOf('stream\n') + 'stream\n'.length,
      pdf.indexOf('\nendstream'),
    )
    expect(Buffer.byteLength(stream, 'latin1')).toBe(declarado)
  })

  it('exibe a chave de acesso formatada em blocos de 4', () => {
    const texto = gerarDanfePdfMinimo(DADOS_BASE).toString('latin1')
    expect(texto).toContain('3526 0111 2223 3300 0181')
  })

  it('formata valor total em reais (pt-BR) e escapa parênteses do texto', () => {
    const texto = gerarDanfePdfMinimo({
      ...DADOS_BASE,
      emitente: 'Loja (Matriz)',
      valorTotal: 1000,
    }).toString('latin1')
    expect(texto).toContain('R$ 1.000,00')
    // Parêntese do nome escapado com barra invertida no literal PDF.
    expect(texto).toContain('Loja \\(Matriz\\)')
  })

  it('usa rótulo de consumidor não identificado quando não há destinatário (NFC-e)', () => {
    const { destinatario: _omitido, ...semDest } = DADOS_BASE
    const texto = gerarDanfePdfMinimo({
      ...semDest,
      titulo: 'DANFCE - Documento Auxiliar da NFC-e',
      modelo: '65',
    }).toString('latin1')
    expect(texto).toContain('CONSUMIDOR NAO IDENTIFICADO')
    expect(texto).toContain('DANFCE')
  })
})
