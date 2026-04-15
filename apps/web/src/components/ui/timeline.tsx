'use client';

/**
 * Componente Timeline Visual
 * Exibe histórico de eventos ou etapas com indicadores visuais
 */

import { ReactNode } from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface TimelineStep {
  id: string;
  label: string;
  description?: string;
  timestamp?: string;
  status: 'completed' | 'pending' | 'error';
  icon?: ReactNode;
}

interface TimelineProps {
  steps: TimelineStep[];
}

export function Timeline({ steps }: TimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-slate-400" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4">
          {/* Timeline Indicator */}
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800">
              {step.icon || getStatusIcon(step.status)}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mt-2 w-1 flex-1 ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
                style={{ minHeight: '60px' }}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {step.label}
            </h3>
            {step.description && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {step.description}
              </p>
            )}
            {step.timestamp && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                {step.timestamp}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
