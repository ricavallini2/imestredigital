/**
 * Módulo raiz da aplicação AI Service
 *
 * Agregador de todos os módulos de negócio
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AssistenteModule } from './modules/assistente/assistente.module';
import { InsightsModule } from './modules/insights/insights.module';
import { PrevisaoModule } from './modules/previsao/previsao.module';
import { ClassificacaoModule } from './modules/classificacao/classificacao.module';
import { SugestaoModule } from './modules/sugestao/sugestao.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { SaudeModule } from './modules/saude/saude.module';
import { TenantMiddleware } from './middlewares/tenant.middleware';

@Module({
  imports: [
    // Configuração ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Cache Redis
    CacheModule.register({
      isGlobal: true,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      db: parseInt(process.env.REDIS_DB || '1'),
      password: process.env.REDIS_PASSWORD,
    }),

    // Módulos de negócio
    PrismaModule,
    AssistenteModule,
    InsightsModule,
    PrevisaoModule,
    ClassificacaoModule,
    SugestaoModule,
    EventosModule,
    SaudeModule,
  ],
})
export class AppModule {
  // O middleware de tenant será aplicado globalmente em main.ts
}
