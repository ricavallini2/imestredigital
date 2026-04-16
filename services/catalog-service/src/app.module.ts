/**
 * Módulo raiz do Catalog Service (COMPLETO).
 *
 * Registra todos os módulos e configura:
 * - Middleware de tenant (multi-tenancy)
 * - Cache Redis
 * - Health checks
 * - Todos os módulos de domínio
 */

import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';

import { ProdutoModule } from './modules/produto/produto.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { MarcaModule } from './modules/marca/marca.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CacheConfigModule } from './modules/cache/cache.module';
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
    CacheConfigModule,
    ProdutoModule,
    CategoriaModule,
    MarcaModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  /** Aplica middleware de tenant em todas as rotas da API exceto health checks e docs. */
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
