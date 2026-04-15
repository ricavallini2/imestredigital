/**
 * Módulo de Regra Fiscal
 */

import { Module } from '@nestjs/common';
import { RegraFiscalService } from './regra-fiscal.service';
import { RegraFiscalController } from './regra-fiscal.controller';
import { RegraFiscalRepository } from './regra-fiscal.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [RegraFiscalService, RegraFiscalRepository],
  controllers: [RegraFiscalController],
  exports: [RegraFiscalService, RegraFiscalRepository],
})
export class RegraFiscalModule {}
