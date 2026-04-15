/**
 * Módulo raiz do Order Service (COMPLETO).
 *
 * Registra todos os módulos e configura:
 * - Middleware de tenant (multi-tenancy)
 * - Cache Redis
 * - Health checks
 * - Todos os módulos de domínio (pedido, pagamento, devolução)
 */

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';

import { PedidoModule } from './modules/pedido/pedido.module';
import { PagamentoModule } from './modules/pagamento/pagamento.module';
import { DevolucaoModule } from './modules/devolucao/devolucao.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CacheModule } from './modules/cache/cache.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { HealthController } from './controllers/health.controller';
import { TenantMiddleware } from './middlewares/tenant.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // JWT para decodificar token do tenant middleware
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dev-secret-trocar-em-producao',
    }),

    TerminusModule,
    PrismaModule,
    CacheModule,
    KafkaModule,
    EventosModule,
    PedidoModule,
    PagamentoModule,
    DevolucaoModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  /** Aplica middleware de tenant em todas as rotas da API */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes('*');
  }
}
