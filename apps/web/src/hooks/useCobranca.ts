import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cobrancaService, FiltrosTitulos, FiltrosHistorico, AcaoDto,
  NegociarDto, DisparadorDto,
} from '@/services/cobranca.service';

export type {
  TituloCobranca, AcaoCobranca, Acordo, Parcela, ConfiguracaoCobranca,
  StatsCobranca, FiltrosTitulos, FiltrosHistorico, AcaoDto, NegociarDto, DisparadorDto,
} from '@/services/cobranca.service';

const KEYS = {
  titulos:       (f?: object) => ['cobranca', 'titulos', f ?? {}] as const,
  stats:         ()           => ['cobranca', 'stats'] as const,
  historico:     (f?: object) => ['cobranca', 'historico', f ?? {}] as const,
  acordos:       (f?: object) => ['cobranca', 'acordos', f ?? {}] as const,
  configuracoes: ()           => ['cobranca', 'configuracoes'] as const,
};

export function useTitulosCobranca(filtros?: FiltrosTitulos) {
  return useQuery({ queryKey: KEYS.titulos(filtros), queryFn: () => cobrancaService.listarTitulos(filtros), staleTime: 30_000, refetchInterval: 60_000 });
}
export function useStatsCobranca() {
  return useQuery({ queryKey: KEYS.stats(), queryFn: () => cobrancaService.obterStats(), staleTime: 30_000, refetchInterval: 60_000 });
}
export function useHistoricoCobranca(filtros?: FiltrosHistorico) {
  return useQuery({ queryKey: KEYS.historico(filtros), queryFn: () => cobrancaService.listarHistorico(filtros), staleTime: 30_000 });
}
export function useAcordosCobranca(filtros?: { status?: string }) {
  return useQuery({ queryKey: KEYS.acordos(filtros), queryFn: () => cobrancaService.listarAcordos(filtros), staleTime: 30_000 });
}
export function useConfiguracoesCobranca() {
  return useQuery({ queryKey: KEYS.configuracoes(), queryFn: () => cobrancaService.obterConfiguracoes(), staleTime: 300_000 });
}

export function useCriarTitulo() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: cobrancaService.criarTitulo, onSuccess: () => qc.invalidateQueries({ queryKey: ['cobranca'] }) });
}
export function useRegistrarAcao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tituloId, dto }: { tituloId: string; dto: AcaoDto }) => cobrancaService.registrarAcao(tituloId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEYS.titulos() }); qc.invalidateQueries({ queryKey: KEYS.historico() }); qc.invalidateQueries({ queryKey: KEYS.stats() }); },
  });
}
export function useNegociar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tituloId, dto }: { tituloId: string; dto: NegociarDto }) => cobrancaService.negociar(tituloId, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEYS.titulos() }); qc.invalidateQueries({ queryKey: KEYS.acordos() }); qc.invalidateQueries({ queryKey: KEYS.stats() }); },
  });
}
export function usePagarParcela() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ acordoId, numeroParcela }: { acordoId: string; numeroParcela: number }) => cobrancaService.pagarParcela(acordoId, numeroParcela),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cobranca'] }); },
  });
}
export function useAtualizarConfiguracoes() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: cobrancaService.atualizarConfiguracoes, onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.configuracoes() }) });
}
export function useDisparar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cobrancaService.disparar,
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEYS.titulos() }); qc.invalidateQueries({ queryKey: KEYS.historico() }); qc.invalidateQueries({ queryKey: KEYS.stats() }); },
  });
}
