/**
 * Controlador de Categorias Financeiras.
 * Endpoints CRUD para categorias hierárquicas.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriaService } from './categoria.service';
import { CriarCategoriaDTO } from '../../dtos/categoria/criar-categoria.dto';

@ApiTags('categorias')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/categorias')
export class CategoriaController {
  constructor(private categoriaService: CategoriaService) {}

  /**
   * Cria uma nova categoria.
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Criar nova categoria financeira' })
  async criar(@Request() req: any, @Body() dto: CriarCategoriaDTO) {
    return this.categoriaService.criar({
      tenantId: req.tenantId,
      ...dto,
    });
  }

  /**
   * Lista categorias por tipo.
   */
  @Get()
  @ApiOperation({ summary: 'Listar categorias por tipo' })
  async listar(@Request() req: any, @Query('tipo') tipo: string) {
    if (!tipo) {
      throw new Error('Tipo é obrigatório');
    }
    return this.categoriaService.listarPorTipo(req.tenantId, tipo);
  }

  /**
   * Obtém árvore hierárquica de categorias.
   */
  @Get('arvore')
  @ApiOperation({ summary: 'Obter árvore hierárquica de categorias' })
  async obterArvore(@Request() req: any, @Query('tipo') tipo: string) {
    if (!tipo) {
      throw new Error('Tipo é obrigatório');
    }
    return this.categoriaService.obterArvore(req.tenantId, tipo);
  }

  /**
   * Busca categoria por ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obter categoria por ID' })
  async buscarPorId(@Request() req: any, @Param('id') id: string) {
    return this.categoriaService.buscarPorId(id, req.tenantId);
  }

  /**
   * Busca categorias filhas.
   */
  @Get(':id/filhas')
  @ApiOperation({ summary: 'Obter categorias filhas' })
  async buscarFilhas(@Param('id') paiId: string) {
    return this.categoriaService.buscarFilhas(paiId);
  }

  /**
   * Atualiza categoria.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar categoria' })
  async atualizar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: Partial<CriarCategoriaDTO>,
  ) {
    return this.categoriaService.atualizar(id, req.tenantId, {
      tenantId: req.tenantId,
      ...dto,
    });
  }

  /**
   * Desativa categoria.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Desativar categoria' })
  async desativar(@Request() req: any, @Param('id') id: string) {
    return this.categoriaService.desativar(id, req.tenantId);
  }
}
