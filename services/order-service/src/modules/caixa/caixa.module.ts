/**
 * Módulo do Caixa (sessão de PDV / balcão).
 *
 * Exporta o CaixaService porque o PagamentoModule o consome para lançar a
 * VENDA na sessão aberta dentro da mesma transação do pagamento.
 */

import { Module } from '@nestjs/common';
import { CaixaService } from './caixa.service';
import { CaixaRepository } from './caixa.repository';
import { CaixaController } from './caixa.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CaixaService, CaixaRepository],
  controllers: [CaixaController],
  exports: [CaixaService],
})
export class CaixaModule {}
