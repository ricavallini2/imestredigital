/**
 * Módulo raiz do Notification Service.
 *
 * Registra todos os módulos: Prisma, Cache, Email, Push, Webhook,
 * Notificação, Template e Kafka Consumer.
 * Configura JWT globalmente, a JwtStrategy do Passport e o
 * TenantMiddleware (isolamento multi-tenant) para toda a aplicação.
 */

import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TerminusModule } from '@nestjs/terminus'
import { CacheModule } from '@nestjs/cache-manager'

import { PrismaModule } from './modules/prisma/prisma.module'
import { CacheServiceModule } from './modules/cache/cache.module'
import { EmailModule } from './modules/email/email.module'
import { PushModule } from './modules/push/push.module'
import { WebhookModule } from './modules/webhook/webhook.module'
import { NotificacaoModule } from './modules/notificacao/notificacao.module'
import { TemplateModule } from './modules/template/template.module'
import { KafkaModule } from './modules/kafka/kafka.module'
import { HealthController } from './controllers/health.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { TenantMiddleware } from './middleware/tenant.middleware'
import { resolverJwtSecret } from './common/jwt-secret'

@Module({
  imports: [
    // Variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Passport (estratégias de autenticação)
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT (configuração global) — fail-fast em produção sem JWT_SECRET
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: resolverJwtSecret(config.get<string>('JWT_SECRET')),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRATION', '1h'),
          issuer: 'imestredigital',
          audience: 'imestredigital-api',
        },
      }),
    }),

    // Cache Redis
    CacheModule.register({
      isGlobal: true,
    }),

    // Health checks
    TerminusModule,

    // Banco de dados
    PrismaModule,
    CacheServiceModule,

    // Módulos de domínio
    EmailModule,
    PushModule,
    WebhookModule,
    NotificacaoModule,
    TemplateModule,
    KafkaModule,
  ],
  controllers: [HealthController],
  providers: [JwtStrategy],
})
export class AppModule implements NestModule {
  /**
   * Aplica o TenantMiddleware a todas as rotas da API, exceto endpoints
   * públicos (health e docs) — para não bloquear probes do Docker/Swagger.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'api/v1/health', method: RequestMethod.ALL },
        { path: 'api/v1/health/(.*)', method: RequestMethod.ALL },
        { path: 'api/docs', method: RequestMethod.ALL },
        { path: 'api/docs/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('api/*')
  }
}
