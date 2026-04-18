/**
 * Seed do Marketplace Service.
 * Cria uma conta de marketplace de demonstração (Shopee) com anúncios e perguntas.
 * Usa o TENANT_ID fixo alinhado com o auth-service seed.
 *
 * Executar com: npm run db:seed
 */

import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

const TENANT_ID = '10000000-0000-0000-0000-000000000001';

async function main() {
  console.log('🌱 Iniciando seed do Marketplace Service...');

  // ─── Conta Shopee Demo ──────────────────────────────────────
  const conta = await prisma.contaMarketplace.upsert({
    where: {
      uk_conta_marketplace_tenant_plataforma_id: {
        tenantId: TENANT_ID,
        plataforma: 'SHOPEE',
        idExterno: 'shopee_demo_12345',
      },
    },
    update: {},
    create: {
      tenantId: TENANT_ID,
      plataforma: 'SHOPEE',
      nome: 'Loja iMestre - Shopee',
      accessToken: 'demo_access_token_shopee',
      refreshToken: 'demo_refresh_token_shopee',
      idExterno: 'shopee_demo_12345',
      tokenExpiraEm: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'ATIVA',
      ultimaSincronizacao: new Date(Date.now() - 2 * 60 * 60 * 1000),
      configuracoes: {
        shopId: 12345,
        partnerId: 99999,
        commissionRate: 0.05,
        autoSyncEnabled: true,
      },
    },
  });

  console.log('  ✅ ContaMarketplace (Shopee) criada');

  // ─── Anúncios Demo ────────────────────────────────────────────
  const anuncios = [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      tenantId: TENANT_ID,
      contaMarketplaceId: conta.id,
      produtoId: 'p0000000-0000-0000-0000-000000000001',
      idExterno: 'shopee_listing_001',
      titulo: 'Notebook Gamer - 16GB RAM, RTX 4060, SSD 512GB',
      descricao: 'Notebook gamer de alta performance com processador Intel i7, 16GB RAM DDR5, placa de vídeo RTX 4060 e SSD NVMe 512GB.',
      preco: '4599.90',
      precoPromocional: '3999.90',
      estoque: 5,
      status: 'ATIVO',
      url: 'https://shopee.com.br/notebook-gamer-demo',
      categoria: 'Computadores e Notebooks',
      fotos: ['https://example.com/notebook1.jpg', 'https://example.com/notebook2.jpg'],
      metricas: { visitas: 1245, vendas: 8, perguntas: 3 },
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      tenantId: TENANT_ID,
      contaMarketplaceId: conta.id,
      produtoId: 'p0000000-0000-0000-0000-000000000002',
      idExterno: 'shopee_listing_002',
      titulo: 'Mouse Gamer RGB 16000 DPI Sem Fio',
      descricao: 'Mouse gamer wireless com até 16000 DPI, iluminação RGB personalizável e bateria de até 70h.',
      preco: '249.90',
      estoque: 30,
      status: 'ATIVO',
      url: 'https://shopee.com.br/mouse-gamer-demo',
      categoria: 'Periféricos',
      fotos: ['https://example.com/mouse1.jpg'],
      metricas: { visitas: 892, vendas: 42, perguntas: 7 },
    },
  ];

  for (const anuncio of anuncios) {
    await prisma.anuncioMarketplace.upsert({
      where: { id: anuncio.id },
      update: {},
      create: anuncio,
    });
  }

  console.log(`  ✅ ${anuncios.length} AnunciosMarketplace criados`);

  // ─── Perguntas de Compradores ─────────────────────────────────
  const perguntas = [
    {
      id: 'q0000000-0000-0000-0000-000000000001',
      tenantId: TENANT_ID,
      contaMarketplaceId: conta.id,
      anuncioId: 'a0000000-0000-0000-0000-000000000001',
      idExterno: 'shopee_q_001',
      pergunta: 'O notebook vem com garantia de fábrica? Por quanto tempo?',
      resposta: 'Sim! O notebook possui 1 ano de garantia de fábrica e 90 dias de garantia adicional da nossa loja. 😊',
      status: 'RESPONDIDA',
      compradorNome: 'Carlos M.',
      dataEnvio: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      dataResposta: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'q0000000-0000-0000-0000-000000000002',
      tenantId: TENANT_ID,
      contaMarketplaceId: conta.id,
      anuncioId: 'a0000000-0000-0000-0000-000000000001',
      idExterno: 'shopee_q_002',
      pergunta: 'Qual o prazo de entrega para São Paulo?',
      status: 'PENDENTE',
      compradorNome: 'Ana S.',
      dataEnvio: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: 'q0000000-0000-0000-0000-000000000003',
      tenantId: TENANT_ID,
      contaMarketplaceId: conta.id,
      anuncioId: 'a0000000-0000-0000-0000-000000000002',
      idExterno: 'shopee_q_003',
      pergunta: 'O mouse funciona com receptor USB ou só Bluetooth?',
      resposta: 'Funciona com receptor USB 2.4GHz incluso na caixa! Latência de apenas 1ms.',
      status: 'RESPONDIDA',
      compradorNome: 'Pedro L.',
      dataEnvio: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      dataResposta: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const pergunta of perguntas) {
    await prisma.perguntaMarketplace.upsert({
      where: { id: pergunta.id },
      update: {},
      create: pergunta,
    });
  }

  console.log(`  ✅ ${perguntas.length} PerguntasMarketplace criadas`);

  console.log('✅ Seed do Marketplace Service concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
