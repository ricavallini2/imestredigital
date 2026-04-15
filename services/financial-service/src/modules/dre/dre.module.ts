/**
 * Módulo de DRE.
 * Demonstração de Resultado do Exercício.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DreService } from './dre.service';
import { DreController } from './dre.controller';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [DreService],
  controllers: [DreController],
  exports: [DreService],
})
export class DreModule {}
