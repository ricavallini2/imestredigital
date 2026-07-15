/**
 * Módulo de Eventos (Kafka)
 *
 * Agrega o consumidor de eventos. O produtor vive em ProdutorEventosModule
 * (isolado para evitar dependência circular com os módulos de domínio).
 */

import { Module } from '@nestjs/common';
import { ConsumidorEventosService } from './consumidor-eventos.service';
import { ProdutorEventosModule } from './produtor-eventos.module';
import { InsightsModule } from '../insights/insights.module';
import { PrevisaoModule } from '../previsao/previsao.module';

@Module({
  imports: [ProdutorEventosModule, InsightsModule, PrevisaoModule],
  providers: [ConsumidorEventosService],
})
export class EventosModule {}
