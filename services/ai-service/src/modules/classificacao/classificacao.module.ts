/**
 * Módulo de Classificação Fiscal
 */

import { Module } from '@nestjs/common';
import { ClassificacaoController } from './classificacao.controller';
import { ClassificacaoService } from './classificacao.service';
import { AssistenteModule } from '../assistente/assistente.module';

@Module({
  imports: [AssistenteModule],
  controllers: [ClassificacaoController],
  providers: [ClassificacaoService],
  exports: [ClassificacaoService],
})
export class ClassificacaoModule {}
