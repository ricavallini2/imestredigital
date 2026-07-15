/**
 * Enums canônicos do domínio de Estoque.
 *
 * FONTE DA VERDADE: prisma/schema.prisma (sempre UPPERCASE_SNAKE).
 * Estes valores DEVEM permanecer idênticos aos enums do schema Prisma
 * e aos tipos compartilhados em packages/types/src/inventory.
 *
 * Definidos localmente (e não importados do client Prisma gerado) para
 * não depender do estado de `prisma generate`, mantendo tipagem forte
 * na fronteira service ↔ repositório.
 */

/** Tipo de movimentação de estoque */
export const TipoMovimentacao = {
  ENTRADA: 'ENTRADA',
  SAIDA: 'SAIDA',
  AJUSTE: 'AJUSTE',
  TRANSFERENCIA: 'TRANSFERENCIA',
  DEVOLUCAO: 'DEVOLUCAO',
  RESERVA: 'RESERVA',
} as const;

export type TipoMovimentacao =
  (typeof TipoMovimentacao)[keyof typeof TipoMovimentacao];

/** Motivo (natureza de negócio) da movimentação */
export const MotivoMovimentacao = {
  COMPRA: 'COMPRA',
  VENDA: 'VENDA',
  AJUSTE_INVENTARIO: 'AJUSTE_INVENTARIO',
  TRANSFERENCIA_DEPOSITO: 'TRANSFERENCIA_DEPOSITO',
  DEVOLUCAO_CLIENTE: 'DEVOLUCAO_CLIENTE',
  DEVOLUCAO_FORNECEDOR: 'DEVOLUCAO_FORNECEDOR',
  DEVOLUCAO: 'DEVOLUCAO',
  PERDA: 'PERDA',
  AVARIA: 'AVARIA',
  CONSUMO: 'CONSUMO',
  PRODUCAO: 'PRODUCAO',
  OUTRO: 'OUTRO',
} as const;

export type MotivoMovimentacao =
  (typeof MotivoMovimentacao)[keyof typeof MotivoMovimentacao];

/** Status de uma reserva de estoque */
export const StatusReserva = {
  ATIVA: 'ATIVA',
  CONFIRMADA: 'CONFIRMADA',
  CANCELADA: 'CANCELADA',
  EXPIRADA: 'EXPIRADA',
} as const;

export type StatusReserva =
  (typeof StatusReserva)[keyof typeof StatusReserva];
