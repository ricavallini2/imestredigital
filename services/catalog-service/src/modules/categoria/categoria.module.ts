/**
 * Módulo de Categorias.
 *
 * Inclui:
 * - Controller REST com autenticação (api/v1/categorias)
 * - Service com lógica de hierarquia, Kafka e cache
 * - Repository com queries isoladas por tenant
 */

import { Module } from '@nestjs/common'

import { CategoriaController } from './categoria.controller'
import { CategoriaService } from './categoria.service'
import { CategoriaRepository } from './categoria.repository'
import { ProducerService } from '../../events/producer.service'
import { CacheConfigModule } from '../cache/cache.module'

@Module({
  imports: [CacheConfigModule],
  controllers: [CategoriaController],
  providers: [CategoriaService, CategoriaRepository, ProducerService],
  exports: [CategoriaService],
})
export class CategoriaModule {}
