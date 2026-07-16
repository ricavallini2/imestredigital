'use client';

/**
 * Modal de autorização de supervisor (liberação de venda).
 *
 * Usado quando o desconto da venda excede o máximo configurado: um usuário
 * GERENTE/ADMIN — ou com a flag "pode liberar venda" — digita as próprias
 * credenciais para autorizar a operação.
 *
 * IMPORTANTE: usa axios "cru" (sem os interceptors de @/lib/api) para que uma
 * senha errada (401) não dispare o refresh-token e derrube a sessão do
 * operador logado. Os tokens retornados são DESCARTADOS — nada é salvo.
 */

import { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Loader2, X } from 'lucide-react';

export function ModalAutorizacao({
  aberto,
  motivo,
  onClose,
  onAutorizado,
}: {
  aberto: boolean;
  /** Texto exibido explicando o que está sendo liberado. */
  motivo: string;
  onClose: () => void;
  /** Chamado com o nome do autorizador após validação. */
  onAutorizado: (autorizadoPor: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [validando, setValidando] = useState(false);

  if (!aberto) return null;

  const autorizar = async () => {
    setErro('');
    if (!email.trim() || !senha) return setErro('Informe e-mail e senha do autorizador.');
    setValidando(true);
    try {
      const { data } = await axios.post('/api/v1/auth/login', { email: email.trim(), senha });
      const u = data?.usuario ?? {};
      const cargo = String(u.cargo ?? '').toUpperCase();
      const autorizado = cargo === 'ADMIN' || cargo === 'GERENTE' || u.podeLiberarVenda === true;
      if (!autorizado) {
        setErro('Este usuário não tem permissão para liberar vendas.');
        return;
      }
      setEmail('');
      setSenha('');
      onAutorizado(u.nome ?? email.trim());
    } catch {
      setErro('Credenciais inválidas.');
    } finally {
      setValidando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="flex items-start justify-between bg-amber-500 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-white/20 p-2">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Liberação necessária</h2>
              <p className="text-xs text-amber-100">Gerente ou usuário autorizado</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 text-amber-100 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            {motivo}
          </p>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              E-mail do autorizador
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gerente@empresa.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && autorizar()}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
          {erro && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
              {erro}
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={autorizar}
              disabled={validando}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50"
            >
              {validando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              Autorizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
