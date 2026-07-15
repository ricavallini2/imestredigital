/**
 * Controller de Variações de Produto (autenticação + multi-tenancy).
 *
 * Rotas aninhadas sob o produto (api/v1/produtos/:id/variacoes). O tenantId vem
 * do TenantMiddleware em `req.tenantId`; `:id` é o produto e `:variacaoId` a
 * variação. As rotas estáticas (`prever`, `lote`) são declaradas antes de
 * `:variacaoId` para não serem capturadas como parâmetro.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger'

import { VariacaoService } from './variacao.service'
import { PreverVariacoesDto } from '../../dtos/variacao/prever-variacoes.dto'
import { SalvarVariacoesLoteDto } from '../../dtos/variacao/salvar-variacoes-lote.dto'
import { AtualizarVariacaoDto } from '../../dtos/variacao/atualizar-variacao.dto'

@ApiTags('variacoes')
@ApiBearerAuth()
@Controller('produtos/:id/variacoes')
export class VariacaoController {
  constructor(private readonly variacaoService: VariacaoService) {}

  /** Lista as variações do produto (com atributos e imagens). */
  @Get()
  @ApiOperation({ summary: 'Listar variações do produto' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiResponse({ status: 200, description: 'Lista de variações' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async listar(@Request() req: any, @Param('id') produtoId: string) {
    return this.variacaoService.listar(req.tenantId, produtoId)
  }

  /**
   * Prevê (gera sem persistir) a matriz de variações a partir de uma grade.
   * Declarada antes de `:variacaoId` para não colidir com a rota de item.
   */
  @Post('prever')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Prever matriz de variações a partir de uma grade' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiResponse({ status: 200, description: 'Matriz de variações gerada (não persistida)' })
  @ApiResponse({ status: 404, description: 'Produto ou grade não encontrados' })
  async prever(
    @Request() req: any,
    @Param('id') produtoId: string,
    @Body() dto: PreverVariacoesDto,
  ) {
    return this.variacaoService.prever(req.tenantId, produtoId, dto)
  }

  /**
   * Salva variações em lote (upsert por SKU) e retorna as persistidas.
   * Declarada antes de `:variacaoId` para não colidir com a rota de item.
   */
  @Post('lote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Salvar variações em lote (upsert por SKU)' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiResponse({ status: 200, description: 'Variações persistidas' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async salvarLote(
    @Request() req: any,
    @Param('id') produtoId: string,
    @Body() dto: SalvarVariacoesLoteDto,
  ) {
    return this.variacaoService.salvarLote(req.tenantId, produtoId, dto.variacoes)
  }

  /** Atualiza uma variação individual do produto. */
  @Put(':variacaoId')
  @ApiOperation({ summary: 'Atualizar variação do produto' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiParam({ name: 'variacaoId', description: 'UUID da variação' })
  @ApiResponse({ status: 200, description: 'Variação atualizada' })
  @ApiResponse({ status: 404, description: 'Produto ou variação não encontrados' })
  async atualizar(
    @Request() req: any,
    @Param('id') produtoId: string,
    @Param('variacaoId') variacaoId: string,
    @Body() dto: AtualizarVariacaoDto,
  ) {
    return this.variacaoService.atualizarVariacao(req.tenantId, produtoId, variacaoId, dto)
  }

  /** Remove uma variação individual (atributos/imagens saem em cascata). */
  @Delete(':variacaoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover variação do produto' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiParam({ name: 'variacaoId', description: 'UUID da variação' })
  @ApiResponse({ status: 404, description: 'Produto ou variação não encontrados' })
  async remover(
    @Request() req: any,
    @Param('id') produtoId: string,
    @Param('variacaoId') variacaoId: string,
  ) {
    return this.variacaoService.removerVariacao(req.tenantId, produtoId, variacaoId)
  }
}
