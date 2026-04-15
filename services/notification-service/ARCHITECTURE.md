# Arquitetura - Notification Service

## Visão Geral

O Notification Service é um microserviço NestJS que orquestra notificações através de múltiplos canais (email, push, SMS, webhooks, internas). É responsável por:

1. Fornecer APIs HTTP para gerenciamento de notificações
2. Ouvir eventos Kafka de outros serviços
3. Gerenciar templates de notificações
4. Disparar webhooks para sistemas externos
5. Respeitar preferências de usuário

## Padrões Arquiteturais

### Multi-tenancy

Cada tabela possui `tenantId` para isolamento completo de dados:
- Queries filtram automaticamente por `tenantId`
- JWT middleware extrai tenantId do token
- Índices em `tenantId` para performance

### Segurança

- **JWT**: Todos os endpoints autenticados requerem token JWT válido
- **HMAC-SHA256**: Webhooks assinados com segredo para validação
- **Circuit Breaker**: Webhooks são desativados após 5 falhas consecutivas
- **Retry**: Exponencial backoff com máx 3 tentativas

### Cache

- **Redis**: Cache de templates (1h), preferências (1h), contagem não-lidas (5min)
- **Fallback**: Aplicação funciona sem Redis (cache em memória)
- **TTL**: Configurável por caso de uso

### Escalabilidade

- **Stateless**: Sem estado entre requisições
- **Kafka**: Event sourcing para disparo assíncrono
- **Background Jobs**: Envio de notificações assíncrono
- **Paginação**: Listagens com limite e offset

## Fluxos de Notificação

### 1. Email via API HTTP

```
POST /email/enviar
└── EmailService.enviarEmail()
    ├── Valida SMTP config
    ├── Compila template (se usar template)
    ├── Envia via Nodemailer
    └── Registra status no banco
```

### 2. Notificação Central (Orquestrador)

```
POST /notificacoes
└── NotificacaoService.criarNotificacao()
    ├── Verifica preferências do usuário
    ├── Cria registro no banco (status=PENDENTE)
    ├── Dispara assíncrono via dispararNotificacao()
    │   ├── Se EMAIL → EmailService
    │   ├── Se PUSH → PushService
    │   ├── Se WEBHOOK → WebhookService
    │   └── Se INTERNA → Apenas registra
    └── Atualiza status (ENVIADA ou FALHA)
```

### 3. Webhook com Retry

```
WebhookService.dispararWebhook()
├── Busca webhooks para o evento
├── Para cada webhook:
│   ├── Monta payload JSON
│   ├── Calcula assinatura HMAC-SHA256
│   ├── POST para URL com retry exponencial
│   ├── Se sucesso → reseta falhasConsecutivas
│   └── Se falha → incrementa falhasConsecutivas
│       └── Se >= 5 → circuit breaker
└── Registra tentativa no histórico
```

### 4. Kafka Event Consumer

```
Kafka Consumer
├── pedido.criado → Email para cliente + admin
├── pedido.status.alterado → Email para cliente
├── estoque.baixo → Email para admin
├── nfe.autorizada → Email para cliente com PDF
├── pagamento.confirmado → Email para cliente
├── marketplace.pergunta.recebida → Email para vendedor
└── marketplace.pedido.importado → Email para admin
    └── Chama NotificacaoService.criarNotificacao()
```

## Estrutura de Dados

### Notificacao (Tabela)
- Rastreia cada notificação enviada
- Status: PENDENTE → ENVIANDO → ENVIADA/FALHA/LIDA
- Armazena metadata customizada (JSON)
- Índices: tenantId, destinatarioId, status, tipo

### TemplateNotificacao (Tabela)
- Templates reutilizáveis com Handlebars
- Variáveis esperadas (array JSON)
- Cache Redis para acesso frequente
- Unique: (tenantId, slug)

### ConfiguracaoWebhook (Tabela)
- Configurações de webhooks externos
- Lista de eventos para disparar
- Segredo para HMAC (opcional)
- Circuit breaker: falhasConsecutivas

### HistoricoWebhook (Tabela)
- Auditoria de cada tentativa de webhook
- Payload enviado (JSON)
- Status HTTP e resposta
- Marca sucesso/falha

### PreferenciaNotificacao (Tabela)
- Granular: por usuário, canal, tipoEvento
- Cache Redis por (tenantId, usuarioId, tipoEvento)
- Unique: (tenantId, usuarioId, canal, tipoEvento)

## Módulos

### PrismaModule (Global)
- Gerencia conexão com PostgreSQL
- Exportado globalmente para todos os módulos
- Transações suportadas

### CacheServiceModule (Global)
- Wrapper Redis com fallback em memória
- Métodos: obter, armazenar, remover, limpar
- TTL em segundos

### EmailModule
- Nodemailer para SMTP
- Suporte a Handlebars
- Retry com backoff exponencial
- Mock mode para desenvolvimento

### PushModule
- Firebase Cloud Messaging (placeholder)
- Registro/remoção de tokens de dispositivo
- Envio em massa

### WebhookModule
- HTTP POST com HMAC-SHA256
- Retry exponencial
- Circuit breaker automático
- Histórico completo

### NotificacaoModule
- Orquestrador central
- Verifica preferências
- Dispara via canal apropriado
- Rastreamento completo

### TemplateModule
- CRUD de templates
- Compilação Handlebars validada
- Cache Redis
- Preview/renderização

### KafkaModule
- Consumer para eventos de outros serviços
- Processa 7 tipos de eventos diferentes
- Chama NotificacaoService para disparar

## Dependências Externas

### Banco de Dados
- PostgreSQL 12+
- Prisma ORM
- Connection pooling automático

### Cache
- Redis 6+ (opcional, fallback em memória)
- TTL configurável

### Fila de Mensagens
- Kafka (opcional, para Kafka Consumer)
- Topics esperados dos outros serviços

### Email
- SMTP (Gmail, Sendgrid, etc)
- Nodemailer

### Push
- Firebase Admin SDK (placeholder para FCM)

### HTTP Webhooks
- Axios para HTTP
- Crypto para HMAC-SHA256

## Estratégia de Retry

### Email
- Max 3 tentativas
- Backoff: 1s → 2s → 4s
- Registra erro após falhas

### Webhook
- Max 3 tentativas por tentativa individual
- Backoff: 1s → 2s → 4s
- FalhasConsecutivas ++
- Se >= 5 → circuit breaker (pausa)

### Push
- Simples: 1 tentativa
- Erro apenas registrado

## Segurança

### Autenticação
- JWT obrigatório (exceto health)
- Extração de tenantId do token
- Validação em middleware

### Autorização
- tenantId validado em todas as queries
- Usuário só vê suas próprias notificações
- Admin pode gerenciar webhooks/templates

### Assinatura Webhook
- HMAC-SHA256(payload, secret)
- Validação opcional (se secret fornecido)
- Header: X-Webhook-Signature: sha256=<hash>

## Performance

### Índices
```sql
CREATE INDEX notificacoes_tenant_id ON notificacoes(tenant_id);
CREATE INDEX notificacoes_destinatario_id ON notificacoes(destinatario_id);
CREATE INDEX notificacoes_status ON notificacoes(status);
CREATE INDEX notificacoes_tipo ON notificacoes(tipo);
```

### Cache
- Templates: 1 hora (alto volume)
- Preferências: 1 hora (estável)
- Contagem não-lidas: 5 minutos (volátil)

### Conexão DB
- Pool automático do Prisma
- Connection reuse

### Paginação
- Padrão: página 1, limite 20
- Máximo: 100 itens por página

## Monitoramento

### Logs
- Logger NestJS estruturado
- Todos os erros registrados
- Eventos importantes rastreados

### Métricas
- FalhasConsecutivas em webhooks
- tentativas em notificações
- Statuscode em histórico

### Health Check
- `/health` - Ping ao banco de dados

## Operações

### Deployment
- Docker multi-stage
- Environment variables via .env
- Health check built-in

### Database
- Migrations via Prisma
- Seeds via `npm run db:seed`
- Studio via `npm run db:studio`

### Desenvolvimento
- Watch mode: `npm run dev`
- Tests: `npm run test`
- Lint: `npm run lint`

## Limitações Conhecidas

1. **Firebase**: Placeholder, requer implementação real com Admin SDK
2. **SMS**: Placeholder, requer integração Twilio
3. **Rate Limiting**: Não implementado, considerar adicionar
4. **Event Sourcing**: Kafka é consumer, não produtor
5. **Escalabilidade**: Webhook sync, considerar async worker

## Melhorias Futuras

1. Fila de jobs (Bull, RabbitMQ) para envios assíncrono
2. Rate limiting por tenant
3. WebSocket para notificações em tempo real
4. Batch processing para envios em massa
5. Machine learning para otimizar timing de envios
6. A/B testing de templates
7. Analytics de open/click rates
8. SMS real via Twilio
9. WhatsApp notifications
10. Telegram notifications

## Convenções de Código

### Nomenclatura (PT-BR)
- Classes, métodos, variáveis em português
- Nomes descritivos: `enviarNotificacao`, não `send`
- Nomes de propriedades: `criadoEm`, não `createdAt`

### Estrutura
- Um serviço por canal/domínio
- Controllers thin, lógica em services
- DTOs para validação de entrada
- Erros descritivos com throw

### Async/Await
- Preferível promises (tudo é async)
- Try/catch para erros
- Logger em todos os catch

### Database
- Always query by tenantId
- Use Prisma, não SQL raw
- Índices em foreign keys
