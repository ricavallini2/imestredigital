/**
 * Módulo raiz da aplicação AI Service
 *
 * Agregador de todos os módulos de negócio. Configura:
 * - Variáveis de ambiente
 * - Autenticação JWT (AuthModule global)
 * - Cache Redis
 * - Middleware de tenant (verificação de JWT + injeção de tenantId)
 */

import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'
import { PrismaModule } from './modules/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { AssistenteModule } from './modules/assistente/assistente.module'
import { InsightsModule } from './modules/insights/insights.module'
import { PrevisaoModule } from './modules/previsao/previsao.module'
import { ClassificacaoModule } from './modules/classificacao/classificacao.module'
import { SugestaoModule } from './modules/sugestao/sugestao.module'
import { EventosModule } from './modules/eventos/eventos.module'
import { SaudeModule } from './modules/saude/saude.module'
import { TenantMiddleware } from './middlewares/tenant.middleware'

@Module({
  imports: [
    // Configuração ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Autenticação (Passport + JWT + JwtStrategy) — global
    AuthModule,

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
export class AppModule implements NestModule {
  /**
   * Aplica o middleware de tenant a todas as rotas da API,
   * exceto endpoints públicos (health/saúde e documentação Swagger),
   * para não bloquear probes de container.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'api/v1/saude', method: RequestMethod.ALL },
        { path: 'api/v1/saude/(.*)', method: RequestMethod.ALL },
        { path: 'docs', method: RequestMethod.ALL },
        { path: 'docs/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*')
  }
}
