/**
 * Testes do guard de integridade de texto (proteção contra mojibake U+FFFD).
 *
 * Regressão do bug de encoding do catálogo: garante que a rede de segurança do
 * seed detecta strings corrompidas (â/ê viram U+FFFD) em qualquer profundidade,
 * e NÃO gera falso-positivo para acentos UTF-8 legítimos.
 */

import {
  encontrarTextoCorrompido,
  garantirTextoIntegro,
  CARACTERE_SUBSTITUICAO,
} from './texto-integro.util'

// Bytes UTF-8 canônicos dos circunflexos que o bug corrompia.
const A_CIRCUNFLEXO = Buffer.from('c3a2', 'hex').toString('utf8') // 'â'
const E_CIRCUNFLEXO = Buffer.from('c3aa', 'hex').toString('utf8') // 'ê'
const FFFD = Buffer.from('efbfbd', 'hex').toString('utf8') // '�'

describe('texto-integro.util', () => {
  describe('acentos UTF-8 legítimos (não deve acusar)', () => {
    const nomesValidos = [
      'Teclado Mecânico Compacto 65%', // â
      'Tênis de Corrida Ultra Leve', // ê
      'Luminária de Mesa LED', // á
      'Garrafa Térmica', // é
      'Casa e Decoração', // ç + ã
      'Mouse Ergonômico Sem Fio', // ô
      'Eletrônicos',
      'Vestuário',
    ]

    it.each(nomesValidos)('aceita "%s" sem lançar', (nome) => {
      expect(() => garantirTextoIntegro(nome)).not.toThrow()
      expect(encontrarTextoCorrompido(nome)).toBeNull()
    })

    it('sanidade: â/ê realmente são c3a2/c3aa e não U+FFFD', () => {
      expect(Buffer.from(A_CIRCUNFLEXO, 'utf8').toString('hex')).toBe('c3a2')
      expect(Buffer.from(E_CIRCUNFLEXO, 'utf8').toString('hex')).toBe('c3aa')
      expect('Mecânico').toContain(A_CIRCUNFLEXO)
      expect('Mecânico').not.toContain(CARACTERE_SUBSTITUICAO)
    })
  })

  describe('mojibake U+FFFD (deve acusar)', () => {
    it('detecta â corrompido em string simples', () => {
      const corrompido = 'Teclado Mec' + FFFD + 'nico Compacto 65%'
      expect(corrompido).toContain(CARACTERE_SUBSTITUICAO)
      expect(() => garantirTextoIntegro(corrompido)).toThrow(/U\+FFFD/)
    })

    it('detecta corrupção em campo aninhado de objeto e reporta o caminho', () => {
      const produto = {
        sku: 'TECH-TECLADO-001',
        nome: 'Teclado Mec' + FFFD + 'nico Compacto 65%',
        descricao: 'ok',
      }
      expect(encontrarTextoCorrompido(produto, 'produto')).toBe('produto.nome')
      expect(() => garantirTextoIntegro(produto, 'produto')).toThrow(
        /produto\.nome/,
      )
    })

    it('detecta corrupção dentro de array (tags[])', () => {
      const produto = { tags: ['teclado', 'mec' + FFFD + 'nico'] }
      expect(encontrarTextoCorrompido(produto, 'produto')).toBe(
        'produto.tags[1]',
      )
    })

    it('detecta em lista de produtos (shape real do seed)', () => {
      const produtos = [
        { nome: 'Fone de Ouvido Bluetooth Premium' },
        { nome: 'T' + FFFD + 'nis de Corrida Ultra Leve' },
      ]
      expect(() => garantirTextoIntegro(produtos, 'produtos')).toThrow(
        /produtos\[1\]\.nome/,
      )
    })
  })

  describe('valores não-textuais (ignorados)', () => {
    it('não acusa em números, booleanos, null e undefined', () => {
      expect(encontrarTextoCorrompido(42)).toBeNull()
      expect(encontrarTextoCorrompido(true)).toBeNull()
      expect(encontrarTextoCorrompido(null)).toBeNull()
      expect(encontrarTextoCorrompido(undefined)).toBeNull()
      expect(() =>
        garantirTextoIntegro({ preco: 349, ativo: true, marcaId: null }),
      ).not.toThrow()
    })
  })
})
