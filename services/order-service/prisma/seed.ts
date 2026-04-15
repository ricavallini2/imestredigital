/**
 * ═══════════════════════════════════════════════════════════════
 * Seed do Banco de Dados - Order Service
 * ═══════════════════════════════════════════════════════════════
 *
 * Popula dados de teste no banco.
 * Usa IDs fixos alinhados com catalog-service e auth-service seeds.
 *
 * Executar com: npm run db:seed
 */

import { PrismaClient } from '../generated/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

const TENANT_ID = '10000000-0000-0000-0000-000000000001';

// Produto IDs (alinhados com catalog-service seed)
const PROD_001 = '50000000-0000-0000-0000-000000000001';
const PROD_002 = '50000000-0000-0000-0000-000000000002';
const PROD_003 = '50000000-0000-0000-0000-000000000003';
const PROD_004 = '50000000-0000-0000-0000-000000000004';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (cuidado em produção!)
  await prisma.itemDevolucao.deleteMany();
  await prisma.devolucao.deleteMany();
  await prisma.pagamento.deleteMany();
  await prisma.historicoPedido.deleteMany();
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();

  console.log('📦 Criando pedidos de teste...');

  // Pedido 1: Completo com itens
  const pedido1 = await prisma.pedido.create({
    data: {
      tenantId: TENANT_ID,
      numero: 1,
      origem: 'ECOMMERCE',
      canalOrigem: 'SITE',
      clienteNome: 'João Silva',
      clienteEmail: 'joao@example.com',
      clienteCpfCnpj: '12345678900',
      status: 'CONFIRMADO',
      statusPagamento: 'PAGO',
      metodoPagamento: 'CARTAO_CREDITO',
      parcelas: 1,
      valorProdutos: new Decimal('250.00'),
      valorDesconto: new Decimal('0.00'),
      valorFrete: new Decimal('50.00'),
      valorTotal: new Decimal('300.00'),
      dataAprovacao: new Date(),
      enderecoEntrega: {
        cep: '01310100',
        rua: 'Avenida Paulista',
        numero: '1000',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        uf: 'SP',
      },
      observacao: 'Pedido de teste',
    },
  });

  await prisma.itemPedido.createMany({
    data: [
      {
        pedidoId: pedido1.id,
        produtoId: PROD_001,
        sku: 'TECH-FONE-001',
        titulo: 'Fone de Ouvido Bluetooth Premium',
        quantidade: 2,
        valorUnitario: new Decimal('100.00'),
        valorDesconto: new Decimal('0.00'),
        valorTotal: new Decimal('200.00'),
        peso: new Decimal('0.5'),
        largura: new Decimal('18'),
        altura: new Decimal('8'),
        comprimento: new Decimal('20'),
      },
      {
        pedidoId: pedido1.id,
        produtoId: PROD_002,
        sku: 'TECH-CARREGADOR-001',
        titulo: 'Carregador Portátil 20000mAh USB-C',
        quantidade: 1,
        valorUnitario: new Decimal('50.00'),
        valorDesconto: new Decimal('0.00'),
        valorTotal: new Decimal('50.00'),
        peso: new Decimal('0.45'),
        largura: new Decimal('7'),
        altura: new Decimal('3'),
        comprimento: new Decimal('15'),
      },
    ],
  });

  await prisma.historicoPedido.createMany({
    data: [
      {
        pedidoId: pedido1.id,
        tenantId: TENANT_ID,
        statusAnterior: undefined,
        statusNovo: 'RASCUNHO',
        descricao: 'Pedido criado',
      },
      {
        pedidoId: pedido1.id,
        tenantId: TENANT_ID,
        statusAnterior: 'RASCUNHO',
        statusNovo: 'PENDENTE',
        descricao: 'Pedido pendente de confirmação',
      },
      {
        pedidoId: pedido1.id,
        tenantId: TENANT_ID,
        statusAnterior: 'PENDENTE',
        statusNovo: 'CONFIRMADO',
        descricao: 'Pedido confirmado pelo cliente',
      },
    ],
  });

  await prisma.pagamento.create({
    data: {
      pedidoId: pedido1.id,
      tenantId: TENANT_ID,
      tipo: 'CARTAO_CREDITO',
      status: 'PAGO',
      valor: new Decimal('300.00'),
      parcelas: 1,
      gateway: 'stripe',
      transacaoExternaId: 'txn-teste-001',
      dataPagamento: new Date(),
    },
  });

  // Pedido 2: Pendente
  const pedido2 = await prisma.pedido.create({
    data: {
      tenantId: TENANT_ID,
      numero: 2,
      origem: 'MARKETPLACE',
      canalOrigem: 'MERCADOLIVRE',
      pedidoExternoId: 'MLB-teste-001',
      clienteNome: 'Maria Santos',
      clienteEmail: 'maria@example.com',
      clienteCpfCnpj: '98765432100',
      status: 'PENDENTE',
      statusPagamento: 'AUTORIZADO',
      metodoPagamento: 'PIX',
      parcelas: 1,
      valorProdutos: new Decimal('150.00'),
      valorDesconto: new Decimal('10.00'),
      valorFrete: new Decimal('0.00'),
      valorTotal: new Decimal('140.00'),
      enderecoEntrega: {
        cep: '20040020',
        rua: 'Avenida Rio Branco',
        numero: '500',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        uf: 'RJ',
      },
    },
  });

  await prisma.itemPedido.create({
    data: {
      pedidoId: pedido2.id,
      produtoId: PROD_003,
      sku: 'TECH-MOUSE-001',
      titulo: 'Mouse Ergonômico Sem Fio 2.4GHz',
      quantidade: 1,
      valorUnitario: new Decimal('150.00'),
      valorDesconto: new Decimal('10.00'),
      valorTotal: new Decimal('140.00'),
      peso: new Decimal('0.12'),
    },
  });

  // Pedido 3: Enviado
  const pedido3 = await prisma.pedido.create({
    data: {
      tenantId: TENANT_ID,
      numero: 3,
      origem: 'LOJA_FISICA',
      clienteNome: 'Pedro Costa',
      clienteEmail: 'pedro@example.com',
      status: 'ENVIADO',
      statusPagamento: 'PAGO',
      valorProdutos: new Decimal('500.00'),
      valorDesconto: new Decimal('0.00'),
      valorFrete: new Decimal('30.00'),
      valorTotal: new Decimal('530.00'),
      codigoRastreio: 'BR123456789BR',
      transportadora: 'Sedex',
      prazoEntrega: 2,
      dataEnvio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      dataAprovacao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      dataFaturamento: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      dataSeparacao: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.itemPedido.create({
    data: {
      pedidoId: pedido3.id,
      produtoId: PROD_004,
      sku: 'MODA-CAMISETA-001',
      titulo: 'Camiseta Dry-Fit Performance',
      quantidade: 1,
      valorUnitario: new Decimal('500.00'),
      valorDesconto: new Decimal('0.00'),
      valorTotal: new Decimal('500.00'),
    },
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log(`📊 Criados 3 pedidos de teste para tenant: ${TENANT_ID}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
