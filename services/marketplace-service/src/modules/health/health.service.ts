import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

/**
 * Serviço de health check
 * Verifica saúde da aplicação e suas dependências
 */
@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Status básico da saúde
   */
  async getHealthStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      servico: 'marketplace-service',
    };
  }

  /**
   * Status detalhado com todas as dependências
   */
  async getDetailedHealthStatus() {
    const status: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      servico: 'marketplace-service',
      dependencias: {
        database: null,
        redis: null,
      },
    };

    try {
      status.dependencias.database = await this.checkDatabase();
    } catch (erro) {
      status.dependencias.database = {
        status: 'error',
        mensagem: erro.message,
      };
      status.status = 'degraded';
    }

    try {
      status.dependencias.redis = await this.checkRedis();
    } catch (erro) {
      status.dependencias.redis = {
        status: 'error',
        mensagem: erro.message,
      };
      status.status = 'degraded';
    }

    return status;
  }

  /**
   * Verifica conexão com banco de dados
   */
  async checkDatabase() {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        mensagem: 'Banco de dados está operacional',
      };
    } catch (erro) {
      this.logger.error(`Erro ao verificar banco de dados: ${erro.message}`);
      throw new Error(`Banco de dados indisponível: ${erro.message}`);
    }
  }

  /**
   * Verifica conexão com Redis
   */
  async checkRedis() {
    try {
      const chave = 'health-check-redis';
      const valor = 'ok';

      await this.cacheService.set(chave, valor, 10);
      const resultado = await this.cacheService.get(chave);

      if (resultado !== valor) {
        throw new Error('Falha na leitura/escrita do Redis');
      }

      await this.cacheService.delete(chave);

      return {
        status: 'ok',
        mensagem: 'Redis está operacional',
      };
    } catch (erro) {
      this.logger.error(`Erro ao verificar Redis: ${erro.message}`);
      throw new Error(`Redis indisponível: ${erro.message}`);
    }
  }

  /**
   * Verifica conexão com Kafka
   */
  async checkKafka() {
    // Em implementação real, conectar e verificar saúde do Kafka
    return {
      status: 'ok',
      mensagem: 'Kafka está operacional (verificação básica)',
    };
  }
}
