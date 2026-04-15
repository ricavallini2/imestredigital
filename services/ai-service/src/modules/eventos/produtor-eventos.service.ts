/**
 * Produtor de Eventos Kafka
 *
 * Publica eventos gerados pelo AI Service
 */

import { Injectable, Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { kafkaConfig, TOPICOS_PUBLICADOS } from '../../config/kafka.config';

@Injectable()
export class ProdutorEventosService {
  private logger = new Logger('ProdutorEventosService');
  private kafka: Kafka;
  private produtor: any;

  constructor() {
    this.kafka = new Kafka(kafkaConfig);
    this.inicializar();
  }

  /**
   * Inicializa o produtor Kafka
   */
  private async inicializar() {
    try {
      this.produtor = this.kafka.producer({
        transactionTimeout: 30000,
        maxInFlightRequests: 5,
        idempotent: true,
      });

      await this.produtor.connect();
      this.logger.log('✓ Produtor Kafka conectado');
    } catch (erro) {
      this.logger.error(`Erro ao conectar produtor: ${erro.message}`);
    }
  }

  /**
   * Publica um insight gerado
   */
  async publicarInsightGerado(dados: {
    tenantId: string;
    insightId: string;
    tipo: string;
    titulo: string;
    prioridade: string;
    timestamp?: Date;
  }) {
    await this.publicarEvento(TOPICOS_PUBLICADOS.INSIGHT_GERADO, {
      tenantId: dados.tenantId,
      insightId: dados.insightId,
      tipo: dados.tipo,
      titulo: dados.titulo,
      prioridade: dados.prioridade,
      timestamp: dados.timestamp || new Date(),
    });
  }

  /**
   * Publica uma previsão calculada
   */
  async publicarPrevisaoCalculada(dados: {
    tenantId: string;
    produtoId: string;
    previsaoId: string;
    quantidadePrevista: number;
    confianca: number;
    timestamp?: Date;
  }) {
    await this.publicarEvento(TOPICOS_PUBLICADOS.PREVISAO_CALCULADA, {
      tenantId: dados.tenantId,
      produtoId: dados.produtoId,
      previsaoId: dados.previsaoId,
      quantidadePrevista: dados.quantidadePrevista,
      confianca: dados.confianca,
      timestamp: dados.timestamp || new Date(),
    });
  }

  /**
   * Publica uma sugestão criada
   */
  async publicarSugestaooCriada(dados: {
    tenantId: string;
    sugestaoId: string;
    tipo: string;
    confianca: number;
    timestamp?: Date;
  }) {
    await this.publicarEvento(TOPICOS_PUBLICADOS.SUGESTAO_CRIADA, {
      tenantId: dados.tenantId,
      sugestaoId: dados.sugestaoId,
      tipo: dados.tipo,
      confianca: dados.confianca,
      timestamp: dados.timestamp || new Date(),
    });
  }

  /**
   * Publica um evento genérico
   */
  private async publicarEvento(topico: string, dados: any) {
    try {
      if (!this.produtor) {
        this.logger.warn('Produtor não inicializado, tentando reconectar...');
        await this.inicializar();
      }

      await this.produtor.send({
        topic: topico,
        messages: [
          {
            key: dados.tenantId || 'default',
            value: JSON.stringify(dados),
            timestamp: Date.now().toString(),
          },
        ],
      });

      this.logger.debug(`Evento publicado em ${topico}`);
    } catch (erro) {
      this.logger.error(
        `Erro ao publicar evento em ${topico}: ${erro.message}`,
      );
    }
  }

  /**
   * Desconecta o produtor
   */
  async desconectar() {
    try {
      if (this.produtor) {
        await this.produtor.disconnect();
        this.logger.log('✓ Produtor Kafka desconectado');
      }
    } catch (erro) {
      this.logger.error(`Erro ao desconectar: ${erro.message}`);
    }
  }
}
