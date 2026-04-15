/**
 * ═══════════════════════════════════════════════════════════════
 * Cache Service - Redis
 * ═══════════════════════════════════════════════════════════════
 *
 * Gerencia cache distribuído (Redis) para:
 * - Pedidos frequentes (últimos 30 dias)
 * - Contadores de status (para dashboard)
 * - Sessões de checkout (temporary)
 * - Resultados de cálculos de frete
 */

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      db: parseInt(process.env.REDIS_DB || '0'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
  }

  /**
   * Obter valor do cache
   */
  async get(chave: string): Promise<string | null> {
    return this.redis.get(chave);
  }

  /**
   * Obter valor parseado como JSON
   */
  async getJson<T>(chave: string): Promise<T | null> {
    const valor = await this.redis.get(chave);
    if (!valor) {
      return null;
    }
    return JSON.parse(valor) as T;
  }

  /**
   * Setar valor com TTL (em segundos)
   */
  async set(chave: string, valor: string, ttlSegundos?: number): Promise<void> {
    if (ttlSegundos) {
      await this.redis.setex(chave, ttlSegundos, valor);
    } else {
      await this.redis.set(chave, valor);
    }
  }

  /**
   * Setar valor JSON com TTL
   */
  async setJson(chave: string, valor: any, ttlSegundos?: number): Promise<void> {
    await this.set(chave, JSON.stringify(valor), ttlSegundos);
  }

  /**
   * Deletar chave
   */
  async delete(chave: string): Promise<void> {
    await this.redis.del(chave);
  }

  /**
   * Deletar múltiplas chaves
   */
  async deleteMultiple(chaves: string[]): Promise<void> {
    if (chaves.length === 0) return;
    await this.redis.del(...chaves);
  }

  /**
   * Limpar cache por padrão (ex: pedido:tenant-id:*)
   */
  async deleteByPattern(padrao: string): Promise<void> {
    const chaves = await this.redis.keys(padrao);
    if (chaves.length > 0) {
      await this.redis.del(...chaves);
    }
  }

  /**
   * Verificar existência
   */
  async exists(chave: string): Promise<boolean> {
    const existe = await this.redis.exists(chave);
    return existe === 1;
  }

  /**
   * Incrementar contador
   */
  async increment(chave: string, quantidade: number = 1): Promise<number> {
    return this.redis.incrby(chave, quantidade);
  }

  /**
   * Decrementar contador
   */
  async decrement(chave: string, quantidade: number = 1): Promise<number> {
    return this.redis.decrby(chave, quantidade);
  }

  /**
   * Obter todas as chaves com padrão
   */
  async getKeys(padrao: string): Promise<string[]> {
    return this.redis.keys(padrao);
  }

  /**
   * Usar SCAN para grandes datasets (mais eficiente que KEYS)
   */
  async scanKeys(padrao: string, cursor: number = 0): Promise<{
    cursor: number;
    chaves: string[];
  }> {
    const resultado = await this.redis.scan(cursor, 'MATCH', padrao, 'COUNT', 100);
    return {
      cursor: parseInt(resultado[0]),
      chaves: resultado[1] as string[],
    };
  }
}
