import { Module } from '@nestjs/common';
import { IntegracaoFactory } from './integracao.factory';
import { MercadoLivreAdapter } from './mercado-livre/mercado-livre.adapter';
import { ShopeeAdapter } from './shopee/shopee.adapter';
import { AmazonAdapter } from './amazon/amazon.adapter';
import { MagaluAdapter } from './magalu/magalu.adapter';
import { AmericanasAdapter } from './americanas/americanas.adapter';

/**
 * Módulo de integração com marketplaces
 * Fornece factory para instanciar adapters corretos
 */
@Module({
  providers: [
    IntegracaoFactory,
    MercadoLivreAdapter,
    ShopeeAdapter,
    AmazonAdapter,
    MagaluAdapter,
    AmericanasAdapter,
  ],
  exports: [
    IntegracaoFactory,
    MercadoLivreAdapter,
    ShopeeAdapter,
    AmazonAdapter,
    MagaluAdapter,
    AmericanasAdapter,
  ],
})
export class IntegracaoModule {}
