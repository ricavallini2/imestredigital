import { Module } from '@nestjs/common';
import { PedidoMarketplaceService } from './pedido-marketplace.service';
import { PedidoMarketplaceRepository } from './pedido-marketplace.repository';
import { PedidoMarketplaceController } from './pedido-marketplace.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventosModule } from '../eventos/eventos.module';
import { IntegracaoModule } from '../integracao/integracao.module';
import { ContaMarketplaceModule } from '../conta-marketplace/conta-marketplace.module';

/**
 * Módulo de pedidos marketplace
 */
@Module({
  imports: [
    PrismaModule,
    EventosModule,
    IntegracaoModule,
    ContaMarketplaceModule,
  ],
  controllers: [PedidoMarketplaceController],
  providers: [PedidoMarketplaceService, PedidoMarketplaceRepository],
  exports: [PedidoMarketplaceService, PedidoMarketplaceRepository],
})
export class PedidoMarketplaceModule {}
