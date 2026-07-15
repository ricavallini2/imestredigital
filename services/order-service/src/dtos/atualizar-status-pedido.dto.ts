/**
 * DTO para o endpoint de compatibilidade PATCH /pedidos/:id/status.
 *
 * O frontend usa uma única ação genérica de "avançar status" enviando o
 * status ALVO. Este endpoint mapeia esse alvo para a máquina de estados
 * semântica do serviço (confirmar, iniciar separação, faturar, enviar,
 * entregar, cancelar).
 *
 * Os valores de `status` são EXATAMENTE os do enum StatusPedido do Prisma
 * (fonte da verdade), em UPPERCASE_SNAKE.
 */

import { IsString, IsOptional, IsIn } from 'class-validator';

/** Valores canônicos aceitos como alvo (espelham o enum Prisma StatusPedido). */
export const STATUS_PEDIDO_VALIDOS = [
  'RASCUNHO',
  'PENDENTE',
  'CONFIRMADO',
  'EM_SEPARACAO',
  'FATURADO',
  'ENVIADO',
  'ENTREGUE',
  'CANCELADO',
  'DEVOLVIDO',
] as const;

export class AtualizarStatusPedidoDto {
  @IsString()
  @IsIn(STATUS_PEDIDO_VALIDOS as unknown as string[])
  status: string;

  // Campos opcionais usados quando o alvo é ENVIADO.
  @IsOptional()
  @IsString()
  rastreio?: string;

  @IsOptional()
  @IsString()
  transportadora?: string;

  // Motivo usado quando o alvo é CANCELADO.
  @IsOptional()
  @IsString()
  motivo?: string;
}
