# iMestreDigital - Customer Service (CRM)

Microserviço de gerenciamento de clientes (CRM) do iMestreDigital.

## Funcionalidades

- **Gestão de Clientes**: CRUD completo de clientes (PF/PJ) com validação de CPF/CNPJ
- **Endereços**: Múltiplos endereços por cliente (entrega, cobrança)
- **Contatos**: Gerenciamento de contatos dentro da empresa cliente
- **Interações**: Histórico completo de interações (vendas, atendimentos, reclamações, emails, etc.)
- **Segmentação**: Segmentos dinâmicos com regras personalizadas
- **Importação**: Importação em lote de clientes (CSV/XLSX)
- **Kafka**: Sincronização com eventos de pedidos, devoluções e marketplace
- **Cache**: Redis para melhor performance
- **Multi-tenancy**: Isolamento de dados por tenant via JWT

## Tecnologia

- **Framework**: NestJS 10.3
- **Banco de dados**: PostgreSQL (Prisma ORM)
- **Cache**: Redis
- **Message Broker**: Kafka
- **Autenticação**: JWT
- **Documentação**: Swagger/OpenAPI
- **TypeScript**: Tipos estáticos

## Porta

Porta padrão: **3012**

## Instalação

```bash
npm install
# ou
pnpm install
```

## Configuração

Copiar `.env` e ajustar variáveis:

```bash
cp .env .env.local
```

Variáveis essenciais:
- `PORT=3012`
- `DATABASE_URL=postgresql://...`
- `REDIS_HOST=localhost`
- `KAFKA_BROKERS=localhost:9092`
- `JWT_SECRET=seu-secret`

## Desenvolvimento

```bash
# Banco de dados
npm run db:migrate
npm run db:seed
npm run db:studio

# Aplicação
npm run dev

# Build
npm run build
npm start
```

## Documentação da API

Acesse `http://localhost:3012/api/docs` após iniciar a aplicação.

## Estrutura de Diretórios

```
src/
├── main.ts                 # Entry point
├── app.module.ts          # Root module
├── middleware/            # TenantMiddleware
├── guards/                # AuthGuard
├── utils/                 # CPF/CNPJ validation
├── dtos/                  # Data Transfer Objects
│   ├── cliente/
│   ├── endereco/
│   ├── contato/
│   ├── interacao/
│   ├── segmento/
│   └── importacao/
└── modules/
    ├── prisma/            # Banco de dados
    ├── cache/             # Redis
    ├── kafka/             # Message broker
    ├── cliente/           # Gestão de clientes
    ├── endereco/          # Endereços
    ├── contato/           # Contatos
    ├── interacao/         # Timeline de interações
    ├── segmento/          # Segmentação
    └── importacao/        # Importação em lote

prisma/
└── schema.prisma          # Esquema do banco
```

## Endpoints Principais

### Clientes
- `GET /api/v1/clientes` - Listar clientes
- `POST /api/v1/clientes` - Criar cliente
- `GET /api/v1/clientes/:id` - Obter cliente
- `PUT /api/v1/clientes/:id` - Atualizar cliente
- `DELETE /api/v1/clientes/:id` - Inativar cliente

### Endereços
- `GET /api/v1/clientes/:clienteId/enderecos`
- `POST /api/v1/clientes/:clienteId/enderecos`
- `PUT /api/v1/clientes/:clienteId/enderecos/:enderecoId`

### Contatos
- `GET /api/v1/clientes/:clienteId/contatos`
- `POST /api/v1/clientes/:clienteId/contatos`
- `PUT /api/v1/clientes/:clienteId/contatos/:contatoId`

### Interações
- `GET /api/v1/clientes/:clienteId/interacoes`
- `POST /api/v1/clientes/:clienteId/interacoes`
- `GET /api/v1/clientes/:clienteId/timeline`

### Segmentos
- `GET /api/v1/segmentos`
- `POST /api/v1/segmentos`
- `POST /api/v1/segmentos/:id/recalcular`

### Importação
- `POST /api/v1/clientes/importar`
- `GET /api/v1/clientes/importacoes`
- `GET /api/v1/clientes/importacoes/:id`

## Eventos Kafka

**Consumidor:**
- `pedido.criado` - Atualiza última compra e valor total
- `pedido.entregue` - Registra interação de venda
- `devolucao.criada` - Registra devolução e ajusta score
- `marketplace.pedido.importado` - Auto-cria cliente

## Modelos Principais

### Cliente
- id, tenantId, tipo (PF/PJ)
- CPF/CNPJ (validado, único por tenant)
- Email, telefone, celular
- Score, status, origem
- Última compra, total de compras, valor total
- Tags para categorização

### EnderecoCliente
- Tipo (entrega, cobrança, ambos)
- Logradouro, número, CEP, cidade, estado
- Padrão (sinalizador)

### ContatoCliente
- Nome, cargo, email, telefone
- Principal (sinalizador)

### InteracaoCliente
- Tipo (venda, atendimento, reclamação, devolução, etc.)
- Canal (email, telefone, whatsapp, chat, presencial, marketplace)
- Título, descrição, data
- Referência a pedido

### SegmentoCliente
- Nome, descrição
- Regras (JSON dinâmicas)
- Total de clientes

## Validações

### CPF
- 11 dígitos
- Módulo 11 (2 dígitos verificadores)
- Rejeita sequências iguais (11111111111, etc.)

### CNPJ
- 14 dígitos
- Módulo 11 (2 dígitos verificadores)
- Rejeita sequências iguais

### Email
- Formato válido
- Único por tenant

## Documentação em PT-BR

Todo código, comentários e variáveis estão em **português brasileiro** conforme requerido.

## Licença

Proprietary - iMestreDigital
