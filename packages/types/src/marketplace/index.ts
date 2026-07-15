/**
 * Tipos do domínio de integração com Marketplaces.
 * Define conexões, listagens e sincronização.
 */

import { BaseEntity, EntityId } from '../common';

/**
 * Marketplaces suportados.
 * UPPERCASE_SNAKE — espelha o enum PlataformaMarketplace do schema Prisma
 * (services/marketplace-service). Fonte da verdade: Prisma.
 */
export enum MarketplaceSuportado {
  MERCADO_LIVRE = 'MERCADO_LIVRE',
  SHOPEE = 'SHOPEE',
  AMAZON = 'AMAZON',
  MAGALU = 'MAGALU',
  AMERICANAS = 'AMERICANAS',
  SHOPIFY = 'SHOPIFY',
  SHEIN = 'SHEIN',
  NUVEMSHOP = 'NUVEMSHOP',
  WOOCOMMERCE = 'WOOCOMMERCE',
}

/**
 * Status da conexão com o marketplace.
 * UPPERCASE — espelha o enum StatusConexao do schema Prisma.
 */
export enum StatusConexao {
  ATIVA = 'ATIVA',
  INATIVA = 'INATIVA',
  PENDENTE = 'PENDENTE',
  ERRO = 'ERRO',
  RECONECTANDO = 'RECONECTANDO',
  EXPIRANDO = 'EXPIRANDO',
}

/** Conexão do tenant com um marketplace */
export interface ConexaoMarketplace extends BaseEntity {
  tenantId: EntityId;
  marketplace: MarketplaceSuportado;
  status: StatusConexao;
  sellerId: string;
  sellerNome: string;
  accessToken?: string;   // Armazenado criptografado
  refreshToken?: string;  // Armazenado criptografado
  tokenExpiraEm?: Date;
  ultimaSincronizacao?: Date;
  configuracoes: ConfiguracaoMarketplace;
}

/** Configurações específicas por marketplace */
export interface ConfiguracaoMarketplace {
  sincronizarEstoque: boolean;
  sincronizarPrecos: boolean;
  sincronizarPedidos: boolean;
  importarPerguntas: boolean;
  respostaAutomatica: boolean;
  depositoPadraoId?: EntityId;
  margemAdicional?: number; // Percentual adicional sobre preço base
}

/** Anúncio de produto em um marketplace */
export interface AnuncioMarketplace extends BaseEntity {
  tenantId: EntityId;
  produtoId: EntityId;
  variacaoId?: EntityId;
  conexaoId: EntityId;
  marketplace: MarketplaceSuportado;
  anuncioExternoId: string;
  titulo: string;
  url?: string;
  status: StatusAnuncio;
  preco: number;
  estoque: number;
  ultimaSincronizacao?: Date;
}

/**
 * Status do anúncio no marketplace.
 * UPPERCASE — espelha o enum StatusAnuncio do schema Prisma.
 */
export enum StatusAnuncio {
  ATIVO = 'ATIVO',
  PAUSADO = 'PAUSADO',
  REMOVIDO = 'REMOVIDO',
  PENDENTE = 'PENDENTE',
  ENCERRADO = 'ENCERRADO',
  ERRO = 'ERRO',
}
