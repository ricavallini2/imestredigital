'use client';

/**
 * Componente Empty State
 * Exibe mensagem quando não há dados, com ilustração e CTA opcional
 */

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 dark:border-slate-600 dark:bg-slate-800">
      {icon && (
        <div className="mb-4 text-slate-400 dark:text-slate-600">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>

      {description && (
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 rounded-lg bg-marca-500 px-4 py-2 font-medium text-white hover:bg-marca-600 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
