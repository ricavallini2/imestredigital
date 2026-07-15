/**
 * DTO para registrar pagamento de lançamento.
 */

import { IsString, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FORMAS_PAGAMENTO } from '../enums';

export class PagarLancamentoDTO {
  @ApiProperty({
    description: 'Data do pagamento (ISO 8601)',
    example: '2026-03-25',
  })
  @IsDateString()
  dataPagamento: string;

  @ApiProperty({
    description: 'Valor pago (pode ser diferente do valor original)',
    example: 1500.50,
  })
  @IsNumber()
  @IsOptional()
  valorPago?: number;

  @ApiProperty({
    description: 'ID da conta de débito',
    required: false,
  })
  @IsString()
  @IsOptional()
  contaId?: string;

  @ApiProperty({
    description: 'Forma de pagamento',
    enum: FORMAS_PAGAMENTO,
    required: false,
  })
  @IsEnum(FORMAS_PAGAMENTO)
  @IsOptional()
  formaPagamento?: string;

  @ApiProperty({
    description: 'Observações sobre o pagamento',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacao?: string;
}
