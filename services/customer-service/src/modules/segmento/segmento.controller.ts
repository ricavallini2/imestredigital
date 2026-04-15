/**
 * Controlador de Segmentos de Cliente
 */

import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, Logger, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SegmentoService } from './segmento.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CriarSegmentoDto } from '@/dtos/segmento/criar-segmento.dto';
import { RequestComTenant } from '@/middleware/tenant.middleware';

@Controller('api/v1/segmentos')
@ApiTags('Segmentos de Cliente')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class SegmentoController {
  private readonly logger = new Logger(SegmentoController.name);

  constructor(private segmentoService: SegmentoService) {}

  /**
   * POST /segmentos
   */
  @Post()
  @ApiOperation({ summary: 'Criar novo segmento' })
  async criar(@Req() req: RequestComTenant, @Body() dto: CriarSegmentoDto) {
    this.logger.log(`Criando segmento para tenant ${req.tenantId}`);
    return this.segmentoService.criar(req.tenantId, dto);
  }

  /**
   * GET /segmentos
   */
  @Get()
  @ApiOperation({ summary: 'Listar segmentos' })
  async listar(@Req() req: RequestComTenant) {
    return this.segmentoService.listar(req.tenantId);
  }

  /**
   * GET /segmentos/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obter segmento por ID' })
  async buscarPorId(@Req() req: RequestComTenant, @Param('id') segmentoId: string) {
    return this.segmentoService.buscarPorId(req.tenantId, segmentoId);
  }

  /**
   * PUT /segmentos/:id
   */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar segmento' })
  async atualizar(
    @Req() req: RequestComTenant,
    @Param('id') segmentoId: string,
    @Body() dto: Partial<CriarSegmentoDto>,
  ) {
    return this.segmentoService.atualizar(req.tenantId, segmentoId, dto);
  }

  /**
   * DELETE /segmentos/:id
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover segmento' })
  async remover(@Req() req: RequestComTenant, @Param('id') segmentoId: string) {
    await this.segmentoService.remover(req.tenantId, segmentoId);
  }

  /**
   * POST /segmentos/:id/recalcular
   */
  @Post(':id/recalcular')
  @ApiOperation({ summary: 'Recalcular segmento' })
  async recalcular(@Req() req: RequestComTenant, @Param('id') segmentoId: string) {
    await this.segmentoService.recalcularSegmento(req.tenantId, segmentoId);
    return { mensagem: 'Segmento recalculado com sucesso' };
  }
}
