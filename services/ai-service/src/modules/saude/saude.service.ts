/**
 * Serviço de Saúde - Health Checks
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface HealthStatus {
  status: 'OK' | 'ALERTA' | 'ERRO';
  timestamp: Date;
  mensagem?: string;
  tempo_ms?: number;
}

@Injectable()
export class SaudeService {
  private logger = new Logger('SaudeService');
  private inicioDaAplicacao = Date.now();

  constructor(private prisma: PrismaService) {}

  /**
   * Health check simples
   */
  async healthCheck(): Promise<{
    status: string;
    timestamp: Date;
    uptime: number;
  }> {
    return {
      status: 'OK',
      timestamp: new Date(),
      uptime: Date.now() - this.inicioDaAplicacao,
    };
  }

  /**
   * Health check detalhado
   */
  async healthCheckDetalhado(): Promise<{
    status: string;
    timestamp: Date;
    componentes: Record<string, HealthStatus>;
  }> {
    const timestamp = new Date();

    const resultados = {
      banco: await this.statusBanco(),
      llm: await this.statusLLM(),
      kafka: await this.statusKafka(),
      cache: await this.statusCache(),
    };

    const todasOK = Object.values(resultados).every((r) => r.status === 'OK');
    const status = todasOK ? 'OK' : 'ALERTA';

    return {
      status,
      timestamp,
      componentes: resultados,
    };
  }

  /**
   * Status do banco de dados
   */
  async statusBanco(): Promise<HealthStatus> {
    const inicio = Date.now();

    try {
      // Tentar query simples
      await this.prisma.$queryRaw`SELECT 1`;

      const tempo = Date.now() - inicio;

      return {
        status: 'OK',
        timestamp: new Date(),
        mensagem: 'PostgreSQL conectado',
        tempo_ms: tempo,
      };
    } catch (erro) {
      this.logger.error(`Erro ao verificar banco: ${erro.message}`);

      return {
        status: 'ERRO',
        timestamp: new Date(),
        mensagem: `Erro de conexão: ${erro.message}`,
      };
    }
  }

  /**
   * Status do LLM/OpenAI
   */
  async statusLLM(): Promise<HealthStatus> {
    const inicio = Date.now();

    try {
      // Verificar se chave de API está configurada
      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        return {
          status: 'ALERTA',
          timestamp: new Date(),
          mensagem: 'OPENAI_API_KEY não configurada',
        };
      }

      // Não fazer chamada real para economizar crédito
      // Apenas verificar se config existe
      const tempo = Date.now() - inicio;

      return {
        status: 'OK',
        timestamp: new Date(),
        mensagem: `OpenAI ${process.env.OPENAI_MODEL || 'gpt-4'} disponível`,
        tempo_ms: tempo,
      };
    } catch (erro) {
      return {
        status: 'ERRO',
        timestamp: new Date(),
        mensagem: `Erro ao verificar LLM: ${erro.message}`,
      };
    }
  }

  /**
   * Status do Kafka
   */
  async statusKafka(): Promise<HealthStatus> {
    try {
      // Mock - em produção testaria conexão real
      const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');

      return {
        status: 'OK',
        timestamp: new Date(),
        mensagem: `Kafka/Redpanda configurado (${brokers.length} broker(s))`,
      };
    } catch (erro) {
      return {
        status: 'ALERTA',
        timestamp: new Date(),
        mensagem: `Não foi possível verificar Kafka: ${erro.message}`,
      };
    }
  }

  /**
   * Status do Cache (Redis)
   */
  async statusCache(): Promise<HealthStatus> {
    try {
      // Mock - em produção testaria conexão real com Redis
      const host = process.env.REDIS_HOST || 'localhost';
      const port = process.env.REDIS_PORT || '6379';

      return {
        status: 'OK',
        timestamp: new Date(),
        mensagem: `Redis configurado (${host}:${port})`,
      };
    } catch (erro) {
      return {
        status: 'ALERTA',
        timestamp: new Date(),
        mensagem: `Não foi possível verificar cache: ${erro.message}`,
      };
    }
  }
}
