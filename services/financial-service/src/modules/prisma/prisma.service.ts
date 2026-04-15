/**
 * Serviço de Prisma para gerenciar a conexão com o banco de dados.
 * Implementa OnModuleInit e OnModuleDestroy para ciclo de vida.
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../../../generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Banco de dados conectado com sucesso');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Banco de dados desconectado');
  }
}
