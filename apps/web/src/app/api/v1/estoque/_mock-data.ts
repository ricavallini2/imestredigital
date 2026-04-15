// Mock data compartilhada para o módulo de estoque (dev sem inventory-service)
// Usa globalThis para sobreviver ao isolamento de módulos do Next.js dev
export const TENANT_ID = '10000000-0000-0000-0000-000000000001';

export interface DepositoMock {
  id: string; nome: string; descricao?: string; ativo: boolean;
  endereco?: string; area: number; responsavel: string;
}

export interface SaldoMock {
  id: string; produtoId: string; produto: string; sku: string;
  variacaoId?: string; variacao?: string; // ex: "Tamanho: 42", "Capacidade: 256GB"
  depositoId: string; deposito: string;
  fisico: number; reservado: number; disponivel: number;
  minimo: number; maximo: number;
  custo: number; preco: number;
  giro30d: number; // vendas últimos 30 dias
  status: 'NORMAL' | 'BAIXO' | 'CRITICO' | 'SEM_ESTOQUE';
}

export interface MovimentacaoMock {
  id: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA' | 'AJUSTE';
  produtoId: string; produto: string; sku: string;
  variacaoId?: string; variacao?: string; // ex: "Tamanho: 42"
  quantidade: number;
  depositoOrigemId?: string; depositoOrigem?: string;
  depositoDestinoId?: string; depositoDestino?: string;
  motivo?: string; responsavel: string; criadoEm: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __depositosMock: DepositoMock[] | undefined;
  // eslint-disable-next-line no-var
  var __saldosMock: SaldoMock[] | undefined;
  // eslint-disable-next-line no-var
  var __movimentacoesMock: MovimentacaoMock[] | undefined;
}

const d = (diasAtras: number) => new Date(Date.now() - diasAtras * 86400000).toISOString();
const h = (diasAtras: number, horasAtras = 0) =>
  new Date(Date.now() - diasAtras * 86400000 - horasAtras * 3600000).toISOString();

// ─── Depósitos ───────────────────────────────────────────────────────────────

const INITIAL_DEPOSITOS: DepositoMock[] = [
  { id: 'dep-001', nome: 'Principal', descricao: 'Depósito central de São Paulo', ativo: true, endereco: 'Rua das Flores, 123 - Vila Olímpia, São Paulo, SP', area: 500, responsavel: 'João Silva' },
  { id: 'dep-002', nome: 'Secundário', descricao: 'Depósito auxiliar', ativo: true, endereco: 'Av. Paulista, 456 - Bela Vista, São Paulo, SP', area: 200, responsavel: 'Maria Santos' },
  { id: 'dep-003', nome: 'Distribuição', descricao: 'Centro de distribuição e expedição', ativo: true, endereco: 'BR-116, km 50 - Guarulhos, SP', area: 1000, responsavel: 'Pedro Oliveira' },
];

// ─── Saldos (estoque por produto/depósito) ───────────────────────────────────

function calcStatus(fisico: number, minimo: number): SaldoMock['status'] {
  if (fisico <= 0) return 'SEM_ESTOQUE';
  if (fisico <= minimo * 0.5) return 'CRITICO';
  if (fisico <= minimo) return 'BAIXO';
  return 'NORMAL';
}

const INITIAL_SALDOS: Omit<SaldoMock, 'status' | 'disponivel'>[] = [
  // ── iPhone 15 Pro — por capacidade (dep-001) ─────────────────────────────
  { id: 's001a', produtoId: 'p0000001-0000-0000-0000-000000000001', produto: 'iPhone 15 Pro', sku: 'APPL-IP15P-128-PT', variacaoId: 'v001', variacao: 'Capacidade: 128GB', depositoId: 'dep-001', deposito: 'Principal', fisico: 8, reservado: 1, minimo: 3, maximo: 20, custo: 5100, preco: 7999, giro30d: 3 },
  { id: 's001b', produtoId: 'p0000001-0000-0000-0000-000000000001', produto: 'iPhone 15 Pro', sku: 'APPL-IP15P-256-PT', variacaoId: 'v002', variacao: 'Capacidade: 256GB', depositoId: 'dep-001', deposito: 'Principal', fisico: 12, reservado: 2, minimo: 5, maximo: 30, custo: 5800, preco: 8999, giro30d: 4 },
  { id: 's001c', produtoId: 'p0000001-0000-0000-0000-000000000001', produto: 'iPhone 15 Pro', sku: 'APPL-IP15P-512-PT', variacaoId: 'v003', variacao: 'Capacidade: 512GB', depositoId: 'dep-001', deposito: 'Principal', fisico: 4, reservado: 0, minimo: 2, maximo: 10, custo: 7000, preco: 10999, giro30d: 1 },
  // ── Samsung Galaxy S24 Ultra — por cor (dep-001) ─────────────────────────
  { id: 's003a', produtoId: 'p0000002-0000-0000-0000-000000000001', produto: 'Samsung Galaxy S24 Ultra', sku: 'SAMS-S24U-256-BK', variacaoId: 'v004', variacao: 'Cor: Preto Titânio', depositoId: 'dep-001', deposito: 'Principal', fisico: 10, reservado: 1, minimo: 3, maximo: 25, custo: 3900, preco: 6499, giro30d: 3 },
  { id: 's003b', produtoId: 'p0000002-0000-0000-0000-000000000001', produto: 'Samsung Galaxy S24 Ultra', sku: 'SAMS-S24U-256-SV', variacaoId: 'v005', variacao: 'Cor: Prata Titânio', depositoId: 'dep-001', deposito: 'Principal', fisico: 8, reservado: 1, minimo: 3, maximo: 20, custo: 3900, preco: 6499, giro30d: 2 },
  // ── Sony WH-1000XM5 — por cor (dep-001 + dep-002) ────────────────────────
  { id: 's004a', produtoId: 'p0000003-0000-0000-0000-000000000001', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-BK', variacaoId: 'v006', variacao: 'Cor: Preto', depositoId: 'dep-001', deposito: 'Principal', fisico: 20, reservado: 0, minimo: 5, maximo: 40, custo: 1100, preco: 1899, giro30d: 7 },
  { id: 's004b', produtoId: 'p0000003-0000-0000-0000-000000000001', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-SV', variacaoId: 'v007', variacao: 'Cor: Prata', depositoId: 'dep-001', deposito: 'Principal', fisico: 15, reservado: 0, minimo: 5, maximo: 30, custo: 1100, preco: 1999, giro30d: 5 },
  { id: 's005',  produtoId: 'p0000003-0000-0000-0000-000000000001', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-BK', variacaoId: 'v006', variacao: 'Cor: Preto', depositoId: 'dep-002', deposito: 'Secundário', fisico: 10, reservado: 0, minimo: 3, maximo: 15, custo: 1100, preco: 1899, giro30d: 3 },
  // ── Dell Notebook — variação Única ────────────────────────────────────────
  { id: 's006', produtoId: 'p0000004-0000-0000-0000-000000000001', produto: 'Notebook Dell Inspiron 15', sku: 'DELL-INS15-I5-512', variacaoId: 'v-dell-u1', variacao: 'Única', depositoId: 'dep-001', deposito: 'Principal', fisico: 12, reservado: 1, minimo: 3, maximo: 20, custo: 2800, preco: 4299, giro30d: 3 },
  // ── Nike Air Max 270 — por tamanho (dep-001) ──────────────────────────────
  { id: 's007a', produtoId: 'p0000005-0000-0000-0000-000000000001', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-38', variacaoId: 'v008', variacao: 'Tamanho: 38', depositoId: 'dep-001', deposito: 'Principal', fisico: 8, reservado: 1, minimo: 3, maximo: 20, custo: 320, preco: 699, giro30d: 4 },
  { id: 's007b', produtoId: 'p0000005-0000-0000-0000-000000000001', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-40', variacaoId: 'v009', variacao: 'Tamanho: 40', depositoId: 'dep-001', deposito: 'Principal', fisico: 12, reservado: 2, minimo: 4, maximo: 30, custo: 320, preco: 699, giro30d: 5 },
  { id: 's007c', produtoId: 'p0000005-0000-0000-0000-000000000001', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-42', variacaoId: 'v010', variacao: 'Tamanho: 42', depositoId: 'dep-001', deposito: 'Principal', fisico: 16, reservado: 2, minimo: 5, maximo: 35, custo: 320, preco: 699, giro30d: 7 },
  { id: 's007d', produtoId: 'p0000005-0000-0000-0000-000000000001', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-44', variacaoId: 'v011', variacao: 'Tamanho: 44', depositoId: 'dep-001', deposito: 'Principal', fisico: 12, reservado: 0, minimo: 3, maximo: 25, custo: 320, preco: 699, giro30d: 2 },
  // ── Polo Ralph Lauren — por tamanho (dep-001) ─────────────────────────────
  { id: 's009a', produtoId: 'p0000006-0000-0000-0000-000000000001', produto: 'Polo Ralph Lauren', sku: 'POLO-CAMS-P-BR', variacaoId: 'v012', variacao: 'Tamanho: P', depositoId: 'dep-001', deposito: 'Principal', fisico: 14, reservado: 2, minimo: 5, maximo: 30, custo: 130, preco: 349, giro30d: 6 },
  { id: 's009b', produtoId: 'p0000006-0000-0000-0000-000000000001', produto: 'Polo Ralph Lauren', sku: 'POLO-CAMS-M-BR', variacaoId: 'v013', variacao: 'Tamanho: M', depositoId: 'dep-001', deposito: 'Principal', fisico: 22, reservado: 3, minimo: 8, maximo: 50, custo: 130, preco: 349, giro30d: 10 },
  { id: 's009c', produtoId: 'p0000006-0000-0000-0000-000000000001', produto: 'Polo Ralph Lauren', sku: 'POLO-CAMS-G-BR', variacaoId: 'v014', variacao: 'Tamanho: G', depositoId: 'dep-001', deposito: 'Principal', fisico: 18, reservado: 2, minimo: 6, maximo: 40, custo: 130, preco: 349, giro30d: 5 },
  { id: 's009d', produtoId: 'p0000006-0000-0000-0000-000000000001', produto: 'Polo Ralph Lauren', sku: 'POLO-CAMS-GG-BR', variacaoId: 'v015', variacao: 'Tamanho: GG', depositoId: 'dep-001', deposito: 'Principal', fisico: 8, reservado: 1, minimo: 3, maximo: 20, custo: 130, preco: 379, giro30d: 3 },
  // ── Outros — variação Única ────────────────────────────────────────────────
  { id: 's010', produtoId: 'p0000007-0000-0000-0000-000000000001', produto: 'Mochila Samsonite Pro-DLX 5', sku: 'SAMS-BACKP-PRO', variacaoId: 'v-sams-u1', variacao: 'Única', depositoId: 'dep-001', deposito: 'Principal', fisico: 0, reservado: 0, minimo: 3, maximo: 15, custo: 440, preco: 899, giro30d: 0 },
  { id: 's011', produtoId: 'p0000008-0000-0000-0000-000000000001', produto: 'GoPro HERO12 Black', sku: 'GPRO-HERO12-BLK', variacaoId: 'v-go-u1', variacao: 'Única', depositoId: 'dep-001', deposito: 'Principal', fisico: 3, reservado: 0, minimo: 2, maximo: 15, custo: 1350, preco: 2199, giro30d: 0 },
];

const INITIAL_SALDOS_FULL: SaldoMock[] = INITIAL_SALDOS.map((s) => ({
  ...s,
  disponivel: s.fisico - s.reservado,
  status: calcStatus(s.fisico, s.minimo),
}));

// ─── Movimentações ───────────────────────────────────────────────────────────

const INITIAL_MOVIMENTACOES: MovimentacaoMock[] = [
  { id: 'mov-001', tipo: 'ENTRADA', produtoId: 'p0000001', produto: 'iPhone 15 Pro 256GB', sku: 'APPL-IP15P-256-PT', quantidade: 10, depositoDestinoId: 'dep-001', depositoDestino: 'Principal', motivo: 'Reposição de estoque — NF 4521', responsavel: 'João Silva', criadoEm: h(2, 3) },
  { id: 'mov-002', tipo: 'SAIDA', produtoId: 'p0000001', produto: 'iPhone 15 Pro 256GB', sku: 'APPL-IP15P-256-PT', quantidade: 3, depositoOrigemId: 'dep-001', depositoOrigem: 'Principal', motivo: 'Pedido #10045', responsavel: 'Sistema', criadoEm: h(2, 1) },
  { id: 'mov-003', tipo: 'ENTRADA', produtoId: 'p0000005', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-42', quantidade: 30, depositoDestinoId: 'dep-001', depositoDestino: 'Principal', motivo: 'Compra fornecedor — NF 7832', responsavel: 'Maria Santos', criadoEm: h(3, 2) },
  { id: 'mov-004', tipo: 'SAIDA', produtoId: 'p0000006', produto: 'Polo Ralph Lauren Branca M', sku: 'POLO-CAMS-M-BR', quantidade: 8, depositoOrigemId: 'dep-001', depositoOrigem: 'Principal', motivo: 'Pedido #10042', responsavel: 'Sistema', criadoEm: h(3, 5) },
  { id: 'mov-005', tipo: 'TRANSFERENCIA', produtoId: 'p0000003', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-PT', quantidade: 10, depositoOrigemId: 'dep-001', depositoOrigem: 'Principal', depositoDestinoId: 'dep-002', depositoDestino: 'Secundário', motivo: 'Distribuição regional', responsavel: 'Pedro Oliveira', criadoEm: h(5, 1) },
  { id: 'mov-006', tipo: 'ENTRADA', produtoId: 'p0000004', produto: 'Notebook Dell Inspiron 15', sku: 'DELL-INS15-I5-512', quantidade: 5, depositoDestinoId: 'dep-001', depositoDestino: 'Principal', motivo: 'Compra — NF 3318', responsavel: 'Ana Costa', criadoEm: h(6, 0) },
  { id: 'mov-007', tipo: 'AJUSTE', produtoId: 'p0000007', produto: 'Mochila Samsonite Pro-DLX 5', sku: 'SAMS-BACKP-PRO', quantidade: -3, depositoOrigemId: 'dep-001', depositoOrigem: 'Principal', motivo: 'Inventário — diferença de contagem', responsavel: 'João Silva', criadoEm: h(7, 2) },
  { id: 'mov-008', tipo: 'SAIDA', produtoId: 'p0000005', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-42', quantidade: 12, depositoOrigemId: 'dep-001', depositoOrigem: 'Principal', motivo: 'Pedidos #10038, #10039, #10040', responsavel: 'Sistema', criadoEm: h(8, 3) },
  { id: 'mov-009', tipo: 'TRANSFERENCIA', produtoId: 'p0000005', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-42', quantidade: 22, depositoOrigemId: 'dep-001', depositoOrigem: 'Principal', depositoDestinoId: 'dep-003', depositoDestino: 'Distribuição', motivo: 'Reabastecimento CD', responsavel: 'Pedro Oliveira', criadoEm: h(10, 1) },
  { id: 'mov-010', tipo: 'ENTRADA', produtoId: 'p0000006', produto: 'Polo Ralph Lauren Branca M', sku: 'POLO-CAMS-M-BR', quantidade: 40, depositoDestinoId: 'dep-001', depositoDestino: 'Principal', motivo: 'Compra coleção verão — NF 5541', responsavel: 'Maria Santos', criadoEm: h(12, 0) },
  { id: 'mov-011', tipo: 'SAIDA', produtoId: 'p0000002', produto: 'Samsung Galaxy S24 Ultra', sku: 'SAMS-S24U-256-PT', quantidade: 5, depositoOrigemId: 'dep-001', depositoOrigem: 'Principal', motivo: 'Pedidos #10030, #10031', responsavel: 'Sistema', criadoEm: h(14, 4) },
  { id: 'mov-012', tipo: 'ENTRADA', produtoId: 'p0000001', produto: 'iPhone 15 Pro 256GB', sku: 'APPL-IP15P-256-PT', quantidade: 5, depositoDestinoId: 'dep-003', depositoDestino: 'Distribuição', motivo: 'NF 4480', responsavel: 'Pedro Oliveira', criadoEm: h(15, 2) },
  { id: 'mov-013', tipo: 'AJUSTE', produtoId: 'p0000008', produto: 'GoPro HERO12 Black', sku: 'GPRO-HERO12-BLK', quantidade: -2, depositoOrigemId: 'dep-001', depositoOrigem: 'Principal', motivo: 'Unidades danificadas durante transporte', responsavel: 'Ana Costa', criadoEm: h(18, 6) },
  { id: 'mov-014', tipo: 'SAIDA', produtoId: 'p0000003', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-PT', quantidade: 7, depositoOrigemId: 'dep-001', depositoOrigem: 'Principal', motivo: 'Pedidos Black Friday', responsavel: 'Sistema', criadoEm: h(20, 1) },
  { id: 'mov-015', tipo: 'ENTRADA', produtoId: 'p0000003', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-PT', quantidade: 20, depositoDestinoId: 'dep-001', depositoDestino: 'Principal', motivo: 'Reposição urgente — NF 6621', responsavel: 'João Silva', criadoEm: h(21, 0) },
  { id: 'mov-016', tipo: 'SAIDA', produtoId: 'p0000006', produto: 'Polo Ralph Lauren Branca M', sku: 'POLO-CAMS-M-BR', depositoOrigemId: 'dep-003', depositoOrigem: 'Distribuição', quantidade: 12, motivo: 'Pedidos canal marketplace', responsavel: 'Sistema', criadoEm: h(22, 3) },
  { id: 'mov-017', tipo: 'ENTRADA', produtoId: 'p0000002', produto: 'Samsung Galaxy S24 Ultra', sku: 'SAMS-S24U-256-PT', quantidade: 12, depositoDestinoId: 'dep-001', depositoDestino: 'Principal', motivo: 'NF 9910 — importação direta', responsavel: 'Maria Santos', criadoEm: h(25, 5) },
  { id: 'mov-018', tipo: 'SAIDA', produtoId: 'p0000004', produto: 'Notebook Dell Inspiron 15', sku: 'DELL-INS15-I5-512', quantidade: 3, depositoOrigemId: 'dep-001', depositoOrigem: 'Principal', motivo: 'Pedidos corporativos', responsavel: 'Sistema', criadoEm: h(27, 2) },
  { id: 'mov-019', tipo: 'TRANSFERENCIA', produtoId: 'p0000006', produto: 'Polo Ralph Lauren Branca M', sku: 'POLO-CAMS-M-BR', quantidade: 28, depositoOrigemId: 'dep-001', depositoOrigem: 'Principal', depositoDestinoId: 'dep-003', depositoDestino: 'Distribuição', motivo: 'Equilíbrio de estoque', responsavel: 'Pedro Oliveira', criadoEm: h(29, 1) },
  { id: 'mov-020', tipo: 'AJUSTE', produtoId: 'p0000005', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-42', quantidade: 3, depositoDestinoId: 'dep-001', depositoDestino: 'Principal', motivo: 'Correção contagem física — inventário anual', responsavel: 'Ana Costa', criadoEm: h(30, 0) },
];

// ─── Persistência via globalThis ─────────────────────────────────────────────

if (!globalThis.__depositosMock) globalThis.__depositosMock = INITIAL_DEPOSITOS;
if (!globalThis.__saldosMock) globalThis.__saldosMock = INITIAL_SALDOS_FULL;
if (!globalThis.__movimentacoesMock) globalThis.__movimentacoesMock = INITIAL_MOVIMENTACOES;

export const DEPOSITOS_MOCK: DepositoMock[] = globalThis.__depositosMock;
export const SALDOS_MOCK: SaldoMock[] = globalThis.__saldosMock;
export const MOVIMENTACOES_MOCK: MovimentacaoMock[] = globalThis.__movimentacoesMock;

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function calcularStatus(fisico: number, minimo: number): SaldoMock['status'] {
  if (fisico <= 0) return 'SEM_ESTOQUE';
  if (fisico <= minimo * 0.5) return 'CRITICO';
  if (fisico <= minimo) return 'BAIXO';
  return 'NORMAL';
}

export function findDeposito(id: string) {
  return DEPOSITOS_MOCK.find((d) => d.id === id);
}

export function findSaldo(id: string) {
  return SALDOS_MOCK.find((s) => s.id === id);
}

// ─── Análise IA de Estoque ───────────────────────────────────────────────────

export function analisarEstoqueIA() {
  // Agrupa saldos por produto (soma todos os depósitos)
  const porProduto = new Map<string, { produto: string; sku: string; fisico: number; reservado: number; custo: number; preco: number; giro30d: number; minimo: number }>();
  for (const s of SALDOS_MOCK) {
    const existing = porProduto.get(s.produtoId);
    if (existing) {
      existing.fisico += s.fisico;
      existing.reservado += s.reservado;
      existing.giro30d += s.giro30d;
      existing.minimo += s.minimo;
    } else {
      porProduto.set(s.produtoId, { produto: s.produto, sku: s.sku, fisico: s.fisico, reservado: s.reservado, custo: s.custo, preco: s.preco, giro30d: s.giro30d, minimo: s.minimo });
    }
  }

  const produtos = Array.from(porProduto.entries()).map(([id, p]) => {
    const giroDiario = p.giro30d / 30;
    const coberturaDias = giroDiario > 0 ? Math.round(p.fisico / giroDiario) : p.fisico > 0 ? 999 : 0;
    const valorImobilizado = p.fisico * p.custo;
    const receita30d = p.giro30d * p.preco;
    const disponivel = p.fisico - p.reservado;
    const riscoRuptura = coberturaDias < 7 && p.fisico > 0;
    const semEstoque = p.fisico <= 0;
    return { id, ...p, giroDiario, coberturaDias, valorImobilizado, receita30d, disponivel, riscoRuptura, semEstoque };
  });

  // Classificação ABC por receita30d
  const totalReceita = produtos.reduce((s, p) => s + p.receita30d, 0);
  const sorted = [...produtos].sort((a, b) => b.receita30d - a.receita30d);
  let acumulado = 0;
  const classificacaoABC = new Map<string, 'A' | 'B' | 'C'>();
  for (const p of sorted) {
    acumulado += p.receita30d;
    const pct = totalReceita > 0 ? acumulado / totalReceita : 0;
    classificacaoABC.set(p.id, pct <= 0.7 ? 'A' : pct <= 0.9 ? 'B' : 'C');
  }

  // Métricas globais
  const totalSKUs = produtos.length;
  const totalUnidades = produtos.reduce((s, p) => s + p.fisico, 0);
  const valorTotalImobilizado = produtos.reduce((s, p) => s + p.valorImobilizado, 0);
  const coberturaMedia = produtos.filter(p => p.coberturaDias < 999).reduce((s, p) => s + p.coberturaDias, 0) / Math.max(1, produtos.filter(p => p.coberturaDias < 999).length);
  const produtosRisco = produtos.filter(p => p.riscoRuptura);
  const produtosSemEstoque = produtos.filter(p => p.semEstoque);
  const classA = produtos.filter(p => classificacaoABC.get(p.id) === 'A');
  const classB = produtos.filter(p => classificacaoABC.get(p.id) === 'B');
  const classC = produtos.filter(p => classificacaoABC.get(p.id) === 'C');

  // Recomendações de compra (cobertura < 15 dias)
  const recomendacoes = produtos
    .filter(p => p.coberturaDias < 15 || p.semEstoque)
    .map(p => {
      const qtdSugerida = Math.max(p.minimo * 3, Math.round(p.giroDiario * 30));
      return {
        produtoId: p.id, produto: p.produto, sku: p.sku,
        coberturaDias: p.coberturaDias, qtdSugerida,
        valorCompra: qtdSugerida * p.custo,
        urgente: p.coberturaDias < 7 || p.semEstoque,
        classe: classificacaoABC.get(p.id) ?? 'C',
      };
    })
    .sort((a, b) => (a.urgente === b.urgente ? 0 : a.urgente ? -1 : 1));

  // Score geral de saúde do estoque
  const scoreCobertura = Math.min(100, (coberturaMedia / 30) * 100);
  const scoreRuptura = Math.max(0, 100 - (produtosRisco.length / totalSKUs) * 200);
  const scoreSemEstoque = Math.max(0, 100 - (produtosSemEstoque.length / totalSKUs) * 200);
  const scoreGeral = Math.round(scoreCobertura * 0.4 + scoreRuptura * 0.35 + scoreSemEstoque * 0.25);

  let saude: string;
  let acoes: string[];
  if (scoreGeral >= 80) {
    saude = 'Estoque Saudável — Boa cobertura em todos os itens';
    acoes = ['Otimizar mix de produtos para reduzir capital imobilizado', 'Avaliar redução de estoque em itens Classe C', 'Negociar melhores prazos com fornecedores dos itens A'];
  } else if (scoreGeral >= 60) {
    saude = 'Atenção Necessária — Alguns itens com risco de ruptura';
    acoes = ['Reabastecer urgente os itens com cobertura < 7 dias', 'Revisar ponto de pedido dos produtos Classe A', 'Avaliar transferências entre depósitos para equilibrar estoque'];
  } else if (scoreGeral >= 40) {
    saude = 'Estoque Crítico — Risco alto de ruptura em vários itens';
    acoes = ['Emitir ordens de compra imediatas para itens críticos', 'Ativar fornecedores alternativos para itens sem estoque', 'Implementar controle de reserva para pedidos Classe A'];
  } else {
    saude = 'Estoque em Colapso — Ação imediata necessária';
    acoes = ['Paralisar vendas de itens zerados até reposição', 'Contatar todos os fornecedores em regime de urgência', 'Redistribuir estoque entre depósitos imediatamente'];
  }

  return {
    scoreGeral, saude, acoes, geradoEm: new Date().toISOString(),
    metricas: {
      totalSKUs, totalUnidades, coberturaMedia: Math.round(coberturaMedia),
      valorTotalImobilizado: parseFloat(valorTotalImobilizado.toFixed(2)),
      produtosEmRisco: produtosRisco.length,
      produtosSemEstoque: produtosSemEstoque.length,
      classificacaoABC: { A: classA.length, B: classB.length, C: classC.length },
    },
    top5ReceitaMensal: sorted.slice(0, 5).map(p => ({ produto: p.produto, sku: p.sku, receita30d: p.receita30d, classe: classificacaoABC.get(p.id) })),
    recomendacoes,
    detalhesPorProduto: produtos.map(p => ({
      ...p, classe: classificacaoABC.get(p.id) ?? 'C',
    })),
  };
}
