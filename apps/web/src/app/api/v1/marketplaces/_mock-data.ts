// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface MarketplaceMock {
  id: string;
  canal: 'MERCADO_LIVRE' | 'SHOPEE' | 'AMAZON' | 'SHOPIFY' | 'MAGALU';
  nome: string;
  status: 'CONECTADO' | 'DESCONECTADO' | 'ERRO' | 'PAUSADO';
  taxaPlataforma: number; // percentage, e.g. 13 for 13%
  sellerId: string;
  pedidosHoje: number;
  pedidosMes: number;
  anunciosAtivos: number;
  anunciosPausados: number;
  perguntasPendentes: number;
  receitaMes: number; // gross
  receitaLiquidaMes: number; // after platform fees
  ticketMedio: number;
  avaliacaoVendedor: number; // 0-5
  taxaResposta: number; // 0-100 percent
  taxaReclamacao: number; // 0-10 percent
  ultimaSincronizacao: string; // ISO datetime
  criadoEm: string;
}

export interface AnuncioMock {
  id: string;
  produtoId: string;
  canal: 'MERCADO_LIVRE' | 'SHOPEE' | 'AMAZON' | 'SHOPIFY' | 'MAGALU';
  titulo: string;
  sku: string;
  preco: number;
  precoPromocional?: number;
  custoMedio: number;
  estoque: number;
  status: 'ATIVO' | 'PAUSADO' | 'SEM_ESTOQUE' | 'REMOVIDO' | 'BLOQUEADO';
  impressoes: number;
  cliques: number;
  conversao: number; // percent
  vendas30d: number;
  receita30d: number;
  categoria: string;
  urlAnuncio?: string;
  anuncioId: string; // marketplace-specific listing ID
  criadoEm: string;
  atualizadoEm: string;
}

export interface PerguntaMock {
  id: string;
  canal: 'MERCADO_LIVRE' | 'SHOPEE' | 'AMAZON' | 'SHOPIFY';
  anuncioId: string;
  tituloAnuncio: string;
  comprador: string;
  pergunta: string;
  resposta?: string;
  status: 'PENDENTE' | 'RESPONDIDA' | 'ARQUIVADA';
  dataPergunta: string;
  dataResposta?: string;
  prioridade: 'NORMAL' | 'URGENTE';
}

export interface VendaCanalMock {
  canal: string;
  mes: string; // 'YYYY-MM'
  pedidos: number;
  receita: number;
  taxaPlataforma: number;
  receitaLiquida: number;
}

// ─── globalThis declarations ──────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __marketplacesMock: MarketplaceMock[] | undefined;
  // eslint-disable-next-line no-var
  var __anunciosMock: AnuncioMock[] | undefined;
  // eslint-disable-next-line no-var
  var __perguntasMock: PerguntaMock[] | undefined;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const _d = (diasAtras: number) => new Date(Date.now() - diasAtras * 86400_000).toISOString();
const _h = (horasAtras: number) => new Date(Date.now() - horasAtras * 3600_000).toISOString();

// ─── Initial Marketplaces ─────────────────────────────────────────────────────

const INITIAL_MARKETPLACES: MarketplaceMock[] = [
  {
    id: 'mkp-001',
    canal: 'MERCADO_LIVRE',
    nome: 'Mercado Livre',
    status: 'CONECTADO',
    taxaPlataforma: 13,
    sellerId: 'ML-BR-123456789',
    pedidosHoje: 48,
    pedidosMes: 312,
    anunciosAtivos: 234,
    anunciosPausados: 18,
    perguntasPendentes: 12,
    receitaMes: 28400,
    receitaLiquidaMes: 24708,
    ticketMedio: 91.03,
    avaliacaoVendedor: 4.8,
    taxaResposta: 94,
    taxaReclamacao: 0.8,
    ultimaSincronizacao: _h(0.5),
    criadoEm: _d(180),
  },
  {
    id: 'mkp-002',
    canal: 'SHOPEE',
    nome: 'Shopee',
    status: 'CONECTADO',
    taxaPlataforma: 20,
    sellerId: 'SHP-BR-987654321',
    pedidosHoje: 31,
    pedidosMes: 198,
    anunciosAtivos: 189,
    anunciosPausados: 24,
    perguntasPendentes: 8,
    receitaMes: 17200,
    receitaLiquidaMes: 13760,
    ticketMedio: 86.87,
    avaliacaoVendedor: 4.6,
    taxaResposta: 87,
    taxaReclamacao: 1.4,
    ultimaSincronizacao: _h(1),
    criadoEm: _d(150),
  },
  {
    id: 'mkp-003',
    canal: 'AMAZON',
    nome: 'Amazon',
    status: 'ERRO',
    taxaPlataforma: 15,
    sellerId: 'AMZ-BR-567891234',
    pedidosHoje: 0,
    pedidosMes: 89,
    anunciosAtivos: 76,
    anunciosPausados: 5,
    perguntasPendentes: 3,
    receitaMes: 9800,
    receitaLiquidaMes: 8330,
    ticketMedio: 110.11,
    avaliacaoVendedor: 4.9,
    taxaResposta: 98,
    taxaReclamacao: 0.3,
    ultimaSincronizacao: _h(12),
    criadoEm: _d(120),
  },
  {
    id: 'mkp-004',
    canal: 'SHOPIFY',
    nome: 'Shopify (Loja Própria)',
    status: 'CONECTADO',
    taxaPlataforma: 2, // payment gateway only
    sellerId: 'SHF-BR-111222333',
    pedidosHoje: 19,
    pedidosMes: 147,
    anunciosAtivos: 156,
    anunciosPausados: 8,
    perguntasPendentes: 0,
    receitaMes: 12600,
    receitaLiquidaMes: 12348,
    ticketMedio: 85.71,
    avaliacaoVendedor: 5.0,
    taxaResposta: 100,
    taxaReclamacao: 0.1,
    ultimaSincronizacao: _h(0.25),
    criadoEm: _d(200),
  },
];

// ─── Initial Anuncios ─────────────────────────────────────────────────────────

const INITIAL_ANUNCIOS: AnuncioMock[] = [
  // iPhone 15 Pro — Mercado Livre
  {
    id: 'anu-001',
    produtoId: 'p0000001-0000-0000-0000-000000000001',
    canal: 'MERCADO_LIVRE',
    titulo: 'iPhone 15 Pro 256GB Titânio Preto – Lacrado Garantia Apple',
    sku: 'APPL-IP15P-256-PT',
    preco: 8499,
    precoPromocional: 7999,
    custoMedio: 5800,
    estoque: 12,
    status: 'ATIVO',
    impressoes: 1245,
    cliques: 142,
    conversao: 3.2,
    vendas30d: 28,
    receita30d: 223972,
    categoria: 'Celulares e Telefonia',
    urlAnuncio: 'https://www.mercadolivre.com.br/MLB-001',
    anuncioId: 'MLB-001234567',
    criadoEm: _d(90),
    atualizadoEm: _d(2),
  },
  // Samsung Galaxy S24 Ultra — Mercado Livre
  {
    id: 'anu-002',
    produtoId: 'p0000002-0000-0000-0000-000000000001',
    canal: 'MERCADO_LIVRE',
    titulo: 'Samsung Galaxy S24 Ultra 256GB Preto – Anatel + NF',
    sku: 'SAMS-S24U-256-PT',
    preco: 6299,
    custoMedio: 3900,
    estoque: 8,
    status: 'ATIVO',
    impressoes: 987,
    cliques: 98,
    conversao: 2.8,
    vendas30d: 19,
    receita30d: 119681,
    categoria: 'Celulares e Telefonia',
    urlAnuncio: 'https://www.mercadolivre.com.br/MLB-002',
    anuncioId: 'MLB-002345678',
    criadoEm: _d(85),
    atualizadoEm: _d(1),
  },
  // Samsung Galaxy S24 Ultra — Shopee
  {
    id: 'anu-003',
    produtoId: 'p0000002-0000-0000-0000-000000000001',
    canal: 'SHOPEE',
    titulo: 'Samsung Galaxy S24 Ultra 256GB – Garantia 1 Ano',
    sku: 'SAMS-S24U-256-PT',
    preco: 6099,
    precoPromocional: 5899,
    custoMedio: 3900,
    estoque: 3,
    status: 'ATIVO',
    impressoes: 743,
    cliques: 68,
    conversao: 2.1,
    vendas30d: 11,
    receita30d: 64889,
    categoria: 'Celulares',
    urlAnuncio: 'https://shopee.com.br/product/002',
    anuncioId: 'SHP-BR-00234',
    criadoEm: _d(70),
    atualizadoEm: _d(3),
  },
  // Headphone Sony WH-1000XM5 — Mercado Livre
  {
    id: 'anu-004',
    produtoId: 'p0000003-0000-0000-0000-000000000001',
    canal: 'MERCADO_LIVRE',
    titulo: 'Headphone Sony WH-1000XM5 Cancelamento de Ruído – Preto',
    sku: 'SONY-WH1000XM5-PT',
    preco: 1899,
    custoMedio: 1100,
    estoque: 15,
    status: 'ATIVO',
    impressoes: 2341,
    cliques: 256,
    conversao: 4.1,
    vendas30d: 67,
    receita30d: 127233,
    categoria: 'Eletrônicos',
    urlAnuncio: 'https://www.mercadolivre.com.br/MLB-004',
    anuncioId: 'MLB-004567890',
    criadoEm: _d(110),
    atualizadoEm: _d(1),
  },
  // Headphone Sony WH-1000XM5 — Shopee
  {
    id: 'anu-005',
    produtoId: 'p0000003-0000-0000-0000-000000000001',
    canal: 'SHOPEE',
    titulo: 'Headphone Sony WH-1000XM5 Noise Cancelling – Original',
    sku: 'SONY-WH1000XM5-PT',
    preco: 1799,
    precoPromocional: 1699,
    custoMedio: 1100,
    estoque: 7,
    status: 'ATIVO',
    impressoes: 1678,
    cliques: 178,
    conversao: 3.8,
    vendas30d: 44,
    receita30d: 74756,
    categoria: 'Áudio',
    urlAnuncio: 'https://shopee.com.br/product/005',
    anuncioId: 'SHP-BR-00345',
    criadoEm: _d(95),
    atualizadoEm: _d(2),
  },
  // Notebook Dell i5 — Mercado Livre
  {
    id: 'anu-006',
    produtoId: 'p0000004-0000-0000-0000-000000000001',
    canal: 'MERCADO_LIVRE',
    titulo: 'Notebook Dell Inspiron 15 i5 512GB SSD 8GB RAM – NF Incluída',
    sku: 'DELL-INS15-I5-512',
    preco: 3999,
    custoMedio: 2800,
    estoque: 4,
    status: 'ATIVO',
    impressoes: 567,
    cliques: 52,
    conversao: 2.3,
    vendas30d: 9,
    receita30d: 35991,
    categoria: 'Informática',
    urlAnuncio: 'https://www.mercadolivre.com.br/MLB-006',
    anuncioId: 'MLB-006789012',
    criadoEm: _d(75),
    atualizadoEm: _d(5),
  },
  // Notebook Dell i5 — Amazon
  {
    id: 'anu-007',
    produtoId: 'p0000004-0000-0000-0000-000000000001',
    canal: 'AMAZON',
    titulo: 'Dell Inspiron 15 Intel Core i5 512GB SSD Notebook',
    sku: 'DELL-INS15-I5-512',
    preco: 3899,
    custoMedio: 2800,
    estoque: 2,
    status: 'ATIVO',
    impressoes: 389,
    cliques: 31,
    conversao: 1.9,
    vendas30d: 5,
    receita30d: 19495,
    categoria: 'Computers',
    urlAnuncio: 'https://amazon.com.br/dp/B00001',
    anuncioId: 'AMZ-ASIN-B00001',
    criadoEm: _d(60),
    atualizadoEm: _d(4),
  },
  // Notebook Dell i5 — Shopify
  {
    id: 'anu-008',
    produtoId: 'p0000004-0000-0000-0000-000000000001',
    canal: 'SHOPIFY',
    titulo: 'Notebook Dell Inspiron 15 i5 512GB SSD',
    sku: 'DELL-INS15-I5-512',
    preco: 4199,
    custoMedio: 2800,
    estoque: 6,
    status: 'ATIVO',
    impressoes: 298,
    cliques: 24,
    conversao: 2.5,
    vendas30d: 6,
    receita30d: 25194,
    categoria: 'Informática',
    urlAnuncio: 'https://loja.exemplo.com.br/notebooks/dell-inspiron',
    anuncioId: 'SHF-PROD-00008',
    criadoEm: _d(55),
    atualizadoEm: _d(2),
  },
  // GoPro HERO12 — Mercado Livre
  {
    id: 'anu-009',
    produtoId: 'p0000008-0000-0000-0000-000000000001',
    canal: 'MERCADO_LIVRE',
    titulo: 'GoPro HERO12 Black 5.3K Ultra HD – Kit Acessórios Grátis',
    sku: 'GPRO-HERO12-BLK',
    preco: 2499,
    custoMedio: 1350,
    estoque: 5,
    status: 'ATIVO',
    impressoes: 812,
    cliques: 74,
    conversao: 2.7,
    vendas30d: 14,
    receita30d: 34986,
    categoria: 'Câmeras e Drones',
    urlAnuncio: 'https://www.mercadolivre.com.br/MLB-009',
    anuncioId: 'MLB-009012345',
    criadoEm: _d(80),
    atualizadoEm: _d(3),
  },
  // GoPro HERO12 — Shopee (sem estoque)
  {
    id: 'anu-010',
    produtoId: 'p0000008-0000-0000-0000-000000000001',
    canal: 'SHOPEE',
    titulo: 'GoPro HERO12 Black – Original com Garantia',
    sku: 'GPRO-HERO12-BLK',
    preco: 2399,
    custoMedio: 1350,
    estoque: 0,
    status: 'SEM_ESTOQUE',
    impressoes: 634,
    cliques: 48,
    conversao: 0,
    vendas30d: 0,
    receita30d: 0,
    categoria: 'Câmeras',
    urlAnuncio: 'https://shopee.com.br/product/010',
    anuncioId: 'SHP-BR-00456',
    criadoEm: _d(70),
    atualizadoEm: _d(1),
  },
  // Tênis Nike Air Max 270 — Shopify
  {
    id: 'anu-011',
    produtoId: 'p0000005-0000-0000-0000-000000000001',
    canal: 'SHOPIFY',
    titulo: 'Tênis Nike Air Max 270 – Todas as Numerações',
    sku: 'NIKE-AIRMAX-270',
    preco: 899,
    precoPromocional: 799,
    custoMedio: 320,
    estoque: 32,
    status: 'ATIVO',
    impressoes: 1567,
    cliques: 189,
    conversao: 5.2,
    vendas30d: 62,
    receita30d: 49538,
    categoria: 'Calçados',
    urlAnuncio: 'https://loja.exemplo.com.br/tenis/nike-air-max-270',
    anuncioId: 'SHF-PROD-00011',
    criadoEm: _d(100),
    atualizadoEm: _d(1),
  },
  // Tênis Nike Air Max 270 — Shopee
  {
    id: 'anu-012',
    produtoId: 'p0000005-0000-0000-0000-000000000001',
    canal: 'SHOPEE',
    titulo: 'Tênis Nike Air Max 270 Original – Várias Cores',
    sku: 'NIKE-AIRMAX-270',
    preco: 879,
    custoMedio: 320,
    estoque: 18,
    status: 'ATIVO',
    impressoes: 1123,
    cliques: 134,
    conversao: 4.5,
    vendas30d: 41,
    receita30d: 36039,
    categoria: 'Calçados e Tênis',
    urlAnuncio: 'https://shopee.com.br/product/012',
    anuncioId: 'SHP-BR-00567',
    criadoEm: _d(88),
    atualizadoEm: _d(2),
  },
  // Camiseta Polo Ralph Lauren — Shopify
  {
    id: 'anu-013',
    produtoId: 'p0000006-0000-0000-0000-000000000001',
    canal: 'SHOPIFY',
    titulo: 'Camiseta Polo Ralph Lauren – Coleção Verão 2025',
    sku: 'POLO-CAMS-M-BR',
    preco: 399,
    precoPromocional: 349,
    custoMedio: 130,
    estoque: 45,
    status: 'ATIVO',
    impressoes: 934,
    cliques: 112,
    conversao: 6.1,
    vendas30d: 48,
    receita30d: 16752,
    categoria: 'Moda',
    urlAnuncio: 'https://loja.exemplo.com.br/roupas/polo-ralph-lauren',
    anuncioId: 'SHF-PROD-00013',
    criadoEm: _d(60),
    atualizadoEm: _d(1),
  },
  // Mochila Samsonite — Mercado Livre (pausado)
  {
    id: 'anu-014',
    produtoId: 'p0000007-0000-0000-0000-000000000001',
    canal: 'MERCADO_LIVRE',
    titulo: 'Mochila Samsonite Pro-DLX 5 Laptop 15,6" Preta',
    sku: 'SAMS-BACKP-PRO',
    preco: 899,
    custoMedio: 440,
    estoque: 2,
    status: 'PAUSADO',
    impressoes: 312,
    cliques: 28,
    conversao: 1.8,
    vendas30d: 3,
    receita30d: 2697,
    categoria: 'Bolsas e Mochilas',
    urlAnuncio: 'https://www.mercadolivre.com.br/MLB-014',
    anuncioId: 'MLB-014345678',
    criadoEm: _d(65),
    atualizadoEm: _d(7),
  },
  // Mochila Samsonite — Amazon (ativo)
  {
    id: 'anu-015',
    produtoId: 'p0000007-0000-0000-0000-000000000001',
    canal: 'AMAZON',
    titulo: 'Samsonite Pro-DLX 5 Backpack 15.6" Laptop Black',
    sku: 'SAMS-BACKP-PRO',
    preco: 859,
    custoMedio: 440,
    estoque: 4,
    status: 'ATIVO',
    impressoes: 445,
    cliques: 39,
    conversao: 2.4,
    vendas30d: 8,
    receita30d: 6872,
    categoria: 'Luggage',
    urlAnuncio: 'https://amazon.com.br/dp/B00002',
    anuncioId: 'AMZ-ASIN-B00002',
    criadoEm: _d(55),
    atualizadoEm: _d(6),
  },
  // Tênis Nike — Amazon (bloqueado)
  {
    id: 'anu-016',
    produtoId: 'p0000005-0000-0000-0000-000000000001',
    canal: 'AMAZON',
    titulo: 'Nike Air Max 270 Running Shoes',
    sku: 'NIKE-AIRMAX-270-AMZ',
    preco: 869,
    custoMedio: 320,
    estoque: 5,
    status: 'BLOQUEADO',
    impressoes: 0,
    cliques: 0,
    conversao: 0,
    vendas30d: 0,
    receita30d: 0,
    categoria: 'Shoes',
    urlAnuncio: 'https://amazon.com.br/dp/B00003',
    anuncioId: 'AMZ-ASIN-B00003',
    criadoEm: _d(40),
    atualizadoEm: _d(10),
  },
];

// ─── Initial Perguntas ────────────────────────────────────────────────────────

const INITIAL_PERGUNTAS: PerguntaMock[] = [
  // ── PENDENTES ────────────────────────────────────────────────────────────────
  {
    id: 'prg-001',
    canal: 'MERCADO_LIVRE',
    anuncioId: 'anu-001',
    tituloAnuncio: 'iPhone 15 Pro 256GB Titânio Preto – Lacrado Garantia Apple',
    comprador: 'carlos_silva_sp',
    pergunta: 'Boa tarde! O produto é original da Apple com nota fiscal? A garantia é diretamente com a Apple Brasil ou com o vendedor?',
    status: 'PENDENTE',
    dataPergunta: _h(30),
    prioridade: 'URGENTE',
  },
  {
    id: 'prg-002',
    canal: 'MERCADO_LIVRE',
    anuncioId: 'anu-002',
    tituloAnuncio: 'Samsung Galaxy S24 Ultra 256GB Preto – Anatel + NF',
    comprador: 'mariana_rj2024',
    pergunta: 'Esse produto tem selo Anatel? Consegue enviar para o Rio de Janeiro? Qual o prazo estimado?',
    status: 'PENDENTE',
    dataPergunta: _h(26),
    prioridade: 'URGENTE',
  },
  {
    id: 'prg-003',
    canal: 'SHOPEE',
    anuncioId: 'anu-003',
    tituloAnuncio: 'Samsung Galaxy S24 Ultra 256GB – Garantia 1 Ano',
    comprador: 'joao_comprando',
    pergunta: 'Tem em cinza? E qual o prazo de entrega para Minas Gerais?',
    status: 'PENDENTE',
    dataPergunta: _h(18),
    prioridade: 'NORMAL',
  },
  {
    id: 'prg-004',
    canal: 'MERCADO_LIVRE',
    anuncioId: 'anu-004',
    tituloAnuncio: 'Headphone Sony WH-1000XM5 Cancelamento de Ruído – Preto',
    comprador: 'tech_enthusiast_br',
    pergunta: 'Funciona com codec LDAC para dispositivos Sony? É compatível com iOS e Android simultaneamente?',
    status: 'PENDENTE',
    dataPergunta: _h(14),
    prioridade: 'NORMAL',
  },
  {
    id: 'prg-005',
    canal: 'SHOPEE',
    anuncioId: 'anu-005',
    tituloAnuncio: 'Headphone Sony WH-1000XM5 Noise Cancelling – Original',
    comprador: 'musica_lover99',
    pergunta: 'Qual a bateria em horas de uso contínuo? E carrega via USB-C ou USB-A?',
    status: 'PENDENTE',
    dataPergunta: _h(10),
    prioridade: 'NORMAL',
  },
  {
    id: 'prg-006',
    canal: 'MERCADO_LIVRE',
    anuncioId: 'anu-006',
    tituloAnuncio: 'Notebook Dell Inspiron 15 i5 512GB SSD 8GB RAM – NF Incluída',
    comprador: 'empreendedor2025',
    pergunta: 'A memória RAM é expansível até quantos GB? Já vem com Windows 11 instalado e ativado?',
    status: 'PENDENTE',
    dataPergunta: _h(8),
    prioridade: 'NORMAL',
  },
  {
    id: 'prg-007',
    canal: 'AMAZON',
    anuncioId: 'anu-007',
    tituloAnuncio: 'Dell Inspiron 15 Intel Core i5 512GB SSD Notebook',
    comprador: 'prime_member_2024',
    pergunta: 'Does this come with a Portuguese keyboard layout? Is it eligible for Prime delivery?',
    status: 'PENDENTE',
    dataPergunta: _h(5),
    prioridade: 'NORMAL',
  },
  {
    id: 'prg-008',
    canal: 'MERCADO_LIVRE',
    anuncioId: 'anu-009',
    tituloAnuncio: 'GoPro HERO12 Black 5.3K Ultra HD – Kit Acessórios Grátis',
    comprador: 'surfista_floripa',
    pergunta: 'É resistente à água sem carcaça protetora? Suporta filmagem subaquática até qual profundidade?',
    status: 'PENDENTE',
    dataPergunta: _h(3),
    prioridade: 'NORMAL',
  },
  // ── RESPONDIDAS ──────────────────────────────────────────────────────────────
  {
    id: 'prg-009',
    canal: 'MERCADO_LIVRE',
    anuncioId: 'anu-001',
    tituloAnuncio: 'iPhone 15 Pro 256GB Titânio Preto – Lacrado Garantia Apple',
    comprador: 'fernanda_bh_shop',
    pergunta: 'Aceita parcelamento no cartão em quantas vezes sem juros?',
    resposta: 'Olá Fernanda! Aceitamos parcelamento em até 12x sem juros no cartão de crédito via Mercado Pago. O produto é emitido com nota fiscal e possui garantia Apple de 1 ano. Qualquer dúvida, estamos à disposição!',
    status: 'RESPONDIDA',
    dataPergunta: _d(5),
    dataResposta: _d(5),
    prioridade: 'NORMAL',
  },
  {
    id: 'prg-010',
    canal: 'SHOPEE',
    anuncioId: 'anu-005',
    tituloAnuncio: 'Headphone Sony WH-1000XM5 Noise Cancelling – Original',
    comprador: 'gabriel_gamer_mg',
    pergunta: 'Funciona bem para chamadas de vídeo no Teams e Zoom?',
    resposta: 'Oi Gabriel! Sim, o Sony WH-1000XM5 é excelente para chamadas. Possui microfone com cancelamento de ruído preciso via IA, ideal para Teams, Zoom e Google Meet. Qualidade profissional garantida!',
    status: 'RESPONDIDA',
    dataPergunta: _d(3),
    dataResposta: _d(3),
    prioridade: 'NORMAL',
  },
  {
    id: 'prg-011',
    canal: 'MERCADO_LIVRE',
    anuncioId: 'anu-004',
    tituloAnuncio: 'Headphone Sony WH-1000XM5 Cancelamento de Ruído – Preto',
    comprador: 'patricia_contadora',
    pergunta: 'Vem com cabo auxiliar P2? Funciona sem bateria conectado no fio?',
    resposta: 'Olá Patrícia! Sim, acompanha cabo auxiliar P2 na caixa e funciona no modo com fio quando a bateria acaba. Ideal para uso prolongado!',
    status: 'RESPONDIDA',
    dataPergunta: _d(7),
    dataResposta: _d(7),
    prioridade: 'NORMAL',
  },
  {
    id: 'prg-012',
    canal: 'AMAZON',
    anuncioId: 'anu-015',
    tituloAnuncio: 'Samsonite Pro-DLX 5 Backpack 15.6" Laptop Black',
    comprador: 'business_traveler_sp',
    pergunta: 'Is this carry-on approved for most airlines? What are the exact dimensions?',
    resposta: 'Hello! The Samsonite Pro-DLX 5 measures 31x19x44cm (WxDxH) and fits most airline carry-on requirements. It has TSA-approved locks and a dedicated laptop compartment. Highly recommended for business travel!',
    status: 'RESPONDIDA',
    dataPergunta: _d(4),
    dataResposta: _d(4),
    prioridade: 'NORMAL',
  },
  {
    id: 'prg-013',
    canal: 'MERCADO_LIVRE',
    anuncioId: 'anu-009',
    tituloAnuncio: 'GoPro HERO12 Black 5.3K Ultra HD – Kit Acessórios Grátis',
    comprador: 'aventureiro_ceara',
    pergunta: 'Que acessórios vêm inclusos no kit? Tem suporte de capacete?',
    resposta: 'Oi! O kit inclui: câmera GoPro HERO12, bateria extra, carregador duplo, suporte de capacete lateral, suporte de guidão, case de silicone protetora e cabo USB-C. Tudo que precisa para começar!',
    status: 'RESPONDIDA',
    dataPergunta: _d(6),
    dataResposta: _d(6),
    prioridade: 'NORMAL',
  },
  {
    id: 'prg-014',
    canal: 'SHOPEE',
    anuncioId: 'anu-012',
    tituloAnuncio: 'Tênis Nike Air Max 270 Original – Várias Cores',
    comprador: 'fitness_runner_rs',
    pergunta: 'O solado é adequado para corrida ou só caminhada? Tem numeração 45?',
    resposta: 'Oi! O Nike Air Max 270 é excelente para caminhada e uso casual, com amortecimento Air de 270°. Para corrida intensa, recomendamos modelos específicos como o React Infinity. Temos numeração 45 disponível! 😊',
    status: 'RESPONDIDA',
    dataPergunta: _d(2),
    dataResposta: _d(2),
    prioridade: 'NORMAL',
  },
];

// ─── Vendas por Canal ─────────────────────────────────────────────────────────

export const VENDAS_POR_CANAL: VendaCanalMock[] = [
  // Mercado Livre
  { canal: 'MERCADO_LIVRE', mes: '2025-11', pedidos: 267, receita: 23800, taxaPlataforma: 13, receitaLiquida: 20706 },
  { canal: 'MERCADO_LIVRE', mes: '2025-12', pedidos: 298, receita: 26200, taxaPlataforma: 13, receitaLiquida: 22794 },
  { canal: 'MERCADO_LIVRE', mes: '2026-01', pedidos: 281, receita: 24900, taxaPlataforma: 13, receitaLiquida: 21663 },
  { canal: 'MERCADO_LIVRE', mes: '2026-02', pedidos: 305, receita: 27100, taxaPlataforma: 13, receitaLiquida: 23577 },
  { canal: 'MERCADO_LIVRE', mes: '2026-03', pedidos: 322, receita: 28900, taxaPlataforma: 13, receitaLiquida: 25143 },
  { canal: 'MERCADO_LIVRE', mes: '2026-04', pedidos: 312, receita: 28400, taxaPlataforma: 13, receitaLiquida: 24708 },
  // Shopify
  { canal: 'SHOPIFY', mes: '2025-11', pedidos: 118, receita: 9800, taxaPlataforma: 2, receitaLiquida: 9604 },
  { canal: 'SHOPIFY', mes: '2025-12', pedidos: 134, receita: 11200, taxaPlataforma: 2, receitaLiquida: 10976 },
  { canal: 'SHOPIFY', mes: '2026-01', pedidos: 121, receita: 10100, taxaPlataforma: 2, receitaLiquida: 9898 },
  { canal: 'SHOPIFY', mes: '2026-02', pedidos: 138, receita: 11800, taxaPlataforma: 2, receitaLiquida: 11564 },
  { canal: 'SHOPIFY', mes: '2026-03', pedidos: 145, receita: 12400, taxaPlataforma: 2, receitaLiquida: 12152 },
  { canal: 'SHOPIFY', mes: '2026-04', pedidos: 147, receita: 12600, taxaPlataforma: 2, receitaLiquida: 12348 },
  // Shopee
  { canal: 'SHOPEE', mes: '2025-11', pedidos: 156, receita: 12900, taxaPlataforma: 20, receitaLiquida: 10320 },
  { canal: 'SHOPEE', mes: '2025-12', pedidos: 178, receita: 14700, taxaPlataforma: 20, receitaLiquida: 11760 },
  { canal: 'SHOPEE', mes: '2026-01', pedidos: 162, receita: 13400, taxaPlataforma: 20, receitaLiquida: 10720 },
  { canal: 'SHOPEE', mes: '2026-02', pedidos: 183, receita: 15100, taxaPlataforma: 20, receitaLiquida: 12080 },
  { canal: 'SHOPEE', mes: '2026-03', pedidos: 191, receita: 16300, taxaPlataforma: 20, receitaLiquida: 13040 },
  { canal: 'SHOPEE', mes: '2026-04', pedidos: 198, receita: 17200, taxaPlataforma: 20, receitaLiquida: 13760 },
  // Amazon
  { canal: 'AMAZON', mes: '2025-11', pedidos: 72, receita: 7600, taxaPlataforma: 15, receitaLiquida: 6460 },
  { canal: 'AMAZON', mes: '2025-12', pedidos: 81, receita: 8500, taxaPlataforma: 15, receitaLiquida: 7225 },
  { canal: 'AMAZON', mes: '2026-01', pedidos: 76, receita: 8100, taxaPlataforma: 15, receitaLiquida: 6885 },
  { canal: 'AMAZON', mes: '2026-02', pedidos: 84, receita: 8900, taxaPlataforma: 15, receitaLiquida: 7565 },
  { canal: 'AMAZON', mes: '2026-03', pedidos: 91, receita: 9600, taxaPlataforma: 15, receitaLiquida: 8160 },
  { canal: 'AMAZON', mes: '2026-04', pedidos: 89, receita: 9800, taxaPlataforma: 15, receitaLiquida: 8330 },
];

// ─── Persistence ──────────────────────────────────────────────────────────────

if (!globalThis.__marketplacesMock) globalThis.__marketplacesMock = INITIAL_MARKETPLACES;
if (!globalThis.__anunciosMock) globalThis.__anunciosMock = INITIAL_ANUNCIOS;
if (!globalThis.__perguntasMock) globalThis.__perguntasMock = INITIAL_PERGUNTAS;

export const MARKETPLACES_MOCK: MarketplaceMock[] = globalThis.__marketplacesMock;
export const ANUNCIOS_MOCK: AnuncioMock[] = globalThis.__anunciosMock;
export const PERGUNTAS_MOCK: PerguntaMock[] = globalThis.__perguntasMock;
