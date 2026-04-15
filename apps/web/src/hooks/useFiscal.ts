/**
 * Hooks React Query para o módulo Fiscal.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fiscalService,
  type ListarNotasFiscaisDTO,
  type CriarNotaFiscalDTO,
  type ConfiguracaoFiscal,
  type RegraFiscal,
} from '@/services/fiscal.service';

export { fiscalService };

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const fiscalKeys = {
  all:          ['fiscal'] as const,
  notas:        (f?: ListarNotasFiscaisDTO) => ['fiscal', 'notas', f ?? {}] as const,
  nota:         (id: string) => ['fiscal', 'nota', id] as const,
  analiseIA:    ['fiscal', 'analise-ia'] as const,
  estatisticas: ['fiscal', 'estatisticas'] as const,
  config:       ['fiscal', 'config'] as const,
  regras:       (busca?: string) => ['fiscal', 'regras', busca ?? ''] as const,
};

// ─── Listagem ─────────────────────────────────────────────────────────────────
export function useNotasFiscais(filtros?: ListarNotasFiscaisDTO) {
  return useQuery({
    queryKey: fiscalKeys.notas(filtros),
    queryFn: () => fiscalService.listar(filtros),
  });
}

// ─── Detalhe ──────────────────────────────────────────────────────────────────
export function useNotaFiscal(id: string) {
  return useQuery({
    queryKey: fiscalKeys.nota(id),
    queryFn: () => fiscalService.obterPorId(id),
    enabled: !!id,
  });
}

// ─── Análise IA ───────────────────────────────────────────────────────────────
export function useAnaliseIAFiscal() {
  return useQuery({
    queryKey: fiscalKeys.analiseIA,
    queryFn: () => fiscalService.analisarIA(),
    staleTime: 60_000, // 1 min
  });
}

// ─── Estatísticas ─────────────────────────────────────────────────────────────
export function useEstatisticasFiscais() {
  return useQuery({
    queryKey: fiscalKeys.estatisticas,
    queryFn: () => fiscalService.estatisticas(),
    staleTime: 60_000,
  });
}

// ─── Criar NF ─────────────────────────────────────────────────────────────────
export function useCriarNF() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CriarNotaFiscalDTO) => fiscalService.criar(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fiscal', 'notas'] });
      qc.invalidateQueries({ queryKey: fiscalKeys.estatisticas });
      qc.invalidateQueries({ queryKey: fiscalKeys.analiseIA });
    },
  });
}

// ─── Atualizar NF ─────────────────────────────────────────────────────────────
export function useAtualizarNF(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CriarNotaFiscalDTO>) => fiscalService.atualizar(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fiscalKeys.nota(id) });
      qc.invalidateQueries({ queryKey: ['fiscal', 'notas'] });
    },
  });
}

// ─── Validar NF ───────────────────────────────────────────────────────────────
export function useValidarNF() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fiscalService.validar(id),
    onSuccess: (_r, id) => {
      qc.invalidateQueries({ queryKey: fiscalKeys.nota(id) });
      qc.invalidateQueries({ queryKey: ['fiscal', 'notas'] });
      qc.invalidateQueries({ queryKey: fiscalKeys.analiseIA });
    },
  });
}

// ─── Emitir NF ────────────────────────────────────────────────────────────────
export function useEmitirNF() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fiscalService.emitir(id),
    onSuccess: (_r, id) => {
      qc.invalidateQueries({ queryKey: fiscalKeys.nota(id) });
      qc.invalidateQueries({ queryKey: ['fiscal', 'notas'] });
      qc.invalidateQueries({ queryKey: fiscalKeys.estatisticas });
      qc.invalidateQueries({ queryKey: fiscalKeys.analiseIA });
    },
  });
}

// ─── Cancelar NF ─────────────────────────────────────────────────────────────
export function useCancelarNF() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) => fiscalService.cancelar(id, motivo),
    onSuccess: (_r, { id }) => {
      qc.invalidateQueries({ queryKey: fiscalKeys.nota(id) });
      qc.invalidateQueries({ queryKey: ['fiscal', 'notas'] });
      qc.invalidateQueries({ queryKey: fiscalKeys.estatisticas });
      qc.invalidateQueries({ queryKey: fiscalKeys.analiseIA });
    },
  });
}

// ─── Configuração ─────────────────────────────────────────────────────────────
export function useConfiguracaoFiscal() {
  return useQuery({
    queryKey: fiscalKeys.config,
    queryFn: () => fiscalService.obterConfiguracao(),
  });
}

export function useSalvarConfiguracao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ConfiguracaoFiscal>) => fiscalService.salvarConfiguracao(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fiscalKeys.config });
      qc.invalidateQueries({ queryKey: fiscalKeys.analiseIA });
    },
  });
}

// ─── Regras Fiscais ───────────────────────────────────────────────────────────
export function useRegrasFiscais(busca?: string) {
  return useQuery({
    queryKey: fiscalKeys.regras(busca),
    queryFn: () => fiscalService.listarRegras(busca),
  });
}

export function useCriarRegra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<RegraFiscal, 'id'>) => fiscalService.criarRegra(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fiscal', 'regras'] }),
  });
}

export function useAtualizarRegra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RegraFiscal> }) => fiscalService.atualizarRegra(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fiscal', 'regras'] }),
  });
}

// ─── Catálogo Integrado ───────────────────────────────────────────────────────
export function useCatalogoFiscal() {
  return useQuery({
    queryKey: ['fiscal', 'catalogo'],
    queryFn: () => fiscalService.obterCatalogo(),
    staleTime: 5 * 60_000,
  });
}
