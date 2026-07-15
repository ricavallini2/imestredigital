/**
 * Módulo raiz do Financial Service.
 *
 * Registra os módulos de contas, lançamentos, categorias,
 * recorrências, fluxo de caixa, DRE e conciliação bancária.
 * Configura globalmente cache, Kafka e banco de dados.
 */

import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { PrismaModule } from './modules/prisma/prisma.module';
import { ContaModule } from './modules/conta/conta.module';
import { LancamentoModule } from './modules/lancamento/lancamento.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { RecorrenciaModule } from './modules/recorrencia/recorrencia.module';
import { FluxoCaixaModule } from './modules/fluxo-caixa/fluxo-caixa.module';
import { DreModule } from './modules/dre/dre.module';
import { ConciliacaoModule } from './modules/conciliacao/conciliacao.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { RelatoriosModule } from './modules/relatorios/relatorios.module';
import { HealthController } from './controllers/health.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TenantMiddleware } from './middlewares/tenant.middleware';

/**
 * Resolve o segredo JWT aplicando a política de fail-fast (Fase 0):
 * em produção o segredo é obrigatório; em desenvolvimento permite um
 * default explícito com aviso no log. Nunca usa fallback silencioso.
 */
function resolverJwtSecret(config: ConfigService): string {
  const secret = config.get<string>('JWT_SECRET');
  if (secret) return secret;

  if (config.get<string>('NODE_ENV') === 'production') {
    throw new Error(
      'JWT_SECRET é obrigatório em produção. Configure a variável de ambiente.',
    );
  }

  new Logger('AppModule').warn(
    'JWT_SECRET não definido — usando segredo de desenvolvimento. NÃO use em produção.',
  );
  return 'dev-secret-financial-local';
}

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
        secret: resolverJwtSecret(config),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRATION', '1h'),
          issuer: 'imestredigital',
          audience: 'imestredigital-api',
        },
      }),
    }),

    // Redis Cache
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService): any => ({
        store: redisStore,
        host: config.get('REDIS_HOST', 'localhost'),
        port: config.get('REDIS_PORT', 6379),
        password: config.get('REDIS_PASSWORD'),
        db: config.get('REDIS_DB', 1),
        ttl: 3600, // 1 hora de TTL padrão
      }),
    }),

    // Health checks
    TerminusModule,

    // Banco de dados
    PrismaModule,

    // Módulos de domínio
    ContaModule,
    LancamentoModule,
    CategoriaModule,
    RecorrenciaModule,
    FluxoCaixaModule,
    DreModule,
    ConciliacaoModule,
    EventosModule,
    RelatoriosModule,
  ],
  controllers: [HealthController],
  providers: [JwtStrategy],
})
export class AppModule implements NestModule {
  /**
   * Aplica o TenantMiddleware a todas as rotas de negócio,
   * excluindo health checks e documentação (rotas públicas).
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'api/v1/health', method: RequestMethod.ALL },
        { path: 'api/v1/health/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('api/v1/*');
  }
}
