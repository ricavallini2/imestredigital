/**
 * Módulo raiz do Fiscal Service.
 * Orquestra todos os submódulos e configurações globais.
 */

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaModule } from './modules/prisma/prisma.module';
import { NotaFiscalModule } from './modules/nota-fiscal/nota-fiscal.module';
import { ConfiguracaoFiscalModule } from './modules/configuracao-fiscal/configuracao-fiscal.module';
import { RegraFiscalModule } from './modules/regra-fiscal/regra-fiscal.module';
import { SefazModule } from './modules/sefaz/sefaz.module';
import { SpedModule } from './modules/sped/sped.module';
import { CacheModule } from './modules/cache/cache.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { HealthController } from './controllers/health.controller';
import { TenantMiddleware } from './middlewares/tenant.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dev-secret-trocar-em-producao',
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
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  /**
   * Aplica o middleware de tenant globalmente para extrair tenantId do JWT.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
