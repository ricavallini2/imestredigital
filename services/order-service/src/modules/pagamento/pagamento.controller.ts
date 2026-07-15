/**
 * ═══════════════════════════════════════════════════════════════
 * Controller de Pagamentos - REST API
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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { PagamentoService } from './pagamento.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RegistrarPagamentoDto, EstornarPagamentoDto } from '../../dtos/pagamento.dto';

@ApiTags('pagamentos')
@ApiBearerAuth()
@Controller('pagamentos')
export class PagamentoController {
  constructor(private pagamentoService: PagamentoService) {}

  /**
   * POST /pagamentos/pedido/:pedidoId
   * Registrar novo pagamento para um pedido.
   */
  @Post('pedido/:pedidoId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar pagamento',
    description: 'Registra um novo pagamento para o pedido',
  })
  async registrarPagamento(
    @Req() req: any,
    @Param('pedidoId') pedidoId: string,
    @Body() dto: RegistrarPagamentoDto,
  ) {
    const tenantId = req.tenantId;
    return this.pagamentoService.registrarPagamento(tenantId, pedidoId, dto);
  }

  /**
   * GET /pagamentos/pedido/:pedidoId
   * Listar pagamentos de um pedido.
   */
  @Get('pedido/:pedidoId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Listar pagamentos do pedido',
    description: 'Retorna todos os pagamentos registrados para um pedido',
  })
  async buscarPorPedido(
    @Req() req: any,
    @Param('pedidoId') pedidoId: string,
  ) {
    const tenantId = req.tenantId;
    return this.pagamentoService.buscarPorPedido(tenantId, pedidoId);
  }

  /**
   * GET /pagamentos
   * Listar pagamentos do tenant com filtros.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Listar pagamentos',
    description: 'Lista pagamentos com suporte a filtros e paginação',
  })
  async listar(
    @Req() req: any,
    @Query() filtros: any,
  ) {
    const tenantId = req.tenantId;
    return this.pagamentoService.listar(tenantId, filtros);
  }

  /**
   * PATCH /pagamentos/:id/estornar
   * Estornar pagamento.
   */
  @Patch(':id/estornar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Estornar pagamento',
    description: 'Reverte um pagamento já realizado',
  })
  async estornar(
    @Req() req: any,
    @Param('id') pagamentoId: string,
    @Body() dto: EstornarPagamentoDto,
  ) {
    const tenantId = req.tenantId;
    return this.pagamentoService.estornarPagamento(tenantId, pagamentoId, dto.motivo);
  }

  /**
   * POST /pagamentos/webhook/:gateway
   * Receber webhook de gateway de pagamento.
   *
   * Endpoint PÚBLICO (sem JwtAuthGuard e excluído do TenantMiddleware): o
   * gateway não envia JWT. A autenticação aqui é por assinatura do webhook.
   *
   * TODO(Fase 1): validar a assinatura HMAC do gateway e resolver o
   * tenantId a partir do payload/credencial do webhook (não confiar em
   * req.tenantId, que aqui é undefined). Implementar o processamento real
   * em PagamentoService.processarWebhook (hoje é stub).
   */
  @Post('webhook/:gateway')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook de pagamento',
    description: 'Recebe notificações de mudança de status do gateway',
  })
  async receberWebhook(
    @Param('gateway') gateway: string,
    @Body() dados: any,
  ) {
    // tenantId virá da validação da assinatura/payload do gateway (Fase 1).
    const tenantId = dados?.tenantId;
    return this.pagamentoService.processarWebhook(tenantId, {
      ...dados,
      gateway,
    });
  }
}
