/**
 * Serviço de Produtor Kafka.
 * Publica eventos de estoque para outros serviços consumirem.
 * Padrão: Mesmo do Catalog Service.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);
  private kafka: Kafka;
  private producer: Producer;

  constructor(private configService: ConfigService) {
    const brokers = (this.configService.get('KAFKA_BROKERS') || 'localhost:9092').split(',');
    this.kafka = new Kafka({
      clientId: 'inventory-service-producer',
      brokers,
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    this.logger.log('✓ Kafka Producer conectado');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    this.logger.log('✓ Kafka Producer desconectado');
  }

  /**
   * Publica evento no Kafka.
   * @param topico Nome do tópico
   * @param tenantId ID do tenant (usado como key para particionamento)
   * @param tipoEvento Tipo do evento (para logging)
   * @param dados Payload do evento
   */
  async publicar(topico: string, tenantId: string, tipoEvento: string, dados: any) {
    try {
      const evento = {
        tenantId,
        tipo: tipoEvento,
        dados,
        timestamp: new Date().toISOString(),
      };

      await this.producer.send({
        topic: topico,
        messages: [
          {
            key: tenantId,
            value: JSON.stringify(evento),
          },
        ],
      });

      this.logger.debug(`📤 Evento publicado: ${tipoEvento}`);
    } catch (error) {
      this.logger.error(`Erro ao publicar evento: ${tipoEvento}`, error);
      throw error;
    }
  }
}
