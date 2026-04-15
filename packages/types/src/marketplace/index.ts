/**
 * Tipos do domínio de integração com Marketplaces.
 * Define conexões, listagens e sincronização.
 */

import { BaseEntity, EntityId } from '../common';

/** Marketplaces suportados */
export enum MarketplaceSuportado {
  MERCADO_LIVRE = 'mercado_livre',
  SHOPEE = 'shopee',
  AMAZON = 'amazon',
  MAGALU = 'magalu',
  AMERICANAS = 'americanas',
  SHEIN = 'shein',
  SHOPIFY = 'shopify',
  NUVEMSHOP = 'nuvemshop',
  WOOCOMMERCE = 'woocommerce',
}

/** Status da conexão com o marketplace */
export enum StatusConexao {
  ATIVA = 'ativa',
  INATIVA = 'inativa',
  ERRO = 'erro',
  RECONECTANDO = 'reconectando',
  EXPIRANDO = 'expirando',
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

/** Status do anúncio no marketplace */
export enum StatusAnuncio {
  ATIVO = 'ativo',
  PAUSADO = 'pausado',
  ENCERRADO = 'encerrado',
  PENDENTE = 'pendente',
  ERRO = 'erro',
}
