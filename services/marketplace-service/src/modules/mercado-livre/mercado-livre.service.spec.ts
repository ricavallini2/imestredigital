import { ContaMarketplace, PlataformaMarketplace, StatusConexao } from '../../../generated/client'
import { MercadoLivreService } from './mercado-livre.service'
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository'
import { AnuncioRepository } from '../anuncio/anuncio.repository'
import { MercadoLivreHttpService } from './mercado-livre-http.service'
import {
  ProdutorEventosService,
  PayloadPedidoRecebidoPlano,
} from '../eventos/produtor-eventos.service'
import { PedidoML } from './mercado-livre-pedido.mapper'

function criarConta(): ContaMarketplace {
  return {
    id: 'conta-1',
    tenantId: 'tenant-1',
    plataforma: PlataformaMarketplace.MERCADO_LIVRE,
    nome: 'ML',
    accessToken: 'cifrado',
    refreshToken: 'cifrado',
    idExterno: '123456',
    tokenExpiraEm: new Date(Date.now() + 3600_000),
    status: StatusConexao.ATIVA,
    ultimaSincronizacao: null,
    configuracoes: {},
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  } as ContaMarketplace
}

describe('MercadoLivreService', () => {
  let contaRepo: jest.Mocked<
    Pick<
      ContaMarketplaceRepository,
      'buscarPorId' | 'buscarPorPlataformaEUserId' | 'atualizarUltimaSincronizacao'
    >
  >
  let anuncioRepo: jest.Mocked<
    Pick<AnuncioRepository, 'buscarPorMarketplaceItemId' | 'criar' | 'atualizar'>
  >
  let http: jest.Mocked<Pick<MercadoLivreHttpService, 'get'>>
  let produtor: jest.Mocked<Pick<ProdutorEventosService, 'pedidoRecebidoPlano'>>
  let service: MercadoLivreService

  beforeEach(() => {
    contaRepo = {
      buscarPorId: jest.fn(),
      buscarPorPlataformaEUserId: jest.fn(),
      atualizarUltimaSincronizacao: jest.fn().mockResolvedValue({} as ContaMarketplace),
    }
    anuncioRepo = {
      buscarPorMarketplaceItemId: jest.fn(),
      criar: jest.fn().mockResolvedValue({} as never),
      atualizar: jest.fn().mockResolvedValue({} as never),
    }
    http = { get: jest.fn() }
    produtor = { pedidoRecebidoPlano: jest.fn().mockResolvedValue(undefined) }

    service = new MercadoLivreService(
      contaRepo as unknown as ContaMarketplaceRepository,
      anuncioRepo as unknown as AnuncioRepository,
      http as unknown as MercadoLivreHttpService,
      produtor as unknown as ProdutorEventosService,
    )
  })

  describe('resolverContaPorUserId', () => {
    it('busca conta ML pelo user_id do seller', async () => {
      const conta = criarConta()
      contaRepo.buscarPorPlataformaEUserId.mockResolvedValue(conta)

      const resultado = await service.resolverContaPorUserId(123456)

      expect(contaRepo.buscarPorPlataformaEUserId).toHaveBeenCalledWith(
        PlataformaMarketplace.MERCADO_LIVRE,
        '123456',
      )
      expect(resultado).toBe(conta)
    })
  })

  describe('processarWebhookPedido (orders_v2 → evento)', () => {
    const pedido: PedidoML = {
      id: 2000003508419013,
      total_amount: 100,
      buyer: { first_name: 'Ana', last_name: 'Souza', email: 'ana@x.com' },
      order_items: [
        {
          item: { id: 'MLB1', title: 'Produto', seller_sku: 'SKU-1' },
          quantity: 1,
          unit_price: 100,
        },
      ],
    }

    it('busca o pedido na API e publica marketplace.pedido.recebido (payload plano)', async () => {
      http.get.mockResolvedValue(pedido)

      await service.processarWebhookPedido(criarConta(), '/orders/2000003508419013')

      // Buscou o recurso autenticado (nunca confia só no webhook).
      expect(http.get).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'conta-1' }),
        '/orders/2000003508419013',
      )

      // Publicou o evento plano com os campos esperados pelo order-service.
      expect(produtor.pedidoRecebidoPlano).toHaveBeenCalledTimes(1)
      const evento = produtor.pedidoRecebidoPlano.mock
        .calls[0][0] as PayloadPedidoRecebidoPlano
      expect(evento.tenantId).toBe('tenant-1')
      expect(evento.pedidoExternoId).toBe('2000003508419013')
      expect(evento.canalOrigem).toBe('MERCADO_LIVRE')
      expect(evento.clienteNome).toBe('Ana Souza')
      expect(evento.itens[0]).toMatchObject({ sku: 'SKU-1', quantidade: 1, valorUnitario: 100 })
    })

    it('não publica evento se o pedido não tiver itens', async () => {
      http.get.mockResolvedValue({ id: 1, order_items: [] } as PedidoML)

      await service.processarWebhookPedido(criarConta(), '/orders/1')

      expect(produtor.pedidoRecebidoPlano).not.toHaveBeenCalled()
    })

    it('resource inválido não busca nem publica', async () => {
      await service.processarWebhookPedido(criarConta(), '')

      expect(http.get).not.toHaveBeenCalled()
      expect(produtor.pedidoRecebidoPlano).not.toHaveBeenCalled()
    })
  })

  describe('sincronizarAnuncios (items → upsert)', () => {
    it('pagina items/search, busca cada item e faz upsert (cria novos)', async () => {
      const conta = criarConta()
      contaRepo.buscarPorId.mockResolvedValue(conta)

      // 1ª chamada: items/search (2 ids, total 2). Demais: detalhes dos itens.
      http.get
        .mockResolvedValueOnce({
          results: ['MLB1', 'MLB2'],
          paging: { total: 2, offset: 0, limit: 50 },
        })
        .mockResolvedValueOnce({
          id: 'MLB1',
          title: 'Item 1',
          price: 10,
          available_quantity: 5,
          status: 'active',
          permalink: 'http://ml/MLB1',
          category_id: 'MLB-CAT',
          seller_custom_field: 'SKU-1',
          pictures: [{ secure_url: 'https://img/1.jpg' }],
        })
        .mockResolvedValueOnce({
          id: 'MLB2',
          title: 'Item 2',
          price: 20,
          available_quantity: 0,
          status: 'paused',
        })

      anuncioRepo.buscarPorMarketplaceItemId.mockResolvedValue(null) // ambos novos

      const resumo = await service.sincronizarAnuncios('tenant-1', 'conta-1')

      expect(resumo).toEqual({ processados: 2, criados: 2, atualizados: 0 })
      expect(anuncioRepo.criar).toHaveBeenCalledTimes(2)
      expect(contaRepo.atualizarUltimaSincronizacao).toHaveBeenCalledWith(
        'conta-1',
        'tenant-1',
      )

      // Confere o mapeamento do primeiro item.
      const primeiro = anuncioRepo.criar.mock.calls[0][0] as Record<string, unknown>
      expect(primeiro).toMatchObject({
        tenantId: 'tenant-1',
        contaMarketplaceId: 'conta-1',
        idExterno: 'MLB1',
        produtoId: 'SKU-1',
        titulo: 'Item 1',
        preco: 10,
        estoque: 5,
        url: 'http://ml/MLB1',
        categoria: 'MLB-CAT',
      })
      expect(primeiro.fotos).toEqual(['https://img/1.jpg'])
    })

    it('atualiza anúncio já existente em vez de criar', async () => {
      contaRepo.buscarPorId.mockResolvedValue(criarConta())
      http.get
        .mockResolvedValueOnce({ results: ['MLB1'], paging: { total: 1 } })
        .mockResolvedValueOnce({ id: 'MLB1', title: 'Item 1', price: 10, status: 'active' })
      anuncioRepo.buscarPorMarketplaceItemId.mockResolvedValue({
        id: 'anuncio-existente',
      } as never)

      const resumo = await service.sincronizarAnuncios('tenant-1', 'conta-1')

      expect(resumo).toEqual({ processados: 1, criados: 0, atualizados: 1 })
      expect(anuncioRepo.atualizar).toHaveBeenCalledWith(
        'anuncio-existente',
        'tenant-1',
        expect.objectContaining({ titulo: 'Item 1' }),
      )
      expect(anuncioRepo.criar).not.toHaveBeenCalled()
    })
  })
})
