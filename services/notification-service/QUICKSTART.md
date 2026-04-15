# Notification Service - Guia de Início Rápido

## Instalação (5 minutos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
```

Edite `.env` com suas configurações:
- Database: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/notification_service`
- Redis: `REDIS_HOST=localhost`, `REDIS_PORT=6379`
- Kafka: `KAFKA_BROKERS=localhost:9092`
- JWT: `JWT_SECRET=seu_secret_key`
- SMTP: Seus dados de email (Gmail, SendGrid, etc)

### 3. Preparar Banco de Dados
```bash
# Criar banco PostgreSQL
createdb notification_service

# Rodar migrations
npm run db:migrate

# Popular templates padrão
npm run db:seed
```

### 4. Iniciar em Desenvolvimento
```bash
npm run dev
```

Acesse:
- **API**: http://localhost:3009
- **Swagger**: http://localhost:3009/api/docs
- **Health**: http://localhost:3009/health

---

## Primeiros Passos

### 1. Gerar Token JWT

Assuma que você tem um token JWT válido do Auth Service com:
```json
{
  "sub": "user-id-uuid",
  "tenantId": "tenant-id-uuid",
  "email": "usuario@example.com"
}
```

### 2. Enviar um Email

```bash
curl -X POST http://localhost:3009/api/v1/email/enviar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "email": "cliente@example.com",
    "assunto": "Teste iMestreDigital",
    "corpo": "<p>Olá! Este é um email de teste.</p>"
  }'
```

Resposta:
```json
{
  "mensagemId": "email-enviado"
}
```

### 3. Criar uma Notificação

```bash
curl -X POST http://localhost:3009/api/v1/notificacoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "tipo": "EMAIL",
    "titulo": "Bem-vindo!",
    "mensagem": "Você foi cadastrado com sucesso no iMestreDigital.",
    "destinatarioEmail": "cliente@example.com",
    "prioridade": "NORMAL"
  }'
```

Resposta:
```json
{
  "id": "notification-uuid",
  "tenantId": "tenant-uuid",
  "tipo": "EMAIL",
  "titulo": "Bem-vindo!",
  "mensagem": "Você foi cadastrado com sucesso no iMestreDigital.",
  "status": "PENDENTE",
  "prioridade": "NORMAL",
  "criadoEm": "2026-03-24T12:00:00.000Z"
}
```

### 4. Listar Notificações do Usuário

```bash
curl -X GET http://localhost:3009/api/v1/notificacoes \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

Resposta:
```json
{
  "dados": [
    {
      "id": "notification-uuid",
      "tipo": "EMAIL",
      "titulo": "Bem-vindo!",
      "status": "ENVIADA",
      "criadoEm": "2026-03-24T12:00:00.000Z"
    }
  ],
  "total": 1
}
```

### 5. Contar Notificações Não Lidas

```bash
curl -X GET http://localhost:3009/api/v1/notificacoes/nao-lidas/count \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

Resposta:
```json
{
  "naoLidas": 3
}
```

### 6. Criar um Template

```bash
curl -X POST http://localhost:3009/api/v1/templates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "nome": "Pedido Confirmado",
    "slug": "pedido-confirmado",
    "tipo": "EMAIL",
    "assunto": "Pedido #{{pedidoNumero}} confirmado",
    "conteudo": "<p>Olá {{nomeCliente}},</p><p>Seu pedido foi confirmado!</p>",
    "variaveis": ["nomeCliente", "pedidoNumero"],
    "ativo": true
  }'
```

### 7. Renderizar um Template (Preview)

```bash
curl -X POST http://localhost:3009/api/v1/templates/pedido-confirmado/renderizar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "variaveis": {
      "nomeCliente": "João Silva",
      "pedidoNumero": "12345"
    }
  }'
```

Resposta:
```json
{
  "assunto": "Pedido #12345 confirmado",
  "conteudo": "<p>Olá João Silva,</p><p>Seu pedido foi confirmado!</p>"
}
```

### 8. Configurar um Webhook

```bash
curl -X POST http://localhost:3009/api/v1/webhooks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "nome": "Notificar Sistema Externo",
    "url": "https://seu-sistema.com/webhooks/notificacoes",
    "eventos": ["pedido.criado", "pedido.status.alterado"],
    "segredo": "seu-segredo-super-secreto",
    "ativo": true
  }'
```

### 9. Listar Webhooks

```bash
curl -X GET http://localhost:3009/api/v1/webhooks \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### 10. Ver Histórico de um Webhook

```bash
curl -X GET http://localhost:3009/api/v1/webhooks/webhook-uuid/historico \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

---

## Fluxos Principais

### Fluxo 1: Email Simples
```
POST /email/enviar → EmailService → SMTP → Cliente
```

### Fluxo 2: Email com Template
```
POST /email/enviar-com-template
  → Busca template no Prisma (ou cache Redis)
  → Compila Handlebars com variáveis
  → Envia via SMTP
  → Retorna messageId
```

### Fluxo 3: Notificação Central
```
POST /notificacoes
  → NotificacaoService.criarNotificacao()
  → Verifica preferências do usuário (cache)
  → Cria registro no banco (status=PENDENTE)
  → Dispara assíncrono:
    - Se EMAIL → EmailService.enviarEmail()
    - Se PUSH → PushService.enviarPush()
    - Se WEBHOOK → WebhookService.dispararWebhook()
  → Atualiza status (ENVIADA ou FALHA)
```

### Fluxo 4: Webhook com Retry
```
dispararWebhook(evento, dados)
  → Busca configurações de webhook para evento
  → Para cada webhook:
    ├── Monta payload JSON
    ├── Calcula HMAC-SHA256(payload, secret)
    ├── POST com headers incluindo assinatura
    ├── Se falha → retry com backoff: 1s → 2s → 4s
    ├── Se sucesso → reseta contador de falhas
    └── Se 5 falhas consecutivas → circuit breaker
```

### Fluxo 5: Evento Kafka
```
Kafka Topic (pedido.criado)
  → NotificacaoConsumerService.aoAoCriarPedido()
  → NotificacaoService.criarNotificacao()
  → Envia email para cliente + admin
```

---

## Testes

### Testes Unitários
```bash
npm run test:unit
```

### Testes Integração
```bash
npm run test:integration
```

### Coverage
```bash
npm run test:cov
```

---

## Desenvolvimento

### Watch Mode
```bash
npm run dev
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Database
```bash
# Ver e editar dados via web
npm run db:studio

# Rodar migration nova
npm run db:migrate

# Resetar banco (cuidado!)
npm run db:migrate:reset

# Ver logs das queries
NODE_ENV=development npm run dev  # Ativa DEBUG
```

---

## Docker

### Build
```bash
docker build -t notification-service:latest .
```

### Rodar com Compose
```bash
docker-compose up -d
```

Acessa:
- API: http://localhost:3009
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## Troubleshooting

### Erro: "Token JWT inválido"
- Verificar se o token é válido
- Certificar que JWT_SECRET está correto
- Verificar se o header Authorization está: `Bearer TOKEN`

### Erro: "SMTP não configurado"
- Verificar SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- Email funciona em mock mode em desenvolvimento (veja logs)

### Erro: "Template não encontrado"
- Rodar: `npm run db:seed` para popular templates padrão
- Ou criar novo template via API

### Erro: "Database connection refused"
- Verificar se PostgreSQL está rodando
- Verificar DATABASE_URL
- Rodar: `createdb notification_service`

### Erro: "Redis connection refused"
- Redis é opcional (usa memória)
- Se quiser Redis: rodar `redis-server`

---

## Production Checklist

- [ ] Configurar variáveis de ambiente seguras
- [ ] Usar SMTP real (não teste)
- [ ] Gerar novo JWT_SECRET forte
- [ ] Configurar Redis em produção
- [ ] Usar PostgreSQL gerenciado (AWS RDS, etc)
- [ ] Configurar Kafka em produção
- [ ] Certificados SSL/TLS
- [ ] Rate limiting
- [ ] Monitoramento e alertas
- [ ] Backups do banco
- [ ] Logs centralizados (ELK, Datadog, etc)
- [ ] Health checks
- [ ] CI/CD pipeline

---

## Próximos Passos

1. **Integrar com Auth Service**: Usar seus tokens JWT
2. **Configurar Email Real**: SMTP do seu provedor
3. **Configurar Firebase**: Para push notifications
4. **Integrar Kafka**: Com eventos dos outros serviços
5. **Adicionar Testes**: Cobertura de testes
6. **Deploy**: Docker, Kubernetes, etc

---

## Recursos Adicionais

- **Swagger**: http://localhost:3009/api/docs
- **README**: Guia completo
- **ARCHITECTURE**: Documentação técnica
- **FILES_MANIFEST**: Lista de todos os arquivos

---

## Suporte

Para dúvidas:
1. Consulte ARCHITECTURE.md
2. Veja logs da aplicação
3. Teste via Swagger
4. Entre em contato com o time

---

**Pronto? Boa sorte! 🚀**
