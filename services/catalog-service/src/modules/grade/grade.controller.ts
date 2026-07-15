/**
 * Controller de Grades de Tamanhos (autenticação + multi-tenancy).
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

import { GradeService } from './grade.service'
import { CriarGradeDto } from '../../dtos/grade/criar-grade.dto'
import { AtualizarGradeDto } from '../../dtos/grade/atualizar-grade.dto'
import { ListarGradesDto } from '../../dtos/grade/listar-grades.dto'

@ApiTags('grades')
@ApiBearerAuth()
@Controller('grades')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  /** Cria uma nova grade de tamanhos no catálogo do tenant. */
  @Post()
  @ApiOperation({ summary: 'Criar nova grade de tamanhos' })
  @ApiResponse({ status: 201, description: 'Grade criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Já existe grade com este nome' })
  async criar(@Request() req: any, @Body() dto: CriarGradeDto) {
    return this.gradeService.criar(req.tenantId, dto)
  }

  /** Lista grades do tenant com paginação e filtros. */
  @Get()
  @ApiOperation({ summary: 'Listar grades com paginação' })
  @ApiResponse({ status: 200, description: 'Lista paginada de grades' })
  async listar(@Request() req: any, @Query() filtros: ListarGradesDto) {
    return this.gradeService.listar(req.tenantId, filtros)
  }

  /** Busca uma grade pelo ID. */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar grade por ID' })
  @ApiParam({ name: 'id', description: 'UUID da grade' })
  @ApiResponse({ status: 200, description: 'Grade encontrada' })
  @ApiResponse({ status: 404, description: 'Grade não encontrada' })
  async buscarPorId(@Request() req: any, @Param('id') id: string) {
    return this.gradeService.buscarPorId(req.tenantId, id)
  }

  /** Atualiza dados de uma grade (nome/descricao/ativa e/ou tamanhos). */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar grade' })
  @ApiParam({ name: 'id', description: 'UUID da grade' })
  @ApiResponse({ status: 200, description: 'Grade atualizada' })
  @ApiResponse({ status: 409, description: 'Já existe grade com este nome' })
  async atualizar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AtualizarGradeDto,
  ) {
    return this.gradeService.atualizar(req.tenantId, id, dto)
  }

  /** Remove uma grade (soft delete via flag `ativa`). */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Inativar grade (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID da grade' })
  async remover(@Request() req: any, @Param('id') id: string) {
    return this.gradeService.remover(req.tenantId, id)
  }
}
