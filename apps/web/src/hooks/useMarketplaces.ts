/**
 * Hooks React Query para o módulo de Marketplaces.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  marketplacesService,
  FiltrosAnuncios,
  FiltrosPerguntas,
  AtualizarAnuncioDto,
} from '@/services/marketplaces.service';

// ─── Re-exports ───────────────────────────────────────────────────────────────

export type {
  Marketplace,
  Anuncio,
  Pergunta,
  VendaCanal,
  StatsMarketplace,
  HealthScore,
  TopAnuncio,
  FiltrosAnuncios,
  FiltrosPerguntas,
  AtualizarAnuncioDto,
} from '@/services/marketplaces.service';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const marketplacesKeys = {
  all:        ['marketplaces'] as const,
  lista:      () => ['marketplaces', 'lista'] as const,
  stats:      () => ['marketplaces', 'stats'] as const,
  anuncios:   (f?: object) => ['marketplaces', 'anuncios', f ?? {}] as const,
  anuncio:    (id: string) => ['marketplaces', 'anuncio', id] as const,
  perguntas:  (f?: object) => ['marketplaces', 'perguntas', f ?? {}] as const,
};

// ─── useMarketplaces ──────────────────────────────────────────────────────────

export function useMarketplaces() {
  return useQuery({
    queryKey: marketplacesKeys.lista(),
    queryFn: () => marketplacesService.listarMarketplaces(),
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

// ─── useSincronizar ───────────────────────────────────────────────────────────

export function useSincronizar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketplacesService.sincronizar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: marketplacesKeys.lista() });
      qc.invalidateQueries({ queryKey: marketplacesKeys.stats() });
    },
  });
}

// ─── useAnuncios ──────────────────────────────────────────────────────────────

export function useAnuncios(filtros?: FiltrosAnuncios) {
  return useQuery({
    queryKey: marketplacesKeys.anuncios(filtros),
    queryFn: () => marketplacesService.listarAnuncios(filtros),
    staleTime: 30 * 1000,
  });
}

// ─── useAnuncio ───────────────────────────────────────────────────────────────

export function useAnuncio(id: string) {
  return useQuery({
    queryKey: marketplacesKeys.anuncio(id),
    queryFn: () => marketplacesService.obterAnuncio(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

// ─── useAtualizarAnuncio ──────────────────────────────────────────────────────

export function useAtualizarAnuncio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: AtualizarAnuncioDto }) =>
      marketplacesService.atualizarAnuncio(id, dto),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['marketplaces', 'anuncios'] });
      qc.setQueryData(marketplacesKeys.anuncio(updated.id), updated);
      qc.invalidateQueries({ queryKey: marketplacesKeys.stats() });
    },
  });
}

// ─── usePerguntas ─────────────────────────────────────────────────────────────

export function usePerguntas(filtros?: FiltrosPerguntas) {
  return useQuery({
    queryKey: marketplacesKeys.perguntas(filtros),
    queryFn: () => marketplacesService.listarPerguntas(filtros),
    staleTime: 30 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}

// ─── useResponderPergunta ─────────────────────────────────────────────────────

export function useResponderPergunta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resposta }: { id: string; resposta: string }) =>
      marketplacesService.responderPergunta(id, resposta),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketplaces', 'perguntas'] });
      qc.invalidateQueries({ queryKey: marketplacesKeys.lista() });
      qc.invalidateQueries({ queryKey: marketplacesKeys.stats() });
    },
  });
}

// ─── useStatsMarketplace ──────────────────────────────────────────────────────

export function useStatsMarketplace() {
  return useQuery({
    queryKey: marketplacesKeys.stats(),
    queryFn: () => marketplacesService.obterStats(),
    staleTime: 2 * 60 * 1000,
  });
}
