import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CacheModule } from './modules/cache/cache.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { ContaMarketplaceModule } from './modules/conta-marketplace/conta-marketplace.module';
import { AnuncioModule } from './modules/anuncio/anuncio.module';
import { PedidoMarketplaceModule } from './modules/pedido-marketplace/pedido-marketplace.module';
import { PerguntaModule } from './modules/pergunta/pergunta.module';
import { SincronizacaoModule } from './modules/sincronizacao/sincronizacao.module';
import { IntegracaoModule } from './modules/integracao/integracao.module';

/**
 * Módulo raiz da aplicação
 * Configuração centralizada de todos os submódulos
 */
@Module({
  imports: [
    // Configuração e variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Módulos de infraestrutura
    PrismaModule,
    CacheModule,
    EventosModule,
    HealthModule,

    // Módulos de negócio
    ContaMarketplaceModule,
    AnuncioModule,
    PedidoMarketplaceModule,
    PerguntaModule,
    SincronizacaoModule,
    IntegracaoModule,
  ],
})
export class AppModule {}
