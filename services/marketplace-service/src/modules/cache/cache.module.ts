import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

/**
 * Módulo de cache
 * Fornece serviço de cache Redis para toda aplicação
 */
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
