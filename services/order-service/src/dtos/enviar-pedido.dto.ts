/**
 * DTO para envio de pedido (rastreamento).
 */

import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class EnviarPedidoDto {
  @IsString()
  codigoRastreio: string;

  @IsString()
  transportadora: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  prazoEntrega?: number; // dias
}
