# Notification Service - Índice Completo

## Bem-vindo ao Notification Service do iMestreDigital!

Este é um microserviço NestJS completo e pronto para produção que gerencia todas as notificações do sistema iMestreDigital.

---

## Começar Aqui 👇

1. **[QUICKSTART.md](./QUICKSTART.md)** - Guia de 5 minutos para rodar localmente
2. **[README.md](./README.md)** - Documentação completa do serviço
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detalhes técnicos e padrões
4. **[FILES_MANIFEST.md](./FILES_MANIFEST.md)** - Descrição de todos os 52 arquivos

---

## Estrutura de Diretórios

```
notification-service/
├── src/
│   ├── main.ts                          # Ponto de entrada
│   ├── app.module.ts                    # Módulo raiz
│   │
│   ├── controllers/
│   │   └── health.controller.ts         # Health check
│   │
│   ├── guards/
│   │   └── auth.guard.ts                # JWT auth
│   │
│   ├── decorators/
│   │   └── current-user.decorator.ts    # Extração de usuário
│   │
│   ├── middleware/
│   │   └── tenant.middleware.ts         # Extração de tenantId
│   │
│   ├── dtos/                            # 7 DTOs para validação
│   │   ├── enviar-email.dto.ts
│   │   ├── enviar-push.dto.ts
│   │   ├── criar-webhook.dto.ts
│   │   ├── criar-notificacao.dto.ts
│   │   ├── criar-template.dto.ts
│   │   ├── filtro-notificacao.dto.ts
│   │   └── preferencia-notificacao.dto.ts
│   │
│   └── modules/                         # 7 módulos de feature
│       ├── cache/                       # Redis cache (global)
│       ├── prisma/                      # ORM (global)
│       ├── email/                       # Email SMTP
│       ├── push/                        # Firebase push
│       ├── webhook/                     # HTTP webhooks
│       ├── notificacao/                 # Orquestrador central
│       ├── template/                    # Templates Handlebars
│       └── kafka/                       # Kafka consumer
│
├── prisma/
│   ├── schema.prisma                    # 5 modelos de dados
│   └── seed.ts                          # 5 templates padrão
│
├── package.json
├── tsconfig.json
├── nest-cli.json
├── jest.config.js
├── .env.example
├── .env
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── Dockerfile
├── docker-compose.yml
│
├── README.md                            # Documentação principal
├── ARCHITECTURE.md                      # Padrões técnicos
├── QUICKSTART.md                        # Setup rápido
├── FILES_MANIFEST.md                    # Lista de arquivos
└── INDEX.md                             # Este arquivo
```

---

## Módulos e Funcionalidades

### 🔐 Módulo Prisma (Global)
- Gerencia conexão PostgreSQL
- Lifecycle hooks (onModuleInit, onModuleDestroy)
- Exportado globalmente

### 💾 Módulo Cache (Global)
- Redis com fallback em memória
- Métodos: obter, armazenar, remover, limpar
- TTL em segundos

### 📧 Módulo Email
**Endpoints:**
- `POST /api/v1/email/enviar` - Email simples
- `POST /api/v1/email/enviar-com-template` - Com Handlebars
- `POST /api/v1/email/enviar-massa` - Em massa

**Features:**
- SMTP/Nodemailer
- Handlebars templates
- Retry com backoff (1s → 2s → 4s)
- Mock mode para dev

### 📱 Módulo Push
**Endpoints:**
- `POST /api/v1/push/enviar` - Envio simples
- `POST /api/v1/push/registrar-dispositivo` - Registro de token
- `DELETE /api/v1/push/dispositivo/:token` - Remoção
- `GET /api/v1/push/dispositivos` - Listagem

**Features:**
- Firebase Cloud Messaging (placeholder)
- Registro de múltiplos dispositivos por usuário

### 🔗 Módulo Webhook
**Endpoints:**
- `POST /api/v1/webhooks` - Criar
- `GET /api/v1/webhooks` - Listar
- `GET /api/v1/webhooks/:id` - Obter
- `PUT /api/v1/webhooks/:id` - Atualizar
- `DELETE /api/v1/webhooks/:id` - Desativar
- `GET /api/v1/webhooks/:id/historico` - Histórico

**Features:**
- HTTP POST para URLs externas
- HMAC-SHA256 signing
- Retry exponencial
- Circuit breaker (desativa após 5 falhas)
- Histórico completo de envios

### 🔔 Módulo Notificacao (Orquestrador)
**Endpoints:**
- `POST /api/v1/notificacoes` - Criar e disparar
- `GET /api/v1/notificacoes` - Listar (com filtros)
- `GET /api/v1/notificacoes/nao-lidas/count` - Contar não lidas
- `PUT /api/v1/notificacoes/:id/lida` - Marcar como lida
- `PUT /api/v1/notificacoes/marcar-todas-lidas` - Marcar todas
- `GET /api/v1/notificacoes/preferencias` - Obter preferências
- `PUT /api/v1/notificacoes/preferencias` - Atualizar preferências

**Features:**
- Orquestra notificações por canal (EMAIL, PUSH, SMS, WEBHOOK, INTERNA)
- Respeita preferências do usuário
- Cache de preferências (1h)
- Paginação e filtros
- Rastreamento de status

### 📝 Módulo Template
**Endpoints:**
- `POST /api/v1/templates` - Criar
- `GET /api/v1/templates` - Listar
- `GET /api/v1/templates/:slug` - Obter
- `PUT /api/v1/templates/:slug` - Atualizar
- `DELETE /api/v1/templates/:slug` - Deletar
- `POST /api/v1/templates/:slug/renderizar` - Preview

**Features:**
- Handlebars templates
- Variáveis customizáveis
- Cache Redis (1h)
- Validação de sintaxe
- Preview de renderização

**Templates Padrão (via seed):**
- `boas-vindas` - Bem-vindo
- `pedido-confirmado` - Confirmação de pedido
- `nfe-autorizada` - Notificação de NFe
- `estoque-baixo` - Alerta de estoque
- `recuperar-senha` - Reset de senha

### 🎯 Módulo Kafka
**Eventos Consumidos:**
- `pedido.criado` → Email para cliente + admin
- `pedido.status.alterado` → Email para cliente
- `estoque.baixo` → Email para admin
- `nfe.autorizada` → Email para cliente com PDF
- `pagamento.confirmado` → Email para cliente
- `marketplace.pergunta.recebida` → Email para vendedor
- `marketplace.pedido.importado` → Email para admin

---

## Modelos de Dados (Prisma)

### Notificacao
```
id (UUID), tenantId, tipo, titulo, mensagem,
destinatarioId, destinatarioEmail, canal, status,
prioridade, metadata, tentativas, ultimaTentativa,
enviadaEm, lidaEm, erroMensagem, timestamps
```

### TemplateNotificacao
```
id, tenantId, nome, slug, tipo, assunto, conteudo,
variaveis (JSON array), ativo, timestamps
```

### ConfiguracaoWebhook
```
id, tenantId, nome, url, eventos (array),
segredo, ativo, ultimoEnvio, falhasConsecutivas, timestamps
```

### HistoricoWebhook
```
id, tenantId, webhookId, evento, payload (JSON),
statusCode, resposta, tentativa, sucesso, timestamps
```

### PreferenciaNotificacao
```
id, tenantId, usuarioId, canal, tipoEvento,
habilitado, timestamps
```

---

## Fluxos Principais

### 1️⃣ Enviar Email Simples
```
POST /email/enviar
  ↓ EmailService.enviarEmail()
  ↓ Nodemailer SMTP
  ↓ Retorna messageId
```

### 2️⃣ Enviar Email com Template
```
POST /email/enviar-com-template
  ↓ Busca template (cache ou banco)
  ↓ Compila Handlebars
  ↓ Envia via SMTP
```

### 3️⃣ Notificação Central
```
POST /notificacoes
  ↓ Verifica preferências (cache)
  ↓ Cria registro (PENDENTE)
  ↓ Dispara assíncrono:
    ├─ EMAIL → EmailService
    ├─ PUSH → PushService
    ├─ WEBHOOK → WebhookService
    └─ INTERNA → Apenas registra
  ↓ Atualiza status (ENVIADA/FALHA)
```

### 4️⃣ Webhook com Retry
```
dispararWebhook()
  ↓ Busca configs para evento
  ↓ Para cada webhook:
    ├─ Monta payload JSON
    ├─ Calcula HMAC-SHA256
    ├─ POST com assinatura
    ├─ Retry: 1s → 2s → 4s
    └─ Circuit breaker se 5+ falhas
```

### 5️⃣ Evento Kafka
```
Kafka Topic
  ↓ NotificacaoConsumerService
  ↓ NotificacaoService.criarNotificacao()
  ↓ Dispara notificações apropriadas
```

---

## Segurança

- ✅ JWT obrigatório (exceto health)
- ✅ tenantId isolamento em todas as queries
- ✅ HMAC-SHA256 para webhooks
- ✅ Circuit breaker (desativa após 5 falhas)
- ✅ Validação de entrada (class-validator)
- ✅ Retry com backoff exponencial

---

## Performance

- ✅ Redis cache para templates e preferências
- ✅ TTL configurável por recurso
- ✅ Índices no banco de dados
- ✅ Paginação em listagens
- ✅ Connection pooling Prisma
- ✅ Retry assíncrono com limite

---

## Stack Tecnológico

**Framework**: NestJS 10.3.0
**Linguagem**: TypeScript 5.4.0
**Banco**: PostgreSQL + Prisma ORM
**Cache**: Redis
**Fila**: Kafka
**Email**: Nodemailer
**Templates**: Handlebars
**Push**: Firebase Admin SDK (placeholder)
**HTTP**: Axios
**Testing**: Jest
**API Docs**: Swagger/OpenAPI
**Linting**: ESLint
**Formatting**: Prettier

---

## Setup Rápido (5 minutos)

```bash
# 1. Instalar
npm install

# 2. Configurar
cp .env.example .env
# Editar .env

# 3. Database
npm run db:migrate
npm run db:seed

# 4. Rodar
npm run dev

# 5. Acessar
# API: http://localhost:3009
# Swagger: http://localhost:3009/api/docs
```

---

## Scripts NPM

```bash
npm run dev              # Watch mode
npm run build            # Build para prod
npm start                # Rodar dist/main
npm run test             # Jest tests
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:cov         # Coverage report
npm run lint             # ESLint
npm run lint:fix         # ESLint + fix
npm run clean            # Remove dist/
npm run db:migrate       # Prisma migrate
npm run db:seed          # Populate templates
npm run db:studio        # Prisma Studio
```

---

## Docker

```bash
# Build
docker build -t notification-service .

# Rodar com compose
docker-compose up -d

# Acessar
# API: http://localhost:3009
# PG: localhost:5432
# Redis: localhost:6379
```

---

## Arquivo por Arquivo

**Contagem Total: 52 arquivos**

- **TypeScript (.ts)**: 28 arquivos (~2.800 linhas)
- **Config (.json, .js)**: 6 arquivos (~400 linhas)
- **Documentação (.md)**: 5 arquivos (~1.500 linhas)
- **Variáveis de Ambiente**: 2 arquivos
- **Docker**: 2 arquivos
- **Misc**: 9 arquivos

Veja [FILES_MANIFEST.md](./FILES_MANIFEST.md) para lista completa com descrições.

---

## Documentação

| Documento | Propósito |
|-----------|----------|
| [QUICKSTART.md](./QUICKSTART.md) | Setup em 5 minutos + exemplos práticos |
| [README.md](./README.md) | Documentação completa do serviço |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Padrões técnicos, fluxos, segurança |
| [FILES_MANIFEST.md](./FILES_MANIFEST.md) | Descrição de todos os 52 arquivos |
| [INDEX.md](./INDEX.md) | Este arquivo - Índice visual |

---

## Diagrama de Dependências

```
┌─────────────────────────────────────────┐
│           HTTP Clients                   │
│  (Email, Push, Webhooks, Templates)      │
└────────────────┬────────────────────────┘
                 │
        ┌────────▼────────┐
        │   Controllers   │ (Auth Guard + Validation)
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │   Services      │ (Business Logic)
        │ ┌─────────────┐ │
        │ │ Notificacao │ (Orquestrador)
        │ │   Email     │
        │ │   Push      │
        │ │   Webhook   │
        │ │   Template  │
        │ └─────────────┘
        └────────┬────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
  ┌─▼──┐     ┌──▼──┐     ┌──▼────┐
  │ DB │     │Cache│     │Kafka  │
  └────┘     └─────┘     └───────┘
 Postgres    Redis       Consumer
```

---

## Próximas Etapas

1. **Ler [QUICKSTART.md](./QUICKSTART.md)** - Rodar localmente
2. **Explorar [README.md](./README.md)** - Entender as APIs
3. **Estudar [ARCHITECTURE.md](./ARCHITECTURE.md)** - Padrões técnicos
4. **Verificar [FILES_MANIFEST.md](./FILES_MANIFEST.md)** - Estrutura completa
5. **Integrar com Auth Service** - Usar tokens JWT reais
6. **Configurar Email** - SMTP do seu provedor
7. **Adicionar Testes** - Cobertura de testes
8. **Deploy** - Docker, Kubernetes, etc

---

## Contato e Suporte

Para dúvidas:
1. Consulte a documentação acima
2. Veja os logs e erros
3. Teste via Swagger (http://localhost:3009/api/docs)
4. Entre em contato com o time iMestreDigital

---

## Status

- ✅ NestJS com TypeScript
- ✅ Multi-tenancy com isolamento
- ✅ Prisma ORM + PostgreSQL
- ✅ Redis cache com fallback
- ✅ Kafka integration
- ✅ Email via SMTP/Nodemailer
- ✅ Push via Firebase (placeholder)
- ✅ Webhooks com HMAC + retry
- ✅ Templates com Handlebars
- ✅ JWT authentication
- ✅ Swagger/OpenAPI docs
- ✅ Docker + docker-compose
- ✅ Logging estruturado
- ✅ Error handling completo
- ✅ Documentação completa (PT-BR)
- ✅ 52 arquivos prontos para produção

---

**Pronto para usar! 🚀**

Comece pelo [QUICKSTART.md](./QUICKSTART.md) →
