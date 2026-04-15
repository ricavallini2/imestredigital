/**
 * Configuração do Next.js para o iMestreDigital.
 *
 * - Habilita output standalone para Docker otimizado
 * - Configura transpilação de pacotes internos do monorepo
 * - Proxies de API para os microserviços em desenvolvimento
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Output standalone para Docker (imagem final mínima)
  output: 'standalone',

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

  // Rewrites para proxy de API em desenvolvimento
  // Todos os microserviços usam: setGlobalPrefix('api') + enableVersioning('1')
  // Logo: frontend /api/v1/{recurso} → backend http://localhost:PORT/api/v1/{recurso}
  async rewrites() {
    return [
      // ── Auth Service (3001) ──────────────────────────────────
      { source: '/api/v1/auth/:path*',    destination: 'http://localhost:3001/api/v1/auth/:path*' },

      // ── Catalog Service / Produtos (3010) ────────────────────
      // Removido: rotas mock locais em app/api/v1/produtos/** têm prioridade no dev

      // ── Inventory Service / Estoque (3011) ───────────────────
      // Removido: rotas mock locais em app/api/v1/estoque/** têm prioridade no dev

      // ── Order Service / Pedidos (3005) ───────────────────────
      // Removido: rotas mock locais em app/api/v1/pedidos/** têm prioridade no dev

      // ── Financial Service (3006) ─────────────────────────────
      // Removido: rotas mock locais em app/api/v1/lancamentos/** têm prioridade no dev
      // { source: '/api/v1/lancamentos/:path*',  destination: 'http://localhost:3006/api/v1/lancamentos/:path*' },
      // { source: '/api/v1/contas/:path*',       destination: 'http://localhost:3006/api/v1/contas/:path*' },
      // { source: '/api/v1/categorias/:path*',   destination: 'http://localhost:3006/api/v1/categorias/:path*' },
      // { source: '/api/v1/fluxo-caixa/:path*',  destination: 'http://localhost:3006/api/v1/fluxo-caixa/:path*' },
      // { source: '/api/v1/dre/:path*',          destination: 'http://localhost:3006/api/v1/dre/:path*' },

      // ── Marketplace Service (3007) ───────────────────────────
      { source: '/api/v1/marketplace/:path*',  destination: 'http://localhost:3007/api/v1/marketplace/:path*' },
      { source: '/api/v1/anuncios/:path*',     destination: 'http://localhost:3007/api/v1/anuncios/:path*' },

      // ── AI Service (3008) ────────────────────────────────────
      { source: '/api/v1/insights/:path*',   destination: 'http://localhost:3008/api/v1/insights/:path*' },
      { source: '/api/v1/assistente/:path*', destination: 'http://localhost:3008/api/v1/assistente/:path*' },
      { source: '/api/v1/sugestoes/:path*',  destination: 'http://localhost:3008/api/v1/sugestoes/:path*' },
      { source: '/api/v1/previsao/:path*',   destination: 'http://localhost:3008/api/v1/previsao/:path*' },

      // ── Notification Service (3009) ──────────────────────────
      { source: '/api/v1/notificacoes/:path*', destination: 'http://localhost:3009/api/v1/notificacoes/:path*' },

      // ── Fiscal Service (3004) ────────────────────────────────
      // Removido: rotas mock locais em app/api/v1/notas-fiscais/** têm prioridade no dev

      // ── Customer Service / CRM (3012) ────────────────────────
      // Removido: rotas mock locais em app/api/v1/clientes/** têm prioridade no dev
    ];
  },
};

export default nextConfig;
