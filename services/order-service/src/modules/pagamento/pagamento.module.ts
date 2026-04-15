/**
 * Módulo de Pagamentos.
 */

import { Module, forwardRef } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { PagamentoRepository } from './pagamento.repository';
import { PagamentoController } from './pagamento.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { EventosModule } from '../eventos/eventos.module';

@Module({
  imports: [PrismaModule, CacheModule, forwardRef(() => EventosModule)],
  providers: [PagamentoService, PagamentoRepository],
  controllers: [PagamentoController],
  exports: [PagamentoService, PagamentoRepository],
})
export class PagamentoModule {}
