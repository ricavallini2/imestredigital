// Mock data para o módulo de Caixa (dev sem finance-service)
// globalThis garante array compartilhado entre rotas no Next.js dev

export type StatusCaixa = 'ABERTO' | 'FECHADO';
export type TipoMov    = 'ENTRADA' | 'SAIDA';
export type CategoriaMov =
  | 'VENDA' | 'SUPRIMENTO' | 'SANGRIA' | 'DESPESA' | 'REEMBOLSO' | 'OUTROS';
export type FormaPgtoMov =
  | 'DINHEIRO' | 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'MISTO';

export interface MovimentacaoCaixa {
  id: string;
  sessaoId: string;
  tipo: TipoMov;
  categoria: CategoriaMov;
  descricao: string;
  valor: number;
  formaPagamento?: FormaPgtoMov;
  pedidoNumero?: string;
  operador: string;
  criadoEm: string;
}

export interface SessaoCaixa {
  id: string;
  numero: string;
  status: StatusCaixa;
  caixa: string;
  operador: string;

  // Abertura
  aberturaEm: string;
  valorAbertura: number;
  observacoesAbertura?: string;

  // Fechamento
  fechamentoEm?: string;
  valorContado?: number;
  valorEsperado?: number;
  diferenca?: number;
  observacoesFechamento?: string;

  // Totais (recalculados em memória)
  totalEntradas: number;
  totalSaidas: number;
  saldoEsperado: number;
  qtdMovimentacoes: number;
}

// ─── Persistência ────────────────────────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var __caixaSessoes: SessaoCaixa[] | undefined;
  // eslint-disable-next-line no-var
  var __caixaMovs: MovimentacaoCaixa[] | undefined;
  // eslint-disable-next-line no-var
  var __caixaSeq: number | undefined;
}

const d = (dias: number, h = 0, m = 0) =>
  new Date(Date.now() - dias * 86400000 - h * 3600000 - m * 60000).toISOString();

// ─── Movimentações históricas ─────────────────────────────────────────────────
const INITIAL_MOVS: MovimentacaoCaixa[] = [
  // Sessão caixa-002 (anteontem — fechada)
  { id: 'mov-001', sessaoId: 'caixa-002', tipo: 'ENTRADA', categoria: 'VENDA',       descricao: 'Venda balcão #PED-2026-0006', valor: 1347, formaPagamento: 'DINHEIRO',       pedidoNumero: 'PED-2026-0006', operador: 'João Silva',  criadoEm: d(2, 7) },
  { id: 'mov-002', sessaoId: 'caixa-002', tipo: 'ENTRADA', categoria: 'VENDA',       descricao: 'Venda balcão #PED-2026-0009', valor: 8499, formaPagamento: 'CARTAO_CREDITO', pedidoNumero: 'PED-2026-0009', operador: 'João Silva',  criadoEm: d(2, 5) },
  { id: 'mov-003', sessaoId: 'caixa-002', tipo: 'SAIDA',   categoria: 'SANGRIA',     descricao: 'Sangria — depósito bancário',  valor: 5000, formaPagamento: 'DINHEIRO',       operador: 'João Silva',  criadoEm: d(2, 4) },
  { id: 'mov-004', sessaoId: 'caixa-002', tipo: 'ENTRADA', categoria: 'VENDA',       descricao: 'Venda balcão #PED-2026-0012', valor: 3999, formaPagamento: 'CARTAO_DEBITO',  pedidoNumero: 'PED-2026-0012', operador: 'João Silva',  criadoEm: d(2, 3) },
  { id: 'mov-005', sessaoId: 'caixa-002', tipo: 'SAIDA',   categoria: 'DESPESA',     descricao: 'Café e água para escritório',  valor:   87, formaPagamento: 'DINHEIRO',       operador: 'João Silva',  criadoEm: d(2, 2) },

  // Sessão caixa-001 (ontem — fechada)
  { id: 'mov-006', sessaoId: 'caixa-001', tipo: 'ENTRADA', categoria: 'VENDA',       descricao: 'Venda balcão PIX',            valor:  349, formaPagamento: 'PIX',            operador: 'Maria Santos', criadoEm: d(1, 7) },
  { id: 'mov-007', sessaoId: 'caixa-001', tipo: 'ENTRADA', categoria: 'SUPRIMENTO',  descricao: 'Reforço de troco',            valor:  300, formaPagamento: 'DINHEIRO',       operador: 'Maria Santos', criadoEm: d(1, 6) },
  { id: 'mov-008', sessaoId: 'caixa-001', tipo: 'ENTRADA', categoria: 'VENDA',       descricao: 'Venda balcão cartão',         valor: 2248, formaPagamento: 'CARTAO_DEBITO',  operador: 'Maria Santos', criadoEm: d(1, 5) },
  { id: 'mov-009', sessaoId: 'caixa-001', tipo: 'SAIDA',   categoria: 'SANGRIA',     descricao: 'Sangria parcial',             valor: 1500, formaPagamento: 'DINHEIRO',       operador: 'Maria Santos', criadoEm: d(1, 3) },
  { id: 'mov-010', sessaoId: 'caixa-001', tipo: 'SAIDA',   categoria: 'DESPESA',     descricao: 'Material de limpeza',         valor:  145, formaPagamento: 'DINHEIRO',       operador: 'Maria Santos', criadoEm: d(1, 2) },
  { id: 'mov-011', sessaoId: 'caixa-001', tipo: 'ENTRADA', categoria: 'VENDA',       descricao: 'Venda balcão dinheiro',       valor: 1899, formaPagamento: 'DINHEIRO',       operador: 'Maria Santos', criadoEm: d(1, 1) },

  // Sessão caixa-atual (hoje — ABERTA)
  { id: 'mov-012', sessaoId: 'caixa-atual', tipo: 'ENTRADA', categoria: 'VENDA',     descricao: 'Venda balcão #PED-2026-0014', valor: 2248, formaPagamento: 'PIX',            pedidoNumero: 'PED-2026-0014', operador: 'Ana Costa', criadoEm: d(0, 5) },
  { id: 'mov-013', sessaoId: 'caixa-atual', tipo: 'ENTRADA', categoria: 'VENDA',     descricao: 'Venda balcão #PED-2026-0009', valor: 8499, formaPagamento: 'CARTAO_CREDITO', pedidoNumero: 'PED-2026-0009', operador: 'Ana Costa', criadoEm: d(0, 4) },
  { id: 'mov-014', sessaoId: 'caixa-atual', tipo: 'SAIDA',   categoria: 'SANGRIA',   descricao: 'Sangria — valores do dia',    valor: 5000, formaPagamento: 'DINHEIRO',       operador: 'Ana Costa', criadoEm: d(0, 3) },
  { id: 'mov-015', sessaoId: 'caixa-atual', tipo: 'ENTRADA', categoria: 'VENDA',     descricao: 'Venda balcão #PED-2026-0012', valor: 3999, formaPagamento: 'CARTAO_DEBITO',  pedidoNumero: 'PED-2026-0012', operador: 'Ana Costa', criadoEm: d(0, 2) },
  { id: 'mov-016', sessaoId: 'caixa-atual', tipo: 'SAIDA',   categoria: 'DESPESA',   descricao: 'Embalagens e fita',           valor:   68, formaPagamento: 'DINHEIRO',       operador: 'Ana Costa', criadoEm: d(0, 1) },
  { id: 'mov-017', sessaoId: 'caixa-atual', tipo: 'ENTRADA', categoria: 'VENDA',     descricao: 'Venda balcão #PED-2026-0006', valor: 1347, formaPagamento: 'DINHEIRO',       pedidoNumero: 'PED-2026-0006', operador: 'Ana Costa', criadoEm: d(0, 0, 30) },
];

// ─── Cálculo de totais de uma sessão ─────────────────────────────────────────
export function calcularTotais(sessaoId: string, movs: MovimentacaoCaixa[], valorAbertura: number) {
  const sessaoMovs = movs.filter((m) => m.sessaoId === sessaoId);
  const totalEntradas = sessaoMovs.filter((m) => m.tipo === 'ENTRADA').reduce((s, m) => s + m.valor, 0);
  const totalSaidas   = sessaoMovs.filter((m) => m.tipo === 'SAIDA').reduce((s, m) => s + m.valor, 0);
  return {
    totalEntradas,
    totalSaidas,
    saldoEsperado: valorAbertura + totalEntradas - totalSaidas,
    qtdMovimentacoes: sessaoMovs.length,
  };
}

// ─── Sessões iniciais ─────────────────────────────────────────────────────────
function buildSessoes(movs: MovimentacaoCaixa[]): SessaoCaixa[] {
  const s: Omit<SessaoCaixa, 'totalEntradas'|'totalSaidas'|'saldoEsperado'|'qtdMovimentacoes'>[] = [
    {
      id: 'caixa-002', numero: 'CAIXA-2026-002', status: 'FECHADO',
      caixa: 'Caixa 01', operador: 'João Silva',
      aberturaEm: d(2, 8), valorAbertura: 200,
      fechamentoEm: d(2, 0, 30), valorContado: 9000, valorEsperado: 8959, diferenca: 41,
      observacoesFechamento: 'Diferença positiva — erro de troco',
    },
    {
      id: 'caixa-001', numero: 'CAIXA-2026-001', status: 'FECHADO',
      caixa: 'Caixa 01', operador: 'Maria Santos',
      aberturaEm: d(1, 8), valorAbertura: 200, observacoesAbertura: 'Turno normal',
      fechamentoEm: d(1, 0, 15), valorContado: 1003, valorEsperado: 1003, diferenca: 0,
      observacoesFechamento: 'Caixa correto',
    },
    {
      id: 'caixa-atual', numero: 'CAIXA-2026-003', status: 'ABERTO',
      caixa: 'Caixa 01', operador: 'Ana Costa',
      aberturaEm: d(0, 8), valorAbertura: 200, observacoesAbertura: 'Abertura normal do dia',
    },
  ];

  return s.map((sess) => {
    const tots = calcularTotais(sess.id, movs, sess.valorAbertura);
    return { ...sess, ...tots } as SessaoCaixa;
  });
}

// ─── Init globalThis ──────────────────────────────────────────────────────────
if (!globalThis.__caixaMovs)   globalThis.__caixaMovs   = INITIAL_MOVS;
if (!globalThis.__caixaSeq)    globalThis.__caixaSeq    = 4;
if (!globalThis.__caixaSessoes) globalThis.__caixaSessoes = buildSessoes(globalThis.__caixaMovs);

export const SESSOES_MOCK: SessaoCaixa[]       = globalThis.__caixaSessoes;
export const MOVS_MOCK:    MovimentacaoCaixa[] = globalThis.__caixaMovs;

export function nextNumeroCaixa(): string {
  const n = globalThis.__caixaSeq!;
  globalThis.__caixaSeq = n + 1;
  return `CAIXA-2026-${String(n).padStart(3, '0')}`;
}

export function getSessaoAtual(): SessaoCaixa | undefined {
  return SESSOES_MOCK.find((s) => s.status === 'ABERTO');
}

export function refreshTotais(sessao: SessaoCaixa) {
  const tots = calcularTotais(sessao.id, MOVS_MOCK, sessao.valorAbertura);
  Object.assign(sessao, tots);
}
