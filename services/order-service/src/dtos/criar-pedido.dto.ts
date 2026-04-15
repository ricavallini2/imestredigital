/**
 * DTO para criação de pedido.
 */

import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoCreateDto {
  @IsString()
  produtoId: string;

  @IsOptional()
  @IsString()
  variacaoId?: string;

  @IsString()
  sku: string;

  @IsString()
  titulo: string;

  @IsNumber()
  quantidade: number;

  @IsDecimal()
  valorUnitario: number;

  @IsOptional()
  @IsDecimal()
  valorDesconto?: number;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsOptional()
  @IsNumber()
  largura?: number;

  @IsOptional()
  @IsNumber()
  altura?: number;

  @IsOptional()
  @IsNumber()
  comprimento?: number;
}

export class EnderecoEntregaDto {
  @IsString()
  cep: string;

  @IsString()
  rua: string;

  @IsString()
  numero: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsString()
  bairro: string;

  @IsString()
  cidade: string;

  @IsString()
  uf: string;
}

export class CriarPedidoDto {
  @IsOptional()
  @IsString()
  origem?: string; // LOJA, MARKETPLACE, ECOMMERCE, MANUAL

  @IsOptional()
  @IsString()
  canalOrigem?: string; // MERCADOLIVRE, SHOPEE, AMAZON, MAGALU, SITE, LOJA_FISICA, MANUAL

  @IsOptional()
  @IsString()
  pedidoExternoId?: string;

  @IsOptional()
  @IsString()
  clienteId?: string;

  @IsString()
  clienteNome: string;

  @IsOptional()
  @IsString()
  clienteEmail?: string;

  @IsOptional()
  @IsString()
  clienteCpfCnpj?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoCreateDto)
  itens: ItemPedidoCreateDto[];

  @IsOptional()
  @IsString()
  metodoPagamento?: string;

  @IsOptional()
  @IsNumber()
  parcelas?: number;

  @IsOptional()
  @IsDecimal()
  valorDesconto?: number;

  @IsOptional()
  @IsDecimal()
  valorFrete?: number;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoEntregaDto)
  enderecoEntrega?: EnderecoEntregaDto;
}
