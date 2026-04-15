/**
 * Módulo de Eventos (Kafka)
 */

import { Module } from '@nestjs/common';
import { ProdutorEventosService } from './produtor-eventos.service';
import { ConsumidorEventosService } from './consumidor-eventos.service';
import { InsightsModule } from '../insights/insights.module';
import { PrevisaoModule } from '../previsao/previsao.module';

@Module({
  imports: [InsightsModule, PrevisaoModule],
  providers: [ProdutorEventosService, ConsumidorEventosService],
  exports: [ProdutorEventosService],
})
export class EventosModule {}
