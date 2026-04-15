/**
 * Módulo de Interações com Cliente
 */

import { Module } from '@nestjs/common';
import { InteracaoService } from './interacao.service';
import { InteracaoController } from './interacao.controller';

@Module({
  controllers: [InteracaoController],
  providers: [InteracaoService],
  exports: [InteracaoService],
})
export class InteracaoModule {}
