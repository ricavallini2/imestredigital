/**
 * Módulo de Cache Redis.
 *
 * Configura o cache distribuído usando Redis.
 * Usado para:
 * - Cache de produtos frequentemente acessados
 * - Cache de categorias (mudam raramente)
 * - Rate limiting de APIs
 */

import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CacheService } from './cache.service';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: 'memory', // Em produção: trocar por 'redis'
        // TODO: Configurar redis quando cache-manager-redis-yet estiver disponível
        // store: redisStore,
        // host: config.get('REDIS_HOST', 'localhost'),
        // port: config.get('REDIS_PORT', 6379),
        ttl: 300, // 5 minutos de cache padrão (em segundos)
        max: 1000, // Máximo de itens no cache
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, NestCacheModule],
})
export class CacheConfigModule {}
