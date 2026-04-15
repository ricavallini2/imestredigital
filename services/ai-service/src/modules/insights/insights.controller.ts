/**
 * Controller de Insights
 *
 * Rotas:
 * - GET    /insights
 * - GET    /insights/:id
 * - PUT    /insights/:id/visualizar
 * - POST   /insights/gerar
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { InsightsService } from './insights.service';

@ApiTags('Insights')
@ApiBearerAuth()
@Controller('insights')
export class InsightsController {
  constructor(private service: InsightsService) {}

  /**
   * Lista insights do tenant
   */
  @Get()
  @ApiOperation({
    summary: 'Listar insights',
    description: 'Retorna insights gerados, com opções de filtro',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de insights',
  })
  async listar(
    @Request() req,
    @Query('tipo') tipo?: string,
    @Query('prioridade') prioridade?: string,
    @Query('apenasNaoLidos') apenasNaoLidos?: boolean,
    @Query('pagina') pagina: number = 0,
    @Query('limite') limite: number = 20,
  ) {
    return this.service.listarInsights(req.tenantId, {
      tipo,
      prioridade,
      apenasNaoLidos,
      pagina,
      limite,
    });
  }

  /**
   * Obtém um insight específico
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obter insight',
    description: 'Retorna detalhes de um insight específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Insight encontrado',
  })
  async obter(@Param('id') insightId: string) {
    return insightId; // Seria implementado completo
  }

  /**
   * Marca insight como visualizado
   */
  @Put(':id/visualizar')
  @ApiOperation({
    summary: 'Marcar como visualizado',
    description: 'Marca um insight como lido',
  })
  @ApiResponse({
    status: 200,
    description: 'Insight marcado como visualizado',
  })
  async marcarVisualizado(
    @Request() req,
    @Param('id') insightId: string,
  ) {
    return this.service.marcarComoVisualizado(req.tenantId, insightId);
  }

  /**
   * Força a geração de insights
   */
  @Post('gerar')
  @ApiOperation({
    summary: 'Gerar insights',
    description: 'Processa e gera novos insights imediatamente',
  })
  @ApiResponse({
    status: 201,
    description: 'Insights gerados',
  })
  async gerar(@Request() req) {
    return this.service.gerarInsightsDiarios(req.tenantId);
  }
}
