import { PlataformaMarketplace } from '../../../generated/client'

/**
 * Taxa de plataforma padrão por marketplace (percentual, ex.: 13 = 13%).
 *
 * Fonte de fallback quando a conta não tem taxa explícita em `configuracoes`.
 * Valores aproximados de mercado — a UI usa isto para exibir a taxa e derivar
 * a receita líquida (bruto − taxa). A reconciliação com a taxa real cobrada
 * pelo canal fica para quando o financeiro/marketplace persistir a comissão
 * efetiva por pedido.
 */
export const TAXA_PLATAFORMA_PADRAO: Record<PlataformaMarketplace, number> = {
  MERCADO_LIVRE: 13,
  SHOPEE: 20,
  AMAZON: 15,
  MAGALU: 16,
  AMERICANAS: 16,
  SHOPIFY: 2,
  SHEIN: 16,
  NUVEMSHOP: 2,
  WOOCOMMERCE: 0,
}

/**
 * Rótulo amigável (pt-BR) por plataforma, usado quando a conta não tem `nome`.
 */
export const NOME_PLATAFORMA: Record<PlataformaMarketplace, string> = {
  MERCADO_LIVRE: 'Mercado Livre',
  SHOPEE: 'Shopee',
  AMAZON: 'Amazon',
  MAGALU: 'Magalu',
  AMERICANAS: 'Americanas',
  SHOPIFY: 'Shopify',
  SHEIN: 'SHEIN',
  NUVEMSHOP: 'Nuvemshop',
  WOOCOMMERCE: 'WooCommerce',
}
