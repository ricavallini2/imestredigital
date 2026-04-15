/**
 * Controlador de Importação de Clientes
 */

import { Controller, Post, Get, Param, Body, UseGuards, Req, Logger, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ImportacaoService } from './importacao.service';
import { AuthGuard } from '@/guards/auth.guard';
import { ImportarClientesDto } from '@/dtos/importacao/importar-clientes.dto';
import { RequestComTenant } from '@/middleware/tenant.middleware';

@Controller('api/v1')
@ApiTags('Importação de Clientes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ImportacaoController {
  private readonly logger = new Logger(ImportacaoController.name);

  constructor(private importacaoService: ImportacaoService) {}

  /**
   * POST /clientes/importar
   * Inicia importação de clientes
   */
  @Post('clientes/importar')
  @ApiOperation({ summary: 'Iniciar importação de clientes' })
  @ApiResponse({ status: 201, description: 'Importação iniciada' })
  async iniciarImportacao(@Req() req: RequestComTenant, @Body() dto: ImportarClientesDto) {
    this.logger.log(`Iniciando importação para tenant ${req.tenantId}`);
    return this.importacaoService.iniciarImportacao(req.tenantId, req.usuarioId, dto);
  }

  /**
   * GET /clientes/importacoes
   * Lista importações
   */
  @Get('clientes/importacoes')
  @ApiOperation({ summary: 'Listar importações' })
  async listarImportacoes(
    @Req() req: RequestComTenant,
    @Query('pagina') pagina?: number,
    @Query('limite') limite?: number,
  ) {
    return this.importacaoService.listarImportacoes(req.tenantId, pagina, limite);
  }

  /**
   * GET /clientes/importacoes/:id
   * Obtém status da importação
   */
  @Get('clientes/importacoes/:id')
  @ApiOperation({ summary: 'Obter status da importação' })
  async obterStatus(@Req() req: RequestComTenant, @Param('id') importacaoId: string) {
    return this.importacaoService.obterStatus(req.tenantId, importacaoId);
  }
}
