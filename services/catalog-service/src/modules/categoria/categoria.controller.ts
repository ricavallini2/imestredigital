/**
 * Controller de Categorias (autenticação + multi-tenancy).
 *
 * Todas as rotas exigem JWT válido; o tenantId é extraído do token pelo
 * TenantMiddleware e lido de `req.tenantId`.
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
  Request,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger'

import { CategoriaService } from './categoria.service'
import { CriarCategoriaDto } from '../../dtos/categoria/criar-categoria.dto'
import { AtualizarCategoriaDto } from '../../dtos/categoria/atualizar-categoria.dto'
import { ListarCategoriasDto } from '../../dtos/categoria/listar-categorias.dto'

@ApiTags('categorias')
@ApiBearerAuth()
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  /** Cria uma nova categoria no catálogo do tenant. */
  @Post()
  @ApiOperation({ summary: 'Criar nova categoria' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou categoria pai inexistente' })
  async criar(@Request() req: any, @Body() dto: CriarCategoriaDto) {
    return this.categoriaService.criar(req.tenantId, dto)
  }

  /** Lista categorias do tenant com paginação e filtros. */
  @Get()
  @ApiOperation({ summary: 'Listar categorias com paginação' })
  @ApiResponse({ status: 200, description: 'Lista paginada de categorias' })
  async listar(@Request() req: any, @Query() filtros: ListarCategoriasDto) {
    return this.categoriaService.listar(req.tenantId, filtros)
  }

  /** Retorna a árvore hierárquica completa de categorias (raízes com filhas aninhadas). */
  @Get('arvore')
  @ApiOperation({ summary: 'Listar categorias em árvore hierárquica' })
  @ApiResponse({ status: 200, description: 'Árvore de categorias' })
  async listarArvore(@Request() req: any) {
    return this.categoriaService.listarArvore(req.tenantId)
  }

  /** Busca uma categoria pelo ID. */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiParam({ name: 'id', description: 'UUID da categoria' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async buscarPorId(@Request() req: any, @Param('id') id: string) {
    return this.categoriaService.buscarPorId(req.tenantId, id)
  }

  /** Atualiza dados de uma categoria. */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiParam({ name: 'id', description: 'UUID da categoria' })
  @ApiResponse({ status: 200, description: 'Categoria atualizada' })
  async atualizar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AtualizarCategoriaDto,
  ) {
    return this.categoriaService.atualizar(req.tenantId, id, dto)
  }

  /** Remove uma categoria (soft delete via flag `ativa`). */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover categoria (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID da categoria' })
  @ApiResponse({ status: 409, description: 'Categoria possui produtos ou subcategorias' })
  async remover(@Request() req: any, @Param('id') id: string) {
    return this.categoriaService.remover(req.tenantId, id)
  }
}
