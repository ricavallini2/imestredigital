/**
 * DTO para criar Nota Fiscal
 */

import { IsString, IsNumber, IsOptional, IsISO8601, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemNotaFiscalDto } from './item-nota-fiscal.dto';

/**
 * Dados do emitente ou destinatário (JSON)
 */
export class DadosPessoaDto {
  @IsString()
  nome: string;

  @IsString()
  cpfCnpj: string;

  @IsOptional()
  @IsString()
  inscricaoEstadual?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  email?: string;
}

/**
 * DTO para criar Nota Fiscal
 */
export class CriarNotaFiscalDto {
  @IsString()
  tipo: 'NFE' | 'NFSE' | 'NFCE'; // Tipo da nota fiscal

  @IsOptional()
  @IsString()
  serie?: string;

  @IsOptional()
  @IsNumber()
  numero?: number;

  @IsString()
  naturezaOperacao: string; // VENDA, DEVOLUCAO, etc

  @IsISO8601()
  dataEmissao: string;

  @IsOptional()
  @IsISO8601()
  dataSaida?: string;

  @IsOptional()
  @IsString()
  clienteId?: string; // UUID do cliente

  @IsOptional()
  @ValidateNested()
  @Type(() => DadosPessoaDto)
  destinatario?: DadosPessoaDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemNotaFiscalDto)
  itens: ItemNotaFiscalDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorFrete?: number; // Em centavos

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorSeguro?: number; // Em centavos

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorOutros?: number; // Em centavos

  @IsOptional()
  @IsString()
  informacoesAdicionais?: string;

  @IsOptional()
  @IsString()
  pedidoId?: string; // UUID do pedido relacionado
}
