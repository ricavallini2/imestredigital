/**
 * Nota Fiscal Controller
 * Expõe endpoints REST para gerenciamento de notas fiscais.
 */

import {
  Controller,
  Post,
  Get,
  Put,
  Req,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotaFiscalService } from './nota-fiscal.service';
import { CriarNotaFiscalDto } from '../../dtos/criar-nota-fiscal.dto';
import { FiltroNotaFiscalDto } from '../../dtos/filtro-nota-fiscal.dto';
import { CancelarNotaDto } from '../../dtos/cancelar-nota.dto';
import { CartaCorrecaoDto } from '../../dtos/carta-correcao.dto';
import { InutilizarNumeracaoDto } from '../../dtos/inutilizar-numeracao.dto';
import { CalcularImpostosDto } from '../../dtos/calcular-impostos.dto';

@ApiTags('notas-fiscais')
@ApiBearerAuth()
@Controller('v1/notas-fiscais')
export class NotaFiscalController {
  constructor(private readonly notaFiscalService: NotaFiscalService) {}

  /**
   * Cria uma nova nota fiscal em rascunho.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nota fiscal em rascunho' })
  @ApiResponse({
    status: 201,
    description: 'Nota fiscal criada com sucesso',
  })
  async criar(@Req() req: any, @Body() dto: CriarNotaFiscalDto) {
    return this.notaFiscalService.criarRascunho(req.tenantId, dto);
  }

  /**
   * Lista notas fiscais com filtros e paginação.
   */
  @Get()
  @ApiOperation({ summary: 'Listar notas fiscais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notas fiscais',
  })
  async listar(@Req() req: any, @Query() filtros: FiltroNotaFiscalDto) {
    return this.notaFiscalService.listar(req.tenantId, filtros);
  }

  /**
   * Busca uma nota fiscal por ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar nota fiscal por ID' })
  @ApiResponse({
    status: 200,
    description: 'Nota fiscal encontrada',
  })
  async buscarPorId(@Req() req: any, @Param('id') notaId: string) {
    return this.notaFiscalService.buscarPorId(req.tenantId, notaId);
  }

  /**
   * Valida uma nota fiscal.
   */
  @Put(':id/validar')
  @ApiOperation({ summary: 'Validar nota fiscal' })
  @ApiResponse({
    status: 200,
    description: 'Nota fiscal validada',
  })
  async validar(@Req() req: any, @Param('id') notaId: string) {
    return this.notaFiscalService.validarNota(req.tenantId, notaId);
  }

  /**
   * Emite uma nota fiscal (envia para SEFAZ).
   */
  @Post(':id/emitir')
  @ApiOperation({ summary: 'Emitir nota fiscal' })
  @ApiResponse({
    status: 200,
    description: 'Nota fiscal emitida',
  })
  async emitir(@Req() req: any, @Param('id') notaId: string) {
    return this.notaFiscalService.emitirNota(req.tenantId, notaId);
  }

  /**
   * Consulta o status de uma nota junto à SEFAZ.
   */
  @Get(':id/consultar')
  @ApiOperation({ summary: 'Consultar status na SEFAZ' })
  @ApiResponse({
    status: 200,
    description: 'Status consultado',
  })
  async consultar(@Req() req: any, @Param('id') notaId: string) {
    return this.notaFiscalService.consultarNota(req.tenantId, notaId);
  }

  /**
   * Cancela uma nota fiscal.
   */
  @Post(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar nota fiscal' })
  @ApiResponse({
    status: 200,
    description: 'Nota fiscal cancelada',
  })
  async cancelar(
    @Req() req: any,
    @Param('id') notaId: string,
    @Body() dto: CancelarNotaDto,
  ) {
    return this.notaFiscalService.cancelarNota(req.tenantId, notaId, dto);
  }

  /**
   * Emite carta de correção para uma nota.
   */
  @Post(':id/carta-correcao')
  @ApiOperation({ summary: 'Emitir carta de correção' })
  @ApiResponse({
    status: 200,
    description: 'Carta de correção emitida',
  })
  async cartaCorrecao(
    @Req() req: any,
    @Param('id') notaId: string,
    @Body() dto: CartaCorrecaoDto,
  ) {
    return this.notaFiscalService.cartaCorrecao(req.tenantId, notaId, dto);
  }

  /**
   * Inutiliza uma faixa de numeração.
   */
  @Post('inutilizar')
  @ApiOperation({ summary: 'Inutilizar numeração de notas' })
  @ApiResponse({
    status: 200,
    description: 'Numeração inutilizada',
  })
  async inutilizar(@Req() req: any, @Body() dto: InutilizarNumeracaoDto) {
    return this.notaFiscalService.inutilizarNumeracao(req.tenantId, dto);
  }

  /**
   * Calcula impostos para uma lista de itens.
   */
  @Post('calcular-impostos')
  @ApiOperation({ summary: 'Calcular impostos' })
  @ApiResponse({
    status: 200,
    description: 'Impostos calculados',
  })
  async calcularImpostos(@Req() req: any, @Body() dto: CalcularImpostosDto) {
    // TODO: Implementar lógica de cálculo real
    return {
      mensagem: 'Cálculo de impostos em desenvolvimento',
    };
  }

  /**
   * Gera DANFE (Documento Auxiliar da NF-e).
   */
  @Get(':id/danfe')
  @ApiOperation({ summary: 'Gerar DANFE em PDF' })
  @ApiResponse({
    status: 200,
    description: 'DANFE gerado',
  })
  async gerarDanfe(@Req() req: any, @Param('id') notaId: string) {
    return this.notaFiscalService.gerarDanfe(req.tenantId, notaId);
  }
}
