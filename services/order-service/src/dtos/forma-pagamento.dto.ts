/**
 * DTOs do cadastro de Formas de Pagamento.
 */

import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsBoolean,
  IsIn,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export const TIPOS_FORMA_PAGAMENTO = [
  'DINHEIRO',
  'PIX',
  'CARTAO_CREDITO',
  'CARTAO_DEBITO',
  'BOLETO',
  'TRANSFERENCIA',
  'OUTRO',
] as const;

export class CriarFormaPagamentoDto {
  @IsString()
  @MaxLength(80)
  descricao: string;

  @IsIn(TIPOS_FORMA_PAGAMENTO as unknown as string[], { message: 'Tipo de pagamento inválido' })
  tipo: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  bandeira?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24)
  parcelas?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Max(100)
  taxaPct?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  taxaFixa?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  prazoRecebimentoDias?: number;

  @IsOptional()
  @IsBoolean()
  ativa?: boolean;
}

export class AtualizarFormaPagamentoDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  descricao?: string;

  @IsOptional()
  @IsIn(TIPOS_FORMA_PAGAMENTO as unknown as string[], { message: 'Tipo de pagamento inválido' })
  tipo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  bandeira?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24)
  parcelas?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Max(100)
  taxaPct?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  taxaFixa?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  prazoRecebimentoDias?: number;

  @IsOptional()
  @IsBoolean()
  ativa?: boolean;
}

export class ListarFormasPagamentoDto {
  @IsOptional()
  @IsIn(TIPOS_FORMA_PAGAMENTO as unknown as string[])
  tipo?: string;

  @IsOptional()
  // Transform explícito: @Type(() => Boolean) converteria "false" em true.
  @Transform(({ value }) => (value === undefined ? undefined : value === true || value === 'true'))
  @IsBoolean()
  ativa?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limite?: number = 100;
}
