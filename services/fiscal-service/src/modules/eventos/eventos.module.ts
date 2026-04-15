/**
 * Módulo de Eventos
 * Orquestra produção e consumo de eventos via Kafka.
 */

import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProdutorEventosService } from '../../events/produtor-eventos.service';
import { ConsumidorEventosController } from '../../events/consumidor-eventos.controller';
import { NotaFiscalModule } from '../nota-fiscal/nota-fiscal.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'fiscal-service-producer',
            brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
          },
          producer: {
            idempotent: true,
          },
        },
      },
    ]),
    forwardRef(() => NotaFiscalModule),
  ],
  providers: [ProdutorEventosService],
  controllers: [ConsumidorEventosController],
  exports: [ProdutorEventosService],
})
export class EventosModule {}
