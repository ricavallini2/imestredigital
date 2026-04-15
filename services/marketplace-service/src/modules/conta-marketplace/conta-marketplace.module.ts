import { Module } from '@nestjs/common';
import { ContaMarketplaceController } from './conta-marketplace.controller';
import { ContaMarketplaceService } from './conta-marketplace.service';
import { ContaMarketplaceRepository } from './conta-marketplace.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { EventosModule } from '../eventos/eventos.module';
import { IntegracaoModule } from '../integracao/integracao.module';

/**
 * Módulo de gerenciamento de contas marketplace
 */
@Module({
  imports: [PrismaModule, CacheModule, EventosModule, IntegracaoModule],
  controllers: [ContaMarketplaceController],
  providers: [ContaMarketplaceService, ContaMarketplaceRepository],
  exports: [ContaMarketplaceService, ContaMarketplaceRepository],
})
export class ContaMarketplaceModule {}
