import { Module } from '@nestjs/common';
import { SincronizacaoService } from './sincronizacao.service';
import { SincronizacaoRepository } from './sincronizacao.repository';
import { SincronizacaoController } from './sincronizacao.controller';
import { ConsumidorEventosController } from '../eventos/consumidor-eventos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { AnuncioModule } from '../anuncio/anuncio.module';
import { PedidoMarketplaceModule } from '../pedido-marketplace/pedido-marketplace.module';
import { PerguntaModule } from '../pergunta/pergunta.module';
import { ContaMarketplaceModule } from '../conta-marketplace/conta-marketplace.module';
import { IntegracaoModule } from '../integracao/integracao.module';

/**
 * Módulo de sincronização
 */
@Module({
  imports: [
    PrismaModule,
    CacheModule,
    AnuncioModule,
    PedidoMarketplaceModule,
    PerguntaModule,
    ContaMarketplaceModule,
    IntegracaoModule,
  ],
  controllers: [SincronizacaoController, ConsumidorEventosController],
  providers: [SincronizacaoService, SincronizacaoRepository],
  exports: [SincronizacaoService, SincronizacaoRepository],
})
export class SincronizacaoModule {}
