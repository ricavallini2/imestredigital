/**
 * Tipos do domínio Financeiro.
 * Define contas, transações, fluxo de caixa e conciliação.
 */

import { BaseEntity, EntityId, Moeda } from '../common';

// Enums UPPERCASE espelhando o schema Prisma do financial-service.

/** Tipo de lançamento financeiro (Prisma `TipoLancamento`). */
export enum TipoLancamento {
  RECEITA = 'RECEITA',
  DESPESA = 'DESPESA',
  TRANSFERENCIA = 'TRANSFERENCIA',
}

/** Status do lançamento (Prisma `StatusLancamento`). */
export enum StatusLancamento {
  PENDENTE = 'PENDENTE',
  PAGO = 'PAGO',
  ATRASADO = 'ATRASADO',
  CANCELADO = 'CANCELADO',
  PARCIAL = 'PARCIAL',
}

/** Forma de pagamento (Prisma `FormaPagamento`). */
export enum FormaPagamento {
  DINHEIRO = 'DINHEIRO',
  PIX = 'PIX',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  BOLETO = 'BOLETO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  TED = 'TED',
  DOC = 'DOC',
  CHEQUE = 'CHEQUE',
  OUTRO = 'OUTRO',
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
