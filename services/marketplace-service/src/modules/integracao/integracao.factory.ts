import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TipoMarketplace } from '@prisma/client';
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
  criar(marketplace: TipoMarketplace): IIntegracaoMarketplace {
    this.logger.debug(`Criando adapter para marketplace: ${marketplace}`);

    switch (marketplace) {
      case TipoMarketplace.MERCADO_LIVRE:
        return this.mercadoLivreAdapter;

      case TipoMarketplace.SHOPEE:
        return this.shopeeAdapter;

      case TipoMarketplace.AMAZON:
        return this.amazonAdapter;

      case TipoMarketplace.MAGALU:
        return this.magaluAdapter;

      case TipoMarketplace.AMERICANAS:
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
    return Object.values(TipoMarketplace);
  }

  /**
   * Verifica se um marketplace é suportado
   */
  eSuportado(marketplace: string): boolean {
    return Object.values(TipoMarketplace).includes(
      marketplace as TipoMarketplace,
    );
  }

  /**
   * Obtém nome amigável do marketplace
   */
  obterNomeAmigavel(marketplace: TipoMarketplace): string {
    const nomes: Record<TipoMarketplace, string> = {
      [TipoMarketplace.MERCADO_LIVRE]: 'Mercado Livre',
      [TipoMarketplace.SHOPEE]: 'Shopee',
      [TipoMarketplace.AMAZON]: 'Amazon',
      [TipoMarketplace.MAGALU]: 'Magalu',
      [TipoMarketplace.AMERICANAS]: 'Americanas',
    };

    return nomes[marketplace] || marketplace;
  }
}
