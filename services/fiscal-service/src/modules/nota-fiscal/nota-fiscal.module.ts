/**
 * Módulo de Nota Fiscal
 */

import { Module, forwardRef } from '@nestjs/common';
import { NotaFiscalService } from './nota-fiscal.service';
import { NotaFiscalController } from './nota-fiscal.controller';
import { NotaFiscalRepository } from './nota-fiscal.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { SefazModule } from '../sefaz/sefaz.module';
import { ConfiguracaoFiscalModule } from '../configuracao-fiscal/configuracao-fiscal.module';
import { RegraFiscalModule } from '../regra-fiscal/regra-fiscal.module';
import { EventosModule } from '../eventos/eventos.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule,
    SefazModule,
    ConfiguracaoFiscalModule,
    RegraFiscalModule,
    forwardRef(() => EventosModule),
  ],
  providers: [NotaFiscalService, NotaFiscalRepository],
  controllers: [NotaFiscalController],
  exports: [NotaFiscalService],
})
export class NotaFiscalModule {}
