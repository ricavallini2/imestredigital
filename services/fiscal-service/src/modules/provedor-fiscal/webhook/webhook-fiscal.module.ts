/**
 * WebhookFiscalModule — expõe o receiver de gatilhos do provedor fiscal.
 *
 * Fica separado do ProvedorFiscalModule porque depende do NotaFiscalService
 * (para aplicar o resultado do provedor à nota), enquanto o
 * ProvedorFiscalModule é consumido PELO NotaFiscalModule. Manter o webhook
 * num módulo próprio, que importa NotaFiscalModule, evita ciclo de
 * dependência entre módulos.
 */

import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { NotaFiscalModule } from '../../nota-fiscal/nota-fiscal.module';
import { WebhookFiscalController } from './webhook-fiscal.controller';
import { WebhookFiscalService } from './webhook-fiscal.service';

@Module({
  imports: [PrismaModule, NotaFiscalModule],
  controllers: [WebhookFiscalController],
  providers: [WebhookFiscalService],
})
export class WebhookFiscalModule {}
