// ─── Interface ────────────────────────────────────────────────────────────────

export interface ContaBancariaMock {
  id: string;
  nome: string;
  tipo: 'CORRENTE' | 'POUPANCA' | 'CAIXA' | 'INVESTIMENTO' | 'DIGITAL';
  banco?: string;
  agencia?: string;
  numeroConta?: string;
  saldoInicial: number;
  saldoAtual: number;
  status: 'ATIVA' | 'INATIVA';
  cor: string;
  criadoEm: string;
}

// ─── globalThis declarations ──────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __contasBancariasMock: ContaBancariaMock[] | undefined;
  // eslint-disable-next-line no-var
  var __contasBancariasSeq: number | undefined;
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_CONTAS_BANCARIAS: ContaBancariaMock[] = [
  {
    id: 'cb-001', nome: 'Itaú Corrente', tipo: 'CORRENTE',
    banco: 'Itaú', agencia: '0001', numeroConta: '12345-6',
    saldoInicial: 40000, saldoAtual: 45200, status: 'ATIVA', cor: 'blue',
    criadoEm: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cb-002', nome: 'Caixa Principal', tipo: 'CAIXA',
    saldoInicial: 12000, saldoAtual: 15800, status: 'ATIVA', cor: 'green',
    criadoEm: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cb-003', nome: 'Bradesco Poupança', tipo: 'POUPANCA',
    banco: 'Bradesco', agencia: '0100', numeroConta: '9876-5',
    saldoInicial: 8000, saldoAtual: 8500, status: 'ATIVA', cor: 'purple',
    criadoEm: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'cb-004', nome: 'Nubank Digital', tipo: 'DIGITAL',
    banco: 'Nubank', saldoInicial: 10000, saldoAtual: 11200,
    status: 'ATIVA', cor: 'orange', criadoEm: '2026-01-01T08:00:00.000Z',
  },
];

// ─── Persistência via globalThis ──────────────────────────────────────────────

if (!globalThis.__contasBancariasMock) globalThis.__contasBancariasMock = INITIAL_CONTAS_BANCARIAS;
if (!globalThis.__contasBancariasSeq) globalThis.__contasBancariasSeq = INITIAL_CONTAS_BANCARIAS.length + 1;

export const CONTAS_BANCARIAS_MOCK: ContaBancariaMock[] = globalThis.__contasBancariasMock;
