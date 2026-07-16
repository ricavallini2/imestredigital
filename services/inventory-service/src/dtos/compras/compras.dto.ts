/**
 * DTOs do módulo de Compras (pedidos de compra e recebimento).
 */

import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsUUID,
  IsArray,
  IsIn,
  Min,
  Max,
  MaxLength,
  ValidateNested,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const STATUS_COMPRA = [
  'RASCUNHO',
  'ENVIADO',
  'AGUARDANDO_RECEBIMENTO',
  'RECEBIDO_PARCIAL',
  'RECEBIDO',
  'CANCELADO',
] as const;

export class ItemCompraDto {
  @ApiPropertyOptional({ description: 'UUID do produto no catálogo (opcional em item de NF-e)' })
  @IsOptional()
  @IsUUID()
  produtoId?: string;

  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  produtoNome: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  sku: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  ncm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(6)
  cfop?: string;

  @ApiPropertyOptional({ default: 'UN' })
  @IsOptional()
  @IsString()
  @MaxLength(6)
  unidade?: string;

  @ApiProperty({ description: 'Quantidade pedida' })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantidade: number;

  @ApiProperty({ description: 'Valor unitário em reais' })
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  valorUnitario: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorIcms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorIpi?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorPis?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorCofins?: number;
}

export class CriarCompraDto {
  @ApiPropertyOptional({ description: 'UUID do fornecedor (parceiro no customer-service)' })
  @IsOptional()
  @IsUUID()
  fornecedorId?: string;

  @ApiProperty({ description: 'Nome do fornecedor (desnormalizado, padrão do projeto)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fornecedorNome: string;

  @ApiProperty({ type: [ItemCompraDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCompraDto)
  itens: ItemCompraDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorFrete?: number;

  @ApiPropertyOptional({ description: 'Data prevista de entrega (ISO)' })
  @IsOptional()
  @IsDateString()
  dataPrevistaEntrega?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  condicaoPagamento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  formaPagamento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Status inicial (RASCUNHO ou ENVIADO). Default RASCUNHO.',
    enum: ['RASCUNHO', 'ENVIADO', 'AGUARDANDO_RECEBIMENTO'],
  })
  @IsOptional()
  @IsIn(['RASCUNHO', 'ENVIADO', 'AGUARDANDO_RECEBIMENTO'])
  status?: string;
}

export class ItemRecebidoDto {
  @ApiProperty({ description: 'UUID do item do pedido de compra' })
  @IsUUID()
  itemId: string;

  @ApiProperty({ description: 'Quantidade recebida AGORA (incremental)' })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  quantidadeRecebida: number;
}

export class ReceberCompraDto {
  @ApiProperty({ type: [ItemRecebidoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemRecebidoDto)
  itensRecebidos: ItemRecebidoDto[];

  @ApiPropertyOptional({
    description: 'Depósito de destino da entrada. Default: primeiro depósito ativo do tenant.',
  })
  @IsOptional()
  @IsUUID()
  depositoId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacao?: string;
}

export class ImportarNfeDto {
  @ApiProperty({ description: 'XML completo da NF-e (procNFe ou NFe)' })
  @IsString()
  @IsNotEmpty()
  xml: string;
}

export class ListarComprasDto {
  @ApiPropertyOptional({ enum: STATUS_COMPRA })
  @IsOptional()
  @IsIn(STATUS_COMPRA as unknown as string[])
  status?: string;

  @ApiPropertyOptional({ description: 'Busca por número, fornecedor ou chave da NF-e' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  busca?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limite?: number = 20;
}
