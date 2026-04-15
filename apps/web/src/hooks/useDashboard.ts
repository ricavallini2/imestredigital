import { useQuery, useQueryClient } from '@tanstack/react-query';
import { pedidosService } from '@/services/pedidos.service';
import { estoqueService } from '@/services/estoque.service';
import { iaService } from '@/services/ia.service';
import { financeiroService } from '@/services/financeiro.service';
import api from '@/lib/api';

// ─── Tipos do resumo agregado ─────────────────────────────────────────────────
export interface VendaDia { data: string; label: string; receita: number; pedidos: number; }
export interface CanalResumo { canal: string; label: string; qtd: number; valor: number; }
export interface TopProduto { id: string; nome: string; sku: string; qtd: number; receita: number; }
export interface PedidoRecente { id: string; numero: string; cliente: string; valor: number; status: string; canal: string; criadoEm: string; }
export interface PedidoUrgente extends PedidoRecente { horasAtraso: number; }
export interface AlertaEstoque { produtoId: string; produto: string; sku: string; disponivel: number; minimo: number; status: string; deposito: string; }

export interface DashboardResumo {
  receita30d: number; receita7d: number; receitaAnt: number; crescimentoReceita: number;
  pedidos30d: number; pedidos7d: number; ticketMedio: number; pedidosPendentes: number;
  vendas7d: VendaDia[];
  porCanal: CanalResumo[];
  porStatus: Record<string, number>;
  topProdutos5: TopProduto[];
  pedidosRecentes: PedidoRecente[];
  pedidosUrgentes: PedidoUrgente[];
  estoque: { valorEmEstoque: number; estoqueBaixo: number; semEstoque: number; totalProdutos: number; };
  alertasEstoque: AlertaEstoque[];
  fiscal: { faturado30d: number; impostos30d: number; emitidas30d: number; taxaEmissao: number; nfsPendentes: number; };
  caixa: { aberto: boolean; operador?: string; caixa?: string; abertoDesde?: string; totalEntradas?: number; totalSaidas?: number; saldoAtual?: number; };
  clientes: { total: number; ativos: number; novosEsteMes: number; ticketMedioCliente: number; };
}

// ─── Hook principal do dashboard ─────────────────────────────────────────────
export function useDashboardResumo() {
  return useQuery<DashboardResumo>({
    queryKey: ['dashboard', 'resumo'],
    queryFn: async () => {
      const { data } = await api.get<DashboardResumo>('/v1/dashboard/resumo');
      return data;
    },
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
    pedidosPendentes: estatisticasPedidos.data?.pedidosPorStatus?.['PENDENTE'] ?? 0,
    alertasEstoque: alertasEstoque.data?.length ?? 0,
    ticketMedio: estatisticasPedidos.data?.ticketMedio ?? 0,
    estatisticasPedidos: estatisticasPedidos.data,
    resumoFinanceiro: resumoFinanceiro.data,
  };
}

export function useDashboardInsights() {
  return useQuery({
    queryKey: ['insights', { visualizado: false, limite: 5 }],
    queryFn: () => iaService.listarInsights({ visualizado: false, limite: 5 }),
    staleTime: 5 * 60 * 1000,
  });
}
