/**
 * Serviço de Cache utilizando Redis.
 * Fornece métodos para get, set, delete, etc.
 */

import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Obtém valor do cache.
   */
  async obter<T>(chave: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(chave);
    } catch {
      return undefined;
    }
  }

  /**
   * Define valor no cache com TTL opcional.
   */
  async definir<T>(chave: string, valor: T, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.cacheManager.set(chave, valor, ttl * 1000);
      } else {
        await this.cacheManager.set(chave, valor);
      }
    } catch { /* Redis indisponível */ }
  }

  /**
   * Remove valor do cache.
   */
  async remover(chave: string): Promise<void> {
    try {
      await this.cacheManager.del(chave);
    } catch { /* Redis indisponível */ }
  }

  /**
   * Limpa todo o cache.
   */
  async limpar(): Promise<void> {
    try {
      await this.cacheManager.reset();
    } catch { /* Redis indisponível */ }
  }

  /**
   * Obtém ou calcula um valor (lazy loading).
   */
  async obterOuCalcular<T>(
    chave: string,
    calculador: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cacheado = await this.obter<T>(chave);
    if (cacheado) return cacheado;

    const valor = await calculador();
    await this.definir(chave, valor, ttl);
    return valor;
  }
}
