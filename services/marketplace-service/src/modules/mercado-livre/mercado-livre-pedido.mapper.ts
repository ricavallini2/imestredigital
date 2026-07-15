import { PayloadPedidoRecebidoPlano } from '../eventos/produtor-eventos.service'

/**
 * Estrutura (parcial e defensiva) de um pedido do Mercado Livre.
 * O schema completo tem muito mais campos; tipamos apenas o que consumimos.
 * Ver docs/pesquisa/mercado-livre-api.md (seção 4).
 */
export interface PedidoML {
  id: number | string
  status?: string
  total_amount?: number
  currency_id?: string
  date_created?: string
  buyer?: {
    id?: number | string
    nickname?: string
    first_name?: string
    last_name?: string
    email?: string
    phone?: { number?: string }
  }
  order_items?: Array<{
    item?: {
      id?: string
      title?: string
      seller_sku?: string | null
      seller_custom_field?: string | null
      variation_id?: number | string | null
    }
    quantity?: number
    unit_price?: number
  }>
  shipping?: {
    id?: number | string
    receiver_address?: {
      street_name?: string
      street_number?: string
      comment?: string
      neighborhood?: { name?: string }
      city?: { name?: string }
      state?: { id?: string; name?: string }
      zip_code?: string
    }
  }
}

/**
 * Converte um pedido do Mercado Livre no payload PLANO canônico consumido pelo
 * order-service (marketplace.pedido.recebido).
 *
 * Regras de mapeamento:
 * - clienteNome: nome+sobrenome do comprador; cai para o nickname quando ausente.
 * - itens[].produtoId / sku: usa seller_sku (SKU do vendedor) como identificador
 *   interno do produto — é o vínculo do anúncio ML com o catálogo do ERP. Sem
 *   seller_sku, usa o item id do ML como fallback (evita item sem SKU).
 * - valorUnitario/valorTotal em reais (o ML já envia em BRL como número decimal).
 * - enderecoEntrega: normalizado para o shape usado internamente
 *   ({ rua, numero, complemento, bairro, cidade, estado, cep }).
 *
 * @param tenantId  tenant dono da conta (resolvido pelo webhook via user_id).
 * @param canalOrigem  rótulo do canal (ex.: 'MERCADO_LIVRE').
 */
export function mapearPedidoMLParaEvento(
  pedido: PedidoML,
  tenantId: string,
  canalOrigem: string,
): PayloadPedidoRecebidoPlano {
  const nomeComprador =
    [pedido.buyer?.first_name, pedido.buyer?.last_name]
      .filter(Boolean)
      .join(' ')
      .trim() ||
    pedido.buyer?.nickname ||
    'Comprador Mercado Livre'

  const itens = (pedido.order_items ?? []).map((linha) => {
    const skuVendedor =
      linha.item?.seller_sku ||
      linha.item?.seller_custom_field ||
      linha.item?.id ||
      'SEM-SKU'

    return {
      // produtoId e sku apontam para o mesmo SKU do vendedor: o order-service
      // resolve o vínculo com o catálogo interno a partir dele.
      produtoId: skuVendedor,
      sku: skuVendedor,
      variacaoId:
        linha.item?.variation_id != null
          ? String(linha.item.variation_id)
          : undefined,
      titulo: linha.item?.title ?? 'Item Mercado Livre',
      quantidade: linha.quantity ?? 1,
      valorUnitario: linha.unit_price ?? 0,
    }
  })

  const endereco = pedido.shipping?.receiver_address
  const enderecoEntrega = endereco
    ? {
        rua: endereco.street_name ?? '',
        numero: endereco.street_number ?? '',
        complemento: endereco.comment ?? undefined,
        bairro: endereco.neighborhood?.name ?? '',
        cidade: endereco.city?.name ?? '',
        estado: endereco.state?.id ?? endereco.state?.name ?? '',
        cep: endereco.zip_code ?? '',
      }
    : undefined

  return {
    tenantId,
    pedidoExternoId: String(pedido.id),
    canalOrigem,
    clienteNome: nomeComprador,
    clienteEmail: pedido.buyer?.email,
    itens,
    valorTotal: pedido.total_amount,
    enderecoEntrega,
  }
}
