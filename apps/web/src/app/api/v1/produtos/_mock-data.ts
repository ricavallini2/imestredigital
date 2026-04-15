// Dados mock em memória para o módulo de produtos (dev sem catalog-service)
// Usa globalThis para compartilhar o array entre todas as rotas (isolamento de módulos no Next.js)
export const TENANT_ID = '10000000-0000-0000-0000-000000000001';

export interface VariacaoMock {
  id: string;
  tipo: string;    // Cor | Tamanho | Capacidade | Versão | Material | Voltagem | Única
  valor: string;   // Ex: "Azul", "P", "128GB", "Única"
  sku?: string;
  precoCusto?: number; // Custo desta variação
  preco?: number;      // Preço de venda desta variação
  estoque: number;
}
export interface ProdutoMock {
  id: string; tenantId: string;
  sku: string; ean?: string; nome: string; descricao: string;
  descricaoCurta?: string; categoria: string; categoriaId: string;
  marca: string; status: 'ATIVO' | 'INATIVO' | 'RASCUNHO';
  preco: number; precoCusto: number; precoPromocional?: number;
  margemLucro: number; // %
  peso: number; altura: number; largura: number; comprimento: number;
  ncm: string; cfop: string; origem: number;
  estoque: number; estoqueMinimo: number;
  tags: string[]; imagens: string[];
  variacoes: VariacaoMock[];
  metaDescricao?: string; metaPalavrasChave?: string;
  vendasUltimos30Dias: number; vendasTotal: number; receitaTotal: number;
  criadoEm: string; atualizadoEm: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __produtosMock: ProdutoMock[] | undefined;
}

const d = (diasAtras: number) => new Date(Date.now() - diasAtras * 86400000).toISOString();

const INITIAL_PRODUTOS: ProdutoMock[] = [
  {
    id: 'p0000001-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, sku: 'APPL-IP15P-256-PT', ean: '0194253716891',
    nome: 'iPhone 15 Pro 256GB Titânio Preto', descricao: 'O iPhone 15 Pro apresenta design em titânio aeroespacial com chip A17 Pro, câmera principal de 48MP com zoom tetraprismático e Dynamic Island.',
    descricaoCurta: 'iPhone 15 Pro com chip A17 Pro e câmera de 48MP',
    categoria: 'Eletrônicos', categoriaId: 'cat-001',
    marca: 'Apple', status: 'ATIVO',
    preco: 7999.00, precoCusto: 5100.00, margemLucro: 56.8,
    peso: 187, altura: 14.7, largura: 7.1, comprimento: 0.83,
    ncm: '85171200', cfop: '5102', origem: 0,
    estoque: 24, estoqueMinimo: 5,
    tags: ['apple', 'iphone', 'premium', '5g'],
    imagens: [],
    variacoes: [
      { id: 'v001', tipo: 'Capacidade', valor: '128GB', sku: 'APPL-IP15P-128-PT', precoCusto: 5100, preco: 7999, estoque: 8 },
      { id: 'v002', tipo: 'Capacidade', valor: '256GB', sku: 'APPL-IP15P-256-PT', precoCusto: 5800, preco: 8999, estoque: 12 },
      { id: 'v003', tipo: 'Capacidade', valor: '512GB', sku: 'APPL-IP15P-512-PT', precoCusto: 7000, preco: 10999, estoque: 4 },
    ],
    metaDescricao: 'Compre iPhone 15 Pro com entrega rápida. Chip A17 Pro, câmera 48MP, design titânio.',
    metaPalavrasChave: 'iphone 15 pro, apple, smartphone, 5g, titânio',
    vendasUltimos30Dias: 7, vendasTotal: 43, receitaTotal: 386957.00,
    criadoEm: '2024-01-10T10:00:00Z', atualizadoEm: d(2),
  },
  {
    id: 'p0000002-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, sku: 'SAMS-S24U-256-PT', ean: '8806095071930',
    nome: 'Samsung Galaxy S24 Ultra 256GB Preto',
    descricao: 'Galaxy S24 Ultra com S Pen integrada, câmera de 200MP com zoom óptico de 10x, tela Dynamic AMOLED 2X de 6.8" e processador Snapdragon 8 Gen 3.',
    descricaoCurta: 'Galaxy S24 Ultra com S Pen e câmera 200MP',
    categoria: 'Eletrônicos', categoriaId: 'cat-001',
    marca: 'Samsung', status: 'ATIVO',
    preco: 6499.00, precoCusto: 3900.00, margemLucro: 66.6,
    peso: 232, altura: 16.2, largura: 7.9, comprimento: 0.86,
    ncm: '85171200', cfop: '5102', origem: 0,
    estoque: 18, estoqueMinimo: 5,
    tags: ['samsung', 'galaxy', 'android', '5g', 's-pen'],
    imagens: [],
    variacoes: [
      { id: 'v004', tipo: 'Cor', valor: 'Preto Titânio', sku: 'SAMS-S24U-256-BK', precoCusto: 3900, preco: 6499, estoque: 10 },
      { id: 'v005', tipo: 'Cor', valor: 'Prata Titânio', sku: 'SAMS-S24U-256-SV', precoCusto: 3900, preco: 6499, estoque: 8 },
    ],
    metaPalavrasChave: 'samsung galaxy s24 ultra, s pen, 200mp, android',
    vendasUltimos30Dias: 5, vendasTotal: 31, receitaTotal: 201469.00,
    criadoEm: '2024-02-15T11:00:00Z', atualizadoEm: d(5),
  },
  {
    id: 'p0000003-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, sku: 'SONY-WH1000XM5-PT',
    nome: 'Headphone Sony WH-1000XM5 Preto',
    descricao: 'Fone de ouvido sem fio com cancelamento de ruído líder do setor, 30h de bateria, suporte a Bluetooth 5.2, LDAC e conexão múltipla.',
    descricaoCurta: 'Headphone premium com cancelamento de ruído ativo',
    categoria: 'Eletrônicos', categoriaId: 'cat-001',
    marca: 'Sony', status: 'ATIVO',
    preco: 1899.00, precoCusto: 1100.00, margemLucro: 72.6,
    peso: 250, altura: 21.0, largura: 19.4, comprimento: 8.9,
    ncm: '85183000', cfop: '5102', origem: 0,
    estoque: 35, estoqueMinimo: 10,
    tags: ['sony', 'headphone', 'noise-cancelling', 'bluetooth'],
    imagens: [],
    variacoes: [
      { id: 'v006', tipo: 'Cor', valor: 'Preto', sku: 'SONY-WH1000XM5-BK', precoCusto: 1100, preco: 1899, estoque: 20 },
      { id: 'v007', tipo: 'Cor', valor: 'Prata', sku: 'SONY-WH1000XM5-SV', precoCusto: 1150, preco: 1999, estoque: 15 },
    ],
    vendasUltimos30Dias: 12, vendasTotal: 89, receitaTotal: 169011.00,
    criadoEm: '2024-01-20T09:00:00Z', atualizadoEm: d(10),
  },
  {
    id: 'p0000004-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, sku: 'DELL-INS15-I5-512',
    nome: 'Notebook Dell Inspiron 15 i5 512GB',
    descricao: 'Notebook Dell Inspiron 15 com processador Intel Core i5-1335U de 13ª geração, 16GB RAM DDR5, SSD NVMe 512GB, tela FHD antirreflexo 15.6".',
    descricaoCurta: 'Notebook Dell Intel i5 16GB RAM 512GB SSD',
    categoria: 'Informática', categoriaId: 'cat-002',
    marca: 'Dell', status: 'ATIVO',
    preco: 4299.00, precoCusto: 2800.00, margemLucro: 53.5,
    peso: 1750, altura: 35.9, largura: 23.6, comprimento: 1.79,
    ncm: '84713012', cfop: '5102', origem: 0,
    estoque: 12, estoqueMinimo: 3,
    tags: ['dell', 'notebook', 'laptop', 'intel', 'windows'],
    imagens: [],
    variacoes: [
      { id: 'v-dell-u1', tipo: 'Única', valor: 'Única', sku: 'DELL-INS15-I5-512', precoCusto: 2800, preco: 4299, estoque: 12 },
    ],
    vendasUltimos30Dias: 3, vendasTotal: 19, receitaTotal: 81681.00,
    criadoEm: '2024-03-05T14:00:00Z', atualizadoEm: d(15),
  },
  {
    id: 'p0000005-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, sku: 'NIKE-AIRMAX-270-42',
    nome: 'Tênis Nike Air Max 270 Preto N°42',
    descricao: 'Tênis Nike Air Max 270 com maior câmara de ar da história Nike, palmilha macia e design moderno para uso casual e esportivo.',
    descricaoCurta: 'Tênis Nike Air Max 270 com câmara de ar',
    categoria: 'Calçados', categoriaId: 'cat-003',
    marca: 'Nike', status: 'ATIVO',
    preco: 699.00, precoCusto: 320.00, margemLucro: 118.4,
    peso: 420, altura: 32.0, largura: 12.0, comprimento: 9.0,
    ncm: '64041100', cfop: '5102', origem: 0,
    estoque: 48, estoqueMinimo: 10,
    tags: ['nike', 'tênis', 'air max', 'esporte'],
    imagens: [],
    variacoes: [
      { id: 'v008', tipo: 'Tamanho', valor: '38', sku: 'NIKE-AIRMAX-270-38', precoCusto: 320, preco: 699, estoque: 8 },
      { id: 'v009', tipo: 'Tamanho', valor: '40', sku: 'NIKE-AIRMAX-270-40', precoCusto: 320, preco: 699, estoque: 12 },
      { id: 'v010', tipo: 'Tamanho', valor: '42', sku: 'NIKE-AIRMAX-270-42', precoCusto: 320, preco: 699, estoque: 16 },
      { id: 'v011', tipo: 'Tamanho', valor: '44', sku: 'NIKE-AIRMAX-270-44', precoCusto: 320, preco: 699, estoque: 12 },
    ],
    vendasUltimos30Dias: 18, vendasTotal: 142, receitaTotal: 99258.00,
    criadoEm: '2023-11-01T08:00:00Z', atualizadoEm: d(3),
  },
  {
    id: 'p0000006-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, sku: 'POLO-CAMS-M-BR',
    nome: 'Camiseta Polo Ralph Lauren Branca M',
    descricao: 'Camiseta polo clássica Ralph Lauren confeccionada em algodão piquê de alta qualidade com bordado do pônei icônico.',
    descricaoCurta: 'Polo Ralph Lauren algodão piquê premium',
    categoria: 'Vestuário', categoriaId: 'cat-004',
    marca: 'Ralph Lauren', status: 'ATIVO',
    preco: 349.00, precoCusto: 130.00, margemLucro: 168.5,
    peso: 200, altura: 28.0, largura: 20.0, comprimento: 2.0,
    ncm: '61051000', cfop: '5102', origem: 0,
    estoque: 62, estoqueMinimo: 15,
    tags: ['ralph lauren', 'polo', 'moda', 'premium'],
    imagens: [],
    variacoes: [
      { id: 'v012', tipo: 'Tamanho', valor: 'P',  sku: 'POLO-CAMS-P-BR',  precoCusto: 130, preco: 349, estoque: 14 },
      { id: 'v013', tipo: 'Tamanho', valor: 'M',  sku: 'POLO-CAMS-M-BR',  precoCusto: 130, preco: 349, estoque: 22 },
      { id: 'v014', tipo: 'Tamanho', valor: 'G',  sku: 'POLO-CAMS-G-BR',  precoCusto: 130, preco: 349, estoque: 18 },
      { id: 'v015', tipo: 'Tamanho', valor: 'GG', sku: 'POLO-CAMS-GG-BR', precoCusto: 145, preco: 379, estoque: 8 },
    ],
    vendasUltimos30Dias: 24, vendasTotal: 178, receitaTotal: 62122.00,
    criadoEm: '2023-09-15T10:00:00Z', atualizadoEm: d(7),
  },
  {
    id: 'p0000007-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, sku: 'SAMS-BACKP-PRO',
    nome: 'Mochila Samsonite Pro-DLX 5 Preta',
    descricao: 'Mochila executiva Samsonite com compartimento para notebook de até 15.6", bolsos organizados e material resistente à água.',
    descricaoCurta: 'Mochila executiva Samsonite para notebook 15.6"',
    categoria: 'Acessórios', categoriaId: 'cat-005',
    marca: 'Samsonite', status: 'INATIVO',
    preco: 899.00, precoCusto: 440.00, margemLucro: 104.3,
    peso: 800, altura: 45.0, largura: 30.0, comprimento: 15.0,
    ncm: '42021200', cfop: '5102', origem: 0,
    estoque: 0, estoqueMinimo: 3,
    tags: ['samsonite', 'mochila', 'executiva', 'notebook'],
    imagens: [],
    variacoes: [
      { id: 'v-sams-u1', tipo: 'Única', valor: 'Única', sku: 'SAMS-BACKP-PRO', precoCusto: 440, preco: 899, estoque: 0 },
    ],
    vendasUltimos30Dias: 0, vendasTotal: 34, receitaTotal: 30566.00,
    criadoEm: '2024-04-01T12:00:00Z', atualizadoEm: d(30),
  },
  {
    id: 'p0000008-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, sku: 'GPRO-HERO12-BLK',
    nome: 'GoPro HERO12 Black',
    descricao: 'Câmera de ação GoPro HERO12 com gravação em 5.3K60, estabilização HyperSmooth 6.0, resistente à água até 10m e bateria com 70min de gravação 4K.',
    descricaoCurta: 'Câmera de ação GoPro 5.3K com HyperSmooth 6.0',
    categoria: 'Eletrônicos', categoriaId: 'cat-001',
    marca: 'GoPro', status: 'RASCUNHO',
    preco: 2199.00, precoCusto: 1350.00, margemLucro: 62.9,
    peso: 154, altura: 7.1, largura: 5.5, comprimento: 3.3,
    ncm: '85258090', cfop: '5102', origem: 0,
    estoque: 8, estoqueMinimo: 2,
    tags: ['gopro', 'câmera', 'ação', '4k', 'esporte'],
    imagens: [],
    variacoes: [
      { id: 'v-go-u1', tipo: 'Única', valor: 'Única', sku: 'GPRO-HERO12-BLK', precoCusto: 1350, preco: 2199, estoque: 8 },
    ],
    vendasUltimos30Dias: 0, vendasTotal: 0, receitaTotal: 0.00,
    criadoEm: d(2), atualizadoEm: d(1),
  },
];

// Persiste no globalThis para sobreviver ao isolamento de módulos em dev
if (!globalThis.__produtosMock) {
  globalThis.__produtosMock = INITIAL_PRODUTOS;
}
export const PRODUTOS_MOCK: ProdutoMock[] = globalThis.__produtosMock;

export function findProduto(id: string): ProdutoMock | undefined {
  return PRODUTOS_MOCK.find((p) => p.id === id);
}

/** Deriva preco, precoCusto e margemLucro a partir das variações */
export function derivarPrecos(variacoes: VariacaoMock[]): { preco: number; precoCusto: number; margemLucro: number } {
  const precos = variacoes.map(v => v.preco ?? 0).filter(p => p > 0);
  const custos = variacoes.map(v => v.precoCusto ?? 0).filter(c => c > 0);
  const preco = precos.length > 0 ? Math.min(...precos) : 0;
  const precoCusto = custos.length > 0 ? custos[0] : 0;
  const margemLucro = precoCusto > 0 && preco > 0
    ? parseFloat(((preco - precoCusto) / precoCusto * 100).toFixed(1))
    : 0;
  return { preco, precoCusto, margemLucro };
}

// Análise IA baseada em dados do produto (fallback sem LLM)
export function analisarProdutoIA(produto: ProdutoMock) {
  const giroEstoque = produto.vendasUltimos30Dias / Math.max(produto.estoque, 1);
  const margemPct = produto.margemLucro;
  const estoqueStatus = produto.estoque <= 0 ? 'SEM_ESTOQUE'
    : produto.estoque <= produto.estoqueMinimo ? 'CRITICO'
    : produto.estoque <= produto.estoqueMinimo * 2 ? 'BAIXO' : 'NORMAL';

  const scoreVenda = Math.min(100, produto.vendasUltimos30Dias * 5);
  const scoreMargem = Math.min(100, margemPct);
  const scoreEstoque = estoqueStatus === 'NORMAL' ? 100 : estoqueStatus === 'BAIXO' ? 60 : estoqueStatus === 'CRITICO' ? 20 : 0;
  const scoreGeral = Math.round(scoreVenda * 0.4 + scoreMargem * 0.35 + scoreEstoque * 0.25);

  let perfil: string;
  let recomendacoes: string[];
  let alerta: string | null = null;

  if (produto.status === 'INATIVO') {
    perfil = 'Produto Inativo';
    recomendacoes = ['Avaliar reativação com promoção de lançamento', 'Verificar motivo da inativação', 'Analisar demanda de mercado antes de reativar'];
  } else if (scoreGeral >= 75) {
    perfil = 'Produto Estrela — Alto desempenho';
    recomendacoes = ['Garantir estoque suficiente para não perder vendas', 'Considerar aumento de preço em até 10%', 'Usar como produto destaque em campanhas'];
  } else if (scoreGeral >= 50) {
    perfil = 'Produto Promissor — Potencial de crescimento';
    recomendacoes = ['Investir em visibilidade nas campanhas de marketing', 'Testar preço promocional para aumentar volume', 'Ampliar variedade de variações'];
  } else if (scoreGeral >= 25) {
    perfil = 'Produto Regular — Desempenho abaixo do esperado';
    recomendacoes = ['Revisar precificação em relação à concorrência', 'Melhorar fotos e descrição do produto', 'Criar bundle com produtos complementares'];
  } else {
    perfil = 'Produto em Risco — Ação imediata necessária';
    recomendacoes = ['Aplicar desconto agressivo para liquidar estoque', 'Investigar motivo da baixa conversão', 'Considerar descontinuação se sem melhora em 30 dias'];
    alerta = 'Este produto não vende há mais de 30 dias com estoque disponível';
  }

  if (estoqueStatus === 'CRITICO' || estoqueStatus === 'SEM_ESTOQUE') {
    alerta = `Estoque ${estoqueStatus === 'SEM_ESTOQUE' ? 'zerado' : 'crítico'}: apenas ${produto.estoque} unidades. Reabastecer imediatamente.`;
  }

  const precoSugerido = produto.precoCusto * (1 + (margemPct >= 60 ? 1.6 : margemPct >= 40 ? 1.4 : 1.3));

  return {
    scoreGeral,
    perfil,
    recomendacoes,
    alerta,
    metricas: {
      giroEstoque: parseFloat(giroEstoque.toFixed(2)),
      margemLiquida: margemPct,
      estoqueStatus,
      diasSemVenda: produto.vendasUltimos30Dias === 0 ? '>30' : '0',
      ticketMedio: produto.vendasTotal > 0 ? parseFloat((produto.receitaTotal / produto.vendasTotal).toFixed(2)) : produto.preco,
      receitaMensal: parseFloat((produto.vendasUltimos30Dias * produto.preco).toFixed(2)),
    },
    precoSugeridoIA: parseFloat(precoSugerido.toFixed(2)),
    ncmSugerido: produto.ncm,
    geradoEm: new Date().toISOString(),
  };
}
