/**
 * Módulo Kafka do Order Service.
 * Configura cliente Kafka para publicação e consumo de eventos de pedidos.
 * Utiliza o padrão @nestjs/microservices ClientKafka.
 */

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka-producer.service';
import { PedidoConsumerService } from './pedido-consumer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order-service-producer',
            brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
          },
          producer: {
            idempotent: true,
          },
        },
      },
    ]),
  ],
  providers: [KafkaProducerService, PedidoConsumerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
