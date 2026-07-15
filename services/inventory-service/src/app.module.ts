/**
 * Módulo raiz do Inventory Service.
 *
 * Configura:
 * - ConfigModule global (.env)
 * - JWT com segredo resolvido em fail-fast (config/jwt.config.ts)
 * - Passport (estratégia JWT) para rotas protegidas
 * - TenantMiddleware (multi-tenancy) em toda a API, exceto health e docs
 */

import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaModule } from './modules/prisma/prisma.module';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { DepositoModule } from './modules/deposito/deposito.module';
import { MovimentacaoModule } from './modules/movimentacao/movimentacao.module';
import { HealthController } from './controllers/health.controller';
import { TenantMiddleware } from './middlewares/tenant.middleware';
import { JwtStrategy } from './strategies/jwt.strategy';
import { resolverJwtSecret } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),

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
    EstoqueModule,
    DepositoModule,
    MovimentacaoModule,
  ],
  controllers: [HealthController],
  providers: [JwtStrategy],
})
export class AppModule implements NestModule {
  /** Aplica o TenantMiddleware em todas as rotas da API exceto health checks e docs. */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'api/v1/health', method: RequestMethod.ALL },
        { path: 'api/v1/health/(.*)', method: RequestMethod.ALL },
        { path: 'api/docs', method: RequestMethod.ALL },
        { path: 'api/docs/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
