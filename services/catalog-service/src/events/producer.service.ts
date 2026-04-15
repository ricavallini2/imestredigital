/**
 * Serviço de produção de eventos no Kafka.
 *
 * Publica eventos de domínio do catálogo para que outros
 * microserviços (estoque, marketplace, fiscal) possam reagir.
 *
 * Padrão de evento:
 * {
 *   eventId: UUID único do evento
 *   tipo: Nome do evento (ex: 'catalogo.produto.criado')
 *   tenantId: ID do tenant que originou o evento
 *   timestamp: Data/hora ISO do evento
 *   dados: Payload específico do evento
 * }
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

import { kafkaConfig } from '../config/kafka.config';

/** Estrutura padrão de um evento de domínio */
export interface EventoDominio<T = any> {
  eventId: string;
  tipo: string;
  tenantId: string;
  timestamp: string;
  dados: T;
}

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
    });
    this.producer = this.kafka.producer();
  }

  /** Conecta ao Kafka quando o módulo inicia */
  async onModuleInit() {
    try {
      await this.producer.connect();
      console.log('📡 Kafka Producer conectado (catalog-service)');
    } catch (erro) {
      console.error('❌ Falha ao conectar Kafka Producer:', erro);
    }
  }

  /** Desconecta quando o módulo é destruído */
  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  /**
   * Publica um evento de domínio no Kafka.
   *
   * @param topico - Nome do tópico Kafka
   * @param tenantId - ID do tenant que originou o evento
   * @param tipo - Tipo do evento (ex: 'catalogo.produto.criado')
   * @param dados - Payload do evento
   */
  async publicar<T>(topico: string, tenantId: string, tipo: string, dados: T): Promise<void> {
    const evento: EventoDominio<T> = {
      eventId: uuidv4(),
      tipo,
      tenantId,
      timestamp: new Date().toISOString(),
      dados,
    };

    await this.producer.send({
      topic: topico,
      messages: [
        {
          // Usa tenantId como chave para garantir ordenação por tenant
          key: tenantId,
          value: JSON.stringify(evento),
          headers: {
            'event-type': tipo,
            'tenant-id': tenantId,
            'correlation-id': evento.eventId,
          },
        },
      ],
    });

    console.log(`📤 Evento publicado: ${tipo} [tenant: ${tenantId}]`);
  }
}
