import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlataformaMarketplace } from '../../../../generated/client';
import { IIntegracaoMarketplace } from './integracao-base.interface';
import { MercadoLivreAdapter } from './mercado-livre/mercado-livre.adapter';
import { ShopeeAdapter } from './shopee/shopee.adapter';
import { AmazonAdapter } from './amazon/amazon.adapter';
import { MagaluAdapter } from './magalu/magalu.adapter';
import { AmericanasAdapter } from './americanas/americanas.adapter';

/**
 * Factory para criar instâncias dos adapters corretos
 * Padrão Factory - centraliza a criação de objetos
 */
@Injectable()
export class IntegracaoFactory {
  private readonly logger = new Logger(IntegracaoFactory.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mercadoLivreAdapter: MercadoLivreAdapter,
    private readonly shopeeAdapter: ShopeeAdapter,
    private readonly amazonAdapter: AmazonAdapter,
    private readonly magaluAdapter: MagaluAdapter,
    private readonly americanasAdapter: AmericanasAdapter,
  ) {}

  /**
   * Cria adapter para o marketplace especificado
   * @throws BadRequestException se marketplace não for suportado
   */
  criar(marketplace: PlataformaMarketplace): IIntegracaoMarketplace {
    this.logger.debug(`Criando adapter para marketplace: ${marketplace}`);

    switch (marketplace) {
      case PlataformaMarketplace.MERCADO_LIVRE:
        return this.mercadoLivreAdapter;

      case PlataformaMarketplace.SHOPEE:
        return this.shopeeAdapter;

      case PlataformaMarketplace.AMAZON:
        return this.amazonAdapter;

      case PlataformaMarketplace.MAGALU:
        return this.magaluAdapter;

      case PlataformaMarketplace.AMERICANAS:
        return this.americanasAdapter;

      default:
        throw new BadRequestException(
          `Marketplace não suportado: ${marketplace}`,
        );
    }
  }

  /**
   * Lista todos os marketplaces suportados
   */
  obterMarketplacesSuportados(): string[] {
    return Object.values(PlataformaMarketplace);
  }

  /**
   * Verifica se um marketplace é suportado
   */
  eSuportado(marketplace: string): boolean {
    return Object.values(PlataformaMarketplace).includes(
      marketplace as PlataformaMarketplace,
    );
  }

  /**
   * Obtém nome amigável do marketplace
   */
  obterNomeAmigavel(marketplace: PlataformaMarketplace): string {
    const nomes: Record<PlataformaMarketplace, string> = {
      [PlataformaMarketplace.MERCADO_LIVRE]: 'Mercado Livre',
      [PlataformaMarketplace.SHOPEE]: 'Shopee',
      [PlataformaMarketplace.AMAZON]: 'Amazon',
      [PlataformaMarketplace.MAGALU]: 'Magalu',
      [PlataformaMarketplace.AMERICANAS]: 'Americanas',
    };

    return nomes[marketplace] || marketplace;
  }
}
