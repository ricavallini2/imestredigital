/**
 * Módulo raiz do Notification Service.
 *
 * Registra todos os módulos: Prisma, Cache, Email, Push, Webhook,
 * Notificação, Template e Kafka Consumer.
 * Configura JWT globalmente para toda a aplicação.
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';
import { CacheModule } from '@nestjs/cache-manager';

import { PrismaModule } from './modules/prisma/prisma.module';
import { CacheServiceModule } from './modules/cache/cache.module';
import { EmailModule } from './modules/email/email.module';
import { PushModule } from './modules/push/push.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { NotificacaoModule } from './modules/notificacao/notificacao.module';
import { TemplateModule } from './modules/template/template.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    // Variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Passport (estratégias de autenticação)
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT (configuração global)
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'dev-secret-trocar-em-producao'),
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
})
export class AppModule {}
