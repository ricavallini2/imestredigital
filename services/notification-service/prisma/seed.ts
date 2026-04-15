/**
 * Seed do Notification Service.
 *
 * Popula templates padrão de notificações.
 * Executa com: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** ID fixo alinhado com o auth-service seed */
const TENANT_ID = '10000000-0000-0000-0000-000000000001';

const TEMPLATE_BOAS_VINDAS      = 'a0000000-0000-0000-0001-000000000001';
const TEMPLATE_PEDIDO_CONFIRMADO = 'a0000000-0000-0000-0001-000000000002';
const TEMPLATE_NFE_AUTORIZADA   = 'a0000000-0000-0000-0001-000000000003';
const TEMPLATE_ESTOQUE_BAIXO    = 'a0000000-0000-0000-0001-000000000004';
const TEMPLATE_RECUPERAR_SENHA  = 'a0000000-0000-0000-0001-000000000005';

async function main() {
  console.log('🌱 Iniciando seed de templates...');

  await prisma.templateNotificacao.upsert({
    where: { tenantId_slug: { tenantId: TENANT_ID, slug: 'boas-vindas' } },
    update: {},
    create: {
      id: TEMPLATE_BOAS_VINDAS,
      tenantId: TENANT_ID,
      nome: 'Boas-vindas ao iMestreDigital',
      slug: 'boas-vindas',
      tipo: 'EMAIL',
      assunto: 'Bem-vindo ao iMestreDigital!',
      conteudo: `
<p>Olá {{nomeUsuario}},</p>
<p>Bem-vindo ao iMestreDigital! Estamos felizes em tê-lo conosco.</p>
<p>Sua conta foi criada com sucesso e agora você pode:</p>
<ul>
  <li>Gerenciar seus pedidos</li>
  <li>Acompanhar estoque</li>
  <li>Emitir notas fiscais</li>
  <li>Integrar com marketplaces</li>
</ul>
<p>Atenciosamente,<br>Time iMestreDigital</p>
      `,
      variaveis: ['nomeUsuario', 'emailUsuario'],
      ativo: true,
    },
  });

  await prisma.templateNotificacao.upsert({
    where: { tenantId_slug: { tenantId: TENANT_ID, slug: 'pedido-confirmado' } },
    update: {},
    create: {
      id: TEMPLATE_PEDIDO_CONFIRMADO,
      tenantId: TENANT_ID,
      nome: 'Pedido Confirmado',
      slug: 'pedido-confirmado',
      tipo: 'EMAIL',
      assunto: 'Seu pedido #{{pedidoNumero}} foi confirmado',
      conteudo: `
<p>Olá {{nomeCliente}},</p>
<p>Seu pedido #{{pedidoNumero}} foi confirmado com sucesso!</p>
<h3>Detalhes do Pedido:</h3>
<ul>
  <li><strong>Número:</strong> {{pedidoNumero}}</li>
  <li><strong>Data:</strong> {{dataPedido}}</li>
  <li><strong>Valor Total:</strong> R$ {{valorTotal}}</li>
</ul>
<p>Obrigado pela compra!<br>Time iMestreDigital</p>
      `,
      variaveis: ['nomeCliente', 'pedidoNumero', 'dataPedido', 'valorTotal', 'quantidadeItens', 'linkAcompanhamento'],
      ativo: true,
    },
  });

  await prisma.templateNotificacao.upsert({
    where: { tenantId_slug: { tenantId: TENANT_ID, slug: 'nfe-autorizada' } },
    update: {},
    create: {
      id: TEMPLATE_NFE_AUTORIZADA,
      tenantId: TENANT_ID,
      nome: 'NFe Autorizada',
      slug: 'nfe-autorizada',
      tipo: 'EMAIL',
      assunto: 'Sua NFe #{{nfeNumero}} foi autorizada',
      conteudo: `
<p>Olá {{nomeCliente}},</p>
<p>A NFe de seu pedido foi autorizada pela Receita Federal!</p>
<ul>
  <li><strong>Número:</strong> {{nfeNumero}}</li>
  <li><strong>Chave de Acesso:</strong> {{chaveAcesso}}</li>
</ul>
<p><a href="{{urlPdf}}">Baixar NFe em PDF</a></p>
<p>Atenciosamente,<br>Time iMestreDigital</p>
      `,
      variaveis: ['nomeCliente', 'nfeNumero', 'nfeSerie', 'dataAutorizacao', 'chaveAcesso', 'urlPdf'],
      ativo: true,
    },
  });

  await prisma.templateNotificacao.upsert({
    where: { tenantId_slug: { tenantId: TENANT_ID, slug: 'estoque-baixo' } },
    update: {},
    create: {
      id: TEMPLATE_ESTOQUE_BAIXO,
      tenantId: TENANT_ID,
      nome: 'Alerta de Estoque Baixo',
      slug: 'estoque-baixo',
      tipo: 'EMAIL',
      assunto: 'Alerta: Estoque baixo para {{nomeProduto}}',
      conteudo: `
<p>Atenção! O produto <strong>{{nomeProduto}}</strong> possui estoque crítico.</p>
<ul>
  <li><strong>SKU:</strong> {{sku}}</li>
  <li><strong>Quantidade em Estoque:</strong> {{quantidadeAtual}}</li>
  <li><strong>Nível Mínimo:</strong> {{nivelMinimo}}</li>
</ul>
<p>Por favor, reponha o estoque assim que possível.<br>Sistema iMestreDigital</p>
      `,
      variaveis: ['nomeProduto', 'sku', 'quantidadeAtual', 'nivelMinimo'],
      ativo: true,
    },
  });

  await prisma.templateNotificacao.upsert({
    where: { tenantId_slug: { tenantId: TENANT_ID, slug: 'recuperar-senha' } },
    update: {},
    create: {
      id: TEMPLATE_RECUPERAR_SENHA,
      tenantId: TENANT_ID,
      nome: 'Recuperação de Senha',
      slug: 'recuperar-senha',
      tipo: 'EMAIL',
      assunto: 'Recupere sua senha no iMestreDigital',
      conteudo: `
<p>Olá,</p>
<p>Recebemos uma solicitação de recuperação de senha para sua conta.</p>
<p><a href="{{linkResetSenha}}">Resetar Senha</a></p>
<p>Este link expira em {{tempoExpiracao}} horas.</p>
<p>Se você não solicitou esta recuperação, ignore este email.<br>Time iMestreDigital</p>
      `,
      variaveis: ['linkResetSenha', 'tempoExpiracao', 'emailUsuario'],
      ativo: true,
    },
  });

  console.log('✅ 5 templates de notificação criados!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
