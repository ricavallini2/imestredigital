import { Prisma } from '../../../generated/client'
import type {
  AnuncioMarketplace,
  ContaMarketplace,
} from '../../../generated/client'
import {
  extrairTaxaPlataforma,
  lerMetricasAnuncio,
  mapearAnuncio,
  nomeExibicao,
  paraNumero,
} from './vitrine.mapper'

/** Fabrica uma conta mínima para os testes de derivação. */
function contaFake(over: Partial<ContaMarketplace> = {}): ContaMarketplace {
  return {
    id: 'conta-1',
    tenantId: 'tenant-1',
    plataforma: 'MERCADO_LIVRE',
    nome: 'Minha Loja ML',
    accessToken: 'x',
    refreshToken: 'y',
    idExterno: 'seller-123',
    tokenExpiraEm: null,
    status: 'ATIVA',
    ultimaSincronizacao: null,
    configuracoes: {},
    criadoEm: new Date('2026-01-01T00:00:00Z'),
    atualizadoEm: new Date('2026-01-01T00:00:00Z'),
    ...over,
  } as ContaMarketplace
}

/** Fabrica um anúncio mínimo para os testes de derivação. */
function anuncioFake(over: Partial<AnuncioMarketplace> = {}): AnuncioMarketplace {
  return {
    id: 'anu-1',
    tenantId: 'tenant-1',
    contaMarketplaceId: 'conta-1',
    produtoId: 'SKU-ABC',
    variacaoId: null,
    idExterno: 'MLB-999',
    titulo: 'Produto Teste',
    descricao: 'desc',
    preco: new Prisma.Decimal('199.90'),
    precoPromocional: new Prisma.Decimal('149.90'),
    estoque: 7,
    status: 'ATIVO',
    url: 'https://ml.com/MLB-999',
    categoria: 'Eletrônicos',
    fotos: [],
    atributos: {},
    metricas: { visitas: 120, vendas: 5, perguntas: 2 },
    ultimaSincronizacao: null,
    criadoEm: new Date('2026-02-01T00:00:00Z'),
    atualizadoEm: new Date('2026-02-02T00:00:00Z'),
    ...over,
  } as AnuncioMarketplace
}

describe('vitrine.mapper', () => {
  describe('paraNumero', () => {
    it('converte Decimal em number', () => {
      expect(paraNumero(new Prisma.Decimal('12.34'))).toBe(12.34)
    })
    it('converte string em number', () => {
      expect(paraNumero('56.78')).toBe(56.78)
    })
    it('trata null/undefined como 0', () => {
      expect(paraNumero(null)).toBe(0)
      expect(paraNumero(undefined)).toBe(0)
    })
    it('trata NaN/valor inválido como 0', () => {
      expect(paraNumero('abc')).toBe(0)
    })
  })

  describe('extrairTaxaPlataforma', () => {
    it('usa taxaPlataforma direta de configuracoes (percentual)', () => {
      const conta = contaFake({ configuracoes: { taxaPlataforma: 11 } })
      expect(extrairTaxaPlataforma(conta)).toBe(11)
    })
    it('converte commissionRate (fração) em percentual', () => {
      const conta = contaFake({
        plataforma: 'SHOPEE',
        configuracoes: { commissionRate: 0.05 },
      })
      expect(extrairTaxaPlataforma(conta)).toBe(5)
    })
    it('cai no padrão do canal quando não há taxa em configuracoes', () => {
      const conta = contaFake({ plataforma: 'MERCADO_LIVRE', configuracoes: {} })
      expect(extrairTaxaPlataforma(conta)).toBe(13)
    })
  })

  describe('lerMetricasAnuncio', () => {
    it('lê visitas/vendas/perguntas do JSON', () => {
      const m = lerMetricasAnuncio({ visitas: 10, vendas: 3, perguntas: 1 })
      expect(m).toEqual({ visitas: 10, vendas: 3, perguntas: 1 })
    })
    it('devolve zeros quando o JSON é vazio/nulo', () => {
      expect(lerMetricasAnuncio(null)).toEqual({
        visitas: 0,
        vendas: 0,
        perguntas: 0,
      })
    })
  })

  describe('mapearAnuncio', () => {
    it('achata o anúncio no shape da vitrine com números na borda', () => {
      const vit = mapearAnuncio(anuncioFake(), 'MERCADO_LIVRE')
      expect(vit.preco).toBe(199.9)
      expect(vit.precoPromocional).toBe(149.9)
      expect(typeof vit.preco).toBe('number')
      expect(vit.estoque).toBe(7)
      expect(vit.vendas30d).toBe(5)
      // receita30d = preco × vendas
      expect(vit.receita30d).toBe(Number((199.9 * 5).toFixed(2)))
      expect(vit.impressoes).toBe(120)
      expect(vit.anuncioId).toBe('MLB-999')
      expect(vit.urlAnuncio).toBe('https://ml.com/MLB-999')
      expect(vit.canal).toBe('MERCADO_LIVRE')
    })

    it('omite precoPromocional quando null', () => {
      const vit = mapearAnuncio(
        anuncioFake({ precoPromocional: null }),
        'MERCADO_LIVRE',
      )
      expect(vit.precoPromocional).toBeUndefined()
    })

    it('usa produtoId como SKU fallback quando atributos não têm sku', () => {
      const vit = mapearAnuncio(anuncioFake(), 'MERCADO_LIVRE')
      expect(vit.sku).toBe('SKU-ABC')
    })

    it('prefere sku de atributos quando presente', () => {
      const vit = mapearAnuncio(
        anuncioFake({ atributos: { sku: 'SKU-DO-ATRIBUTO' } }),
        'MERCADO_LIVRE',
      )
      expect(vit.sku).toBe('SKU-DO-ATRIBUTO')
    })
  })

  describe('nomeExibicao', () => {
    it('usa o nome da conta quando presente', () => {
      expect(nomeExibicao(contaFake({ nome: 'Loja X' }))).toBe('Loja X')
    })
    it('cai no rótulo do canal quando nome vazio', () => {
      expect(nomeExibicao(contaFake({ nome: '   ' }))).toBe('Mercado Livre')
    })
  })
})
