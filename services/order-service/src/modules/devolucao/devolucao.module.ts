/**
 * Módulo de Devoluções.
 */

import { Module } from '@nestjs/common';
import { DevolucaoService } from './devolucao.service';
import { DevolucaoRepository } from './devolucao.repository';
import { DevolucaoController } from './devolucao.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { EventosModule } from '../eventos/eventos.module';
import { PedidoModule } from '../pedido/pedido.module';

@Module({
  imports: [PrismaModule, CacheModule, EventosModule, PedidoModule],
  providers: [DevolucaoService, DevolucaoRepository],
  controllers: [DevolucaoController],
  exports: [DevolucaoService, DevolucaoRepository],
})
export class DevolucaoModule {}
