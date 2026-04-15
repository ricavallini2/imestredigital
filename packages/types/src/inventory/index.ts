/**
 * Tipos do domínio de Estoque.
 * Define movimentações, depósitos e controle de inventário.
 */

import { BaseEntity, EntityId } from '../common';

/** Tipo de movimentação de estoque */
export enum TipoMovimentacao {
  ENTRADA = 'entrada',
  SAIDA = 'saida',
  TRANSFERENCIA = 'transferencia',
  AJUSTE = 'ajuste',
  RESERVA = 'reserva',
  DEVOLUCAO = 'devolucao',
}

/** Depósito / Centro de distribuição */
export interface Deposito extends BaseEntity {
  tenantId: EntityId;
  nome: string;
  codigo: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo: boolean;
  principal: boolean;
}

/** Posição de estoque de um produto em um depósito */
export interface PosicaoEstoque {
  produtoId: EntityId;
  variacaoId?: EntityId;
  depositoId: EntityId;
  quantidadeDisponivel: number;
  quantidadeReservada: number;
  quantidadeMinima: number;
  localizacao?: string; // Corredor, prateleira, etc.
}

/** Movimentação individual de estoque */
export interface MovimentacaoEstoque extends BaseEntity {
  tenantId: EntityId;
  produtoId: EntityId;
  variacaoId?: EntityId;
  depositoOrigemId?: EntityId;
  depositoDestinoId?: EntityId;
  tipo: TipoMovimentacao;
  quantidade: number;
  motivo: string;
  pedidoId?: EntityId;
  notaFiscalId?: EntityId;
  usuarioId: EntityId;
}
