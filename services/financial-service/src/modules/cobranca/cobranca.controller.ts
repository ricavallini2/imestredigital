/**
 * Controller de Cobrança — contrato consumido por apps/web (cobranca.service.ts).
 * Base: /api/v1/cobranca. Todas as rotas exigem JWT; tenantId vem de req.tenantId.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { CobrancaService } from './cobranca.service';
import {
  AcaoCobrancaDto,
  ConfiguracaoCobrancaDto,
  CriarTituloDto,
  DispararDto,
  ListarAcordosDto,
  ListarHistoricoDto,
  ListarTitulosDto,
  NegociarDto,
} from '../../dtos/cobranca/cobranca.dto';

@ApiTags('cobranca')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/cobranca')
export class CobrancaController {
  constructor(private readonly cobrancaService: CobrancaService) {}

  // ── Rotas estáticas (antes das paramétricas) ──────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas de cobrança' })
  estatisticas(@Request() req: any) {
    return this.cobrancaService.estatisticas(req.tenantId);
  }

  @Get('acordos')
  @ApiOperation({ summary: 'Listar acordos' })
  listarAcordos(@Request() req: any, @Query() filtros: ListarAcordosDto) {
    return this.cobrancaService.listarAcordos(req.tenantId, filtros);
  }

  @Post('acordos/:acordoId/pagar')
  @ApiOperation({ summary: 'Registrar pagamento de parcela do acordo' })
  pagarParcela(
    @Request() req: any,
    @Param('acordoId') acordoId: string,
    @Body() dto: { numeroParcela: number },
  ) {
    return this.cobrancaService.pagarParcela(req.tenantId, acordoId, Number(dto?.numeroParcela));
  }

  @Get('configuracoes')
  @ApiOperation({ summary: 'Obter configuração/régua de cobrança' })
  obterConfiguracao(@Request() req: any) {
    return this.cobrancaService.obterConfiguracao(req.tenantId);
  }

  @Put('configuracoes')
  @ApiOperation({ summary: 'Salvar configuração/régua de cobrança' })
  salvarConfiguracao(@Request() req: any, @Body() dto: ConfiguracaoCobrancaDto) {
    return this.cobrancaService.salvarConfiguracao(req.tenantId, dto);
  }

  @Post('disparar')
  @ApiOperation({ summary: 'Disparar cobrança em lote (e-mail)' })
  disparar(@Request() req: any, @Body() dto: DispararDto) {
    return this.cobrancaService.disparar(req.tenantId, dto, req.headers?.authorization);
  }

  @Get('historico')
  @ApiOperation({ summary: 'Histórico de ações de cobrança' })
  historico(@Request() req: any, @Query() filtros: ListarHistoricoDto) {
    return this.cobrancaService.historico(req.tenantId, filtros);
  }

  // ── Coleção ────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Listar títulos de cobrança' })
  listar(@Request() req: any, @Query() filtros: ListarTitulosDto) {
    return this.cobrancaService.listar(req.tenantId, filtros);
  }

  @Post()
  @ApiOperation({ summary: 'Criar título de cobrança manual' })
  criar(@Request() req: any, @Body() dto: CriarTituloDto) {
    return this.cobrancaService.criarTitulo(req.tenantId, dto);
  }

  // ── Ações por título (paramétricas com subrota) ────────────────────────────

  @Post(':tituloId/acao')
  @ApiOperation({ summary: 'Registrar ação de cobrança (e-mail envia de verdade)' })
  registrarAcao(
    @Request() req: any,
    @Param('tituloId') tituloId: string,
    @Body() dto: AcaoCobrancaDto,
  ) {
    return this.cobrancaService.registrarAcao(
      req.tenantId,
      tituloId,
      dto,
      req.headers?.authorization,
    );
  }

  @Post(':tituloId/negociar')
  @ApiOperation({ summary: 'Criar acordo de negociação' })
  negociar(
    @Request() req: any,
    @Param('tituloId') tituloId: string,
    @Body() dto: NegociarDto,
  ) {
    return this.cobrancaService.negociar(req.tenantId, tituloId, dto);
  }
}
