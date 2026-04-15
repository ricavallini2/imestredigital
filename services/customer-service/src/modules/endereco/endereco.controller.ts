/**
 * Controlador de Endereços de Cliente
 *
 * Endpoints aninhados sob /clientes/:clienteId/enderecos
 */

import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, Logger, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EnderecoService } from './endereco.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CriarEnderecoDto } from '@/dtos/endereco/criar-endereco.dto';
import { RequestComTenant } from '@/middleware/tenant.middleware';

@Controller('api/v1/clientes/:clienteId/enderecos')
@ApiTags('Endereços de Cliente')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class EnderecoController {
  private readonly logger = new Logger(EnderecoController.name);

  constructor(private enderecoService: EnderecoService) {}

  /**
   * POST /clientes/:clienteId/enderecos
   * Cria novo endereço
   */
  @Post()
  @ApiOperation({ summary: 'Criar novo endereço' })
  @ApiResponse({ status: 201, description: 'Endereço criado' })
  async criar(
    @Req() req: RequestComTenant,
    @Param('clienteId') clienteId: string,
    @Body() dto: CriarEnderecoDto,
  ) {
    this.logger.log(`Criando endereço para cliente ${clienteId}`);
    return this.enderecoService.criar(req.tenantId, clienteId, dto);
  }

  /**
   * GET /clientes/:clienteId/enderecos
   * Lista endereços do cliente
   */
  @Get()
  @ApiOperation({ summary: 'Listar endereços do cliente' })
  @ApiResponse({ status: 200, description: 'Lista de endereços' })
  async listar(@Req() req: RequestComTenant, @Param('clienteId') clienteId: string) {
    return this.enderecoService.listarPorCliente(req.tenantId, clienteId);
  }

  /**
   * PUT /clientes/:clienteId/enderecos/:enderecoId
   * Atualiza endereço
   */
  @Put(':enderecoId')
  @ApiOperation({ summary: 'Atualizar endereço' })
  @ApiResponse({ status: 200, description: 'Endereço atualizado' })
  async atualizar(
    @Req() req: RequestComTenant,
    @Param('clienteId') clienteId: string,
    @Param('enderecoId') enderecoId: string,
    @Body() dto: Partial<CriarEnderecoDto>,
  ) {
    return this.enderecoService.atualizar(req.tenantId, clienteId, enderecoId, dto);
  }

  /**
   * DELETE /clientes/:clienteId/enderecos/:enderecoId
   * Remove endereço
   */
  @Delete(':enderecoId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover endereço' })
  @ApiResponse({ status: 204, description: 'Endereço removido' })
  async remover(
    @Req() req: RequestComTenant,
    @Param('clienteId') clienteId: string,
    @Param('enderecoId') enderecoId: string,
  ) {
    await this.enderecoService.remover(req.tenantId, clienteId, enderecoId);
  }

  /**
   * PATCH /clientes/:clienteId/enderecos/:enderecoId/padrao
   * Define como padrão
   */
  @Put(':enderecoId/padrao')
  @ApiOperation({ summary: 'Definir como endereço padrão' })
  @ApiResponse({ status: 200, description: 'Endereço definido como padrão' })
  async definirComoPadrao(
    @Req() req: RequestComTenant,
    @Param('clienteId') clienteId: string,
    @Param('enderecoId') enderecoId: string,
  ) {
    return this.enderecoService.definirComoPadrao(req.tenantId, clienteId, enderecoId);
  }
}
