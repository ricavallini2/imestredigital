/**
 * Controller de Notificações.
 *
 * Endpoints para CRUD de notificações, gerenciamento de status,
 * contagem de não lidas e gerenciamento de preferências.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { NotificacaoService } from './notificacao.service';
import { CriarNotificacaoDto } from '../../dtos/criar-notificacao.dto';
import {
  FiltroNotificacaoDto,
  StatusNotificacao,
} from '../../dtos/filtro-notificacao.dto';
import { AtualizarPreferenciasDto } from '../../dtos/preferencia-notificacao.dto';

@ApiTags('notificacoes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/notificacoes')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria uma nova notificação',
    description:
      'Cria e dispara uma nova notificação para um usuário através do canal especificado.',
  })
  @ApiResponse({
    status: 201,
    description: 'Notificação criada com sucesso',
  })
  async criarNotificacao(
    @Body() dto: CriarNotificacaoDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const notificacao = await this.notificacaoService.criarNotificacao(
      tenantId,
      dto,
    );

    return notificacao;
  }

  @Get()
  @ApiOperation({
    summary: 'Lista notificações do usuário',
    description: 'Lista todas as notificações do usuário autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificações listadas com sucesso',
  })
  async listarNotificacoes(
    @Query() filtros: FiltroNotificacaoDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;
    const usuarioId = req.user?.sub || req.usuarioId;

    const pagina = filtros.pagina ? parseInt(filtros.pagina) : 1;
    const limite = filtros.limite ? parseInt(filtros.limite) : 20;

    const resultado = await this.notificacaoService.listarNotificacoes(
      tenantId,
      usuarioId,
      {
        status: filtros.status,
        tipo: filtros.tipo,
        pagina,
        limite,
      },
    );

    return resultado;
  }

  @Get('nao-lidas/count')
  @ApiOperation({
    summary: 'Conta notificações não lidas',
    description: 'Retorna o número de notificações não lidas do usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contagem obtida com sucesso',
    schema: {
      type: 'object',
      properties: {
        naoLidas: { type: 'number', example: 5 },
      },
    },
  })
  async contarNaoLidas(@Request() req: any) {
    const tenantId = req.user?.tenantId || req.tenantId;
    const usuarioId = req.user?.sub || req.usuarioId;

    const naoLidas = await this.notificacaoService.contarNaoLidas(
      tenantId,
      usuarioId,
    );

    return { naoLidas };
  }

  @Put(':id/lida')
  @ApiOperation({
    summary: 'Marca uma notificação como lida',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificação marcada como lida',
  })
  async marcarComoLida(
    @Param('id') notificacaoId: string,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;
    const usuarioId = req.user?.sub || req.usuarioId;

    const notificacao = await this.notificacaoService.marcarComoLida(
      tenantId,
      notificacaoId,
      usuarioId,
    );

    return notificacao;
  }

  @Put('marcar-todas-lidas')
  @ApiOperation({
    summary: 'Marca todas as notificações como lidas',
    description: 'Marca todas as notificações não lidas do usuário como lidas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificações marcadas como lidas',
    schema: {
      type: 'object',
      properties: {
        atualizadas: { type: 'number' },
      },
    },
  })
  async marcarTodasComoLidas(@Request() req: any) {
    const tenantId = req.user?.tenantId || req.tenantId;
    const usuarioId = req.user?.sub || req.usuarioId;

    const resultado = await this.notificacaoService.marcarTodasComoLidas(
      tenantId,
      usuarioId,
    );

    return resultado;
  }

  @Get('preferencias')
  @ApiOperation({
    summary: 'Obtém preferências de notificação do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Preferências obtidas com sucesso',
    isArray: true,
  })
  async obterPreferencias(@Request() req: any) {
    const tenantId = req.user?.tenantId || req.tenantId;
    const usuarioId = req.user?.sub || req.usuarioId;

    const preferencias = await this.notificacaoService.obterPreferencias(
      tenantId,
      usuarioId,
    );

    return preferencias;
  }

  @Put('preferencias')
  @ApiOperation({
    summary: 'Atualiza preferências de notificação',
    description:
      'Atualiza as preferências de quais canais e eventos o usuário deseja receber.',
  })
  @ApiResponse({
    status: 200,
    description: 'Preferências atualizadas com sucesso',
    isArray: true,
  })
  async atualizarPreferencias(
    @Body() dto: AtualizarPreferenciasDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;
    const usuarioId = req.user?.sub || req.usuarioId;

    const preferencias = await this.notificacaoService.atualizarPreferencias(
      tenantId,
      usuarioId,
      dto.preferencias,
    );

    return preferencias;
  }
}
