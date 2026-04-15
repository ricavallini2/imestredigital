/**
 * Página inicial do iMestreDigital.
 * Redireciona para o dashboard ou exibe a tela de login.
 */

import { redirect } from 'next/navigation';

export default function Home() {
  // TODO: Verificar autenticação e redirecionar adequadamente
  redirect('/dashboard');
}
