/**
 * Cliente HTTP do cadastro de FORNECEDORES.
 *
 * Fornecedor não é um cadastro paralelo: é o parceiro de negócio do
 * customer-service que carrega o papel FORNECEDOR (ver
 * `docs/design/parceiro-unificado.md`). Por isso este service conversa com
 * `/v1/clientes` sempre filtrando/gravando `papel(is) = FORNECEDOR`.
 *
 * Toda a tradução de contrato acontece AQUI, na fronteira da API, para a tela
 * consumir um shape estável:
 *  - `Decimal` (serializado como string pelo Prisma) → `number`
 *  - `PESSOA_FISICA` / `PESSOA_JURIDICA` → `PF` / `PJ`
 *  - `null` (Prisma) → `undefined`
 *  - `prazoPagamento` (backend) → `prazoMedioPagamento` (tela)
 *  - documentos (CPF/CNPJ) enviados só com dígitos, como o backend valida
 */

import api from '@/lib/api';
import type { RespostaPaginada } from '@/types';

// ─── Tipos de apresentação ────────────────────────────────────────────────────

export type TipoPessoaFornecedor = 'PF' | 'PJ';

/** Espelha o enum `StatusCliente` do customer-service. */
export type StatusFornecedor = 'PROSPECT' | 'ATIVO' | 'INATIVO' | 'BLOQUEADO';

export interface EnderecoFornecedor {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  /** UF — o backend chama este campo de `estado`. */
  uf: string;
  cep: string;
}

/**
 * Projeção de apresentação do parceiro com papel FORNECEDOR.
 *
 * `endereco` é opcional porque a listagem do customer-service não devolve a
 * relação `enderecos` — quem consome deve degradar quando ele não vier.
 */
export interface Fornecedor {
  id: string;
  tipo: TipoPessoaFornecedor;
  /** PJ: identificação social. PF: espelha o nome completo. */
  razaoSocial: string;
  nomeFantasia: string;
  /** PF: nome completo. */
  nome: string;
  cnpj?: string;
  cpf?: string;
  rg?: string;
  inscricaoEstadual?: string;
  ieIsento: boolean;
  inscricaoMunicipal?: string;
  regimeTributario?: string;
  email: string;
  telefone: string;
  endereco?: EnderecoFornecedor;
  status: StatusFornecedor;
  /** Soma paga a este fornecedor (`valorTotalComprasFornecedor`). */
  totalCompras: number;
  /** Quantidade de compras feitas deste fornecedor. */
  qtdCompras: number;
  ultimaCompra?: string;
  prazoMedioPagamento: number;
  condicoesPagamento?: string;
  pixChave?: string;
  categoriasFornecidas: string[];
  avaliacaoFornecedor?: number;
  criadoEm: string;
}

/** Payload do formulário de cadastro (shape da tela, não do backend). */
export interface FornecedorDto {
  tipo: TipoPessoaFornecedor;
  razaoSocial?: string;
  nomeFantasia?: string;
  nome?: string;
  cnpj?: string;
  cpf?: string;
  rg?: string;
  inscricaoEstadual?: string;
  ieIsento?: boolean;
  inscricaoMunicipal?: string;
  regimeTributario?: string;
  email: string;
  telefone?: string;
  prazoMedioPagamento?: number;
  endereco?: Partial<EnderecoFornecedor>;
}

export interface FiltrosFornecedor {
  busca?: string;
  status?: StatusFornecedor;
  pagina?: number;
  limite?: number;
}

// ─── Shape cru devolvido pelo customer-service ────────────────────────────────

interface EnderecoApi {
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cep?: string | null;
}

interface ParceiroApi {
  id: string;
  papeis?: string[];
  tipo?: string | null;
  nome?: string | null;
  nomeFantasia?: string | null;
  razaoSocial?: string | null;
  cnpj?: string | null;
  cpf?: string | null;
  rg?: string | null;
  inscricaoEstadual?: string | null;
  ieIsento?: boolean | null;
  inscricaoMunicipal?: string | null;
  regimeTributario?: string | null;
  email?: string | null;
  telefone?: string | null;
  celular?: string | null;
  status?: string | null;
  /** A listagem não inclui esta relação; o campo existe para quando incluir. */
  enderecos?: EnderecoApi[] | null;
  prazoPagamento?: number | null;
  condicoesPagamento?: string | null;
  pixChave?: string | null;
  categoriasFornecidas?: string[] | null;
  avaliacaoFornecedor?: number | null;
  /** Decimal — chega como string no JSON. */
  valorTotalComprasFornecedor?: string | number | null;
  totalComprasFornecedor?: number | null;
  ultimaCompraFornecedor?: string | null;
  criadoEm?: string | null;
}

// ─── Helpers de normalização ──────────────────────────────────────────────────

const STATUS_VALIDOS: StatusFornecedor[] = ['PROSPECT', 'ATIVO', 'INATIVO', 'BLOQUEADO'];

/**
 * Converte Decimal (string) / number / null em number seguro.
 *
 * `null` e `undefined` são tratados ANTES do `Number()`: `Number(null)` é 0, o
 * que faria um `total: null` do backend virar 0 em vez de cair no `padrao`.
 */
function paraNumero(valor: unknown, padrao = 0): number {
  if (valor == null) return padrao;
  const n = Number(valor);
  return Number.isFinite(n) ? n : padrao;
}

/** `null` do Prisma vira `undefined`; string vazia também é considerada ausente. */
function paraTexto(valor?: string | null): string | undefined {
  return valor ? valor : undefined;
}

function apenasDigitos(valor?: string): string | undefined {
  const limpo = (valor ?? '').replace(/\D/g, '');
  return limpo || undefined;
}

function normalizarTipo(tipo?: string | null): TipoPessoaFornecedor {
  return tipo === 'PF' || tipo === 'PESSOA_FISICA' ? 'PF' : 'PJ';
}

function normalizarStatus(status?: string | null): StatusFornecedor {
  return STATUS_VALIDOS.includes(status as StatusFornecedor)
    ? (status as StatusFornecedor)
    : 'PROSPECT';
}

function normalizarEndereco(enderecos?: EnderecoApi[] | null): EnderecoFornecedor | undefined {
  const end = (enderecos ?? [])[0];
  if (!end) return undefined;
  return {
    logradouro: end.logradouro ?? '',
    numero: end.numero ?? '',
    complemento: paraTexto(end.complemento),
    bairro: end.bairro ?? '',
    cidade: end.cidade ?? '',
    uf: end.estado ?? '',
    cep: end.cep ?? '',
  };
}

/** Traduz o parceiro cru do customer-service para a projeção da tela. */
export function normalizarFornecedor(parceiro: ParceiroApi): Fornecedor {
  const tipo = normalizarTipo(parceiro.tipo);
  const nome = parceiro.nome ?? '';

  return {
    id: parceiro.id,
    tipo,
    razaoSocial: parceiro.razaoSocial ?? nome,
    nomeFantasia: parceiro.nomeFantasia ?? (nome || parceiro.razaoSocial || ''),
    nome,
    cnpj: paraTexto(parceiro.cnpj),
    cpf: paraTexto(parceiro.cpf),
    rg: paraTexto(parceiro.rg),
    inscricaoEstadual: paraTexto(parceiro.inscricaoEstadual),
    ieIsento: parceiro.ieIsento ?? false,
    inscricaoMunicipal: paraTexto(parceiro.inscricaoMunicipal),
    regimeTributario: paraTexto(parceiro.regimeTributario),
    email: parceiro.email ?? '',
    telefone: parceiro.telefone ?? parceiro.celular ?? '',
    endereco: normalizarEndereco(parceiro.enderecos),
    status: normalizarStatus(parceiro.status),
    totalCompras: paraNumero(parceiro.valorTotalComprasFornecedor),
    qtdCompras: paraNumero(parceiro.totalComprasFornecedor),
    ultimaCompra: paraTexto(parceiro.ultimaCompraFornecedor),
    prazoMedioPagamento: paraNumero(parceiro.prazoPagamento),
    condicoesPagamento: paraTexto(parceiro.condicoesPagamento),
    pixChave: paraTexto(parceiro.pixChave),
    categoriasFornecidas: parceiro.categoriasFornecidas ?? [],
    avaliacaoFornecedor: parceiro.avaliacaoFornecedor ?? undefined,
    criadoEm: parceiro.criadoEm ?? '',
  };
}

/**
 * Monta o corpo aceito por `CriarClienteDto`.
 *
 * O customer-service roda com `forbidNonWhitelisted`, então só podem ir campos
 * que existem no DTO — nada de `prazoMedioPagamento` ou `uf`.
 */
function montarPayloadCriacao(dto: FornecedorDto): Record<string, unknown> {
  const end = dto.endereco;
  const nome =
    dto.tipo === 'PF'
      ? (dto.nome ?? '').trim()
      : (dto.nomeFantasia || dto.razaoSocial || '').trim();

  return {
    papeis: ['FORNECEDOR'],
    // Omitido, o banco aplicaria o default PROSPECT e o fornecedor sumiria da
    // listagem; um fornecedor recém-cadastrado já nasce operacional.
    status: 'ATIVO',
    tipo: dto.tipo,
    nome,
    ...(dto.tipo === 'PJ'
      ? {
          razaoSocial: dto.razaoSocial,
          nomeFantasia: dto.nomeFantasia || dto.razaoSocial,
          // O backend exige exatamente 14 dígitos e valida o DV.
          cnpj: apenasDigitos(dto.cnpj),
          inscricaoEstadual: dto.ieIsento ? '' : dto.inscricaoEstadual,
          ieIsento: dto.ieIsento ?? false,
          inscricaoMunicipal: paraTexto(dto.inscricaoMunicipal),
          regimeTributario: paraTexto(dto.regimeTributario),
        }
      : {
          // O backend exige exatamente 11 dígitos e valida o DV.
          cpf: apenasDigitos(dto.cpf),
          rg: paraTexto(dto.rg),
        }),
    email: dto.email.trim(),
    telefone: paraTexto(dto.telefone),
    prazoPagamento: dto.prazoMedioPagamento,
    ...(end?.logradouro
      ? {
          endereco: {
            tipo: 'AMBOS',
            logradouro: end.logradouro,
            numero: end.numero || 'S/N',
            complemento: paraTexto(end.complemento),
            bairro: end.bairro,
            cidade: end.cidade,
            estado: end.uf,
            cep: end.cep,
          },
        }
      : {}),
  };
}

/**
 * Monta o corpo aceito por `AtualizarClienteDto`.
 *
 * `tipo`, `cpf` e `cnpj` são imutáveis no backend e `endereco` não faz parte do
 * DTO de atualização (tem endpoint próprio) — enviá-los daria 400.
 */
function montarPayloadAtualizacao(dto: Partial<FornecedorDto>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (dto.tipo === 'PF' && dto.nome !== undefined) payload.nome = dto.nome.trim();
  if (dto.tipo === 'PJ') {
    const nome = dto.nomeFantasia || dto.razaoSocial;
    if (nome !== undefined) payload.nome = nome.trim();
    if (dto.razaoSocial !== undefined) payload.razaoSocial = dto.razaoSocial;
    if (dto.nomeFantasia !== undefined) payload.nomeFantasia = dto.nomeFantasia;
    if (dto.ieIsento !== undefined) payload.ieIsento = dto.ieIsento;
    if (dto.inscricaoEstadual !== undefined) {
      payload.inscricaoEstadual = dto.ieIsento ? '' : dto.inscricaoEstadual;
    }
    if (dto.inscricaoMunicipal !== undefined) payload.inscricaoMunicipal = dto.inscricaoMunicipal;
    if (dto.regimeTributario) payload.regimeTributario = dto.regimeTributario;
  }
  if (dto.rg !== undefined) payload.rg = dto.rg;
  if (dto.email !== undefined) payload.email = dto.email.trim();
  if (dto.telefone !== undefined) payload.telefone = dto.telefone;
  if (dto.prazoMedioPagamento !== undefined) payload.prazoPagamento = dto.prazoMedioPagamento;

  return payload;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const fornecedoresService = {
  /**
   * Lista os parceiros com papel FORNECEDOR.
   *
   * A paginação do customer-service usa `pagina`/`limite` (não
   * `itensPorPagina`) e `status` é um array no filtro.
   */
  listar: async (filtros?: FiltrosFornecedor): Promise<RespostaPaginada<Fornecedor>> => {
    const { data } = await api.get('/v1/clientes', {
      params: {
        papel: 'FORNECEDOR',
        busca: filtros?.busca,
        ...(filtros?.status ? { status: [filtros.status] } : {}),
        pagina: filtros?.pagina ?? 1,
        limite: filtros?.limite ?? 20,
      },
    });

    const envelope = (data ?? {}) as Record<string, unknown>;
    const lista = Array.isArray(envelope.dados) ? (envelope.dados as ParceiroApi[]) : [];
    const dados = lista.map(normalizarFornecedor);
    const total = paraNumero(envelope.total, dados.length);
    const limite = paraNumero(envelope.limite, filtros?.limite ?? 20);

    return {
      dados,
      total,
      pagina: paraNumero(envelope.pagina, filtros?.pagina ?? 1),
      limite,
      totalPaginas: paraNumero(envelope.totalPaginas, limite > 0 ? Math.ceil(total / limite) : 1),
    };
  },

  buscarPorId: async (id: string): Promise<Fornecedor> => {
    const { data } = await api.get(`/v1/clientes/${id}`);
    return normalizarFornecedor(data as ParceiroApi);
  },

  /** Cria o parceiro já com o papel FORNECEDOR e ATIVO. */
  criar: async (dto: FornecedorDto): Promise<Fornecedor> => {
    const { data } = await api.post('/v1/clientes', montarPayloadCriacao(dto));
    return normalizarFornecedor(data as ParceiroApi);
  },

  atualizar: async (id: string, dto: Partial<FornecedorDto>): Promise<Fornecedor> => {
    const { data } = await api.put(`/v1/clientes/${id}`, montarPayloadAtualizacao(dto));
    return normalizarFornecedor(data as ParceiroApi);
  },

  /** Soft delete: o backend marca o parceiro como INATIVO (HTTP 204). */
  remover: async (id: string): Promise<void> => {
    await api.delete(`/v1/clientes/${id}`);
  },
};
