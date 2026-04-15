/**
 * Controlador de Conciliação Bancária.
 * Endpoints para reconciliação.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConciliacaoService } from './conciliacao.service';
import { IniciarConciliacaoDTO } from '../../dtos/conciliacao/conciliacao.dto';

@ApiTags('conciliacao')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/conciliacao')
export class ConciliacaoController {
  constructor(private conciliacaoService: ConciliacaoService) {}

  /**
   * Inicia nova conciliação.
   */
  @Post('iniciar')
  @HttpCode(201)
  @ApiOperation({ summary: 'Iniciar nova conciliação bancária' })
  async iniciar(@Request() req: any, @Body() dto: IniciarConciliacaoDTO) {
    return this.conciliacaoService.iniciarConciliacao({
      tenantId: req.tenantId,
      contaId: dto.contaId,
      dataInicio: new Date(dto.dataInicio),
      dataFim: new Date(dto.dataFim),
      saldoInicial: dto.saldoInicial,
      saldoFinal: dto.saldoFinal,
    });
  }

  /**
   * Busca conciliação por ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obter conciliação por ID' })
  async buscarPorId(@Request() req: any, @Param('id') id: string) {
    return this.conciliacaoService.buscarPorId(id, req.tenantId);
  }

  /**
   * Lista conciliações de uma conta.
   */
  @Get('conta/:contaId')
  @ApiOperation({ summary: 'Listar conciliações de uma conta' })
  async listarPorConta(
    @Request() req: any,
    @Param('contaId') contaId: string,
  ) {
    return this.conciliacaoService.listarPorConta(contaId, req.tenantId);
  }

  /**
   * Concilia lançamentos.
   */
  @Post(':id/conciliar')
  @ApiOperation({ summary: 'Conciliar lançamentos com saldo bancário' })
  async conciliar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: { idsLancamentos: string[] },
  ) {
    return this.conciliacaoService.conciliar(id, req.tenantId, dto.idsLancamentos);
  }

  /**
   * Finaliza conciliação.
   */
  @Post(':id/finalizar')
  @ApiOperation({ summary: 'Finalizar conciliação' })
  async finalizar(@Request() req: any, @Param('id') id: string) {
    return this.conciliacaoService.finalizar(id, req.tenantId);
  }

  /**
   * Importa extrato bancário.
   */
  @Post(':id/importar-extrato')
  @UseInterceptors(FileInterceptor('arquivo'))
  @ApiOperation({ summary: 'Importar extrato bancário (OFX/CSV)' })
  async importarExtrato(
    @Request() req: any,
    @Param('id') id: string,
    @UploadedFile() arquivo: any,
  ) {
    return this.conciliacaoService.importarExtrato(id, req.tenantId, arquivo);
  }

  /**
   * Busca conciliação mais recente.
   */
  @Get('conta/:contaId/mais-recente')
  @ApiOperation({ summary: 'Obter conciliação mais recente de uma conta' })
  async buscarMaisRecente(
    @Request() req: any,
    @Param('contaId') contaId: string,
  ) {
    return this.conciliacaoService.buscarMaisRecente(contaId, req.tenantId);
  }
}
