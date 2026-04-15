/**
 * Módulo de Saúde
 */

import { Module } from '@nestjs/common';
import { SaudeController } from './saude.controller';
import { SaudeService } from './saude.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SaudeController],
  providers: [SaudeService],
})
export class SaudeModule {}
