/**
 * DTO para Item de Nota Fiscal
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
  quantidade: number; // Em centavos ou menor unidade

  @IsNumber()
  @Min(0)
  valorUnitario: number; // Em centavos

  @IsNumber()
  @Min(0)
  valorTotal: number; // Em centavos

  @IsNumber()
  @Min(0)
  valorDesconto: number = 0; // Em centavos

  @IsString()
  origemMercadoria: string; // 0=Nacional, 1=Estrangeira direita, 2=Estrangeira adquirida

  @IsString()
  cstIcms: string; // Código de Situação Tributária (ICMS)

  @IsNumber()
  @Min(0)
  aliquotaIcms: number = 0; // Em centavos de percentual

  @IsString()
  cstPis: string; // CST PIS

  @IsNumber()
  @Min(0)
  aliquotaPis: number = 0;

  @IsString()
  cstCofins: string; // CST COFINS

  @IsNumber()
  @Min(0)
  aliquotaCofins: number = 0;

  @IsString()
  cstIpi?: string; // CST IPI (opcional)

  @IsNumber()
  @Min(0)
  aliquotaIpi: number = 0;
}
