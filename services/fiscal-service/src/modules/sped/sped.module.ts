/**
 * Módulo SPED
 * Agrupa serviços de geração de arquivos SPED Fiscal e Contribuições.
 */

import { Module } from '@nestjs/common';
import { SpedService } from './sped.service';
import { SpedController } from './sped.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [SpedController],
  providers: [SpedService],
  exports: [SpedService],
})
export class SpedModule {}
