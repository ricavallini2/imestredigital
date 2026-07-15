/**
 * Módulo de Sugestões
 */

import { Module } from '@nestjs/common';
import { SugestaoController } from './sugestao.controller';
import { SugestaoService } from './sugestao.service';
import { SugestaoRepository } from './sugestao.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AssistenteModule } from '../assistente/assistente.module';
import { ProdutorEventosModule } from '../eventos/produtor-eventos.module';

@Module({
  imports: [PrismaModule, AssistenteModule, ProdutorEventosModule],
  controllers: [SugestaoController],
  providers: [SugestaoService, SugestaoRepository],
  exports: [SugestaoService],
})
export class SugestaoModule {}
