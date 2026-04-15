/**
 * Tipos do domínio de Pedidos (OMS - Order Management System).
 * Define o ciclo de vida completo de um pedido, da criação à entrega.
 */

import { BaseEntity, EntityId, Moeda, Endereco } from '../common';

/** Status do pedido no fluxo */
export enum StatusPedido {
  NOVO = 'novo',
  APROVADO = 'aprovado',
  EM_SEPARACAO = 'em_separacao',
  SEPARADO = 'separado',
  FATURADO = 'faturado',
  EXPEDIDO = 'expedido',
  EM_TRANSITO = 'em_transito',
  ENTREGUE = 'entregue',
  CANCELADO = 'cancelado',
  DEVOLVIDO = 'devolvido',
}

/** Canal de origem do pedido */
export enum CanalPedido {
  MERCADO_LIVRE = 'mercado_livre',
  SHOPEE = 'shopee',
  AMAZON = 'amazon',
  MAGALU = 'magalu',
  AMERICANAS = 'americanas',
  SHEIN = 'shein',
  SHOPIFY = 'shopify',
  NUVEMSHOP = 'nuvemshop',
  WOOCOMMERCE = 'woocommerce',
  PDV = 'pdv',
  MANUAL = 'manual',
}

/** Pedido completo */
export interface Pedido extends BaseEntity {
  tenantId: EntityId;
  numero: string;
  canal: CanalPedido;
  canalPedidoId?: string; // ID no marketplace de origem
  clienteId: EntityId;
  status: StatusPedido;

  // Itens
  itens: ItemPedido[];

  // Valores
  subtotal: Moeda;
  desconto: Moeda;
  frete: Moeda;
  total: Moeda;

  // Endereços
  enderecoEntrega: Endereco;
  enderecoCobranca?: Endereco;

  // Rastreamento
  codigoRastreio?: string;
  transportadora?: string;

  // Nota fiscal
  notaFiscalId?: EntityId;

  // Observações
  observacaoInterna?: string;
  observacaoCliente?: string;
}

/** Item individual de um pedido */
export interface ItemPedido {
  id: EntityId;
  produtoId: EntityId;
  variacaoId?: EntityId;
  sku: string;
  nome: string;
  quantidade: number;
  precoUnitario: Moeda;
  desconto: Moeda;
  total: Moeda;
}
