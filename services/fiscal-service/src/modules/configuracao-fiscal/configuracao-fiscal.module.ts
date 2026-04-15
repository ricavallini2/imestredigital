/**
 * Módulo de Configuração Fiscal
 */

import { Module } from '@nestjs/common';
import { ConfiguracaoFiscalService } from './configuracao-fiscal.service';
import { ConfiguracaoFiscalController } from './configuracao-fiscal.controller';
import { ConfiguracaoFiscalRepository } from './configuracao-fiscal.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { SefazModule } from '../sefaz/sefaz.module';

@Module({
  imports: [PrismaModule, SefazModule],
  providers: [ConfiguracaoFiscalService, ConfiguracaoFiscalRepository],
  controllers: [ConfiguracaoFiscalController],
  exports: [ConfiguracaoFiscalService, ConfiguracaoFiscalRepository],
})
export class ConfiguracaoFiscalModule {}
