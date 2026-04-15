import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ProdutorEventosService } from './produtor-eventos.service';

/**
 * Módulo de eventos Kafka
 * Configura a comunicação assíncrona com outros serviços
 */
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: (configService: ConfigService) => {
          const kafkaBrokers = (
            configService.get('KAFKA_BROKERS') || 'localhost:9092'
          ).split(',');

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: kafkaBrokers,
                clientId:
                  configService.get('KAFKA_CLIENT_ID') ||
                  'marketplace-service',
              },
              consumer: {
                groupId:
                  configService.get('KAFKA_GROUP_ID') ||
                  'marketplace-service-group',
                allowAutoTopicCreation: true,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [ProdutorEventosService],
  exports: [ProdutorEventosService],
})
export class EventosModule {}
