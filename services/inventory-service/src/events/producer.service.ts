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
   * Publica evento no Kafka com ENVELOPE { tenantId, tipo, dados, timestamp }.
   *
   * Usado para eventos internos de alerta/observabilidade do próprio estoque
   * (estoque baixo/zerado, transferência, saldo atualizado), cujo consumidor
   * (quando houver) espera ler de `evento.dados.*` — mesmo padrão do catalog.
   *
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

      this.logger.debug(`📤 Evento publicado (envelope): ${tipoEvento}`);
    } catch (error) {
      this.logger.error(`Erro ao publicar evento: ${tipoEvento}`, error);
      throw error;
    }
  }

  /**
   * Publica evento no Kafka com payload PLANO (sem wrapper `.dados`).
   *
   * Contrato canônico da SAGA de pedidos: os eventos de estoque
   * (estoque.reservado | estoque.insuficiente | estoque.liberado) são
   * consumidos pelo order-service via `@EventPattern` do @nestjs/microservices,
   * que lê os campos direto da raiz do payload (ex. `dados.pedidoId`,
   * `dados.itensReservados`). Portanto NÃO usamos envelope aqui.
   *
   * O `tenantId` continua sendo a key de particionamento (ordenação por tenant).
   *
   * @param topico   Nome do tópico (ex. 'estoque.reservado')
   * @param tenantId ID do tenant (também vai no corpo e como key)
   * @param payload  Campos planos do evento (pedidoId, itens, etc.)
   */
  async publicarPlano(
    topico: string,
    tenantId: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    try {
      const evento = {
        tenantId,
        timestamp: new Date().toISOString(),
        ...payload,
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

      this.logger.debug(`📤 Evento publicado (plano): ${topico}`);
    } catch (error) {
      this.logger.error(`Erro ao publicar evento plano: ${topico}`, error);
      throw error;
    }
  }
}
