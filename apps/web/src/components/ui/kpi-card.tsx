'use client';

/**
 * Componente KPI Card
 * Exibe métricas importantes com ícone, valor, label e variação
 */

import { ReactNode } from 'react';
import { ArrowUp, ArrowDown, CloudOff } from 'lucide-react';

interface KPICardProps {
  label: string;
  valor: string | number;
  icone?: ReactNode;
  variacao?: number; // percentual (positivo ou negativo)
  unidade?: string;
  className?: string;
  destaque?: boolean;
  /**
   * A fonte do número NÃO respondeu: mostra "—" e diz que está indisponível, em
   * vez do zero que o `?? 0` da tela produziria. Zero é um FATO ("não houve
   * venda"); fonte fora do ar é ausência de dado, e a tela nunca pode passar um
   * pelo outro. Mesmo padrão do `KpiCard` do Dashboard (app/dashboard/page.tsx),
   * para os dois não se contradizerem sobre o mesmo dado na mesma sessão.
   */
  indisponivel?: boolean;
}

export function KPICard({
  label,
  valor,
  icone,
  variacao,
  unidade = '',
  className = '',
  destaque = false,
  indisponivel = false,
}: KPICardProps) {
  const isPositive = variacao ? variacao > 0 : false;
  // Sem dado não há o que destacar: o gradiente da marca daria peso visual a um
  // "—". O card cai no visual neutro enquanto a fonte não responde.
  const emDestaque = destaque && !indisponivel;
  const bgColor = emDestaque ? 'bg-gradient-to-br from-marca-500 to-marca-600' : 'bg-white dark:bg-slate-800';
  const textColor = emDestaque ? 'text-white' : 'text-slate-900 dark:text-slate-100';
  const labelColor = emDestaque ? 'text-marca-100' : 'text-slate-600 dark:text-slate-400';

  return (
    <div
      className={`rounded-lg border ${
        emDestaque ? 'border-marca-600' : 'border-slate-200 dark:border-slate-700'
      } p-6 shadow-sm hover:shadow-md transition-shadow ${bgColor} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${labelColor}`}>{label}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${
                indisponivel ? 'text-slate-300 dark:text-slate-600' : textColor
              }`}
            >
              {indisponivel ? '—' : valor}
            </span>
            {!indisponivel && unidade && <span className={`text-sm ${labelColor}`}>{unidade}</span>}
          </div>

          {indisponivel && (
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <CloudOff className="h-3 w-3 shrink-0" /> Fonte indisponível
            </p>
          )}

          {/* Variação é uma afirmação sobre o período: sem o número não há o que
              comparar. */}
          {!indisponivel && variacao !== undefined && (
            <div className="mt-3 flex items-center gap-1">
              {isPositive ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-xs font-semibold ${
                  isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {Math.abs(variacao)}% vs último período
              </span>
            </div>
          )}
        </div>

        {icone && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
              emDestaque ? 'bg-marca-400 bg-opacity-20' : 'bg-slate-100 dark:bg-slate-700'
            }`}
          >
            <div
              className={
                emDestaque ? 'text-marca-100' : indisponivel ? 'text-slate-400' : 'text-marca-500'
              }
            >
              {icone}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
