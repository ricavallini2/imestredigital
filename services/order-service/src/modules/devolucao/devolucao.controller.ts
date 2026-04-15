/**
 * ═══════════════════════════════════════════════════════════════
 * Controller de Devoluções - REST API
 * ═══════════════════════════════════════════════════════════════
 */

import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { DevolucaoService } from './devolucao.service';
import {
  SolicitarDevolucaoDto,
  AprovarDevolucaoDto,
  ReceberDevolucaoDto,
  ReembolsarDevolucaoDto,
} from '../../dtos/devolucao.dto';

@ApiTags('devolucoes')
@ApiBearerAuth()
@Controller('devolucoes')
export class DevolucaoController {
  constructor(private devolucaoService: DevolucaoService) {}

  /**
   * POST /devolucoes/pedido/:pedidoId
   * Solicitar nova devolução.
   */
  @Post('pedido/:pedidoId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Solicitar devolução',
    description: 'Cliente solicita devolução de itens do pedido',
  })
  async solicitar(
    @Req() req: any,
    @Param('pedidoId') pedidoId: string,
    @Body() dto: SolicitarDevolucaoDto,
  ) {
    const tenantId = req.tenantId;
    return this.devolucaoService.solicitarDevolucao(tenantId, pedidoId, dto);
  }

  /**
   * GET /devolucoes/pedido/:pedidoId
   * Listar devoluções de um pedido.
   */
  @Get('pedido/:pedidoId')
  @ApiOperation({
    summary: 'Listar devoluções do pedido',
    description: 'Retorna todas as devoluções solicitadas para um pedido',
  })
  async listarPorPedido(
    @Req() req: any,
    @Param('pedidoId') pedidoId: string,
  ) {
    const tenantId = req.tenantId;
    return this.devolucaoService.listarPorPedido(tenantId, pedidoId);
  }

  /**
   * GET /devolucoes
   * Listar devoluções do tenant com filtros.
   */
  @Get()
  @ApiOperation({
    summary: 'Listar devoluções',
    description: 'Lista devoluções com suporte a filtros e paginação',
  })
  async listar(
    @Req() req: any,
    @Query() filtros: any,
  ) {
    const tenantId = req.tenantId;
    return this.devolucaoService.listar(tenantId, filtros);
  }

  /**
   * PATCH /devolucoes/:id/aprovar
   * Aprovar devolução (gera código de retorno).
   */
  @Patch(':id/aprovar')
  @ApiOperation({
    summary: 'Aprovar devolução',
    description: 'Aprova a devolução e gera código de rastreio para retorno',
  })
  async aprovar(
    @Req() req: any,
    @Param('id') devolucaoId: string,
    @Body() dto: AprovarDevolucaoDto,
  ) {
    const tenantId = req.tenantId;
    return this.devolucaoService.aprovarDevolucao(tenantId, devolucaoId, dto.observacao);
  }

  /**
   * PATCH /devolucoes/:id/receber
   * Receber devolução (item retornou ao warehouse).
   */
  @Patch(':id/receber')
  @ApiOperation({
    summary: 'Receber devolução',
    description: 'Marca devolução como recebida e reintegra estoque',
  })
  async receber(
    @Req() req: any,
    @Param('id') devolucaoId: string,
    @Body() dto: ReceberDevolucaoDto,
  ) {
    const tenantId = req.tenantId;
    return this.devolucaoService.receberDevolucao(tenantId, devolucaoId, dto.observacao);
  }

  /**
   * PATCH /devolucoes/:id/reembolsar
   * Processar reembolso.
   */
  @Patch(':id/reembolsar')
  @ApiOperation({
    summary: 'Reembolsar devolução',
    description: 'Processa reembolso do pagamento',
  })
  async reembolsar(
    @Req() req: any,
    @Param('id') devolucaoId: string,
    @Body() dto: ReembolsarDevolucaoDto,
  ) {
    const tenantId = req.tenantId;
    return this.devolucaoService.reembolsar(tenantId, devolucaoId, dto.valor ? dto.valor.toString() as any : undefined);
  }
}
