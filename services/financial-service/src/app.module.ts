/**
 * Módulo raiz do Financial Service.
 *
 * Registra os módulos de contas, lançamentos, categorias,
 * recorrências, fluxo de caixa, DRE e conciliação bancária.
 * Configura globalmente cache, Kafka e banco de dados.
 */

import { Module } from '@nestjs/common';
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
import { HealthController } from './controllers/health.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

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
  ],
  controllers: [HealthController],
  providers: [JwtStrategy],
})
export class AppModule {}
