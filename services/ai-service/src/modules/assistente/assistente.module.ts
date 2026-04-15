/**
 * Módulo Assistente - Agrupa controller, service e providers
 */

import { Module } from '@nestjs/common';
import { AssistenteController } from './assistente.controller';
import { AssistenteService } from './assistente.service';
import { AssistenteRepository } from './assistente.repository';
import { LLMService } from './llm.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AssistenteController],
  providers: [AssistenteService, AssistenteRepository, LLMService],
  exports: [AssistenteService, LLMService],
})
export class AssistenteModule {}
