import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CriptoToken } from '../../common/cripto-token'

/**
 * Token de injeção do serviço de criptografia de tokens de marketplace.
 */
export const CRIPTO_TOKEN = 'CRIPTO_TOKEN'

/**
 * Módulo global de criptografia.
 *
 * Provê uma instância única de `CriptoToken` (chave resolvida de
 * MARKETPLACE_CRYPTO_KEY no bootstrap) para todo o serviço. Global para que
 * qualquer módulo (conta, sincronização, webhook) possa injetar via CRIPTO_TOKEN
 * sem reimportar.
 */
@Global()
@Module({
  providers: [
    {
      provide: CRIPTO_TOKEN,
      useFactory: (config: ConfigService) =>
        new CriptoToken(config.get<string>('MARKETPLACE_CRYPTO_KEY')),
      inject: [ConfigService],
    },
  ],
  exports: [CRIPTO_TOKEN],
})
export class CriptoModule {}
