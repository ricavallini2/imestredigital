/**
 * Módulo de Pagamentos.
 */

import { Module, forwardRef } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { PagamentoRepository } from './pagamento.repository';
import { PagamentoController } from './pagamento.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { CaixaModule } from '../caixa/caixa.module';
import { EventosModule } from '../eventos/eventos.module';

@Module({
  // CaixaModule: o pagamento aprovado de balcão vira movimentação de VENDA na
  // sessão aberta, dentro da mesma transação (ver PagamentoService).
  imports: [PrismaModule, CacheModule, CaixaModule, forwardRef(() => EventosModule)],
  providers: [PagamentoService, PagamentoRepository],
  controllers: [PagamentoController],
  exports: [PagamentoService, PagamentoRepository],
})
export class PagamentoModule {}
