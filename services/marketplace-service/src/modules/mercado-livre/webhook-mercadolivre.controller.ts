import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  ValidationPipe,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { WebhookMercadoLivreDto } from '../../dtos/webhook-mercadolivre.dto'
import { MercadoLivreService } from './mercado-livre.service'

/**
 * Pipe permissivo para o corpo do webhook.
 *
 * O ValidationPipe GLOBAL usa forbidNonWhitelisted: true — o que rejeitaria (400)
 * qualquer campo novo que o Mercado Livre venha a adicionar na notificação,
 * quebrando o requisito de responder 200. Aqui, sobrescrevemos para tolerar
 * campos extras (whitelist desligada), mantendo a resposta 200 resiliente.
 */
const pipeWebhook = new ValidationPipe({
  whitelist: false,
  forbidNonWhitelisted: false,
  transform: true,
})

/**
 * Receptor de webhooks do Mercado Livre.
 *
 * PÚBLICO — sem JWT (o ML chama sem Authorization). O path
 * 'api/v1/webhooks/mercadolivre' é excluído do TenantMiddleware no AppModule.
 *
 * Contrato de resposta do ML (pesquisa, seção 2.4): responder HTTP 200 o mais
 * rápido possível (idealmente < 500 ms) para não ter o tópico desativado. Por
 * isso o processamento pesado (buscar o recurso na API + publicar evento) é
 * disparado de forma assíncrona (fire-and-forget) e a resposta 200 retorna já.
 */
@ApiTags('Webhooks')
@Controller('api/v1/webhooks/mercadolivre')
export class WebhookMercadoLivreController {
  private readonly logger = new Logger(WebhookMercadoLivreController.name)

  constructor(private readonly mercadoLivre: MercadoLivreService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Receber notificação do Mercado Livre (público)' })
  @ApiResponse({ status: 200, description: 'Notificação recebida' })
  receber(
    @Body(pipeWebhook) notificacao: WebhookMercadoLivreDto,
  ): { recebido: true } {
    this.logger.log(
      `Webhook ML: topic=${notificacao.topic ?? '?'} user_id=${notificacao.user_id ?? '?'} ` +
        `resource=${notificacao.resource ?? '?'}`,
    )

    // Dispara o processamento sem aguardar — resposta 200 imediata.
    void this.processarAssincrono(notificacao)

    return { recebido: true }
  }

  /**
   * Processa a notificação fora do caminho de resposta HTTP.
   * Erros são apenas logados: o ML reenvia em caso de falha, e o 200 já foi dado.
   */
  private async processarAssincrono(
    notificacao: WebhookMercadoLivreDto,
  ): Promise<void> {
    try {
      // Só tratamos orders_v2 nesta fundação (pedidos → saga).
      if (notificacao.topic !== 'orders_v2') {
        this.logger.debug(`Webhook ML ignorado (topic não tratado): ${notificacao.topic}`)
        return
      }

      if (notificacao.user_id === undefined || !notificacao.resource) {
        this.logger.warn('Webhook orders_v2 sem user_id/resource — ignorado')
        return
      }

      const conta = await this.mercadoLivre.resolverContaPorUserId(notificacao.user_id)
      if (!conta) {
        this.logger.warn(
          `Webhook orders_v2: nenhuma conta ML para user_id ${notificacao.user_id} — ignorado`,
        )
        return
      }

      await this.mercadoLivre.processarWebhookPedido(conta, notificacao.resource)
    } catch (erro) {
      this.logger.error(
        `Erro ao processar webhook ML (${notificacao.resource ?? '?'}): ${(erro as Error).message}`,
        (erro as Error).stack,
      )
    }
  }
}
