'use client';

/**
 * Componente Form Field Reutilizável
 * Encapsula input, label, erro e dica de ajuda
 */

import { InputHTMLAttributes, ReactNode } from 'react';
import { AlertCircle, Info } from 'lucide-react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  icon?: ReactNode;
  containerClassName?: string;
}

export function FormField({
  label,
  error,
  hint,
  required = false,
  icon,
  containerClassName = '',
  className = '',
  ...props
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <div className="text-slate-400 dark:text-slate-600">{icon}</div>
          </div>
        )}

        <input
          {...props}
          className={`w-full rounded-lg border ${
            error
              ? 'border-red-300 focus:ring-red-500 dark:border-red-700'
              : 'border-slate-300 focus:ring-marca-500 dark:border-slate-600'
          } bg-white px-3 py-2 transition-colors placeholder-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 ${
            icon ? 'pl-10' : ''
          } ${className}`}
        />
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {hint && !error && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Info className="h-4 w-4 flex-shrink-0" />
          {hint}
        </div>
      )}
    </div>
  );
}
