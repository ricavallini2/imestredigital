/**
 * Módulo do cadastro de Formas de Pagamento.
 */

import { Module } from '@nestjs/common';
import { FormaPagamentoService } from './forma-pagamento.service';
import { FormaPagamentoRepository } from './forma-pagamento.repository';
import { FormaPagamentoController } from './forma-pagamento.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FormaPagamentoService, FormaPagamentoRepository],
  controllers: [FormaPagamentoController],
  exports: [FormaPagamentoService],
})
export class FormaPagamentoModule {}
