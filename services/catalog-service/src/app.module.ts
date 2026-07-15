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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';

import { ProdutoModule } from './modules/produto/produto.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { MarcaModule } from './modules/marca/marca.module';
import { GradeModule } from './modules/grade/grade.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CacheConfigModule } from './modules/cache/cache.module';
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
    CacheConfigModule,
    ProdutoModule,
    CategoriaModule,
    MarcaModule,
    GradeModule,
  ],
  controllers: [HealthController],
  providers: [JwtStrategy],
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
