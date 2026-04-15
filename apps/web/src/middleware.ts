/**
 * Middleware de autenticação do Next.js.
 *
 * Protege rotas do dashboard: redireciona para /login
 * se o access_token não estiver presente nos cookies.
 *
 * Nota: O token é lido via cookie (não localStorage) pois
 * middleware roda no servidor (Edge runtime). O login deve
 * salvar o token em cookie httpOnly além do localStorage.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Rotas que não exigem autenticação */
const ROTAS_PUBLICAS = ['/login', '/registro'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rotas públicas e recursos estáticos
  const ehPublica = ROTAS_PUBLICAS.some((rota) => pathname.startsWith(rota));
  if (ehPublica) {
    return NextResponse.next();
  }

  // Verificar token no cookie
  const token = request.cookies.get('access_token')?.value;

  // Sem token → redirecionar para login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf|eot|css|js)).*)',
  ],
};
