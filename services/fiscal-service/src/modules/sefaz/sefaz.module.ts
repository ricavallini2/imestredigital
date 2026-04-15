/**
 * Módulo SEFAZ
 * Agrupa serviços de comunicação com a SEFAZ, geração de XML e assinatura digital.
 */

import { Module } from '@nestjs/common';
import { SefazService } from './sefaz.service';
import { XmlBuilderService } from './xml-builder.service';
import { AssinaturaService } from './assinatura.service';

@Module({
  providers: [SefazService, XmlBuilderService, AssinaturaService],
  exports: [SefazService, XmlBuilderService, AssinaturaService],
})
export class SefazModule {}
