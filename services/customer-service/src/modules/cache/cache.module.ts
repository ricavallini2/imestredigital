/**
 * Módulo de Cache
 *
 * Configura cache global para toda a aplicação.
 *
 * Observação: usamos o store em memória padrão que acompanha o
 * `cache-manager` v5 para evitar a incompatibilidade do antigo
 * `cache-manager-redis-store` (que tinha como alvo o cache-manager v4
 * e gerava erros do tipo `store.del is not a function`).
 *
 * Quando o serviço escalar horizontalmente, basta trocar o store
 * por um adapter Keyv compatível (ex.: `@keyv/redis`).
 */

import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true,
      ttl: 300_000, // TTL padrão em milissegundos (5 min)
      max: 5_000, // limite de chaves em memória
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
