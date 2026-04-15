/**
 * DTO para registrar pagamento de lançamento.
 */

import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    enum: ['PIX', 'TED', 'DOC', 'BOLETO', 'DINHEIRO', 'CARTAO'],
    required: false,
  })
  @IsString()
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
