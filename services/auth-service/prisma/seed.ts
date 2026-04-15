/**
 * Script de Seed do banco de dados para desenvolvimento.
 *
 * Executa com: npm run db:seed
 *
 * Cria dados iniciais:
 * - Um tenant de teste (Empresa Teste LTDA)
 * - Um usuário admin (teste@teste.com / Senha123)
 */

import { PrismaClient } from '../generated/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/** IDs fixos para que os outros serviços possam referenciar */
export const DEMO_TENANT_ID = '10000000-0000-0000-0000-000000000001';
const USER_ADMIN_ID        = '20000000-0000-0000-0000-000000000001';
const USER_GERENTE_ID      = '20000000-0000-0000-0000-000000000002';
const USER_OPERADOR_ID     = '20000000-0000-0000-0000-000000000003';
const USER_VIEWER_ID       = '20000000-0000-0000-0000-000000000004';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpa dados antigos (apenas para desenvolvimento)
    await prisma.refreshToken.deleteMany({});
    await prisma.usuario.deleteMany({});
    await prisma.tenant.deleteMany({});

    console.log('🗑️ Dados antigos removidos');

    // Cria um tenant de teste com ID fixo
    const tenant = await prisma.tenant.create({
      data: {
        id: DEMO_TENANT_ID,
        nome: 'Empresa Teste LTDA',
        cnpj: '12345678000190',
        email: 'contato@empresateste.com',
        telefone: '1133334444',
        plano: 'starter',
        status: 'ativo',
      },
    });

    console.log(`✅ Tenant criado: ${tenant.nome} (${tenant.id})`);

    // Cria um usuário admin de teste
    const senhaHash = await bcrypt.hash('Senha123', 12);

    await prisma.usuario.create({
      data: {
        id: USER_ADMIN_ID,
        tenantId: tenant.id,
        nome: 'Usuário Teste',
        email: 'teste@teste.com',
        senhaHash,
        cargo: 'admin',
        status: 'ativo',
        emailVerificado: true,
      },
    });

    console.log(`✅ Usuário admin criado: teste@teste.com`);

    // Cria mais alguns usuários de teste com diferentes cargos
    const usuarios = [
      { id: USER_GERENTE_ID,  nome: 'Gerente Teste',     email: 'gerente@teste.com',     cargo: 'gerente' },
      { id: USER_OPERADOR_ID, nome: 'Operador Teste',    email: 'operador@teste.com',    cargo: 'operador' },
      { id: USER_VIEWER_ID,   nome: 'Visualizador Teste', email: 'visualizador@teste.com', cargo: 'visualizador' },
    ];

    for (const u of usuarios) {
      await prisma.usuario.create({
        data: {
          id: u.id,
          tenantId: tenant.id,
          nome: u.nome,
          email: u.email,
          senhaHash,
          cargo: u.cargo,
          status: 'ativo',
          emailVerificado: true,
        },
      });
      console.log(`✅ Usuário ${u.cargo} criado: ${u.email}`);
    }

    console.log('\n📊 Dados de teste criados com sucesso!');
    console.log(`\n🔑 Tenant ID: ${DEMO_TENANT_ID}`);
    console.log('\n🧪 Credenciais para testar:');
    console.log('   Email: teste@teste.com (admin)');
    console.log('   Senha: Senha123');
    console.log('\n   Ou teste outros usuários com a mesma senha:');
    console.log('   - gerente@teste.com (gerente)');
    console.log('   - operador@teste.com (operador)');
    console.log('   - visualizador@teste.com (visualizador)');
  } catch (e) {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
