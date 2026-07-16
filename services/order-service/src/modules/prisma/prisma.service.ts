/**
 * Serviço do Prisma ORM.
 *
 * Gerencia conexão com PostgreSQL e lifecycle.
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '../../../generated/client';

/**
 * Cliente Prisma aceito por um repositório: o serviço normal OU o cliente
 * transacional entregue pelo `$transaction`. Permite que o mesmo método de
 * repositório participe (ou não) de uma transação sem duplicação de código.
 */
export type ClientePrisma = PrismaService | Prisma.TransactionClient;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
