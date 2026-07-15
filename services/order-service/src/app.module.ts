/**
 * Módulo raiz do Order Service (COMPLETO).
 *
 * Registra todos os módulos e configura:
 * - Passport + estratégia JWT (autenticação)
 * - Middleware de tenant (multi-tenancy, verify + 401)
 * - Cache Redis
 * - Health checks
 * - Todos os módulos de domínio (pedido, pagamento, devolução)
 */

import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
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
import { JwtStrategy } from './strategies/jwt.strategy';
import { resolverJwtSecret } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Passport (estratégia JWT padrão)
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT para verificar a assinatura do token (usado no TenantMiddleware
    // e na JwtStrategy). O segredo é resolvido com fail-fast: obrigatório
    // em produção, com default apenas em dev (ver config/jwt.config.ts).
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: resolverJwtSecret(config),
        signOptions: {
          issuer: 'imestredigital',
          audience: 'imestredigital-api',
        },
      }),
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
  providers: [JwtStrategy],
})
export class AppModule implements NestModule {
  /**
   * Aplica middleware de tenant em todas as rotas da API exceto health
   * checks e docs (para não bloquear probes do Docker nem o Swagger).
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'api/v1/health', method: RequestMethod.ALL },
        { path: 'api/v1/health/(.*)', method: RequestMethod.ALL },
        { path: 'api/docs', method: RequestMethod.ALL },
        { path: 'api/docs/(.*)', method: RequestMethod.ALL },
        // Webhooks de gateway de pagamento são públicos (autenticação via
        // assinatura do gateway, validada no serviço — ver TODO Fase 1).
        { path: 'api/v1/pagamentos/webhook/(.*)', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
