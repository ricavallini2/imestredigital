# Notification Service - Manifesto de Arquivos

## Configuração Raiz (Root Configuration)

### Configuração de Dependências e Build
- `package.json` - Dependências NestJS, Prisma, Nodemailer, Firebase, Axios
- `tsconfig.json` - Configuração TypeScript
- `tsconfig.build.json` - TypeScript para build (exclui testes)
- `nest-cli.json` - Configuração NestJS CLI
- `jest.config.js` - Configuração Jest para testes
- `.eslintrc.js` - Configuração ESLint
- `.prettierrc` - Configuração Prettier
- `.gitignore` - Git ignore rules

### Variáveis de Ambiente
- `.env` - Variáveis para desenvolvimento (gitignored)
- `.env.example` - Exemplo de variáveis de ambiente

### Documentação
- `README.md` - Guia de uso e quickstart
- `ARCHITECTURE.md` - Documentação da arquitetura
- `FILES_MANIFEST.md` - Este arquivo

### Docker
- `Dockerfile` - Imagem Docker multi-stage
- `docker-compose.yml` - Compose com PostgreSQL, Redis, serviço

---

## Banco de Dados (Prisma)

### Schema
- `prisma/schema.prisma` - Definição de modelos (Notificacao, TemplateNotificacao, ConfiguracaoWebhook, HistoricoWebhook, PreferenciaNotificacao)

### Seeds
- `prisma/seed.ts` - População de templates padrão (boas-vindas, pedido-confirmado, nfe-autorizada, estoque-baixo, recuperar-senha)

---

## Ponto de Entrada

### Main
- `src/main.ts` - Bootstrap da aplicação com:
  - Setup HTTP API (porta 3009)
  - Configuração Swagger
  - Validação global
  - CORS
  - Kafka microservice (híbrido)

### App Module
- `src/app.module.ts` - Módulo raiz registrando todos os módulos

---

## Middleware e Guards

### Middleware
- `src/middleware/tenant.middleware.ts` - Extração de tenantId do JWT

### Guards
- `src/guards/auth.guard.ts` - Guard JWT para autenticação

### Decorators
- `src/decorators/current-user.decorator.ts` - Decorator para extrair usuário do request

---

## Controllers

### Health Check
- `src/controllers/health.controller.ts` - Endpoint /health para health checks

---

## DTOs (Data Transfer Objects)

### Email
- `src/dtos/enviar-email.dto.ts` - DTO para envio de email simples

### Push
- `src/dtos/enviar-push.dto.ts` - DTO para envio de push notification

### Webhook
- `src/dtos/criar-webhook.dto.ts` - DTOs para criação e atualização de webhook

### Notificação
- `src/dtos/criar-notificacao.dto.ts` - DTO para criação de notificação (com enums TipoNotificacao, PrioridadeNotificacao)

### Template
- `src/dtos/criar-template.dto.ts` - DTOs para criação/atualização de template (com enum TipoTemplate)

### Filtros e Preferências
- `src/dtos/filtro-notificacao.dto.ts` - DTO para filtros de listagem (com enum StatusNotificacao)
- `src/dtos/preferencia-notificacao.dto.ts` - DTOs para gerenciamento de preferências

---

## Módulos Compartilhados (Shared)

### Prisma (Global)
- `src/modules/prisma/prisma.service.ts` - Serviço Prisma com lifecycle hooks
- `src/modules/prisma/prisma.module.ts` - Módulo global exportando PrismaService

### Cache (Global)
- `src/modules/cache/cache.service.ts` - Serviço de cache Redis com fallback
- `src/modules/cache/cache.module.ts` - Módulo global registrando cache manager

---

## Módulo de Email

### Email Module
- `src/modules/email/email.service.ts` - Serviço de envio de emails:
  - `enviarEmail()` - Email simples
  - `enviarComTemplate()` - Com Handlebars
  - `enviarEmMassa()` - Em massa
  - `enviarComRetry()` - Com retry exponencial (3 tentativas)

- `src/modules/email/email.controller.ts` - Endpoints:
  - POST /api/v1/email/enviar
  - POST /api/v1/email/enviar-com-template
  - POST /api/v1/email/enviar-massa

- `src/modules/email/email.module.ts` - Módulo registrando EmailService

---

## Módulo de Push Notifications

### Push Module
- `src/modules/push/push.service.ts` - Serviço de push notifications:
  - `enviarPush()` - Envio simples
  - `enviarPushEmMassa()` - Em massa
  - `registrarDispositivo()` - Registro de token
  - `removerDispositivo()` - Remoção de token
  - `listarDispositivosUsuario()` - Listagem de tokens

- `src/modules/push/push.controller.ts` - Endpoints:
  - POST /api/v1/push/enviar
  - POST /api/v1/push/registrar-dispositivo
  - DELETE /api/v1/push/dispositivo/:token
  - GET /api/v1/push/dispositivos

- `src/modules/push/push.module.ts` - Módulo registrando PushService

---

## Módulo de Webhooks

### Webhook Module
- `src/modules/webhook/webhook.service.ts` - Serviço de webhooks:
  - `dispararWebhook()` - Dispara eventos para URLs externas
  - `enviarComRetry()` - Retry com backoff exponencial
  - `enviarWebhookHttp()` - HTTP POST com HMAC-SHA256
  - `registrarWebhook()` - CRUD criação
  - `atualizarWebhook()` - CRUD atualização
  - `listarWebhooks()` - CRUD listagem
  - `obterWebhook()` - CRUD obtenção
  - `desativarWebhook()` - CRUD desativação
  - `obterHistoricoWebhook()` - Histórico de envios

- `src/modules/webhook/webhook.controller.ts` - Endpoints:
  - POST /api/v1/webhooks
  - GET /api/v1/webhooks
  - GET /api/v1/webhooks/:id
  - PUT /api/v1/webhooks/:id
  - DELETE /api/v1/webhooks/:id
  - GET /api/v1/webhooks/:id/historico

- `src/modules/webhook/webhook.module.ts` - Módulo registrando WebhookService

---

## Módulo de Notificações (Orquestrador Central)

### Notificacao Module
- `src/modules/notificacao/notificacao.service.ts` - Serviço central:
  - `criarNotificacao()` - Cria e dispara notificação
  - `dispararNotificacao()` - Orquestra disparo via canal apropriado
  - `verificarPreferencias()` - Valida preferências de usuário
  - `listarNotificacoes()` - Lista com filtros e paginação
  - `marcarComoLida()` - Marca uma notificação como lida
  - `marcarTodasComoLidas()` - Marca todas como lidas
  - `contarNaoLidas()` - Conta notificações não lidas (cached)
  - `obterPreferencias()` - Obtém preferências do usuário
  - `atualizarPreferencias()` - Atualiza preferências

- `src/modules/notificacao/notificacao.controller.ts` - Endpoints:
  - POST /api/v1/notificacoes
  - GET /api/v1/notificacoes
  - GET /api/v1/notificacoes/nao-lidas/count
  - PUT /api/v1/notificacoes/:id/lida
  - PUT /api/v1/notificacoes/marcar-todas-lidas
  - GET /api/v1/notificacoes/preferencias
  - PUT /api/v1/notificacoes/preferencias

- `src/modules/notificacao/notificacao.module.ts` - Módulo registrando NotificacaoService

---

## Módulo de Templates

### Template Module
- `src/modules/template/template.service.ts` - Serviço de templates:
  - `criar()` - CRUD criação com validação Handlebars
  - `listar()` - CRUD listagem
  - `buscarPorSlug()` - CRUD busca (com cache Redis)
  - `atualizar()` - CRUD atualização
  - `renderizar()` - Compila template com variáveis
  - `deletar()` - CRUD deleção

- `src/modules/template/template.controller.ts` - Endpoints:
  - POST /api/v1/templates
  - GET /api/v1/templates
  - GET /api/v1/templates/:slug
  - PUT /api/v1/templates/:slug
  - DELETE /api/v1/templates/:slug
  - POST /api/v1/templates/:slug/renderizar

- `src/modules/template/template.module.ts` - Módulo registrando TemplateService

---

## Módulo Kafka Consumer

### Kafka Module
- `src/modules/kafka/notificacao-consumer.service.ts` - Consumer de eventos:
  - `aoAoCriarPedido()` - pedido.criado
  - `aoAlterarStatusPedido()` - pedido.status.alterado
  - `aoEstoqueBaixo()` - estoque.baixo
  - `aoNfeAutorizada()` - nfe.autorizada
  - `aoPagamentoConfirmado()` - pagamento.confirmado
  - `aoMarketplacePerguntaRecebida()` - marketplace.pergunta.recebida
  - `aoMarketplacePedidoImportado()` - marketplace.pedido.importado

- `src/modules/kafka/kafka.module.ts` - Módulo registrando NotificacaoConsumerService

---

## Estatísticas

### Contagem de Arquivos
- **TypeScript (.ts)**: 28 arquivos
- **Configuração (.json, .js)**: 6 arquivos
- **Documentação (.md)**: 3 arquivos
- **Variáveis de Ambiente**: 2 arquivos
- **Docker**: 2 arquivos
- **Configuração misc** (.eslintrc, .prettierrc, .gitignore): 3 arquivos

**Total: 45 arquivos**

### Linhas de Código Aproximadas
- **Services**: ~2.800 linhas
- **Controllers**: ~1.200 linhas
- **DTOs**: ~500 linhas
- **Modules**: ~400 linhas
- **Middleware/Guards/Decorators**: ~150 linhas
- **Config**: ~400 linhas
- **Documentação**: ~1.500 linhas

**Total: ~7.000 linhas de código**

---

## Padrões de Organização

### Estrutura por Feature
```
src/modules/
├── cache/           # Serviço compartilhado
├── prisma/          # Serviço compartilhado
├── email/           # Feature module
├── push/            # Feature module
├── webhook/         # Feature module
├── notificacao/     # Feature module (orquestrador)
├── template/        # Feature module
└── kafka/           # Feature module (event consumer)
```

### Nomenclatura em PT-BR
- Classes, métodos e variáveis em português
- Nomes descritivos: `enviarNotificacao`, `verificarPreferencias`, etc
- DTOs com sufixo: `EnviarEmailDto`, `CriarWebhookDto`
- Enums maiúsculos: `TipoNotificacao`, `StatusNotificacao`

### Documentação Completa
- Comentários em PT-BR em todos os arquivos
- JSDoc em funções principais
- README com exemplos
- ARCHITECTURE com diagrama de fluxos
- DTOs com `@ApiProperty` para Swagger

---

## Dependências Principais

```json
{
  "@nestjs/common": "^10.3.0",
  "@nestjs/core": "^10.3.0",
  "@nestjs/config": "^3.2.0",
  "@nestjs/swagger": "^7.3.0",
  "@nestjs/jwt": "^10.2.0",
  "@nestjs/microservices": "^10.3.0",
  "@nestjs/cache-manager": "^2.2.0",
  "@prisma/client": "^5.13.0",
  "nodemailer": "^6.9.0",
  "handlebars": "^4.7.0",
  "firebase-admin": "^12.1.0",
  "axios": "^1.7.0",
  "kafkajs": "^2.2.0"
}
```

---

## Scripts NPM

```bash
npm run dev                # Watch mode
npm run build             # Build para produção
npm start                 # Rodá dist/main
npm run test             # Testes com Jest
npm run test:unit        # Testes unitários
npm run test:integration # Testes integração
npm run test:cov         # Coverage
npm run lint             # ESLint
npm run lint:fix         # ESLint + fix
npm run clean            # Remove dist/
npm run db:migrate       # Prisma migrate
npm run db:seed          # Popula templates padrão
npm run db:studio        # Prisma Studio web
```

---

## Setup Completo

1. Instalar dependências: `npm install`
2. Copiar .env: `cp .env.example .env`
3. Criar banco de dados PostgreSQL
4. Rodar migrations: `npm run db:migrate`
5. Popular templates: `npm run db:seed`
6. Iniciar desenvolvimento: `npm run dev`
7. Acessar Swagger: http://localhost:3009/api/docs

---

## Pronto para Produção

- Dockerfile multi-stage otimizado
- docker-compose.yml com PostgreSQL + Redis
- Health check implementado
- Error handling completo
- Logging estruturado
- Validação de entrada (class-validator)
- Autenticação JWT
- Multi-tenancy com isolamento de dados
- Cache Redis com fallback
- Retry com backoff exponencial
- Circuit breaker para webhooks
