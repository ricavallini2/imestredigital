import { useQuery, useQueryClient } from '@tanstack/react-query';
import { pedidosService } from '@/services/pedidos.service';
import { estoqueService } from '@/services/estoque.service';
import { iaService } from '@/services/ia.service';
import { financeiroService } from '@/services/financeiro.service';
import { dashboardService } from '@/services/dashboard.service';

// O resumo é COMPOSTO no service a partir dos endpoints reais de cada módulo
// (não há agregador no backend). Os tipos vivem lá, junto da normalização; aqui
// só reexportamos para as telas continuarem importando de um lugar só.
export type {
  AlertaEstoque,
  CanalResumo,
  DashboardResumo,
  FonteDashboard,
  PedidoRecente,
  PedidoUrgente,
  ResumoCaixaDashboard,
  ResumoClientesDashboard,
  ResumoEstoqueDashboard,
  ResumoFiscalDashboard,
  StatusFonte,
  TopProduto,
  VendaDia,
} from '@/services/dashboard.service';

// ─── Hook principal do dashboard ─────────────────────────────────────────────
export function useDashboardResumo() {
  return useQuery({
    queryKey: ['dashboard', 'resumo'],
    queryFn: () => dashboardService.obterResumo(),
    staleTime: 60_000, // 1 min
    refetchInterval: 2 * 60_000, // auto-refresh 2 min
  });
}

export function useRefreshDashboard() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['dashboard', 'resumo'] });
}

/**
 * @deprecated Use useDashboardResumo() para dados agregados.
 * Mantido por compatibilidade com componentes legados.
 */
export function useDashboardKPIs() {
  const estatisticasPedidos = useQuery({
    queryKey: ['pedidos', 'estatisticas'],
    queryFn: () => pedidosService.obterEstatisticas(),
    staleTime: 2 * 60 * 1000,
  });

  const alertasEstoque = useQuery({
    queryKey: ['estoque', 'alertas'],
    queryFn: () => estoqueService.obterAlertas(),
    staleTime: 2 * 60 * 1000,
  });

  const resumoFinanceiro = useQuery({
    queryKey: ['financeiro', 'resumo'],
    queryFn: () => financeiroService.obterResumo(),
    staleTime: 5 * 60 * 1000,
  });

  const loading =
    estatisticasPedidos.isLoading ||
    alertasEstoque.isLoading ||
    resumoFinanceiro.isLoading;

  return {
    loading,
    vendasHoje: resumoFinanceiro.data?.receitas ?? 0,
    // `porStatus` é o nome que `obterEstatisticas` entrega — `pedidosPorStatus`
    // não existe em fonte nenhuma e chegava sempre `undefined` (0 fixo aqui).
    pedidosPendentes: estatisticasPedidos.data?.porStatus?.['PENDENTE'] ?? 0,
    alertasEstoque: alertasEstoque.data?.length ?? 0,
    ticketMedio: estatisticasPedidos.data?.ticketMedio ?? 0,
    estatisticasPedidos: estatisticasPedidos.data,
    resumoFinanceiro: resumoFinanceiro.data,
  };
}

// `pagina` é BASE ZERO no `PaginacaoDTO` do ai-service (e no mock). Mandar
// explícito evita depender do default do DTO; `apenasNaoLidos` é o nome exato do
// filtro no `ListarInsightsDTO` — o serviço roda com `forbidNonWhitelisted`, e
// qualquer chave fora do DTO devolve 400.
export function useDashboardInsights() {
  return useQuery({
    queryKey: ['insights', { apenasNaoLidos: true, pagina: 0, limite: 5 }],
    queryFn: () => iaService.listarInsights({ apenasNaoLidos: true, pagina: 0, limite: 5 }),
    staleTime: 5 * 60 * 1000,
  });
}
