/**
 * Serviço Prisma - Gerenciador de conexão com banco de dados
 *
 * Centraliza toda a interação com o banco via ORM Prisma
 */

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger('PrismaService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✓ Conectado ao banco de dados PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('✓ Desconectado do banco de dados');
  }
}
