/**
 * Serviço de Cache com Redis.
 *
 * Fornece métodos para armazenar, recuperar e deletar dados em cache.
 * Usado para cache de templates, preferências de usuários e histórico recente.
 */

import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Obtém valor do cache.
   */
  async obter<T>(chave: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(chave);
  }

  /**
   * Armazena valor no cache com TTL opcional (em segundos).
   */
  async armazenar<T>(chave: string, valor: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(chave, valor, ttl ? ttl * 1000 : undefined);
  }

  /**
   * Remove valor do cache.
   */
  async remover(chave: string): Promise<void> {
    await this.cacheManager.del(chave);
  }

  /**
   * Limpa todo o cache.
   */
  async limpar(): Promise<void> {
    await this.cacheManager.reset();
  }

  /**
   * Verifica se chave existe no cache.
   */
  async existe(chave: string): Promise<boolean> {
    const valor = await this.cacheManager.get(chave);
    return valor !== undefined && valor !== null;
  }
}
