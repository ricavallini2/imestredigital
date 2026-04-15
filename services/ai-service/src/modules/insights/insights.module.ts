/**
 * Módulo de Insights
 */

import { Module } from '@nestjs/common';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { InsightsRepository } from './insights.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AssistenteModule } from '../assistente/assistente.module';

@Module({
  imports: [PrismaModule, AssistenteModule],
  controllers: [InsightsController],
  providers: [InsightsService, InsightsRepository],
  exports: [InsightsService],
})
export class InsightsModule {}
