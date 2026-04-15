'use client';

/**
 * Componente KPI Card
 * Exibe métricas importantes com ícone, valor, label e variação
 */

import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  valor: string | number;
  icone?: ReactNode;
  variacao?: number; // percentual (positivo ou negativo)
  unidade?: string;
  className?: string;
  destaque?: boolean;
}

export function KPICard({
  label,
  valor,
  icone,
  variacao,
  unidade = '',
  className = '',
  destaque = false,
}: KPICardProps) {
  const isPositive = variacao ? variacao > 0 : false;
  const bgColor = destaque ? 'bg-gradient-to-br from-marca-500 to-marca-600' : 'bg-white dark:bg-slate-800';
  const textColor = destaque ? 'text-white' : 'text-slate-900 dark:text-slate-100';
  const labelColor = destaque ? 'text-marca-100' : 'text-slate-600 dark:text-slate-400';

  return (
    <div
      className={`rounded-lg border ${
        destaque ? 'border-marca-600' : 'border-slate-200 dark:border-slate-700'
      } p-6 shadow-sm hover:shadow-md transition-shadow ${bgColor} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${labelColor}`}>{label}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${textColor}`}>{valor}</span>
            {unidade && <span className={`text-sm ${labelColor}`}>{unidade}</span>}
          </div>

          {variacao !== undefined && (
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
              destaque ? 'bg-marca-400 bg-opacity-20' : 'bg-slate-100 dark:bg-slate-700'
            }`}
          >
            <div className={destaque ? 'text-marca-100' : 'text-marca-500'}>
              {icone}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
