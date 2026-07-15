/**
 * Tipos do domínio de Pedidos (OMS - Order Management System).
 * Define o ciclo de vida completo de um pedido, da criação à entrega.
 *
 * FONTE DA VERDADE: o enum StatusPedido do Prisma (order-service), sempre
 * UPPERCASE_SNAKE. Estes valores DEVEM espelhar exatamente
 * services/order-service/prisma/schema.prisma e os mocks do frontend.
 */

import { BaseEntity, EntityId, Moeda, Endereco } from '../common';

/**
 * Status do pedido no fluxo.
 * Espelha 1:1 o enum StatusPedido do Prisma (order-service).
 */
export enum StatusPedido {
  RASCUNHO = 'RASCUNHO',
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  EM_SEPARACAO = 'EM_SEPARACAO',
  FATURADO = 'FATURADO',
  ENVIADO = 'ENVIADO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO',
  DEVOLVIDO = 'DEVOLVIDO',
}

/**
 * Canal de origem do pedido.
 *
 * No Prisma, `canalOrigem` é uma string livre (não é enum), então este
 * conjunto representa os canais atualmente suportados pelo produto, em
 * UPPERCASE para alinhar com os mocks e o frontend. Novos canais podem ser
 * adicionados aqui sem migração de banco.
 */
export enum CanalPedido {
  BALCAO = 'BALCAO',
  INTERNA = 'INTERNA',
  SHOPIFY = 'SHOPIFY',
  MERCADO_LIVRE = 'MERCADO_LIVRE',
  SHOPEE = 'SHOPEE',
  AMAZON = 'AMAZON',
  MAGALU = 'MAGALU',
  OUTROS = 'OUTROS',
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
