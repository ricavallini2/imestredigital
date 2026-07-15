/**
 * WebhookFiscalController — recebe gatilhos assíncronos do provedor fiscal.
 *
 * Rota PÚBLICA (sem JwtAuthGuard/RolesGuard): quem chama é o provedor (Focus
 * NFe), não um usuário autenticado do nosso sistema. O caminho é liberado no
 * TenantMiddleware e no exclude() do AppModule. O isolamento multi-tenant é
 * garantido no serviço, que resolve o tenant pela `ref` da nota.
 *
 * Caminho final (com prefixo global `api`): POST /api/v1/fiscal/webhooks/focusnfe.
 *
 * Responde sempre 200 para não induzir o provedor a reenviar em caso de
 * payload que não conseguimos casar (ex.: ref desconhecida) — o resultado do
 * processamento vai no corpo para observabilidade.
 */

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { WebhookFiscalService } from './webhook-fiscal.service';
import { WebhookFocusNFeDto } from './webhook-focus-nfe.dto';

@ApiExcludeController()
@Controller('v1/fiscal/webhooks')
export class WebhookFiscalController {
  constructor(private readonly webhookService: WebhookFiscalService) {}

  /**
   * Recebe o gatilho da Focus NFe para atualização assíncrona de status.
   */
  @Post('focusnfe')
  @HttpCode(HttpStatus.OK)
  async receberFocusNFe(@Body() payload: WebhookFocusNFeDto) {
    return this.webhookService.processarFocusNFe(payload);
  }
}
