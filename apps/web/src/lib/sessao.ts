/**
 * Sessão do usuário logado — lida do access token (JWT) no localStorage.
 *
 * O payload do JWT carrega { sub, tenantId, email, cargo } assinados pelo
 * auth-service; decodificar no cliente é seguro para fins de UI (o backend
 * SEMPRE revalida o token — isto aqui só decide o que mostrar/esconder).
 */

export interface SessaoUsuario {
  id: string;
  tenantId: string;
  email: string;
  /** ADMIN | GERENTE | OPERADOR | CAIXA | VISUALIZADOR (aceita minúsculas legadas) */
  cargo: string;
}

/** Decodifica o payload do JWT sem verificar assinatura (uso só de UI). */
function decodificarJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Sessão atual ou null (sem token/expirado o backend devolve 401 de qualquer forma). */
export function obterSessao(): SessaoUsuario | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  const p = decodificarJwt(token);
  if (!p) return null;
  return {
    id: String(p.sub ?? ''),
    tenantId: String(p.tenantId ?? ''),
    email: String(p.email ?? ''),
    cargo: String(p.cargo ?? '').toUpperCase(),
  };
}

/**
 * Quem pode OPERAR O CAIXA (receber pagamentos e emitir nota no PDV/caixa):
 * CAIXA (papel dedicado), ADMIN e GERENTE (supervisão).
 * Vendedores (OPERADOR) fecham a venda mas o recebimento fica em aberto.
 */
export function podeOperarCaixa(cargo?: string | null): boolean {
  const c = String(cargo ?? '').toUpperCase();
  return c === 'CAIXA' || c === 'ADMIN' || c === 'GERENTE';
}
