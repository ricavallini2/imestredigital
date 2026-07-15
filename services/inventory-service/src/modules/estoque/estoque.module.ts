/**
 * Módulo de Estoque.
 * Encapsula saldo, reservas e alertas de estoque.
 */

import { Module } from '@nestjs/common';

import { EstoqueController } from './estoque.controller';
import { EstoqueService } from './estoque.service';
import { EstoqueRepository } from './estoque.repository';
import { CatalogClient } from './catalog.client';
import { ProducerService } from '../../events/producer.service';
import { ConsumerController } from '../../events/consumer.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EstoqueController, ConsumerController],
  providers: [EstoqueService, EstoqueRepository, CatalogClient, ProducerService],
  exports: [EstoqueService],
})
export class EstoqueModule {}
