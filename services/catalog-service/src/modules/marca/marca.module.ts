/**
 * Módulo de Marcas.
 *
 * Inclui:
 * - Controller REST com autenticação (api/v1/marcas)
 * - Service com lógica de negócio, Kafka e cache
 * - Repository com queries isoladas por tenant
 */

import { Module } from '@nestjs/common'

import { MarcaController } from './marca.controller'
import { MarcaService } from './marca.service'
import { MarcaRepository } from './marca.repository'
import { ProducerService } from '../../events/producer.service'
import { CacheConfigModule } from '../cache/cache.module'

@Module({
  imports: [CacheConfigModule],
  controllers: [MarcaController],
  providers: [MarcaService, MarcaRepository, ProducerService],
  exports: [MarcaService],
})
export class MarcaModule {}
