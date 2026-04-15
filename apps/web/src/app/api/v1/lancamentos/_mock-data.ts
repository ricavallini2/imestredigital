// ─── Interface ────────────────────────────────────────────────────────────────

export interface LancamentoMock {
  id: string;
  tipo: 'RECEITA' | 'DESPESA';
  descricao: string;
  valor: number;
  categoria: string;
  categoriaId: string;
  subcategoria?: string;
  contaId: string;
  conta: string;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
  dataVencimento: string;
  dataPagamento?: string;
  origem: 'MANUAL' | 'PEDIDO' | 'COMPRA' | 'CAIXA';
  origemId?: string;
  recorrente: boolean;
  observacoes?: string;
  // Integração com clientes (recebíveis de clientes específicos)
  clienteId?: string;
  clienteNome?: string;
  clienteTelefone?: string;
  clienteEmail?: string;
  // Indica se já foi enviado para cobrança
  emCobranca?: boolean;
  cobrancaTituloId?: string;
  criadoEm: string;
  atualizadoEm: string;
}

// ─── globalThis declarations ──────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __lancamentosMock: LancamentoMock[] | undefined;
  // eslint-disable-next-line no-var
  var __lancamentosSeq: number | undefined;
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_LANCAMENTOS: LancamentoMock[] = [
  // ── RECEITAS ──────────────────────────────────────────────────────────────
  {
    id: 'lan-001', tipo: 'RECEITA', descricao: 'Vendas Balcão - Janeiro',
    valor: 12500, categoria: 'Vendas', categoriaId: 'cat-r01',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-01-31', dataPagamento: '2026-01-31',
    origem: 'CAIXA', recorrente: false,
    criadoEm: '2026-01-31T18:00:00.000Z', atualizadoEm: '2026-01-31T18:00:00.000Z',
  },
  {
    id: 'lan-002', tipo: 'RECEITA', descricao: 'Vendas Mercado Livre - Janeiro',
    valor: 8300, categoria: 'Marketplaces', categoriaId: 'cat-r02',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-01-28', dataPagamento: '2026-01-28',
    origem: 'PEDIDO', recorrente: false,
    criadoEm: '2026-01-28T15:00:00.000Z', atualizadoEm: '2026-01-28T15:00:00.000Z',
  },
  {
    id: 'lan-003', tipo: 'RECEITA', descricao: 'Vendas Shopee - Janeiro',
    valor: 4200, categoria: 'Marketplaces', categoriaId: 'cat-r02',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-01-28', dataPagamento: '2026-01-28',
    origem: 'PEDIDO', recorrente: false,
    criadoEm: '2026-01-28T15:30:00.000Z', atualizadoEm: '2026-01-28T15:30:00.000Z',
  },
  {
    id: 'lan-004', tipo: 'RECEITA', descricao: 'Vendas Balcão - Fevereiro',
    valor: 14800, categoria: 'Vendas', categoriaId: 'cat-r01',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-02-28', dataPagamento: '2026-02-28',
    origem: 'CAIXA', recorrente: false,
    criadoEm: '2026-02-28T18:00:00.000Z', atualizadoEm: '2026-02-28T18:00:00.000Z',
  },
  {
    id: 'lan-005', tipo: 'RECEITA', descricao: 'Vendas Mercado Livre - Fevereiro',
    valor: 9600, categoria: 'Marketplaces', categoriaId: 'cat-r02',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-02-25', dataPagamento: '2026-02-25',
    origem: 'PEDIDO', recorrente: false,
    criadoEm: '2026-02-25T14:00:00.000Z', atualizadoEm: '2026-02-25T14:00:00.000Z',
  },
  {
    id: 'lan-006', tipo: 'RECEITA', descricao: 'Serviços Técnicos - Fevereiro',
    valor: 2500, categoria: 'Serviços', categoriaId: 'cat-r03',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-02-20', dataPagamento: '2026-02-20',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-02-20T10:00:00.000Z', atualizadoEm: '2026-02-20T10:00:00.000Z',
  },
  {
    id: 'lan-007', tipo: 'RECEITA', descricao: 'Vendas Balcão - Março',
    valor: 11200, categoria: 'Vendas', categoriaId: 'cat-r01',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-03-31', dataPagamento: '2026-03-31',
    origem: 'CAIXA', recorrente: false,
    criadoEm: '2026-03-31T18:00:00.000Z', atualizadoEm: '2026-03-31T18:00:00.000Z',
  },
  {
    id: 'lan-008', tipo: 'RECEITA', descricao: 'Vendas Mercado Livre - Março',
    valor: 7900, categoria: 'Marketplaces', categoriaId: 'cat-r02',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-03-28', dataPagamento: '2026-03-28',
    origem: 'PEDIDO', recorrente: false,
    criadoEm: '2026-03-28T14:00:00.000Z', atualizadoEm: '2026-03-28T14:00:00.000Z',
  },
  {
    id: 'lan-009', tipo: 'RECEITA', descricao: 'Vendas Shopee - Março',
    valor: 3800, categoria: 'Marketplaces', categoriaId: 'cat-r02',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-03-28', dataPagamento: '2026-03-28',
    origem: 'PEDIDO', recorrente: false,
    criadoEm: '2026-03-28T14:30:00.000Z', atualizadoEm: '2026-03-28T14:30:00.000Z',
  },
  {
    id: 'lan-010', tipo: 'RECEITA', descricao: 'Consultoria / Serviços - Março',
    valor: 3200, categoria: 'Serviços', categoriaId: 'cat-r03',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-03-15', dataPagamento: '2026-03-15',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-03-15T09:00:00.000Z', atualizadoEm: '2026-03-15T09:00:00.000Z',
  },
  {
    id: 'lan-011', tipo: 'RECEITA', descricao: 'Vendas Balcão - Abril (semana 1)',
    valor: 3800, categoria: 'Vendas', categoriaId: 'cat-r01',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-04-03', dataPagamento: '2026-04-03',
    origem: 'CAIXA', recorrente: false,
    criadoEm: '2026-04-03T18:00:00.000Z', atualizadoEm: '2026-04-03T18:00:00.000Z',
  },
  {
    id: 'lan-012', tipo: 'RECEITA', descricao: 'Vendas Online - Abril',
    valor: 6700, categoria: 'Marketplaces', categoriaId: 'cat-r02',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PENDENTE',
    dataVencimento: '2026-04-28',
    origem: 'PEDIDO', recorrente: false,
    criadoEm: '2026-04-04T08:00:00.000Z', atualizadoEm: '2026-04-04T08:00:00.000Z',
  },
  {
    id: 'lan-013', tipo: 'RECEITA', descricao: 'Serviços e Consultoria - Abril',
    valor: 5200, categoria: 'Serviços', categoriaId: 'cat-r03',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PENDENTE',
    dataVencimento: '2026-04-25',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-04-04T08:30:00.000Z', atualizadoEm: '2026-04-04T08:30:00.000Z',
  },
  {
    id: 'lan-014', tipo: 'RECEITA', descricao: 'Rendimentos Aplicação Financeira',
    valor: 480, categoria: 'Financeiro', categoriaId: 'cat-r04',
    contaId: 'cb-003', conta: 'Bradesco Poupança', status: 'PENDENTE',
    dataVencimento: '2026-04-30',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-04-04T09:00:00.000Z', atualizadoEm: '2026-04-04T09:00:00.000Z',
  },
  {
    id: 'lan-015', tipo: 'RECEITA', descricao: 'Vendas Balcão - Abril (projeção)',
    valor: 9700, categoria: 'Vendas', categoriaId: 'cat-r01',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PENDENTE',
    dataVencimento: '2026-04-30',
    origem: 'CAIXA', recorrente: false,
    criadoEm: '2026-04-04T09:30:00.000Z', atualizadoEm: '2026-04-04T09:30:00.000Z',
  },

  // ── DESPESAS ──────────────────────────────────────────────────────────────
  {
    id: 'lan-016', tipo: 'DESPESA', descricao: 'Aluguel - Janeiro',
    valor: 3500, categoria: 'Ocupação', categoriaId: 'cat-d01',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-01-05', dataPagamento: '2026-01-05',
    origem: 'MANUAL', recorrente: true,
    criadoEm: '2026-01-01T08:00:00.000Z', atualizadoEm: '2026-01-05T10:00:00.000Z',
  },
  {
    id: 'lan-017', tipo: 'DESPESA', descricao: 'Salários e Encargos - Janeiro',
    valor: 12000, categoria: 'Pessoal', categoriaId: 'cat-d02',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-01-10', dataPagamento: '2026-01-10',
    origem: 'MANUAL', recorrente: true,
    criadoEm: '2026-01-01T08:00:00.000Z', atualizadoEm: '2026-01-10T14:00:00.000Z',
  },
  {
    id: 'lan-018', tipo: 'DESPESA', descricao: 'Energia Elétrica - Janeiro',
    valor: 850, categoria: 'Operacional', categoriaId: 'cat-d03',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-01-15', dataPagamento: '2026-01-15',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-01-10T08:00:00.000Z', atualizadoEm: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'lan-019', tipo: 'DESPESA', descricao: 'Internet e Telecom - Janeiro',
    valor: 280, categoria: 'Operacional', categoriaId: 'cat-d03',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-01-10', dataPagamento: '2026-01-10',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-01-05T08:00:00.000Z', atualizadoEm: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'lan-020', tipo: 'DESPESA', descricao: 'Aluguel - Fevereiro',
    valor: 3500, categoria: 'Ocupação', categoriaId: 'cat-d01',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-02-05', dataPagamento: '2026-02-05',
    origem: 'MANUAL', recorrente: true,
    criadoEm: '2026-02-01T08:00:00.000Z', atualizadoEm: '2026-02-05T10:00:00.000Z',
  },
  {
    id: 'lan-021', tipo: 'DESPESA', descricao: 'Salários e Encargos - Fevereiro',
    valor: 12000, categoria: 'Pessoal', categoriaId: 'cat-d02',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-02-10', dataPagamento: '2026-02-10',
    origem: 'MANUAL', recorrente: true,
    criadoEm: '2026-02-01T08:00:00.000Z', atualizadoEm: '2026-02-10T14:00:00.000Z',
  },
  {
    id: 'lan-022', tipo: 'DESPESA', descricao: 'Marketing e Publicidade - Fevereiro',
    valor: 2000, categoria: 'Marketing', categoriaId: 'cat-d04',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-02-20', dataPagamento: '2026-02-20',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-02-15T08:00:00.000Z', atualizadoEm: '2026-02-20T10:00:00.000Z',
  },
  {
    id: 'lan-023', tipo: 'DESPESA', descricao: 'Aluguel - Março',
    valor: 3500, categoria: 'Ocupação', categoriaId: 'cat-d01',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-03-05', dataPagamento: '2026-03-05',
    origem: 'MANUAL', recorrente: true,
    criadoEm: '2026-03-01T08:00:00.000Z', atualizadoEm: '2026-03-05T10:00:00.000Z',
  },
  {
    id: 'lan-024', tipo: 'DESPESA', descricao: 'Salários e Encargos - Março',
    valor: 12500, categoria: 'Pessoal', categoriaId: 'cat-d02',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-03-10', dataPagamento: '2026-03-10',
    origem: 'MANUAL', recorrente: true,
    criadoEm: '2026-03-01T08:00:00.000Z', atualizadoEm: '2026-03-10T14:00:00.000Z',
  },
  {
    id: 'lan-025', tipo: 'DESPESA', descricao: 'Impostos e Tributos - Março',
    valor: 4200, categoria: 'Impostos', categoriaId: 'cat-d05',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-03-20', dataPagamento: '2026-03-20',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-03-15T08:00:00.000Z', atualizadoEm: '2026-03-20T10:00:00.000Z',
  },
  {
    id: 'lan-026', tipo: 'DESPESA', descricao: 'Fornecedores / Compras Estoque - Março',
    valor: 7800, categoria: 'Compras', categoriaId: 'cat-d06',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PAGO',
    dataVencimento: '2026-03-25', dataPagamento: '2026-03-25',
    origem: 'COMPRA', recorrente: false,
    criadoEm: '2026-03-20T08:00:00.000Z', atualizadoEm: '2026-03-25T10:00:00.000Z',
  },
  {
    id: 'lan-027', tipo: 'DESPESA', descricao: 'Aluguel - Abril',
    valor: 3500, categoria: 'Ocupação', categoriaId: 'cat-d01',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'ATRASADO',
    dataVencimento: '2026-04-01',
    origem: 'MANUAL', recorrente: true,
    criadoEm: '2026-04-01T08:00:00.000Z', atualizadoEm: '2026-04-04T08:00:00.000Z',
  },
  {
    id: 'lan-028', tipo: 'DESPESA', descricao: 'Impostos e Tributos - Abril',
    valor: 3800, categoria: 'Impostos', categoriaId: 'cat-d05',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'ATRASADO',
    dataVencimento: '2026-04-01',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-04-01T08:00:00.000Z', atualizadoEm: '2026-04-04T08:00:00.000Z',
  },
  {
    id: 'lan-029', tipo: 'DESPESA', descricao: 'Salários e Encargos - Abril',
    valor: 13000, categoria: 'Pessoal', categoriaId: 'cat-d02',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PENDENTE',
    dataVencimento: '2026-04-10',
    origem: 'MANUAL', recorrente: true,
    criadoEm: '2026-04-04T08:00:00.000Z', atualizadoEm: '2026-04-04T08:00:00.000Z',
  },
  {
    id: 'lan-030', tipo: 'DESPESA', descricao: 'Energia Elétrica - Abril',
    valor: 920, categoria: 'Operacional', categoriaId: 'cat-d03',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PENDENTE',
    dataVencimento: '2026-04-15',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-04-04T09:00:00.000Z', atualizadoEm: '2026-04-04T09:00:00.000Z',
  },
  {
    id: 'lan-031', tipo: 'DESPESA', descricao: 'Marketing e Publicidade - Abril',
    valor: 2200, categoria: 'Marketing', categoriaId: 'cat-d04',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PENDENTE',
    dataVencimento: '2026-04-20',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-04-04T09:00:00.000Z', atualizadoEm: '2026-04-04T09:00:00.000Z',
  },
  {
    id: 'lan-032', tipo: 'DESPESA', descricao: 'Plano de Saúde Empresarial',
    valor: 1800, categoria: 'Pessoal', categoriaId: 'cat-d02',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'PENDENTE',
    dataVencimento: '2026-04-28',
    origem: 'MANUAL', recorrente: false,
    criadoEm: '2026-04-04T09:00:00.000Z', atualizadoEm: '2026-04-04T09:00:00.000Z',
  },

  // ── RECEBÍVEIS ATRASADOS DE CLIENTES (integração com Cobrança) ────────────
  {
    id: 'lan-033', tipo: 'RECEITA', descricao: 'Consultoria de TI — Fatura 02/2026',
    valor: 4500, categoria: 'Serviços', categoriaId: 'cat-r03',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'ATRASADO',
    dataVencimento: '2026-02-28',
    origem: 'MANUAL', recorrente: false,
    clienteId: 'cli-020', clienteNome: 'TechStart Soluções Ltda',
    clienteTelefone: '11991234567', clienteEmail: 'financeiro@techstart.com.br',
    emCobranca: false,
    criadoEm: '2026-02-01T08:00:00.000Z', atualizadoEm: '2026-03-05T08:00:00.000Z',
  },
  {
    id: 'lan-034', tipo: 'RECEITA', descricao: 'Venda Equipamentos — Pedido #5210',
    valor: 8200, categoria: 'Vendas', categoriaId: 'cat-r01',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'ATRASADO',
    dataVencimento: '2026-03-15',
    origem: 'PEDIDO', origemId: 'ped-5210', recorrente: false,
    clienteId: 'cli-021', clienteNome: 'Academia Fitness Express',
    clienteTelefone: '11977654321', clienteEmail: 'admin@fitnessexpress.com.br',
    emCobranca: false,
    criadoEm: '2026-03-01T09:00:00.000Z', atualizadoEm: '2026-03-20T08:00:00.000Z',
  },
  {
    id: 'lan-035', tipo: 'RECEITA', descricao: 'Serviços de Manutenção — Março/2026',
    valor: 2800, categoria: 'Serviços', categoriaId: 'cat-r03',
    contaId: 'cb-001', conta: 'Itaú Corrente', status: 'ATRASADO',
    dataVencimento: '2026-03-31',
    origem: 'MANUAL', recorrente: false,
    clienteId: 'cli-022', clienteNome: 'Farmácia Boa Saúde',
    clienteTelefone: '11965432187', clienteEmail: 'contato@boasaude.com.br',
    emCobranca: false,
    criadoEm: '2026-03-15T09:00:00.000Z', atualizadoEm: '2026-04-02T08:00:00.000Z',
  },
];

// ─── Persistência via globalThis ──────────────────────────────────────────────

if (!globalThis.__lancamentosMock) globalThis.__lancamentosMock = INITIAL_LANCAMENTOS;
if (!globalThis.__lancamentosSeq) globalThis.__lancamentosSeq = 36;

// Migração: insere entradas novas mesmo após hot-reload (globalThis já populado)
const _mock = globalThis.__lancamentosMock as LancamentoMock[];
for (const _id of ['lan-033', 'lan-034', 'lan-035']) {
  if (!_mock.some(l => l.id === _id)) {
    const entry = INITIAL_LANCAMENTOS.find(l => l.id === _id);
    if (entry) _mock.push(entry);
  }
}

export const LANCAMENTOS_MOCK: LancamentoMock[] = globalThis.__lancamentosMock;

export function nextIdLancamento(): string {
  const n = globalThis.__lancamentosSeq!;
  globalThis.__lancamentosSeq = n + 1;
  return `lan-${String(n).padStart(3, '0')}`;
}
