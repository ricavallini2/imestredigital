import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { ContaMarketplaceModule } from '../conta-marketplace/conta-marketplace.module'
import { SincronizacaoModule } from '../sincronizacao/sincronizacao.module'
import { MercadoLivreModule } from '../mercado-livre/mercado-livre.module'
import { VitrineController } from './vitrine.controller'
import { VitrineService } from './vitrine.service'
import { VitrineRepository } from './vitrine.repository'

/**
 * Módulo da Vitrine de marketplaces.
 *
 * Serve o namespace `api/v1/marketplaces` consumido pela UI (apps/web),
 * agregando dados de contas/anúncios/pedidos/perguntas nos shapes da tela.
 *
 * Reusa:
 * - ContaMarketplaceModule → ContaMarketplaceRepository (leitura de conta);
 * - SincronizacaoModule    → SincronizacaoService (sync genérica por adapter);
 * - MercadoLivreModule     → MercadoLivreService (sync real de anúncios) e
 *                            MercadoLivreConfig (checagem de credenciais da app).
 */
@Module({
  imports: [
    PrismaModule,
    ContaMarketplaceModule,
    SincronizacaoModule,
    MercadoLivreModule,
  ],
  controllers: [VitrineController],
  providers: [VitrineService, VitrineRepository],
})
export class VitrineModule {}
