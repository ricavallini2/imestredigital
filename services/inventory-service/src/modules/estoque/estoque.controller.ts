/**
 * Controller de Estoque.
 *
 * Endpoints para consultar saldos, dar entrada/saída
 * e gerenciar reservas de estoque.
 */

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { EstoqueService } from './estoque.service';
import { EntradaEstoqueDto } from '../../dtos/estoque/entrada-estoque.dto';
import { SaidaEstoqueDto } from '../../dtos/estoque/saida-estoque.dto';
import { TransferenciaEstoqueDto } from '../../dtos/estoque/transferencia-estoque.dto';
import { AjusteEstoqueDto } from '../../dtos/estoque/ajuste-estoque.dto';

@ApiTags('estoque')
@ApiBearerAuth()
@Controller('estoque')
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  /** Consulta saldo de estoque de um produto em todos os depósitos */
  @Get('produto/:produtoId')
  @ApiOperation({ summary: 'Consultar saldo de estoque por produto' })
  @ApiParam({ name: 'produtoId', description: 'UUID do produto' })
  async consultarSaldo(@Request() req: any, @Param('produtoId') produtoId: string) {
    return this.estoqueService.consultarSaldo(req.tenantId, produtoId);
  }

  /** Consulta saldo consolidado de todos os produtos */
  @Get('resumo')
  @ApiOperation({ summary: 'Resumo de estoque (todos os produtos)' })
  async resumo(@Request() req: any, @Query('depositoId') depositoId?: string) {
    return this.estoqueService.resumo(req.tenantId, depositoId);
  }

  /** Lista produtos com estoque baixo (abaixo do mínimo) */
  @Get('alertas')
  @ApiOperation({ summary: 'Produtos com estoque baixo' })
  async alertas(@Request() req: any) {
    return this.estoqueService.listarAlertas(req.tenantId);
  }

  /** Registra entrada de estoque (compra, devolução, etc.) */
  @Post('entrada')
  @ApiOperation({ summary: 'Registrar entrada de estoque' })
  async entrada(@Request() req: any, @Body() dto: EntradaEstoqueDto) {
    return this.estoqueService.entrada(req.tenantId, dto);
  }

  /** Registra saída de estoque (venda, perda, etc.) */
  @Post('saida')
  @ApiOperation({ summary: 'Registrar saída de estoque' })
  async saida(@Request() req: any, @Body() dto: SaidaEstoqueDto) {
    return this.estoqueService.saida(req.tenantId, dto);
  }

  /** Transfere estoque entre depósitos */
  @Post('transferencia')
  @ApiOperation({ summary: 'Transferir estoque entre depósitos' })
  async transferencia(@Request() req: any, @Body() dto: TransferenciaEstoqueDto) {
    return this.estoqueService.transferencia(req.tenantId, dto);
  }

  /** Ajuste manual de estoque (inventário) */
  @Post('ajuste')
  @ApiOperation({ summary: 'Ajuste manual de estoque (inventário)' })
  async ajuste(@Request() req: any, @Body() dto: AjusteEstoqueDto) {
    return this.estoqueService.ajuste(req.tenantId, dto);
  }
}
