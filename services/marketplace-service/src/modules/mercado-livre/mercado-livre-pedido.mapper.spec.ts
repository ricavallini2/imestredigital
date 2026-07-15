import { mapearPedidoMLParaEvento, PedidoML } from './mercado-livre-pedido.mapper'

describe('mapearPedidoMLParaEvento', () => {
  const tenantId = '10000000-0000-0000-0000-000000000001'

  const pedidoBase: PedidoML = {
    id: 2000003508419013,
    status: 'paid',
    total_amount: 189.9,
    currency_id: 'BRL',
    buyer: {
      id: 987654,
      nickname: 'COMPRADOR123',
      first_name: 'Maria',
      last_name: 'Silva',
      email: 'maria@example.com',
    },
    order_items: [
      {
        item: {
          id: 'MLB123456789',
          title: 'Camiseta Preta M',
          seller_sku: 'CAM-PRETA-M',
          variation_id: 555,
        },
        quantity: 2,
        unit_price: 79.95,
      },
    ],
    shipping: {
      id: 40000,
      receiver_address: {
        street_name: 'Rua das Flores',
        street_number: '100',
        neighborhood: { name: 'Centro' },
        city: { name: 'São Paulo' },
        state: { id: 'BR-SP', name: 'São Paulo' },
        zip_code: '01000-000',
      },
    },
  }

  it('mapeia campos principais para o payload plano canônico', () => {
    const evento = mapearPedidoMLParaEvento(pedidoBase, tenantId, 'MERCADO_LIVRE')

    expect(evento.tenantId).toBe(tenantId)
    expect(evento.pedidoExternoId).toBe('2000003508419013')
    expect(evento.canalOrigem).toBe('MERCADO_LIVRE')
    expect(evento.clienteNome).toBe('Maria Silva')
    expect(evento.clienteEmail).toBe('maria@example.com')
    expect(evento.valorTotal).toBe(189.9)
  })

  it('usa seller_sku como produtoId e sku do item', () => {
    const evento = mapearPedidoMLParaEvento(pedidoBase, tenantId, 'MERCADO_LIVRE')
    expect(evento.itens).toHaveLength(1)
    expect(evento.itens[0]).toMatchObject({
      produtoId: 'CAM-PRETA-M',
      sku: 'CAM-PRETA-M',
      variacaoId: '555',
      titulo: 'Camiseta Preta M',
      quantidade: 2,
      valorUnitario: 79.95,
    })
  })

  it('normaliza o endereço de entrega', () => {
    const evento = mapearPedidoMLParaEvento(pedidoBase, tenantId, 'MERCADO_LIVRE')
    expect(evento.enderecoEntrega).toMatchObject({
      rua: 'Rua das Flores',
      numero: '100',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'BR-SP',
      cep: '01000-000',
    })
  })

  it('cai para nickname quando não há nome completo', () => {
    const pedido: PedidoML = {
      ...pedidoBase,
      buyer: { nickname: 'SO_NICK' },
    }
    const evento = mapearPedidoMLParaEvento(pedido, tenantId, 'MERCADO_LIVRE')
    expect(evento.clienteNome).toBe('SO_NICK')
  })

  it('usa item id como SKU de fallback quando falta seller_sku', () => {
    const pedido: PedidoML = {
      ...pedidoBase,
      order_items: [
        { item: { id: 'MLB999', title: 'Sem SKU' }, quantity: 1, unit_price: 10 },
      ],
    }
    const evento = mapearPedidoMLParaEvento(pedido, tenantId, 'MERCADO_LIVRE')
    expect(evento.itens[0].produtoId).toBe('MLB999')
    expect(evento.itens[0].sku).toBe('MLB999')
    expect(evento.itens[0].variacaoId).toBeUndefined()
  })

  it('lida com pedido sem itens (lista vazia)', () => {
    const pedido: PedidoML = { id: 1, order_items: [] }
    const evento = mapearPedidoMLParaEvento(pedido, tenantId, 'MERCADO_LIVRE')
    expect(evento.itens).toEqual([])
  })
})
