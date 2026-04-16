/**
 * Módulo raiz do Customer Service (CRM)
 *
 * Registra todos os módulos de domínio e configura:
 * - Variáveis de ambiente
 * - JWT globalmente
 * - Prisma e Cache
 * - Middleware de tenant
 * - Integração Kafka
 */

import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaModule } from './modules/prisma/prisma.module';
import { CacheModule } from './modules/cache/cache.module';
import { TenantMiddleware } from './middleware/tenant.middleware';
import { HealthController } from './controllers/health.controller';

// Módulos de domínio
import { ClienteModule } from './modules/cliente/cliente.module';
import { EnderecoModule } from './modules/endereco/endereco.module';
import { ContatoModule } from './modules/contato/contato.module';
import { InteracaoModule } from './modules/interacao/interacao.module';
import { SegmentoModule } from './modules/segmento/segmento.module';
import { ImportacaoModule } from './modules/importacao/importacao.module';
import { KafkaModule } from './modules/kafka/kafka.module';

@Module({
  imports: [
    // ─── Variáveis de ambiente ──────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // ─── Passport (estratégias de autenticação) ─────────────
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // ─── JWT (configuração global) ──────────────────────────
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

    // ─── Health checks ──────────────────────────────────────
    TerminusModule,

    // ─── Infraestrutura (Banco, Cache, Kafka) ───────────────
    PrismaModule,
    CacheModule,
    KafkaModule,

    // ─── Módulos de domínio (CRM) ───────────────────────────
    ClienteModule,
    EnderecoModule,
    ContatoModule,
    InteracaoModule,
    SegmentoModule,
    ImportacaoModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  /**
   * Configura middleware global para extrair tenant do JWT.
   * Exclui endpoints públicos (health, docs) para não bloquear probes do Docker.
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
      .forRoutes('api/*');
  }
}
