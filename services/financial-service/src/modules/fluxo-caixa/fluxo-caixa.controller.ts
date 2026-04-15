/**
 * Controlador de Fluxo de Caixa.
 * Endpoints para geração e projeção.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { FluxoCaixaService } from './fluxo-caixa.service';
import { FiltroFluxoCaixaDTO, ProjecaoFluxoCaixaDTO } from '../../dtos/fluxo-caixa/fluxo-caixa.dto';

@ApiTags('fluxo-caixa')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/fluxo-caixa')
export class FluxoCaixaController {
  constructor(private fluxoCaixaService: FluxoCaixaService) {}

  /**
   * Gera relatório de fluxo de caixa.
   */
  @Post('gerar')
  @ApiOperation({ summary: 'Gerar relatório de fluxo de caixa' })
  async gerar(@Request() req: any, @Body() dto: FiltroFluxoCaixaDTO) {
    const dataInicio = new Date(dto.dataInicio);
    const dataFim = new Date(dto.dataFim);

    return this.fluxoCaixaService.gerarFluxoCaixa(req.tenantId, dataInicio, dataFim);
  }

  /**
   * Obtém resumo mensal.
   */
  @Get('mensal')
  @ApiOperation({ summary: 'Obter resumo mensal do fluxo' })
  async obterResumoMensal(
    @Request() req: any,
    @Query('ano') ano: string,
    @Query('mes') mes: string,
  ) {
    const now = new Date();
    const anoNum = parseInt(ano) || now.getFullYear();
    const mesNum = parseInt(mes) || (now.getMonth() + 1);
    return this.fluxoCaixaService.obterResumoMensal(
      req.tenantId,
      anoNum,
      mesNum,
    );
  }

  /**
   * Projeta fluxo de caixa.
   */
  @Post('projetar')
  @ApiOperation({ summary: 'Projetar fluxo de caixa futuro' })
  async projetar(@Request() req: any, @Body() dto: ProjecaoFluxoCaixaDTO) {
    return this.fluxoCaixaService.projetar(req.tenantId, dto.meses);
  }

  /**
   * Obtém saldo por conta.
   */
  @Get('saldos')
  @ApiOperation({ summary: 'Obter saldos por conta' })
  async obterSaldoPorConta(@Request() req: any) {
    return this.fluxoCaixaService.obterSaldoPorConta(req.tenantId);
  }
}
