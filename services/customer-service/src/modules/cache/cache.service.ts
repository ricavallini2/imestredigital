/**
 * Serviço de Cache utilizando Redis
 *
 * Centraliza operações de cache para melhor performance
 * em listas, buscas e dados frequentes.
 */

import { Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Obtém valor do cache
   *
   * @param chave - Chave do cache
   * @returns Valor armazenado ou null
   */
  async obter<T>(chave: string): Promise<T | null> {
    try {
      const valor = await this.cacheManager.get<T>(chave);
      return valor || null;
    } catch (erro) {
      this.logger.warn(`Erro ao obter cache ${chave}:`, erro.message);
      return null;
    }
  }

  /**
   * Define valor no cache
   *
   * @param chave - Chave do cache
   * @param valor - Valor a armazenar
   * @param ttl - Tempo de vida em segundos (padrão: 5 minutos)
   */
  async definir<T>(chave: string, valor: T, ttl: number = 300): Promise<void> {
    try {
      await this.cacheManager.set(chave, valor, ttl * 1000);
    } catch (erro) {
      this.logger.warn(`Erro ao definir cache ${chave}:`, erro.message);
    }
  }

  /**
   * Remove valor do cache
   *
   * @param chave - Chave do cache
   */
  async remover(chave: string): Promise<void> {
    try {
      await this.cacheManager.del(chave);
    } catch (erro) {
      this.logger.warn(`Erro ao remover cache ${chave}:`, erro.message);
    }
  }

  /**
   * Remove múltiplas chaves do cache
   *
   * @param chaves - Array de chaves
   */
  async removerMultiplos(chaves: string[]): Promise<void> {
    try {
      await Promise.all(chaves.map(chave => this.cacheManager.del(chave)));
    } catch (erro) {
      this.logger.warn('Erro ao remover múltiplos caches:', erro.message);
    }
  }

  /**
   * Limpa todo o cache
   */
  async limpar(): Promise<void> {
    try {
      await this.cacheManager.reset();
    } catch (erro) {
      this.logger.warn('Erro ao limpar cache:', erro.message);
    }
  }
}
