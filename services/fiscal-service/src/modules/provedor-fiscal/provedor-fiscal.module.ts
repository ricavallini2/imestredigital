/**
 * ProvedorFiscalModule — provê o ProvedorFiscalPort (ADR-001).
 *
 * A implementação concreta é escolhida em tempo de boot por uma factory,
 * conforme a env `PROVEDOR_FISCAL`:
 * - `fake` (ou ausente): ProvedorFiscalFakeAdapter — default em dev/testes,
 *   sem conta em provedor real.
 * - `focusnfe`: FocusNFeAdapter — transmissão real via API Focus NFe v2.
 *
 * Exporta o token `PROVEDOR_FISCAL_PORT` para injeção no nota-fiscal.service.
 * Ambos os adapters são registrados como providers para que a factory possa
 * resolvê-los; apenas o token é exportado (o serviço não conhece o adapter
 * concreto).
 */

import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PROVEDOR_FISCAL_PORT } from './provedor-fiscal.port';
import { FocusNFeAdapter } from './focus-nfe/focus-nfe.adapter';
import { ProvedorFiscalFakeAdapter } from './fake/provedor-fiscal-fake.adapter';

/** Valores aceitos na env PROVEDOR_FISCAL. */
type ProvedorSelecionado = 'fake' | 'focusnfe';

/** Resolve, com fallback seguro, qual provedor usar a partir da env. */
function resolverProvedorSelecionado(config: ConfigService): ProvedorSelecionado {
  const bruto = (config.get<string>('PROVEDOR_FISCAL') ?? 'fake').trim().toLowerCase();
  return bruto === 'focusnfe' ? 'focusnfe' : 'fake';
}

@Module({
  providers: [
    FocusNFeAdapter,
    ProvedorFiscalFakeAdapter,
    {
      provide: PROVEDOR_FISCAL_PORT,
      inject: [ConfigService, FocusNFeAdapter, ProvedorFiscalFakeAdapter],
      useFactory: (
        config: ConfigService,
        focus: FocusNFeAdapter,
        fake: ProvedorFiscalFakeAdapter,
      ) => {
        const selecionado = resolverProvedorSelecionado(config);
        const logger = new Logger('ProvedorFiscalModule');
        logger.log(`Provedor fiscal de transmissão selecionado: ${selecionado}`);
        return selecionado === 'focusnfe' ? focus : fake;
      },
    },
  ],
  exports: [PROVEDOR_FISCAL_PORT],
})
export class ProvedorFiscalModule {}
