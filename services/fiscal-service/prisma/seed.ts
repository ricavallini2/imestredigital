/**
 * Seed do Fiscal Service.
 * Cria configuração fiscal de demonstração e regras fiscais básicas.
 * Usa o TENANT_ID fixo alinhado com o auth-service seed.
 *
 * Executar com: npm run db:seed
 */

import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

const TENANT_ID = '10000000-0000-0000-0000-000000000001';

async function main() {
  console.log('🌱 Iniciando seed do Fiscal Service...');

  // ─── Configuração Fiscal ──────────────────────────────────────
  await prisma.configuracaoFiscal.upsert({
    where: { tenantId: TENANT_ID },
    update: {},
    create: {
      tenantId: TENANT_ID,
      regimeTributario: 'SIMPLES_NACIONAL',
      inscricaoEstadual: '123456789012',
      inscricaoMunicipal: '123456',
      cnae: '4751201',
      crt: '1', // 1 = Simples Nacional
      ambienteSefaz: 'HOMOLOGACAO',
      serieNfe: '1',
      proximoNumeroNfe: 1,
      serieNfce: '1',
      proximoNumeroNfce: 1,
    },
  });

  console.log('  ✅ ConfiguracaoFiscal criada');

  // ─── Regras Fiscais Básicas ───────────────────────────────────

  const regras = [
    {
      nome: 'Produtos de Informática - SP',
      descricao: 'Regra padrão para produtos de informática (NCM 8471) com destino SP',
      ncm: '8471300000',
      cfop: '5102',
      cstIcms: '00',
      aliquotaIcms: '0.1200',
      cstPis: '01',
      aliquotaPis: '0.0065',
      cstCofins: '01',
      aliquotaCofins: '0.0300',
      cstIpi: '50',
      aliquotaIpi: '0.0000',
      ufDestino: 'SP',
      regimeTributario: 'SIMPLES_NACIONAL' as const,
    },
    {
      nome: 'Eletrodomésticos - Geral',
      descricao: 'Regra padrão para eletrodomésticos (NCM 8516) — qualquer UF destino',
      ncm: '8516600000',
      cfop: '5102',
      cstIcms: '00',
      aliquotaIcms: '0.1800',
      cstPis: '01',
      aliquotaPis: '0.0065',
      cstCofins: '01',
      aliquotaCofins: '0.0300',
      cstIpi: '50',
      aliquotaIpi: '0.0000',
    },
    {
      nome: 'Vestuário - Geral',
      descricao: 'Regra padrão para vestuário (NCM 6109) — qualquer UF destino',
      ncm: '6109100000',
      cfop: '5102',
      cstIcms: '00',
      aliquotaIcms: '0.1200',
      cstPis: '01',
      aliquotaPis: '0.0065',
      cstCofins: '01',
      aliquotaCofins: '0.0300',
    },
  ];

  for (const regra of regras) {
    // Upsert por nome + tenantId
    const existing = await prisma.regraFiscal.findFirst({
      where: { tenantId: TENANT_ID, nome: regra.nome },
    });

    if (!existing) {
      await prisma.regraFiscal.create({
        data: { tenantId: TENANT_ID, ...regra },
      });
    }
  }

  console.log(`  ✅ ${regras.length} RegrasFiscais criadas`);

  console.log('✅ Seed do Fiscal Service concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
