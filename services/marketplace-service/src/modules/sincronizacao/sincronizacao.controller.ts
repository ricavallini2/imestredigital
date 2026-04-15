/**
 * Controller de Sincronização com Marketplaces.
 * Gerencia sincronização bidirecional ERP ↔ Marketplace.
 */

import {
  Controller, Get, Post, Body, Query, Req, Logger, HttpStatus, HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SincronizacaoService } from './sincronizacao.service';
import { SincronizarDto } from '../../dtos/sincronizar.dto';
import { TipoSincronizacao } from '@prisma/client';

@ApiTags('Sincronização')
@ApiBearerAuth()
@Controller('sincronizacao')
export class SincronizacaoController {
  private readonly logger = new Logger('SincronizacaoController');

  constructor(private readonly sincronizacaoService: SincronizacaoService) {}

  /**
   * Executa sincronização completa de uma conta de marketplace.
   * Sincroniza: produtos, pedidos, estoque, preços e perguntas.
   */
  @Post('completa')
  @ApiOperation({ summary: 'Sincronização completa com marketplace' })
  @ApiResponse({ status: 200, description: 'Sincronização iniciada' })
  @HttpCode(HttpStatus.OK)
  async sincronizacaoCompleta(
    @Req() req: any,
    @Body() dados: { contaMarketplaceId: string },
  ) {
    const tenantId = req.tenantId;
    this.logger.log(`Sincronização completa para tenant ${tenantId}`);
    return this.sincronizacaoService.sincronizarTudo(tenantId, dados.contaMarketplaceId);
  }

  /**
   * Sincroniza item específico conforme tipo selecionado.
   */
  @Post()
  @ApiOperation({ summary: 'Sincronizar por tipo (produtos, pedidos, estoque, preços, perguntas)' })
  @ApiResponse({ status: 200, description: 'Sincronização executada' })
  @HttpCode(HttpStatus.OK)
  async sincronizar(@Req() req: any, @Body() dados: SincronizarDto) {
    const tenantId = req.tenantId;
    this.logger.log(`Sincronizando ${dados.tipo} para tenant ${tenantId}`);

    switch (dados.tipo) {
      case TipoSincronizacao.PRODUTO:
        return this.sincronizacaoService.sincronizarProdutos(tenantId, dados.contaMarketplaceId);
      case TipoSincronizacao.PEDIDO:
        return this.sincronizacaoService.sincronizarPedidos(tenantId, dados.contaMarketplaceId);
      case TipoSincronizacao.ESTOQUE:
      case TipoSincronizacao.PRECO:
      case TipoSincronizacao.PERGUNTA:
        return this.sincronizacaoService.sincronizarPerguntas(tenantId, dados.contaMarketplaceId);
      default:
        return this.sincronizacaoService.sincronizarTudo(tenantId, dados.contaMarketplaceId);
    }
  }

  /**
   * Retorna histórico de sincronizações.
   */
  @Get('historico')
  @ApiOperation({ summary: 'Histórico de sincronizações' })
  @ApiResponse({ status: 200, description: 'Histórico retornado' })
  @ApiQuery({ name: 'contaMarketplaceId', required: false })
  @ApiQuery({ name: 'pagina', required: false, type: Number })
  @ApiQuery({ name: 'limite', required: false, type: Number })
  async obterHistorico(
    @Req() req: any,
    @Query('contaMarketplaceId') contaMarketplaceId?: string,
    @Query('pagina') pagina?: number,
    @Query('limite') limite?: number,
  ) {
    const tenantId = req.tenantId;
    return this.sincronizacaoService.obterHistorico(tenantId, contaMarketplaceId);
  }

  /**
   * Retorna status atual das sincronizações de todas as contas.
   */
  @Get('status')
  @ApiOperation({ summary: 'Status das sincronizações' })
  @ApiResponse({ status: 200, description: 'Status de todas as contas' })
  async obterStatus(@Req() req: any) {
    const tenantId = req.tenantId;
    return this.sincronizacaoService.obterHistorico(tenantId);
  }
}
