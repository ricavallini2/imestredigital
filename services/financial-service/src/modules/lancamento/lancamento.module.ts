/**
 * Módulo de Lançamentos.
 * Gerencia contas a pagar/receber.
 */

import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LancamentoService } from './lancamento.service';
import { LancamentoRepository } from './lancamento.repository';
import { LancamentoController } from './lancamento.controller';
import { ContaModule } from '../conta/conta.module';
import { CacheModule } from '../cache/cache.module';
import { EventosModule } from '../eventos/eventos.module';

@Module({
  imports: [PrismaModule, ContaModule, CacheModule, forwardRef(() => EventosModule)],
  providers: [LancamentoService, LancamentoRepository],
  controllers: [LancamentoController],
  exports: [LancamentoService, LancamentoRepository],
})
export class LancamentoModule {}
