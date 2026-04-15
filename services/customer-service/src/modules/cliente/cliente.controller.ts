/**
 * Controlador de Clientes
 *
 * Expõe endpoints REST para operações CRUD de clientes.
 */

import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req, Logger, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CriarClienteDto, AtualizarClienteDto, FiltroClienteDto } from '@/dtos/cliente';
import { RequestComTenant } from '@/middleware/tenant.middleware';

@Controller('api/v1/clientes')
@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ClienteController {
  private readonly logger = new Logger(ClienteController.name);

  constructor(private clienteService: ClienteService) {}

  /**
   * POST /clientes
   * Cria um novo cliente
   */
  @Post()
  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Cliente já existe' })
  async criar(@Req() req: RequestComTenant, @Body() dto: CriarClienteDto) {
    this.logger.log(`Criando novo cliente para tenant ${req.tenantId}`);
    return this.clienteService.criar(req.tenantId, dto);
  }

  /**
   * GET /clientes
   * Lista clientes com filtros e paginação
   */
  @Get()
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes retornada' })
  async listar(@Req() req: RequestComTenant, @Query() filtro: FiltroClienteDto) {
    this.logger.debug(`Listando clientes para tenant ${req.tenantId}`);
    return this.clienteService.listar(req.tenantId, filtro);
  }

  /**
   * GET /clientes/estatisticas
   * Obtém estatísticas gerais de clientes
   */
  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas de clientes' })
  async obterEstatisticas(@Req() req: RequestComTenant) {
    this.logger.debug(`Obtendo estatísticas para tenant ${req.tenantId}`);
    return this.clienteService.obterEstatisticas(req.tenantId);
  }

  /**
   * GET /clientes/buscar-documento/:documento
   * Busca cliente por CPF ou CNPJ
   */
  @Get('buscar-documento/:documento')
  @ApiOperation({ summary: 'Buscar cliente por documento' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async buscarPorDocumento(@Req() req: RequestComTenant, @Param('documento') documento: string) {
    this.logger.debug(`Buscando cliente por documento ${documento}`);
    const cliente = await this.clienteService.buscarPorDocumento(req.tenantId, documento);

    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    return cliente;
  }

  /**
   * GET /clientes/:id
   * Busca cliente por ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obter cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async buscarPorId(@Req() req: RequestComTenant, @Param('id') clienteId: string) {
    this.logger.debug(`Buscando cliente ${clienteId} para tenant ${req.tenantId}`);
    const cliente = await this.clienteService.buscarPorId(req.tenantId, clienteId);

    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    return cliente;
  }

  /**
   * GET /clientes/:id/resumo
   * Obtém resumo do cliente com estatísticas
   */
  @Get(':id/resumo')
  @ApiOperation({ summary: 'Obter resumo do cliente' })
  @ApiResponse({ status: 200, description: 'Resumo do cliente' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async obterResumo(@Req() req: RequestComTenant, @Param('id') clienteId: string) {
    this.logger.debug(`Obtendo resumo do cliente ${clienteId}`);
    return this.clienteService.obterResumo(req.tenantId, clienteId);
  }

  /**
   * PUT /clientes/:id
   * Atualiza cliente
   */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async atualizar(@Req() req: RequestComTenant, @Param('id') clienteId: string, @Body() dto: AtualizarClienteDto) {
    this.logger.log(`Atualizando cliente ${clienteId}`);
    return this.clienteService.atualizar(req.tenantId, clienteId, dto);
  }

  /**
   * DELETE /clientes/:id
   * Inativa cliente (soft delete)
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Inativar cliente' })
  @ApiResponse({ status: 204, description: 'Cliente inativado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async inativar(@Req() req: RequestComTenant, @Param('id') clienteId: string) {
    this.logger.log(`Inativando cliente ${clienteId}`);
    await this.clienteService.inativar(req.tenantId, clienteId);
  }
}
