/**
 * Módulo de Compras (pedidos de compra, recebimento e importação de NF-e).
 */

import { Module } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EstoqueModule } from '../estoque/estoque.module';

@Module({
  imports: [PrismaModule, EstoqueModule],
  providers: [ComprasService],
  controllers: [ComprasController],
  exports: [ComprasService],
})
export class ComprasModule {}
