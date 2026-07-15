import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlataformaMarketplace } from '../../../generated/client';
import { IIntegracaoMarketplace } from './integracao-base.interface';
import { MercadoLivreAdapter } from './mercado-livre/mercado-livre.adapter';
import { ShopeeAdapter } from './shopee/shopee.adapter';
import { AmazonAdapter } from './amazon/amazon.adapter';
import { MagaluAdapter } from './magalu/magalu.adapter';
import { AmericanasAdapter } from './americanas/americanas.adapter';

/**
 * Factory para criar instâncias dos adapters corretos.
 *
 * IMPORTANTE (multi-tenancy): cada chamada retorna uma instância NOVA do adapter.
 * Os adapters guardam estado de credencial (accessToken/shopId) por instância;
 * reutilizar um singleton vazaria o token de um tenant para outro. Instanciar
 * a cada chamada mantém o adapter isolado por requisição/conta.
 *
 * O ConfigService injetado carrega apenas credenciais de aplicação (client id/secret),
 * que são compartilhadas com segurança entre tenants.
 */
@Injectable()
export class IntegracaoFactory {
  private readonly logger = new Logger(IntegracaoFactory.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Cria uma instância nova do adapter para o marketplace especificado.
   * @throws BadRequestException se o marketplace não for suportado.
   */
  criar(marketplace: PlataformaMarketplace): IIntegracaoMarketplace {
    this.logger.debug(`Criando adapter para marketplace: ${marketplace}`);

    switch (marketplace) {
      case PlataformaMarketplace.MERCADO_LIVRE:
        return new MercadoLivreAdapter(this.configService);

      case PlataformaMarketplace.SHOPEE:
        return new ShopeeAdapter(this.configService);

      case PlataformaMarketplace.AMAZON:
        return new AmazonAdapter(this.configService);

      case PlataformaMarketplace.MAGALU:
        return new MagaluAdapter(this.configService);

      case PlataformaMarketplace.AMERICANAS:
        return new AmericanasAdapter(this.configService);

      // Plataformas cadastradas no enum mas ainda sem adapter dedicado (Fase 3).
      case PlataformaMarketplace.SHOPIFY:
      case PlataformaMarketplace.SHEIN:
      case PlataformaMarketplace.NUVEMSHOP:
      case PlataformaMarketplace.WOOCOMMERCE:
        throw new BadRequestException(
          `Integração com ${marketplace} ainda não implementada`,
        );

      default:
        throw new BadRequestException(
          `Marketplace não suportado: ${marketplace}`,
        );
    }
  }

  /**
   * Lista todos os marketplaces com adapter disponível.
   */
  obterMarketplacesSuportados(): PlataformaMarketplace[] {
    return [
      PlataformaMarketplace.MERCADO_LIVRE,
      PlataformaMarketplace.SHOPEE,
      PlataformaMarketplace.AMAZON,
      PlataformaMarketplace.MAGALU,
      PlataformaMarketplace.AMERICANAS,
    ];
  }

  /**
   * Verifica se um marketplace possui adapter disponível.
   */
  eSuportado(marketplace: string): boolean {
    return this.obterMarketplacesSuportados().includes(
      marketplace as PlataformaMarketplace,
    );
  }

  /**
   * Obtém nome amigável do marketplace.
   */
  obterNomeAmigavel(marketplace: PlataformaMarketplace): string {
    const nomes: Record<PlataformaMarketplace, string> = {
      [PlataformaMarketplace.MERCADO_LIVRE]: 'Mercado Livre',
      [PlataformaMarketplace.SHOPEE]: 'Shopee',
      [PlataformaMarketplace.AMAZON]: 'Amazon',
      [PlataformaMarketplace.MAGALU]: 'Magalu',
      [PlataformaMarketplace.AMERICANAS]: 'Americanas',
      [PlataformaMarketplace.SHOPIFY]: 'Shopify',
      [PlataformaMarketplace.SHEIN]: 'Shein',
      [PlataformaMarketplace.NUVEMSHOP]: 'Nuvemshop',
      [PlataformaMarketplace.WOOCOMMERCE]: 'WooCommerce',
    };

    return nomes[marketplace] || marketplace;
  }
}
