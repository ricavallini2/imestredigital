/**
 * DTO para atualização de produto.
 *
 * Campos escalares são opcionais (atualização parcial) via PartialType do DTO
 * de criação.
 *
 * Adicionalmente aceita `variacoes?` — a lista de variações embutida que a tela
 * de produto do front envia no mesmo PUT. O shape é tolerante (ver
 * ProdutoVariacaoEmbutidaDto): aceita tanto o formato canônico quanto o legado
 * da UI. O produto service extrai esse campo, normaliza e faz o upsert em lote
 * das variações (reuso da lógica dos endpoints dedicados), evitando o 400 que
 * ocorria quando o DTO estrito rejeitava `variacoes` por forbidNonWhitelisted.
 */

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsArray, ArrayMaxSize, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { CriarProdutoDto } from './criar-produto.dto'
import { ProdutoVariacaoEmbutidaDto } from '../variacao/produto-variacao-embutida.dto'

export class AtualizarProdutoDto extends PartialType(CriarProdutoDto) {
  @ApiPropertyOptional({
    description:
      'Variações do produto (upsert em lote no mesmo update). Aceita o shape ' +
      'canônico { sku, nome, precoVenda?, gtin?, peso?, atributos[] } e o legado ' +
      'da UI { tipo, valor, sku?, preco?, precoCusto?, estoque }.',
    type: [ProdutoVariacaoEmbutidaDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500, { message: 'No máximo 500 variações por atualização' })
  @ValidateNested({ each: true })
  @Type(() => ProdutoVariacaoEmbutidaDto)
  variacoes?: ProdutoVariacaoEmbutidaDto[]
}
