/**
 * Tipos do domínio Financeiro.
 * Define contas, transações, fluxo de caixa e conciliação.
 */

import { BaseEntity, EntityId, Moeda } from '../common';

/** Tipo de lançamento financeiro */
export enum TipoLancamento {
  RECEITA = 'receita',
  DESPESA = 'despesa',
}

/** Status do lançamento */
export enum StatusLancamento {
  PENDENTE = 'pendente',
  PAGO = 'pago',
  ATRASADO = 'atrasado',
  CANCELADO = 'cancelado',
  PARCIAL = 'parcial',
}

/** Forma de pagamento */
export enum FormaPagamento {
  DINHEIRO = 'dinheiro',
  PIX = 'pix',
  CARTAO_CREDITO = 'cartao_credito',
  CARTAO_DEBITO = 'cartao_debito',
  BOLETO = 'boleto',
  TRANSFERENCIA = 'transferencia',
  MARKETPLACE = 'marketplace',  // Repasse do marketplace
}

/** Lançamento financeiro (conta a pagar ou receber) */
export interface LancamentoFinanceiro extends BaseEntity {
  tenantId: EntityId;
  tipo: TipoLancamento;
  descricao: string;
  valor: Moeda;
  dataVencimento: Date;
  dataPagamento?: Date;
  status: StatusLancamento;
  formaPagamento?: FormaPagamento;
  categoriaId?: EntityId;
  pedidoId?: EntityId;
  notaFiscalId?: EntityId;
  clienteId?: EntityId;
  fornecedorId?: EntityId;
  observacao?: string;
}

/** Categoria financeira */
export interface CategoriaFinanceira extends BaseEntity {
  tenantId: EntityId;
  nome: string;
  tipo: TipoLancamento;
  categoriaPaiId?: EntityId;
  cor?: string;
}
