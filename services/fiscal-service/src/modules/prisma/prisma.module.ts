/**
 * Módulo Prisma
 * Fornece acesso ao banco de dados para todos os outros módulos.
 */

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
