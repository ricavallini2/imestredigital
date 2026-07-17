/**
 * Módulo de Cobrança.
 * Títulos derivados de recebíveis vencidos + ações/acordos/régua.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CobrancaService } from './cobranca.service';
import { CobrancaController } from './cobranca.controller';

@Module({
  imports: [PrismaModule],
  providers: [CobrancaService],
  controllers: [CobrancaController],
  exports: [CobrancaService],
})
export class CobrancaModule {}
