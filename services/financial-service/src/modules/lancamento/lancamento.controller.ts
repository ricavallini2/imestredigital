/**
 * Controlador de Lançamentos.
 * Endpoints CRUD para contas a pagar/receber.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { LancamentoService } from './lancamento.service';
import { CriarLancamentoDTO } from '../../dtos/lancamento/criar-lancamento.dto';
import { FiltroLancamentoDTO } from '../../dtos/lancamento/filtro-lancamento.dto';
import { PagarLancamentoDTO } from '../../dtos/lancamento/pagar-lancamento.dto';
import { ParcelarLancamentoDTO } from '../../dtos/lancamento/parcelar-lancamento.dto';

@ApiTags('lancamentos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/lancamentos')
export class LancamentoController {
  constructor(private lancamentoService: LancamentoService) {}

  /**
   * Cria um novo lançamento.
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Criar novo lançamento financeiro' })
  async criar(@Request() req: any, @Body() dto: CriarLancamentoDTO) {
    return this.lancamentoService.criar({
      tenantId: req.tenantId,
      ...dto,
    });
  }

  /**
   * Lista lançamentos com filtros.
   */
  @Get()
  @ApiOperation({ summary: 'Listar lançamentos com filtros e paginação' })
  async listar(
    @Request() req: any,
    @Query() filtros: FiltroLancamentoDTO,
  ) {
    const pagina = filtros.pagina || 1;
    const limite = Math.min(filtros.limite || 20, 100);

    return this.lancamentoService.listar(
      req.tenantId,
      filtros,
      pagina,
      limite,
    );
  }

  /**
   * Busca lançamento por ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obter lançamento por ID' })
  async buscarPorId(@Request() req: any, @Param('id') id: string) {
    return this.lancamentoService.buscarPorId(id, req.tenantId);
  }

  /**
   * Lista lançamentos atrasados.
   */
  @Get('status/atrasados')
  @ApiOperation({ summary: 'Listar lançamentos atrasados' })
  async buscarAtrasados(@Request() req: any) {
    return this.lancamentoService.buscarAtrasados(req.tenantId);
  }

  /**
   * Registra pagamento de lançamento.
   */
  @Post(':id/pagar')
  @ApiOperation({ summary: 'Registrar pagamento de lançamento' })
  async pagar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: PagarLancamentoDTO,
  ) {
    const dataPagamento = new Date(dto.dataPagamento);

    return this.lancamentoService.pagar(
      id,
      req.tenantId,
      dataPagamento,
      dto.contaId,
      dto.formaPagamento,
    );
  }

  /**
   * Parcela um lançamento.
   */
  @Post(':id/parcelar')
  @ApiOperation({ summary: 'Parcelar lançamento em múltiplas parcelas' })
  async parcelar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: ParcelarLancamentoDTO,
  ) {
    return this.lancamentoService.parcelar(
      id,
      req.tenantId,
      dto.numeroParcelas,
      new Date(dto.dataInicioVencimento),
      dto.intervalo as any,
    );
  }

  /**
   * Baixa lançamentos em lote.
   */
  @Post('lote/baixar')
  @ApiOperation({ summary: 'Baixar múltiplos lançamentos em lote' })
  async baixarEmLote(
    @Request() req: any,
    @Body() dto: { ids: string[]; dataPagamento: string },
  ) {
    return this.lancamentoService.baixarEmLote(
      req.tenantId,
      dto.ids,
      new Date(dto.dataPagamento),
    );
  }

  /**
   * Cancela lançamento.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar lançamento' })
  async cancelar(@Request() req: any, @Param('id') id: string) {
    return this.lancamentoService.cancelar(id, req.tenantId);
  }

  /**
   * Atualiza lançamento.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar lançamento' })
  async atualizar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: Partial<CriarLancamentoDTO>,
  ) {
    // Implementar atualização
    // Por simplicidade, retorna o existente
    return this.lancamentoService.buscarPorId(id, req.tenantId);
  }
}
