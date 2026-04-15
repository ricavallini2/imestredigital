/**
 * Seed de dados do Inventory Service.
 * Cria depósitos e saldos de estoque para os produtos de demo.
 * Usa IDs fixos alinhados com catalog-service e auth-service seeds.
 *
 * Uso: npx prisma db seed
 */

import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

const TENANT_ID     = '10000000-0000-0000-0000-000000000001';
const USER_ADMIN_ID = '20000000-0000-0000-0000-000000000001';
const USER_GERENTE  = '20000000-0000-0000-0000-000000000002';
const USER_OPERADOR = '20000000-0000-0000-0000-000000000003';

const DEP_PRINCIPAL = '60000000-0000-0000-0000-000000000001';
const DEP_LOJA      = '60000000-0000-0000-0000-000000000002';

// Produto IDs (alinhados com catalog-service seed)
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

async function main() {
  console.log('🌱 Iniciando seed do Inventory Service...');

  // ─── Depósitos ─────────────────────────────────────────
  const depositos = await Promise.all([
    prisma.deposito.upsert({
      where: { id: DEP_PRINCIPAL },
      update: {},
      create: {
        id: DEP_PRINCIPAL,
        tenantId: TENANT_ID,
        nome: 'Depósito Principal',
        endereco: 'Rua da Logística, 500 - Galpão A',
        cidade: 'São Paulo',
        estado: 'SP',
        padrao: true,
        ativo: true,
      },
    }),
    prisma.deposito.upsert({
      where: { id: DEP_LOJA },
      update: {},
      create: {
        id: DEP_LOJA,
        tenantId: TENANT_ID,
        nome: 'Loja Física Centro',
        endereco: 'Av. Paulista, 1000 - Loja 5',
        cidade: 'São Paulo',
        estado: 'SP',
        padrao: false,
        ativo: true,
      },
    }),
  ]);

  console.log(`  ✅ ${depositos.length} depósitos criados`);

  // ─── Saldos de Estoque ─────────────────────────────────
  const estoques = [
    { produtoId: PROD_001, depositoId: DEP_PRINCIPAL, fisico: 150, reservado: 5 },
    { produtoId: PROD_001, depositoId: DEP_LOJA,      fisico: 20,  reservado: 0 },
    { produtoId: PROD_002, depositoId: DEP_PRINCIPAL, fisico: 300, reservado: 12 },
    { produtoId: PROD_003, depositoId: DEP_PRINCIPAL, fisico: 200, reservado: 3 },
    { produtoId: PROD_003, depositoId: DEP_LOJA,      fisico: 15,  reservado: 0 },
    { produtoId: PROD_004, depositoId: DEP_PRINCIPAL, fisico: 500, reservado: 20 },
    { produtoId: PROD_005, depositoId: DEP_PRINCIPAL, fisico: 80,  reservado: 8 },
    { produtoId: PROD_006, depositoId: DEP_PRINCIPAL, fisico: 45,  reservado: 2 },
    { produtoId: PROD_007, depositoId: DEP_PRINCIPAL, fisico: 120, reservado: 0 },
    { produtoId: PROD_008, depositoId: DEP_PRINCIPAL, fisico: 90,  reservado: 5 },
    { produtoId: PROD_009, depositoId: DEP_PRINCIPAL, fisico: 250, reservado: 15 },
    { produtoId: PROD_009, depositoId: DEP_LOJA,      fisico: 30,  reservado: 0 },
    { produtoId: PROD_010, depositoId: DEP_PRINCIPAL, fisico: 3,   reservado: 1 }, // Estoque baixo!
  ];

  for (const estoque of estoques) {
    await prisma.saldoEstoque.upsert({
      where: {
        tenantId_produtoId_depositoId: {
          tenantId: TENANT_ID,
          produtoId: estoque.produtoId,
          depositoId: estoque.depositoId,
        },
      },
      update: {},
      create: {
        tenantId: TENANT_ID,
        produtoId: estoque.produtoId,
        depositoId: estoque.depositoId,
        quantidadeFisica: estoque.fisico,
        reservado: estoque.reservado,
        estoqueMinimo: 10,
      },
    });
  }

  console.log(`  ✅ ${estoques.length} saldos de estoque criados`);

  // ─── Algumas movimentações de exemplo ──────────────────
  const movimentacoes = [
    {
      tenantId: TENANT_ID,
      produtoId: PROD_001,
      depositoId: DEP_PRINCIPAL,
      tipo: 'ENTRADA',
      quantidade: 200,
      motivo: 'Compra fornecedor - NF 12345',
    },
    {
      tenantId: TENANT_ID,
      produtoId: PROD_001,
      depositoId: DEP_PRINCIPAL,
      tipo: 'SAIDA',
      quantidade: 50,
      motivo: 'Vendas do mês - Pedidos #101 a #145',
    },
    {
      tenantId: TENANT_ID,
      produtoId: PROD_001,
      depositoId: DEP_PRINCIPAL,
      tipo: 'TRANSFERENCIA',
      quantidade: 20,
      motivo: 'Transferência para loja física',
    },
    {
      tenantId: TENANT_ID,
      produtoId: PROD_010,
      depositoId: DEP_PRINCIPAL,
      tipo: 'AJUSTE',
      quantidade: -7,
      motivo: 'Ajuste de inventário - itens danificados',
    },
  ];

  for (const mov of movimentacoes) {
    await prisma.movimentacao.create({ data: mov });
  }

  console.log(`  ✅ ${movimentacoes.length} movimentações registradas`);

  console.log('');
  console.log('🎉 Seed do Inventory Service concluído!');
  console.log(`   ${depositos.length} depósitos | ${estoques.length} saldos | ${movimentacoes.length} movimentações`);
  console.log('   ⚠️  Produto PROD_010 (Teclado Mecânico) com estoque baixo para testar alertas');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
