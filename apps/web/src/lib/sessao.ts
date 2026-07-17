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

export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  podeLiberarVenda: boolean;
}

/**
 * Usuário logado com NOME — o JWT não carrega o nome, então lê o objeto salvo
 * no login (`localStorage.usuario`). Fallback para o JWT (sessão antiga sem o
 * objeto): usa o e-mail como rótulo até o próximo login. Usado para travar o
 * operador do caixa no usuário logado.
 */
export function obterUsuarioLogado(): UsuarioLogado | null {
  if (typeof window === 'undefined') return null;
  const sessao = obterSessao();
  let salvo: Record<string, unknown> | null = null;
  try {
    const raw = localStorage.getItem('usuario');
    salvo = raw ? JSON.parse(raw) : null;
  } catch {
    salvo = null;
  }
  if (!sessao && !salvo) return null;
  return {
    id: String(salvo?.id ?? sessao?.id ?? ''),
    nome: String(salvo?.nome ?? sessao?.email ?? ''),
    email: String(salvo?.email ?? sessao?.email ?? ''),
    cargo: String(salvo?.cargo ?? sessao?.cargo ?? '').toUpperCase(),
    podeLiberarVenda: Boolean(salvo?.podeLiberarVenda ?? false),
  };
}
