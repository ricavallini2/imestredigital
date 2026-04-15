/**
 * Controller de Push Notifications.
 *
 * Endpoints para envio de push, registro e gerenciamento de dispositivos.
 */

import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { PushService } from './push.service';
import { EnviarPushDto } from '../../dtos/enviar-push.dto';

@ApiTags('push')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('enviar')
  @ApiOperation({
    summary: 'Envia uma notificação push',
    description: 'Envia uma notificação push para um usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificação enviada com sucesso',
    schema: {
      type: 'object',
      properties: {
        sucesso: { type: 'number' },
        falhas: { type: 'number' },
      },
    },
  })
  async enviarPush(
    @Body() dto: EnviarPushDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const resultado = await this.pushService.enviarPush(
      tenantId,
      dto.usuarioId,
      dto.titulo,
      dto.mensagem,
      dto.dados,
    );

    return resultado;
  }

  @Post('registrar-dispositivo')
  @ApiOperation({
    summary: 'Registra um novo dispositivo do usuário',
    description:
      'Registra um token FCM de um dispositivo para receber notificações push.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dispositivo registrado com sucesso',
  })
  async registrarDispositivo(
    @Body()
    dto: {
      token: string;
      plataforma?: string;
    },
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;
    const usuarioId = req.user?.sub || req.usuarioId;

    const dispositivo = await this.pushService.registrarDispositivo(
      tenantId,
      usuarioId,
      dto.token,
      dto.plataforma,
    );

    return dispositivo;
  }

  @Delete('dispositivo/:token')
  @ApiOperation({
    summary: 'Remove um token de dispositivo',
    description: 'Remove um dispositivo do usuário, deixando de enviar notificações para ele.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dispositivo removido com sucesso',
  })
  async removerDispositivo(
    @Param('token') token: string,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const resultado = await this.pushService.removerDispositivo(tenantId, token);

    return { removido: resultado };
  }

  @Get('dispositivos')
  @ApiOperation({
    summary: 'Lista dispositivos do usuário autenticado',
    description: 'Lista todos os dispositivos registrados para o usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dispositivos listados com sucesso',
    isArray: true,
  })
  async listarDispositivos(@Request() req: any) {
    const tenantId = req.user?.tenantId || req.tenantId;
    const usuarioId = req.user?.sub || req.usuarioId;

    const dispositivos = await this.pushService.listarDispositivosUsuario(
      tenantId,
      usuarioId,
    );

    return dispositivos;
  }
}
