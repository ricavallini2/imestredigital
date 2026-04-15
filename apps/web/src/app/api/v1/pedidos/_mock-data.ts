// Mock data para o módulo de pedidos (dev sem order-service)
// globalThis garante array compartilhado entre rotas no Next.js dev

export type StatusPedido =
  | 'PENDENTE' | 'CONFIRMADO' | 'SEPARANDO' | 'SEPARADO'
  | 'FATURADO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO' | 'DEVOLVIDO';

export type CanalPedido =
  | 'BALCAO' | 'INTERNA' | 'SHOPIFY' | 'MERCADO_LIVRE' | 'SHOPEE' | 'AMAZON' | 'OUTROS';

export type FormaPagamento =
  | 'DINHEIRO' | 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'BOLETO' | 'PRAZO';

export interface ItemPedidoMock {
  id: string; produtoId: string; produto: string; sku: string;
  variacaoId?: string; variacao?: string; // ex: "Tamanho: 42" or "Capacidade: 256GB"
  quantidade: number; precoUnitario: number; desconto: number; subtotal: number;
}

export interface PedidoMock {
  id: string; numero: string;
  clienteId?: string; cliente: string; clienteEmail?: string; clienteTelefone?: string;
  canal: CanalPedido; status: StatusPedido;
  itens: number; itensList: ItemPedidoMock[];
  subtotal: number; desconto: number; frete: number; valor: number;
  formaPagamento: FormaPagamento; statusPagamento: 'PENDENTE' | 'PAGO' | 'ESTORNADO';
  parcelas?: number; troco?: number;
  rastreio?: string; transportadora?: string;
  enderecoEntrega?: string; observacoes?: string;
  vendedor?: string;
  criadoEm: string; atualizadoEm: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __pedidosMock: PedidoMock[] | undefined;
  // eslint-disable-next-line no-var
  var __pedidosSeq: number | undefined;
}

const d = (diasAtras: number, h = 0) =>
  new Date(Date.now() - diasAtras * 86400000 - h * 3600000).toISOString();

const INITIAL_PEDIDOS: PedidoMock[] = [
  {
    id: 'ped-001', numero: 'PED-2026-0001',
    clienteId: 'c0000001', cliente: 'Tech Solutions Ltda', clienteEmail: 'compras@techsolutions.com', clienteTelefone: '(11) 3000-4000',
    canal: 'INTERNA', status: 'ENTREGUE',
    itens: 2, itensList: [
      { id: 'i001', produtoId: 'p0000001', produto: 'iPhone 15 Pro 256GB', sku: 'APPL-IP15P-256-PT', quantidade: 2, precoUnitario: 8999, desconto: 0, subtotal: 17998 },
      { id: 'i002', produtoId: 'p0000004', produto: 'Notebook Dell Inspiron 15', sku: 'DELL-INS15-I5-512', quantidade: 1, precoUnitario: 4299, desconto: 200, subtotal: 4099 },
    ],
    subtotal: 22297, desconto: 200, frete: 0, valor: 22097,
    formaPagamento: 'BOLETO', statusPagamento: 'PAGO', parcelas: 1,
    rastreio: 'BR123456789BR', transportadora: 'Correios SEDEX',
    enderecoEntrega: 'Rua Vergueiro, 2000 - Vila Mariana, São Paulo, SP',
    vendedor: 'Maria Santos', criadoEm: d(15), atualizadoEm: d(8),
  },
  {
    id: 'ped-002', numero: 'PED-2026-0002',
    clienteId: 'c0000002', cliente: 'Maria Santos', clienteEmail: 'maria@email.com', clienteTelefone: '(11) 98765-4321',
    canal: 'BALCAO', status: 'ENTREGUE',
    itens: 1, itensList: [
      { id: 'i003', produtoId: 'p0000003', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-PT', quantidade: 1, precoUnitario: 1899, desconto: 0, subtotal: 1899 },
    ],
    subtotal: 1899, desconto: 0, frete: 0, valor: 1899,
    formaPagamento: 'PIX', statusPagamento: 'PAGO',
    vendedor: 'João Silva', criadoEm: d(12), atualizadoEm: d(12),
  },
  {
    id: 'ped-003', numero: 'PED-2026-0003',
    cliente: 'Loja Shopify #4421', clienteEmail: 'cliente@shopify.com',
    canal: 'SHOPIFY', status: 'ENVIADO',
    itens: 1, itensList: [
      { id: 'i004', produtoId: 'p0000005', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-42', quantidade: 2, precoUnitario: 699, desconto: 0, subtotal: 1398 },
    ],
    subtotal: 1398, desconto: 0, frete: 25, valor: 1423,
    formaPagamento: 'CARTAO_CREDITO', statusPagamento: 'PAGO', parcelas: 3,
    rastreio: 'OF987654321BR', transportadora: 'Jadlog',
    enderecoEntrega: 'Av. Paulista, 1000 - Bela Vista, São Paulo, SP',
    criadoEm: d(10), atualizadoEm: d(7),
  },
  {
    id: 'ped-004', numero: 'PED-2026-0004',
    cliente: 'Pedido ML #2234', clienteEmail: 'ml@email.com',
    canal: 'MERCADO_LIVRE', status: 'SEPARANDO',
    itens: 1, itensList: [
      { id: 'i005', produtoId: 'p0000006', produto: 'Polo Ralph Lauren Branca M', sku: 'POLO-CAMS-M-BR', quantidade: 3, precoUnitario: 349, desconto: 30, subtotal: 1017 },
    ],
    subtotal: 1047, desconto: 30, frete: 0, valor: 1017,
    formaPagamento: 'PIX', statusPagamento: 'PAGO',
    enderecoEntrega: 'Rua das Flores, 50 - Centro, Campinas, SP',
    criadoEm: d(5), atualizadoEm: d(3),
  },
  {
    id: 'ped-005', numero: 'PED-2026-0005',
    clienteId: 'c0000001', cliente: 'Tech Solutions Ltda', clienteEmail: 'ti@techsolutions.com',
    canal: 'INTERNA', status: 'CONFIRMADO',
    itens: 2, itensList: [
      { id: 'i006', produtoId: 'p0000002', produto: 'Samsung Galaxy S24 Ultra', sku: 'SAMS-S24U-256-PT', quantidade: 3, precoUnitario: 6499, desconto: 300, subtotal: 19197 },
      { id: 'i007', produtoId: 'p0000003', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-PT', quantidade: 3, precoUnitario: 1899, desconto: 0, subtotal: 5697 },
    ],
    subtotal: 24894, desconto: 300, frete: 0, valor: 24594,
    formaPagamento: 'PRAZO', statusPagamento: 'PENDENTE', parcelas: 1,
    enderecoEntrega: 'Rua Vergueiro, 2000 - Vila Mariana, São Paulo, SP',
    observacoes: 'Entregar até 15/04/2026 — urgente para projeto cliente',
    vendedor: 'Ana Costa', criadoEm: d(3), atualizadoEm: d(2),
  },
  {
    id: 'ped-006', numero: 'PED-2026-0006',
    cliente: 'Cliente Balcão', clienteEmail: '',
    canal: 'BALCAO', status: 'ENTREGUE',
    itens: 2, itensList: [
      { id: 'i008', produtoId: 'p0000006', produto: 'Polo Ralph Lauren Branca M', sku: 'POLO-CAMS-M-BR', quantidade: 2, precoUnitario: 349, desconto: 0, subtotal: 698 },
      { id: 'i009', produtoId: 'p0000005', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-42', quantidade: 1, precoUnitario: 699, desconto: 50, subtotal: 649 },
    ],
    subtotal: 1397, desconto: 50, frete: 0, valor: 1347,
    formaPagamento: 'DINHEIRO', statusPagamento: 'PAGO', troco: 153,
    vendedor: 'João Silva', criadoEm: d(2, 3), atualizadoEm: d(2, 3),
  },
  {
    id: 'ped-007', numero: 'PED-2026-0007',
    cliente: 'Shopee #88921',
    canal: 'SHOPEE', status: 'FATURADO',
    itens: 1, itensList: [
      { id: 'i010', produtoId: 'p0000003', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-PT', quantidade: 1, precoUnitario: 1899, desconto: 0, subtotal: 1899 },
    ],
    subtotal: 1899, desconto: 0, frete: 18, valor: 1917,
    formaPagamento: 'PIX', statusPagamento: 'PAGO',
    enderecoEntrega: 'Rua XV de Novembro, 300 - Centro, Curitiba, PR',
    criadoEm: d(4), atualizadoEm: d(1),
  },
  {
    id: 'ped-008', numero: 'PED-2026-0008',
    cliente: 'Amazon #9944', clienteEmail: 'amz@customer.com',
    canal: 'AMAZON', status: 'PENDENTE',
    itens: 1, itensList: [
      { id: 'i011', produtoId: 'p0000008', produto: 'GoPro HERO12 Black', sku: 'GPRO-HERO12-BLK', quantidade: 1, precoUnitario: 2199, desconto: 0, subtotal: 2199 },
    ],
    subtotal: 2199, desconto: 0, frete: 0, valor: 2199,
    formaPagamento: 'CARTAO_CREDITO', statusPagamento: 'PAGO',
    enderecoEntrega: 'SQN 208, Bloco A - Asa Norte, Brasília, DF',
    criadoEm: d(1, 2), atualizadoEm: d(1, 2),
  },
  {
    id: 'ped-009', numero: 'PED-2026-0009',
    cliente: 'Carlos Mendes', clienteEmail: 'carlos@email.com', clienteTelefone: '(11) 99999-1111',
    canal: 'BALCAO', status: 'ENTREGUE',
    itens: 1, itensList: [
      { id: 'i012', produtoId: 'p0000001', produto: 'iPhone 15 Pro 256GB', sku: 'APPL-IP15P-256-PT', quantidade: 1, precoUnitario: 8999, desconto: 500, subtotal: 8499 },
    ],
    subtotal: 8999, desconto: 500, frete: 0, valor: 8499,
    formaPagamento: 'CARTAO_CREDITO', statusPagamento: 'PAGO', parcelas: 12,
    vendedor: 'Ana Costa', criadoEm: d(0, 4), atualizadoEm: d(0, 4),
  },
  {
    id: 'ped-010', numero: 'PED-2026-0010',
    clienteId: 'c0000003', cliente: 'Distribuidora ABC', clienteEmail: 'compras@abc.com',
    canal: 'INTERNA', status: 'SEPARADO',
    itens: 3, itensList: [
      { id: 'i013', produtoId: 'p0000005', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-42', quantidade: 10, precoUnitario: 699, desconto: 200, subtotal: 6790 },
      { id: 'i014', produtoId: 'p0000006', produto: 'Polo Ralph Lauren Branca M', sku: 'POLO-CAMS-M-BR', quantidade: 20, precoUnitario: 349, desconto: 500, subtotal: 6480 },
      { id: 'i015', produtoId: 'p0000003', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-PT', quantidade: 5, precoUnitario: 1899, desconto: 0, subtotal: 9495 },
    ],
    subtotal: 22765, desconto: 700, frete: 120, valor: 22185,
    formaPagamento: 'PRAZO', statusPagamento: 'PENDENTE', parcelas: 3,
    enderecoEntrega: 'Av. Industrial, 500 - Distrito Industrial, Ribeirão Preto, SP',
    observacoes: 'Pedido trimestral — separar em 2 volumes',
    vendedor: 'Maria Santos', criadoEm: d(2), atualizadoEm: d(1),
  },
  {
    id: 'ped-011', numero: 'PED-2026-0011',
    cliente: 'Fernanda Lima', clienteEmail: 'fernanda@email.com',
    canal: 'SHOPIFY', status: 'CANCELADO',
    itens: 1, itensList: [
      { id: 'i016', produtoId: 'p0000002', produto: 'Samsung Galaxy S24 Ultra', sku: 'SAMS-S24U-256-PT', quantidade: 1, precoUnitario: 6499, desconto: 0, subtotal: 6499 },
    ],
    subtotal: 6499, desconto: 0, frete: 0, valor: 6499,
    formaPagamento: 'PIX', statusPagamento: 'ESTORNADO',
    observacoes: 'Cancelado a pedido do cliente — produto indisponível na cor desejada',
    criadoEm: d(8), atualizadoEm: d(6),
  },
  {
    id: 'ped-012', numero: 'PED-2026-0012',
    cliente: 'Roberto Nunes', clienteEmail: 'roberto@empresa.com', clienteTelefone: '(21) 98888-0000',
    canal: 'BALCAO', status: 'ENTREGUE',
    itens: 1, itensList: [
      { id: 'i017', produtoId: 'p0000004', produto: 'Notebook Dell Inspiron 15', sku: 'DELL-INS15-I5-512', quantidade: 1, precoUnitario: 4299, desconto: 300, subtotal: 3999 },
    ],
    subtotal: 4299, desconto: 300, frete: 0, valor: 3999,
    formaPagamento: 'CARTAO_DEBITO', statusPagamento: 'PAGO',
    vendedor: 'João Silva', criadoEm: d(0, 6), atualizadoEm: d(0, 6),
  },
  {
    id: 'ped-013', numero: 'PED-2026-0013',
    cliente: 'ML #5561', canal: 'MERCADO_LIVRE', status: 'ENVIADO',
    itens: 1, itensList: [
      { id: 'i018', produtoId: 'p0000005', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-42', quantidade: 1, precoUnitario: 699, desconto: 0, subtotal: 699 },
    ],
    subtotal: 699, desconto: 0, frete: 0, valor: 699,
    formaPagamento: 'PIX', statusPagamento: 'PAGO',
    rastreio: 'ML887654321', transportadora: 'Mercado Envios',
    enderecoEntrega: 'Rua Sete de Setembro, 1000 - Bela Vista, Porto Alegre, RS',
    criadoEm: d(6), atualizadoEm: d(4),
  },
  {
    id: 'ped-014', numero: 'PED-2026-0014',
    cliente: 'Patricia Souza', clienteTelefone: '(11) 97777-2222',
    canal: 'BALCAO', status: 'ENTREGUE',
    itens: 2, itensList: [
      { id: 'i019', produtoId: 'p0000006', produto: 'Polo Ralph Lauren Branca M', sku: 'POLO-CAMS-M-BR', quantidade: 1, precoUnitario: 349, desconto: 0, subtotal: 349 },
      { id: 'i020', produtoId: 'p0000003', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-PT', quantidade: 1, precoUnitario: 1899, desconto: 0, subtotal: 1899 },
    ],
    subtotal: 2248, desconto: 0, frete: 0, valor: 2248,
    formaPagamento: 'PIX', statusPagamento: 'PAGO',
    vendedor: 'Maria Santos', criadoEm: d(0, 1), atualizadoEm: d(0, 1),
  },
  {
    id: 'ped-015', numero: 'PED-2026-0015',
    clienteId: 'c0000002', cliente: 'Supermercado Central', clienteEmail: 'pedidos@central.com',
    canal: 'INTERNA', status: 'PENDENTE',
    itens: 1, itensList: [
      { id: 'i021', produtoId: 'p0000006', produto: 'Polo Ralph Lauren Branca M', sku: 'POLO-CAMS-M-BR', quantidade: 30, precoUnitario: 349, desconto: 1500, subtotal: 9000 },
    ],
    subtotal: 10470, desconto: 1500, frete: 200, valor: 9170,
    formaPagamento: 'BOLETO', statusPagamento: 'PENDENTE', parcelas: 1,
    enderecoEntrega: 'Rodovia Anhanguera, km 100 - Jundiaí, SP',
    observacoes: 'Aguardando aprovação do financeiro',
    vendedor: 'Ana Costa', criadoEm: d(0, 0.5), atualizadoEm: d(0, 0.5),
  },
];

// ─── Produtos para autocomplete ───────────────────────────────────────────────

export const PRODUTOS_CATALOGO = [
  { id: 'p0000001', nome: 'iPhone 15 Pro 256GB',        sku: 'APPL-IP15P-256-PT',  preco: 8999, estoque: 24, categoria: 'Smartphones'   },
  { id: 'p0000002', nome: 'Samsung Galaxy S24 Ultra',   sku: 'SAMS-S24U-256-PT',   preco: 6499, estoque: 18, categoria: 'Smartphones'   },
  { id: 'p0000003', nome: 'Headphone Sony WH-1000XM5',  sku: 'SONY-WH1000XM5-PT',  preco: 1899, estoque: 45, categoria: 'Áudio'         },
  { id: 'p0000004', nome: 'Notebook Dell Inspiron 15',  sku: 'DELL-INS15-I5-512',  preco: 4299, estoque: 11, categoria: 'Computadores'  },
  { id: 'p0000005', nome: 'Tênis Nike Air Max 270',     sku: 'NIKE-AIRMAX-270-42', preco:  699, estoque: 70, categoria: 'Calçados'      },
  { id: 'p0000006', nome: 'Polo Ralph Lauren Branca M', sku: 'POLO-CAMS-M-BR',     preco:  349, estoque: 90, categoria: 'Vestuário'     },
  { id: 'p0000007', nome: 'Mochila Samsonite Pro-DLX 5',sku: 'SAMS-BACKP-PRO',     preco:  899, estoque: 10, categoria: 'Acessórios'    },
  { id: 'p0000008', nome: 'GoPro HERO12 Black',         sku: 'GPRO-HERO12-BLK',    preco: 2199, estoque:  3, categoria: 'Câmeras'       },
];

export const CLIENTES_CATALOGO = [
  { id: 'c0000001', nome: 'Tech Solutions Ltda', email: 'compras@techsolutions.com', telefone: '(11) 3000-4000', tipo: 'PJ' },
  { id: 'c0000002', nome: 'Supermercado Central', email: 'pedidos@central.com', telefone: '(11) 4000-5000', tipo: 'PJ' },
  { id: 'c0000003', nome: 'Distribuidora ABC', email: 'compras@abc.com', telefone: '(16) 3200-1000', tipo: 'PJ' },
  { id: 'c0000004', nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 98765-4321', tipo: 'PF' },
  { id: 'c0000005', nome: 'Carlos Mendes', email: 'carlos@email.com', telefone: '(11) 99999-1111', tipo: 'PF' },
  { id: 'c0000006', nome: 'Roberto Nunes', email: 'roberto@empresa.com', telefone: '(21) 98888-0000', tipo: 'PF' },
];

// ─── Persistência via globalThis ─────────────────────────────────────────────

if (!globalThis.__pedidosMock) globalThis.__pedidosMock = INITIAL_PEDIDOS;
if (!globalThis.__pedidosSeq) globalThis.__pedidosSeq = INITIAL_PEDIDOS.length + 1;

export const PEDIDOS_MOCK: PedidoMock[] = globalThis.__pedidosMock;

export function nextNumero(): string {
  const n = globalThis.__pedidosSeq!;
  globalThis.__pedidosSeq = n + 1;
  return `PED-2026-${String(n).padStart(4, '0')}`;
}

export function findPedido(id: string): PedidoMock | undefined {
  return PEDIDOS_MOCK.find((p) => p.id === id);
}
