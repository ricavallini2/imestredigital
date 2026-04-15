/**
 * Módulo de Eventos.
 * Gerencia produção e consumo de eventos Kafka.
 */

import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ProdutorEventosService } from './produtor-eventos.service';
import { ConsumidorEventosController } from './consumidor-eventos.controller';
import { LancamentoModule } from '../lancamento/lancamento.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'financial-service',
              brokers: (config.get('KAFKA_BROKERS') || 'localhost:9092').split(','),
            },
            consumer: {
              groupId: config.get('KAFKA_GROUP_ID') || 'financial-service-group',
            },
          },
        }),
      },
    ]),
    forwardRef(() => LancamentoModule),
  ],
  providers: [ProdutorEventosService],
  controllers: [ConsumidorEventosController],
  exports: [ProdutorEventosService],
})
export class EventosModule {}
