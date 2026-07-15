/**
 * Tipos do domínio de Estoque.
 * Define movimentações, depósitos e controle de inventário.
 *
 * FONTE DA VERDADE dos enums: schema.prisma do inventory-service
 * (sempre UPPERCASE_SNAKE). Estes valores DEVEM permanecer idênticos
 * ao Prisma e aos enums locais do serviço (src/enums/estoque.enums.ts).
 */

import { BaseEntity, EntityId } from '../common'

/** Tipo de movimentação de estoque */
export enum TipoMovimentacao {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
  AJUSTE = 'AJUSTE',
  TRANSFERENCIA = 'TRANSFERENCIA',
  DEVOLUCAO = 'DEVOLUCAO',
  RESERVA = 'RESERVA',
}

/** Motivo (natureza de negócio) da movimentação */
export enum MotivoMovimentacao {
  COMPRA = 'COMPRA',
  VENDA = 'VENDA',
  AJUSTE_INVENTARIO = 'AJUSTE_INVENTARIO',
  TRANSFERENCIA_DEPOSITO = 'TRANSFERENCIA_DEPOSITO',
  DEVOLUCAO_CLIENTE = 'DEVOLUCAO_CLIENTE',
  DEVOLUCAO_FORNECEDOR = 'DEVOLUCAO_FORNECEDOR',
  DEVOLUCAO = 'DEVOLUCAO',
  PERDA = 'PERDA',
  AVARIA = 'AVARIA',
  CONSUMO = 'CONSUMO',
  PRODUCAO = 'PRODUCAO',
  OUTRO = 'OUTRO',
}

/** Status de uma reserva de estoque */
export enum StatusReserva {
  ATIVA = 'ATIVA',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
  EXPIRADA = 'EXPIRADA',
}

/** Depósito / Centro de distribuição */
export interface Deposito extends BaseEntity {
  tenantId: EntityId
  nome: string
  codigo: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  ativo: boolean
  principal: boolean
}

/** Posição de estoque de um produto em um depósito */
export interface PosicaoEstoque {
  produtoId: EntityId
  variacaoId?: EntityId
  depositoId: EntityId
  quantidadeDisponivel: number
  quantidadeReservada: number
  quantidadeMinima: number
  localizacao?: string // Corredor, prateleira, etc.
}

/** Movimentação individual de estoque */
export interface MovimentacaoEstoque extends BaseEntity {
  tenantId: EntityId
  produtoId: EntityId
  variacaoId?: EntityId
  depositoOrigemId?: EntityId
  depositoDestinoId?: EntityId
  tipo: TipoMovimentacao
  motivo: MotivoMovimentacao
  quantidade: number
  pedidoId?: EntityId
  notaFiscalId?: EntityId
  // Autor da movimentação (auditoria). Opcional: movimentações originadas
  // por evento Kafka (ex.: reserva de pedido) não têm usuário associado.
  usuarioId?: EntityId
}
