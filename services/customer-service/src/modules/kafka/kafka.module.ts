/**
 * Módulo Kafka - Consumidor de Eventos
 *
 * Escuta eventos de outros serviços para sincronizar dados de clientes.
 */

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClienteConsumerService } from './cliente-consumer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'customer-service',
            brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
          },
          consumer: {
            groupId: 'customer-service-group',
          },
        },
      },
    ]),
  ],
  providers: [ClienteConsumerService],
  exports: [ClienteConsumerService],
})
export class KafkaModule {}
