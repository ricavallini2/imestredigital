'use client';

/**
 * Providers globais da aplicação.
 *
 * Encapsula todos os context providers necessários:
 * - React Query: Cache e gerenciamento de estado do servidor
 * - Tema: Suporte a dark mode
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Cria instância do QueryClient uma vez por sessão
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache de 5 minutos para dados do ERP
            staleTime: 5 * 60 * 1000,
            // Retry automático em caso de falha de rede
            retry: 2,
            // Revalida ao voltar para a aba
            refetchOnWindowFocus: true,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
