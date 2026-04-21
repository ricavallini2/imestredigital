import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Serviço de cache Redis
 * Gerencia cache de dados de marketplaces, tokens e sincronizações
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');

    if (redisUrl) {
      this.redis = new Redis(redisUrl, {
        retryStrategy: (times: number) => Math.min(times * 50, 2000),
      });
    } else {
      this.redis = new Redis({
        host: this.configService.get('REDIS_HOST') || 'localhost',
        port: this.configService.get('REDIS_PORT') || 6379,
        password: this.configService.get('REDIS_PASSWORD'),
        db: this.configService.get('REDIS_DB') || 0,
        retryStrategy: (times: number) => Math.min(times * 50, 2000),
      });
    }

    this.redis.on('connect', () => {
      this.logger.log('Conectado ao Redis');
    });

    this.redis.on('error', (erro) => {
      this.logger.error(`Erro Redis: ${erro.message}`);
    });
  }

  /**
   * Define um valor no cache com TTL opcional
   */
  async set(chave: string, valor: any, ttlSegundos?: number): Promise<void> {
    try {
      const valorSerialized = JSON.stringify(valor);

      if (ttlSegundos) {
        await this.redis.setex(chave, ttlSegundos, valorSerialized);
      } else {
        await this.redis.set(chave, valorSerialized);
      }

      this.logger.debug(`Cache set: ${chave}`);
    } catch (erro) {
      this.logger.error(`Erro ao set no cache: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Obtém um valor do cache
   */
  async get<T>(chave: string): Promise<T | null> {
    try {
      const valor = await this.redis.get(chave);

      if (!valor) {
        return null;
      }

      return JSON.parse(valor) as T;
    } catch (erro) {
      this.logger.error(`Erro ao get do cache: ${erro.message}`);
      return null;
    }
  }

  /**
   * Remove um valor do cache
   */
  async delete(chave: string): Promise<void> {
    try {
      await this.redis.del(chave);
      this.logger.debug(`Cache deleted: ${chave}`);
    } catch (erro) {
      this.logger.error(`Erro ao deletar do cache: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Limpa todas as chaves de um padrão
   */
  async deleteByPattern(padrao: string): Promise<void> {
    try {
      const chaves = await this.redis.keys(padrao);

      if (chaves.length > 0) {
        await this.redis.del(...chaves);
        this.logger.debug(`Cache pattern deleted: ${padrao} (${chaves.length} chaves)`);
      }
    } catch (erro) {
      this.logger.error(`Erro ao deletar padrão do cache: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Incrementa um valor no cache (para contadores)
   */
  async increment(chave: string, valor: number = 1): Promise<number> {
    try {
      return await this.redis.incrby(chave, valor);
    } catch (erro) {
      this.logger.error(`Erro ao incrementar cache: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Verifica se uma chave existe
   */
  async exists(chave: string): Promise<boolean> {
    try {
      const resultado = await this.redis.exists(chave);
      return resultado === 1;
    } catch (erro) {
      this.logger.error(`Erro ao verificar existência no cache: ${erro.message}`);
      return false;
    }
  }

  /**
   * Define TTL para uma chave existente
   */
  async setTTL(chave: string, ttlSegundos: number): Promise<void> {
    try {
      await this.redis.expire(chave, ttlSegundos);
      this.logger.debug(`Cache TTL set: ${chave} (${ttlSegundos}s)`);
    } catch (erro) {
      this.logger.error(`Erro ao set TTL no cache: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Desconecta do Redis
   */
  async disconnect(): Promise<void> {
    await this.redis.quit();
    this.logger.log('Desconectado do Redis');
  }

  // ========================================================================
  // HELPERS ESPECÍFICOS DO MARKETPLACE
  // ========================================================================

  /**
   * Cache para tokens de marketplaces
   */
  async setTokenMarketplace(
    tenantId: string,
    marketplaceId: string,
    token: string,
    ttlSegundos: number = 3600,
  ): Promise<void> {
    const chave = `marketplace:token:${tenantId}:${marketplaceId}`;
    await this.set(chave, token, ttlSegundos);
  }

  /**
   * Obtém token em cache
   */
  async getTokenMarketplace(
    tenantId: string,
    marketplaceId: string,
  ): Promise<string | null> {
    const chave = `marketplace:token:${tenantId}:${marketplaceId}`;
    return this.get<string>(chave);
  }

  /**
   * Cache para configurações de conta
   */
  async setConfiguracaoConta(
    contaId: string,
    configuracao: any,
    ttlSegundos: number = 7200,
  ): Promise<void> {
    const chave = `marketplace:conta:${contaId}`;
    await this.set(chave, configuracao, ttlSegundos);
  }

  /**
   * Obtém configuração de conta em cache
   */
  async getConfiguracaoConta(contaId: string): Promise<any | null> {
    const chave = `marketplace:conta:${contaId}`;
    return this.get(chave);
  }

  /**
   * Cache para métricas de anúncios
   */
  async setMetricasAnuncio(
    anuncioId: string,
    metricas: any,
    ttlSegundos: number = 1800,
  ): Promise<void> {
    const chave = `marketplace:anuncio:metricas:${anuncioId}`;
    await this.set(chave, metricas, ttlSegundos);
  }

  /**
   * Obtém métricas de anúncio em cache
   */
  async getMetricasAnuncio(anuncioId: string): Promise<any | null> {
    const chave = `marketplace:anuncio:metricas:${anuncioId}`;
    return this.get(chave);
  }

  /**
   * Cache para sincronização em progresso (lock)
   */
  async setSincronizacaoEmProgresso(
    tenantId: string,
    contaId: string,
    tipo: string,
  ): Promise<void> {
    const chave = `marketplace:sincronizacao:${tenantId}:${contaId}:${tipo}`;
    await this.set(chave, { inicioEm: new Date().toISOString() }, 1800); // 30 min TTL
  }

  /**
   * Verifica se sincronização está em progresso
   */
  async isSincronizacaoEmProgresso(
    tenantId: string,
    contaId: string,
    tipo: string,
  ): Promise<boolean> {
    const chave = `marketplace:sincronizacao:${tenantId}:${contaId}:${tipo}`;
    return this.exists(chave);
  }

  /**
   * Remove lock de sincronização
   */
  async removeSincronizacaoEmProgresso(
    tenantId: string,
    contaId: string,
    tipo: string,
  ): Promise<void> {
    const chave = `marketplace:sincronizacao:${tenantId}:${contaId}:${tipo}`;
    await this.delete(chave);
  }
}
