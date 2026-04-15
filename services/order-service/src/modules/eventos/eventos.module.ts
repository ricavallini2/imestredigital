/**
 * Módulo de Eventos (Kafka).
 * Importa KafkaModule para gerenciar integração com Kafka.
 */

import { Module, forwardRef } from '@nestjs/common';
import { ConsumidorEventosController } from './consumidor-eventos.controller';
import { PedidoModule } from '../pedido/pedido.module';
import { PagamentoModule } from '../pagamento/pagamento.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [
    KafkaModule,
    forwardRef(() => PedidoModule),
    forwardRef(() => PagamentoModule),
  ],
  controllers: [ConsumidorEventosController],
  exports: [KafkaModule],
})
export class EventosModule {}
