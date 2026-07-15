/**
 * DTO para Item de Nota Fiscal
 *
 * Unidade monetária: todos os valores em REAIS (ex.: 1234.56 = R$ 1.234,56),
 * consistente com as colunas Decimal(19,2) do schema. Alíquotas são frações
 * decimais (ex.: 0.18 = 18%), consistentes com Decimal(5,4).
 */

import { IsString, IsNumber, Min } from 'class-validator';

export class ItemNotaFiscalDto {
  @IsString()
  produtoId: string; // UUID do produto

  @IsString()
  descricao: string;

  @IsString()
  ncm: string; // Código NCM (8 dígitos)

  @IsString()
  cfop: string; // Código CFOP

  @IsString()
  unidade: string; // UN, KG, L, etc

  @IsNumber()
  @Min(0)
  quantidade: number; // Quantidade comercializada

  @IsNumber()
  @Min(0)
  valorUnitario: number; // Em reais

  @IsNumber()
  @Min(0)
  valorTotal: number; // Em reais

  @IsNumber()
  @Min(0)
  valorDesconto: number = 0; // Em reais

  @IsString()
  origemMercadoria: string; // 0=Nacional, 1=Estrangeira direita, 2=Estrangeira adquirida

  @IsString()
  cstIcms: string; // Código de Situação Tributária (ICMS)

  @IsNumber()
  @Min(0)
  aliquotaIcms: number = 0; // Fração decimal (0.18 = 18%)

  @IsString()
  cstPis: string; // CST PIS

  @IsNumber()
  @Min(0)
  aliquotaPis: number = 0; // Fração decimal

  @IsString()
  cstCofins: string; // CST COFINS

  @IsNumber()
  @Min(0)
  aliquotaCofins: number = 0; // Fração decimal

  @IsString()
  cstIpi?: string; // CST IPI (opcional)

  @IsNumber()
  @Min(0)
  aliquotaIpi: number = 0; // Fração decimal
}
