/**
 * Módulo do engine de tributos.
 *
 * Expõe o TributosService, que calcula os impostos por item a partir das
 * RegrasFiscais do tenant. Depende do RegraFiscalModule (que exporta o
 * RegraFiscalRepository).
 */

import { Module } from '@nestjs/common'
import { TributosService } from './tributos.service'
import { RegraFiscalModule } from '../regra-fiscal/regra-fiscal.module'

@Module({
  imports: [RegraFiscalModule],
  providers: [TributosService],
  exports: [TributosService],
})
export class TributosModule {}
