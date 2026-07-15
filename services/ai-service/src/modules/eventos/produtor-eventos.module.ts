/**
 * Módulo do Produtor de Eventos (Kafka)
 *
 * Isola o ProdutorEventosService para que módulos de domínio
 * (Insights, Sugestão, Previsão) possam publicar eventos sem criar
 * dependência circular com o EventosModule (que também consome eventos).
 */

import { Module } from '@nestjs/common';
import { ProdutorEventosService } from './produtor-eventos.service';

@Module({
  providers: [ProdutorEventosService],
  exports: [ProdutorEventosService],
})
export class ProdutorEventosModule {}
