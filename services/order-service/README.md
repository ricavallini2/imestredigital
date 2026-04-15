# Order Service (OMS) - iMestreDigital

Microserviço completo de gestão de pedidos omnichannel para o iMestreDigital.

## Características

- **Criação de Pedidos**: Suporta múltiplas origens (marketplace, e-commerce, loja física, manual)
- **Workflow Completo**: RASCUNHO → PENDENTE → CONFIRMADO → SEPARANDO → SEPARADO → FATURADO → ENVIADO → ENTREGUE
- **Máquina de Estados**: Validação de transições permitidas entre status
- **Histórico Auditável**: Registro de todas as mudanças de status
- **Gestão de Pagamentos**: Integração com payment-service e gateways
- **Devoluções e Reembolsos**: Workflow completo de devolução
- **Rastreamento**: Integração com transportadoras
- **Multi-tenancy**: Isolamento completo de dados por tenant
- **Cache Redis**: Cache distribuído para consultas frequentes
- **Eventos Kafka**: Integração event-driven com outros serviços

## Estrutura do Projeto

```
order-service/
├── prisma/
│   └── schema.prisma          # Modelos Pedido, Pagamento, Devolução, etc
├── src/
│   ├── main.ts                # Entry point (porta 3005)
│   ├── app.module.ts          # Módulo raiz
│   ├── config/
│   │   └── kafka.config.ts    # Definição de tópicos Kafka
│   ├── controllers/
│   │   └── health.controller.ts
│   ├── middlewares/
│   │   └── tenant.middleware.ts
│   ├── dtos/                  # Data Transfer Objects
│   │   ├── criar-pedido.dto.ts
│   │   ├── filtro-pedido.dto.ts
│   │   ├── pagamento.dto.ts
│   │   ├── devolucao.dto.ts
│   │   ├── cancelar-pedido.dto.ts
│   │   ├── enviar-pedido.dto.ts
│   │   ├── calcular-frete.dto.ts
│   │   └── estatisticas-pedido.dto.ts
│   └── modules/
│       ├── prisma/           # ORM Prisma
│       ├── cache/            # Redis
│       ├── eventos/          # Kafka Producer/Consumer
│       │   ├── produtor-eventos.service.ts
│       │   └── consumidor-eventos.controller.ts
│       ├── pedido/           # Módulo principal de pedidos
│       │   ├── pedido.service.ts
│       │   ├── pedido.controller.ts
│       │   ├── pedido.repository.ts
│       │   └── pedido.module.ts
│       ├── pagamento/        # Gestão de pagamentos
│       ├── devolucao/        # Gestão de devoluções
│       └── cache/            # Cache Redis
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env.example
```

## API Endpoints

### Pedidos
- `POST /api/v1/pedidos` - Criar pedido
- `GET /api/v1/pedidos` - Listar pedidos (com filtros)
- `GET /api/v1/pedidos/:id` - Buscar pedido
- `PATCH /api/v1/pedidos/:id/confirmar` - Confirmar pedido
- `PATCH /api/v1/pedidos/:id/separando` - Iniciar separação
- `PATCH /api/v1/pedidos/:id/separado` - Finalizar separação
- `PATCH /api/v1/pedidos/:id/faturar` - Faturar (envia ao fiscal-service)
- `PATCH /api/v1/pedidos/:id/enviar` - Enviar com rastreamento
- `PATCH /api/v1/pedidos/:id/entregar` - Marcar como entregue
- `DELETE /api/v1/pedidos/:id/cancelar` - Cancelar pedido
- `PATCH /api/v1/pedidos/:id/rastreio` - Atualizar rastreamento

### Pagamentos
- `POST /api/v1/pagamentos/pedido/:pedidoId` - Registrar pagamento
- `GET /api/v1/pagamentos` - Listar pagamentos
- `GET /api/v1/pagamentos/pedido/:pedidoId` - Pagamentos do pedido
- `PATCH /api/v1/pagamentos/:id/estornar` - Estornar pagamento
- `POST /api/v1/pagamentos/webhook/:gateway` - Webhook do gateway

### Devoluções
- `POST /api/v1/devolucoes/pedido/:pedidoId` - Solicitar devolução
- `GET /api/v1/devolucoes` - Listar devoluções
- `GET /api/v1/devolucoes/pedido/:pedidoId` - Devoluções do pedido
- `PATCH /api/v1/devolucoes/:id/aprovar` - Aprovar devolução
- `PATCH /api/v1/devolucoes/:id/receber` - Receber devolução
- `PATCH /api/v1/devolucoes/:id/reembolsar` - Processar reembolso

### Frete
- `POST /api/v1/pedidos/frete/calcular` - Calcular frete

### Estatísticas
- `GET /api/v1/pedidos/estatisticas/dashboard` - KPIs do dashboard

### Health
- `GET /api/v1/health` - Health check

## Workflow de Pedido

```
RASCUNHO (criado)
    ↓
PENDENTE (aguardando confirmação)
    ↓
CONFIRMADO (cliente confirmou)
    ↓
SEPARANDO (estoque reservado)
    ↓
SEPARADO (itens separados)
    ↓
FATURADO (NF-e autorizada pelo fiscal-service)
    ↓
ENVIADO (transportadora pegou)
    ↓
ENTREGUE (cliente recebeu)

Possíveis transições em qualquer momento:
  → CANCELADO (libera estoque, reembolsa pagamento)
  → DEVOLVIDO (após ENTREGUE)
```

## Integração com Outros Serviços

### inventory-service
- Publica: `PEDIDO_CRIADO`, `PEDIDO_CANCELADO`
- Consome: `ESTOQUE_RESERVADO`, `ESTOQUE_INSUFICIENTE`

### fiscal-service
- Publica: `PEDIDO_FATURAR`
- Consome: `NOTA_AUTORIZADA`, `NOTA_CANCELADA`

### payment-service
- Consome: `PAGAMENTO_AUTORIZADO`, `PAGAMENTO_CAPTURADO`, `PAGAMENTO_RECUSADO`

### marketplace-service
- Consome: `MARKETPLACE_PEDIDO_RECEBIDO` (cria pedido automaticamente)

## Variáveis de Ambiente

```bash
PORT=3005
NODE_ENV=development
DATABASE_URL=postgresql://imestredigital:senha@localhost:5432/imestredigital_order
JWT_SECRET=seu-secret-mudar-em-producao
KAFKA_BROKERS=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
CORS_ORIGINS=http://localhost:3000
```

## Instalação e Setup

```bash
# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Rodar migrations
npm run db:migrate

# Seed (opcional)
npm run db:seed

# Desenvolviment
npm run dev

# Build
npm run build

# Produção
npm start
```

## Database

### Tabelas Principais

- `pedidos` - Pedidos com status e totais
- `itens_pedidos` - Itens de cada pedido
- `historicos_pedidos` - Auditoria de mudanças de status
- `pagamentos` - Registros de pagamento
- `devolucoes` - Solicitações de devolução
- `itens_devolucoes` - Itens específicos de devolução

## Tópicos Kafka

### Publicados
- `pedido.criado`
- `pedido.confirmado`
- `pedido.separando`
- `pedido.separado`
- `pedido.faturar` (para fiscal-service)
- `pedido.faturado`
- `pedido.enviado`
- `pedido.entregue`
- `pedido.cancelado`
- `pedido.pago`
- `devolucao.solicitada`
- `devolucao.aprovada`
- `devolucao.recebida`
- `devolucao.reembolsada`

### Consumidos
- `nota.autorizada` (de fiscal-service)
- `estoque.reservado` (de inventory-service)
- `estoque.insuficiente` (de inventory-service)
- `marketplace.pedido.recebido` (de marketplace-service)
- `pagamento.autorizado` (de payment-service)
- `pagamento.capturado` (de payment-service)
- `pagamento.recusado` (de payment-service)

## Cache Redis

Chaves usadas:

- `pedido:{tenantId}:{pedidoId}` - Pedido completo (TTL: 10min)
- `pedidos:{tenantId}:*` - Listagens de pedidos
- `pagamentos:{tenantId}:*` - Listagens de pagamentos
- `devolucoes:{tenantId}:*` - Listagens de devoluções

## Exemplo de Uso

### Criar Pedido

```bash
curl -X POST http://localhost:3005/api/v1/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token" \
  -d '{
    "clienteNome": "João Silva",
    "clienteEmail": "joao@example.com",
    "clienteCpfCnpj": "12345678901",
    "origem": "ECOMMERCE",
    "canalOrigem": "SITE",
    "itens": [
      {
        "produtoId": "prod-123",
        "sku": "SKU001",
        "titulo": "Produto Exemplo",
        "quantidade": 2,
        "valorUnitario": 100.00,
        "peso": 0.5,
        "largura": 10,
        "altura": 10,
        "comprimento": 10
      }
    ],
    "valorFrete": 50.00,
    "enderecoEntrega": {
      "cep": "12345-678",
      "rua": "Rua Exemplo",
      "numero": "123",
      "bairro": "Bairro",
      "cidade": "São Paulo",
      "uf": "SP"
    }
  }'
```

### Confirmar Pedido

```bash
curl -X PATCH http://localhost:3005/api/v1/pedidos/{pedidoId}/confirmar \
  -H "Authorization: Bearer seu-token"
```

## Testing

```bash
# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Cobertura
npm run test:cov
```

## Documentation

Swagger docs disponível em: `http://localhost:3005/api/docs`

## Contribuição

Todos os comentários e nomes em PT-BR. Seguir padrão do monorepo.

## License

iMestreDigital - Proprietary
