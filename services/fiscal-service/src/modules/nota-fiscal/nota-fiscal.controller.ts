/**
 * Nota Fiscal Controller
 * Expõe endpoints REST para gerenciamento de notas fiscais.
 *
 * Segurança: todas as rotas exigem JWT verificado (JwtAuthGuard). Ações que
 * alteram o estado fiscal junto à SEFAZ (emitir, cancelar, inutilizar) são
 * restritas aos cargos admin|gerente (RolesGuard, case-insensitive).
 *
 * Ordem das rotas: rotas estáticas (ex.: /inutilizar, /calcular-impostos) são
 * declaradas ANTES das rotas parametrizadas (/:id/...) para evitar que o
 * segmento estático seja capturado como parâmetro `:id`.
 */

import {
  Controller,
  Post,
  Get,
  Put,
  Req,
  Res,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiProduces } from '@nestjs/swagger';
import { NotaFiscalService } from './nota-fiscal.service';
import { CriarNotaFiscalDto } from '../../dtos/criar-nota-fiscal.dto';
import { FiltroNotaFiscalDto } from '../../dtos/filtro-nota-fiscal.dto';
import { CancelarNotaDto } from '../../dtos/cancelar-nota.dto';
import { CartaCorrecaoDto } from '../../dtos/carta-correcao.dto';
import { InutilizarNumeracaoDto } from '../../dtos/inutilizar-numeracao.dto';
import { CalcularImpostosDto } from '../../dtos/calcular-impostos.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@ApiTags('notas-fiscais')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
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
   * Inutiliza uma faixa de numeração.
   *
   * Rota estática declarada antes de `/:id/...` para não ser capturada como
   * parâmetro. Restrita a admin|gerente.
   */
  @Post('inutilizar')
  @Roles('admin', 'gerente')
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
   *
   * Rota estática declarada antes de `/:id/...`.
   */
  @Post('calcular-impostos')
  @ApiOperation({ summary: 'Calcular impostos' })
  @ApiResponse({
    status: 200,
    description: 'Impostos calculados',
  })
  async calcularImpostos(@Req() req: any, @Body() dto: CalcularImpostosDto) {
    return this.notaFiscalService.calcularImpostosItens(req.tenantId, dto.itens);
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
   *
   * Restrita a admin|gerente.
   */
  @Post(':id/emitir')
  @Roles('admin', 'gerente')
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
   *
   * Restrita a admin|gerente.
   */
  @Post(':id/cancelar')
  @Roles('admin', 'gerente')
  @ApiOperation({ summary: 'Cancelar nota fiscal' })
  @ApiResponse({
    status: 200,
    description: 'Nota fiscal cancelada',
  })
  async cancelar(@Req() req: any, @Param('id') notaId: string, @Body() dto: CancelarNotaDto) {
    return this.notaFiscalService.cancelarNota(req.tenantId, notaId, dto);
  }

  /**
   * Emite carta de correção para uma nota.
   */
  @Post(':id/carta-correcao')
  @Roles('admin', 'gerente')
  @ApiOperation({ summary: 'Emitir carta de correção' })
  @ApiResponse({
    status: 200,
    description: 'Carta de correção emitida',
  })
  async cartaCorrecao(@Req() req: any, @Param('id') notaId: string, @Body() dto: CartaCorrecaoDto) {
    return this.notaFiscalService.cartaCorrecao(req.tenantId, notaId, dto);
  }

  /**
   * Gera o DANFE (NF-e) / DANFCE (NFC-e) em PDF.
   *
   * Responde com o binário do PDF (application/pdf), inline no navegador. Usa
   * `@Res` (passthrough desabilitado) para escrever o Buffer diretamente na
   * resposta, definindo os headers de conteúdo e nome de arquivo.
   */
  @Get(':id/danfe')
  @ApiOperation({ summary: 'Gerar DANFE/DANFCE em PDF' })
  @ApiProduces('application/pdf')
  @ApiResponse({
    status: 200,
    description: 'PDF do DANFE/DANFCE',
  })
  async gerarDanfe(
    @Req() req: any,
    @Param('id') notaId: string,
    @Res() res: Response,
  ): Promise<void> {
    const pdf = await this.notaFiscalService.gerarDanfe(req.tenantId, notaId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdf.length);
    res.setHeader('Content-Disposition', `inline; filename="danfe-${notaId}.pdf"`);
    res.end(pdf);
  }
}
