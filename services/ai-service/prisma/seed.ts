/**
 * Seed do AI Service.
 * Cria insights, sugestões e uma conversa de demonstração.
 * Usa o TENANT_ID fixo alinhado com o auth-service seed.
 *
 * Executar com: npm run db:seed
 */

import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

const TENANT_ID = '10000000-0000-0000-0000-000000000001';
const USER_ADMIN_ID = '20000000-0000-0000-0000-000000000001';

async function main() {
  console.log('🌱 Iniciando seed do AI Service...');

  // ─── Insights ─────────────────────────────────────────────────
  const insights = [
    {
      id: 'i0000000-0000-0000-0000-000000000001',
      tenantId: TENANT_ID,
      tipo: 'ALERTA' as const,
      titulo: 'Estoque crítico: Notebook Gamer',
      descricao: 'O produto "Notebook Gamer 16GB" atingiu o estoque mínimo. Com a média de 8 vendas/mês, o estoque atual de 5 unidades durará apenas ~18 dias. Recomenda-se reabastecer imediatamente.',
      status: 'ATIVO' as const,
      dados: {
        produtoId: 'p0000000-0000-0000-0000-000000000001',
        produtoNome: 'Notebook Gamer 16GB',
        estoqueAtual: 5,
        estoqueMinimo: 10,
        mediaMensal: 8,
        diasRestantes: 18,
      },
      acaoSugerida: 'Criar pedido de compra de ao menos 20 unidades com fornecedor preferencial.',
    },
    {
      id: 'i0000000-0000-0000-0000-000000000002',
      tenantId: TENANT_ID,
      tipo: 'OPORTUNIDADE' as const,
      titulo: 'Alta demanda em Periféricos — Shopee',
      descricao: 'O Mouse Gamer RGB teve 892 visitas nos últimos 30 dias com taxa de conversão de 4,7%. Há oportunidade de aumentar o estoque para aproveitar a demanda e expandir para Mercado Livre.',
      status: 'ATIVO' as const,
      dados: {
        produtoId: 'p0000000-0000-0000-0000-000000000002',
        plataforma: 'SHOPEE',
        visitas30dias: 892,
        vendas30dias: 42,
        taxaConversao: 4.7,
        receitaMensal: 10495.8,
      },
      acaoSugerida: 'Aumentar estoque para 100 unidades e criar anúncio no Mercado Livre com preço competitivo.',
    },
    {
      id: 'i0000000-0000-0000-0000-000000000003',
      tenantId: TENANT_ID,
      tipo: 'TENDENCIA' as const,
      titulo: 'Crescimento consistente em Tecnologia',
      descricao: 'A categoria Tecnologia apresentou crescimento de 23% nas últimas 4 semanas em comparação com o mês anterior. Notebooks e periféricos lideram as vendas.',
      status: 'LIDO' as const,
      dados: {
        categoria: 'Tecnologia',
        crescimento: 23,
        periodo: '30 dias',
        produtosDestaque: ['Notebook Gamer', 'Mouse Gamer', 'Headset'],
      },
      acaoSugerida: 'Ampliar catálogo de produtos de tecnologia e criar campanhas focadas nesse segmento.',
    },
    {
      id: 'i0000000-0000-0000-0000-000000000004',
      tenantId: TENANT_ID,
      tipo: 'ANOMALIA' as const,
      titulo: 'Pico incomum de devoluções',
      descricao: 'Detectadas 3 devoluções de Headset Pro no marketplace Shopee em 7 dias — o dobro da média histórica. Possível problema de qualidade ou descrição inadequada.',
      status: 'ATIVO' as const,
      dados: {
        produtoNome: 'Headset Pro 7.1 Surround',
        devolucoes7dias: 3,
        mediaHistorica: 1.5,
        motivos: ['produto_diferente', 'produto_defeituoso'],
      },
      acaoSugerida: 'Revisar descrição do produto e verificar lote atual com o fornecedor. Considerar pausa temporária do anúncio.',
    },
  ];

  for (const insight of insights) {
    await prisma.insightIA.upsert({
      where: { id: insight.id },
      update: {},
      create: insight,
    });
  }

  console.log(`  ✅ ${insights.length} InsightsIA criados`);

  // ─── Sugestões ─────────────────────────────────────────────────
  const sugestoes = [
    {
      id: 's0000000-0000-0000-0000-000000000001',
      tenantId: TENANT_ID,
      tipo: 'PRECO' as const,
      status: 'PENDENTE' as const,
      contexto: {
        produtoId: 'p0000000-0000-0000-0000-000000000002',
        produtoNome: 'Mouse Gamer RGB',
        precoAtual: 249.90,
        mediaCompetidores: 279.90,
      },
      sugestao: 'O preço atual de R$ 249,90 está 11% abaixo da média dos concorrentes (R$ 279,90). Considere aumentar para R$ 269,90 — ainda competitivo e com margem maior.',
      confianca: '0.8500',
    },
    {
      id: 's0000000-0000-0000-0000-000000000002',
      tenantId: TENANT_ID,
      tipo: 'ESTOQUE' as const,
      status: 'PENDENTE' as const,
      contexto: {
        produtoId: 'p0000000-0000-0000-0000-000000000001',
        produtoNome: 'Notebook Gamer 16GB',
        estoqueAtual: 5,
        mediaVendasMensal: 8,
      },
      sugestao: 'Recomendo comprar 25 unidades do Notebook Gamer 16GB. Com base na tendência de crescimento de 23% em tecnologia e média de 8 vendas/mês, esse estoque cobre aproximadamente 3 meses com margem de segurança.',
      confianca: '0.9200',
    },
    {
      id: 's0000000-0000-0000-0000-000000000003',
      tenantId: TENANT_ID,
      tipo: 'MARKETING' as const,
      status: 'ACEITA' as const,
      contexto: {
        categoria: 'Periféricos',
        plataforma: 'SHOPEE',
      },
      sugestao: 'Crie um kit combo "Mouse + Headset" com desconto de 15%. Produtos complementares em combo aumentam ticket médio e conversão. Você pode configurar isso diretamente na Shopee como "Compre Junto".',
      confianca: '0.7800',
    },
  ];

  for (const sugestao of sugestoes) {
    await prisma.sugestaoIA.upsert({
      where: { id: sugestao.id },
      update: {},
      create: sugestao,
    });
  }

  console.log(`  ✅ ${sugestoes.length} SugestoesIA criadas`);

  // ─── Conversa de demonstração ─────────────────────────────────
  const conversa = await prisma.conversaIA.upsert({
    where: { id: 'c0000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'c0000000-0000-0000-0000-000000000001',
      tenantId: TENANT_ID,
      usuarioId: USER_ADMIN_ID,
      titulo: 'Análise de vendas de abril',
      contexto: {
        modulo: 'vendas',
        periodo: '2026-04',
        foco: 'performance_geral',
      },
    },
  });

  const mensagens = [
    {
      conversaId: conversa.id,
      papel: 'USUARIO' as const,
      conteudo: 'Como foram as vendas em abril? Quais produtos se destacaram?',
      metadados: {},
    },
    {
      conversaId: conversa.id,
      papel: 'ASSISTENTE' as const,
      conteudo: 'Em abril, suas vendas totalizaram R$ 47.832,40 — um crescimento de 23% em relação a março. Os produtos destaque foram:\n\n1. **Mouse Gamer RGB** — 42 unidades (R$ 10.495,80)\n2. **Notebook Gamer 16GB** — 8 unidades (R$ 31.999,20)\n3. **Headset Pro 7.1** — 15 unidades (R$ 5.247,00)\n\nA categoria Tecnologia continua puxando o crescimento. Quer que eu analise algum produto específico ou sugira ações para maio?',
      metadados: {
        tokensUsados: 187,
        modelo: 'claude-opus-4-6',
        tempoRespostaMs: 1840,
      },
    },
  ];

  for (const msg of mensagens) {
    await prisma.mensagemIA.create({ data: msg });
  }

  console.log('  ✅ ConversaIA e MensagensIA criadas');

  console.log('✅ Seed do AI Service concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
