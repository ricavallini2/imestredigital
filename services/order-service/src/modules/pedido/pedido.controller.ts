/**
 * ═══════════════════════════════════════════════════════════════
 * Controller de Pedidos - REST API
 * ═══════════════════════════════════════════════════════════════
 *
 * Endpoints para gerenciar o ciclo de vida completo de pedidos.
 */

import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { PedidoService } from './pedido.service';
import { CriarPedidoDto } from '../../dtos/criar-pedido.dto';
import { FiltroPedidoDto } from '../../dtos/filtro-pedido.dto';
import { CancelarPedidoDto } from '../../dtos/cancelar-pedido.dto';
import { EnviarPedidoDto } from '../../dtos/enviar-pedido.dto';
import { CalcularFreteDto } from '../../dtos/calcular-frete.dto';
import { PeriodoEstatisticasDto } from '../../dtos/estatisticas-pedido.dto';

@ApiTags('pedidos')
@ApiBearerAuth()
@Controller('pedidos')
export class PedidoController {
  constructor(private pedidoService: PedidoService) {}

  /**
   * POST /pedidos
   * Criar novo pedido.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo pedido',
    description: 'Cria um novo pedido no status RASCUNHO e publica PEDIDO_CRIADO',
  })
  async criar(
    @Req() req: any,
    @Body() dto: CriarPedidoDto,
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.criarPedido(tenantId, dto);
  }

  /**
   * GET /pedidos/:id
   * Buscar pedido por ID com todas as informações relacionadas.
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar pedido por ID',
    description: 'Retorna pedido completo com itens, pagamentos, histórico e devoluções',
  })
  async buscarPorId(
    @Req() req: any,
    @Param('id') pedidoId: string,
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.buscarPorId(tenantId, pedidoId);
  }

  /**
   * GET /pedidos
   * Listar pedidos com paginação e filtros.
   */
  @Get()
  @ApiOperation({
    summary: 'Listar pedidos',
    description: 'Lista pedidos com suporte a filtros, paginação e ordenação',
  })
  async listar(
    @Req() req: any,
    @Query() filtros: FiltroPedidoDto,
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.listar(tenantId, filtros);
  }

  /**
   * PATCH /pedidos/:id/confirmar
   * Confirmar pedido (status PENDENTE -> CONFIRMADO).
   */
  @Patch(':id/confirmar')
  @ApiOperation({
    summary: 'Confirmar pedido',
    description: 'Move pedido para CONFIRMADO e dispara reserva de estoque',
  })
  async confirmar(
    @Req() req: any,
    @Param('id') pedidoId: string,
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.confirmarPedido(tenantId, pedidoId);
  }

  /**
   * PATCH /pedidos/:id/separando
   * Iniciar separação (SEPARANDO).
   */
  @Patch(':id/separando')
  @ApiOperation({
    summary: 'Iniciar separação',
    description: 'Move pedido para SEPARANDO quando estoque é reservado',
  })
  async iniciarSeparacao(
    @Req() req: any,
    @Param('id') pedidoId: string,
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.iniciarSeparacao(tenantId, pedidoId);
  }

  /**
   * PATCH /pedidos/:id/separado
   * Finalizar separação (SEPARADO).
   */
  @Patch(':id/separado')
  @ApiOperation({
    summary: 'Finalizar separação',
    description: 'Move pedido para SEPARADO quando itens foram separados',
  })
  async finalizarSeparacao(
    @Req() req: any,
    @Param('id') pedidoId: string,
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.finalizarSeparacao(tenantId, pedidoId);
  }

  /**
   * PATCH /pedidos/:id/faturar
   * Faturar pedido (solicita ao fiscal-service).
   */
  @Patch(':id/faturar')
  @ApiOperation({
    summary: 'Faturar pedido',
    description: 'Publica PEDIDO_FATURAR ao fiscal-service para gerar NF-e',
  })
  async faturar(
    @Req() req: any,
    @Param('id') pedidoId: string,
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.faturarPedido(tenantId, pedidoId);
  }

  /**
   * PATCH /pedidos/:id/enviar
   * Enviar pedido com rastreamento (ENVIADO).
   */
  @Patch(':id/enviar')
  @ApiOperation({
    summary: 'Enviar pedido',
    description: 'Move pedido para ENVIADO e registra rastreamento',
  })
  async enviar(
    @Req() req: any,
    @Param('id') pedidoId: string,
    @Body() dto: EnviarPedidoDto,
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.enviarPedido(
      tenantId,
      pedidoId,
      dto.codigoRastreio,
      dto.transportadora,
      dto.prazoEntrega,
    );
  }

  /**
   * PATCH /pedidos/:id/entregar
   * Marcar pedido como entregue (ENTREGUE).
   */
  @Patch(':id/entregar')
  @ApiOperation({
    summary: 'Marcar como entregue',
    description: 'Move pedido para ENTREGUE',
  })
  async entregar(
    @Req() req: any,
    @Param('id') pedidoId: string,
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.entregarPedido(tenantId, pedidoId);
  }

  /**
   * DELETE /pedidos/:id/cancelar
   * Cancelar pedido (CANCELADO).
   */
  @Delete(':id/cancelar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancelar pedido',
    description: 'Move pedido para CANCELADO, libera estoque e reembolsa pagamento',
  })
  async cancelar(
    @Req() req: any,
    @Param('id') pedidoId: string,
    @Body() dto: CancelarPedidoDto,
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.cancelarPedido(tenantId, pedidoId, dto.motivo);
  }

  /**
   * PATCH /pedidos/:id/rastreio
   * Atualizar rastreamento.
   */
  @Patch(':id/rastreio')
  @ApiOperation({
    summary: 'Atualizar rastreamento',
    description: 'Atualiza código de rastreio e transportadora',
  })
  async atualizarRastreio(
    @Req() req: any,
    @Param('id') pedidoId: string,
    @Body() dto: EnviarPedidoDto,
  ) {
    const tenantId = req.tenantId;
    await this.pedidoService.atualizarRastreio(
      tenantId,
      pedidoId,
      dto.codigoRastreio,
      dto.transportadora,
    );
    return { mensagem: 'Rastreamento atualizado' };
  }

  /**
   * POST /pedidos/frete/calcular
   * Calcular frete (placeholder para integração).
   */
  @Post('frete/calcular')
  @ApiOperation({
    summary: 'Calcular frete',
    description: 'Calcula opções de frete baseado em CEPs e dimensões',
  })
  async calcularFrete(
    @Req() req: any,
    @Body() dto: CalcularFreteDto,
  ) {
    const tenantId = req.tenantId;
    return this.pedidoService.calcularFrete(tenantId, dto);
  }

  /**
   * GET /pedidos/estatisticas/dashboard
   * Obter estatísticas e KPIs para dashboard.
   */
  @Get('estatisticas/dashboard')
  @ApiOperation({
    summary: 'Estatísticas do Dashboard',
    description: 'Retorna KPIs: total vendas, ticket médio, taxa cancelamento, etc',
  })
  async obterEstatisticas(
    @Req() req: any,
    @Query() params: PeriodoEstatisticasDto,
  ) {
    const tenantId = req.tenantId;
    const periodo = params.periodo || 'mes';
    return this.pedidoService.obterEstatisticas(tenantId, periodo);
  }
}
