/**
 * DTOs da importação de NF-e em DUAS ETAPAS.
 *
 * 1) POST /compras/analisar-nfe  → só LÊ e devolve o que foi reconhecido
 *    (fornecedor + itens, com diferenças e sugestões). NÃO grava nada.
 * 2) POST /compras/importar-nfe  → recebe o XML de novo + as DECISÕES do
 *    usuário e efetiva: cria/atualiza fornecedor, cria produtos, grava os
 *    vínculos De-Para e cria o pedido de compra.
 *
 * O fluxo é STATELESS de propósito: a confirmação reenvia o XML em vez de
 * depender de uma análise guardada no servidor (sem rascunho, sem TTL, e o
 * servidor revalida tudo na hora de gravar).
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsArray,
  IsNumber,
  Min,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Formato UUID sem exigir dígito de versão (IDs do seed são sintéticos). */
const UUID_FORMATO = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const ACOES_FORNECEDOR = ['USAR_EXISTENTE', 'CRIAR', 'ATUALIZAR'] as const;
export const ACOES_ITEM = ['VINCULAR', 'CRIAR', 'IGNORAR'] as const;

export class AnalisarNfeDto {
  @ApiProperty({ description: 'XML completo da NF-e (procNFe ou NFe)' })
  @IsString()
  @IsNotEmpty()
  xml: string;
}

export class DecisaoFornecedorDto {
  @ApiProperty({
    enum: ACOES_FORNECEDOR,
    description:
      'USAR_EXISTENTE: vincula ao parceiro informado. CRIAR: cadastra o fornecedor da NF-e. ' +
      'ATUALIZAR: usa o existente E grava os campos listados em `camposAtualizar`.',
  })
  @IsIn(ACOES_FORNECEDOR as unknown as string[])
  acao: string;

  @ApiPropertyOptional({ description: 'Parceiro do cadastro (obrigatório em USAR_EXISTENTE/ATUALIZAR)' })
  @IsOptional()
  @IsString()
  clienteId?: string;

  @ApiPropertyOptional({
    description:
      'Campos da NF-e a gravar no cadastro (só em ATUALIZAR). Ex.: ["razaoSocial","telefone"]. ' +
      'Campo fora da lista NÃO é tocado.',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  camposAtualizar?: string[];
}

/** Dados mínimos para cadastrar um produto novo a partir do item da nota. */
export class NovoProdutoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nome: string;

  @ApiProperty({ description: 'SKU no NOSSO catálogo (default: código do fornecedor)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  sku: string;

  @ApiPropertyOptional({ description: 'Preço de venda; 0 quando ainda não definido' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precoVenda?: number;

  @ApiPropertyOptional({ description: 'Custo — default: valor unitário da nota' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  precoCusto?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  ean?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  ncm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(6)
  unidade?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoriaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  marcaId?: string;
}

export class DecisaoItemDto {
  @ApiProperty({ description: 'cProd do item na NF-e — é a chave que casa com a análise' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({
    enum: ACOES_ITEM,
    description:
      'VINCULAR: usa `produtoId` do catálogo. CRIAR: cadastra `novoProduto`. ' +
      'IGNORAR: entra no pedido sem produto (não movimenta estoque no recebimento).',
  })
  @IsIn(ACOES_ITEM as unknown as string[])
  acao: string;

  @ApiPropertyOptional({ description: 'Obrigatório em VINCULAR' })
  @IsOptional()
  @IsString()
  produtoId?: string;

  @ApiPropertyOptional({ type: NovoProdutoDto, description: 'Obrigatório em CRIAR' })
  @IsOptional()
  @ValidateNested()
  @Type(() => NovoProdutoDto)
  novoProduto?: NovoProdutoDto;

  @ApiPropertyOptional({
    default: true,
    description:
      'Grava o De-Para (CNPJ + código do fornecedor → produto) para a PRÓXIMA nota ' +
      'já reconhecer o item. Só faz sentido em VINCULAR/CRIAR.',
  })
  @IsOptional()
  salvarVinculo?: boolean;
}

export class ConfirmarImportacaoNfeDto {
  @ApiProperty({ description: 'O MESMO XML enviado na análise' })
  @IsString()
  @IsNotEmpty()
  xml: string;

  @ApiProperty({ type: DecisaoFornecedorDto })
  @ValidateNested()
  @Type(() => DecisaoFornecedorDto)
  fornecedor: DecisaoFornecedorDto;

  @ApiProperty({ type: [DecisaoItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DecisaoItemDto)
  itens: DecisaoItemDto[];
}

export { UUID_FORMATO };
