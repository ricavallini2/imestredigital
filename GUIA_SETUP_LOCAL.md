# 📋 iMestreDigital - Guia Completo de Setup Local

> **Versão:** 1.0
> **Data:** Março de 2026
> **Autor:** Ricardo Cavallini
> **Projeto:** iMestreDigital - ERP SaaS com IA para Comércio Brasileiro

---

## 📑 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Primeiro Setup (Do Zero)](#-primeiro-setup-do-zero)
3. [Iniciar os Serviços](#-iniciar-os-serviços)
4. [Verificação Rápida](#-verificação-rápida)
5. [Credenciais de Teste](#-credenciais-de-teste)
6. [Troubleshooting Comum](#-troubleshooting-comum)
7. [Estrutura do Projeto](#-estrutura-do-projeto)
8. [Comandos Úteis](#-comandos-úteis)
9. [Próximos Passos para Produção](#-próximos-passos-para-produção)

---

## 🔧 Pré-requisitos

Antes de começar, você precisa de:

### Node.js 20+ (com nvm)

Recomendamos usar `nvm` (Node Version Manager) para gerenciar versões do Node.

```bash
# Instalar nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reiniciar o terminal ou executar:
source ~/.bashrc

# Instalar Node.js 20
nvm install 20
nvm use 20

# Verificar instalação
node --version      # v20.x.x
npm --version       # 10.x.x ou superior
```

**Windows**: Baixe o instalador em [nodejs.org](https://nodejs.org) - escolha LTS (Node 20+)

### Docker Desktop

O Docker é essencial para rodar os serviços de infraestrutura (PostgreSQL, Redis, Redpanda, etc).

```bash
# macOS
brew install docker-desktop

# Windows/Linux
# Acesse: https://www.docker.com/products/docker-desktop

# Verificar instalação
docker --version
docker-compose --version
```

**Importante:** Certifique-se de que o Docker Desktop está rodando antes de continuar.

### Git

```bash
# Verificar se Git está instalado
git --version

# Se não estiver, instale:
# macOS
brew install git

# Windows
# Download: https://git-scm.com/download/win

# Linux (Ubuntu/Debian)
sudo apt-get install git
```

### pnpm ou npm

O projeto usa **npm** por padrão (já vem com Node.js).

```bash
npm --version      # Deve estar instalado

# (Opcional) Para usar pnpm
npm install -g pnpm
pnpm --version
```

---

## 🚀 Primeiro Setup (Do Zero)

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/imestredigital.git
cd imestredigital
```

### Passo 2: Instalar Dependências do Monorepo

```bash
npm install
```

Isso instalará todas as dependências da raiz, apps, services e packages.

### Passo 3: Configurar Variáveis de Ambiente

```bash
# Se não existir .env, copiar do exemplo
cp .env.example .env

# Abrir o arquivo e revisar as configurações
cat .env
```

**Variáveis importantes para desenvolvimento local:**

```bash
NODE_ENV=development
PORT=3000

# Banco de Dados (Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/imestredigital

# Redis (Docker)
REDIS_URL=redis://localhost:6379

# Kafka / Redpanda (Docker)
KAFKA_BROKERS=localhost:9092

# JWT
JWT_SECRET=sua-chave-secreta-aqui-trocar-em-producao
JWT_EXPIRATION=1h

# Elasticsearch (Docker)
ELASTICSEARCH_URL=http://localhost:9200

# Log
LOG_LEVEL=debug
```

### Passo 4: Subir a Infraestrutura com Docker

```bash
# Subir todos os serviços de infraestrutura
npm run docker:up

# Ou manualmente:
docker-compose -f infra/docker/docker-compose.dev.yml up -d

# Aguarde alguns segundos para os serviços iniciarem...
# Você pode monitorar os logs:
npm run docker:logs
```

**Serviços que serão iniciados:**

- **PostgreSQL** (5432) - Banco de dados principal
- **Redis** (6379) - Cache e filas
- **Redpanda** (9092) - Message broker compatível com Kafka
- **Elasticsearch** (9200) - Motor de busca
- **Kibana** (5601) - Interface do Elasticsearch
- **MinIO** (9000/9001) - Armazenamento S3 local
- **Grafana** (3030) - Dashboards e monitoramento
- **Mailpit** (1025/8025) - Captura de e-mails em desenvolvimento
- **Redpanda Console** (8080) - Interface do Redpanda

### Passo 5: Executar Setup Completo

```bash
# Script automático que:
# - Gera Prisma clients
# - Cria e migra bancos de dados
# - Prepara o ambiente
bash scripts/setup.sh
```

**O que o script faz:**

1. Instala dependências (npm install)
2. Sobe serviços Docker
3. Gera clientes Prisma para todos os 10 serviços
4. Executa migrações de banco de dados
5. Compila o frontend Next.js

### Passo 6: Popular Dados de Teste (Opcional)

```bash
# Seed com dados de demonstração
bash scripts/seed-all.sh
```

Este script popula o banco com:
- Usuários de teste
- Produtos de exemplo
- Categorias
- Clientes
- Pedidos de exemplo

---

## ▶️ Iniciar os Serviços

### Opção 1: Iniciar Tudo de Uma Vez

```bash
npm run dev
```

Isso iniciará o frontend (Next.js) e todos os 10 microserviços em paralelo usando **Turborepo**.

**Saída esperada:**

```
├─ apps/web (frontend)
├─ services/auth-service (porta 3001)
├─ services/catalog-service (porta 3010)
├─ services/inventory-service (porta 3011)
├─ services/fiscal-service (porta 3004)
├─ services/order-service (porta 3005)
├─ services/financial-service (porta 3006)
├─ services/marketplace-service (porta 3007)
├─ services/ai-service (porta 3008)
├─ services/notification-service (porta 3009)
└─ services/customer-service (porta 3012)
```

### Opção 2: Iniciar Serviços Individuais

**Terminal 1 - Frontend:**

```bash
cd apps/web
npm run dev
# Acessível em: http://localhost:3000
```

**Terminal 2 - Serviço de Autenticação:**

```bash
cd services/auth-service
npm run dev
# Acessível em: http://localhost:3001
# Swagger: http://localhost:3001/api/docs
```

**Terminal 3 - Serviço de Catálogo:**

```bash
cd services/catalog-service
npm run dev
# Swagger: http://localhost:3010/api/docs
```

**Repita o padrão para outros serviços conforme necessário.**

### Portas de Cada Serviço

| Serviço | Porto | Swagger | Descrição |
|---------|-------|---------|-----------|
| **Frontend (Web)** | 3000 | - | Interface web Next.js |
| **Auth Service** | 3001 | `/api/docs` | Autenticação e autorização |
| **Catalog Service** | 3010 | `/api/docs` | Gerenciamento de produtos |
| **Inventory Service** | 3011 | `/api/docs` | Controle de estoque |
| **Fiscal Service** | 3004 | `/api/docs` | Integração SEFAZ/NF-e |
| **Order Service** | 3005 | `/api/docs` | Processamento de pedidos |
| **Financial Service** | 3006 | `/api/docs` | Contabilidade e financeiro |
| **Marketplace Service** | 3007 | `/api/docs` | Integração com marketplaces |
| **AI Service** | 3008 | `/api/docs` | IA e análises inteligentes |
| **Notification Service** | 3009 | `/api/docs` | Notificações e e-mails |
| **Customer Service** | 3012 | `/api/docs` | CRM e relacionamento |

### Serviços de Infraestrutura (Docker)

| Serviço | Porto | URL |
|---------|-------|-----|
| **PostgreSQL** | 5432 | `postgresql://localhost:5432` |
| **Redis** | 6379 | `redis://localhost:6379` |
| **Redpanda (Kafka)** | 9092 | `localhost:9092` |
| **Elasticsearch** | 9200 | `http://localhost:9200` |
| **Kibana** | 5601 | `http://localhost:5601` |
| **MinIO Console** | 9001 | `http://localhost:9001` |
| **Grafana** | 3030 | `http://localhost:3030` |
| **Mailpit** | 8025 | `http://localhost:8025` |
| **Redpanda Console** | 8080 | `http://localhost:8080` |

---

## ✅ Verificação Rápida

Execute estes comandos para validar que tudo está funcionando:

### 1. Verificar Docker

```bash
# Listar containers rodando
docker ps

# Verificar logs de um serviço específico
docker logs imestredigital-postgres
docker logs imestredigital-redis
docker logs imestredigital-redpanda
```

### 2. Testar Conectividade do Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -h localhost -U postgres -d imestredigital

# Se psql não estiver instalado:
docker exec -it imestredigital-postgres psql -U postgres -d imestredigital

# Listar bancos de dados:
\l

# Listar tabelas:
\dt

# Sair:
\q
```

### 3. Testar Redis

```bash
# Conectar e testar Redis
redis-cli -h localhost -p 6379

# Comandos de teste:
PING                    # Deve retornar: PONG
SET teste "valor"       # Armazenar
GET teste               # Recuperar
DEL teste               # Deletar
QUIT                    # Sair
```

### 4. Testar Elasticsearch

```bash
curl -X GET "http://localhost:9200/_cluster/health?pretty"

# Resposta esperada:
# {
#   "cluster_name" : "elasticsearch",
#   "status" : "green",
#   "timed_out" : false,
#   ...
# }
```

### 5. Testar Serviços HTTP

```bash
# Verificar saúde do Auth Service
curl -X GET "http://localhost:3001/health"

# Verificar saúde do Catalog Service
curl -X GET "http://localhost:3010/health"

# Verificar saúde do Inventory Service
curl -X GET "http://localhost:3011/health"

# Verificar saúde do Notification Service
curl -X GET "http://localhost:3009/health"

# Verificar saúde do Customer Service
curl -X GET "http://localhost:3012/health"

# Verificar saúde do Fiscal Service
curl -X GET "http://localhost:3004/health"

# Verificar saúde do Order Service
curl -X GET "http://localhost:3005/health"

# Verificar saúde do Financial Service
curl -X GET "http://localhost:3006/health"

# Verificar saúde do Marketplace Service
curl -X GET "http://localhost:3007/health"

# Verificar saúde do AI Service
curl -X GET "http://localhost:3008/health"
```

### 6. Acessar UIs Web

- Frontend: http://localhost:3000
- Redpanda Console: http://localhost:8080
- Kibana: http://localhost:5601
- Grafana: http://localhost:3030
- MinIO: http://localhost:9001
- Mailpit: http://localhost:8025

---

## 🔐 Credenciais de Teste

### Banco de Dados PostgreSQL

```
Host: localhost
Porta: 5432
Usuário: postgres
Senha: postgres
Database: imestredigital
```

**Conexão via psql:**

```bash
psql -h localhost -U postgres -d imestredigital
```

### Redis

```
Host: localhost
Porta: 6379
Sem autenticação (desenvolvimento local)
```

### MinIO (S3 Local)

```
Endpoint: http://localhost:9000
Access Key: minioadmin
Secret Key: minioadmin
Console: http://localhost:9001
```

### Grafana

```
URL: http://localhost:3030
Usuário: admin
Senha: admin
```

### Redpanda / Kafka

```
Broker: localhost:9092
Console: http://localhost:8080 (sem autenticação)
```

### JWT (Autenticação)

O secret padrão em `.env`:

```
JWT_SECRET=sua-chave-secreta-aqui-trocar-em-producao
```

**Para desenvolvimento, você pode usar este secret. Em produção, altere!**

### Usuário Admin de Teste

Após executar `bash scripts/seed-all.sh`, um usuário admin é criado:

```
Email: admin@imestredigital.com
Senha: Admin@123456
Perfil: Administrador
```

---

## 🐛 Troubleshooting Comum

### Problema: Porta Já Está em Uso

**Erro:** `EADDRINUSE: address already in use :::3001`

**Solução:**

```bash
# Encontrar qual processo está usando a porta
lsof -i :3001

# Matar o processo
kill -9 <PID>

# Ou, alterar a porta no .env
PORT=3002 npm run dev
```

### Problema: Docker Não Está Rodando

**Erro:** `Cannot connect to Docker daemon`

**Solução:**

1. Abra o Docker Desktop
2. Verifique se o Docker está inicializado:

```bash
docker ps

# Se falhar, reinicie o Docker
```

### Problema: Prisma Migration Falha

**Erro:** `Error: P1001 Can't reach database server`

**Solução:**

```bash
# 1. Verifique se o PostgreSQL está rodando
docker logs imestredigital-postgres

# 2. Se não estiver, suba novamente
npm run docker:up

# 3. Aguarde alguns segundos
sleep 10

# 4. Tente a migração novamente
cd services/auth-service
npx prisma migrate dev --name init
```

### Problema: Versão Node.js Incorreta

**Erro:** `The engine "node" is incompatible with this module`

**Solução:**

```bash
# Verificar versão atual
node --version

# Usar a versão correta (20+)
nvm use 20

# Ou instalar
nvm install 20

# Remover node_modules e reinstalar
rm -rf node_modules
npm install
```

### Problema: Redpanda/Kafka Não Conecta

**Erro:** `Failed to connect to Kafka broker`

**Solução:**

```bash
# 1. Verificar se Redpanda está saudável
docker logs imestredigital-redpanda

# 2. Aguarde até que apareça "Redpanda is ready"
# Pode levar 30-60 segundos na primeira execução

# 3. Testar conexão
curl -X GET http://localhost:9644/v1/status/ready

# 4. Se ainda falhar, reinicie
npm run docker:down
npm run docker:up
```

### Problema: Migração de Banco de Dados Não Aplica

**Erro:** `Migration already applied but prisma/migrations folder was changed`

**Solução:**

```bash
# 1. CUIDADO: Isso apaga TUDO no banco
cd services/auth-service
npx prisma migrate reset

# 2. Confirme digitando 'y'

# 3. Alternativamente, limpe manualmente e use push:
npx prisma db push
```

### Problema: Hot Reload Não Funciona

**Solução:**

1. Verifique se está usando `npm run dev` (não `npm run build`)
2. Reinicie o serviço afetado
3. Se usar WSL no Windows, mude arquivos para dentro do WSL (não `/mnt/c/...`)

### Problema: Permissão Negada ao Executar Scripts

```bash
# Dar permissão de execução
chmod +x scripts/setup.sh
chmod +x scripts/seed-all.sh

# Executar
bash scripts/setup.sh
```

### Problema: Elasticsearch Não Inicia

**Erro:** `max virtual memory areas vm.max_map_count [65530] is too low`

**Solução (Linux):**

```bash
sudo sysctl -w vm.max_map_count=262144

# Permanente, adicionar a /etc/sysctl.conf:
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
```

### Problema: Memória Insuficiente

**Erro:** `OOMKilled` ou `Killed` containers

**Solução:**

1. Abra Docker Desktop → Settings → Resources
2. Aumente CPU e RAM alocados (mínimo 4GB RAM)
3. Reinicie Docker

---

## 📁 Estrutura do Projeto

```
imestredigital/
│
├── 📂 apps/                          # Aplicações (Frontend, Mobile, Gateway)
│   ├── web/                         # Frontend Next.js (porta 3000)
│   ├── mobile/                      # App React Native (futuro)
│   └── api-gateway/                 # API Gateway (roteamento)
│
├── 📂 services/                      # Microserviços (10 serviços)
│   ├── auth-service/                # Autenticação e JWT (3001)
│   ├── catalog-service/             # Produtos e categorias (3010)
│   ├── inventory-service/           # Controle de estoque (3011)
│   ├── fiscal-service/              # Integração SEFAZ/NF-e (3004)
│   ├── order-service/               # Processamento de pedidos (3005)
│   ├── financial-service/           # Contabilidade e finanças (3006)
│   ├── marketplace-service/         # Integrações (Shopee, OLX, etc) (3007)
│   ├── ai-service/                  # IA e análises inteligentes (3008)
│   ├── notification-service/        # Notificações e e-mails (3009)
│   ├── customer-service/            # CRM e relacionamento (3012)
│   └── ai-engine/                   # Motor de IA (Python - futuro)
│
├── 📂 packages/                      # Packages Compartilhados
│   ├── types/                       # Tipos TypeScript compartilhados
│   ├── config/                      # Configurações comuns
│   ├── logger/                      # Sistema de logging
│   ├── database/                    # Configurações de banco
│   ├── events/                      # Eventos e pub/sub
│   ├── ui/                          # Componentes React reutilizáveis
│   ├── utils/                       # Funções utilitárias
│   ├── eslint-config/               # Configuração ESLint
│   └── typescript-config/           # Configuração TypeScript
│
├── 📂 infra/                         # Infraestrutura
│   └── docker/
│       ├── docker-compose.dev.yml   # Orquestração desenvolvimento
│       ├── Dockerfile.service       # Template para serviços
│       ├── Dockerfile.web           # Template para frontend
│       └── init-db.sql              # Script de inicialização
│
├── 📂 scripts/                       # Scripts de automação
│   ├── setup.sh                     # Setup inicial completo
│   └── seed-all.sh                  # Popular dados de teste
│
├── 📂 docs/                          # Documentação
│   ├── ARCHITECTURE.md              # Arquitetura geral
│   ├── DATABASE.md                  # Schema de banco de dados
│   └── API.md                       # Documentação das APIs
│
├── 📂 .github/                       # CI/CD
│   └── workflows/                   # GitHub Actions
│
├── .env.example                      # Variáveis de ambiente template
├── .nvmrc                            # Versão Node.js (20)
├── package.json                      # Root workspace
├── turbo.json                        # Config Turborepo
├── commitlint.config.js              # Git commit lint
├── .prettierrc                       # Code formatter
├── .eslintrc.js                      # Code linter
└── README.md                         # Documentação principal
```

---

## 🛠️ Comandos Úteis

### Turborepo - Executar Tarefas em Paralelo

```bash
# Iniciar desenvolvimento de todos os serviços
npm run dev

# Build de toda a aplicação
npm run build

# Executar testes
npm run test
npm run test:unit
npm run test:integration
npm run test:e2e

# Lint de código
npm run lint
npm run lint:fix

# Formatar código
npm run format
npm run format:check

# Limpar build e node_modules
npm run clean
```

### Docker - Gerenciamento de Infraestrutura

```bash
# Subir serviços
npm run docker:up

# Parar serviços
npm run docker:down

# Ver logs em tempo real
npm run docker:logs

# Logs de um serviço específico
docker logs -f imestredigital-postgres
docker logs -f imestredigital-redis
docker logs -f imestredigital-redpanda

# Acessar shell de um container
docker exec -it imestredigital-postgres /bin/sh

# Remover volumes (apaga dados!)
docker volume rm imestredigital_postgres
docker volume rm imestredigital_redis
```

### Prisma - Gerenciamento de Banco de Dados

```bash
# Executar migrações
npm run db:migrate

# Seed (popular dados)
npm run db:seed

# Abrir Prisma Studio (UI para dados)
cd services/auth-service
npx prisma studio
# Acessível em: http://localhost:5555

# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset

# Visualizar banco de dados
npx prisma db push

# Gerar cliente Prisma
npx prisma generate
```

### Desenvolvimento Individual de Serviço

```bash
# Entrar no diretório
cd services/auth-service

# Iniciar em desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm run test

# Lint
npm run lint
npm run lint:fix

# Ver variáveis de ambiente
cat .env
```

### Git Hooks e Commits

```bash
# Os commits são validados automaticamente por:
# - commitlint: Valida mensagem de commit
# - lint-staged: Lint e format antes do commit

# Commit normal (vai ser validado)
git commit -m "feat: adicionar nova funcionalidade"

# Se o hook falhar, corrija e tente novamente
git add .
git commit -m "feat: adicionar nova funcionalidade"

# Padrão de mensagens:
# feat:     Nova funcionalidade
# fix:      Correção de bug
# docs:     Documentação
# style:    Formatação
# refactor: Refatoração
# test:     Testes
# chore:    Manutenção
```

### Verificações de Saúde

```bash
# Verificar portas em uso
lsof -i :3000    # Frontend
lsof -i :3001    # Auth Service
lsof -i :5432    # PostgreSQL
lsof -i :6379    # Redis

# Listar processos Node.js
ps aux | grep node

# Matar processo por porta
kill -9 $(lsof -t -i :3001)
```

---

## 🚀 Próximos Passos para Produção

### 1. CI/CD com GitHub Actions

O projeto já possui workflows configurados em `.github/workflows/`:

```bash
# Workflows disponíveis:
# - test.yml       → Executa testes em cada PR
# - build.yml      → Build de produção
# - deploy.yml     → Deploy automático
```

**Configurar:**

1. Adicione secrets no GitHub (Settings → Secrets)
2. Configure ambientes de produção
3. Customize workflows conforme necessário

### 2. Variáveis de Ambiente para Produção

Crie um arquivo `.env.production`:

```bash
NODE_ENV=production
PORT=3000

# Banco de Dados (Usar Neon, Supabase ou RDS)
DATABASE_URL=postgresql://user:pass@prod-db.com:5432/imestredigital
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

# Redis (Usar Upstash ou ElastiCache)
REDIS_URL=redis://default:pass@prod-redis.com:6379

# Kafka (Usar Confluent Cloud ou Redpanda Cloud)
KAFKA_BROKERS=broker1.confluent.cloud:9092,broker2.confluent.cloud:9092
KAFKA_SASL_USERNAME=api_key
KAFKA_SASL_PASSWORD=api_secret

# JWT
JWT_SECRET=GERE_UMA_CHAVE_SEGURA_AQUI
JWT_EXPIRATION=24h

# IA / LLM
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# S3 Real (AWS, não MinIO local)
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=sa-east-1
STORAGE_BUCKET=imestredigital-prod

# SEFAZ
SEFAZ_AMBIENTE=producao
CERTIFICADO_DIGITAL_PATH=/caminho/certificado.pfx
CERTIFICADO_DIGITAL_SENHA=...

# Elasticsearch (Managed)
ELASTICSEARCH_URL=https://user:pass@prod-es.com:9200

# Logging
LOG_LEVEL=info
OTEL_EXPORTER_URL=https://otel.example.com
```

### 3. Opções de Hospedagem

#### Banco de Dados

- **Neon** (PostgreSQL serverless) - https://neon.tech
- **Supabase** (PostgreSQL + realtime) - https://supabase.com
- **AWS RDS** (PostgreSQL) - https://aws.amazon.com/rds/
- **Digital Ocean** (Managed Databases) - https://www.digitalocean.com/products/managed-databases/

#### Cache / Redis

- **Upstash** (Redis serverless) - https://upstash.com
- **AWS ElastiCache** - https://aws.amazon.com/elasticache/
- **Redis Cloud** - https://redis.com/cloud/

#### Message Broker / Kafka

- **Confluent Cloud** - https://www.confluent.io/cloud/
- **Redpanda Cloud** - https://redpanda.com/redpanda-cloud
- **Upstash Kafka** - https://upstash.com/kafka

#### Frontend

- **Vercel** (Recomendado para Next.js) - https://vercel.com
- **Netlify** - https://www.netlify.com/
- **AWS Amplify** - https://aws.amazon.com/amplify/

#### Backend / Microserviços

- **Railway** - https://railway.app/
- **Render** - https://render.com/
- **Fly.io** - https://fly.io/
- **AWS ECS/Fargate** - https://aws.amazon.com/ecs/
- **Google Cloud Run** - https://cloud.google.com/run
- **DigitalOcean App Platform** - https://www.digitalocean.com/products/app-platform/

#### Armazenamento (S3)

- **AWS S3** - https://aws.amazon.com/s3/
- **Cloudflare R2** - https://www.cloudflare.com/products/r2/
- **MinIO Cloud** - https://min.io/cloud

#### Observabilidade

- **Grafana Cloud** - https://grafana.com/products/cloud/
- **Datadog** - https://www.datadoghq.com/
- **New Relic** - https://newrelic.com/
- **Sentry** (Error tracking) - https://sentry.io/

### 4. Deployment com Docker

#### Build de Imagem

```bash
# Build frontend
docker build -f infra/docker/Dockerfile.web -t imestredigital-web:1.0.0 .

# Build serviço
docker build -f infra/docker/Dockerfile.service \
  --build-arg SERVICE_NAME=auth-service \
  -t imestredigital-auth-service:1.0.0 .
```

#### Push para Registry

```bash
# AWS ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker tag imestredigital-web:1.0.0 \
  123456789.dkr.ecr.us-east-1.amazonaws.com/imestredigital-web:1.0.0

docker push \
  123456789.dkr.ecr.us-east-1.amazonaws.com/imestredigital-web:1.0.0
```

### 5. Kubernetes (Opcional)

```bash
# Se usar Kubernetes, crie manifests para deployment:
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/auth-service.yaml
# ... etc
```

### 6. SSL/HTTPS

- Use **Let's Encrypt** via **Certbot** ou gerenciadores de certificado
- Cloudflare oferece SSL grátis
- AWS Certificate Manager para AWS

### 7. Monitoramento e Alertas

```bash
# Adicione ao docker-compose.prod.yml:
# - Prometheus (métricas)
# - AlertManager (alertas)
# - ELK Stack (logs centralizados)
```

### 8. Backup e Disaster Recovery

```bash
# Backup automático do banco de dados
# - AWS RDS Snapshots
# - Supabase automated backups
# - pg_dump scripts

# Backup de arquivos (S3)
# - AWS Backup
# - Backblaze B2

# Replicação geo
# - Banco multi-region
# - CDN para static assets
```

### 9. Performance e Scaling

```bash
# Cache com Redis
# - Session storage
# - Query caching
# - Rate limiting

# Load balancing
# - Nginx
# - HAProxy
# - AWS ALB / NLB

# Scaling horizontal
# - Auto-scaling groups
# - Kubernetes HPA
# - Serverless (AWS Lambda)
```

### 10. Segurança

```bash
# Checklist:
# [ ] HTTPS ativado
# [ ] JWT secrets robustos
# [ ] CORS configurado corretamente
# [ ] Rate limiting ativo
# [ ] Validação de inputs
# [ ] SQL injection protection (Prisma já faz)
# [ ] OWASP Top 10 verificado
# [ ] Secrets não commited
# [ ] WAF ativado (Cloudflare, AWS WAF)
# [ ] DDoS protection
# [ ] Audit logging
# [ ] Encryption at rest e in transit
```

---

## 📞 Suporte e Recursos

### Documentação

- **Projeto:** [README.md](./README.md)
- **Arquitetura:** `docs/ARCHITECTURE.md`
- **Banco de dados:** `docs/DATABASE.md`
- **APIs:** `docs/API.md`

### Ferramentas Importantes

- **Turborepo:** https://turbo.build/
- **Prisma:** https://www.prisma.io/
- **Next.js:** https://nextjs.org/
- **Node.js:** https://nodejs.org/
- **Docker:** https://www.docker.com/
- **TypeScript:** https://www.typescriptlang.org/

### Comunidades

- **Node.js:** https://nodejs.org/community
- **Prisma:** https://www.prisma.io/community
- **Next.js:** https://nextjs.org/community
- **TypeScript:** https://www.typescriptlang.org/community

---

## 📝 Changelog

| Versão | Data | Alterações |
|--------|------|-----------|
| 1.0.0 | Março 2026 | Guia inicial completo |

---

## 📄 Licença

Este projeto é proprietary. Todos os direitos reservados.

**Autor:** Ricardo Cavallini
**Projeto:** iMestreDigital

---

**Última atualização:** Março de 2026
**Status:** ✅ Pronto para desenvolvimento local
