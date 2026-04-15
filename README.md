# iMestreDigital

**ERP SaaS com Inteligência Artificial para o Comércio Brasileiro**

---

## Visão Geral

O iMestreDigital é uma plataforma de gestão empresarial (ERP) cloud-native com IA nativa, projetada para comércios que operam em múltiplos canais e marketplaces do mercado brasileiro. A plataforma unifica gestão de produtos, estoque, pedidos, fiscal, financeiro e CRM com inteligência artificial integrada em cada módulo.

## Estrutura do Monorepo

```
imestredigital/
├── apps/                          # Aplicações de interface
│   ├── web/                       # Dashboard web (Next.js 15 + React 19)
│   ├── mobile/                    # App mobile (React Native + Expo)
│   └── api-gateway/               # API Gateway (Kong/Express)
│
├── services/                      # Microserviços de domínio
│   ├── catalog-service/           # Catálogo de produtos (NestJS)
│   ├── inventory-service/         # Gestão de estoque
│   ├── order-service/             # Gestão de pedidos (OMS)
│   ├── marketplace-service/       # Integração com marketplaces
│   ├── fiscal-service/            # NF-e, NFS-e, SPED
│   ├── financial-service/         # Contas, fluxo de caixa
│   ├── customer-service/          # CRM e clientes
│   ├── ai-engine/                 # Motor de IA (Python/FastAPI)
│   ├── notification-service/      # Notificações multicanal
│   └── auth-service/              # Autenticação e autorização
│
├── packages/                      # Pacotes compartilhados
│   ├── types/                     # Tipos TypeScript centralizados
│   ├── config/                    # Configuração e variáveis de ambiente
│   ├── events/                    # Definição de eventos de domínio
│   ├── logger/                    # Logger estruturado (Pino)
│   ├── utils/                     # Utilitários compartilhados
│   ├── database/                  # Configuração de banco de dados
│   ├── ui/                        # Componentes UI compartilhados
│   ├── eslint-config/             # Configuração ESLint
│   └── typescript-config/         # Configuração TypeScript
│
├── infra/                         # Infraestrutura
│   ├── docker/                    # Docker configs e docker-compose
│   ├── terraform/                 # IaC para cloud (AWS/GCP)
│   └── kubernetes/                # Manifests K8s
│
├── docs/                          # Documentação
│   ├── architecture/              # Diagramas e decisões arquiteturais
│   ├── api/                       # Documentação de APIs
│   ├── guides/                    # Guias de desenvolvimento
│   └── adr/                       # Architecture Decision Records
│
├── scripts/                       # Scripts de automação
└── .github/workflows/             # CI/CD (GitHub Actions)
```

## Pré-requisitos

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** e **Docker Compose** (para serviços de infraestrutura)
- **Git** >= 2.40

## Início Rápido

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/imestredigital.git
cd imestredigital
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações locais
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Subir serviços de infraestrutura

```bash
npm run docker:up
```

Isso sobe: PostgreSQL, Redis, Redpanda (Kafka), Elasticsearch, MinIO, Grafana e Mailpit.

### 5. Executar migrations do banco

```bash
npm run db:migrate
```

### 6. Iniciar o desenvolvimento

```bash
npm run dev
```

Todos os serviços iniciam em paralelo via Turborepo.

## Serviços e Portas

| Serviço               | Porta  | Descrição                        |
|-----------------------|--------|----------------------------------|
| Web (Next.js)         | 3000   | Dashboard principal              |
| Catalog Service       | 3010   | API de produtos e catálogo       |
| Inventory Service     | 3011   | API de estoque                   |
| Order Service         | 3012   | API de pedidos (OMS)             |
| Marketplace Service   | 3013   | API de integração com marketplaces |
| Fiscal Service        | 3014   | API fiscal (NF-e, SPED)         |
| Financial Service     | 3015   | API financeira                   |
| Customer Service      | 3016   | API de clientes (CRM)           |
| AI Engine             | 3017   | API de IA e ML                   |
| Notification Service  | 3018   | API de notificações              |
| Auth Service          | 3019   | API de autenticação              |
| PostgreSQL            | 5432   | Banco de dados                   |
| Redis                 | 6379   | Cache e filas                    |
| Redpanda (Kafka)      | 9092   | Message broker                   |
| Redpanda Console      | 8080   | UI do Redpanda                   |
| Elasticsearch         | 9200   | Motor de busca                   |
| Kibana                | 5601   | UI do Elasticsearch              |
| MinIO                 | 9000/9001 | Armazenamento S3 local        |
| Grafana               | 3001   | Dashboards de observabilidade    |
| Mailpit               | 1025/8025 | Captura de e-mails (dev)      |

## Stack Tecnológica

### Frontend
- **Next.js 15** com App Router e Server Components
- **React 19** com Hooks e Suspense
- **TypeScript 5.4** com strict mode
- **Tailwind CSS 3.4** com design system customizado
- **TanStack Query** para gerenciamento de estado do servidor
- **Zustand** para estado local
- **React Hook Form + Zod** para formulários e validação

### Backend
- **NestJS 10** com TypeScript (microserviços de domínio)
- **Prisma ORM** para acesso ao banco de dados
- **KafkaJS** para mensageria e eventos de domínio
- **Swagger/OpenAPI** para documentação automática de APIs

### IA/ML
- **Python + FastAPI** (ai-engine)
- **LangChain** para orquestração de LLMs
- **PyTorch / scikit-learn** para modelos preditivos
- **pgvector** para busca semântica

### Infraestrutura
- **PostgreSQL 16** com Citus para multi-tenancy
- **Redis 7** para cache e filas rápidas
- **Apache Kafka** (Redpanda em dev) para event streaming
- **Elasticsearch 8** para busca full-text
- **Docker + Kubernetes** para containerização
- **Terraform** para Infrastructure as Code
- **GitHub Actions** para CI/CD

## Scripts Disponíveis

| Comando                 | Descrição                                    |
|------------------------|----------------------------------------------|
| `npm run dev`          | Inicia todos os serviços em modo desenvolvimento |
| `npm run build`        | Build de produção de todos os pacotes        |
| `npm run test`         | Executa todos os testes                      |
| `npm run test:unit`    | Executa apenas testes unitários              |
| `npm run test:integration` | Executa testes de integração            |
| `npm run lint`         | Verifica problemas de código                 |
| `npm run lint:fix`     | Corrige problemas automaticamente            |
| `npm run format`       | Formata todo o código com Prettier           |
| `npm run docker:up`    | Sobe serviços de infraestrutura (Docker)     |
| `npm run docker:down`  | Para serviços de infraestrutura              |
| `npm run docker:logs`  | Acompanha logs dos containers                |
| `npm run db:migrate`   | Executa migrations do banco                  |
| `npm run db:seed`      | Popula o banco com dados de teste            |
| `npm run clean`        | Remove todos os artefatos de build           |

## Padrões de Commit

Utilizamos Conventional Commits para manter um histórico limpo e gerar changelogs automáticos.

```
tipo(escopo): descrição curta

Exemplos:
feat(catalogo): adicionar busca por código de barras
fix(fiscal): corrigir cálculo de ICMS interestadual
docs(api): documentar endpoints do serviço de estoque
refactor(pedidos): extrair lógica de validação para service
test(estoque): adicionar testes de integração para reserva
```

### Tipos permitidos:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (sem alteração de lógica)
- `refactor`: Refatoração de código
- `perf`: Melhoria de performance
- `test`: Adição/correção de testes
- `build`: Alterações no build/dependências
- `ci`: Alterações no CI/CD
- `chore`: Manutenção geral

## Arquitetura

O iMestreDigital segue uma arquitetura de **microserviços event-driven** com DDD (Domain-Driven Design):

- Cada microserviço é um bounded context independente
- Comunicação assíncrona via **Kafka** (events)
- Comunicação síncrona via **REST/gRPC** quando necessário
- **Multi-tenancy** híbrido com isolamento por schema
- **API-first** com documentação Swagger automática

## Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

---

**iMestreDigital** - Inteligência que move o comércio brasileiro.
