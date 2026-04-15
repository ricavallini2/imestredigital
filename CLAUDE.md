# iMestreDigital — SaaS ERP IA

Brazilian-focused, multi-tenant, AI-powered ERP SaaS. **All identifiers and UI text are in Portuguese (pt-BR).**

---

## Monorepo (Turbo)

```
apps/
  web/          Next.js 15 — main dashboard (port 3000)
  mobile/       React Native (scaffold only)
services/
  auth-service        3001  JWT auth, tenants, users
  fiscal-service      3004  NF-e / SEFAZ integration
  order-service       3005  Orders, fulfillment
  financial-service   3006  Ledger, cash flow, DRE
  marketplace-service 3007  Shopee etc.
  ai-service          3008  LLM, insights, chat
  notification-service 3009 Email/SMS/push
  catalog-service     3010  Products, categories, brands
  inventory-service   3011  Stock, warehouses, movements
  customer-service    3012  CRM, interactions
packages/
  types/        Shared TS types (barrel: @imestredigital/types)
  config/       Zod env validation
  logger/       Pino with tenant context
  events/       Kafka domain events
  ui/           Shared component library
```

---

## Tech Stack

**Frontend (`apps/web`)**

| Concern | Library |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS 3.4 — dark mode via `class` |
| Icons | lucide-react |
| Data fetching | TanStack React Query 5 + Axios |
| Forms | React Hook Form 7 + Zod |
| State | Zustand 4 |
| Charts | Recharts 2 |
| Date | date-fns 3 |

**Backend (each service)**

| Concern | Library |
|---|---|
| Framework | NestJS 10 |
| ORM | Prisma 5 + PostgreSQL 16 |
| Cache | Redis 7 (ioredis + cache-manager) |
| Events | Kafka via kafkajs (Redpanda in dev) |
| Auth | Passport + JWT |
| Docs | Swagger/OpenAPI |

---

## Frontend Structure (`apps/web/src/`)

```
app/
  api/v1/          Mock Next.js API route handlers (all features)
  auth/            /login, /registro
  dashboard/       Main app pages (feature folders)
    fiscal/        NF-e list + [id]/ detail + danfe/ + nfce/ print pages
    produtos/      Product catalog + [id]/ + etiquetas/ label module
    clientes/      CRM
    estoque/       Inventory
    financeiro/    Finance
    pedidos/       Orders
    caixa/         POS / cash register
    pdv/           Point of sale
    ia/            AI assistant
components/
  ui/              10 shared primitives (form-field, data-table, kpi-card,
                   modal, status-badge, tabs, timeline, empty-state,
                   loading, logo)
  layout/          Sidebar, header, etc.
hooks/             13 React Query hooks (one per domain — see below)
services/          10 axios service clients (one per domain)
lib/
  api.ts           Axios instance w/ JWT interceptor + auto-refresh
  utils.ts
middleware.ts      Auth guard — redirects unauthenticated users to /login
```

### Hooks → Services map

| Hook | Service client | API base |
|---|---|---|
| `useDashboard` | dashboard.service | `/v1/dashboard` |
| `useProdutos` | produtos.service | `/v1/produtos` |
| `useClientes` | clientes.service | `/v1/clientes` |
| `useEstoque` | estoque.service | `/v1/estoque` |
| `usePedidos` | pedidos.service | `/v1/pedidos` |
| `useFinanceiro` | financeiro.service | `/v1/financeiro` |
| `useFiscal` → `useNotaFiscal` + `useConfiguracaoFiscal` | fiscal.service | `/v1/fiscal` |
| `useCobranca` | cobranca.service | `/v1/cobranca` |
| `useCompras` | compras.service | `/v1/compras` |
| `useMarketplaces` | marketplaces.service | `/v1/marketplaces` |
| `useIA` | ia.service | `/v1/ia` |
| `useCaixa` | caixa.service | `/v1/caixa` |
| `useDebounce` | — | utility |

---

## Key Conventions

- **Import alias**: `@/*` → `apps/web/src/*`
- **Package imports**: `@imestredigital/*` (workspace packages)
- **Naming**: `PascalCase` components/types · `camelCase` vars/functions · `UPPER_SNAKE_CASE` constants
- **File naming**: `kebab-case.tsx`
- **Portuguese everywhere**: DB columns, API fields, component labels, variable names (e.g. `nomeCompleto`, `senhaHash`, `criadoEm`)
- **No semicolons** (Prettier default)
- **2-space indentation**
- **Strict TypeScript** — no `any`, proper type guards

---

## Authentication

- JWT (access: 1h · refresh: 7d) stored in `localStorage` + httpOnly cookie
- `lib/api.ts` auto-injects `Authorization: Bearer` and auto-refreshes on 401
- `middleware.ts` reads cookie; redirects to `/login?redirect={path}` if missing
- JWT payload: `{ sub, tenantId, email, cargo }`
- Roles: `admin` · `gerente` · `operador` · `visualizador`

**Dev credentials** (mock API):
```
teste@teste.com / Senha123       → admin
gerente@teste.com / Senha123     → gerente
operador@teste.com / Senha123    → operador
visualizador@teste.com / Senha123 → visualizador
```

---

## Multi-tenancy

Every DB table has `tenantId UUID` (indexed). All queries **must** filter by `tenantId`. NestJS middleware extracts it from JWT and injects into request context. Never omit this filter.

---

## Database Patterns

Key tables per service (Prisma schema, PostgreSQL):

**auth-service**: `tenants` · `usuarios` · `refresh_tokens`  
**catalog-service**: `produtos` · `categorias` · `marcas` · `variacoes_produtos` · `imagens_produtos`  
**inventory-service**: `depositos` · `saldos_estoque` · `reservas_estoque` · `movimentacoes`  
**customer-service**: `clientes` · `enderecos` · `contatos` · `interacoes` · `segmentos`  
**order-service**: `pedidos` · `itens_pedido`  
**financial-service**: `lancamentos` · `contas` · `categorias_lancamento`  
**fiscal-service**: `notas_fiscais`

All tables: `criadoEm` + `atualizadoEm` timestamps · soft deletes via `status`/`ativo` flags.

---

## Design Tokens (Tailwind)

```
marca-*   → brand blue  (#2E86C1 base)
destaque-* → accent orange (#E67E22 base)
Font sans: Inter · Font mono: JetBrains Mono
Animations: fade-in, slide-up, slide-down
```

---

## Print Pages

Standalone `page.tsx` files that call `window.print()` automatically (700ms delay via `useEffect`):
- `fiscal/[id]/danfe/` — DANFE A4 (NF-e auxiliary doc)
- `fiscal/[id]/nfce/` — NFC-e 80mm thermal coupon
- `produtos/etiquetas/imprimir/` — label sheets (reads `LayoutPagina` + `ConteudoEtiqueta` from `sessionStorage`)

Print pages use `@page { margin: 0 }` and `.no-print` class to hide the action bar.

---

## Label Module (`produtos/etiquetas/`)

Saved configs in `localStorage`:
- `etiqueta-layouts-v2` → `LayoutCompleto[]`
- `etiqueta-pagina-v2` → `LayoutPagina`
- `etiqueta-conteudo-v2` → `ConteudoEtiqueta`

Print queue passed via `sessionStorage`:
- `etiqueta-layout-pagina` → `LayoutPagina`
- `etiqueta-conteudo` → `ConteudoEtiqueta`
- `etiqueta-items` → `PrintItem[]`

Paper presets: `a4` · `a5` · `carta` · `bobina80` · `bobina58` · `personalizado`

---

## Commands

```bash
# From repo root
npm run dev          # start everything (Turbo)
npm run build        # build all
npm run lint         # ESLint
npm run format       # Prettier
npm run docker:up    # start Postgres + Redis + Redpanda
npm run db:migrate   # Prisma migrations
npm run db:seed      # seed data

# Frontend only
cd apps/web && npm run dev   # port 3000
```

---

## What's Mock vs Real

The **frontend is fully functional with mock data** — all `app/api/v1/` routes return hardcoded/generated data. The NestJS microservices are scaffolded and partially implemented but not required to run the frontend. `next.config.ts` rewrites `/api/v1/*` to microservices in production.
