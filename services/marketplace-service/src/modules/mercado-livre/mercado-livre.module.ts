import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { EventosModule } from '../eventos/eventos.module'
import { ContaMarketplaceModule } from '../conta-marketplace/conta-marketplace.module'
import { AnuncioModule } from '../anuncio/anuncio.module'
import { MercadoLivreConfig } from './mercado-livre.config'
import { MercadoLivreOAuthService } from './mercado-livre-oauth.service'
import { MercadoLivreTokenService } from './mercado-livre-token.service'
import { MercadoLivreHttpService } from './mercado-livre-http.service'
import { MercadoLivreContaService } from './mercado-livre-conta.service'
import { MercadoLivreService } from './mercado-livre.service'
import { MercadoLivreController } from './mercado-livre.controller'
import { WebhookMercadoLivreController } from './webhook-mercadolivre.controller'

/**
 * Módulo da integração real com o Mercado Livre.
 *
 * Agrupa OAuth por tenant, gerência de tokens (criptografia + rotação atômica),
 * cliente HTTP autenticado, recepção de webhook (público) e sincronização de
 * anúncios. Reusa ContaMarketplaceRepository e AnuncioRepository (via os
 * respectivos módulos) para persistência, e ProdutorEventosService para a saga.
 *
 * O CriptoToken é provido globalmente pelo CriptoModule.
 */
@Module({
  imports: [
    PrismaModule,
    EventosModule,
    ContaMarketplaceModule,
    AnuncioModule,
  ],
  controllers: [MercadoLivreController, WebhookMercadoLivreController],
  providers: [
    MercadoLivreConfig,
    MercadoLivreOAuthService,
    MercadoLivreTokenService,
    MercadoLivreHttpService,
    MercadoLivreContaService,
    MercadoLivreService,
  ],
  exports: [
    MercadoLivreService,
    MercadoLivreTokenService,
    MercadoLivreHttpService,
    MercadoLivreConfig,
  ],
})
export class MercadoLivreModule {}
