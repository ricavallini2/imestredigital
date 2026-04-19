/**
 * Prisma Service
 * Orquestra a conexão com o banco de dados PostgreSQL.
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../../../generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  /**
   * Conecta ao banco de dados quando o módulo é inicializado.
   */
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conectado ao banco de dados PostgreSQL');
    } catch (erro) {
      this.logger.error('Erro ao conectar ao banco de dados', erro);
      throw erro;
    }
  }

  /**
   * Desconecta do banco de dados quando o módulo é destruído.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
