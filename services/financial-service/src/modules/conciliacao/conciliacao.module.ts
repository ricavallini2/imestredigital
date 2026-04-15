/**
 * Módulo de Conciliação Bancária.
 * Reconciliação de saldos com extrato.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContaModule } from '../conta/conta.module';
import { ConciliacaoService } from './conciliacao.service';
import { ConciliacaoRepository } from './conciliacao.repository';
import { ConciliacaoController } from './conciliacao.controller';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, ContaModule, CacheModule],
  providers: [ConciliacaoService, ConciliacaoRepository],
  controllers: [ConciliacaoController],
  exports: [ConciliacaoService, ConciliacaoRepository],
})
export class ConciliacaoModule {}
