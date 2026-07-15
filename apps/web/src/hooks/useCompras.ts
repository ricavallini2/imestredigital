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

// Fornecedor = parceiro com papel FORNECEDOR (PF MEI/autônomo ou PJ).
// Ver docs/design/parceiro-unificado.md.
// UNIFICADO: os hooks abaixo leem/gravam via /v1/clientes?papel=FORNECEDOR
// (cadastro único de parceiros). Este `Fornecedor` é apenas a projeção de
// apresentação usada pela tela de Compras — o mapeamento fica em
// parceiroParaFornecedor / fornecedorParaParceiro.
export interface Fornecedor {
  id: string;
  // Ausência de `tipo` = PJ (registros legados / criados via importação de NF-e).
  tipo?: 'PF' | 'PJ';
  // PJ: identificação social. PF: espelha o nome completo.
  razaoSocial: string;
  nomeFantasia: string;
  // PF: nome completo.
  nome?: string;
  // Documentos por tipo. PF usa cnpj '' (string vazia) e preenche cpf.
  cnpj: string;
  cpf?: string;
  rg?: string;
  // Fiscais (PJ).
  inscricaoEstadual?: string;
  ieIsento?: boolean;
  inscricaoMunicipal?: string;
  regimeTributario?: string;
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

// ─── Mapeamento Parceiro (papel FORNECEDOR) ↔ Fornecedor ──────────────────────
// A tela de Fornecedores consome o cadastro UNIFICADO de parceiros
// (/v1/clientes?papel=FORNECEDOR) — que em produção é o customer-service real —
// em vez de um cadastro paralelo. Ver docs/design/parceiro-unificado.md.

interface EnderecoParceiro {
  logradouro?: string; numero?: string; complemento?: string;
  bairro?: string; cidade?: string; estado?: string; uf?: string; cep?: string;
}

interface ParceiroApi {
  id: string;
  tipo?: string;
  nome?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  cpf?: string;
  rg?: string;
  inscricaoEstadual?: string;
  ieIsento?: boolean;
  inscricaoMunicipal?: string;
  regimeTributario?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  status?: string;
  enderecos?: EnderecoParceiro[];
  prazoPagamento?: number;
  valorTotalComprasFornecedor?: number;
  totalComprasFornecedor?: number;
  ultimaCompraFornecedor?: string;
  criadoEm?: string;
}

function normalizarTipo(t?: string): 'PF' | 'PJ' {
  return t === 'PF' || t === 'PESSOA_FISICA' ? 'PF' : 'PJ';
}

function parceiroParaFornecedor(c: ParceiroApi): Fornecedor {
  const tipo = normalizarTipo(c.tipo);
  const end = (c.enderecos ?? [])[0] ?? {};
  return {
    id: c.id,
    tipo,
    razaoSocial: c.razaoSocial ?? c.nome ?? '',
    nomeFantasia: c.nomeFantasia ?? c.nome ?? c.razaoSocial ?? '',
    nome: c.nome,
    cnpj: c.cnpj ?? '',
    cpf: c.cpf,
    rg: c.rg,
    inscricaoEstadual: c.inscricaoEstadual,
    ieIsento: c.ieIsento,
    inscricaoMunicipal: c.inscricaoMunicipal,
    regimeTributario: c.regimeTributario,
    email: c.email ?? '',
    telefone: c.telefone ?? c.celular ?? '',
    endereco: {
      logradouro: end.logradouro ?? '',
      numero: end.numero ?? '',
      complemento: end.complemento,
      bairro: end.bairro ?? '',
      cidade: end.cidade ?? '',
      uf: end.uf ?? end.estado ?? '',
      cep: end.cep ?? '',
    },
    status: c.status === 'ATIVO' ? 'ATIVO' : 'INATIVO',
    totalCompras: Number(c.valorTotalComprasFornecedor ?? 0),
    qtdCompras: Number(c.totalComprasFornecedor ?? 0),
    ultimaCompra: c.ultimaCompraFornecedor,
    prazoMedioPagamento: Number(c.prazoPagamento ?? 0),
    criadoEm: c.criadoEm ?? '',
  };
}

function fornecedorParaParceiro(body: Partial<Fornecedor>): Record<string, unknown> {
  const tipo = body.tipo ?? 'PJ';
  const end = body.endereco;
  const nome = tipo === 'PF' ? (body.nome ?? '') : (body.nomeFantasia || body.razaoSocial || '');
  return {
    papeis: ['FORNECEDOR'],
    tipo,
    nome,
    ...(tipo === 'PJ'
      ? {
          razaoSocial: body.razaoSocial,
          nomeFantasia: body.nomeFantasia || body.razaoSocial,
          cnpj: body.cnpj,
          inscricaoEstadual: body.ieIsento ? '' : body.inscricaoEstadual,
          ieIsento: body.ieIsento,
          inscricaoMunicipal: body.inscricaoMunicipal,
          regimeTributario: body.regimeTributario || undefined,
        }
      : {
          cpf: body.cpf,
          rg: body.rg,
        }),
    email: body.email,
    telefone: body.telefone,
    prazoPagamento: body.prazoMedioPagamento,
    ...(end
      ? {
          endereco: {
            tipo: 'AMBOS',
            logradouro: end.logradouro,
            numero: end.numero,
            complemento: end.complemento,
            bairro: end.bairro,
            cidade: end.cidade,
            estado: end.uf,
            cep: end.cep,
          },
        }
      : {}),
  };
}

// ─── Fornecedores — Listagem (via cadastro unificado de parceiros) ────────────

export function useFornecedores(filters?: { busca?: string; status?: string }) {
  return useQuery({
    queryKey: comprasKeys.fornecedores(filters),
    queryFn: async () => {
      const { data } = await api.get('/v1/clientes', {
        params: { papel: 'FORNECEDOR', busca: filters?.busca, status: filters?.status, limite: 200 },
      });
      const lista: ParceiroApi[] = Array.isArray(data?.dados) ? data.dados : [];
      const dados = lista.map(parceiroParaFornecedor);
      return { dados, total: (data?.total as number) ?? dados.length };
    },
    staleTime: 60 * 1000,
  });
}

// ─── Fornecedores — Detalhe ───────────────────────────────────────────────────

export function useFornecedor(id: string) {
  return useQuery({
    queryKey: comprasKeys.fornecedor(id),
    queryFn: async () => {
      const { data } = await api.get(`/v1/clientes/${id}`);
      return parceiroParaFornecedor(data as ParceiroApi);
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
      // Cria um parceiro com papel FORNECEDOR no cadastro unificado.
      const dto = fornecedorParaParceiro(body);
      const { data } = await api.post('/v1/clientes', dto);
      return parceiroParaFornecedor(data as ParceiroApi);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fornecedores'] });
      qc.invalidateQueries({ queryKey: ['clientes'] });
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
