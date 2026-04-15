/**
 * Controller de Anúncios nos Marketplaces.
 * Gerencia criação, atualização e sincronização de anúncios.
 */

import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, Req, Logger, HttpStatus, HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AnuncioService } from './anuncio.service';
import { CriarAnuncioDto } from '../../dtos/criar-anuncio.dto';
import { FiltroAnuncioDto } from '../../dtos/filtro-anuncio.dto';

@ApiTags('Anúncios Marketplace')
@ApiBearerAuth()
@Controller('anuncios')
export class AnuncioController {
  private readonly logger = new Logger('AnuncioController');

  constructor(private readonly anuncioService: AnuncioService) {}

  /**
   * Cria um novo anúncio no marketplace.
   */
  @Post()
  @ApiOperation({ summary: 'Criar anúncio no marketplace' })
  @ApiResponse({ status: 201, description: 'Anúncio criado com sucesso' })
  async criar(@Req() req: any, @Body() dados: CriarAnuncioDto) {
    const tenantId = req.tenantId;
    const contaMarketplaceId = dados.contaMarketplaceId;
    this.logger.log(`Criando anúncio para tenant ${tenantId}`);
    return this.anuncioService.criarAnuncio(tenantId, contaMarketplaceId, dados);
  }

  /**
   * Lista anúncios com filtros.
   */
  @Get()
  @ApiOperation({ summary: 'Listar anúncios nos marketplaces' })
  @ApiResponse({ status: 200, description: 'Lista de anúncios retornada' })
  async listar(@Req() req: any, @Query() filtros: FiltroAnuncioDto) {
    const tenantId = req.tenantId;
    return this.anuncioService.listar(tenantId, filtros);
  }

  /**
   * Busca anúncio por ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar anúncio por ID' })
  @ApiParam({ name: 'id', description: 'ID do anúncio' })
  @ApiResponse({ status: 200, description: 'Anúncio encontrado' })
  async buscarPorId(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.tenantId;
    return this.anuncioService.buscarPorId(tenantId, id);
  }

  /**
   * Atualiza dados de um anúncio.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar anúncio' })
  @ApiParam({ name: 'id', description: 'ID do anúncio' })
  @ApiResponse({ status: 200, description: 'Anúncio atualizado' })
  async atualizar(@Req() req: any, @Param('id') id: string, @Body() dados: any) {
    const tenantId = req.tenantId;
    return this.anuncioService.atualizarAnuncio(tenantId, id, dados);
  }

  /**
   * Pausa um anúncio no marketplace.
   */
  @Put(':id/pausar')
  @ApiOperation({ summary: 'Pausar anúncio' })
  @HttpCode(HttpStatus.OK)
  async pausar(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.tenantId;
    return this.anuncioService.pausarAnuncio(tenantId, id);
  }

  /**
   * Reativa um anúncio pausado.
   */
  @Put(':id/reativar')
  @ApiOperation({ summary: 'Reativar anúncio pausado' })
  @HttpCode(HttpStatus.OK)
  async reativar(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.tenantId;
    return this.anuncioService.reativarAnuncio(tenantId, id);
  }

  /**
   * Encerra um anúncio permanentemente.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Encerrar anúncio' })
  @HttpCode(HttpStatus.OK)
  async encerrar(@Req() req: any, @Param('id') id: string) {
    const tenantId = req.tenantId;
    return this.anuncioService.encerrarAnuncio(tenantId, id);
  }

  /**
   * Sincroniza estoque de um anúncio com o marketplace.
   */
  @Post(':id/sincronizar-estoque')
  @ApiOperation({ summary: 'Sincronizar estoque com marketplace' })
  @HttpCode(HttpStatus.OK)
  async sincronizarEstoque(@Req() req: any, @Param('id') id: string, @Body() dados: any) {
    const tenantId = req.tenantId;
    return this.anuncioService.sincronizarEstoque(tenantId, id, dados.quantidade);
  }

  /**
   * Sincroniza preço de um anúncio com o marketplace.
   */
  @Post(':id/sincronizar-preco')
  @ApiOperation({ summary: 'Sincronizar preço com marketplace' })
  @HttpCode(HttpStatus.OK)
  async sincronizarPreco(@Req() req: any, @Param('id') id: string, @Body() dados: any) {
    const tenantId = req.tenantId;
    return this.anuncioService.sincronizarPreco(tenantId, id, dados.preco, dados.precoPromocional);
  }

  /**
   * Sincroniza todos os anúncios de uma conta em lote.
   * TODO: Implementar este método no serviço
   */
  // @Post('sincronizar-lote')
  // @ApiOperation({ summary: 'Sincronizar anúncios em lote' })
  // @HttpCode(HttpStatus.OK)
  // async sincronizarEmLote(
  //   @Req() req: any,
  //   @Body() dados: { contaMarketplaceId: string },
  // ) {
  //   const tenantId = req.tenantId;
  //   return this.anuncioService.sincronizarEmLote(tenantId, dados.contaMarketplaceId);
  // }
}
