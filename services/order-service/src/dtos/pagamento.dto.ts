/**
 * DTOs para pagamentos.
 */

import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class RegistrarPagamentoDto {
  @IsString()
  tipo: string; // CARTAO_CREDITO, CARTAO_DEBITO, BOLETO, PIX, TRANSFERENCIA, MARKETPLACE

  @IsString()
  status: string; // PENDENTE, AUTORIZADO, PAGO, ESTORNADO

  @IsNumber({ maxDecimalPlaces: 2 })
  valor: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  parcelas?: number;

  @IsOptional()
  @IsString()
  gateway?: string;

  @IsOptional()
  @IsString()
  transacaoExternaId?: string;

  @IsOptional()
  dadosGateway?: any;
}

export class WebhookPagamentoDto {
  @IsString()
  pedidoId: string;

  @IsString()
  status: string;

  @IsString()
  transacaoExternaId: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  dadosExtras?: any;
}

export class EstornarPagamentoDto {
  @IsString()
  motivo: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  valor?: number;
}
