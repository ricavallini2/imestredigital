/**
 * Módulo de Relatórios Financeiros.
 * Endpoints /api/v1/financeiro/* consumidos pelo frontend
 * (fluxo-caixa, dre, resumo) montados a partir dos dados reais.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContaModule } from '../conta/conta.module';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosController } from './relatorios.controller';

@Module({
  imports: [PrismaModule, ContaModule],
  providers: [RelatoriosService],
  controllers: [RelatoriosController],
  exports: [RelatoriosService],
})
export class RelatoriosModule {}
