/**
 * Hooks React Query para o módulo de Compras.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

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

export interface Fornecedor {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  email: string;
  telefone: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  status: 'ATIVO' | 'INATIVO';
  totalCompras: number;
  qtdCompras: number;
  ultimaCompra?: string;
  prazoMedioPagamento: number;
  criadoEm: string;
}

export interface EstatisticasCompras {
  gastosTotal30d: number;
  gastosTotal7d: number;
  pedidosPendentes: number;
  pedidosRecebidos30d: number;
  nfesImportadas: number;
  fornecedoresAtivos: number;
  ticketMedioCompra: number;
  topFornecedores: Array<{ id: string; nome: string; total: number; qtd: number }>;
  crescimentoGastos: number;
}

export interface ResultadoImportacao {
  compra: PedidoCompra;
  fornecedor: { criado: boolean; dados: Fornecedor };
  produtos: Array<{ criado: boolean; produtoId: string; nome: string; quantidade: number }>;
  estoque: { itensAtualizados: number };
  financeiro: { contaId: string; valor: number; vencimento: string };
  nfe: {
    chave: string;
    numero: string;
    serie: string;
    dataEmissao: string;
    naturezaOperacao: string;
    fornecedor: {
      cnpj: string;
      razaoSocial: string;
      nomeFantasia: string;
      inscricaoEstadual: string;
      telefone: string;
      email: string;
      endereco: {
        logradouro: string;
        numero: string;
        complemento: string;
        bairro: string;
        cidade: string;
        uf: string;
        cep: string;
      };
    };
    itens: Array<{
      codigo: string;
      ean: string;
      descricao: string;
      ncm: string;
      cfop: string;
      unidade: string;
      quantidade: number;
      valorUnitario: number;
      valorTotal: number;
      impostos: { vICMS: number; vIPI: number; vPIS: number; vCOFINS: number };
    }>;
    totais: {
      valorProdutos: number;
      valorFrete: number;
      valorSeguro: number;
      valorDesconto: number;
      valorIPI: number;
      valorICMS: number;
      valorPIS: number;
      valorCOFINS: number;
      valorTotal: number;
      valorTributos: number;
    };
    pagamento: Array<{ forma: string; valor: number }>;
  };
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const comprasKeys = {
  all:          ['compras'] as const,
  lista:        (f?: object) => ['compras', 'lista', f ?? {}] as const,
  detalhe:      (id: string) => ['compras', 'detalhe', id] as const,
  estatisticas: ['compras', 'estatisticas'] as const,
  fornecedores: (f?: object) => ['fornecedores', f ?? {}] as const,
  fornecedor:   (id: string) => ['fornecedor', id] as const,
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

// ─── Fornecedores — Listagem ──────────────────────────────────────────────────

export function useFornecedores(filters?: { busca?: string; status?: string }) {
  return useQuery({
    queryKey: comprasKeys.fornecedores(filters),
    queryFn: async () => {
      const { data } = await api.get('/v1/fornecedores', { params: filters });
      return data as { dados: Fornecedor[]; total: number };
    },
    staleTime: 60 * 1000,
  });
}

// ─── Fornecedores — Detalhe ───────────────────────────────────────────────────

export function useFornecedor(id: string) {
  return useQuery({
    queryKey: comprasKeys.fornecedor(id),
    queryFn: async () => {
      const { data } = await api.get(`/v1/fornecedores/${id}`);
      return data as Fornecedor;
    },
    enabled: !!id,
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

// ─── Mutation: Criar Fornecedor ───────────────────────────────────────────────

export function useCriarFornecedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<Fornecedor>) => {
      const { data } = await api.post('/v1/fornecedores', body);
      return data as Fornecedor;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fornecedores'] });
      qc.invalidateQueries({ queryKey: comprasKeys.estatisticas });
    },
  });
}

// ─── Mutation: Receber Compra ─────────────────────────────────────────────────

export function useReceberCompra(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { itensRecebidos: Array<{ itemId: string; quantidadeRecebida: number }> }) => {
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
