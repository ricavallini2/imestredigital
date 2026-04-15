import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Serviço Prisma centralizado
 * Gerencia a instância do cliente Prisma e ciclo de vida
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  /**
   * Conecta ao banco de dados ao inicializar o módulo
   */
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado ao banco de dados com sucesso');
  }

  /**
   * Desconecta do banco de dados ao destruir o módulo
   */
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Desconectado do banco de dados');
  }
}
