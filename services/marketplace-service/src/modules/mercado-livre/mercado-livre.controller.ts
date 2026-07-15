import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { RequestComTenant } from '../../middlewares/tenant.middleware'
import { CallbackMercadoLivreDto } from '../../dtos/callback-mercadolivre.dto'
import { MercadoLivreContaService } from './mercado-livre-conta.service'
import { MercadoLivreService } from './mercado-livre.service'

/**
 * Endpoints autenticados (por tenant) da integração Mercado Livre:
 * - OAuth (URL de autorização + callback);
 * - sincronização de anúncios do seller.
 *
 * tenantId vem sempre do JWT (TenantMiddleware → req.tenantId).
 */
@ApiTags('Mercado Livre')
@ApiBearerAuth()
@Controller('api/v1')
export class MercadoLivreController {
  constructor(
    private readonly contaService: MercadoLivreContaService,
    private readonly mercadoLivre: MercadoLivreService,
  ) {}

  /**
   * Retorna a URL de autorização OAuth do Mercado Livre para o tenant.
   */
  @Get('contas/mercadolivre/url-autorizacao')
  @ApiOperation({ summary: 'Obter URL de autorização OAuth do Mercado Livre' })
  @ApiResponse({ status: 200, description: 'URL de autorização gerada' })
  obterUrlAutorizacao(@Req() req: RequestComTenant) {
    return this.contaService.gerarUrlAutorizacao(req.tenantId!)
  }

  /**
   * Recebe o code do OAuth (via frontend) e conecta a conta do seller.
   */
  @Post('contas/mercadolivre/callback')
  @ApiOperation({ summary: 'Callback OAuth do Mercado Livre (troca code por tokens)' })
  @ApiResponse({ status: 201, description: 'Conta conectada/atualizada' })
  processarCallback(
    @Req() req: RequestComTenant,
    @Body() dto: CallbackMercadoLivreDto,
  ) {
    return this.contaService.processarCallback(req.tenantId!, dto.code, dto.state)
  }

  /**
   * Sincroniza os anúncios (items) de uma conta do Mercado Livre.
   */
  @Post('sincronizacao/mercadolivre/anuncios/:contaId')
  @ApiOperation({ summary: 'Sincronizar anúncios do Mercado Livre para uma conta' })
  @ApiResponse({ status: 201, description: 'Resumo da sincronização' })
  sincronizarAnuncios(
    @Req() req: RequestComTenant,
    @Param('contaId') contaId: string,
  ) {
    return this.mercadoLivre.sincronizarAnuncios(req.tenantId!, contaId)
  }
}
