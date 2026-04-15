/**
 * Controlador de Contatos de Cliente
 */

import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, Logger, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContatoService } from './contato.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CriarContatoDto } from '@/dtos/contato/criar-contato.dto';
import { RequestComTenant } from '@/middleware/tenant.middleware';

@Controller('api/v1/clientes/:clienteId/contatos')
@ApiTags('Contatos de Cliente')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ContatoController {
  private readonly logger = new Logger(ContatoController.name);

  constructor(private contatoService: ContatoService) {}

  /**
   * POST /clientes/:clienteId/contatos
   */
  @Post()
  @ApiOperation({ summary: 'Criar novo contato' })
  async criar(
    @Req() req: RequestComTenant,
    @Param('clienteId') clienteId: string,
    @Body() dto: CriarContatoDto,
  ) {
    return this.contatoService.criar(req.tenantId, clienteId, dto);
  }

  /**
   * GET /clientes/:clienteId/contatos
   */
  @Get()
  @ApiOperation({ summary: 'Listar contatos do cliente' })
  async listar(@Req() req: RequestComTenant, @Param('clienteId') clienteId: string) {
    return this.contatoService.listarPorCliente(req.tenantId, clienteId);
  }

  /**
   * PUT /clientes/:clienteId/contatos/:contatoId
   */
  @Put(':contatoId')
  @ApiOperation({ summary: 'Atualizar contato' })
  async atualizar(
    @Req() req: RequestComTenant,
    @Param('clienteId') clienteId: string,
    @Param('contatoId') contatoId: string,
    @Body() dto: Partial<CriarContatoDto>,
  ) {
    return this.contatoService.atualizar(req.tenantId, clienteId, contatoId, dto);
  }

  /**
   * DELETE /clientes/:clienteId/contatos/:contatoId
   */
  @Delete(':contatoId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover contato' })
  async remover(
    @Req() req: RequestComTenant,
    @Param('clienteId') clienteId: string,
    @Param('contatoId') contatoId: string,
  ) {
    await this.contatoService.remover(req.tenantId, clienteId, contatoId);
  }

  /**
   * PUT /clientes/:clienteId/contatos/:contatoId/principal
   */
  @Put(':contatoId/principal')
  @ApiOperation({ summary: 'Definir como contato principal' })
  async definirComoPrincipal(
    @Req() req: RequestComTenant,
    @Param('clienteId') clienteId: string,
    @Param('contatoId') contatoId: string,
  ) {
    return this.contatoService.definirComoPrincipal(req.tenantId, clienteId, contatoId);
  }
}
