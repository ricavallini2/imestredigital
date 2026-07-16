/**
 * ═══════════════════════════════════════════════════════════════
 * Controller do Caixa - REST API
 * ═══════════════════════════════════════════════════════════════
 *
 * ORDEM DAS ROTAS: `/caixa/atual` é ESTÁTICA e precisa ser declarada ANTES de
 * `@Get(':id')`. Invertida, o ':id' captura a string "atual", o ParseUUIDPipe
 * (ou o Prisma) recebe um UUID inválido e a tela do PDV toma 400/500.
 */

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CaixaService } from './caixa.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import {
  AbrirCaixaDto,
  FecharCaixaDto,
  RegistrarMovimentacaoCaixaDto,
  ListarSessoesCaixaDto,
} from '../../dtos/caixa.dto';

@ApiTags('caixa')
@ApiBearerAuth()
@Controller('caixa')
@UseGuards(JwtAuthGuard)
export class CaixaController {
  constructor(private readonly service: CaixaService) {}

  /**
   * GET /caixa/atual
   * Sessão aberta do tenant + movimentações + totais.
   * Sempre 200: sem caixa aberto devolve { aberto: false, sessao: null }.
   */
  @Get('atual')
  @ApiOperation({ summary: 'Sessão de caixa aberta do tenant (200 mesmo sem caixa aberto)' })
  obterAtual(@Req() req: any) {
    return this.service.obterAtual(req.tenantId);
  }

  /**
   * GET /caixa
   * Histórico de sessões, mais recente primeiro.
   */
  @Get()
  @ApiOperation({ summary: 'Listar sessões de caixa (histórico paginado)' })
  listar(@Req() req: any, @Query() filtros: ListarSessoesCaixaDto) {
    return this.service.listar(req.tenantId, filtros);
  }

  /**
   * GET /caixa/:id
   * Detalhe de uma sessão + movimentações.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da sessão de caixa' })
  buscar(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.buscarPorId(req.tenantId, id);
  }

  /**
   * POST /caixa
   * Abre um turno. 409 se já houver caixa aberto no tenant.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Abrir caixa' })
  abrir(@Req() req: any, @Body() dto: AbrirCaixaDto) {
    return this.service.abrir(req.tenantId, dto, req.usuarioId);
  }

  /**
   * POST /caixa/:id/fechar
   * Fecha o turno e calcula a divergência (valorContado - saldoEsperado).
   */
  @Post(':id/fechar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fechar caixa (confere o valor contado)' })
  fechar(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: FecharCaixaDto) {
    return this.service.fechar(req.tenantId, id, dto);
  }

  /**
   * POST /caixa/:id/movimentacoes
   * Registra suprimento/sangria/despesa/outros. 422 se a sessão estiver fechada.
   */
  @Post(':id/movimentacoes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar movimentação de caixa' })
  registrarMovimentacao(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RegistrarMovimentacaoCaixaDto,
  ) {
    return this.service.registrarMovimentacao(req.tenantId, id, dto);
  }
}
