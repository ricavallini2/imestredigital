'use client';

/**
 * Página de retorno do OAuth do Mercado Livre.
 *
 * O seller autoriza no Mercado Livre e é redirecionado de volta para cá com
 * ?code&state (ou ?error&error_description se negar). Lemos os parâmetros no
 * client via window.location.search — padrão do projeto para evitar a exigência
 * de Suspense do useSearchParams no App Router — e POSTamos ao backend para
 * trocar o code por tokens. Mostramos sucesso/erro e um caminho de volta à lista.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useProcessarCallbackML } from '@/hooks/useMarketplaces';

type Fase = 'processando' | 'sucesso' | 'erro';

function mensagemErro(err: unknown): string {
  const e = err as {
    response?: { data?: { message?: string | string[]; erro?: string } };
    message?: string;
  };
  const data = e?.response?.data;
  const msg = data?.message ?? data?.erro ?? e?.message;
  if (Array.isArray(msg)) return msg.join(', ');
  return msg ?? 'Falha ao concluir a conexão com o Mercado Livre.';
}

export default function CallbackMercadoLivrePage() {
  const router = useRouter();
  const processarCallback = useProcessarCallbackML();

  const [fase, setFase] = useState<Fase>('processando');
  const [mensagem, setMensagem] = useState<string>('');
  const [contaId, setContaId] = useState<string>('');
  // Garante que o callback só é disparado uma vez (StrictMode monta 2x em dev).
  const jaProcessou = useRef(false);

  useEffect(() => {
    if (jaProcessou.current) return;
    jaProcessou.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code') ?? '';
    const state = params.get('state') ?? '';
    const erroOAuth = params.get('error');
    const erroDesc = params.get('error_description');

    // O usuário negou o consentimento no próprio Mercado Livre.
    if (erroOAuth) {
      setFase('erro');
      setMensagem(
        erroDesc ??
          'Autorização negada no Mercado Livre. Nenhuma conta foi conectada.',
      );
      return;
    }

    if (!code || !state) {
      setFase('erro');
      setMensagem(
        'Parâmetros de retorno ausentes (code/state). Reinicie a conexão a partir da tela de Marketplaces.',
      );
      return;
    }

    processarCallback
      .mutateAsync({ code, state })
      .then((conta) => {
        setContaId(conta.id);
        setFase('sucesso');
        setMensagem('Conta do Mercado Livre conectada com sucesso!');
      })
      .catch((err) => {
        setFase('erro');
        setMensagem(mensagemErro(err));
      });
    // Dispara apenas na montagem; o guard jaProcessou evita reentrância.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const credenciaisFaltando = /(configurad|ML_CLIENT)/i.test(mensagem);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {/* Ícone de estado */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full">
          {fase === 'processando' && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <RefreshCw className="h-8 w-8 animate-spin text-yellow-600 dark:text-yellow-400" />
            </div>
          )}
          {fase === 'sucesso' && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-9 w-9 text-green-600 dark:text-green-400" />
            </div>
          )}
          {fase === 'erro' && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <XCircle className="h-9 w-9 text-red-600 dark:text-red-400" />
            </div>
          )}
        </div>

        {/* Título */}
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {fase === 'processando' && 'Conectando ao Mercado Livre…'}
          {fase === 'sucesso' && 'Tudo certo! 🟠'}
          {fase === 'erro' && 'Não foi possível conectar'}
        </h1>

        {/* Mensagem */}
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {fase === 'processando'
            ? 'Estamos finalizando a autorização do seu vendedor. Isto leva apenas alguns segundos.'
            : mensagem}
        </p>

        {fase === 'sucesso' && contaId && (
          <p className="mt-1 font-mono text-[11px] text-slate-400 dark:text-slate-500">
            Conta #{contaId}
          </p>
        )}

        {/* Instrução amigável quando faltam credenciais */}
        {fase === 'erro' && credenciaisFaltando && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-left text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            <p className="font-semibold">Configuração pendente</p>
            <p className="mt-1">
              Defina{' '}
              <code className="rounded bg-amber-100 px-1 font-mono dark:bg-amber-900/40">
                ML_CLIENT_ID
              </code>{' '}
              e{' '}
              <code className="rounded bg-amber-100 px-1 font-mono dark:bg-amber-900/40">
                ML_CLIENT_SECRET
              </code>{' '}
              no arquivo <code className="font-mono">.env</code> do
              marketplace-service e reinicie o serviço.
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="mt-6 flex flex-col gap-2">
          {fase === 'sucesso' && (
            <button
              onClick={() => router.replace('/dashboard/marketplaces')}
              className="flex items-center justify-center gap-2 rounded-lg bg-marca-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-marca-600 dark:bg-marca-600"
            >
              Ir para Marketplaces
            </button>
          )}

          {fase === 'erro' && (
            <Link
              href="/dashboard/marketplaces"
              className="flex items-center justify-center gap-2 rounded-lg bg-marca-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-marca-600 dark:bg-marca-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Marketplaces
            </Link>
          )}

          {fase === 'processando' && (
            <Link
              href="/dashboard/marketplaces"
              className="text-xs text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              Cancelar e voltar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
