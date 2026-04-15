/**
 * Módulo de Cache - Redis
 *
 * Configura cache global para toda a aplicação.
 */

import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true,
      store: redisStore as any,
      // Configuração Redis
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0', 10),
      ttl: 300, // TTL padrão em segundos
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
