/**
 * Configuração do Next.js para o iMestreDigital.
 *
 * - Habilita output standalone para Docker otimizado
 * - Configura transpilação de pacotes internos do monorepo
 * - Proxies de API para os microserviços (beforeFiles garante prioridade sobre mock routes)
 *
 * Em produção (Docker), os serviços são acessados por nome de container.
 * Em desenvolvimento local, define as variáveis de ambiente abaixo para
 * apontar para localhost (ex: AUTH_SERVICE_URL=http://localhost:3001).
 */

import type { NextConfig } from 'next';

// ─── URLs internas dos microserviços ─────────────────────────────────────────
// Defaults = nomes de serviço Docker (rede interna do docker-compose.prod.yml)
// Override via variáveis de ambiente para desenvolvimento local sem Docker
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const CATALOG_SERVICE = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3010';
const INVENTORY_SERVICE = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3011';
const ORDER_SERVICE = process.env.ORDER_SERVICE_URL || 'http://order-service:3005';
const FINANCIAL_SERVICE = process.env.FINANCIAL_SERVICE_URL || 'http://financial-service:3006';
const FISCAL_SERVICE = process.env.FISCAL_SERVICE_URL || 'http://fiscal-service:3004';
const CUSTOMER_SERVICE = process.env.CUSTOMER_SERVICE_URL || 'http://customer-service:3012';
const MARKETPLACE_SERVICE =
  process.env.MARKETPLACE_SERVICE_URL || 'http://marketplace-service:3007';
const AI_SERVICE = process.env.AI_SERVICE_URL || 'http://ai-service:3008';
const NOTIFICATION_SERVICE =
  process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3009';

const nextConfig: NextConfig = {
  // Output standalone para Docker (imagem final mínima)
  output: 'standalone',

  // Pular verificação de tipos no build (verificar separadamente via tsc)
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // Pacotes que devem ser resolvidos pelo Node em runtime (não bundled pelo webpack)
  serverExternalPackages: ['jsonwebtoken'],

  // Transpila pacotes internos do monorepo
  transpilePackages: ['@imestredigital/types', '@imestredigital/ui'],

  // Configuração de imagens (permite domínios de CDN)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  /**
   * Rewrites para proxy de API.
   *
   * IMPORTANTE: usamos `beforeFiles` para que estes rewrites tenham
   * prioridade sobre os route handlers em app/api/v1/ (que são mocks).
   * Sem beforeFiles, o Next.js resolveria os arquivos de rota primeiro,
   * retornando sempre dados fictícios em vez dos dados reais do PostgreSQL.
   *
   * Todos os microserviços usam:
   *   setGlobalPrefix('api') + enableVersioning(URI, '1')
   *   → rota final: /api/v1/{recurso}
   *
   * Exceto: financial-service e customer-service cujos controllers
   *   já incluem o caminho completo 'api/v1/lancamentos' etc.
   */
  async rewrites() {
    // Em desenvolvimento local (sem Docker) NÃO defina USE_MICROSERVICES: todos os
    // /api/v1/* caem nos route handlers mock de app/api/v1/, e o frontend funciona
    // 100% offline (sem precisar dos microserviços, Postgres, Redis ou Kafka).
    // Em produção (Docker) defina USE_MICROSERVICES=true para ativar o proxy real.
    if (process.env.USE_MICROSERVICES !== 'true') {
      return { beforeFiles: [], afterFiles: [], fallback: [] };
    }
    return {
      beforeFiles: [
        // ── Auth Service (3001) ─────────────────────────────────────
        { source: '/api/v1/auth/:path*', destination: `${AUTH_SERVICE}/api/v1/auth/:path*` },
        { source: '/api/v1/tenants/:path*', destination: `${AUTH_SERVICE}/api/v1/tenants/:path*` },
        {
          source: '/api/v1/usuarios/:path*',
          destination: `${AUTH_SERVICE}/api/v1/usuarios/:path*`,
        },
        // Rota base explícita (o :path* acima não cobre a lista sem sufixo).
        { source: '/api/v1/usuarios', destination: `${AUTH_SERVICE}/api/v1/usuarios` },

        // ── Catalog Service / Produtos (3010) ───────────────────────
        // Nota: /produtos/:id/variacoes(/prever,/lote) já caem no proxy de produtos abaixo.
        {
          source: '/api/v1/produtos/:path*',
          destination: `${CATALOG_SERVICE}/api/v1/produtos/:path*`,
        },
        {
          source: '/api/v1/categorias/:path*',
          destination: `${CATALOG_SERVICE}/api/v1/categorias/:path*`,
        },
        { source: '/api/v1/marcas/:path*', destination: `${CATALOG_SERVICE}/api/v1/marcas/:path*` },
        { source: '/api/v1/grades/:path*', destination: `${CATALOG_SERVICE}/api/v1/grades/:path*` },

        // ── Inventory Service / Estoque (3011) ──────────────────────
        {
          source: '/api/v1/estoque/:path*',
          destination: `${INVENTORY_SERVICE}/api/v1/estoque/:path*`,
        },
        {
          source: '/api/v1/depositos/:path*',
          destination: `${INVENTORY_SERVICE}/api/v1/depositos/:path*`,
        },
        {
          source: '/api/v1/movimentacoes/:path*',
          destination: `${INVENTORY_SERVICE}/api/v1/movimentacoes/:path*`,
        },

        // ── Order Service / Pedidos (3005) ──────────────────────────
        { source: '/api/v1/pedidos/:path*', destination: `${ORDER_SERVICE}/api/v1/pedidos/:path*` },
        // Pagamentos de pedido (registrar recebimento no caixa, estornos, webhooks)
        {
          source: '/api/v1/pagamentos/:path*',
          destination: `${ORDER_SERVICE}/api/v1/pagamentos/:path*`,
        },
        // Cadastro de formas de pagamento (bandeira × parcelas, taxas, prazos)
        {
          source: '/api/v1/formas-pagamento/:path*',
          destination: `${ORDER_SERVICE}/api/v1/formas-pagamento/:path*`,
        },
        {
          source: '/api/v1/formas-pagamento',
          destination: `${ORDER_SERVICE}/api/v1/formas-pagamento`,
        },
        // Caixa: sessões de turno, movimentações, abertura e fechamento.
        // Cobre /caixa/atual, /caixa/:id, /caixa/:id/fechar e /caixa/:id/movimentacoes.
        { source: '/api/v1/caixa/:path*', destination: `${ORDER_SERVICE}/api/v1/caixa/:path*` },
        // Rota base explícita: o :path* acima NÃO casa com /api/v1/caixa sem
        // sufixo (histórico e abertura de caixa cairiam no mock).
        { source: '/api/v1/caixa', destination: `${ORDER_SERVICE}/api/v1/caixa` },

        // ── Financial Service (3006) ────────────────────────────────
        // Controllers já usam path completo 'api/v1/lancamentos' etc.
        {
          source: '/api/v1/lancamentos/:path*',
          destination: `${FINANCIAL_SERVICE}/api/v1/lancamentos/:path*`,
        },
        {
          source: '/api/v1/contas-bancarias/:path*',
          destination: `${FINANCIAL_SERVICE}/api/v1/contas/:path*`,
        },
        // Relatórios financeiros: o financial-service agora expõe estes endpoints
        // no shape exato esperado pelo frontend (RelatoriosController → api/v1/financeiro/*).
        {
          source: '/api/v1/financeiro/fluxo-caixa',
          destination: `${FINANCIAL_SERVICE}/api/v1/financeiro/fluxo-caixa`,
        },
        {
          source: '/api/v1/financeiro/dre',
          destination: `${FINANCIAL_SERVICE}/api/v1/financeiro/dre`,
        },
        {
          source: '/api/v1/financeiro/resumo',
          destination: `${FINANCIAL_SERVICE}/api/v1/financeiro/resumo`,
        },

        // ── Fiscal Service (3004) ───────────────────────────────────
        // Controllers usam 'v1/notas-fiscais' com globalPrefix 'api'
        {
          source: '/api/v1/notas-fiscais/:path*',
          destination: `${FISCAL_SERVICE}/api/v1/notas-fiscais/:path*`,
        },
        {
          source: '/api/v1/configuracao-fiscal/:path*',
          destination: `${FISCAL_SERVICE}/api/v1/configuracao-fiscal/:path*`,
        },
        {
          source: '/api/v1/regras-fiscais/:path*',
          destination: `${FISCAL_SERVICE}/api/v1/regras-fiscais/:path*`,
        },

        // ── Customer Service / Clientes (3012) ──────────────────────
        // Controllers já usam path completo 'api/v1/clientes' etc.
        {
          source: '/api/v1/clientes/:path*',
          destination: `${CUSTOMER_SERVICE}/api/v1/clientes/:path*`,
        },
        {
          source: '/api/v1/segmentos/:path*',
          destination: `${CUSTOMER_SERVICE}/api/v1/segmentos/:path*`,
        },

        // ── Marketplace Service (3007) ──────────────────────────────
        // Controllers padronizados com caminho completo 'api/v1/...' (sem setGlobalPrefix).
        // A VITRINE (api/v1/marketplaces) serve a UI no shape das telas
        // (Marketplace/Anuncio/Stats). O recurso técnico 'contas' segue exposto
        // para operações de conexão (OAuth, desconectar) via /api/v1/contas.
        {
          source: '/api/v1/anuncios/:path*',
          destination: `${MARKETPLACE_SERVICE}/api/v1/anuncios/:path*`,
        },
        {
          source: '/api/v1/marketplaces/:path*',
          destination: `${MARKETPLACE_SERVICE}/api/v1/marketplaces/:path*`,
        },
        {
          source: '/api/v1/contas/:path*',
          destination: `${MARKETPLACE_SERVICE}/api/v1/contas/:path*`,
        },
        {
          source: '/api/v1/pedidos-marketplace/:path*',
          destination: `${MARKETPLACE_SERVICE}/api/v1/pedidos-marketplace/:path*`,
        },
        {
          source: '/api/v1/perguntas-marketplace/:path*',
          destination: `${MARKETPLACE_SERVICE}/api/v1/perguntas-marketplace/:path*`,
        },
        {
          source: '/api/v1/sincronizacao/:path*',
          destination: `${MARKETPLACE_SERVICE}/api/v1/sincronizacao/:path*`,
        },

        // ── AI Service (3008) ───────────────────────────────────────
        { source: '/api/v1/insights/:path*', destination: `${AI_SERVICE}/api/v1/insights/:path*` },
        {
          source: '/api/v1/assistente/:path*',
          destination: `${AI_SERVICE}/api/v1/assistente/:path*`,
        },
        {
          source: '/api/v1/sugestoes/:path*',
          destination: `${AI_SERVICE}/api/v1/sugestoes/:path*`,
        },
        { source: '/api/v1/previsao/:path*', destination: `${AI_SERVICE}/api/v1/previsao/:path*` },
        {
          source: '/api/v1/classificacao/:path*',
          destination: `${AI_SERVICE}/api/v1/classificacao/:path*`,
        },

        // ── Notification Service (3009) ─────────────────────────────
        {
          source: '/api/v1/notificacoes/:path*',
          destination: `${NOTIFICATION_SERVICE}/api/v1/notificacoes/:path*`,
        },
      ],
      // afterFiles: rotas não cobertas acima continuam sendo servidas
      // pelos route handlers mock em app/api/v1/ (dashboard, ia, etc.)
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
