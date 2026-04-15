/**
 * Módulo de Fluxo de Caixa.
 * Geração e projeção de fluxo de caixa.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FluxoCaixaService } from './fluxo-caixa.service';
import { FluxoCaixaController } from './fluxo-caixa.controller';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [FluxoCaixaService],
  controllers: [FluxoCaixaController],
  exports: [FluxoCaixaService],
})
export class FluxoCaixaModule {}
