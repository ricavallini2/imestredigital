/**
 * Módulo do Prisma ORM.
 * Fornece o PrismaService como singleton global para todo o serviço.
 */

import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
