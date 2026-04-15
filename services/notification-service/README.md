# Notification Service - iMestreDigital

Microserviço responsável por gerenciar todas as notificações do sistema iMestreDigital. Suporta múltiplos canais (email, push, SMS, webhooks, notificações internas) e integra-se com Kafka para processar eventos de outros serviços.

## Características

- **Email**: Envio via SMTP/Nodemailer com suporte a templates Handlebars
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Webhooks**: HTTP com assinatura HMAC-SHA256, retry exponencial e circuit breaker
- **Notificações Internas**: Armazenadas no banco de dados
- **Kafka Integration**: Escuta eventos de outros serviços (pedidos, estoque, etc)
- **Multi-tenancy**: Isolamento completo de dados entre tenants
- **Cache Redis**: Melhoria de performance
- **Templates Dinâmicos**: Suporte a Handlebars com variáveis
- **Preferências de Usuário**: Controle granular de notificações

## Portas e Configuração

- **HTTP API**: Port 3009
- **Banco de Dados**: PostgreSQL (notification_service)
- **Cache**: Redis (localhost:6379)
- **Kafka**: Integração com broker local

## Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Redis
- Kafka

### Setup

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Executar migrations
npm run db:migrate

# Popular templates padrão
npm run db:seed

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm build
npm start:prod
```

## Estrutura de Diretórios

```
src/
├── main.ts                          # Ponto de entrada
├── app.module.ts                    # Módulo raiz
├── controllers/
│   └── health.controller.ts         # Health check
├── decorators/
│   └── current-user.decorator.ts    # Extração de usuário
├── guards/
│   └── auth.guard.ts                # Guard JWT
├── middleware/
│   └── tenant.middleware.ts         # Extração de tenantId
├── dtos/                            # Data Transfer Objects
│   ├── enviar-email.dto.ts
│   ├── enviar-push.dto.ts
│   ├── criar-webhook.dto.ts
│   ├── criar-notificacao.dto.ts
│   ├── criar-template.dto.ts
│   ├── filtro-notificacao.dto.ts
│   └── preferencia-notificacao.dto.ts
└── modules/
    ├── cache/                       # Cache Redis
    ├── prisma/                      # ORM Prisma
    ├── email/                       # Email SMTP
    ├── push/                        # Firebase Push
    ├── webhook/                     # HTTP Webhooks
    ├── notificacao/                 # Orquestrador Central
    ├── template/                    # Templates Handlebars
    └── kafka/                       # Consumidor Kafka

prisma/
├── schema.prisma                    # Definição de dados
└── seed.ts                          # Seeds padrão
```

## API Endpoints

### Notificações

- `POST /api/v1/notificacoes` - Cria e dispara uma notificação
- `GET /api/v1/notificacoes` - Lista notificações do usuário
- `GET /api/v1/notificacoes/nao-lidas/count` - Conta não lidas
- `PUT /api/v1/notificacoes/:id/lida` - Marca como lida
- `PUT /api/v1/notificacoes/marcar-todas-lidas` - Marca todas como lidas
- `GET /api/v1/notificacoes/preferencias` - Obtém preferências
- `PUT /api/v1/notificacoes/preferencias` - Atualiza preferências

### Email

- `POST /api/v1/email/enviar` - Envia email simples
- `POST /api/v1/email/enviar-com-template` - Envia com template
- `POST /api/v1/email/enviar-massa` - Envia em massa

### Push

- `POST /api/v1/push/enviar` - Envia push notification
- `POST /api/v1/push/registrar-dispositivo` - Registra token
- `DELETE /api/v1/push/dispositivo/:token` - Remove token
- `GET /api/v1/push/dispositivos` - Lista dispositivos

### Webhooks

- `POST /api/v1/webhooks` - Cria webhook
- `GET /api/v1/webhooks` - Lista webhooks
- `GET /api/v1/webhooks/:id` - Obtém detalhes
- `PUT /api/v1/webhooks/:id` - Atualiza webhook
- `DELETE /api/v1/webhooks/:id` - Desativa webhook
- `GET /api/v1/webhooks/:id/historico` - Histórico de envios

### Templates

- `POST /api/v1/templates` - Cria template
- `GET /api/v1/templates` - Lista templates
- `GET /api/v1/templates/:slug` - Obtém template
- `PUT /api/v1/templates/:slug` - Atualiza template
- `DELETE /api/v1/templates/:slug` - Deleta template
- `POST /api/v1/templates/:slug/renderizar` - Preview/renderizar

## Modelos de Dados

### Notificacao
- id (UUID)
- tenantId (UUID)
- tipo (EMAIL, PUSH, SMS, WEBHOOK, INTERNA)
- titulo, mensagem
- destinatarioId, destinatarioEmail
- status (PENDENTE, ENVIANDO, ENVIADA, FALHA, LIDA)
- prioridade (BAIXA, NORMAL, ALTA, URGENTE)
- metadata (JSON)
- tentativas, ultimaTentativa
- enviadaEm, lidaEm
- erroMensagem
- timestamps

### TemplateNotificacao
- id (UUID)
- tenantId (UUID)
- nome, slug
- tipo (EMAIL, PUSH, SMS, INTERNA)
- assunto, conteudo (Handlebars)
- variaveis (Array JSON)
- ativo
- timestamps

### ConfiguracaoWebhook
- id (UUID)
- tenantId (UUID)
- nome, url
- eventos (Array)
- segredo (para HMAC)
- ativo
- ultimoEnvio, falhasConsecutivas
- timestamps

### HistoricoWebhook
- id (UUID)
- tenantId, webhookId
- evento, payload (JSON)
- statusCode, resposta
- tentativa, sucesso
- timestamps

### PreferenciaNotificacao
- id (UUID)
- tenantId, usuarioId
- canal (email, push, sms, interna)
- tipoEvento
- habilitado
- timestamps

## Eventos Kafka

O serviço consome os seguintes eventos:

- `pedido.criado` → Email para cliente + admin
- `pedido.status.alterado` → Email para cliente
- `estoque.baixo` → Email para admin
- `nfe.autorizada` → Email para cliente com link PDF
- `pagamento.confirmado` → Email para cliente
- `marketplace.pergunta.recebida` → Email para vendedor
- `marketplace.pedido.importado` → Email para admin

## Templates Padrão

O seed popula os seguintes templates:

- `boas-vindas` - Bem-vindo ao sistema
- `pedido-confirmado` - Confirmação de pedido
- `nfe-autorizada` - Notificação de NFe
- `estoque-baixo` - Alerta de estoque crítico
- `recuperar-senha` - Reset de senha

## Variáveis de Ambiente

Veja `.env.example` para lista completa. Principais:

```env
PORT=3009
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/notification_service
JWT_SECRET=seu_secret_key
KAFKA_BROKERS=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
FIREBASE_PROJECT_ID=seu-projeto
FIREBASE_PRIVATE_KEY=sua_chave
WEBHOOK_RETRY_ATTEMPTS=3
```

## Desenvolvimento

### Rodando testes

```bash
npm run test
npm run test:unit
npm run test:integration
npm run test:cov
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Studio Prisma

```bash
npm run db:studio
```

## Segurança

- Todos os endpoints (exceto health) requerem JWT
- tenantId é extraído do token e validado em todas as queries
- Webhooks com HMAC-SHA256 para autenticação
- Sensível a falhas consecutivas (circuit breaker)
- Retry com backoff exponencial

## Performance

- Cache Redis para templates e preferências
- Paginação em listagens
- Índices no banco de dados
- Retry assíncrono com limite de tentativas
- TTL configurável para cache

## Monitoramento

- Logger estruturado em todos os serviços
- Health check endpoint
- Histórico de webhooks com status
- Rastreamento de erros de notificações
- Contagem de tentativas

## Troubleshooting

### Email não está sendo enviado
- Verificar SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- Checar se o email está em modo mock (logs com [MOCK])
- Verificar preferências do usuário

### Webhooks não disparam
- Verificar se webhook está ativo (ativo=true)
- Verificar se evento está na lista de eventos
- Checar histórico de webhook para status
- Verificar circuit breaker (falhasConsecutivas < limiar)

### Cache não funciona
- Verificar se Redis está rodando
- Verificar REDIS_HOST e REDIS_PORT
- Aplicação funciona sem Redis (fallback em memória)

## Suporte

Para dúvidas ou bugs, entre em contato com o time de desenvolvimento iMestreDigital.
