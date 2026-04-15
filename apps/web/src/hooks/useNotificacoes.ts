import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { NotificacaoItem } from '@/app/api/v1/notificacoes/route';

export type { NotificacaoItem };

export function useNotificacoes() {
  return useQuery<NotificacaoItem[]>({
    queryKey: ['notificacoes'],
    queryFn: () => api.get('/v1/notificacoes').then(r => r.data),
    staleTime: 60_000,
    refetchInterval: 2 * 60_000,
  });
}
