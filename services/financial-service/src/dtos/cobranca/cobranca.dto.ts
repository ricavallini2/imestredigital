/**
 * DTOs do módulo de Cobrança (financial-service).
 */

import {
  IsString,
  IsOptional,
  IsIn,
  IsNumber,
  IsInt,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  Min,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const STATUS_TITULO = [
  'EM_ABERTO',
  'EM_COBRANCA',
  'NEGOCIANDO',
  'ACORDO',
  'PAGO',
  'PERDIDO',
] as const;
export const PRIORIDADES = ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'] as const;
export const TIPOS_ACAO = ['WHATSAPP', 'EMAIL', 'SMS', 'LIGACAO'] as const;

export class ListarTitulosDto {
  @ApiPropertyOptional({ enum: STATUS_TITULO })
  @IsOptional()
  @IsIn(STATUS_TITULO as unknown as string[])
  status?: string;

  @ApiPropertyOptional({ enum: PRIORIDADES })
  @IsOptional()
  @IsIn(PRIORIDADES as unknown as string[])
  prioridade?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  diasMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  diasMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  busca?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @ApiPropertyOptional({ default: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limite?: number = 100;
}

export class CriarTituloDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  clienteNome: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  descricao: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor: number;

  @IsString()
  @IsNotEmpty()
  dataVencimento: string;

  @IsOptional()
  @IsString()
  clienteId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  clienteTelefone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  clienteEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observacao?: string;
}

export class AcaoCobrancaDto {
  @IsIn(TIPOS_ACAO as unknown as string[])
  tipo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  mensagem: string;

  @IsOptional()
  @IsBoolean()
  automatica?: boolean;
}

export class NegociarDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  descontoAplicado: number;

  @IsInt()
  @Min(1)
  @Max(48)
  numeroParcelas: number;

  @IsOptional()
  @IsString()
  primeiroVencimento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observacao?: string;
}

export class PagarParcelaDto {
  @IsInt()
  @Min(1)
  numeroParcela: number;
}

export class RegraCobrancaDto {
  @IsInt()
  @Min(0)
  diasAtraso: number;

  @IsIn(TIPOS_ACAO as unknown as string[])
  canal: string;

  @IsString()
  @MaxLength(2000)
  template: string;

  @IsBoolean()
  ativo: boolean;
}

export class ConfiguracaoCobrancaDto {
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  webhookN8n?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  callbackUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RegraCobrancaDto)
  regras?: RegraCobrancaDto[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  descontoMaximo?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(48)
  parcelasMaximas?: number;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  horarioInicio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  horarioFim?: string;

  @IsOptional()
  @IsBoolean()
  pausarFimDeSemana?: boolean;
}

export class FiltroDisparoDto {
  @IsOptional()
  @IsIn(PRIORIDADES as unknown as string[])
  prioridade?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  diasMin?: number;
}

export class DispararDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => FiltroDisparoDto)
  filtro?: FiltroDisparoDto;
}

export class ListarAcordosDto {
  @IsOptional()
  @IsIn(['ATIVO', 'CUMPRIDO', 'QUEBRADO'])
  status?: string;

  @IsOptional()
  @IsString()
  clienteId?: string;
}

export class ListarHistoricoDto {
  @IsOptional()
  @IsString()
  tituloId?: string;

  @IsOptional()
  @IsIn(TIPOS_ACAO as unknown as string[])
  tipo?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  dataInicio?: string;

  @IsOptional()
  @IsString()
  dataFim?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  busca?: string;
}
