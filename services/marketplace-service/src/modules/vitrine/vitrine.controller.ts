import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { RequestComTenant } from '../../middlewares/tenant.middleware'
import { VitrineService } from './vitrine.service'

/**
 * Controller da VITRINE de marketplaces — o que a UI (apps/web) consome.
 *
 * Traduz o modelo real do serviço para os shapes já usados pela tela
 * (Marketplace / Anuncio / StatsMarketplace). Difere do controller técnico
 * `api/v1/contas`, que expõe a conta crua para operações de conexão.
 *
 * tenantId vem sempre do JWT (TenantMiddleware → req.tenantId).
 */
@ApiTags('Marketplaces (Vitrine)')
@ApiBearerAuth()
@Controller('api/v1/marketplaces')
export class VitrineController {
  constructor(private readonly vitrine: VitrineService) {}

  /**
   * Lista os canais (contas) do tenant no shape Marketplace da tela.
   * Envelope canônico { dados, total, pagina, limite, totalPaginas }.
   */
  @Get()
  @ApiOperation({ summary: 'Listar marketplaces do tenant (shape da vitrine)' })
  @ApiResponse({ status: 200, description: 'Lista de marketplaces' })
  async listar(@Req() req: RequestComTenant) {
    return this.vitrine.listarMarketplaces(req.tenantId!)
  }

  /**
   * Stats globais agregadas do tenant (shape do mock stats).
   * Rota estática declarada antes de `:id/...` para evitar captura acidental.
   */
  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas agregadas dos marketplaces do tenant' })
  @ApiResponse({ status: 200, description: 'Estatísticas agregadas' })
  async stats(@Req() req: RequestComTenant) {
    return this.vitrine.obterStats(req.tenantId!)
  }

  /**
   * Anúncios de todas as contas do tenant no shape da tela de anúncios.
   * Envelope canônico.
   */
  @Get('anuncios')
  @ApiOperation({ summary: 'Listar anúncios de todas as contas (shape da vitrine)' })
  @ApiResponse({ status: 200, description: 'Lista de anúncios' })
  async anuncios(@Req() req: RequestComTenant) {
    return this.vitrine.listarAnuncios(req.tenantId!)
  }

  /**
   * Dispara a sincronização da conta indicada (reusa os fluxos existentes).
   * Para conta ML sem credenciais utilizáveis, responde 400 de negócio claro.
   */
  @Post(':id/sincronizar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sincronizar uma conta de marketplace' })
  @ApiParam({ name: 'id', description: 'ID da conta de marketplace' })
  @ApiResponse({ status: 200, description: 'Sincronização disparada' })
  @ApiResponse({ status: 400, description: 'Credenciais ausentes/ inválidas' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  async sincronizar(@Req() req: RequestComTenant, @Param('id') id: string) {
    return this.vitrine.sincronizar(req.tenantId!, id)
  }
}
