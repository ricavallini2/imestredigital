/**
 * Cliente HTTP do CAIXA (sessão de PDV / balcão).
 *
 * Conversa com o módulo real `api/v1/caixa` do order-service (e, sem
 * `USE_MICROSERVICES=true`, com os route handlers mock de `app/api/v1/caixa`,
 * que seguem o mesmo contrato).
 *
 * Toda a tradução acontece AQUI, na fronteira da API, para as telas consumirem
 * um shape estável:
 *  - `Decimal` (o Prisma serializa como STRING no JSON) → `number`.
 *    As telas chamam `fmt(v)` → `v.toLocaleString(...)` direto no valor: uma
 *    string passaria batido no formato e `undefined` quebraria a página.
 *  - `null` (Prisma) → `undefined` nos campos opcionais. As telas testam
 *    `s.diferenca !== undefined` para decidir se mostram a divergência —
 *    `null` faria a sessão ABERTA exibir "+R$ 0,00".
 *  - campos ausentes → default seguro (nunca `undefined` em campo obrigatório).
 *  - `Date` → string ISO (as telas fazem `new Date(iso)`).
 */

import api from '@/lib/api';

// ─── Tipos de apresentação ────────────────────────────────────────────────────

export type StatusSessaoCaixa = 'ABERTO' | 'FECHADO';

export type TipoMovimentacaoCaixa = 'ENTRADA' | 'SAIDA';

export type CategoriaMovimentacaoCaixa =
  | 'VENDA'
  | 'SUPRIMENTO'
  | 'SANGRIA'
  | 'DESPESA'
  | 'REEMBOLSO'
  | 'OUTROS';

/** Espelha o enum `TipoPagamento` do order-service. */
export type FormaPagamentoCaixa =
  | 'DINHEIRO'
  | 'PIX'
  | 'CARTAO_CREDITO'
  | 'CARTAO_DEBITO'
  | 'BOLETO'
  | 'TRANSFERENCIA'
  | 'MARKETPLACE';

/** Quebra do movimento do turno por forma de pagamento (derivado no backend). */
export interface TotalPorFormaCaixa {
  formaPagamento: string;
  entradas: number;
  saidas: number;
  liquido: number;
  quantidade: number;
}

export interface SessaoCaixa {
  id: string;
  /** Ex.: "CAIXA-2026-003" — sequencial por tenant/ano. */
  numero: string;
  status: StatusSessaoCaixa;
  /** Terminal ("Caixa 01"). String livre: não há cadastro de terminais. */
  caixa: string;
  operador: string;
  aberturaEm: string;
  valorAbertura: number;
  totalEntradas: number;
  totalSaidas: number;
  /** valorAbertura + entradas − saídas, TODAS as formas de pagamento. */
  saldoEsperado: number;
  /** Só dinheiro — é este o valor que deve bater com a gaveta na conferência. */
  saldoEsperadoDinheiro: number;
  qtdMovimentacoes: number;
  totaisPorForma: TotalPorFormaCaixa[];
  fechamentoEm?: string;
  valorContado?: number;
  /**
   * Snapshot do `saldoEsperadoDinheiro` no instante do fechamento — a base real
   * da conferência, gravada pelo backend. É o par de `valorContado` e
   * `diferenca`. Ausente enquanto a sessão está ABERTO (não houve conferência).
   */
  valorEsperado?: number;
  /**
   * valorContado − valorEsperado (o esperado NA GAVETA, só dinheiro — nunca o
   * `saldoEsperado`, que inclui cartão e PIX). Ausente enquanto a sessão está
   * ABERTO.
   */
  diferenca?: number;
  observacoesFechamento?: string;
}

/**
 * Base REAL da conferência: o que se espera encontrar NA GAVETA.
 *
 * É contra este número — e só contra ele — que `valorContado` e `diferenca`
 * fazem sentido. Fechada, vale o snapshot gravado no fechamento
 * (`valorEsperado`); aberta, ou vinda de backend/mock que ainda não expõe o
 * campo, vale o esperado em dinheiro calculado agora.
 *
 * Nunca use `saldoEsperado` no lugar: ele inclui cartão e PIX, que não estão
 * fisicamente na gaveta — os três números não fechariam na tela de auditoria.
 */
export function baseConferencia(sessao: SessaoCaixa): number {
  return sessao.valorEsperado ?? sessao.saldoEsperadoDinheiro;
}

export interface MovimentacaoCaixa {
  id: string;
  sessaoId: string;
  tipo: TipoMovimentacaoCaixa;
  categoria: CategoriaMovimentacaoCaixa;
  descricao: string;
  /** Sempre POSITIVO: o sinal vem de `tipo`. */
  valor: number;
  formaPagamento?: string;
  pedidoId?: string;
  pedidoNumero?: string;
  operador: string;
  criadoEm: string;
}

/**
 * Resposta de `GET /v1/caixa/atual`.
 *
 * Sempre 200: sem turno em andamento vem `{ aberto: false, sessao: undefined }`.
 * O PDV usa `aberto` como guard — um 404 aqui derrubaria a tela.
 */
export interface CaixaAtual {
  aberto: boolean;
  sessao?: SessaoCaixa;
  movimentacoes: MovimentacaoCaixa[];
}

export interface SessoesCaixa {
  sessoes: SessaoCaixa[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export interface DetalheSessaoCaixa {
  sessao?: SessaoCaixa;
  movimentacoes: MovimentacaoCaixa[];
}

// ─── DTOs de entrada ──────────────────────────────────────────────────────────

export interface AbrirCaixaDTO {
  caixa?: string;
  operador: string;
  valorAbertura: number;
  observacoes?: string;
}

export interface FecharCaixaDTO {
  valorContado: number;
  observacoes?: string;
}

export interface MovimentacaoDTO {
  categoria: CategoriaMovimentacaoCaixa;
  /**
   * Opcional e ignorado pelo backend, exceto em `OUTROS` (única categoria sem
   * sinal fixo): o tipo é derivado da categoria.
   */
  tipo?: TipoMovimentacaoCaixa;
  descricao: string;
  valor: number;
  formaPagamento?: string;
  pedidoNumero?: string;
  operador?: string;
}

export interface FiltrosSessoesCaixa {
  pagina?: number;
  limite?: number;
}

// ─── Shape cru devolvido pela API ─────────────────────────────────────────────

interface TotalPorFormaApi {
  formaPagamento?: string | null;
  entradas?: string | number | null;
  saidas?: string | number | null;
  liquido?: string | number | null;
  quantidade?: number | null;
}

interface SessaoCaixaApi {
  id?: string | null;
  numero?: string | null;
  status?: string | null;
  caixa?: string | null;
  operador?: string | null;
  aberturaEm?: string | null;
  /** Decimais — chegam como string no JSON quando vêm do Prisma. */
  valorAbertura?: string | number | null;
  totalEntradas?: string | number | null;
  totalSaidas?: string | number | null;
  saldoEsperado?: string | number | null;
  saldoEsperadoDinheiro?: string | number | null;
  qtdMovimentacoes?: number | null;
  totaisPorForma?: TotalPorFormaApi[] | null;
  fechamentoEm?: string | null;
  valorContado?: string | number | null;
  valorEsperado?: string | number | null;
  diferenca?: string | number | null;
  observacoesFechamento?: string | null;
}

interface MovimentacaoCaixaApi {
  id?: string | null;
  sessaoId?: string | null;
  tipo?: string | null;
  categoria?: string | null;
  descricao?: string | null;
  valor?: string | number | null;
  formaPagamento?: string | null;
  pedidoId?: string | null;
  pedidoNumero?: string | null;
  operador?: string | null;
  criadoEm?: string | null;
}

// ─── Helpers de normalização ──────────────────────────────────────────────────

const CATEGORIAS: CategoriaMovimentacaoCaixa[] = [
  'VENDA',
  'SUPRIMENTO',
  'SANGRIA',
  'DESPESA',
  'REEMBOLSO',
  'OUTROS',
];

/**
 * Decimal (string) / number / null → number seguro.
 *
 * `null` e `undefined` são tratados ANTES do `Number()`: `Number(null)` é 0, o
 * que faria um campo ausente virar 0 em vez de cair no `padrao`.
 */
function paraNumero(valor: unknown, padrao = 0): number {
  if (valor == null || valor === '') return padrao;
  const n = Number(valor);
  return Number.isFinite(n) ? n : padrao;
}

/** Igual a `paraNumero`, mas preserva a ausência (não inventa 0). */
function paraNumeroOpcional(valor: unknown): number | undefined {
  if (valor == null || valor === '') return undefined;
  const n = Number(valor);
  return Number.isFinite(n) ? n : undefined;
}

/** `null` do Prisma → `undefined`; string vazia também conta como ausente. */
function paraTexto(valor?: string | null): string | undefined {
  return valor ? valor : undefined;
}

/** Date (serializada) → string ISO. Campo obrigatório: nunca devolve undefined. */
function paraData(valor?: string | null): string {
  return valor ?? '';
}

function normalizarStatus(status?: string | null): StatusSessaoCaixa {
  return status === 'FECHADO' ? 'FECHADO' : 'ABERTO';
}

function normalizarTipo(tipo?: string | null): TipoMovimentacaoCaixa {
  return tipo === 'SAIDA' ? 'SAIDA' : 'ENTRADA';
}

function normalizarCategoria(categoria?: string | null): CategoriaMovimentacaoCaixa {
  return CATEGORIAS.includes(categoria as CategoriaMovimentacaoCaixa)
    ? (categoria as CategoriaMovimentacaoCaixa)
    : 'OUTROS';
}

export function normalizarSessaoCaixa(bruta: SessaoCaixaApi): SessaoCaixa {
  const valorAbertura = paraNumero(bruta.valorAbertura);
  const totalEntradas = paraNumero(bruta.totalEntradas);
  const totalSaidas = paraNumero(bruta.totalSaidas);
  // Os totais são derivados no backend; o fallback cobre uma resposta parcial.
  const saldoEsperado = paraNumero(
    bruta.saldoEsperado,
    valorAbertura + totalEntradas - totalSaidas,
  );

  return {
    id: bruta.id ?? '',
    numero: bruta.numero ?? '',
    status: normalizarStatus(bruta.status),
    caixa: bruta.caixa ?? '',
    operador: bruta.operador ?? '',
    aberturaEm: paraData(bruta.aberturaEm),
    valorAbertura,
    totalEntradas,
    totalSaidas,
    saldoEsperado,
    // O mock não expõe este campo: degrada para o saldo de todas as formas.
    saldoEsperadoDinheiro: paraNumero(bruta.saldoEsperadoDinheiro, saldoEsperado),
    qtdMovimentacoes: paraNumero(bruta.qtdMovimentacoes),
    totaisPorForma: (bruta.totaisPorForma ?? []).map((t) => ({
      formaPagamento: t.formaPagamento ?? 'NAO_INFORMADO',
      entradas: paraNumero(t.entradas),
      saidas: paraNumero(t.saidas),
      liquido: paraNumero(t.liquido, paraNumero(t.entradas) - paraNumero(t.saidas)),
      quantidade: paraNumero(t.quantidade),
    })),
    fechamentoEm: paraTexto(bruta.fechamentoEm),
    valorContado: paraNumeroOpcional(bruta.valorContado),
    // `undefined` (e não 0) enquanto o caixa está aberto: o snapshot só nasce no
    // fechamento, e um 0 aqui seria lido como "esperava-se gaveta vazia".
    valorEsperado: paraNumeroOpcional(bruta.valorEsperado),
    // `undefined` (e não 0) enquanto o caixa está aberto: as telas usam a
    // ausência para esconder o bloco de divergência.
    diferenca: paraNumeroOpcional(bruta.diferenca),
    observacoesFechamento: paraTexto(bruta.observacoesFechamento),
  };
}

export function normalizarMovimentacaoCaixa(bruta: MovimentacaoCaixaApi): MovimentacaoCaixa {
  return {
    id: bruta.id ?? '',
    sessaoId: bruta.sessaoId ?? '',
    tipo: normalizarTipo(bruta.tipo),
    categoria: normalizarCategoria(bruta.categoria),
    descricao: bruta.descricao ?? '',
    valor: paraNumero(bruta.valor),
    formaPagamento: paraTexto(bruta.formaPagamento),
    pedidoId: paraTexto(bruta.pedidoId),
    pedidoNumero: paraTexto(bruta.pedidoNumero),
    operador: bruta.operador ?? '',
    criadoEm: paraData(bruta.criadoEm),
  };
}

function normalizarMovimentacoes(brutas: unknown): MovimentacaoCaixa[] {
  return Array.isArray(brutas) ? brutas.map(normalizarMovimentacaoCaixa) : [];
}

// ─── Service ──────────────────────────────────────────────────────────────────

const LIMITE_PADRAO = 50;

export const caixaService = {
  /** Histórico de sessões, mais recente primeiro. */
  listar: async (filtros?: FiltrosSessoesCaixa): Promise<SessoesCaixa> => {
    const pagina = filtros?.pagina ?? 1;
    const limite = filtros?.limite ?? LIMITE_PADRAO;

    const { data } = await api.get('/v1/caixa', { params: { pagina, limite } });

    const envelope = (data ?? {}) as Record<string, unknown>;
    const lista = Array.isArray(envelope.sessoes) ? (envelope.sessoes as SessaoCaixaApi[]) : [];
    const sessoes = lista.map(normalizarSessaoCaixa);
    const total = paraNumero(envelope.total, sessoes.length);
    // O mock não devolve paginação: os defaults do request valem como resposta.
    const limiteResposta = paraNumero(envelope.limite, limite);

    return {
      sessoes,
      total,
      pagina: paraNumero(envelope.pagina, pagina),
      limite: limiteResposta,
      totalPaginas: paraNumero(
        envelope.totalPaginas,
        limiteResposta > 0 ? Math.ceil(total / limiteResposta) : 1,
      ),
    };
  },

  /** Sessão aberta do tenant + movimentações do turno. Sempre 200. */
  obterAtual: async (): Promise<CaixaAtual> => {
    const { data } = await api.get('/v1/caixa/atual');

    const envelope = (data ?? {}) as Record<string, unknown>;
    const sessaoBruta = envelope.sessao as SessaoCaixaApi | null | undefined;
    const sessao = sessaoBruta ? normalizarSessaoCaixa(sessaoBruta) : undefined;

    return {
      // `aberto` só é verdade se houver sessão de fato: o guard do PDV lê os
      // dois campos, e uma flag sem sessão renderizaria um turno vazio.
      aberto: Boolean(envelope.aberto) && sessao !== undefined,
      sessao,
      movimentacoes: normalizarMovimentacoes(envelope.movimentacoes),
    };
  },

  /** Detalhe da sessão. 404 no backend vira exceção do axios (tratada na tela). */
  obterPorId: async (id: string): Promise<DetalheSessaoCaixa> => {
    const { data } = await api.get(`/v1/caixa/${id}`);

    const envelope = (data ?? {}) as Record<string, unknown>;
    const sessaoBruta = envelope.sessao as SessaoCaixaApi | null | undefined;

    return {
      sessao: sessaoBruta ? normalizarSessaoCaixa(sessaoBruta) : undefined,
      movimentacoes: normalizarMovimentacoes(envelope.movimentacoes),
    };
  },

  /** Abre o turno. 409 se já houver caixa aberto no tenant. */
  abrir: async (dto: AbrirCaixaDTO): Promise<SessaoCaixa> => {
    const { data } = await api.post('/v1/caixa', {
      operador: dto.operador,
      valorAbertura: dto.valorAbertura,
      // O backend roda com `forbidNonWhitelisted`: string vazia é campo ausente,
      // não um valor a enviar.
      ...(dto.caixa ? { caixa: dto.caixa } : {}),
      ...(dto.observacoes ? { observacoes: dto.observacoes } : {}),
    });
    return normalizarSessaoCaixa((data ?? {}) as SessaoCaixaApi);
  },

  /** Fecha o turno conferindo o contado. 404 inexistente · 422 já fechado. */
  fechar: async (id: string, dto: FecharCaixaDTO): Promise<SessaoCaixa> => {
    const { data } = await api.post(`/v1/caixa/${id}/fechar`, {
      valorContado: dto.valorContado,
      ...(dto.observacoes ? { observacoes: dto.observacoes } : {}),
    });
    return normalizarSessaoCaixa((data ?? {}) as SessaoCaixaApi);
  },

  /** Suprimento / sangria / despesa / outros. 422 se o caixa estiver fechado. */
  registrarMovimentacao: async (id: string, dto: MovimentacaoDTO): Promise<MovimentacaoCaixa> => {
    const { data } = await api.post(`/v1/caixa/${id}/movimentacoes`, {
      categoria: dto.categoria,
      descricao: dto.descricao,
      valor: dto.valor,
      ...(dto.tipo ? { tipo: dto.tipo } : {}),
      ...(dto.formaPagamento ? { formaPagamento: dto.formaPagamento } : {}),
      ...(dto.pedidoNumero ? { pedidoNumero: dto.pedidoNumero } : {}),
      ...(dto.operador ? { operador: dto.operador } : {}),
    });
    return normalizarMovimentacaoCaixa((data ?? {}) as MovimentacaoCaixaApi);
  },
};
