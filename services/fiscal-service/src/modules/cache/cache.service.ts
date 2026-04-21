/**
 * Cache Service
 * Gerencia cache distribuído com Redis.
 */

import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger('CacheService');
  private redis: Redis;

  constructor() {
    // Prioridade: REDIS_HOST explícito (evita problemas de parsing de URL com
    // senhas que contêm caracteres especiais como / e =)
    const redisHost = process.env.REDIS_HOST;
    const redisUrl = process.env.REDIS_URL;

    let host = 'localhost';
    let port = 6379;
    let password: string | undefined;

    if (redisHost) {
      host = redisHost;
      port = parseInt(process.env.REDIS_PORT || '6379');
      password = process.env.REDIS_PASSWORD;
    } else if (redisUrl) {
      // Parseia manualmente para suportar senhas com chars especiais (/, =, @)
      const m = redisUrl.match(/^redis[s]?:\/\/(?::([^@]*)@)?([^:]+)(?::(\d+))?/);
      if (m) {
        password = m[1] || undefined;
        host = m[2] || 'redis';
        port = parseInt(m[3] || '6379');
      }
    }

    this.redis = new Redis({
      host,
      port,
      password,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.redis.on('error', (erro) => {
      this.logger.error('Erro de conexão com Redis:', erro);
    });

    this.redis.on('connect', () => {
      this.logger.log('Conectado ao Redis');
    });
  }

  /**
   * Obtém um valor do cache.
   */
  async obter<T>(chave: string): Promise<T | null> {
    try {
      const valor = await this.redis.get(chave);
      return valor ? JSON.parse(valor) : null;
    } catch (erro) {
      this.logger.error(`Erro ao obter cache ${chave}:`, erro);
      return null;
    }
  }

  /**
   * Armazena um valor no cache com TTL opcional.
   */
  async armazenar(chave: string, valor: any, ttlSegundos?: number): Promise<void> {
    try {
      const valorizador = JSON.stringify(valor);
      if (ttlSegundos) {
        await this.redis.setex(chave, ttlSegundos, valorizador);
      } else {
        await this.redis.set(chave, valorizador);
      }
    } catch (erro) {
      this.logger.error(`Erro ao armazenar cache ${chave}:`, erro);
    }
  }

  /**
   * Remove uma chave do cache.
   */
  async remover(chave: string): Promise<void> {
    try {
      await this.redis.del(chave);
    } catch (erro) {
      this.logger.error(`Erro ao remover cache ${chave}:`, erro);
    }
  }

  /**
   * Limpa todo o cache.
   */
  async limpar(): Promise<void> {
    try {
      await this.redis.flushdb();
    } catch (erro) {
      this.logger.error('Erro ao limpar cache:', erro);
    }
  }

  /**
   * Fecha a conexão com Redis.
   */
  async fechar(): Promise<void> {
    await this.redis.quit();
  }
}
