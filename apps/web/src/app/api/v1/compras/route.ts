import { NextRequest, NextResponse } from 'next/server';
export { ItemCompraMock, StatusCompra, PedidoCompraMock, COMPRAS_MOCK, nextNumeroCompra } from './_mock-data';
import { PedidoCompraMock, COMPRAS_MOCK, nextNumeroCompra } from './_mock-data';

// Helpers kept for INITIAL_COMPRAS reference (data now managed in _mock-data.ts)
const d  = (diasAtras: number)   => new Date(Date.now() - diasAtras * 86400000).toISOString();
const df = (diasFuturos: number) => new Date(Date.now() + diasFuturos * 86400000).toISOString();

const INITIAL_COMPRAS: PedidoCompraMock[] = [
  {
    id: 'cmp-001',
    numero: '000001',
    fornecedorId: 'f-001',
    fornecedor: 'TechDist',
    status: 'RECEBIDO',
    itens: [
      { id: 'ic-001-1', produtoId: 'p0000001-0000-0000-0000-000000000001', produto: 'iPhone 15 Pro 256GB Titânio Preto', sku: 'APPL-IP15P-256-PT', ncm: '85171200', cfop: '1102', unidade: 'UN', quantidade: 5, quantidadeRecebida: 5, valorUnitario: 5800, valorTotal: 29000, valorICMS: 3480, valorIPI: 0, valorPIS: 188.5, valorCOFINS: 869 },
      { id: 'ic-001-2', produtoId: 'p0000002-0000-0000-0000-000000000001', produto: 'Samsung Galaxy S24 Ultra 256GB Preto', sku: 'SAMS-S24U-256-PT', ncm: '85171200', cfop: '1102', unidade: 'UN', quantidade: 2, quantidadeRecebida: 2, valorUnitario: 3900, valorTotal: 7800, valorICMS: 936, valorIPI: 0, valorPIS: 50.7, valorCOFINS: 233.7 },
      { id: 'ic-001-3', produtoId: 'p0000003-0000-0000-0000-000000000001', produto: 'Headphone Sony WH-1000XM5 Preto', sku: 'SONY-WH1000XM5-PT', ncm: '85183000', cfop: '1102', unidade: 'UN', quantidade: 3, quantidadeRecebida: 3, valorUnitario: 1100, valorTotal: 3300, valorICMS: 396, valorIPI: 0, valorPIS: 21.45, valorCOFINS: 98.9 },
    ],
    valorProdutos: 40100,
    valorFrete: 450,
    valorImpostos: 5274.25,
    valorTotal: 8500,
    dataEmissao: d(25),
    dataRecebimento: d(20),
    nfeNumero: '001234',
    nfeSerie: '1',
    nfeChave: '35240312345678000190550010012340001234567890',
    condicaoPagamento: '30/60/90 dias',
    formaPagamento: 'Boleto Bancário',
    criadoEm: d(25),
    atualizadoEm: d(20),
  },
  {
    id: 'cmp-002',
    numero: '000002',
    fornecedorId: 'f-002',
    fornecedor: 'ElecBrasil',
    status: 'RECEBIDO',
    itens: [
      { id: 'ic-002-1', produtoId: 'p0000004-0000-0000-0000-000000000001', produto: 'Notebook Dell Inspiron 15 i5 512GB', sku: 'DELL-INS15-I5-512', ncm: '84713012', cfop: '1102', unidade: 'UN', quantidade: 3, quantidadeRecebida: 3, valorUnitario: 2800, valorTotal: 8400, valorICMS: 1008, valorIPI: 0, valorPIS: 54.6, valorCOFINS: 251.9 },
      { id: 'ic-002-2', produtoId: 'p0000008-0000-0000-0000-000000000001', produto: 'GoPro HERO12 Black', sku: 'GPRO-HERO12-BLK', ncm: '85258090', cfop: '1102', unidade: 'UN', quantidade: 5, quantidadeRecebida: 5, valorUnitario: 1350, valorTotal: 6750, valorICMS: 810, valorIPI: 0, valorPIS: 43.88, valorCOFINS: 202.5 },
    ],
    valorProdutos: 15150,
    valorFrete: 250,
    valorImpostos: 2370.88,
    valorTotal: 15200,
    dataEmissao: d(18),
    dataRecebimento: d(14),
    nfeNumero: '005678',
    nfeSerie: '1',
    nfeChave: '33240398765432000110550010056780005678901234',
    condicaoPagamento: '30 dias',
    formaPagamento: 'PIX',
    criadoEm: d(18),
    atualizadoEm: d(14),
  },
  {
    id: 'cmp-003',
    numero: '000003',
    fornecedorId: 'f-003',
    fornecedor: 'Moda Fashion',
    status: 'AGUARDANDO_RECEBIMENTO',
    itens: [
      { id: 'ic-003-1', produtoId: 'p0000006-0000-0000-0000-000000000001', produto: 'Camiseta Polo Ralph Lauren Branca M', sku: 'POLO-CAMS-M-BR', ncm: '61051000', cfop: '1102', unidade: 'UN', quantidade: 20, quantidadeRecebida: 0, valorUnitario: 130, valorTotal: 2600, valorICMS: 312, valorIPI: 0, valorPIS: 16.9, valorCOFINS: 78 },
      { id: 'ic-003-2', produtoId: 'p0000006-0000-0000-0000-000000000001', produto: 'Camiseta Polo Ralph Lauren Branca G', sku: 'POLO-CAMS-G-BR', ncm: '61051000', cfop: '1102', unidade: 'UN', quantidade: 15, quantidadeRecebida: 0, valorUnitario: 130, valorTotal: 1950, valorICMS: 234, valorIPI: 0, valorPIS: 12.68, valorCOFINS: 58.5 },
      { id: 'ic-003-3', produtoId: 'p0000005-0000-0000-0000-000000000001', produto: 'Tênis Nike Air Max 270 Preto N°42', sku: 'NIKE-AIRMAX-270-42', ncm: '64041100', cfop: '1102', unidade: 'PAR', quantidade: 10, quantidadeRecebida: 0, valorUnitario: 320, valorTotal: 3200, valorICMS: 384, valorIPI: 0, valorPIS: 20.8, valorCOFINS: 96 },
      { id: 'ic-003-4', produtoId: 'p0000005-0000-0000-0000-000000000001', produto: 'Tênis Nike Air Max 270 Preto N°40', sku: 'NIKE-AIRMAX-270-40', ncm: '64041100', cfop: '1102', unidade: 'PAR', quantidade: 8, quantidadeRecebida: 0, valorUnitario: 320, valorTotal: 2560, valorICMS: 307.2, valorIPI: 0, valorPIS: 16.64, valorCOFINS: 76.8 },
      { id: 'ic-003-5', produtoId: 'p0000007-0000-0000-0000-000000000001', produto: 'Mochila Samsonite Pro-DLX 5 Preta', sku: 'SAMS-BACKP-PRO', ncm: '42021200', cfop: '1102', unidade: 'UN', quantidade: 5, quantidadeRecebida: 0, valorUnitario: 440, valorTotal: 2200, valorICMS: 264, valorIPI: 0, valorPIS: 14.3, valorCOFINS: 66 },
    ],
    valorProdutos: 12510,
    valorFrete: 380,
    valorImpostos: 1957.82,
    valorTotal: 4300,
    dataEmissao: d(5),
    dataPrevistaEntrega: df(5),
    condicaoPagamento: '28 dias',
    formaPagamento: 'Boleto Bancário',
    criadoEm: d(5),
    atualizadoEm: d(5),
  },
  {
    id: 'cmp-004',
    numero: '000004',
    fornecedorId: 'f-004',
    fornecedor: 'Calçados Premium',
    status: 'ENVIADO',
    itens: [
      { id: 'ic-004-1', produtoId: 'p0000005-0000-0000-0000-000000000001', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-42', ncm: '64041100', cfop: '1102', unidade: 'PAR', quantidade: 12, quantidadeRecebida: 0, valorUnitario: 320, valorTotal: 3840, valorICMS: 460.8, valorIPI: 0, valorPIS: 24.96, valorCOFINS: 115.2 },
      { id: 'ic-004-2', produtoId: 'p0000005-0000-0000-0000-000000000001', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-40', ncm: '64041100', cfop: '1102', unidade: 'PAR', quantidade: 8, quantidadeRecebida: 0, valorUnitario: 320, valorTotal: 2560, valorICMS: 307.2, valorIPI: 0, valorPIS: 16.64, valorCOFINS: 76.8 },
      { id: 'ic-004-3', produtoId: 'p0000007-0000-0000-0000-000000000001', produto: 'Mochila Samsonite', sku: 'SAMS-BACKP-PRO', ncm: '42021200', cfop: '1102', unidade: 'UN', quantidade: 3, quantidadeRecebida: 0, valorUnitario: 440, valorTotal: 1320, valorICMS: 158.4, valorIPI: 0, valorPIS: 8.58, valorCOFINS: 39.6 },
    ],
    valorProdutos: 7720,
    valorFrete: 200,
    valorImpostos: 1207.18,
    valorTotal: 6700,
    dataEmissao: d(3),
    dataPrevistaEntrega: df(10),
    condicaoPagamento: '30 dias',
    formaPagamento: 'Boleto Bancário',
    criadoEm: d(3),
    atualizadoEm: d(3),
  },
  {
    id: 'cmp-005',
    numero: '000005',
    fornecedorId: 'f-001',
    fornecedor: 'TechDist',
    status: 'RECEBIDO',
    itens: [
      { id: 'ic-005-1', produtoId: 'p0000001-0000-0000-0000-000000000001', produto: 'iPhone 15 Pro 256GB', sku: 'APPL-IP15P-256-PT', ncm: '85171200', cfop: '1102', unidade: 'UN', quantidade: 10, quantidadeRecebida: 10, valorUnitario: 5800, valorTotal: 58000, valorICMS: 6960, valorIPI: 0, valorPIS: 377, valorCOFINS: 1740 },
      { id: 'ic-005-2', produtoId: 'p0000002-0000-0000-0000-000000000001', produto: 'Samsung Galaxy S24 Ultra', sku: 'SAMS-S24U-256-PT', ncm: '85171200', cfop: '1102', unidade: 'UN', quantidade: 5, quantidadeRecebida: 5, valorUnitario: 3900, valorTotal: 19500, valorICMS: 2340, valorIPI: 0, valorPIS: 126.75, valorCOFINS: 585 },
      { id: 'ic-005-3', produtoId: 'p0000004-0000-0000-0000-000000000001', produto: 'Notebook Dell Inspiron 15', sku: 'DELL-INS15-I5-512', ncm: '84713012', cfop: '1102', unidade: 'UN', quantidade: 4, quantidadeRecebida: 4, valorUnitario: 2800, valorTotal: 11200, valorICMS: 1344, valorIPI: 0, valorPIS: 72.8, valorCOFINS: 336 },
      { id: 'ic-005-4', produtoId: 'p0000003-0000-0000-0000-000000000001', produto: 'Headphone Sony WH-1000XM5', sku: 'SONY-WH1000XM5-PT', ncm: '85183000', cfop: '1102', unidade: 'UN', quantidade: 8, quantidadeRecebida: 8, valorUnitario: 1100, valorTotal: 8800, valorICMS: 1056, valorIPI: 0, valorPIS: 57.2, valorCOFINS: 264 },
    ],
    valorProdutos: 97500,
    valorFrete: 980,
    valorImpostos: 15258.75,
    valorTotal: 22000,
    dataEmissao: d(10),
    dataRecebimento: d(7),
    nfeNumero: '009012',
    nfeSerie: '1',
    nfeChave: '35240312345678000190550010090120009012345678',
    condicaoPagamento: '30/60/90 dias',
    formaPagamento: 'Boleto Bancário',
    criadoEm: d(10),
    atualizadoEm: d(7),
  },
  {
    id: 'cmp-006',
    numero: '000006',
    fornecedorId: 'f-002',
    fornecedor: 'ElecBrasil',
    status: 'RASCUNHO',
    itens: [
      { id: 'ic-006-1', produtoId: 'p0000004-0000-0000-0000-000000000001', produto: 'Notebook Dell Inspiron 15', sku: 'DELL-INS15-I5-512', ncm: '84713012', cfop: '1102', unidade: 'UN', quantidade: 5, quantidadeRecebida: 0, valorUnitario: 2800, valorTotal: 14000, valorICMS: 1680, valorIPI: 0, valorPIS: 91, valorCOFINS: 420 },
      { id: 'ic-006-2', produtoId: 'p0000008-0000-0000-0000-000000000001', produto: 'GoPro HERO12 Black', sku: 'GPRO-HERO12-BLK', ncm: '85258090', cfop: '1102', unidade: 'UN', quantidade: 3, quantidadeRecebida: 0, valorUnitario: 1350, valorTotal: 4050, valorICMS: 486, valorIPI: 0, valorPIS: 26.33, valorCOFINS: 121.5 },
    ],
    valorProdutos: 18050,
    valorFrete: 300,
    valorImpostos: 2824.83,
    valorTotal: 3400,
    dataEmissao: d(1),
    condicaoPagamento: '30 dias',
    formaPagamento: 'PIX',
    criadoEm: d(1),
    atualizadoEm: d(1),
  },
  {
    id: 'cmp-007',
    numero: '000007',
    fornecedorId: 'f-005',
    fornecedor: 'InfoParts',
    status: 'CANCELADO',
    itens: [
      { id: 'ic-007-1', produtoId: 'p0000008-0000-0000-0000-000000000001', produto: 'GoPro HERO12 Black', sku: 'GPRO-HERO12-BLK', ncm: '85258090', cfop: '1102', unidade: 'UN', quantidade: 2, quantidadeRecebida: 0, valorUnitario: 1350, valorTotal: 2700, valorICMS: 324, valorIPI: 0, valorPIS: 17.55, valorCOFINS: 81 },
    ],
    valorProdutos: 2700,
    valorFrete: 100,
    valorImpostos: 422.55,
    valorTotal: 1200,
    dataEmissao: d(30),
    condicaoPagamento: '15 dias',
    formaPagamento: 'PIX',
    observacoes: 'Cancelado por falta de estoque no fornecedor.',
    criadoEm: d(30),
    atualizadoEm: d(28),
  },
  {
    id: 'cmp-008',
    numero: '000008',
    fornecedorId: 'f-003',
    fornecedor: 'Moda Fashion',
    status: 'RECEBIDO',
    itens: [
      { id: 'ic-008-1', produtoId: 'p0000006-0000-0000-0000-000000000001', produto: 'Camiseta Polo Ralph Lauren Branca', sku: 'POLO-CAMS-M-BR', ncm: '61051000', cfop: '1102', unidade: 'UN', quantidade: 30, quantidadeRecebida: 30, valorUnitario: 130, valorTotal: 3900, valorICMS: 468, valorIPI: 0, valorPIS: 25.35, valorCOFINS: 117 },
      { id: 'ic-008-2', produtoId: 'p0000005-0000-0000-0000-000000000001', produto: 'Tênis Nike Air Max 270', sku: 'NIKE-AIRMAX-270-42', ncm: '64041100', cfop: '1102', unidade: 'PAR', quantidade: 20, quantidadeRecebida: 20, valorUnitario: 320, valorTotal: 6400, valorICMS: 768, valorIPI: 0, valorPIS: 41.6, valorCOFINS: 192 },
      { id: 'ic-008-3', produtoId: 'p0000007-0000-0000-0000-000000000001', produto: 'Mochila Samsonite Pro-DLX 5', sku: 'SAMS-BACKP-PRO', ncm: '42021200', cfop: '1102', unidade: 'UN', quantidade: 8, quantidadeRecebida: 8, valorUnitario: 440, valorTotal: 3520, valorICMS: 422.4, valorIPI: 0, valorPIS: 22.88, valorCOFINS: 105.6 },
      { id: 'ic-008-4', produtoId: 'p0000006-0000-0000-0000-000000000001', produto: 'Polo Ralph Lauren Preta P', sku: 'POLO-CAMS-P-PT', ncm: '61051000', cfop: '1102', unidade: 'UN', quantidade: 15, quantidadeRecebida: 15, valorUnitario: 130, valorTotal: 1950, valorICMS: 234, valorIPI: 0, valorPIS: 12.68, valorCOFINS: 58.5 },
      { id: 'ic-008-5', produtoId: 'p0000005-0000-0000-0000-000000000001', produto: 'Tênis Nike Air Max 270 N°38', sku: 'NIKE-AIRMAX-270-38', ncm: '64041100', cfop: '1102', unidade: 'PAR', quantidade: 10, quantidadeRecebida: 10, valorUnitario: 320, valorTotal: 3200, valorICMS: 384, valorIPI: 0, valorPIS: 20.8, valorCOFINS: 96 },
      { id: 'ic-008-6', produtoId: 'p0000006-0000-0000-0000-000000000001', produto: 'Polo Ralph Lauren Azul G', sku: 'POLO-CAMS-G-AZ', ncm: '61051000', cfop: '1102', unidade: 'UN', quantidade: 10, quantidadeRecebida: 10, valorUnitario: 130, valorTotal: 1300, valorICMS: 156, valorIPI: 0, valorPIS: 8.45, valorCOFINS: 39 },
    ],
    valorProdutos: 20270,
    valorFrete: 520,
    valorImpostos: 3172.26,
    valorTotal: 9800,
    dataEmissao: d(15),
    dataRecebimento: d(12),
    nfeNumero: '003456',
    nfeSerie: '1',
    nfeChave: '42240345678901000123550010034560003456789012',
    condicaoPagamento: '28 dias',
    formaPagamento: 'Boleto Bancário',
    criadoEm: d(15),
    atualizadoEm: d(12),
  },
];

// Mock data initialized in _mock-data.ts — INITIAL_COMPRAS kept here for reference only
void INITIAL_COMPRAS;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? '';
  const fornecedorId = searchParams.get('fornecedorId') ?? '';
  const busca = searchParams.get('busca')?.toLowerCase() ?? '';

  let lista = [...COMPRAS_MOCK];

  if (status) {
    lista = lista.filter((c) => c.status === status);
  }
  if (fornecedorId) {
    lista = lista.filter((c) => c.fornecedorId === fornecedorId);
  }
  if (busca) {
    lista = lista.filter(
      (c) =>
        c.numero.includes(busca) ||
        c.fornecedor.toLowerCase().includes(busca) ||
        (c.nfeNumero && c.nfeNumero.includes(busca)),
    );
  }

  // Retorna sem os itens completos na listagem para performance
  const resumo = lista.map(({ itens, ...rest }) => ({
    ...rest,
    qtdItens: itens.length,
  }));

  return NextResponse.json({ dados: resumo, total: resumo.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const novo: PedidoCompraMock = {
    id: `cmp-${Date.now()}`,
    numero: nextNumeroCompra(),
    fornecedorId: body.fornecedorId,
    fornecedor: body.fornecedor,
    status: 'RASCUNHO',
    itens: body.itens ?? [],
    valorProdutos: body.valorProdutos ?? 0,
    valorFrete: body.valorFrete ?? 0,
    valorImpostos: body.valorImpostos ?? 0,
    valorTotal: body.valorTotal ?? 0,
    dataEmissao: new Date().toISOString(),
    dataPrevistaEntrega: body.dataPrevistaEntrega,
    condicaoPagamento: body.condicaoPagamento ?? '30 dias',
    formaPagamento: body.formaPagamento ?? 'Boleto Bancário',
    observacoes: body.observacoes,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };

  COMPRAS_MOCK.unshift(novo);
  return NextResponse.json(novo, { status: 201 });
}
