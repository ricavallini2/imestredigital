/**
 * Seed do Financial Service.
 * Cria contas financeiras e lançamentos de demonstração.
 * Usa o TENANT_ID fixo alinhado com o auth-service seed.
 *
 * Executar com: npm run db:seed
 */

import { PrismaClient } from '../generated/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

const TENANT_ID = '10000000-0000-0000-0000-000000000001';

const CONTA_CORRENTE = '70000000-0000-0000-0000-000000000001';
const CONTA_CAIXA    = '70000000-0000-0000-0000-000000000002';

async function main() {
  console.log('🌱 Iniciando seed do Financial Service...');

  // ─── Contas Financeiras ────────────────────────────────
  const contaCorrente = await prisma.contaFinanceira.upsert({
    where: { id: CONTA_CORRENTE },
    update: {},
    create: {
      id: CONTA_CORRENTE,
      tenantId: TENANT_ID,
      nome: 'Conta Corrente Banco do Brasil',
      tipo: 'CORRENTE',
      banco: 'Banco do Brasil',
      agencia: '1234-5',
      conta: '12345-6',
      saldoInicial: new Decimal('15000.00'),
      saldoAtual: new Decimal('22450.00'),
      ativa: true,
      cor: '#3B82F6',
      icone: 'bank',
    },
  });

  const contaCaixa = await prisma.contaFinanceira.upsert({
    where: { id: CONTA_CAIXA },
    update: {},
    create: {
      id: CONTA_CAIXA,
      tenantId: TENANT_ID,
      nome: 'Caixa Loja Física',
      tipo: 'CAIXA',
      saldoInicial: new Decimal('2000.00'),
      saldoAtual: new Decimal('3250.00'),
      ativa: true,
      cor: '#10B981',
      icone: 'cash',
    },
  });

  console.log(`  ✅ 2 contas financeiras criadas`);

  // ─── Lançamentos ───────────────────────────────────────
  const hoje = new Date();
  const diasAtras = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
  const diasAFrente = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

  const lancamentos = [
    // RECEITAS (pagas)
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'RECEITA',
      categoria: 'Vendas',
      subcategoria: 'E-commerce',
      descricao: 'Vendas online - semana 1',
      valor: new Decimal('3200.00'),
      dataVencimento: diasAtras(20),
      dataPagamento: diasAtras(20),
      status: 'PAGO',
      formaPagamento: 'PIX',
    },
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'RECEITA',
      categoria: 'Vendas',
      subcategoria: 'Marketplace',
      descricao: 'Repasse Mercado Livre - quinzena',
      valor: new Decimal('4750.00'),
      dataVencimento: diasAtras(15),
      dataPagamento: diasAtras(14),
      status: 'PAGO',
      formaPagamento: 'TED',
    },
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'RECEITA',
      categoria: 'Vendas',
      subcategoria: 'E-commerce',
      descricao: 'Vendas online - semana 2',
      valor: new Decimal('2890.00'),
      dataVencimento: diasAtras(13),
      dataPagamento: diasAtras(13),
      status: 'PAGO',
      formaPagamento: 'PIX',
    },
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CAIXA,
      tipo: 'RECEITA',
      categoria: 'Vendas',
      subcategoria: 'Loja Física',
      descricao: 'Vendas loja física - semana',
      valor: new Decimal('1850.00'),
      dataVencimento: diasAtras(7),
      dataPagamento: diasAtras(7),
      status: 'PAGO',
      formaPagamento: 'DINHEIRO',
    },
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'RECEITA',
      categoria: 'Vendas',
      subcategoria: 'E-commerce',
      descricao: 'Vendas online - esta semana',
      valor: new Decimal('3100.00'),
      dataVencimento: diasAtras(2),
      dataPagamento: diasAtras(2),
      status: 'PAGO',
      formaPagamento: 'PIX',
    },
    // DESPESAS (pagas)
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'DESPESA',
      categoria: 'Operacional',
      subcategoria: 'Logística',
      descricao: 'Frete e envios - quinzena',
      valor: new Decimal('890.00'),
      dataVencimento: diasAtras(15),
      dataPagamento: diasAtras(15),
      status: 'PAGO',
      formaPagamento: 'BOLETO',
    },
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'DESPESA',
      categoria: 'Fornecedores',
      subcategoria: 'Produtos',
      descricao: 'Compra de estoque - TechBR',
      valor: new Decimal('5200.00'),
      dataVencimento: diasAtras(10),
      dataPagamento: diasAtras(9),
      status: 'PAGO',
      formaPagamento: 'TED',
    },
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'DESPESA',
      categoria: 'Operacional',
      subcategoria: 'Marketing',
      descricao: 'Anúncios Google Ads - mês',
      valor: new Decimal('750.00'),
      dataVencimento: diasAtras(5),
      dataPagamento: diasAtras(5),
      status: 'PAGO',
      formaPagamento: 'CARTAO_CREDITO',
    },
    // RECEITAS PENDENTES (a vencer)
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'RECEITA',
      categoria: 'Vendas',
      subcategoria: 'Marketplace',
      descricao: 'Repasse Shopee - quinzena',
      valor: new Decimal('2340.00'),
      dataVencimento: diasAFrente(3),
      status: 'PENDENTE',
    },
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'RECEITA',
      categoria: 'Vendas',
      subcategoria: 'E-commerce',
      descricao: 'Vendas parceladas - recebimento',
      valor: new Decimal('1200.00'),
      dataVencimento: diasAFrente(7),
      status: 'PENDENTE',
    },
    // DESPESAS PENDENTES (a vencer)
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'DESPESA',
      categoria: 'Pessoal',
      subcategoria: 'Salários',
      descricao: 'Folha de pagamento - mês atual',
      valor: new Decimal('4500.00'),
      dataVencimento: diasAFrente(5),
      status: 'PENDENTE',
    },
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'DESPESA',
      categoria: 'Fornecedores',
      subcategoria: 'Produtos',
      descricao: 'Compra de estoque - ModaFit',
      valor: new Decimal('3800.00'),
      dataVencimento: diasAFrente(10),
      status: 'PENDENTE',
    },
    // DESPESA ATRASADA
    {
      tenantId: TENANT_ID,
      contaId: CONTA_CORRENTE,
      tipo: 'DESPESA',
      categoria: 'Operacional',
      subcategoria: 'Infraestrutura',
      descricao: 'Aluguel galpão - mês anterior',
      valor: new Decimal('1800.00'),
      dataVencimento: diasAtras(3),
      status: 'ATRASADO',
    },
  ];

  for (const lancamento of lancamentos) {
    await prisma.lancamento.create({ data: lancamento });
  }

  console.log(`  ✅ ${lancamentos.length} lançamentos criados`);

  const totalReceitas = lancamentos
    .filter(l => l.tipo === 'RECEITA' && l.status === 'PAGO')
    .reduce((sum, l) => sum + Number(l.valor), 0);

  const totalDespesas = lancamentos
    .filter(l => l.tipo === 'DESPESA' && l.status === 'PAGO')
    .reduce((sum, l) => sum + Number(l.valor), 0);

  console.log('');
  console.log('🎉 Seed do Financial Service concluído!');
  console.log(`   2 contas | ${lancamentos.length} lançamentos`);
  console.log(`   Receitas pagas: R$ ${totalReceitas.toFixed(2)}`);
  console.log(`   Despesas pagas: R$ ${totalDespesas.toFixed(2)}`);
  console.log(`   Resultado: R$ ${(totalReceitas - totalDespesas).toFixed(2)}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
