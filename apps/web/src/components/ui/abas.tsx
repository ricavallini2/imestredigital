'use client';

/**
 * Barra de ABAS padrão do ERP (estilo "pílula").
 *
 * Fonte única da verdade do visual de abas — o padrão nasceu na tela de detalhe
 * de Produto e foi extraído aqui para que todas as telas fiquem idênticas (e as
 * novas já nasçam padronizadas). É apenas NAVEGAÇÃO (controlada): quem usa
 * renderiza o conteúdo condicionalmente pelo `ativa`.
 *
 * Convenções do padrão:
 * - a aba de IA vai SEMPRE por último e recebe o gradiente roxo quando ativa;
 * - os botões de ação da tela (Editar, Salvar, etc.) ficam ACIMA desta barra,
 *   nunca no canto superior direito do cabeçalho.
 */

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface AbaItem<T extends string = string> {
  id: T;
  label: string;
  /** Ícone como COMPONENTE (ex.: `Icone: Package`). */
  Icone?: LucideIcon;
  /** Ícone já renderizado (ex.: `icone: <Package className="h-4 w-4" />`). */
  icone?: ReactNode;
  /** Badge numérico ao lado do rótulo (ex.: quantidade de itens). */
  count?: number;
  /** Aba de IA: recebe o realce roxo/gradiente. */
  ia?: boolean;
}

interface AbasProps<T extends string> {
  abas: AbaItem<T>[];
  ativa: T;
  onChange: (id: T) => void;
  className?: string;
}

export function Abas<T extends string>({ abas, ativa, onChange, className }: AbasProps<T>) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className ?? ''}`}
    >
      <div className="flex gap-1 overflow-x-auto">
        {abas.map((aba) => {
          const estaAtiva = ativa === aba.id;
          const ehIA = aba.ia ?? aba.id === 'ia';
          const Icone = aba.Icone;
          return (
            <button
              key={aba.id}
              type="button"
              onClick={() => onChange(aba.id)}
              aria-current={estaAtiva ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                estaAtiva
                  ? ehIA
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm'
                    : 'bg-marca-500 text-white shadow-sm'
                  : `text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-slate-100 ${
                      ehIA ? 'text-purple-600 dark:text-purple-400' : ''
                    }`
              }`}
            >
              {Icone ? <Icone className="h-4 w-4" /> : aba.icone}
              {aba.label}
              {aba.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                    estaAtiva
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  {aba.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
