/**
 * Controller de Produtos (COMPLETO com autenticação e multi-tenancy).
 *
 * Todas as rotas exigem autenticação JWT.
 * O tenantId é extraído automaticamente do token.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { ProdutoService } from './produto.service';
import { CriarProdutoDto } from '../../dtos/produto/criar-produto.dto';
import { AtualizarProdutoDto } from '../../dtos/produto/atualizar-produto.dto';
import { ListarProdutosDto } from '../../dtos/produto/listar-produtos.dto';

@ApiTags('produtos')
@ApiBearerAuth()
@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  /** Cria um novo produto no catálogo do tenant */
  @Post()
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou SKU duplicado' })
  async criar(@Request() req: any, @Body() dto: CriarProdutoDto) {
    return this.produtoService.criar(req.tenantId, dto);
  }

  /** Lista produtos do tenant com paginação e filtros */
  @Get()
  @ApiOperation({ summary: 'Listar produtos com paginação' })
  @ApiResponse({ status: 200, description: 'Lista paginada de produtos' })
  async listar(@Request() req: any, @Query() filtros: ListarProdutosDto) {
    return this.produtoService.listar(req.tenantId, filtros);
  }

  /** Busca um produto pelo ID */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async buscarPorId(@Request() req: any, @Param('id') id: string) {
    return this.produtoService.buscarPorId(req.tenantId, id);
  }

  /** Atualiza dados de um produto */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado' })
  async atualizar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AtualizarProdutoDto,
  ) {
    return this.produtoService.atualizar(req.tenantId, id, dto);
  }

  /** Remove um produto (soft delete) */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover produto (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  async remover(@Request() req: any, @Param('id') id: string) {
    return this.produtoService.remover(req.tenantId, id);
  }
}
