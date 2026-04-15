/**
 * DTO para cancelamento de pedido.
 */

import { IsString, MinLength, MaxLength } from 'class-validator';

export class CancelarPedidoDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  motivo: string;
}
