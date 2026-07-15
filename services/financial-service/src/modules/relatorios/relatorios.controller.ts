/**
 * Controlador de Relatórios Financeiros (consumidos pelo frontend).
 *
 * Expõe os endpoints que o front espera sob /api/v1/financeiro/*, no shape
 * exato dos mocks (fluxo-caixa, dre, resumo). O tenantId é injetado pelo
 * TenantMiddleware a partir do JWT.
 */

import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { RelatoriosService } from './relatorios.service';

@ApiTags('financeiro')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/financeiro')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  /**
   * Série mensal de fluxo de caixa (receitas/despesas/saldo/saldoAcumulado).
   * GET /api/v1/financeiro/fluxo-caixa?meses=N
   */
  @Get('fluxo-caixa')
  @ApiOperation({ summary: 'Fluxo de caixa mensal (série de N meses)' })
  async fluxoCaixa(
    @Request() req: ExpressRequest,
    @Query('meses') meses?: string,
  ) {
    return this.relatoriosService.fluxoCaixa(
      req.tenantId as string,
      meses ? parseInt(meses, 10) : 6,
    );
  }

  /**
   * DRE gerencial detalhada do período.
   * GET /api/v1/financeiro/dre?mes=&ano=
   */
  @Get('dre')
  @ApiOperation({ summary: 'DRE gerencial do período (mês/ano)' })
  async dre(
    @Request() req: ExpressRequest,
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
  ) {
    const agora = new Date();
    return this.relatoriosService.dre(
      req.tenantId as string,
      mes ? parseInt(mes, 10) : agora.getUTCMonth() + 1,
      ano ? parseInt(ano, 10) : agora.getUTCFullYear(),
    );
  }

  /**
   * Resumo do dashboard financeiro.
   * GET /api/v1/financeiro/resumo
   */
  @Get('resumo')
  @ApiOperation({ summary: 'Resumo do dashboard financeiro' })
  async resumo(@Request() req: ExpressRequest) {
    return this.relatoriosService.resumo(req.tenantId as string);
  }
}
