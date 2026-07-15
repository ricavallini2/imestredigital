/**
 * DTO para criação de pedido.
 */

import { IsString, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
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

  @IsNumber({ maxDecimalPlaces: 2 })
  valorUnitario: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
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
  // Enum OrigemPedido: LOJA_FISICA | ECOMMERCE | MARKETPLACE | TELEFONE | WHATSAPP | MANUAL | OUTRO.
  // Ausente → default OUTRO no service. MANUAL = pedido digitado no ERP.
  origem?: string;

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
  @IsNumber({ maxDecimalPlaces: 2 })
  valorDesconto?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  valorFrete?: number;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoEntregaDto)
  enderecoEntrega?: EnderecoEntregaDto;
}
