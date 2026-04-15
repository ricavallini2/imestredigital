/**
 * Módulo de Movimentações (histórico de estoque).
 * Registra todas as operações de entrada, saída, ajuste e transferência.
 */

import { Module } from '@nestjs/common';
import { MovimentacaoController } from './movimentacao.controller';
import { MovimentacaoService } from './movimentacao.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MovimentacaoController],
  providers: [MovimentacaoService],
})
export class MovimentacaoModule {}
