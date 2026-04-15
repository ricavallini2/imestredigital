import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Módulo Prisma
 * Expõe o serviço Prisma globalmente
 */
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
