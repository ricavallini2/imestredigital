import { Module } from '@nestjs/common';
import { PerguntaService } from './pergunta.service';
import { PerguntaRepository } from './pergunta.repository';
import { PerguntaController } from './pergunta.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventosModule } from '../eventos/eventos.module';
import { IntegracaoModule } from '../integracao/integracao.module';
import { ContaMarketplaceModule } from '../conta-marketplace/conta-marketplace.module';

/**
 * Módulo de perguntas
 */
@Module({
  imports: [
    PrismaModule,
    EventosModule,
    IntegracaoModule,
    ContaMarketplaceModule,
  ],
  controllers: [PerguntaController],
  providers: [PerguntaService, PerguntaRepository],
  exports: [PerguntaService, PerguntaRepository],
})
export class PerguntaModule {}
