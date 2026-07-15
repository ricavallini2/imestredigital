/**
 * Controller de Marcas (autenticação + multi-tenancy).
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

import { MarcaService } from './marca.service'
import { CriarMarcaDto } from '../../dtos/marca/criar-marca.dto'
import { AtualizarMarcaDto } from '../../dtos/marca/atualizar-marca.dto'
import { ListarMarcasDto } from '../../dtos/marca/listar-marcas.dto'

@ApiTags('marcas')
@ApiBearerAuth()
@Controller('marcas')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  /** Cria uma nova marca no catálogo do tenant. */
  @Post()
  @ApiOperation({ summary: 'Criar nova marca' })
  @ApiResponse({ status: 201, description: 'Marca criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async criar(@Request() req: any, @Body() dto: CriarMarcaDto) {
    return this.marcaService.criar(req.tenantId, dto)
  }

  /** Lista marcas do tenant com paginação e filtros. */
  @Get()
  @ApiOperation({ summary: 'Listar marcas com paginação' })
  @ApiResponse({ status: 200, description: 'Lista paginada de marcas' })
  async listar(@Request() req: any, @Query() filtros: ListarMarcasDto) {
    return this.marcaService.listar(req.tenantId, filtros)
  }

  /** Busca uma marca pelo ID. */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar marca por ID' })
  @ApiParam({ name: 'id', description: 'UUID da marca' })
  @ApiResponse({ status: 200, description: 'Marca encontrada' })
  @ApiResponse({ status: 404, description: 'Marca não encontrada' })
  async buscarPorId(@Request() req: any, @Param('id') id: string) {
    return this.marcaService.buscarPorId(req.tenantId, id)
  }

  /** Atualiza dados de uma marca. */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar marca' })
  @ApiParam({ name: 'id', description: 'UUID da marca' })
  @ApiResponse({ status: 200, description: 'Marca atualizada' })
  async atualizar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AtualizarMarcaDto,
  ) {
    return this.marcaService.atualizar(req.tenantId, id, dto)
  }

  /** Remove uma marca (soft delete via flag `ativa`). */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover marca (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID da marca' })
  @ApiResponse({ status: 409, description: 'Marca possui produtos vinculados' })
  async remover(@Request() req: any, @Param('id') id: string) {
    return this.marcaService.remover(req.tenantId, id)
  }
}
