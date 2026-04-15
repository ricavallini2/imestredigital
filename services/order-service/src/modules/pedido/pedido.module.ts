/**
 * Módulo de Pedidos.
 */

import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoRepository } from './pedido.repository';
import { PedidoController } from './pedido.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { EventosModule } from '../eventos/eventos.module';

@Module({
  imports: [PrismaModule, CacheModule, EventosModule],
  providers: [PedidoService, PedidoRepository],
  controllers: [PedidoController],
  exports: [PedidoService, PedidoRepository],
})
export class PedidoModule {}
