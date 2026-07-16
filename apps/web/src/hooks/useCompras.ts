/**
 * Hooks React Query para o módulo de Compras.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Fornecedor } from '@/services/fornecedores.service';

// O cadastro de fornecedores é o de parceiros (papel FORNECEDOR) e vive em
// `@/services/fornecedores.service` + `@/hooks/useFornecedores`. Reexportamos o
// tipo aqui só para quem consome o módulo de Compras.
export type { Fornecedor };

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ItemCompra {
  id: string;
  produtoId: string;
  produto: string;
  sku: string;
  ncm?: string;
  cfop?: string;
  unidade: string;
  quantidade: number;
  quantidadeRecebida: number;
  valorUnitario: number;
  valorTotal: number;
  valorICMS: number;
  valorIPI: number;
  valorPIS: number;
  valorCOFINS: number;
}

export type StatusCompra =
  | 'RASCUNHO'
  | 'ENVIADO'
  | 'AGUARDANDO_RECEBIMENTO'
  | 'RECEBIDO_PARCIAL'
  | 'RECEBIDO'
  | 'CANCELADO';

export interface PedidoCompra {
  id: string;
  numero: string;
  fornecedorId: string;
  fornecedor: string;
  status: StatusCompra;
  itens?: ItemCompra[];
  qtdItens?: number;
  valorProdutos: number;
  valorFrete: number;
  valorImpostos: number;
  valorTotal: number;
  dataEmissao: string;
  dataPrevistaEntrega?: string;
  dataRecebimento?: string;
  nfeNumero?: string;
  nfeSerie?: string;
  nfeChave?: string;
  condicaoPagamento: string;
  formaPagamento: string;
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EstatisticasCompras {
  gastosTotal30d: number;
  gastosTotal7d: number;
  pedidosPendentes: number;
  pedidosRecebidos30d: number;
  nfesImportadas: number;
  ticketMedioCompra: number;
  /** Agregado das compras RECEBIDAS por fornecedor (id pode ser null em compra sem vínculo). */
  topFornecedores: Array<{ id: string | null; nome: string; total: number; qtd: number }>;
  /**
   * 30 dias atuais vs 30 anteriores. NULL quando não há base de comparação —
   * a tela mostra "sem base de comparação" (o mock devolvia -8.5 inventado).
   */
  crescimentoGastos: number | null;
}

/**
 * Contrato REAL do POST /v1/compras/importar-nfe (inventory-service).
 *
 * A v1 NÃO cria fornecedor, NÃO cria produto e NÃO gera conta a pagar — o mock
 * antigo fingia esses efeitos. Os itens casam por SKU com o catálogo; o que não
 * casar entra sem vínculo (itensSemProduto) e não movimenta estoque no
 * recebimento até o produto ser cadastrado.
 */
export interface ResultadoImportacao {
  compra: PedidoCompra;
  itensTotal: number;
  itensSemProduto: number;
  aviso: string | null;
  nfe: {
    chave: string;
    numero: string;
    serie: string;
    dataEmissao: string;
    naturezaOperacao: string;
    fornecedor: { cnpj: string; razaoSocial: string; nomeFantasia: string };
    totais: {
      valorProdutos: number;
      valorFrete: number;
      valorTotal: number;
      valorImpostos: number;
    };
  };
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const comprasKeys = {
  all: ['compras'] as const,
  lista: (f?: object) => ['compras', 'lista', f ?? {}] as const,
  detalhe: (id: string) => ['compras', 'detalhe', id] as const,
  estatisticas: ['compras', 'estatisticas'] as const,
};

// ─── Compras — Listagem ───────────────────────────────────────────────────────

export function useCompras(filters?: { status?: string; fornecedorId?: string; busca?: string }) {
  return useQuery({
    queryKey: comprasKeys.lista(filters),
    queryFn: async () => {
      const { data } = await api.get('/v1/compras', { params: filters });
      return data as { dados: PedidoCompra[]; total: number };
    },
    staleTime: 30 * 1000,
  });
}

// ─── Compras — Detalhe ────────────────────────────────────────────────────────

export function useCompra(id: string) {
  return useQuery({
    queryKey: comprasKeys.detalhe(id),
    queryFn: async () => {
      const { data } = await api.get(`/v1/compras/${id}`);
      return data as PedidoCompra;
    },
    enabled: !!id,
  });
}

// ─── Estatísticas ─────────────────────────────────────────────────────────────

export function useEstatisticasCompras() {
  return useQuery({
    queryKey: comprasKeys.estatisticas,
    queryFn: async () => {
      const { data } = await api.get('/v1/compras/estatisticas');
      return data as EstatisticasCompras;
    },
    staleTime: 60 * 1000,
  });
}

// ─── Mutation: Criar Compra ───────────────────────────────────────────────────

export function useCriarCompra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<PedidoCompra>) => {
      const { data } = await api.post('/v1/compras', body);
      return data as PedidoCompra;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: comprasKeys.all });
      qc.invalidateQueries({ queryKey: comprasKeys.estatisticas });
    },
  });
}

// ─── Mutation: Receber Compra ─────────────────────────────────────────────────

export function useReceberCompra(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      itensRecebidos: Array<{ itemId: string; quantidadeRecebida: number }>;
    }) => {
      const { data } = await api.post(`/v1/compras/${id}/receber`, body);
      return data as PedidoCompra;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: comprasKeys.detalhe(id) });
      qc.invalidateQueries({ queryKey: comprasKeys.all });
      qc.invalidateQueries({ queryKey: comprasKeys.estatisticas });
      qc.invalidateQueries({ queryKey: ['estoque'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// ─── Mutation: Importar NF-e ──────────────────────────────────────────────────

export function useImportarNFe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { xml: string }) => {
      const { data } = await api.post('/v1/compras/importar-nfe', body);
      return data as ResultadoImportacao;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: comprasKeys.all });
      qc.invalidateQueries({ queryKey: comprasKeys.estatisticas });
      qc.invalidateQueries({ queryKey: ['estoque'] });
      qc.invalidateQueries({ queryKey: ['produtos'] });
      qc.invalidateQueries({ queryKey: ['fornecedores'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
