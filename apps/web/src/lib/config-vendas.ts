/**
 * Configurações de venda do PDV/caixa.
 *
 * MVP: persistidas em localStorage por dispositivo (a tela de Configurações
 * gerais ainda não tem backend próprio). Quando houver um serviço de
 * configurações por tenant, este módulo passa a ler de lá sem mudar os
 * consumidores (PDV e Caixa).
 */

const CHAVE_DESCONTO_MAX = 'imd-config-desconto-max-pct';

/** Teto de desconto (%) por venda; null = sem limite configurado. */
export function obterDescontoMaximoPct(): number | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(CHAVE_DESCONTO_MAX);
  if (raw === null || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function salvarDescontoMaximoPct(pct: number | null): void {
  if (typeof window === 'undefined') return;
  if (pct === null || !Number.isFinite(pct)) localStorage.removeItem(CHAVE_DESCONTO_MAX);
  else localStorage.setItem(CHAVE_DESCONTO_MAX, String(pct));
}

/** % de desconto de uma venda: desconto sobre o valor bruto (itens sem desconto). */
export function percentualDesconto(valorBruto: number, descontoTotal: number): number {
  if (!(valorBruto > 0) || !(descontoTotal > 0)) return 0;
  return (descontoTotal / valorBruto) * 100;
}

/** A venda excede o teto? (sem teto configurado → nunca excede) */
export function excedeDescontoMaximo(valorBruto: number, descontoTotal: number): boolean {
  const max = obterDescontoMaximoPct();
  if (max === null) return false;
  return percentualDesconto(valorBruto, descontoTotal) > max + 1e-9;
}
