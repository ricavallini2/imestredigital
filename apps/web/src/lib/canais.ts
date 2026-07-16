/**
 * Canais de venda — rótulo, cor e emoji em UM lugar só.
 *
 * A chave é o `canalOrigem` do order-service, que é `String?` LIVRE no schema
 * (NÃO o enum `OrigemPedido`) — quem grava é quem cria o pedido. Hoje convivem:
 *
 *  - `BALCAO` — o PDV desta aplicação (`pedidos.service.ts → criar`);
 *  - `SITE`, `MERCADOLIVRE`, `SHOPEE`, `AMAZON`, `MAGALU` — documentados no
 *    schema/DTO e gravados pelo seed e pelos consumidores de marketplace;
 *  - os valores de `OrigemPedido` (`LOJA_FISICA`, `ECOMMERCE`, `MARKETPLACE`,
 *    `TELEFONE`, `WHATSAPP`, `MANUAL`, `OUTRO`), que aparecem quando a
 *    integração copia `origem` para `canalOrigem`;
 *  - `OUTROS` — fallback de `canalOrigem` nulo (`pedidos.service.ts`).
 *
 * Canal desconhecido não é inventado nem escondido: cai no cinza neutro com o
 * próprio código legível, para a tela não afirmar uma origem que não conhece.
 */

export interface CanalInfo {
  label: string;
  /** Hex — os gráficos (Recharts) pintam via `fill`/`background`, não por classe. */
  cor: string;
  emoji: string;
}

const CANAIS: Record<string, CanalInfo> = {
  // Presencial
  BALCAO: { label: 'Balcão', cor: '#6366f1', emoji: '🏪' },
  LOJA_FISICA: { label: 'Loja Física', cor: '#6366f1', emoji: '🏪' },

  // Venda assistida
  INTERNA: { label: 'Interna', cor: '#0ea5e9', emoji: '💼' },
  MANUAL: { label: 'Manual', cor: '#0ea5e9', emoji: '💼' },
  TELEFONE: { label: 'Telefone', cor: '#06b6d4', emoji: '☎️' },
  WHATSAPP: { label: 'WhatsApp', cor: '#10b981', emoji: '💬' },

  // Loja própria online
  ECOMMERCE: { label: 'E-commerce', cor: '#22c55e', emoji: '🛒' },
  SITE: { label: 'Site', cor: '#22c55e', emoji: '🌐' },
  SHOPIFY: { label: 'Shopify', cor: '#84cc16', emoji: '🛍️' },

  // Marketplaces
  MARKETPLACE: { label: 'Marketplace', cor: '#a855f7', emoji: '🏬' },
  MERCADOLIVRE: { label: 'Mercado Livre', cor: '#f59e0b', emoji: '🟡' },
  MERCADO_LIVRE: { label: 'Mercado Livre', cor: '#f59e0b', emoji: '🟡' },
  SHOPEE: { label: 'Shopee', cor: '#ef4444', emoji: '🔴' },
  AMAZON: { label: 'Amazon', cor: '#f97316', emoji: '📦' },
  MAGALU: { label: 'Magalu', cor: '#14b8a6', emoji: '🔵' },

  // Fallbacks explícitos (`OUTRO` = enum · `OUTROS` = normalização do front)
  OUTRO: { label: 'Outros', cor: '#94a3b8', emoji: '🌐' },
  OUTROS: { label: 'Outros', cor: '#94a3b8', emoji: '🌐' },
};

/** Cinza neutro do canal desconhecido — o mesmo de `OUTROS`. */
export const COR_CANAL_PADRAO = '#94a3b8';

/** `MERCADO_PAGO` → `Mercado Pago`. Mostra o código, não um palpite. */
function rotularDesconhecido(canal: string): string {
  if (!canal) return 'Outros';
  return canal
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ');
}

export function canalInfo(canal: string | null | undefined): CanalInfo {
  const chave = (canal ?? '').trim().toUpperCase();
  return (
    CANAIS[chave] ?? { label: rotularDesconhecido(chave), cor: COR_CANAL_PADRAO, emoji: '📦' }
  );
}

export function rotularCanal(canal: string | null | undefined): string {
  return canalInfo(canal).label;
}

export function corCanal(canal: string | null | undefined): string {
  return canalInfo(canal).cor;
}
