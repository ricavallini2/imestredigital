/**
 * Serviço Prisma para o Customer Service.
 * Gerencia conexão com o banco customer_service.
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect().catch((err) => {
      console.warn('⚠️  PostgreSQL indisponível (modo dev):', err?.message ?? err);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
