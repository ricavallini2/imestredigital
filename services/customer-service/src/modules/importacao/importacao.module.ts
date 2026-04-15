/**
 * Módulo de Importação de Clientes
 */

import { Module } from '@nestjs/common';
import { ImportacaoService } from './importacao.service';
import { ImportacaoController } from './importacao.controller';

@Module({
  controllers: [ImportacaoController],
  providers: [ImportacaoService],
  exports: [ImportacaoService],
})
export class ImportacaoModule {}
