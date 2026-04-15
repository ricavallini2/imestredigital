/**
 * Serviço do Prisma ORM.
 *
 * Gerencia a conexão com o banco de dados PostgreSQL.
 * Implementa os hooks de ciclo de vida do NestJS para
 * conectar/desconectar automaticamente.
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }

  /** Conecta ao banco quando o módulo é inicializado */
  async onModuleInit() {
    await this.$connect();
  }

  /** Desconecta quando o módulo é destruído (shutdown graceful) */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
