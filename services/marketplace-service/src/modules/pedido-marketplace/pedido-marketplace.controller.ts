/**
 * Controller de Pedidos dos Marketplaces.
 * Gerencia importação, sincronização e rastreio de pedidos.
 */

import {
  Controller, Get, Post, Put, Body, Param, Query, Req, Logger, HttpStatus, HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PedidoMarketplaceService } from './pedido-marketplace.service';
import { FiltroPedidoMarketplaceDto } from '../../dtos/filtro-pedido-marketplace.dto';

@ApiTags('Pedidos Marketplace')
@ApiBearerAuth()
@Controller('pedidos-marketplace')
export class PedidoMarketplaceController {
  private readonly logger = new Logger('PedidoMarketplaceController');

  constructor(private readonly pedidoService: PedidoMarketplaceService) {}

  /**
   * Lista pedidos de marketplaces com filtros.
   */
  @Get()
  @ApiOperation({ summary: 'Listar pedidos dos marketplaces' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos retornada' })
  async listar(@Req() req: any, @Query() filtros: FiltroPedidoMarketplaceDto) {
    const tenantId = req.tenantId;
    return this.pedidoService.listar(tenantId, filtros);
  }

  /**
   * Busca pedido de marketplace por ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar pedido marketplace por ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido marketplace' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado' })
  async buscarPorId(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.tenantId;
    return this.pedidoService.buscarPorId(tenantId, id);
  }

  /**
   * Importa pedidos novos de uma conta de marketplace.
   */
  @Post('importar')
  @ApiOperation({ summary: 'Importar pedidos novos de um marketplace' })
  @ApiResponse({ status: 200, description: 'Pedidos importados com sucesso' })
  @HttpCode(HttpStatus.OK)
  async importarPedidos(
    @Req() req: any,
    @Body() dados: { contaMarketplaceId: string },
  ) {
    const tenantId = req.tenantId;
    this.logger.log(`Importando pedidos do marketplace para tenant ${tenantId}`);
    return this.pedidoService.importarPedidos(tenantId, dados.contaMarketplaceId);
  }

  /**
   * Sincroniza status de pedidos entre ERP e marketplace.
   */
  @Post('sincronizar-status')
  @ApiOperation({ summary: 'Sincronizar status dos pedidos com marketplace' })
  @HttpCode(HttpStatus.OK)
  async sincronizarStatus(
    @Req() req: any,
    @Body() dados: { contaMarketplaceId: string },
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.sincronizarStatus(tenantId, dados.contaMarketplaceId);
  }

  /**
   * Envia código de rastreio para o marketplace.
   */
  @Post(':id/rastreio')
  @ApiOperation({ summary: 'Enviar rastreio ao marketplace' })
  @ApiParam({ name: 'id', description: 'ID do pedido marketplace' })
  @HttpCode(HttpStatus.OK)
  async enviarRastreio(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dados: { codigoRastreio: string; transportadora?: string },
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.enviarRastreio(tenantId, id, dados.codigoRastreio);
  }

  /**
   * Converte um pedido marketplace em pedido interno do ERP.
   */
  @Post(':id/converter')
  @ApiOperation({ summary: 'Converter pedido marketplace em pedido interno' })
  @ApiParam({ name: 'id', description: 'ID do pedido marketplace' })
  @HttpCode(HttpStatus.CREATED)
  async converterParaPedidoInterno(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.tenantId;
    return this.pedidoService.buscarPorId(tenantId, id);
  }
}
