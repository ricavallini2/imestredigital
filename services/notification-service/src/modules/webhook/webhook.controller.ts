/**
 * Controller de Webhooks.
 *
 * Endpoints para CRUD de configurações de webhooks e acesso ao histórico.
 */

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { WebhookService } from './webhook.service';
import { CriarWebhookDto, AtualizarWebhookDto } from '../../dtos/criar-webhook.dto';

@ApiTags('webhooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um novo webhook',
    description: 'Registra uma nova configuração de webhook para o tenant.',
  })
  @ApiResponse({
    status: 201,
    description: 'Webhook criado com sucesso',
  })
  async criarWebhook(
    @Body() dto: CriarWebhookDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const webhook = await this.webhookService.registrarWebhook(tenantId, dto);

    return webhook;
  }

  @Get()
  @ApiOperation({
    summary: 'Lista todos os webhooks',
    description: 'Lista todas as configurações de webhooks do tenant.',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhooks listados com sucesso',
    isArray: true,
  })
  async listarWebhooks(@Request() req: any) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const webhooks = await this.webhookService.listarWebhooks(tenantId);

    return webhooks;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtém detalhes de um webhook',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook obtido com sucesso',
  })
  async obterWebhook(
    @Param('id') webhookId: string,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const webhook = await this.webhookService.obterWebhook(tenantId, webhookId);

    return webhook;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza um webhook',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook atualizado com sucesso',
  })
  async atualizarWebhook(
    @Param('id') webhookId: string,
    @Body() dto: AtualizarWebhookDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const webhook = await this.webhookService.atualizarWebhook(
      tenantId,
      webhookId,
      dto,
    );

    return webhook;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Desativa um webhook',
    description: 'Desativa um webhook, impedindo que novos eventos sejam disparados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook desativado com sucesso',
  })
  async desativarWebhook(
    @Param('id') webhookId: string,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const webhook = await this.webhookService.desativarWebhook(
      tenantId,
      webhookId,
    );

    return webhook;
  }

  @Get(':id/historico')
  @ApiOperation({
    summary: 'Obtém histórico de envios de um webhook',
    description: 'Lista os últimos envios de um webhook com status de sucesso/falha.',
  })
  @ApiResponse({
    status: 200,
    description: 'Histórico obtido com sucesso',
    isArray: true,
  })
  async obterHistorico(
    @Param('id') webhookId: string,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.tenantId;

    const historico = await this.webhookService.obterHistoricoWebhook(
      tenantId,
      webhookId,
      50,
    );

    return historico;
  }
}
