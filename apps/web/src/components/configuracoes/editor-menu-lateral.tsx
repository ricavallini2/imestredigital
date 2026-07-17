'use client';

/**
 * Editor da ordem do menu lateral (empresa) — só admin/gerente.
 *
 * Reordena por setas ↑↓ dentro de cada nível (grupos reordenam entre si; filhos
 * reordenam dentro do grupo). Persiste SÓ a ordem (árvore de ids) no backend via
 * PUT /v1/tenants/menu. A estrutura (labels/ícones/rotas) continua no código.
 */

import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Save, RotateCcw, Loader2, Check } from 'lucide-react';
import {
  MENU,
  aplicarOrdem,
  extrairOrdem,
  idNo,
  type MenuItem,
} from '@/lib/menu-lateral';
import { useOrdemMenu, useSalvarOrdemMenu, lerOrdemCache } from '@/hooks/useMenuLateral';

/** Move o item `id` em `dir` (-1 sobe, +1 desce) DENTRO do seu nível. Recursivo. */
function mover(itens: MenuItem[], id: string, dir: -1 | 1): MenuItem[] {
  const i = itens.findIndex((x) => idNo(x) === id);
  if (i >= 0) {
    const j = i + dir;
    if (j < 0 || j >= itens.length) return itens;
    const novo = [...itens];
    [novo[i], novo[j]] = [novo[j], novo[i]];
    return novo;
  }
  return itens.map((x) =>
    x.tipo === 'grupo' ? { ...x, filhos: mover(x.filhos, id, dir) } : x,
  );
}

function Linha({
  item,
  irmaos,
  indice,
  nivel,
  onMover,
}: {
  item: MenuItem;
  irmaos: MenuItem[];
  indice: number;
  nivel: number;
  onMover: (id: string, dir: -1 | 1) => void;
}) {
  const primeiro = indice === 0;
  const ultimo = indice === irmaos.length - 1;
  const Icone = item.icone;

  return (
    <div>
      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
          item.tipo === 'grupo'
            ? 'border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/40'
            : 'border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800'
        }`}
      >
        <Icone className="h-4 w-4 shrink-0 text-slate-400" />
        <span
          className={`flex-1 truncate text-sm ${
            item.tipo === 'grupo'
              ? 'font-semibold text-slate-800 dark:text-slate-100'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {item.label}
          {item.tipo === 'grupo' && (
            <span className="ml-2 text-[11px] font-normal text-slate-400">grupo</span>
          )}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onMover(idNo(item), -1)}
            disabled={primeiro}
            title="Mover para cima"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-slate-700"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onMover(idNo(item), 1)}
            disabled={ultimo}
            title="Mover para baixo"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-slate-700"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
      {item.tipo === 'grupo' && item.filhos.length > 0 && (
        <div className="ml-5 mt-1 space-y-1 border-l-2 border-slate-200 pl-3 dark:border-slate-700">
          {item.filhos.map((f, i) => (
            <Linha
              key={idNo(f)}
              item={f}
              irmaos={item.filhos}
              indice={i}
              nivel={nivel + 1}
              onMover={onMover}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function EditorMenuLateral() {
  const { data: ordemSalva, isLoading } = useOrdemMenu();
  const salvar = useSalvarOrdemMenu();

  // Árvore de trabalho: começa do cache (evita tela vazia) e re-sincroniza com o
  // servidor enquanto o usuário não editou (dirty).
  const [arvore, setArvore] = useState<MenuItem[]>(() =>
    aplicarOrdem(MENU, lerOrdemCache()),
  );
  const [dirty, setDirty] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (!dirty && ordemSalva !== undefined) {
      setArvore(aplicarOrdem(MENU, ordemSalva));
    }
  }, [ordemSalva, dirty]);

  const handleMover = (id: string, dir: -1 | 1) => {
    setArvore((prev) => mover(prev, id, dir));
    setDirty(true);
    setSalvo(false);
  };

  const handleSalvar = async () => {
    try {
      await salvar.mutateAsync(extrairOrdem(arvore));
      setDirty(false);
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2500);
    } catch {
      /* o estado de erro fica na mutation (salvar.isError) */
    }
  };

  const handleRestaurar = () => {
    setArvore(MENU);
    setDirty(true);
    setSalvo(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Ordem do menu lateral</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Defina a ordem do menu para toda a empresa. Use as setas para mover cada item dentro do
          seu nível. Grupos (Cadastros, Vendas…) reordenam entre si; os itens de um grupo reordenam
          dentro dele.
        </p>

        {isLoading && arvore.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-marca-500" />
          </div>
        ) : (
          <div className="mt-4 space-y-1">
            {arvore.map((item, i) => (
              <Linha
                key={idNo(item)}
                item={item}
                irmaos={arvore}
                indice={i}
                nivel={0}
                onMover={handleMover}
              />
            ))}
          </div>
        )}

        {salvar.isError && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
            Não foi possível salvar a ordem do menu. Verifique sua permissão e tente novamente.
          </p>
        )}

        <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <button
            type="button"
            onClick={handleSalvar}
            disabled={!dirty || salvar.isPending}
            className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-sm font-medium text-white hover:bg-marca-600 disabled:opacity-50"
          >
            {salvar.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar ordem
          </button>
          <button
            type="button"
            onClick={handleRestaurar}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4" /> Restaurar padrão
          </button>
          {salvo && (
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <Check className="h-4 w-4" /> Ordem salva para a empresa
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
