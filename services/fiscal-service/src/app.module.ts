/**
 * Módulo raiz do Fiscal Service.
 * Orquestra todos os submódulos e configurações globais.
 *
 * Segurança (Fase 0):
 * - Passport + estratégia JWT (autenticação por assinatura verificada).
 * - JwtModule com segredo resolvido via fail-fast (obrigatório em produção).
 * - Middleware de tenant: exige token verificado (401 sem token válido),
 *   exceto em health checks e docs.
 */

import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaModule } from './modules/prisma/prisma.module';
import { NotaFiscalModule } from './modules/nota-fiscal/nota-fiscal.module';
import { ConfiguracaoFiscalModule } from './modules/configuracao-fiscal/configuracao-fiscal.module';
import { RegraFiscalModule } from './modules/regra-fiscal/regra-fiscal.module';
import { SefazModule } from './modules/sefaz/sefaz.module';
import { SpedModule } from './modules/sped/sped.module';
import { CacheModule } from './modules/cache/cache.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { WebhookFiscalModule } from './modules/provedor-fiscal/webhook/webhook-fiscal.module';
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
    EventosModule,
    NotaFiscalModule,
    ConfiguracaoFiscalModule,
    RegraFiscalModule,
    SefazModule,
    SpedModule,
    WebhookFiscalModule,
  ],
  controllers: [HealthController],
  providers: [JwtStrategy],
})
export class AppModule implements NestModule {
  /**
   * Aplica o middleware de tenant em todas as rotas da API exceto health
   * checks e docs (para não bloquear probes do Docker nem o Swagger).
   * O middleware verifica a assinatura do JWT e popula req.tenantId/
   * req.usuarioId/req.cargo; token ausente ou inválido → 401.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'api/health', method: RequestMethod.ALL },
        { path: 'api/health/(.*)', method: RequestMethod.ALL },
        { path: 'api/docs', method: RequestMethod.ALL },
        { path: 'api/docs/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
