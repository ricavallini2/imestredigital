/**
 * Serviço de Cache.
 *
 * Abstrai as operações de cache para uso nos services.
 * Implementa padrões como cache-aside e invalidação seletiva.
 */

import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Busca valor no cache.
   * @param chave - Chave do cache
   * @returns Valor armazenado ou undefined
   */
  async obter<T>(chave: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(chave);
  }

  /**
   * Armazena valor no cache.
   * @param chave - Chave do cache
   * @param valor - Valor a ser armazenado
   * @param ttl - Tempo de vida em segundos (opcional)
   */
  async definir<T>(chave: string, valor: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(chave, valor, ttl);
  }

  /**
   * Remove uma chave específica do cache.
   * Usado quando um recurso é atualizado/deletado.
   */
  async invalidar(chave: string): Promise<void> {
    await this.cacheManager.del(chave);
  }

  /**
   * Padrão cache-aside: busca no cache, se não encontrar
   * executa a função e armazena o resultado.
   *
   * @param chave - Chave do cache
   * @param fn - Função que busca o dado original
   * @param ttl - Tempo de vida em segundos
   */
  async obterOuCarregar<T>(
    chave: string,
    fn: () => Promise<T>,
    ttl: number = 300,
  ): Promise<T> {
    // Tenta buscar do cache
    const cacheado = await this.obter<T>(chave);
    if (cacheado !== undefined && cacheado !== null) {
      return cacheado;
    }

    // Não está no cache — busca da fonte original
    const resultado = await fn();

    // Armazena no cache para próximas consultas
    if (resultado !== null && resultado !== undefined) {
      await this.definir(chave, resultado, ttl);
    }

    return resultado;
  }

  /**
   * Gera chave de cache padronizada para o tenant.
   * Formato: tenant:{tenantId}:{recurso}:{id}
   *
   * @example gerarChave('uuid-tenant', 'produto', 'uuid-produto')
   * // => 'tenant:uuid-tenant:produto:uuid-produto'
   */
  gerarChave(tenantId: string, recurso: string, id?: string): string {
    const partes = ['tenant', tenantId, recurso];
    if (id) partes.push(id);
    return partes.join(':');
  }
}
