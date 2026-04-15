/**
 * Módulo de Previsão de Demanda
 */

import { Module } from '@nestjs/common';
import { PrevisaoController } from './previsao.controller';
import { PrevisaoService } from './previsao.service';
import { PrevisaoRepository } from './previsao.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PrevisaoController],
  providers: [PrevisaoService, PrevisaoRepository],
  exports: [PrevisaoService],
})
export class PrevisaoModule {}
