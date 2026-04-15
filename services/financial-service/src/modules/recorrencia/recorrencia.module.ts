/**
 * Módulo de Recorrências.
 * Lançamentos recorrentes automáticos.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RecorrenciaService } from './recorrencia.service';
import { RecorrenciaRepository } from './recorrencia.repository';
import { RecorrenciaController } from './recorrencia.controller';
import { LancamentoModule } from '../lancamento/lancamento.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, LancamentoModule, CacheModule],
  providers: [RecorrenciaService, RecorrenciaRepository],
  controllers: [RecorrenciaController],
  exports: [RecorrenciaService, RecorrenciaRepository],
})
export class RecorrenciaModule {}
