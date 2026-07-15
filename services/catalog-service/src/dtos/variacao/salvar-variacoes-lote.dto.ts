/**
 * DTO para salvar variações em LOTE (upsert por (produtoId, sku) em transação).
 *
 * É o corpo do endpoint POST :id/variacoes/lote e também o shape aceito pelo
 * campo `variacoes` do AtualizarProdutoDto (o PUT do produto reusa a mesma
 * lógica de upsert em lote).
 */

import { IsArray, ArrayNotEmpty, ArrayMaxSize, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { VariacaoItemDto } from './variacao-item.dto'

export class SalvarVariacoesLoteDto {
  @ApiProperty({ description: 'Lista de variações a persistir', type: [VariacaoItemDto] })
  @IsArray()
  @ArrayNotEmpty({ message: 'Informe pelo menos uma variação' })
  @ArrayMaxSize(500, { message: 'No máximo 500 variações por lote' })
  @ValidateNested({ each: true })
  @Type(() => VariacaoItemDto)
  variacoes: VariacaoItemDto[]
}
