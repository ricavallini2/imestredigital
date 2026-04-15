/**
 * Seed do Customer Service (CRM).
 * Cria clientes de demonstração com endereços e histórico de interações.
 * Usa o TENANT_ID fixo alinhado com o auth-service seed.
 *
 * Executar com: npm run db:seed
 */

import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

/** ID fixo alinhado com o auth-service seed */
const TENANT_ID = '10000000-0000-0000-0000-000000000001';
const USER_ADMIN_ID = '20000000-0000-0000-0000-000000000001';

async function main() {
  console.log('🌱 Iniciando seed do Customer Service...');

  // ─── Clientes ──────────────────────────────────────────
  const cliente1 = await prisma.cliente.upsert({
    where: { tenantId_email: { tenantId: TENANT_ID, email: 'joao.silva@email.com' } },
    update: {},
    create: {
      tenantId: TENANT_ID,
      tipo: 'PESSOA_FISICA',
      nome: 'João Silva',
      cpf: '12345678900',
      email: 'joao.silva@email.com',
      celular: '11991234567',
      status: 'ATIVO',
      origem: 'SITE',
      score: 85,
      totalCompras: 3,
      valorTotalCompras: 113000, // R$ 1130,00
      ultimaCompra: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      tags: ['recorrente', 'tecnologia'],
    },
  });

  const cliente2 = await prisma.cliente.upsert({
    where: { tenantId_email: { tenantId: TENANT_ID, email: 'maria.santos@empresa.com.br' } },
    update: {},
    create: {
      tenantId: TENANT_ID,
      tipo: 'PESSOA_JURIDICA',
      nome: 'Maria Santos',
      nomeFantasia: 'TechShop LTDA',
      razaoSocial: 'Maria Santos Tecnologia LTDA',
      cnpj: '12345678000190',
      email: 'maria.santos@empresa.com.br',
      telefone: '1133334444',
      celular: '11987654321',
      status: 'ATIVO',
      origem: 'MARKETPLACE',
      score: 92,
      totalCompras: 8,
      valorTotalCompras: 520000, // R$ 5200,00
      ultimaCompra: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ['vip', 'b2b', 'marketplace'],
    },
  });

  const cliente3 = await prisma.cliente.upsert({
    where: { tenantId_email: { tenantId: TENANT_ID, email: 'pedro.costa@gmail.com' } },
    update: {},
    create: {
      tenantId: TENANT_ID,
      tipo: 'PESSOA_FISICA',
      nome: 'Pedro Costa',
      cpf: '98765432100',
      email: 'pedro.costa@gmail.com',
      celular: '21999887766',
      dataNascimento: new Date('1990-05-15'),
      genero: 'M',
      status: 'ATIVO',
      origem: 'INDICACAO',
      score: 70,
      totalCompras: 1,
      valorTotalCompras: 53000, // R$ 530,00
      ultimaCompra: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      tags: ['novo'],
    },
  });

  const cliente4 = await prisma.cliente.upsert({
    where: { tenantId_email: { tenantId: TENANT_ID, email: 'ana.oliveira@hotmail.com' } },
    update: {},
    create: {
      tenantId: TENANT_ID,
      tipo: 'PESSOA_FISICA',
      nome: 'Ana Oliveira',
      cpf: '11122233344',
      email: 'ana.oliveira@hotmail.com',
      celular: '31988776655',
      status: 'PROSPECT',
      origem: 'SITE',
      score: 30,
      totalCompras: 0,
      valorTotalCompras: 0,
      tags: ['prospect', 'moda'],
    },
  });

  const cliente5 = await prisma.cliente.upsert({
    where: { tenantId_email: { tenantId: TENANT_ID, email: 'carlos.ferreira@distribuidora.com' } },
    update: {},
    create: {
      tenantId: TENANT_ID,
      tipo: 'PESSOA_JURIDICA',
      nome: 'Carlos Ferreira',
      nomeFantasia: 'Distribuidora CF',
      razaoSocial: 'Carlos Ferreira Distribuidora ME',
      cnpj: '98765432000155',
      email: 'carlos.ferreira@distribuidora.com',
      telefone: '4133221100',
      status: 'INATIVO',
      origem: 'MANUAL',
      score: 45,
      totalCompras: 2,
      valorTotalCompras: 89900, // R$ 899,00
      ultimaCompra: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      tags: ['b2b', 'inativo'],
    },
  });

  console.log(`  ✅ 5 clientes criados`);

  // ─── Endereços ─────────────────────────────────────────
  await prisma.enderecoCliente.createMany({
    data: [
      {
        tenantId: TENANT_ID,
        clienteId: cliente1.id,
        tipo: 'AMBOS',
        logradouro: 'Avenida Paulista',
        numero: '1000',
        complemento: 'Apto 42',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310100',
        padrao: true,
      },
      {
        tenantId: TENANT_ID,
        clienteId: cliente2.id,
        tipo: 'ENTREGA',
        logradouro: 'Rua das Indústrias',
        numero: '500',
        bairro: 'Distrito Industrial',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '04000000',
        padrao: true,
      },
      {
        tenantId: TENANT_ID,
        clienteId: cliente3.id,
        tipo: 'AMBOS',
        logradouro: 'Avenida Rio Branco',
        numero: '500',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20040020',
        padrao: true,
      },
    ],
  });

  console.log(`  ✅ 3 endereços criados`);

  // ─── Interações ────────────────────────────────────────
  await prisma.interacaoCliente.createMany({
    data: [
      {
        tenantId: TENANT_ID,
        clienteId: cliente1.id,
        tipo: 'VENDA',
        canal: 'MARKETPLACE',
        titulo: 'Compra de Fone Bluetooth',
        descricao: 'Cliente adquiriu 2 unidades do Fone Bluetooth Premium via site.',
        usuarioId: USER_ADMIN_ID,
        data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        tenantId: TENANT_ID,
        clienteId: cliente2.id,
        tipo: 'VENDA',
        canal: 'MARKETPLACE',
        titulo: 'Pedido Mercado Livre #MLB-teste-001',
        descricao: 'Pedido via Mercado Livre confirmado.',
        usuarioId: USER_ADMIN_ID,
        data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        tenantId: TENANT_ID,
        clienteId: cliente1.id,
        tipo: 'ATENDIMENTO',
        canal: 'EMAIL',
        titulo: 'Dúvida sobre prazo de entrega',
        descricao: 'Cliente perguntou sobre o prazo de entrega do pedido #1.',
        usuarioId: USER_ADMIN_ID,
        data: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log(`  ✅ 3 interações registradas`);

  // ─── Segmentos ─────────────────────────────────────────
  const segVip = await prisma.segmentoCliente.upsert({
    where: { id: 'seg-vip-001' },
    update: {},
    create: {
      id: 'seg-vip-001',
      tenantId: TENANT_ID,
      nome: 'Clientes VIP',
      descricao: 'Clientes com mais de 5 compras ou valor acima de R$2.000',
      regras: { totalCompras_min: 5, valorTotalCompras_min: 200000 },
      totalClientes: 1,
      ativo: true,
    },
  });

  const segNovos = await prisma.segmentoCliente.upsert({
    where: { id: 'seg-novos-001' },
    update: {},
    create: {
      id: 'seg-novos-001',
      tenantId: TENANT_ID,
      nome: 'Clientes Novos (30 dias)',
      descricao: 'Clientes adquiridos nos últimos 30 dias',
      regras: { diasDesdeUltimaCompra_max: 30, totalCompras_max: 2 },
      totalClientes: 1,
      ativo: true,
    },
  });

  // Associar clientes a segmentos
  await prisma.clienteSegmento.upsert({
    where: { clienteId_segmentoId: { clienteId: cliente2.id, segmentoId: segVip.id } },
    update: {},
    create: { clienteId: cliente2.id, segmentoId: segVip.id },
  });

  await prisma.clienteSegmento.upsert({
    where: { clienteId_segmentoId: { clienteId: cliente3.id, segmentoId: segNovos.id } },
    update: {},
    create: { clienteId: cliente3.id, segmentoId: segNovos.id },
  });

  console.log(`  ✅ 2 segmentos criados`);

  console.log('');
  console.log('🎉 Seed do Customer Service concluído!');
  console.log('   5 clientes | 3 endereços | 3 interações | 2 segmentos');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
