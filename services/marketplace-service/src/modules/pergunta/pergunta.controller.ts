/**
 * Controller de Perguntas dos Marketplaces.
 * Gerencia importação, listagem e respostas a perguntas de compradores.
 */

import {
  Controller, Get, Post, Body, Param, Query, Req, Logger, HttpStatus, HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PerguntaService } from './pergunta.service';
import { ResponderPerguntaDto } from '../../dtos/responder-pergunta.dto';

@ApiTags('Perguntas Marketplace')
@ApiBearerAuth()
@Controller('perguntas-marketplace')
export class PerguntaController {
  private readonly logger = new Logger('PerguntaController');

  constructor(private readonly perguntaService: PerguntaService) {}

  /**
   * Lista perguntas pendentes de resposta.
   */
  @Get('pendentes')
  @ApiOperation({ summary: 'Listar perguntas pendentes de resposta' })
  @ApiResponse({ status: 200, description: 'Lista de perguntas pendentes' })
  @ApiQuery({ name: 'contaMarketplaceId', required: false, description: 'Filtrar por conta' })
  async listarPendentes(
    @Req() req: any,
    @Query('contaMarketplaceId') contaMarketplaceId?: string,
  ) {
    const tenantId = req.tenantId;
    return this.perguntaService.listarPendentes(tenantId);
  }

  /**
   * Lista todas as perguntas de um anúncio.
   */
  @Get('anuncio/:anuncioId')
  @ApiOperation({ summary: 'Listar perguntas de um anúncio' })
  @ApiParam({ name: 'anuncioId', description: 'ID do anúncio' })
  async listarPorAnuncio(@Req() req: any, @Param('anuncioId') anuncioId: string) {
    const tenantId = req.tenantId;
    return this.perguntaService.listar(tenantId, { anuncioId });
  }

  /**
   * Busca pergunta por ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar pergunta por ID' })
  @ApiParam({ name: 'id', description: 'ID da pergunta' })
  async buscarPorId(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.tenantId;
    return this.perguntaService.listar(tenantId, { id });
  }

  /**
   * Importa perguntas novas de uma conta de marketplace.
   */
  @Post('importar')
  @ApiOperation({ summary: 'Importar perguntas do marketplace' })
  @HttpCode(HttpStatus.OK)
  async importarPerguntas(
    @Req() req: any,
    @Body() dados: { contaMarketplaceId: string },
  ) {
    const tenantId = req.tenantId;
    this.logger.log(`Importando perguntas para tenant ${tenantId}`);
    return this.perguntaService.importarPerguntas(tenantId, dados.contaMarketplaceId);
  }

  /**
   * Responde uma pergunta no marketplace.
   */
  @Post(':id/responder')
  @ApiOperation({ summary: 'Responder pergunta no marketplace' })
  @ApiParam({ name: 'id', description: 'ID da pergunta' })
  @HttpCode(HttpStatus.OK)
  async responder(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dados: ResponderPerguntaDto,
  ) {
    const tenantId = req.tenantId;
    return this.perguntaService.responder(tenantId, id, dados.resposta);
  }

  /**
   * Solicita sugestão de resposta usando IA.
   * Placeholder para integração futura com AI Engine.
   */
  @Post(':id/sugerir-resposta')
  @ApiOperation({ summary: 'Sugerir resposta com IA (iMestreAI)' })
  @ApiParam({ name: 'id', description: 'ID da pergunta' })
  @HttpCode(HttpStatus.OK)
  async sugerirRespostaIA(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.tenantId;
    return this.perguntaService.sugerirRespostaIA(id);
  }

  /**
   * Retorna estatísticas de perguntas (total, pendentes, tempo médio resposta).
   */
  @Get('estatisticas/resumo')
  @ApiOperation({ summary: 'Estatísticas de perguntas' })
  async estatisticas(@Req() req: any) {
    const tenantId = req.tenantId;
    const pendentes = await this.perguntaService.contarPendentes(tenantId);
    return { pendentes };
  }
}
