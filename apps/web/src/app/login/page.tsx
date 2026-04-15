'use client';

/**
 * Página de Login - iMestreDigital
 * Tela de autenticação com email e senha
 */

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FormField } from '@/components/ui/form-field';
import { LogoAuth } from '@/components/ui/logo';
import { api } from '@/lib/api';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registroSucesso = searchParams.get('registro') === 'sucesso';
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const { data } = await api.post('/v1/auth/login', { email, senha });

      // Salvar token no localStorage
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);

      // Salvar token em cookie para o middleware (sem httpOnly para poder escrever no client)
      document.cookie = `access_token=${data.accessToken}; path=/; max-age=3600; SameSite=Strict`;

      // Redirecionar para o destino ou dashboard
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    } catch (err: any) {
      const mensagem =
        err.response?.data?.message || 'Email ou senha incorretos';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-marca-50 to-slate-100 px-4 dark:from-slate-900 dark:to-slate-800">
      {/* Container */}
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        {/* Logo/Branding */}
        <div className="mb-8 flex justify-center">
          <LogoAuth />
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mensagem de sucesso após registro */}
          {registroSucesso && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              Conta criada com sucesso! Faça login para continuar.
            </div>
          )}

          {/* Erro geral */}
          {erro && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {erro}
            </div>
          )}

          {/* Campo Email */}
          <FormField
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5" />}
            required
          />

          {/* Campo Senha */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Senha
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-slate-400 dark:text-slate-600" />
              </div>

              <input
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-10 pr-10 transition-colors placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                required
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {mostrarSenha ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-gradient-to-r from-marca-500 to-marca-600 px-4 py-2.5 font-semibold text-white transition-all hover:shadow-lg hover:from-marca-600 hover:to-marca-700 disabled:opacity-50 dark:from-marca-600 dark:to-marca-700"
          >
            {carregando ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        {/* Links auxiliares */}
        <div className="mt-6 space-y-3 text-center">
          <Link
            href="/esqueci-senha"
            className="block text-sm text-marca-600 hover:text-marca-700 dark:text-marca-400 dark:hover:text-marca-300"
          >
            Esqueci minha senha
          </Link>

          <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Não tem conta?{' '}
              <Link
                href="/registro"
                className="font-semibold text-marca-600 hover:text-marca-700 dark:text-marca-400 dark:hover:text-marca-300"
              >
                Crie uma agora
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
          © {new Date().getFullYear()} iMestreDigital. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
