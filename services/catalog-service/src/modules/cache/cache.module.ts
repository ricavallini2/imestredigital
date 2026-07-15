/**
 * Módulo de Cache.
 *
 * Fornece o `CacheService` (Redis via ioredis, com fallback em memória)
 * para toda a aplicação. Usado para:
 * - Cache de produtos frequentemente acessados
 * - Cache de listagens (invalidado em create/update/delete)
 *
 * A conexão é resolvida a partir do ambiente (REDIS_HOST/REDIS_PORT/
 * REDIS_PASSWORD ou REDIS_URL) pelo próprio CacheService. O ConfigModule
 * é global (registrado no AppModule), portanto não precisa ser reimportado.
 */

import { Global, Module } from '@nestjs/common'

import { CacheService } from './cache.service'

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheConfigModule {}
