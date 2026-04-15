import { Module } from '@nestjs/common';
import { AnuncioService } from './anuncio.service';
import { AnuncioRepository } from './anuncio.repository';
import { AnuncioController } from './anuncio.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { EventosModule } from '../eventos/eventos.module';
import { IntegracaoModule } from '../integracao/integracao.module';
import { ContaMarketplaceModule } from '../conta-marketplace/conta-marketplace.module';

/**
 * Módulo de anúncios
 */
@Module({
  imports: [
    PrismaModule,
    CacheModule,
    EventosModule,
    IntegracaoModule,
    ContaMarketplaceModule,
  ],
  controllers: [AnuncioController],
  providers: [AnuncioService, AnuncioRepository],
  exports: [AnuncioService, AnuncioRepository],
})
export class AnuncioModule {}
