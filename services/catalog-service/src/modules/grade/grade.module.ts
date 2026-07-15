/**
 * Módulo de Grades de Tamanhos.
 *
 * Inclui:
 * - Controller REST com autenticação (api/v1/grades)
 * - Service com regras de negócio (nome único, normalização de tamanhos) e cache
 * - Repository com queries isoladas por tenant e substituição inteligente
 *
 * Exporta GradeService para reuso pelo módulo de produtos (geração de matriz
 * de variações a partir de uma grade).
 */

import { Module } from '@nestjs/common'

import { GradeController } from './grade.controller'
import { GradeService } from './grade.service'
import { GradeRepository } from './grade.repository'
import { CacheConfigModule } from '../cache/cache.module'

@Module({
  imports: [CacheConfigModule],
  controllers: [GradeController],
  providers: [GradeService, GradeRepository],
  exports: [GradeService, GradeRepository],
})
export class GradeModule {}
