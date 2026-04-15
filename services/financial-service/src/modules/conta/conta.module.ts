/**
 * Módulo de Contas Financeiras.
 * Gerencia contas bancárias e financeiras.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContaService } from './conta.service';
import { ContaRepository } from './conta.repository';
import { ContaController } from './conta.controller';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [ContaService, ContaRepository],
  controllers: [ContaController],
  exports: [ContaService, ContaRepository],
})
export class ContaModule {}
