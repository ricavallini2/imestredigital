/**
 * Valores canônicos dos enums do domínio financeiro.
 *
 * FONTE DA VERDADE: prisma/schema.prisma (sempre UPPERCASE_SNAKE).
 * Estes arrays existem para uso em @IsEnum nos DTOs e devem espelhar
 * exatamente os enums do Prisma. Ao alterar o schema, atualize aqui.
 */

/** TipoLancamento (Prisma). */
export const TIPOS_LANCAMENTO = ['RECEITA', 'DESPESA', 'TRANSFERENCIA'] as const

/** StatusLancamento (Prisma). */
export const STATUS_LANCAMENTO = [
  'PENDENTE',
  'PAGO',
  'ATRASADO',
  'CANCELADO',
  'PARCIAL',
] as const

/** FormaPagamento (Prisma) — canonical brasileiro. */
export const FORMAS_PAGAMENTO = [
  'DINHEIRO',
  'PIX',
  'CARTAO_CREDITO',
  'CARTAO_DEBITO',
  'BOLETO',
  'TRANSFERENCIA',
  'TED',
  'DOC',
  'CHEQUE',
  'OUTRO',
] as const

/** TipoConta (Prisma). */
export const TIPOS_CONTA = [
  'CORRENTE',
  'POUPANCA',
  'INVESTIMENTO',
  'CAIXA',
  'CARTAO',
  'DIGITAL',
] as const

/** FrequenciaRecorrencia — subconjunto suportado para parcelamento. */
export const INTERVALOS_PARCELAMENTO = ['SEMANAL', 'QUINZENAL', 'MENSAL'] as const
