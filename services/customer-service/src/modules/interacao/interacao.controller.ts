/**
 * Controlador de Interações com Cliente
 */

import { Controller, Get, Post, Param, Body, UseGuards, Req, Logger, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InteracaoService } from './interacao.service';
import { AuthGuard } from '@/guards/auth.guard';
import { RegistrarInteracaoDto } from '@/dtos/interacao/registrar-interacao.dto';
import { RequestComTenant } from '@/middleware/tenant.middleware';

@Controller('api/v1/clientes/:clienteId')
@ApiTags('Interações de Cliente')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class InteracaoController {
  private readonly logger = new Logger(InteracaoController.name);

  constructor(private interacaoService: InteracaoService) {}

  /**
   * POST /clientes/:clienteId/interacoes
   * Registra nova interação
   */
  @Post('interacoes')
  @ApiOperation({ summary: 'Registrar nova interação' })
  async registrar(
    @Req() req: RequestComTenant,
    @Param('clienteId') clienteId: string,
    @Body() dto: RegistrarInteracaoDto,
  ) {
    this.logger.log(`Registrando interação para cliente ${clienteId}`);
    return this.interacaoService.registrar(req.tenantId, clienteId, req.usuarioId, dto);
  }

  /**
   * GET /clientes/:clienteId/interacoes
   * Lista interações com filtros
   */
  @Get('interacoes')
  @ApiOperation({ summary: 'Listar interações do cliente' })
  async listar(
    @Req() req: RequestComTenant,
    @Param('clienteId') clienteId: string,
    @Query('tipo') tipo?: string[],
    @Query('canal') canal?: string[],
    @Query('pagina') pagina?: number,
    @Query('limite') limite?: number,
  ) {
    return this.interacaoService.listarPorCliente(req.tenantId, clienteId, {
      pagina,
      limite,
    });
  }

  /**
   * GET /clientes/:clienteId/timeline
   * Obtém timeline cronológico
   */
  @Get('timeline')
  @ApiOperation({ summary: 'Obter timeline do cliente' })
  async obterTimeline(
    @Req() req: RequestComTenant,
    @Param('clienteId') clienteId: string,
    @Query('limite') limite: number = 50,
  ) {
    return this.interacaoService.obterTimeline(req.tenantId, clienteId, limite);
  }
}
