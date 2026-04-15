# Marketplace Service - iMestreDigital

Serviço de integração com os principais marketplaces brasileiros (Mercado Livre, Shopee, Amazon BR, Magalu, Americanas) para sincronização de produtos, pedidos e dados comerciais.

## Arquitetura

```
marketplace-service/
├── src/
│   ├── main.ts                           # Entrada da aplicação
│   ├── app.module.ts                     # Módulo raiz
│   ├── config/
│   │   └── kafka.config.ts              # Configuração de eventos
│   ├── dtos/                             # Objetos de transferência de dados
│   ├── middlewares/
│   │   └── tenant.middleware.ts          # Validação de tenant
│   ├── modules/
│   │   ├── health/                       # Health check
│   │   ├── prisma/                       # Cliente de banco de dados
│   │   ├── cache/                        # Redis cache
│   │   ├── eventos/                      # Produtor e consumidor Kafka
│   │   ├── integracao/                   # Adapters dos marketplaces
│   │   ├── conta-marketplace/            # Autenticação com marketplaces
│   │   ├── anuncio/                      # Gerenciamento de anúncios
│   │   ├── pedido-marketplace/           # Importação de pedidos
│   │   ├── pergunta/                     # Gestão de perguntas
│   │   └── sincronizacao/                # Orquestração de sincronizações
│   └── prisma/
│       └── schema.prisma                 # Schema do banco
└── package.json
```

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Kafka/Redpanda (para eventos)

## Instalação

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Popul banco com dados iniciais (opcional)
npm run db:seed
```

## Variáveis de Ambiente

Veja `.env.example`:

```env
# Servidor
NODE_ENV=development
PORT=3007

# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/marketplace_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka
KAFKA_BROKERS=localhost:9092

# Mercado Livre
MERCADO_LIVRE_CLIENT_ID=seu_client_id
MERCADO_LIVRE_CLIENT_SECRET=seu_client_secret

# Shopee
SHOPEE_PARTNER_ID=seu_partner_id
SHOPEE_PARTNER_KEY=sua_partner_key

# Amazon
AMAZON_SELLER_ID=seu_seller_id
AMAZON_AWS_ACCESS_KEY=sua_access_key
AMAZON_AWS_SECRET_KEY=sua_secret_key

# Magalu & Americanas
MAGALU_API_KEY=sua_api_key
AMERICANAS_API_KEY=sua_api_key
```

## Executando

### Desenvolvimento

```bash
npm run dev
```

Acesse Swagger em: http://localhost:3007/api/docs

### Produção

```bash
npm run build
npm start
```

## API Endpoints

### Contas Marketplace

```bash
# Listar contas
GET /api/v1/contas

# Conectar nova conta
POST /api/v1/contas
Body: {
  "marketplace": "MERCADO_LIVRE",
  "code": "TG-xxxxx",
  "sellerId": "123456"
}

# Detalhes da conta
GET /api/v1/contas/:id

# Status da conta
GET /api/v1/contas/:id/status

# Renovar token
POST /api/v1/contas/:id/renovar-token

# Desconectar
DELETE /api/v1/contas/:id
```

### Anúncios

```bash
# Listar anúncios
GET /api/v1/anuncios?marketplace=MERCADO_LIVRE&status=ATIVO

# Criar anúncio
POST /api/v1/anuncios
Body: {
  "contaMarketplaceId": "...",
  "produtoId": "...",
  "titulo": "...",
  "descricao": "...",
  "preco": 99.99,
  "estoque": 100,
  "categoria": "...",
  "fotos": ["..."]
}

# Detalhes
GET /api/v1/anuncios/:id

# Pausar
POST /api/v1/anuncios/:id/pausar

# Reativar
POST /api/v1/anuncios/:id/reativar

# Encerrar
POST /api/v1/anuncios/:id/encerrar
```

### Pedidos

```bash
# Listar pedidos
GET /api/v1/pedidos?marketplace=MERCADO_LIVRE

# Detalhes
GET /api/v1/pedidos/:id

# Enviar rastreio
POST /api/v1/pedidos/:id/rastreio
Body: { "codigoRastreio": "BR123456789BR" }
```

### Perguntas

```bash
# Listar perguntas
GET /api/v1/perguntas?status=PENDENTE

# Responder
POST /api/v1/perguntas/:id/responder
Body: { "resposta": "Sim, temos em estoque..." }
```

### Sincronização

```bash
# Sincronizar tudo
POST /api/v1/sincronizar
Body: {
  "contaMarketplaceId": "...",
  "tipo": "TUDO"
}

# Histórico
GET /api/v1/sincronizar/historico
```

## Tópicos Kafka

### Produzidos pelo Marketplace Service

- `marketplace-pedido-recebido` - Novo pedido recebido
- `marketplace-anuncio-criado` - Novo anúncio criado
- `marketplace-anuncio-atualizado` - Anúncio atualizado
- `marketplace-estoque-sincronizado` - Estoque sincronizado
- `marketplace-preco-sincronizado` - Preço sincronizado
- `marketplace-pergunta-recebida` - Nova pergunta recebida
- `marketplace-conta-conectada` - Conta conectada
- `marketplace-conta-desconectada` - Conta desconectada

### Consumidos

- `produto-criado` - Novo produto no catálogo
- `produto-atualizado` - Produto atualizado
- `estoque-atualizado` - Estoque atualizado
- `preco-alterado` - Preço alterado
- `pedido-enviado` - Pedido pronto para envio
- `pedido-cancelado` - Pedido cancelado

## Multi-tenancy

Todos os endpoints exigem o header `x-tenant-id`:

```bash
curl -H "x-tenant-id: tenant-123" http://localhost:3007/api/v1/contas
```

## Adapters (Marketplaces)

### Implementados

1. **Mercado Livre** - OAuth2 completo + API v2
2. **Shopee** - Partner Key + HMAC-SHA256
3. **Amazon** - SP-API + AWS IAM
4. **Magalu** - API v2
5. **Americanas** - API v2 B2W

Todos seguem a interface `IIntegracaoMarketplace`.

### Factory Pattern

Use a factory para obter o adapter correto:

```typescript
const adapter = this.integracaoFactory.criar(TipoMarketplace.MERCADO_LIVRE);
await adapter.criarAnuncio(dados);
```

## Cache

Redis é usado para:

- Tokens de autenticação
- Configurações de conta
- Métricas de anúncios
- Locks de sincronização

## Tratamento de Erros

Sincronizações com falha são armazenadas em `SincronizacaoLog` com:
- Status (SUCESSO/ERRO/PARCIAL)
- Detalhes do erro
- Registros processados/falhados
- Timestamps

## Testes

```bash
# Testes unitários
npm run test

# Cobertura
npm run test:cov
```

## Linting

```bash
npm run lint
npm run format
```

## Deployment

### Docker

```bash
docker build -t marketplace-service .
docker run -e DATABASE_URL=... -p 3007:3007 marketplace-service
```

### Kubernetes

```bash
kubectl apply -f k8s/
```

## Roadmap

- [ ] Suportar mais marketplaces
- [ ] Integração com IA para sugestão de respostas
- [ ] Dashboard de métricas
- [ ] Sincronização em tempo real (WebSocket)
- [ ] Bulk operations
- [ ] Simulação de preços competitivos

## Documentação da API

Swagger disponível em: `/api/docs`

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

## Licença

Propriedade do iMestreDigital
