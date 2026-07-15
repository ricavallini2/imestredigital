/**
 * Seed de dados do Catalog Service.
 * Cria categorias, marcas e produtos de demonstração.
 * Usa o DEMO_TENANT_ID criado pelo auth-service seed.
 *
 * Uso: npx prisma db seed
 */

import { PrismaClient, Prisma } from '../generated/client';
import { garantirTextoIntegro } from '../src/common/texto-integro.util';

const prisma = new PrismaClient();

/** IDs fixos alinhados com o auth-service seed */
const TENANT_ID = '10000000-0000-0000-0000-000000000001';

const CAT_ELETRONICOS = '30000000-0000-0000-0000-000000000001';
const CAT_VESTUARIO   = '30000000-0000-0000-0000-000000000002';
const CAT_CASA        = '30000000-0000-0000-0000-000000000003';
const CAT_ESPORTES    = '30000000-0000-0000-0000-000000000004';

const MARCA_TECHBR   = '40000000-0000-0000-0000-000000000001';
const MARCA_MODAFIT  = '40000000-0000-0000-0000-000000000002';
const MARCA_CASABELA = '40000000-0000-0000-0000-000000000003';

const PROD_001 = '50000000-0000-0000-0000-000000000001';
const PROD_002 = '50000000-0000-0000-0000-000000000002';
const PROD_003 = '50000000-0000-0000-0000-000000000003';
const PROD_004 = '50000000-0000-0000-0000-000000000004';
const PROD_005 = '50000000-0000-0000-0000-000000000005';
const PROD_006 = '50000000-0000-0000-0000-000000000006';
const PROD_007 = '50000000-0000-0000-0000-000000000007';
const PROD_008 = '50000000-0000-0000-0000-000000000008';
const PROD_009 = '50000000-0000-0000-0000-000000000009';
const PROD_010 = '50000000-0000-0000-0000-000000000010';

const GRADE_TENIS_ADULTO = '60000000-0000-0000-0000-000000000001';
const GRADE_SANDALIA     = '60000000-0000-0000-0000-000000000002';
const GRADE_CHINELO      = '60000000-0000-0000-0000-000000000003';
const GRADE_CAMISETA     = '60000000-0000-0000-0000-000000000004';
const GRADE_CALCA        = '60000000-0000-0000-0000-000000000005';

/** Gera uma faixa numérica inclusiva como strings: intervalo(33, 44) => ['33'..'44']. */
function intervalo(inicio: number, fim: number, passo = 1): string[] {
  const valores: string[] = [];
  for (let n = inicio; n <= fim; n += passo) valores.push(String(n));
  return valores;
}

/**
 * Gera tamanhos em PARES (padrão de chinelo/calça): paresBR(33, 44) =>
 * ['33/34', '35/36', ..., '43/44']. O passo interno é 2 (par de números).
 */
function paresBR(inicio: number, fim: number): string[] {
  const valores: string[] = [];
  for (let n = inicio; n + 1 <= fim; n += 2) valores.push(`${n}/${n + 1}`);
  return valores;
}

async function main() {
  console.log('🌱 Iniciando seed do Catalog Service...');

  // ─── Categorias ────────────────────────────────────────
  // Nomes acentuados (Eletrônicos, Vestuário, Decoração): o `update` reconcilia
  // o nome a partir da fonte, curando corrupção em repouso em re-seeds.
  const categoriasSeed = [
    { id: CAT_ELETRONICOS, nome: 'Eletrônicos', slug: 'eletronicos' },
    { id: CAT_VESTUARIO, nome: 'Vestuário', slug: 'vestuario' },
    { id: CAT_CASA, nome: 'Casa e Decoração', slug: 'casa-decoracao' },
    { id: CAT_ESPORTES, nome: 'Esportes e Lazer', slug: 'esportes-lazer' },
  ];
  garantirTextoIntegro(categoriasSeed, 'categorias');
  const categorias = await Promise.all(
    categoriasSeed.map((c) =>
      prisma.categoria.upsert({
        where: { id: c.id },
        update: { nome: c.nome },
        create: { id: c.id, tenantId: TENANT_ID, nome: c.nome, slug: c.slug, ativa: true },
      }),
    ),
  );

  console.log(`  ✅ ${categorias.length} categorias criadas`);

  // ─── Marcas ────────────────────────────────────────────
  const marcas = await Promise.all([
    prisma.marca.upsert({
      where: { id: MARCA_TECHBR },
      update: {},
      create: { id: MARCA_TECHBR, tenantId: TENANT_ID, nome: 'TechBR', slug: 'techbr', ativa: true },
    }),
    prisma.marca.upsert({
      where: { id: MARCA_MODAFIT },
      update: {},
      create: { id: MARCA_MODAFIT, tenantId: TENANT_ID, nome: 'ModaFit', slug: 'modafit', ativa: true },
    }),
    prisma.marca.upsert({
      where: { id: MARCA_CASABELA },
      update: {},
      create: { id: MARCA_CASABELA, tenantId: TENANT_ID, nome: 'CasaBela', slug: 'casabela', ativa: true },
    }),
  ]);

  console.log(`  ✅ ${marcas.length} marcas criadas`);

  // ─── Produtos de Demonstração ──────────────────────────
  const produtos: Prisma.ProdutoUncheckedCreateInput[] = [
    {
      id: PROD_001,
      tenantId: TENANT_ID,
      sku: 'TECH-FONE-001',
      nome: 'Fone de Ouvido Bluetooth Premium',
      descricao: 'Fone de ouvido sem fio com cancelamento de ruído ativo, bateria de 30h e driver de 40mm. Ideal para trabalho e lazer.',
      descricaoCurta: 'Fone bluetooth com ANC e 30h de bateria',
      status: 'ATIVO',
      ncm: '85183000',
      origem: 0,
      precoCusto: '85.00',
      precoVenda: '199.00',
      precoPromocional: '159.00',
      peso: 250,
      altura: 8,
      largura: 18,
      comprimento: 20,
      tags: ['fone', 'bluetooth', 'wireless', 'anc'],
      metaTitulo: 'Fone Bluetooth Premium com ANC - TechBR',
      metaDescricao: 'Fone de ouvido bluetooth com cancelamento de ruído. 30h bateria. Compre online.',
      categoriaId: CAT_ELETRONICOS,
      marcaId: MARCA_TECHBR,
    },
    {
      id: PROD_002,
      tenantId: TENANT_ID,
      sku: 'TECH-CARREGADOR-001',
      nome: 'Carregador Portátil 20000mAh USB-C',
      descricao: 'Power bank de 20000mAh com carregamento rápido PD 65W. 2 portas USB-C e 1 USB-A. Carrega notebook.',
      descricaoCurta: 'Powerbank 20000mAh com carga rápida PD 65W',
      status: 'ATIVO',
      ncm: '85076000',
      origem: 0,
      precoCusto: '120.00',
      precoVenda: '249.00',
      peso: 450,
      altura: 3,
      largura: 7,
      comprimento: 15,
      tags: ['powerbank', 'carregador', 'usb-c', 'pd'],
      categoriaId: CAT_ELETRONICOS,
      marcaId: MARCA_TECHBR,
    },
    {
      id: PROD_003,
      tenantId: TENANT_ID,
      sku: 'TECH-MOUSE-001',
      nome: 'Mouse Ergonômico Sem Fio 2.4GHz',
      descricao: 'Mouse vertical ergonômico com sensor de 4000 DPI, 6 botões programáveis. Reduz fadiga no pulso.',
      descricaoCurta: 'Mouse ergonômico vertical sem fio',
      status: 'ATIVO',
      ncm: '84716060',
      origem: 0,
      precoCusto: '45.00',
      precoVenda: '89.90',
      peso: 120,
      altura: 8,
      largura: 6,
      comprimento: 12,
      tags: ['mouse', 'ergonomico', 'wireless'],
      categoriaId: CAT_ELETRONICOS,
      marcaId: MARCA_TECHBR,
    },
    {
      id: PROD_004,
      tenantId: TENANT_ID,
      sku: 'MODA-CAMISETA-001',
      nome: 'Camiseta Dry-Fit Performance',
      descricao: 'Camiseta esportiva em tecido dry-fit com proteção UV50+. Secagem rápida e toque macio.',
      descricaoCurta: 'Camiseta dry-fit UV50+ secagem rápida',
      status: 'ATIVO',
      ncm: '61091000',
      origem: 0,
      precoCusto: '22.00',
      precoVenda: '59.90',
      precoPromocional: '44.90',
      peso: 180,
      altura: 2,
      largura: 30,
      comprimento: 40,
      tags: ['camiseta', 'dryfit', 'esporte', 'uv50'],
      categoriaId: CAT_VESTUARIO,
      marcaId: MARCA_MODAFIT,
    },
    {
      id: PROD_005,
      tenantId: TENANT_ID,
      sku: 'MODA-TENIS-001',
      nome: 'Tênis de Corrida Ultra Leve',
      descricao: 'Tênis para corrida com amortecimento em espuma EVA, cabedal em malha respirável. Peso: apenas 230g.',
      descricaoCurta: 'Tênis corrida ultralight com EVA',
      status: 'ATIVO',
      ncm: '64041900',
      origem: 0,
      precoCusto: '89.00',
      precoVenda: '199.90',
      peso: 460,
      altura: 12,
      largura: 12,
      comprimento: 32,
      tags: ['tenis', 'corrida', 'running', 'leve'],
      categoriaId: CAT_ESPORTES,
      marcaId: MARCA_MODAFIT,
    },
    {
      id: PROD_006,
      tenantId: TENANT_ID,
      sku: 'CASA-LUMINARIA-001',
      nome: 'Luminária de Mesa LED com Dimmer',
      descricao: 'Luminária de mesa com LED ajustável, 3 temperaturas de cor, braço articulável e base com carregamento wireless.',
      descricaoCurta: 'Luminária LED com dimmer e carregador wireless',
      status: 'ATIVO',
      ncm: '94054090',
      origem: 0,
      precoCusto: '65.00',
      precoVenda: '149.90',
      precoPromocional: '129.90',
      peso: 850,
      altura: 45,
      largura: 15,
      comprimento: 15,
      tags: ['luminaria', 'led', 'escritorio', 'dimmer'],
      categoriaId: CAT_CASA,
      marcaId: MARCA_CASABELA,
    },
    {
      id: PROD_007,
      tenantId: TENANT_ID,
      sku: 'CASA-ORGANIZADOR-001',
      nome: 'Kit Organizador de Gavetas 6 Peças',
      descricao: 'Kit com 6 caixas organizadoras em bambu natural. Tamanhos variados para gavetas de cômoda e armário.',
      descricaoCurta: 'Kit 6 organizadores de bambu natural',
      status: 'ATIVO',
      ncm: '44219900',
      origem: 0,
      precoCusto: '35.00',
      precoVenda: '79.90',
      peso: 1200,
      altura: 10,
      largura: 35,
      comprimento: 40,
      tags: ['organizador', 'bambu', 'gaveta', 'decoracao'],
      categoriaId: CAT_CASA,
      marcaId: MARCA_CASABELA,
    },
    {
      id: PROD_008,
      tenantId: TENANT_ID,
      sku: 'TECH-WEBCAM-001',
      nome: 'Webcam Full HD 1080p com Microfone',
      descricao: 'Webcam USB com resolução 1080p a 30fps, microfone estéreo integrado, correção automática de luz. Plug & play.',
      descricaoCurta: 'Webcam 1080p com mic estéreo',
      status: 'ATIVO',
      ncm: '85258019',
      origem: 0,
      precoCusto: '70.00',
      precoVenda: '159.00',
      peso: 150,
      altura: 5,
      largura: 8,
      comprimento: 8,
      tags: ['webcam', 'camera', '1080p', 'home-office'],
      categoriaId: CAT_ELETRONICOS,
      marcaId: MARCA_TECHBR,
    },
    {
      id: PROD_009,
      tenantId: TENANT_ID,
      sku: 'ESPORTE-GARRAFA-001',
      nome: 'Garrafa Térmica Esportiva 1L Inox',
      descricao: 'Garrafa térmica em aço inox 304, mantém gelado por 24h e quente por 12h. Tampa com bico retrátil.',
      descricaoCurta: 'Garrafa inox 1L térmica 24h gelado',
      status: 'ATIVO',
      ncm: '96170010',
      origem: 0,
      precoCusto: '38.00',
      precoVenda: '89.90',
      precoPromocional: '69.90',
      peso: 380,
      altura: 28,
      largura: 8,
      comprimento: 8,
      tags: ['garrafa', 'termica', 'inox', 'esporte'],
      categoriaId: CAT_ESPORTES,
      marcaId: MARCA_MODAFIT,
    },
    {
      id: PROD_010,
      tenantId: TENANT_ID,
      sku: 'TECH-TECLADO-001',
      nome: 'Teclado Mecânico Compacto 65%',
      descricao: 'Teclado mecânico 65% com switches hot-swap, iluminação RGB por tecla, keycaps PBT double-shot. Conexão USB-C.',
      descricaoCurta: 'Teclado mecânico 65% RGB hot-swap',
      status: 'ATIVO',
      ncm: '84716040',
      origem: 0,
      precoCusto: '150.00',
      precoVenda: '349.00',
      peso: 650,
      altura: 4,
      largura: 12,
      comprimento: 31,
      tags: ['teclado', 'mecanico', 'rgb', '65%', 'hotswap'],
      categoriaId: CAT_ELETRONICOS,
      marcaId: MARCA_TECHBR,
    },
  ];

  // Guarda de integridade: aborta se algum texto (nome/descrição/tags/…) tiver
  // sido corrompido para U+FFFD antes de chegar aqui. Impede persistir mojibake.
  garantirTextoIntegro(produtos, 'produtos');

  for (const produto of produtos) {
    // Self-healing idempotente: no re-seed, RECONCILIA os campos de texto
    // canônicos a partir da fonte de verdade (este arquivo, em UTF-8).
    //
    // Antes o `update` era `{}` (no-op), o que tornava a corrupção em repouso
    // PERMANENTE: uma linha cujo `nome` tivesse sido gravado como `efbfbd` por
    // um seed/execução anterior mal-transcodificado jamais era corrigida por
    // re-seeds. Reconciliando os campos textuais aqui, `npm run db:seed` volta a
    // ser a ferramenta de reparo — sem tocar em campos operacionais (preço,
    // status, estoque) que podem ter sido ajustados manualmente.
    await prisma.produto.upsert({
      where: { id: produto.id },
      update: {
        nome: produto.nome,
        descricao: produto.descricao,
        descricaoCurta: produto.descricaoCurta,
        tags: produto.tags,
        metaTitulo: produto.metaTitulo,
        metaDescricao: produto.metaDescricao,
      },
      create: produto,
    });
  }

  console.log(`  ✅ ${produtos.length} produtos criados/reconciliados`);

  // ─── Grades de Tamanhos (padrão varejo BR) ─────────────
  // Idempotente: upsert por id fixo; os tamanhos são criados junto na primeira
  // execução (update vazio preserva ajustes manuais em re-seeds).
  const grades: { id: string; nome: string; descricao: string; tamanhos: string[] }[] = [
    {
      id: GRADE_TENIS_ADULTO,
      nome: 'Tênis Adulto',
      descricao: 'Numeração de calçado adulto (33 a 44)',
      tamanhos: intervalo(33, 44), // 33,34,...,44
    },
    {
      id: GRADE_SANDALIA,
      nome: 'Sandália',
      descricao: 'Numeração de sandália (33 a 40)',
      tamanhos: intervalo(33, 40), // 33,34,...,40
    },
    {
      id: GRADE_CHINELO,
      nome: 'Chinelo',
      descricao: 'Numeração de chinelo em pares (33/34 a 43/44)',
      tamanhos: paresBR(33, 44), // 33/34, 35/36, ..., 43/44
    },
    {
      id: GRADE_CAMISETA,
      nome: 'Camiseta',
      descricao: 'Tamanhos de vestuário (PP a XXG)',
      tamanhos: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'],
    },
    {
      id: GRADE_CALCA,
      nome: 'Calça',
      descricao: 'Numeração de calça em tamanhos pares (36 a 48)',
      tamanhos: intervalo(36, 48, 2), // 36,38,40,42,44,46,48
    },
  ];

  // Nomes/descrições acentuados (Tênis, Sandália, Calça): guarda + reconciliação.
  garantirTextoIntegro(grades, 'grades');
  for (const grade of grades) {
    await prisma.grade.upsert({
      where: { id: grade.id },
      // Reconcilia nome/descrição (texto acentuado) sem recriar os tamanhos,
      // preservando ordenação/ajustes manuais das linhas filhas.
      update: { nome: grade.nome, descricao: grade.descricao },
      create: {
        id: grade.id,
        tenantId: TENANT_ID,
        nome: grade.nome,
        descricao: grade.descricao,
        ativa: true,
        tamanhos: {
          create: grade.tamanhos.map((valor, ordem) => ({ valor, ordem })),
        },
      },
    });
  }

  console.log(`  ✅ ${grades.length} grades de tamanhos criadas`);

  console.log('');
  console.log('🎉 Seed do Catalog Service concluído!');
  console.log(
    `   ${categorias.length} categorias | ${marcas.length} marcas | ` +
      `${produtos.length} produtos | ${grades.length} grades`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
