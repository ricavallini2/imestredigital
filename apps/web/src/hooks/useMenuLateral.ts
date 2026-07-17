/**
 * Ordem do menu lateral da empresa (por-tenant, backend).
 *
 * GET /v1/tenants/menu — qualquer usuário logado lê (para renderizar o menu).
 * PUT /v1/tenants/menu — só admin/gerente (o backend impõe via RolesGuard).
 *
 * A ordem é cacheada em localStorage para o sidebar aplicar SÍNCRONO no primeiro
 * render e evitar o "pulo" de reordenação enquanto a query resolve.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { OrdemNo } from '@/lib/menu-lateral';

const LS_ORDEM = 'imd-menu-lateral-ordem';

/** Ordem cacheada (ou null). Síncrono — usado como valor inicial do sidebar. */
export function lerOrdemCache(): OrdemNo[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_ORDEM);
    const v = raw ? JSON.parse(raw) : null;
    return Array.isArray(v) ? (v as OrdemNo[]) : null;
  } catch {
    return null;
  }
}

function salvarOrdemCache(ordem: OrdemNo[] | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (ordem && ordem.length) localStorage.setItem(LS_ORDEM, JSON.stringify(ordem));
    else localStorage.removeItem(LS_ORDEM);
  } catch {
    /* ignore */
  }
}

export const menuLateralKeys = {
  all: ['menu-lateral'] as const,
};

/** Lê a ordem do menu do tenant; espelha em localStorage a cada sucesso. */
export function useOrdemMenu() {
  return useQuery({
    queryKey: menuLateralKeys.all,
    queryFn: async () => {
      const { data } = await api.get('/v1/tenants/menu');
      const ordem = (data?.ordem ?? null) as OrdemNo[] | null;
      salvarOrdemCache(ordem);
      return ordem;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Salva a ordem (admin/gerente). Atualiza cache e invalida a query. */
export function useSalvarOrdemMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ordem: OrdemNo[]) => {
      const { data } = await api.put('/v1/tenants/menu', { ordem });
      return (data?.ordem ?? ordem) as OrdemNo[];
    },
    onSuccess: (ordem) => {
      salvarOrdemCache(ordem);
      qc.setQueryData(menuLateralKeys.all, ordem);
    },
  });
}
